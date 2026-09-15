"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { removePortrait, uploadPortrait } from "@/lib/actions/images";
import { exportContent, updateSiteSettings } from "@/lib/actions/settings";
import { mediaUrl } from "@/lib/supabase/env";
import { formatDate } from "@/lib/utils/format";
import type { FocusArea, SiteSettingsRow } from "@/types/database";
import { ActionButton } from "./ActionButton";
import { Button, Field, Fieldset, Input, Notice, Textarea } from "./ui";

export function SiteForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, action, pending] = useActionState(updateSiteSettings, undefined);
  const [focus, setFocus] = useState<FocusArea[]>(settings.focus_areas);
  const [highlights, setHighlights] = useState<FocusArea[]>(settings.highlights ?? []);

  return (
    <form action={action} className="flex flex-col gap-12">
      {state ? <Notice tone={state.ok ? "success" : "danger"}>{state.ok ? (state.message ?? "Saved") : state.message}</Notice> : null}

      <div className="sticky top-0 z-10 -mx-5 flex items-center justify-end border-b border-rule bg-bg/95 px-5 py-3 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>{pending ? "Saving…" : "Save site"}</Button>
      </div>

      <Fieldset legend="Identity" description="What the homepage says in the first two seconds.">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Display name" htmlFor="display_name" required><Input id="display_name" name="display_name" defaultValue={settings.display_name} required /></Field>
          <Field label="Tagline" htmlFor="tagline" help="Shown italic in the intro and in the footer."><Input id="tagline" name="tagline" defaultValue={settings.tagline} /></Field>
        </div>
        <Field label="Meta line" htmlFor="meta_line" help="Uppercase mono line. The part before the first “·” becomes the green chip in the hero.">
          <Input id="meta_line" name="meta_line" defaultValue={settings.meta_line} />
        </Field>
        <Field label="Secondary meta line" htmlFor="meta_line_secondary" help="Optional (e.g. FULL-STACK · AI · ROBOTICS · FUTURE COMMERCIAL PILOT). Shown on About.">
          <Input id="meta_line_secondary" name="meta_line_secondary" defaultValue={settings.meta_line_secondary} />
        </Field>
        <Field label="Opening statement" htmlFor="opening_statement" help="The big headline. One or two short lines.">
          <Input id="opening_statement" name="opening_statement" defaultValue={settings.opening_statement} maxLength={160} />
        </Field>
        <Field label="Intro line" htmlFor="intro_line" help="Small line under the headline.">
          <Input id="intro_line" name="intro_line" defaultValue={settings.intro_line} maxLength={200} />
        </Field>
      </Fieldset>

      <Fieldset legend="Focus areas" description="The three panels next to the intro. Keep titles short.">
        <input type="hidden" name="focus_areas" value={JSON.stringify(focus)} />
        <ul className="flex flex-col gap-3">
          {focus.map((f, i) => (
            <li key={i} className="grid gap-2 sm:grid-cols-[200px_1fr_auto]">
              <Input aria-label="Focus title" placeholder="Title" value={f.title} onChange={(e) => setFocus(focus.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} maxLength={40} />
              <Input aria-label="Focus description" placeholder="One sentence" value={f.description} onChange={(e) => setFocus(focus.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} maxLength={160} />
              <Button variant="ghost" onClick={() => setFocus(focus.filter((_, j) => j !== i))} aria-label="Remove focus area">✕</Button>
            </li>
          ))}
        </ul>
        <Button size="sm" onClick={() => setFocus([...focus, { title: "", description: "" }])} disabled={focus.length >= 4}>+ Add focus area</Button>
      </Fieldset>

      <Fieldset legend="Beyond software" description="The three highlight panels on the homepage (leadership, robotics, aviation).">
        <input type="hidden" name="highlights" value={JSON.stringify(highlights)} />
        <ul className="flex flex-col gap-3">
          {highlights.map((f, i) => (
            <li key={i} className="grid gap-2 sm:grid-cols-[200px_1fr_auto]">
              <Input aria-label="Highlight title" placeholder="Title" value={f.title} onChange={(e) => setHighlights(highlights.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} maxLength={40} />
              <Input aria-label="Highlight description" placeholder="One sentence" value={f.description} onChange={(e) => setHighlights(highlights.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} maxLength={160} />
              <Button variant="ghost" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))} aria-label="Remove highlight">✕</Button>
            </li>
          ))}
        </ul>
        <Button size="sm" onClick={() => setHighlights([...highlights, { title: "", description: "" }])} disabled={highlights.length >= 4}>+ Add highlight</Button>
      </Fieldset>

      <Fieldset legend="Bio" description="Markdown. Short bio appears on the homepage; long bio on About.">
        <Field label="Short bio (≤ 80 words)" htmlFor="bio_short_md"><Textarea id="bio_short_md" name="bio_short_md" defaultValue={settings.bio_short_md} className="min-h-32 font-mono text-[0.8125rem]" /></Field>
        <Field label="Long bio" htmlFor="bio_long_md" help="Use ## headings: Education, Leadership, Aviation, and so on."><Textarea id="bio_long_md" name="bio_long_md" defaultValue={settings.bio_long_md} className="min-h-80 font-mono text-[0.8125rem]" /></Field>
        <Field label="Now" htmlFor="now_md" help={`What you're doing right now. ${settings.now_updated_at ? `Last changed ${formatDate(settings.now_updated_at)}.` : "The date updates automatically when this changes."}`}>
          <Textarea id="now_md" name="now_md" defaultValue={settings.now_md} className="min-h-24 font-mono text-[0.8125rem]" />
        </Field>
      </Fieldset>

      <Fieldset legend="Contact & links" description="Empty links are simply not shown.">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Email" htmlFor="email" required><Input id="email" name="email" type="email" defaultValue={settings.email} required /></Field>
          <Field label="GitHub" htmlFor="github_url"><Input id="github_url" name="github_url" defaultValue={settings.github_url ?? ""} placeholder="https://github.com/…" /></Field>
          <Field label="LinkedIn" htmlFor="linkedin_url"><Input id="linkedin_url" name="linkedin_url" defaultValue={settings.linkedin_url ?? ""} placeholder="https://www.linkedin.com/in/…" /></Field>
          <Field label="Instagram" htmlFor="instagram_url"><Input id="instagram_url" name="instagram_url" defaultValue={settings.instagram_url ?? ""} placeholder="https://instagram.com/…" /></Field>
          <Field label="Location" htmlFor="location"><Input id="location" name="location" defaultValue={settings.location} /></Field>
          <Field label="Timezone" htmlFor="timezone" help="IANA name, e.g. Africa/Kigali"><Input id="timezone" name="timezone" defaultValue={settings.timezone} /></Field>
        </div>
      </Fieldset>

      <Fieldset legend="Portrait">
        <Field label="Portrait alt text" htmlFor="portrait_alt" required><Input id="portrait_alt" name="portrait_alt" defaultValue={settings.portrait_alt} required /></Field>
      </Fieldset>

      <div className="flex justify-end border-t border-rule pt-6">
        <Button type="submit" variant="primary" disabled={pending} aria-busy={pending}>{pending ? "Saving…" : "Save site"}</Button>
      </div>
    </form>
  );
}

