'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg,.docx';
const ACCEPTED_MIMES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function FileUploader({
  clientId,
  onUploadComplete,
}: {
  clientId: string;
  onUploadComplete: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_MIMES.includes(file.type)) {
      setError('Only PDF, PNG, JPG, and DOCX files are supported.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');

    const filePath = `${clientId}/${file.name}`;

    // Use XMLHttpRequest for progress tracking
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploading(false);
          setProgress(100);
          onUploadComplete();
        } else {
          setError('Upload failed. Please try again.');
          setUploading(false);
        }
        if (inputRef.current) inputRef.current.value = '';
      });

      xhr.addEventListener('error', () => {
        setError('Upload failed. Please try again.');
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      });

      xhr.open(
        'POST',
        `${supabaseUrl}/storage/v1/object/client-files/${filePath}`
      );
      xhr.setRequestHeader('Authorization', `Bearer ${supabaseKey}`);
      xhr.setRequestHeader('apikey', supabaseKey);
      xhr.setRequestHeader('x-upsert', 'true');
      xhr.send(file);
    } else {
      // Fallback: use Supabase JS SDK without progress
      const { error: uploadError } = await supabase.storage
        .from('client-files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
      } else {
        onUploadComplete();
      }
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="relative cursor-pointer inline-block">
        <span className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150 inline-block">
          {uploading ? `Uploading ${progress}%` : 'Upload file'}
        </span>
        <input
          ref={inputRef}
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          accept={ACCEPTED_TYPES}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </label>

      {uploading && (
        <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </div>
  );
}
