'use client';

import { supabase } from '@/lib/supabase';
import { deleteFile } from '@/actions/files';
import type { FileItem } from '@/types';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function FileList({
  files,
  clientId,
  onFileDeleted,
}: {
  files: FileItem[];
  clientId: string;
  onFileDeleted: () => void;
}) {
  function getDownloadUrl(fileName: string): string {
    const { data } = supabase.storage
      .from('client-files')
      .getPublicUrl(`${clientId}/${fileName}`);
    return data.publicUrl;
  }

  async function handleDelete(fileName: string) {
    const confirmed = window.confirm(
      `Delete "${fileName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    const result = await deleteFile(clientId, fileName);
    if (!result.error) {
      onFileDeleted();
    }
  }

  if (files.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-text-muted text-xs">No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {files.map((file) => (
        <div
          key={file.id || file.name}
          className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#0a0a0a] border border-border hover:border-border-hover transition-colors duration-150 group"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="text-text-muted text-sm">📄</span>
            <div className="min-w-0">
              <p className="text-sm text-text-primary truncate">{file.name}</p>
              <p className="text-[11px] text-text-muted">
                {file.metadata?.size
                  ? formatFileSize(file.metadata.size)
                  : '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getDownloadUrl(file.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-text-muted hover:text-text-primary transition-colors duration-150"
              download
            >
              Download
            </a>
            <button
              type="button"
              onClick={() => handleDelete(file.name)}
              className="text-[11px] text-text-muted hover:text-red-400 transition-colors duration-150 opacity-0 group-hover:opacity-100"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
