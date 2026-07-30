// AI Chat — ask anything about the business, grounded in company data.

const { useState: useStateC, useRef: useRefC, useEffect: useEffectC } = React;

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    agentId: "hermes",
    content: "God morgen, Ingrid. I've skimmed this morning's inbox, Fiken, and the CRM. Ask me anything about the business.",
    time: "09:02",
  },
  {
    role: "user",
    content: "How did we do last week on revenue, and what's the pipeline looking like for May?",
    time: "09:15",
  },
  {
    role: "assistant",
    agentId: "hermes",
    content: "Uke 16 closed at NOK 412 800 (↑ 18% vs uke 15). Three deals signed: Scandic Byporten (NOK 180k, contract), Bergen Advokatkontor (NOK 95k, deposit), and a smaller repeat order from Thon.\n\nFor May the pipeline currently shows NOK 1.24M across 9 open opportunities. Weighted by stage: about NOK 520k is realistic. Tromsø Universitet (NOK 410k) is the biggest mover — Athena flagged their tender closes May 14.",
    time: "09:15",
    sources: [
      { kind: "crm",     label: "HubSpot · 9 deals" },
      { kind: "invoice", label: "Fiken · week 16" },
      { kind: "report",  label: "Athena research · Apr 23" },
    ],
  },
  {
    role: "user",
    content: "Ask Artemis to prep a follow-up for Tromsø before the tender closes.",
    time: "09:16",
  },
  {
    role: "assistant",
    agentId: "hermes",
    content: "Delegated to Artemis. She'll draft a tender-specific email and the supporting one-pager, then queue both for your approval before send. Estimated ready: ~14 min.",
    time: "09:16",
    delegated: { to: "Artemis", task: "Tromsø tender follow-up", eta: "14 min" },
  },
];

