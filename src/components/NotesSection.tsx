"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function NotesSection({
  clientId,
  initialNotes,
}: {
  clientId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const lastSavedRef = useRef(initialNotes || "");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function handleBlur() {
    const trimmed = notes.trim();
    if (trimmed === lastSavedRef.current.trim()) return;

    setSaveState("saving");

    const { error } = await supabase
      .from("clients")
      .update({ notes: trimmed })
      .eq("id", clientId);

    if (!error) {
      lastSavedRef.current = trimmed;
      setSaveState("saved");

      // Clear the "Saved" indicator after 2 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setSaveState("idle"), 2000);
    } else {
      setSaveState("idle");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Notes
        </h3>
        {saveState === "saving" && (
          <span className="text-[11px] text-text-muted">Saving...</span>
        )}
        {saveState === "saved" && (
          <span className="text-[11px] text-status-active">Saved</span>
        )}
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add notes about this client..."
        rows={6}
        className="w-full bg-[#0a0a0a] border border-border px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none resize-y min-h-[120px] font-sans"
      />
    </div>
  );
}
