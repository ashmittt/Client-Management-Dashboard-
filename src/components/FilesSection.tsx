"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface FileItem {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function FilesSection({ clientId }: { clientId: string }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error: listError } = await supabase.storage
      .from("client-files")
      .list(clientId, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (listError) {
      setError(listError.message);
    } else {
      // Filter out the .emptyFolderPlaceholder file Supabase creates
      setFiles(
        (data || []).filter(
          (f) => f.name !== ".emptyFolderPlaceholder"
        ) as FileItem[]
      );
    }
    setLoading(false);
  }, [clientId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const filePath = `${clientId}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("client-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError(uploadError.message);
    } else {
      await fetchFiles();
    }

    setUploading(false);
    // Reset the input
    e.target.value = "";
  }

  function getDownloadUrl(fileName: string): string {
    const { data } = supabase.storage
      .from("client-files")
      .getPublicUrl(`${clientId}/${fileName}`);
    return data.publicUrl;
  }

  async function handleDelete(fileName: string) {
    const confirmed = window.confirm(
      `Delete "${fileName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase.storage
      .from("client-files")
      .remove([`${clientId}/${fileName}`]);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      await fetchFiles();
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Files
        </h3>
        <label className="relative cursor-pointer">
          <span className="px-3 py-1.5 text-xs font-medium text-text-secondary border border-border rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150 inline-block">
            {uploading ? "Uploading..." : "Upload file"}
          </span>
          <input
            type="file"
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </label>
      </div>

      {error && (
        <p className="text-red-400 text-xs mb-3">{error}</p>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 bg-[#0a0a0a] border border-border animate-pulse"
            />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-text-muted text-xs">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.id || file.name}
              className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#0a0a0a] border border-border hover:border-border-hover transition-colors duration-150 group"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-text-muted text-sm">📄</span>
                <div className="min-w-0">
                  <p className="text-sm text-text-primary truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {file.metadata?.size
                      ? formatFileSize(file.metadata.size)
                      : "—"}
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
      )}
    </div>
  );
}