function ChatView() {
  const [messages, setMessages] = useStateC(INITIAL_MESSAGES);
  const [input, setInput] = useStateC("");
  const [typing, setTyping] = useStateC(false);
  const [activeAgentId, setActiveAgentId] = useStateC("hermes");
  const endRef = useRefC(null);

  const activeAgent = AGENTS.find(a => a.id === activeAgentId) || AGENTS[0];

  useEffectC(() => {
    endRef.current?.parentElement?.parentElement?.scrollTo({ top: 99999, behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const time = new Date().toTimeString().slice(0, 5);
    setMessages(ms => [...ms, { role: "user", content: input, time }]);
    const q = input;
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(ms => [...ms, {
        role: "assistant",
        agentId: activeAgentId,
        content: canned(q, activeAgent),
        time: new Date().toTimeString().slice(0, 5),
      }]);
      setTyping(false);
    }, 1400);
  };

  const suggestions = [
    "Summarize yesterday for me",
    "Which leads should I call today?",
    "Draft a post about the Tromsø-stol",
    "What did we spend on ads last month?",
  ];

  return (
    <div className="chat">
      <div className="chat-rail">
        <div className="eyebrow" style={{padding: "0 4px 8px"}}>Talk to</div>
        {AGENTS.map(a => {
          const model = MODELS.find(m => m.id === a.model);
          return (
            <button
              key={a.id}
              className={"chat-agent-item" + (activeAgentId === a.id ? " active" : "")}
              onClick={() => setActiveAgentId(a.id)}
              style={activeAgentId === a.id ? {"borderLeftColor": a.color} : {}}
            >
              <AgentAvatar agent={a} size={22}/>
              <div className="chat-agent-text">
                <div className="chat-agent-name">{a.name}</div>
                <div className="chat-agent-model mono">{model ? model.label : a.model}</div>
              </div>
              <span className={"dot " + (a.status === "active" ? "ok" : a.status === "waiting" ? "warn" : a.status === "paused" ? "" : "info")} style={{flexShrink: 0}}></span>
            </button>
          );
        })}

        <div style={{height: 1, background: "var(--line)", margin: "12px 0"}}/>

        <div className="eyebrow" style={{padding: "0 4px 6px"}}>Grounded in</div>
        <GroundingChip icon="Mail"     label="Email · fjordlys.no" count="14 new" />
        <GroundingChip icon="Database" label="HubSpot CRM"         count="9 deals" />
        <GroundingChip icon="Folder"   label="Nextcloud"           count="47.2 GB" />
        <GroundingChip icon="Building" label="Fiken"               count="Q1 + Apr" />
        <GroundingChip icon="Globe"    label="fjordlys.no"         count="public" />

        <div className="eyebrow" style={{padding: "16px 4px 6px"}}>Recent</div>
        <div className="chat-recent">
          <button className="chat-recent-item active">Morning brief</button>
          <button className="chat-recent-item">May campaign plan</button>
          <button className="chat-recent-item">Invoices from Posten</button>
          <button className="chat-recent-item">Lead qualification call</button>
          <button className="chat-recent-item">Reply to Henrik at Thon</button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-scroll">
          <div className="chat-list">
            {messages.map((m, i) => <Message key={i} m={m} />)}
            {typing && <TypingIndicator agent={activeAgent} />}
            <div ref={endRef}></div>
          </div>
        </div>

        <div className="chat-composer">
          <div className="chat-active-agent">
            <AgentAvatar agent={activeAgent} size={16}/>
            <span style={{fontSize: 11, color: "var(--text-2)"}}>
              Talking to <b style={{color: activeAgent.color}}>{activeAgent.name}</b>
            </span>
            <span className="mono" style={{fontSize: 10, color: "var(--text-3)", marginLeft: 4}}>
              · {(MODELS.find(m => m.id === activeAgent.model) || {}).label || activeAgent.model}
            </span>
            {(MODELS.find(m => m.id === activeAgent.model) || {}).local && (
              <span className="tag ok" style={{fontSize: 9, height: 16, marginLeft: 6}}>local</span>
            )}
          </div>

          <div className="chat-suggestions">
            {suggestions.map(s => (
              <button key={s} className="chat-chip" onClick={() => setInput(s)}>
                <Icon.Sparkle size={11}/> {s}
              </button>
            ))}
          </div>
          <div className="chat-input-row">
            <button className="btn ghost sm" style={{width: 32, height: 32, padding: 0}} title="Attach"><Icon.Paperclip size={15}/></button>
            <input
              className="chat-input"
              placeholder={"Ask " + activeAgent.name + "…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") send(); }}
            />
            <button className="btn ghost sm" style={{width: 32, height: 32, padding: 0}} title="Voice"><Icon.Mic size={15}/></button>
            <button className="btn primary" onClick={send} disabled={!input.trim()}>
              <Icon.Send size={13}/> Send
            </button>
          </div>
          <div className="chat-foot">
            <Icon.Shield size={10}/>
            <span>Queries and data stay on {TENANT.vpsHost}. Nothing leaves your VPS unless a gated tool explicitly calls out.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Message({ m }) {
  if (m.role === "user") {
    return (
      <div className="msg msg-user">
        <div className="msg-bubble msg-user-bubble">{m.content}</div>
        <div className="msg-meta">
          <span className="mono">{m.time}</span>
          <span>{USER.name.split(" ")[0]}</span>
        </div>
      </div>
    );
  }
  const agent = AGENTS.find(a => a.id === m.agentId) || AGENTS[0];
  return (
    <div className="msg msg-ai">
      <div className="msg-avatar" style={{
        background: `color-mix(in oklab, ${agent.color} 18%, var(--bg-2))`,
        borderColor: `color-mix(in oklab, ${agent.color} 35%, transparent)`,
        color: agent.color,
      }}>
        {agent.id === "hermes"
          ? <HermesMark size={16}/>
          : <span style={{fontSize: 13, fontWeight: 600}}>{agent.name[0]}</span>}
      </div>
      <div className="msg-body">
        <div className="msg-meta">
          <span style={{color: agent.color, fontWeight: 600}}>{agent.name}</span>
          <span className="mono dim" style={{fontSize: 10}}>{agent.role}</span>
          <span className="mono dim">{m.time}</span>
        </div>
        <div className="msg-bubble">
          {m.content.split("\n\n").map((p, i) => <p key={i} style={{margin: i === 0 ? 0 : "8px 0 0"}}>{p}</p>)}
        </div>
        {m.sources && (
          <div className="msg-sources">
            {m.sources.map((s, i) => (
              <span key={i} className="msg-source">
                <span className="msg-source-dot"></span>
                {s.label}
              </span>
            ))}
          </div>
        )}
        {m.delegated && (
          <div className="msg-delegated">
            <Icon.Agents size={13}/>
            <span>Delegated to <b>{m.delegated.to}</b> — <span className="muted">{m.delegated.task}</span></span>
            <span className="mono dim" style={{marginLeft: "auto"}}>ETA {m.delegated.eta}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator({ agent }) {
  return (
    <div className="msg msg-ai">
      <div className="msg-avatar" style={{
        background: `color-mix(in oklab, ${agent.color} 18%, var(--bg-2))`,
        borderColor: `color-mix(in oklab, ${agent.color} 35%, transparent)`,
        color: agent.color,
      }}>
        {agent.id === "hermes"
          ? <HermesMark size={16}/>
          : <span style={{fontSize: 13, fontWeight: 600}}>{agent.name[0]}</span>}
      </div>
      <div className="msg-body">
        <div className="msg-meta">
          <span style={{color: agent.color, fontWeight: 600}}>{agent.name}</span>
          <span className="mono dim">typing</span>
        </div>
        <div className="msg-bubble typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

function GroundingChip({ icon, label, count }) {
  const Ic = Icon[icon] || Icon.Database;
  return (
    <div className="grounding-chip">
      <Ic size={14}/>
      <div className="grounding-chip-text">
        <div className="grounding-chip-label">{label}</div>
        <div className="grounding-chip-count mono">{count}</div>
      </div>
      <span className="dot ok" style={{marginLeft: "auto"}}></span>
    </div>
  );
}

function canned(q, agent) {
  const l = q.toLowerCase();

  if (agent.id === "sales") {
    if (l.includes("lead") || l.includes("call") || l.includes("tromsø") || l.includes("pipeline")) {
      return "Artemis here. Top priority: Tromsø Universitet tender closes May 14 — I've drafted the follow-up email + one-pager, queued for your approval. Nordlys Hotell (score 84) has never been contacted. Want me to draft outreach now?";
    }
    return "Artemis here. I'm scanning the CRM and lead queue. Give me a specific lead or task and I'll get right on it.";
  }
  if (agent.id === "content") {
    if (l.includes("post") || l.includes("instagram") || l.includes("blog") || l.includes("content") || l.includes("tromsø")) {
      return "Calliope here. I've got three drafts ready for review: the Tromsø-stol Instagram carousel (220 words, ash wood focus), the 'Nordisk design på kontoret' blog post (920 words, SEO-optimised), and the May newsletter outline. Which would you like to see first?";
    }
    return "Calliope here. Ready to draft content — tell me the topic, channel, and tone and I'll have a first draft back in minutes.";
  }
  if (agent.id === "research") {
    if (l.includes("competitor") || l.includes("market") || l.includes("report")) {
      return "Athena here. Finished the Slettvoll/Bolia competitor analysis this morning. Key: Slettvoll increased Instagram spend 34% in April, Bolia launched a B2B contracts portal last week. Full 14-page report is in Nextcloud. Want the executive summary?";
    }
    return "Athena here. I can research competitors, market trends, customers, or any topic. What do you need me to dig into?";
  }
  if (agent.id === "accounting") {
    if (l.includes("invoice") || l.includes("fiken") || l.includes("expense") || l.includes("cost")) {
      return "Midas here. Week 17: 14 invoices processed, NOK 184 210 total. Flagged 2 potential duplicates from Posten Bring and one past-due invoice. Weekly expense report is ready — want me to queue it for your approval?";
    }
    return "Midas here. I handle invoices, expenses, and financial reports from Fiken. What do you need me to pull up?";
  }
  if (agent.id === "marketing") {
    if (l.includes("campaign") || l.includes("instagram") || l.includes("ads") || l.includes("budget")) {
      return "Atlas here. The Q2 Instagram campaign proposal is in your approvals queue — 8 posts, NOK 24 000 budget, Tromsø-stol hero. Apollo paused 'Vinterkolleksjon' (ROAS 0.8). Recommend shifting that budget to 'Kontraktsprogram' at 4.1 ROAS.";
    }
    return "Atlas here. I handle campaign planning, channel strategy, and marketing coordination. What's on your mind?";
  }
  if (agent.id === "support") {
    return "Iris here. Inbox is clear — replied to 4 tickets this morning, escalated 1 to you (delivery complaint from Nordlys). Response time avg 8 min today.";
  }
  if (agent.id === "ads") {
    return "Apollo here (currently paused). Monitoring 3 active campaigns: 'Kontraktsprogram' (4.1 ROAS ✓), 'Tromsø-stol' (2.8 ROAS ✓), 'Vårsamling' (1.6 ROAS — watching). 'Vinterkolleksjon' is paused pending your approval to reallocate budget.";
  }

  if (l.includes("summar") || l.includes("yesterd") || l.includes("today")) {
    return "Yesterday: 3 new leads (avg score 71), 1 deal progressed to proposal (Bergen Advokatkontor), NOK 38 200 invoiced across 4 customers. Calliope drafted 2 social posts waiting for you. Apollo paused the 'Vinterkolleksjon' Google Ads campaign — ROAS had drifted to 0.8.";
  }
  if (l.includes("call") || l.includes("lead")) {
    return "Top 3 by score: Nordlys Hotell (84, never contacted), Bergen Advokatkontor (77, proposal open 3 days), Tromsø Universitet (71, tender closes May 14). I'd call Nordlys first — Artemis has a draft outreach waiting for your approval already.";
  }
  if (l.includes("post") || l.includes("tromsø")) {
    return "Briefed Calliope: 220-word Instagram carousel on the Tromsø-stol, focus on ash wood + the weavers in Halden. Draft ready in ~6 min. Want me to include the price (NOK 8 900) or keep it aspirational?";
  }
  if (l.includes("spent") || l.includes("ads")) {
    return "April ads spend: NOK 18 420 (Google NOK 11 200, Meta NOK 7 220). Blended ROAS 2.3. The Kontraktsprogram Google campaign pulled 4.1 — worth increasing the budget there. Midas has the full breakdown ready if you want the weekly report.";
  }
  return "On it — give me a second to check the CRM and your email.";
}

Object.assign(window, { ChatView });