export function PortraitSection({ settings }: { settings: SiteSettingsRow }) {
  return (
    <Fieldset legend="Portrait images" description="Colour, no filters, calm background, headroom above the head. Home crops to a rounded arch; About shows 3:4.">
      <div className="grid gap-6 sm:grid-cols-2">
        <PortraitSlot slot="home" path={settings.portrait_home_path} alt={settings.portrait_alt} label="Home portrait" hint="Portrait orientation, at least 1200×1500." />
        <PortraitSlot slot="about" path={settings.portrait_about_path} alt={settings.portrait_alt} label="About portrait" hint="3:4. Leave empty to reuse the home portrait." />
      </div>
    </Fieldset>
  );
}

function PortraitSlot({ slot, path, alt, label, hint }: { slot: "home" | "about"; path: string | null; alt: string; label: string; hint: string }) {
  const [state, action, pending] = useActionState(uploadPortrait.bind(null, slot), undefined);
  return (
    <div className="rounded-[4px] bg-bg-raised p-4">
      <p className="meta text-fg-muted">{label}</p>
      <p className="mt-1 text-xs text-fg-subtle">{hint}</p>
      {path ? (
        <div className="relative mt-3 aspect-[4/5] w-40 overflow-hidden rounded-[3px] bg-bg-sunken">
          <Image src={mediaUrl(path)} alt={alt} fill sizes="160px" className="object-cover object-top" />
        </div>
      ) : (
        <p className="meta mt-3 text-fg-subtle">None uploaded</p>
      )}
      <form action={action} className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="file"
          name="file"
          required
          accept="image/png,image/jpeg,image/webp,image/avif"
          aria-label={`${label} file`}
          className="block max-w-full text-xs text-fg-muted file:mr-2 file:rounded-[4px] file:border file:border-rule-strong file:bg-transparent file:px-2 file:py-1.5 file:font-mono file:text-[0.625rem] file:uppercase file:text-fg"
        />
        <Button type="submit" size="sm" disabled={pending}>{pending ? "Uploading…" : "Upload"}</Button>
        {path ? <ActionButton action={() => removePortrait(slot)} size="sm" variant="ghost" confirm="Remove this portrait?">Remove</ActionButton> : null}
      </form>
      {state ? <p role="status" className={`meta mt-2 ${state.ok ? "text-success" : "text-danger"}`}>{state.ok ? (state.message ?? "Uploaded") : state.message}</p> : null}
    </div>
  );
}

export function ExportButton() {
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-3">
      <ActionButton
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
      {error ? <span className="meta text-danger">{error}</span> : null}
    </div>
  );
}
