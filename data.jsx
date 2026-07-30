// Demo data — Fjordlys Interiør AS, a Norwegian boutique furniture company in Oslo.

const TENANT = {
  name: "Fjordlys Interiør AS",
  orgNr: "924 518 330",
  domain: "fjordlys.no",
  plan: "Business",
  vpsRegion: "Helsinki · fsn1",
  vpsHost: "hermes.fjordlys.no",
  users: 14,
  storage: { used: 47.2, total: 200, unit: "GB" },
};

const USER = {
  name: "Ingrid Solberg",
  role: "Daglig leder",
  initials: "IS",
  email: "ingrid@fjordlys.no",
};

const MODELS = [
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "Anthropic", local: false, fast: false },
  { id: "claude-haiku-4-5",  label: "Claude Haiku 4.5",  provider: "Anthropic", local: false, fast: true  },
  { id: "llama3.1-70b",      label: "Llama 3.1 · 70B",   provider: "Ollama",    local: true,  fast: false },
  { id: "openclaw",          label: "OpenClaw · 13B",    provider: "Ollama",    local: true,  fast: true  },
  { id: "mistral-7b",        label: "Mistral · 7B",      provider: "Ollama",    local: true,  fast: true  },
];

const AGENTS = [
  { id: "hermes",     name: "Hermes",   role: "Orchestrator", kind: "orchestrator", color: "var(--accent)",           status: "active",  runs24h: 147, cost24h: 2.84, model: "claude-sonnet-4-6", desc: "Routes tasks, coordinates sub-agents, escalates to humans." },
  { id: "marketing",  name: "Atlas",    role: "Marketing",    kind: "marketing",    color: "var(--agent-marketing)",   status: "active",  runs24h: 38,  cost24h: 0.92, model: "llama3.1-70b",     desc: "Plans campaigns, briefs creatives, monitors channels." },
  { id: "sales",      name: "Artemis",  role: "Sales",        kind: "sales",        color: "var(--agent-sales)",       status: "active",  runs24h: 52,  cost24h: 1.14, model: "llama3.1-70b",     desc: "Finds leads, drafts outreach, scores opportunities." },
  { id: "content",    name: "Calliope", role: "Content",      kind: "content",      color: "var(--agent-content)",     status: "waiting", runs24h: 14,  cost24h: 0.41, model: "openclaw",         desc: "Writes blog posts, social captions, newsletters." },
  { id: "research",   name: "Athena",   role: "Research",     kind: "research",     color: "var(--agent-research)",    status: "active",  runs24h: 9,   cost24h: 0.28, model: "claude-sonnet-4-6", desc: "Market research, competitor tracking, briefs." },
  { id: "accounting", name: "Midas",    role: "Accounting",   kind: "accounting",   color: "var(--agent-accounting)",  status: "idle",    runs24h: 6,   cost24h: 0.11, model: "openclaw",         desc: "Reads invoices, summarizes expenses, prepares reports." },
  { id: "ads",        name: "Apollo",   role: "Ads",          kind: "ads",          color: "var(--agent-ads)",         status: "paused",  runs24h: 0,   cost24h: 0,    model: "mistral-7b",       desc: "Optimizes paid campaigns, pauses underperformers." },
  { id: "support",    name: "Iris",     role: "Support",      kind: "support",      color: "var(--agent-support)",     status: "active",  runs24h: 22,  cost24h: 0.37, model: "mistral-7b",       desc: "Triages inbox, drafts replies, escalates complex tickets." },
];

const ACTIVITY = [
  { id: 1, t: "09:42", agent: "Artemis", verb: "drafted", obj: "outreach email to Nordlys Hotell AS", status: "pending-approval" },
  { id: 2, t: "09:38", agent: "Hermes", verb: "routed", obj: "lead → Artemis (sales)", status: "ok" },
  { id: 3, t: "09:35", agent: "Atlas", verb: "proposed", obj: "Q2 Instagram campaign · 8 posts", status: "pending-approval" },
  { id: 4, t: "09:31", agent: "Iris", verb: "replied", obj: "support ticket #4821 (delivery query)", status: "ok" },
  { id: 5, t: "09:27", agent: "Calliope", verb: "drafted", obj: "blog: 'Nordisk design på kontoret'", status: "pending-approval" },
  { id: 6, t: "09:18", agent: "Athena", verb: "finished", obj: "competitor report: Slettvoll, Bolia", status: "ok" },
  { id: 7, t: "09:14", agent: "Midas", verb: "categorized", obj: "14 invoices from Fiken", status: "ok" },
  { id: 8, t: "09:02", agent: "Hermes", verb: "delegated", obj: "weekly content planning → Calliope", status: "ok" },
  { id: 9, t: "08:54", agent: "Artemis", verb: "scored", obj: "6 new leads (avg 78/100)", status: "ok" },
  { id: 10, t: "08:47", agent: "Apollo", verb: "paused", obj: "Google Ads: 'Vinterkolleksjon' — low ROAS", status: "warn" },
];

