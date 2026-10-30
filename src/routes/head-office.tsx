import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { CalendarCheck, Phone, TriangleAlert, Trophy } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { I18nProvider } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { dealerMaster } from "@/lib/dealer-master";

export const Route = createFileRoute("/head-office")({
  head: () => ({
    meta: [
      { title: "Head Office — Service Reminder Performance | Telecaller Desk" },
      { name: "description", content: "Head office view of service reminder and appointment confirmation calls across zones, regions and dealers." },
      { property: "og:title", content: "Head Office — Service Reminder Performance" },
      { property: "og:description", content: "Monitor service reminder and appointment confirmation calls by zone, region and dealer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  // Head Office is English only: pin the language for this screen and its chrome.
  component: () => (
    <I18nProvider forcedLang="en">
      <HeadOfficePage />
    </I18nProvider>
  ),
});

const L = {
  title: { en: "Service Reminder Performance", hi: "सर्विस रिमाइंडर प्रदर्शन" },
  sub: { en: "All zones, regions, areas, territories and dealers. Click a row to see the next level.", hi: "सभी ज़ोन, रीजन, एरिया, टेरिटरी और डीलर। अगला स्तर देखने के लिए पंक्ति पर क्लिक करें।" },
  zone: { en: "Zone", hi: "ज़ोन" },
  region: { en: "Region", hi: "रीजन" },
  area: { en: "Area", hi: "एरिया" },
  territory: { en: "Territory", hi: "टेरिटरी" },
  dealer: { en: "Dealer", hi: "डीलर" },
  dealerName: { en: "Dealer Name", hi: "डीलर नाम" },
  all: { en: "All", hi: "सभी" },
  total: { en: "Total", hi: "कुल" },
  sTitle: { en: "Service Reminder Calls", hi: "सर्विस रिमाइंडर कॉल" },
  aTitle: { en: "Appointment Confirmation Calls", hi: "अपॉइंटमेंट कन्फर्मेशन कॉल" },
  due: { en: "Total Calls Due (Pending + Today's)", hi: "कुल ड्यू कॉल (पेंडिंग + आज)" },
  done: { en: "Total Calls Done", hi: "कुल कॉल पूरी" },
  doneP: { en: "Calls Done %", hi: "कॉल पूरी %" },
  conn: { en: "Connected Calls", hi: "बात हुई कॉल" },
  connP: { en: "Connected %", hi: "बात हुई %" },
  created: { en: "Appointment Created", hi: "अपॉइंटमेंट बने" },
  createdP: { en: "Created %", hi: "बने %" },
  appts: { en: "Total Appointment (Today, Pending & Tomorrow)", hi: "कुल अपॉइंटमेंट (आज, पेंडिंग और कल)" },
  aDone: { en: "Calls Done", hi: "कॉल पूरी" },
  conf: { en: "Confirmation Done", hi: "कन्फर्म हुए" },
  confP: { en: "Confirmation %", hi: "कन्फर्म %" },
  canc: { en: "Cancelled", hi: "रद्द" },
  cancP: { en: "Cancelled %", hi: "रद्द %" },
  reported: { en: "Reported", hi: "रिपोर्टेड" },
  repWith: { en: "With CCE Call", hi: "CCE कॉल से" },
  repWithout: { en: "Without CCE Call", hi: "बिना CCE कॉल" },
  repP: { en: "Reported %", hi: "रिपोर्टेड %" },
  dueT: { en: "Total Calls Due", hi: "कुल ड्यू कॉल" },
  apptsT: { en: "Total Appointment", hi: "कुल अपॉइंटमेंट" },
  table: { en: "Table View", hi: "टेबल व्यू" },
  funnel: { en: "Funnel View", hi: "फ़नल व्यू" },
  scrollHint: { en: "Scroll sideways to see all columns.", hi: "सभी कॉलम देखने के लिए साइड में स्क्रॉल करें।" },
  date: { en: "Date", hi: "तारीख" },
  today: { en: "Today", hi: "आज" },
  yesterday: { en: "Yesterday", hi: "कल" },
  thisWeek: { en: "This Week", hi: "यह सप्ताह" },
  thisMonth: { en: "This Month", hi: "यह महीना" },
  topTitle: { en: "Top & Bottom Dealers (Calls Done %)", hi: "टॉप और बॉटम डीलर (कॉल पूरी %)" },
  top5: { en: "Top 5", hi: "टॉप 5" },
  bottom5: { en: "Bottom 5", hi: "बॉटम 5" },
  alertTitle: { en: "Needs Attention", hi: "ध्यान देने की ज़रूरत" },
  alertCalls: { en: "dealers below 80% calls done target", hi: "डीलर 80% कॉल पूरी टारगेट से नीचे" },
  alertConf: { en: "dealers below 60% confirmation target", hi: "डीलर 60% कन्फर्मेशन टारगेट से नीचे" },
  allGood: { en: "All dealers are on target. Great work!", hi: "सभी डीलर टारगेट पर हैं। बहुत बढ़िया!" },
  showingBelow: { en: "Showing only dealers below target", hi: "सिर्फ टारगेट से नीचे वाले डीलर दिख रहे हैं" },
  showAll: { en: "Show all", hi: "सभी दिखाएं" },
  apply: { en: "Apply Filters", hi: "फिल्टर लगू करें" },
  clear: { en: "Clear Filters", hi: "फिल्टर हटाएँ" },
  pendingChange: { en: "Filters changed — press Apply to update the numbers.", hi: "फिल्टर बदले हैं — नंबर अपडेट करने के लिए Apply दबाएँ।" },
} as const;
type K = keyof typeof L;

type Row = { zone: string; region: string; area: string; territory: string; dealer: string; dealerName: string; due: number; done: number; conn: number; created: number; appts: number; aDone: number; conf: number; canc: number; repWith: number; repWithout: number };
type Period = "today" | "yesterday" | "thisWeek" | "thisMonth";
const periodFactor: Record<Period, number> = { today: 1, yesterday: 0.94, thisWeek: 5.6, thisMonth: 23 };

// Real dealer hierarchy; calling figures are sample numbers until reporting is connected.
const makeRows = (f: number): Row[] => dealerMaster.map((d, i) => {
  const s = i + 1;
  const due = Math.round((300 + ((s * 137) % 400)) * f);
  const done = Math.round(due * (0.55 + ((s * 7) % 40) / 100));
  const conn = Math.round(done * (0.5 + ((s * 11) % 30) / 100));
  const created = Math.round(conn * (0.25 + ((s * 5) % 25) / 100));
  const appts = Math.round((80 + ((s * 53) % 120)) * f);
  const aDone = Math.round(appts * (0.6 + ((s * 3) % 35) / 100));
  const conf = Math.round(aDone * (0.5 + ((s * 13) % 30) / 100));
  const canc = Math.round(aDone * (0.05 + ((s * 7) % 12) / 100));
  const rep = Math.round(appts * (0.25 + ((s * 9) % 30) / 100));
  const repWith = Math.round(rep * 0.7);
  return { zone: d.zone, region: d.region, area: d.area, territory: d.territory, dealer: d.id, dealerName: d.name, due, done, conn, created, appts, aDone, conf, canc, repWith, repWithout: rep - repWith };
});
const levels = ["zone", "region", "area", "territory", "dealer"] as const;
type Level = (typeof levels)[number];
const uniq = (l: string[]) => [...new Set(l)].sort();

const nums = ["due", "done", "conn", "created", "appts", "aDone", "conf", "canc", "repWith", "repWithout"] as const;
const sum = (list: Row[]) => Object.fromEntries(nums.map((k) => [k, list.reduce((a, r) => a + r[k], 0)])) as Record<(typeof nums)[number], number>;
const p = (a: number, b: number) => `${b ? Math.round((a / b) * 100) : 0}%`;
const n = (x: number) => x.toLocaleString("en-IN");
type S = ReturnType<typeof sum>;

type StatColor = "blue" | "teal" | "green" | "amber" | "orange" | "rose" | "violet" | "cyan";
const pastel: Record<StatColor, string> = {
  blue: "border-stat-blue/20 bg-stat-blue/10",
  teal: "border-stat-teal/20 bg-stat-teal/10",
  green: "border-stat-green/20 bg-stat-green/10",
  amber: "border-stat-amber/25 bg-stat-amber/15",
  orange: "border-stat-orange/20 bg-stat-orange/10",
  rose: "border-stat-rose/20 bg-stat-rose/10",
  violet: "border-stat-violet/20 bg-stat-violet/10",
  cyan: "border-stat-cyan/20 bg-stat-cyan/10",
};
const grad: Record<StatColor, string> = {
  blue: "from-stat-blue to-stat-cyan",
  teal: "from-stat-teal to-stat-green",
  green: "from-stat-green to-stat-teal",
  amber: "from-stat-amber to-stat-orange",
  orange: "from-stat-orange to-stat-rose",
  rose: "from-stat-rose to-stat-violet",
  violet: "from-stat-violet to-stat-blue",
  cyan: "from-stat-cyan to-stat-blue",
};
const dot: Record<StatColor, string> = {
  blue: "bg-stat-blue",
  teal: "bg-stat-teal",
  green: "bg-stat-green",
  amber: "bg-stat-amber",
  orange: "bg-stat-orange",
  rose: "bg-stat-rose",
  violet: "bg-stat-violet",
  cyan: "bg-stat-cyan",
};

type Col = { k: K; v: (r: S) => string; pc?: boolean; th?: K; color: StatColor; target?: number; raw?: (r: S) => number; sub?: (r: S) => [number, number] };

const sCols: Col[] = [
  { k: "due", th: "dueT", v: (r) => n(r.due), color: "blue" },
  { k: "done", v: (r) => n(r.done), color: "teal" },
  { k: "doneP", v: (r) => p(r.done, r.due), pc: true, color: "blue", target: 80, raw: (r) => Math.round((r.done / (r.due || 1)) * 100) },
  { k: "conn", v: (r) => n(r.conn), color: "cyan" },
  { k: "connP", v: (r) => p(r.conn, r.done), pc: true, color: "cyan" },
  { k: "created", v: (r) => n(r.created), color: "green" },
  { k: "createdP", v: (r) => p(r.created, r.conn), pc: true, color: "green" },
];
const aCols: Col[] = [
  { k: "appts", th: "apptsT", v: (r) => n(r.appts), color: "blue" },
  { k: "aDone", v: (r) => n(r.aDone), color: "teal" },
  { k: "doneP", v: (r) => p(r.aDone, r.appts), pc: true, color: "teal" },
  { k: "conf", v: (r) => n(r.conf), color: "green" },
  { k: "confP", v: (r) => p(r.conf, r.aDone), pc: true, color: "green", target: 60, raw: (r) => Math.round((r.conf / (r.aDone || 1)) * 100) },
  { k: "canc", v: (r) => n(r.canc), color: "rose" },
  { k: "cancP", v: (r) => p(r.canc, r.aDone), pc: true, color: "rose" },
  { k: "reported", v: (r) => n(r.repWith + r.repWithout), color: "amber", sub: (r) => [r.repWith, r.repWithout] },
  { k: "repP", v: (r) => p(r.repWith + r.repWithout, r.appts), pc: true, color: "amber" },
];

// Components live at module level so React patches the existing table instead of
// rebuilding it, which is what used to yank the page scroll around.
// Head Office dashboard is English only.
const t = (k: K) => L[k].en;

function Filter({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[] }) {
  return (
    <label className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-card">
      <span className="bg-primary px-3 py-1.5 text-center text-sm font-bold text-primary-foreground">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="m-2 rounded-md border bg-background px-2 py-1.5 text-sm">
        <option value="">{t("all")}</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Cell({ r, c }: { r: S; c: Col }) {
  return (
    <>
      {c.v(r)}
      {c.sub && (
        <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
          {t("repWith")} {c.sub(r)[0]} · {t("repWithout")} {c.sub(r)[1]}
        </span>
      )}
    </>
  );
}

function FunnelSteps({ steps, colors }: { steps: [string, number][]; colors: StatColor[] }) {
  const base = steps[0]?.[1] || 1;
  return (
    <div className="space-y-3">
      {steps.map(([label, val], i) => {
        const share = Math.round((val / base) * 100);
        const w = Math.max(30, share);
        const prev = i > 0 ? steps[i - 1]?.[1] ?? 0 : 0;
        const step = i > 0 && prev ? Math.round((val / prev) * 100) : null;
        const c = colors[i] ?? "blue";
        return (
          <div key={label}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <span className={cn("h-2 w-2 rounded-full", dot[c])} />
                {i + 1}. {label}
              </span>
              {step !== null && <span className={cn("whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-bold", pastel[c])}>{step}% ← {i}</span>}
            </div>
            <div className="flex justify-center">
              <div className={cn("flex h-10 items-center justify-center rounded-lg bg-gradient-to-r text-primary-foreground shadow-md", grad[c])} style={{ width: `${w}%` }}>
                <span className="whitespace-nowrap text-sm font-extrabold">{val.toLocaleString("en-IN")} · {share}%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({
  title, cols, icon: Icon, tint, level, view, below, setLevel, setView, setBelow, groups, tot, tableTot, onDrill, steps, stepColors, topRef, barRef, stay,
}: {
  title: K; cols: Col[]; icon: typeof Phone; tint: string;
  level: Level; view: "table" | "funnel"; below: boolean;
  setLevel: (l: Level) => void; setView: (v: "table" | "funnel") => void; setBelow: (b: boolean) => void;
  groups: { k: string; name: string; s: S }[]; tot: S; tableTot: S; onDrill: (k: string) => void;
  steps: [string, number][]; stepColors: StatColor[];
  topRef: { current: HTMLDivElement | null }; barRef: { current: HTMLDivElement | null }; stay: (run: () => void) => void;
}) {
  return (
    <section ref={topRef} className={cn("mb-6 scroll-mt-24 rounded-2xl border p-4 shadow-card md:p-5", tint)}>
      <h2 className="mb-3 flex items-center gap-2.5 text-lg font-extrabold">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="h-4.5 w-4.5" />
        </span>
        {t(title)}
      </h2>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-5">
        {cols.map((c) => (
          <div key={c.k} className={cn("rounded-xl border p-3", pastel[c.color])}>
            <p className="text-[11px] font-bold leading-tight text-muted-foreground">{t(c.k)}</p>
            <p className={cn("mt-1 text-xl font-extrabold", c.pc && "text-primary")}>{c.v(tot)}</p>
            {c.sub && (
              <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
                {t("repWith")} {n(tot.repWith)} · {t("repWithout")} {n(tot.repWithout)}
              </p>
            )}
          </div>
        ))}
      </div>

      <div ref={barRef} className="mb-3 space-y-2">
        <div className="inline-flex rounded-lg border bg-card p-1 shadow-card">
          {(["table", "funnel"] as const).map((v) => (
            <button key={v} onClick={() => stay(() => setView(v))} className={cn("rounded-md px-4 py-1.5 text-sm font-bold", view === v ? "bg-primary text-primary-foreground" : "text-primary hover:bg-secondary")}>{t(v)}</button>
          ))}
        </div>
        {view === "table" && (
          <div className="inline-flex flex-wrap rounded-lg border bg-card p-1 shadow-card">
            {levels.map((l) => (
              <button key={l} onClick={() => stay(() => { setLevel(l); setBelow(false); })} className={cn("rounded-md px-4 py-1.5 text-sm font-bold", level === l ? "bg-primary text-primary-foreground" : "text-primary hover:bg-secondary")}>{t(l)}</button>
            ))}
          </div>
        )}
      </div>

      {below && view === "table" && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-stat-rose/30 bg-stat-rose/10 px-3 py-2 text-sm font-semibold">
          <span>{t("showingBelow")}</span>
          <button onClick={() => stay(() => setBelow(false))} className="ml-auto rounded-md bg-card px-2.5 py-1 text-xs font-bold text-stat-rose shadow-sm hover:bg-secondary">{t("showAll")}</button>
        </div>
      )}

      {view === "funnel" ? (
        <div className="rounded-xl border bg-card p-4">
          <FunnelSteps steps={steps} colors={stepColors} />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className={cn("w-full text-sm", cols.length > 8 ? "min-w-[940px]" : "min-w-[820px]")}>
            <thead className="bg-primary text-primary-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">{t(level)}</th>
                {level === "dealer" && <th className="px-3 py-2 text-left font-semibold">{t("dealerName")}</th>}
                {cols.map((c) => <th key={c.k} className="px-2 py-2 text-center text-xs font-semibold">{t(c.th ?? c.k)}</th>)}
              </tr>
            </thead>
            <tbody>
              {groups.map((g) => (
                <tr key={g.k} onClick={() => onDrill(g.k)} className={cn("border-b text-center odd:bg-muted/40", level !== "dealer" && "cursor-pointer hover:bg-secondary")}>
                  <td className="px-3 py-2 text-left font-semibold">{g.k}</td>
                  {level === "dealer" && <td className="px-3 py-2 text-left">{g.name}</td>}
                  {cols.map((c) => {
                    const bad = c.target != null && c.raw ? c.raw(g.s) < c.target : false;
                    return <td key={c.k} className={cn("px-2 py-2", c.pc && "font-bold", c.pc && (bad ? "text-stat-rose" : "text-primary"))}><Cell r={g.s} c={c} /></td>;
                  })}
                </tr>
              ))}
              <tr className="bg-secondary text-center font-extrabold">
                <td className="px-3 py-2 text-left" colSpan={level === "dealer" ? 2 : 1}>{t("total")}</td>
                {cols.map((c) => <td key={c.k}><Cell r={tableTot} c={c} /></td>)}
              </tr>
            </tbody>
          </table>
          <p className="mt-2 px-3 text-[11px] font-semibold text-muted-foreground lg:hidden">{t("scrollHint")}</p>
        </div>
      )}
    </section>
  );
}

function HeadOfficePage() {
  const [f, setF] = useState<Record<Exclude<Level, "dealer">, string>>({ zone: "", region: "", area: "", territory: "" });
  const [draft, setDraft] = useState(f);
  const [period, setPeriod] = useState<Period>("today");
  const [draftPeriod, setDraftPeriod] = useState<Period>("today");

  // Each report section keeps its own view and drill level.
  const [sLv, setSLv] = useState<Level>("zone");
  const [sView, setSView] = useState<"table" | "funnel">("table");
  const [sBelow, setSBelow] = useState(false);
  const [aLv, setALv] = useState<Level>("zone");
  const [aView, setAView] = useState<"table" | "funnel">("table");
  const [aBelow, setABelow] = useState(false);

  const sTop = useRef<HTMLDivElement>(null);
  const aTop = useRef<HTMLDivElement>(null);
  const sBar = useRef<HTMLDivElement>(null);
  const aBar = useRef<HTMLDivElement>(null);
  const spacer = useRef<HTMLDivElement>(null);

  // Holds the clicked tab bar exactly where it is while the table re-sorts. If the
  // table got shorter and the page ran out of room below, make room and try again.
  const makeStay = (bar: { current: HTMLElement | null }) => (run: () => void) => {
    const before = bar.current?.getBoundingClientRect().top ?? 0;
    run();
    requestAnimationFrame(() => {
      const el = bar.current;
      if (!el) return;
      const scrollBy = (d: number) => window.scrollBy({ top: d, behavior: "instant" as ScrollBehavior });
      const first = el.getBoundingClientRect().top - before;
      if (Math.abs(first) <= 1) return;
      scrollBy(first);
      const left = el.getBoundingClientRect().top - before;
      if (left > 1 && spacer.current) {
        spacer.current.style.height = `${Math.round(spacer.current.offsetHeight + left)}px`;
        scrollBy(left);
      }
    });
  };

  const rows = useMemo(() => makeRows(periodFactor[period]), [period]);

  const withFilter = (src: typeof f, k: keyof typeof f, v: string): typeof f => {
    const idx = levels.indexOf(k);
    return Object.fromEntries(Object.entries(src).map(([key, val]) => [key, key === k ? v : levels.indexOf(key as Level) > idx ? "" : val])) as typeof f;
  };
  const setFilter = (k: keyof typeof f, v: string) => setDraft((cur) => withFilter(cur, k, v));
  const matchUpTo = (r: Row, upto: number, src: typeof f) => (Object.keys(src) as (keyof typeof f)[]).every((k) => levels.indexOf(k) >= upto || !src[k] || r[k] === src[k]);

  const filtered = rows.filter((r) => matchUpTo(r, 99, f));
  const tot = sum(filtered);
  const optsFor = (k: keyof typeof f) => uniq(rows.filter((r) => matchUpTo(r, levels.indexOf(k), draft)).map((r) => r[k]));

  const dirty = draftPeriod !== period || (Object.keys(f) as (keyof typeof f)[]).some((k) => draft[k] !== f[k]);
  const applyFilters = () => { setF(draft); setPeriod(draftPeriod); setSBelow(false); setABelow(false); };
  const clearFilters = () => {
    const blank = { zone: "", region: "", area: "", territory: "" };
    setDraft(blank); setF(blank); setDraftPeriod("today"); setPeriod("today");
    setSLv("zone"); setSView("table"); setSBelow(false);
    setALv("zone"); setAView("table"); setABelow(false);
  };

  const belowIds = (kind: "calls" | "conf") => {
    const m = new Map<string, Row[]>();
    filtered.forEach((r) => m.set(r.dealer, [...(m.get(r.dealer) ?? []), r]));
    return new Set([...m.entries()].filter(([, list]) => {
      const s = sum(list);
      return kind === "calls" ? (s.done / (s.due || 1)) * 100 < 80 : (s.conf / (s.aDone || 1)) * 100 < 60;
    }).map(([k]) => k));
  };

  const groupFor = (level: Level, below: boolean, kind: "calls" | "conf") => {
    const list = below ? filtered.filter((r) => belowIds(kind).has(r.dealer)) : filtered;
    const m = new Map<string, Row[]>();
    list.forEach((r) => m.set(r[level], [...(m.get(r[level]) ?? []), r]));
    const groups = [...m.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, rows2]) => ({ k, name: level === "dealer" ? rows2[0]!.dealerName : "", s: sum(rows2) }));
    return { groups, tableTot: sum(list) };
  };

  const sData = groupFor(sLv, sBelow, "calls");
  const aData = groupFor(aLv, aBelow, "conf");

  const drill = (level: Level, k: string, setLv: (l: Level) => void, setBelow: (b: boolean) => void) => {
    if (level === "dealer") return;
    const next = withFilter(draft, level as keyof typeof f, k);
    setDraft(next);
    setF(next);
    setLv(levels[levels.indexOf(level) + 1]!);
    setBelow(false);
  };

  const showBelow = (kind: "calls" | "conf") => {
    if (kind === "calls") {
      setSView("table"); setSLv("dealer"); setSBelow(true);
      requestAnimationFrame(() => sTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      setAView("table"); setALv("dealer"); setABelow(true);
      requestAnimationFrame(() => aTop.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const dealerStats = useMemo(() => {
    const m = new Map<string, Row[]>();
    filtered.forEach((r) => m.set(r.dealer, [...(m.get(r.dealer) ?? []), r]));
    return [...m.entries()].map(([k, list]) => ({ id: k, name: list[0]!.dealerName, s: sum(list) }));
  }, [filtered]);
  const byDone = [...dealerStats].sort((a, b) => b.s.done / (b.s.due || 1) - a.s.done / (a.s.due || 1));
  const top5 = byDone.slice(0, 5);
  const bottom5 = byDone.slice(-5).reverse();
  const lowCalls = dealerStats.filter((d) => (d.s.done / (d.s.due || 1)) * 100 < 80).length;
  const lowConf = dealerStats.filter((d) => (d.s.conf / (d.s.aDone || 1)) * 100 < 60).length;

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("sub")}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-card">
          <span className="bg-primary px-3 py-1.5 text-center text-sm font-bold text-primary-foreground">{t("date")}</span>
          <select value={draftPeriod} onChange={(e) => setDraftPeriod(e.target.value as Period)} className="m-2 rounded-md border bg-background px-2 py-1.5 text-sm">
            {(["today", "yesterday", "thisWeek", "thisMonth"] as const).map((o) => <option key={o} value={o}>{t(o)}</option>)}
          </select>
        </label>
        {(Object.keys(f) as (keyof typeof f)[]).map((k) => <Filter key={k} label={t(k)} value={draft[k]} onChange={(v) => setFilter(k, v)} opts={optsFor(k)} />)}
      </div>
      <div className="mb-5 mt-3 flex flex-wrap items-center gap-2">
        <button onClick={applyFilters} disabled={!dirty} className={cn("rounded-lg px-4 py-2 text-sm font-bold transition", dirty ? "bg-primary text-primary-foreground shadow-card hover:opacity-90" : "cursor-not-allowed bg-muted text-muted-foreground")}>{t("apply")}</button>
        <button onClick={clearFilters} className="rounded-lg border bg-card px-4 py-2 text-sm font-bold text-primary shadow-card hover:bg-secondary">{t("clear")}</button>
        {dirty && <span className="text-xs font-semibold text-stat-amber">{t("pendingChange")}</span>}
      </div>

      {lowCalls > 0 || lowConf > 0 ? (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-stat-rose/30 bg-stat-rose/10 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-stat-rose" />
          <div>
            <p className="text-sm font-extrabold">{t("alertTitle")}</p>
            <p className="text-sm text-muted-foreground">
              {lowCalls > 0 && (
                <button onClick={() => showBelow("calls")} className="mr-3 font-semibold text-foreground underline decoration-stat-rose decoration-2 underline-offset-2 hover:text-stat-rose">
                  {lowCalls} {t("alertCalls")}
                </button>
              )}
              {lowConf > 0 && (
                <button onClick={() => showBelow("conf")} className="font-semibold text-foreground underline decoration-stat-rose decoration-2 underline-offset-2 hover:text-stat-rose">
                  {lowConf} {t("alertConf")}
                </button>
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-xl border border-stat-green/30 bg-stat-green/10 p-4 text-sm font-semibold">{t("allGood")}</div>
      )}

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card md:p-5">
        <h2 className="mb-3 flex items-center gap-2.5 text-lg font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Trophy className="h-4.5 w-4.5" />
          </span>
          {t("topTitle")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {([{ label: "top5", list: top5, tone: "green" }, { label: "bottom5", list: bottom5, tone: "rose" }] as const).map((g) => (
            <div key={g.label} className={cn("rounded-xl border p-3", pastel[g.tone])}>
              <p className="mb-2 text-sm font-extrabold">{t(g.label)}</p>
              <div className="space-y-1.5">
                {g.list.map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between gap-2 rounded-lg bg-card px-2.5 py-1.5 text-sm shadow-sm">
                    <span className="min-w-0 truncate">
                      <span className="mr-1.5 font-bold text-muted-foreground">{i + 1}.</span>
                      <span className="font-semibold">{d.id}</span> <span className="text-muted-foreground">· {d.name}</span>
                    </span>
                    <span className="whitespace-nowrap font-extrabold">{p(d.s.done, d.s.due)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Section
        title="sTitle" cols={sCols} icon={Phone} tint="bg-stat-blue/5"
        level={sLv} view={sView} below={sBelow}
        setLevel={setSLv} setView={setSView} setBelow={setSBelow}
        groups={sData.groups} tot={tot} tableTot={sData.tableTot}
        onDrill={(k) => drill(sLv, k, setSLv, setSBelow)}
        topRef={sTop} barRef={sBar} stay={makeStay(sBar)}
        steps={[[t("dueT"), tot.due], [t("done"), tot.done], [t("conn"), tot.conn], [t("created"), tot.created]]}
        stepColors={["blue", "teal", "cyan", "green"]}
      />
      <Section
        title="aTitle" cols={aCols} icon={CalendarCheck} tint="bg-stat-violet/5"
        level={aLv} view={aView} below={aBelow}
        setLevel={setALv} setView={setAView} setBelow={setABelow}
        groups={aData.groups} tot={tot} tableTot={aData.tableTot}
        onDrill={(k) => drill(aLv, k, setALv, setABelow)}
        topRef={aTop} barRef={aBar} stay={makeStay(aBar)}
        steps={[[t("apptsT"), tot.appts], [t("aDone"), tot.aDone], [t("conf"), tot.conf], [t("reported"), tot.repWith + tot.repWithout], [t("repWith"), tot.repWith]]}
        stepColors={["blue", "teal", "green", "amber", "orange"]}
      />
      <div ref={spacer} aria-hidden className="h-0" />
    </AppShell>
  );
}
