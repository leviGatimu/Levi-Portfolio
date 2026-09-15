"use client";

import { useState } from "react";
import { exportContent } from "@/lib/actions/settings";
import { ActionButton } from "./ActionButton";

export function ExportButton() {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-3">
      <ActionButton
        variant="primary"
        action={exportContent}
        onDone={(r) => {
          if (!r.ok) return setError(r.message);
          const blob = new Blob([r.data as string], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
      >
        Export JSON
      </ActionButton>
      {error ? <span className="text-[12px] text-red-600">{error}</span> : null}
    </div>
  );
}