const APPROVALS = [
  { id: "apr-01", agent: "Artemis",  agentKind: "sales",      kind: "email",    title: "Outreach email to Nordlys Hotell AS", to: "innkjop@nordlyshotell.no", preview: "Hei Marianne, jeg jobber med Fjordlys Interiør. Vi har levert til Scandic og Thon, og jeg la merke til at dere nylig åpnet konferansesalen på Lillehammer. Vil dere ha en rask titt på vårt kontraktsprogram?", meta: { "Lead score": "84", "Last contact": "never", "Channel": "Email" }, createdAt: "9 min ago" },
  { id: "apr-02", agent: "Atlas",    agentKind: "marketing",  kind: "campaign", title: "Q2 Instagram campaign — Nordic Minimal", preview: "8 posts across Apr 28 – May 19. Budget NOK 24 000. Hero product: Tromsø-stol. Estimated reach 42k in Oslo/Bergen metros.", meta: { "Posts": "8", "Budget": "NOK 24 000", "Reach (est.)": "42k", "Start": "Apr 28" }, createdAt: "12 min ago" },
  { id: "apr-03", agent: "Calliope", agentKind: "content",    kind: "blog",     title: "Blog post: 'Nordisk design på kontoret'", preview: "920 words. Focus on acoustic panels, natural wood, ergonomic seating. Target keyword: 'kontormøbler Oslo'. Internal links to Tromsø-stol, Bergen-bord product pages.", meta: { "Words": "920", "SEO keyword": "kontormøbler Oslo", "Reading": "4 min" }, createdAt: "18 min ago" },
  { id: "apr-04", agent: "Apollo",   agentKind: "ads",        kind: "ad-change",title: "Pause Google Ads: 'Vinterkolleksjon'", preview: "ROAS has fallen to 0.8 over the last 14 days (target 2.5). Recommend pausing and reallocating NOK 8 400/mo to the 'Kontraktsprogram' campaign which is at 4.1 ROAS.", meta: { "Current ROAS": "0.8", "Target": "2.5", "Spend saved": "NOK 8 400/mo" }, createdAt: "1h ago" },
  { id: "apr-05", agent: "Midas",    agentKind: "accounting", kind: "report",   title: "Weekly expense summary — week 17", preview: "14 invoices processed. NOK 184 210 across suppliers. 2 duplicates flagged (Posten Bring). 1 invoice past due (Fiken, 3 days).", meta: { "Invoices": "14", "Total": "NOK 184 210", "Flagged": "3" }, createdAt: "2h ago" },
];

const LEADS = [
  { name: "Nordlys Hotell AS",     contact: "Marianne Berg", score: 84, stage: "Outreach",  source: "Web",      value: "NOK 240k" },
  { name: "Bergen Advokatkontor",  contact: "Ole Sandvik",   score: 77, stage: "Proposal",  source: "Referral", value: "NOK 95k"  },
  { name: "Tromsø Universitet",    contact: "Kari Nilsen",   score: 71, stage: "Discovery", source: "Inbound",  value: "NOK 410k" },
  { name: "Scandic Byporten",      contact: "Lars Aune",     score: 68, stage: "Outreach",  source: "Cold",     value: "NOK 180k" },
  { name: "Thon Partner Hotels",   contact: "Henrik Dahl",   score: 62, stage: "Nurture",   source: "Event",    value: "NOK 320k" },
  { name: "Oslo Dental Group",     contact: "Silje Haugen",  score: 58, stage: "Outreach",  source: "Cold",     value: "NOK 72k"  },
  { name: "Stavanger Arkitekt",    contact: "Trond Myhre",   score: 55, stage: "Discovery", source: "Web",      value: "NOK 140k" },
];

const CONTENT = [
  { day: 28, month: "Apr", title: "Nordisk design på kontoret",       channel: "Blog",      status: "pending-approval", agent: "Calliope" },
  { day: 29, month: "Apr", title: "Tromsø-stol · sneak peek",         channel: "Instagram", status: "scheduled",         agent: "Atlas"    },
  { day: 30, month: "Apr", title: "Newsletter — Mai kolleksjon",       channel: "Email",     status: "draft",             agent: "Calliope" },
  { day: 1,  month: "May", title: "Behind the scenes: verkstedet",     channel: "Instagram", status: "scheduled",         agent: "Atlas"    },
  { day: 3,  month: "May", title: "Case study: Scandic Byporten",     channel: "LinkedIn",  status: "draft",             agent: "Calliope" },
  { day: 5,  month: "May", title: "Bergen-bord · produktlansering",    channel: "Blog",      status: "draft",             agent: "Calliope" },
  { day: 7,  month: "May", title: "Ukens tilbud",                     channel: "Email",     status: "scheduled",         agent: "Atlas"    },
  { day: 10, month: "May", title: "Video: montering av Tromsø-stol",  channel: "Instagram", status: "idea",              agent: "Atlas"    },
];

const SPARK = {
  leads:   [4, 5, 3, 6, 8, 7, 9, 11, 8, 10, 13, 12, 14, 16],
  revenue: [120, 135, 128, 142, 155, 148, 162, 171, 168, 180, 195, 188, 210, 224],
  agents:  [80, 95, 110, 128, 142, 138, 155, 160, 158, 170, 175, 172, 180, 184],
};

Object.assign(window, { TENANT, USER, AGENTS, MODELS, ACTIVITY, APPROVALS, LEADS, CONTENT, SPARK });
