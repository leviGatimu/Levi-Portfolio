import type { Metadata } from "next";
import { Clock, Copy, Mail, MapPin, MessageSquare } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/public/BrandIcons";
import ScrollReveal from "@/components/public/ScrollReveal";
import { LocalTime } from "@/components/shared/LocalTime";
import { getSiteSettings } from "@/lib/db/public";
import { formatLocalTime } from "@/lib/utils/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Levi Gatimu about projects, collaborations, internships or how something was built.",
  alternates: { canonical: "/contact" },
  openGraph: { type: "website", url: "/contact", title: "Contact · Levi Gatimu" },
};

const TOPICS = [
  { title: "A project or collaboration", text: "Something you want built, or something we could build together. Web, desktop, AI or hardware." },
  { title: "Internships and programmes", text: "Engineering placements, student programmes, or aviation-adjacent opportunities." },
  { title: "How something was built", text: "Questions about a case study, a decision, or the stack behind a project. I like these." },
];

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const socials = [
    settings.github_url ? { label: "GitHub", href: settings.github_url, icon: <GithubIcon size={18} /> } : null,
    settings.linkedin_url ? { label: "LinkedIn", href: settings.linkedin_url, icon: <LinkedinIcon size={18} /> } : null,
    settings.instagram_url ? { label: "Instagram", href: settings.instagram_url, icon: <InstagramIcon size={18} /> } : null,
  ].filter((s): s is { label: string; href: string; icon: React.ReactElement } => s !== null);

  return (
    <div className="relative">
      <div className="grain" />
      <section className="px-6 pb-16 pt-40">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-blue-400">
              <MessageSquare size={13} /> Contact
            </span>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-[0.9] tracking-tight text-slate-900 md:text-8xl dark:text-slate-50">
              Say <span className="text-blue-600 dark:text-blue-400">hello.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-relaxed text-slate-500 md:text-2xl dark:text-slate-400">
              One email address, no form, no bots. I read everything and reply to real messages.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12">
          <ScrollReveal className="lg:col-span-7">
            <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-[#0a1020] p-8 text-white md:p-12">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-300">Email</span>
              <a href={`mailto:${settings.email}`} className="mt-4 block break-all font-display text-3xl font-semibold tracking-tight hover:text-blue-300 md:text-5xl">
                {settings.email}
              </a>
              <p className="mt-4 max-w-md text-slate-400">Say what you are building or asking about and I will get back to you.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-semibold text-slate-900 transition-colors hover:bg-blue-50">
                  <Mail size={18} /> Write an email
                </a>
                <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-sm font-semibold text-slate-200">
                  <Copy size={16} className="text-blue-300" /> Or copy the address above
                </span>
              </div>
              <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 text-blue-300" />
                  <div><p className="text-sm font-semibold">{settings.location}</p><p className="text-xs text-slate-400">Central Africa Time (UTC+2)</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 text-blue-300" />
                  <div><p className="text-sm font-semibold"><LocalTime timezone={settings.timezone} initial={formatLocalTime(settings.timezone)} /> local time</p><p className="text-xs text-slate-400">Replies usually within a day or two</p></div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <ScrollReveal delay={0.08}>
              <div className="rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
                <span className="eyebrow">Elsewhere</span>
                <ul className="mt-5 space-y-3">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl border border-black/[0.06] px-4 py-3 text-slate-800 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:text-slate-100">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white dark:bg-white/10 dark:text-slate-200">{s.icon}</span>
                        <span className="font-semibold">{s.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.16}>
              <div className="rounded-[2rem] border border-black/[0.06] bg-white p-8 shadow-[0_28px_60px_-34px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-slate-900">
                <span className="eyebrow">Good reasons to write</span>
                <ul className="mt-5 space-y-5">
                  {TOPICS.map((t) => (
                    <li key={t.title}>
                      <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">{t.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
