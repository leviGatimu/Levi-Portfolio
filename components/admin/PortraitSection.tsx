"use client";

import Image from "next/image";
import { useActionState } from "react";
import { removePortrait, uploadPortrait } from "@/lib/actions/images";
import { mediaUrl } from "@/lib/supabase/env";
import type { SiteSettingsRow } from "@/types/database";
import { ActionButton } from "./ActionButton";
import { Button, Card } from "./ui";

export function PortraitSection({ settings, icon }: { settings: SiteSettingsRow; icon?: React.ReactNode }) {
  return (
    <Card title="Portrait" icon={icon} subtitle="Square or portrait photo, calm background. Shown with rounded corners everywhere; the bundled photo is used until you upload one.">
      <div className="grid gap-4 sm:grid-cols-2">
        <PortraitSlot slot="home" path={settings.portrait_home_path} alt={settings.portrait_alt} label="Home and hero" hint="Square works best. At least 1000 by 1000." />
        <PortraitSlot slot="about" path={settings.portrait_about_path} alt={settings.portrait_alt} label="About page" hint="Optional. Falls back to the home portrait." />
      </div>
    </Card>
  );
}

function PortraitSlot({ slot, path, alt, label, hint }: { slot: "home" | "about"; path: string | null; alt: string; label: string; hint: string }) {
  const [state, action, pending] = useActionState(uploadPortrait.bind(null, slot), undefined);
  return (
    <div className="rounded-2xl border border-slate-200/80 p-4">
      <p className="text-[13px] font-medium text-slate-900">{label}</p>
      <p className="mt-0.5 text-[12px] text-slate-400">{hint}</p>
      <div className="mt-3 flex items-start gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <Image src={path ? mediaUrl(path) : "/portrait.png"} alt={alt} fill sizes="112px" className="object-cover" />
        </div>
        <form action={action} className="flex flex-1 flex-col gap-2">
          <input type="file" name="file" required accept="image/png,image/jpeg,image/webp,image/avif" aria-label={`${label} file`} className="block w-full text-[12px] text-slate-600 file:mr-2 file:rounded-full file:border file:border-slate-200 file:bg-white file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-slate-900" />
          <div className="flex flex-wrap gap-2">
            <Button type="submit" size="sm" variant="primary" disabled={pending}>{pending ? "Uploading" : "Upload"}</Button>
            {path ? <ActionButton action={() => removePortrait(slot)} size="sm" variant="ghost" confirm="Remove this portrait and go back to the bundled photo?">Remove</ActionButton> : null}
          </div>
          {state ? <p role="status" className={`text-[12px] ${state.ok ? "text-emerald-700" : "text-red-600"}`}>{state.ok ? (state.message ?? "Uploaded") : state.message}</p> : null}
        </form>
      </div>
    </div>
  );
}
