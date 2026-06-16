"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, ClientStatus } from "@/lib/supabase";

export default function AddClientModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Light-dismiss fallback for browsers without closedby support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const handleClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      };
      dialog.addEventListener("click", handleClick);
      return () => dialog.removeEventListener("click", handleClick);
    }
  }, []);

  function openModal() {
    dialogRef.current?.showModal();
    setError("");
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    const company = (formData.get("company") as string).trim();
    const email = (formData.get("email") as string).trim();
    const status = formData.get("status") as ClientStatus;

    if (!name) {
      setError("Client name is required");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("clients").insert({
      name,
      company,
      email,
      status,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    closeModal();
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors duration-150"
      >
        Add client
      </button>

      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="add-client-title"
        className="w-full max-w-md"
      >
        <div className="bg-surface border border-border p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 id="add-client-title" className="text-sm font-medium text-text-primary">
              Add new client
            </h2>
            <button
              type="button"
              onClick={closeModal}
              className="text-text-muted hover:text-text-secondary transition-colors duration-150 text-lg leading-none"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="client-name" className="block text-xs text-text-secondary mb-1.5">
                Name *
              </label>
              <input
                id="client-name"
                name="name"
                type="text"
                required
                placeholder="Client name"
                className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none"
              />
            </div>

            <div>
              <label htmlFor="client-company" className="block text-xs text-text-secondary mb-1.5">
                Company
              </label>
              <input
                id="client-company"
                name="company"
                type="text"
                placeholder="Company name"
                className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none"
              />
            </div>

            <div>
              <label htmlFor="client-email" className="block text-xs text-text-secondary mb-1.5">
                Email
              </label>
              <input
                id="client-email"
                name="email"
                type="email"
                placeholder="client@company.com"
                className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover transition-colors duration-150 outline-none"
              />
            </div>

            <div>
              <label htmlFor="client-status" className="block text-xs text-text-secondary mb-1.5">
                Status
              </label>
              <select
                id="client-status"
                name="status"
                defaultValue="active"
                className="w-full bg-[#0a0a0a] border border-border px-3 py-2 text-sm text-text-primary focus:border-border-hover transition-colors duration-150 outline-none appearance-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add client"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-transparent border border-border text-text-secondary text-sm rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
