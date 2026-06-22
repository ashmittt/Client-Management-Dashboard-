'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { FileItem } from '@/types';
import FileUploader from '@/components/files/FileUploader';
import FileList from '@/components/files/FileList';
import { LineSkeleton } from '@/components/ui/LoadingSkeleton';

export default function FilesSection({ clientId }: { clientId: string }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage
      .from('client-files')
      .list(clientId, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (!error) {
      // Filter out the .emptyFolderPlaceholder file Supabase creates
      setFiles(
        (data || []).filter(
          (f) => f.name !== '.emptyFolderPlaceholder'
        ) as FileItem[]
      );
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Files
        </h3>
        <FileUploader clientId={clientId} onUploadComplete={fetchFiles} />
      </div>

      {loading ? (
        <LineSkeleton count={2} />
      ) : (
        <FileList
          files={files}
          clientId={clientId}
          onFileDeleted={fetchFiles}
        />
      )}
    </div>
  );
}
