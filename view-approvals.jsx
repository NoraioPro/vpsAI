// Approvals inbox — human-in-the-loop review queue.

const { useState: useStateA } = React;

function ApprovalsView() {
  const [selected, setSelected] = useStateA(APPROVALS[0].id);
  const [decided, setDecided] = useStateA({});
  const queue = APPROVALS.filter(a => !decided[a.id]);
  const current = APPROVALS.find(a => a.id === selected) || queue[0];

  const decide = (id, verdict) => {
    setDecided(d => ({ ...d, [id]: verdict }));
    const remaining = APPROVALS.filter(a => a.id !== id && !decided[a.id]);
    if (remaining[0]) setSelected(remaining[0].id);
  };

  return (
    <div className="apr">
      <div className="apr-list">
        <div className="apr-list-head">
          <div className="eyebrow">Queue · {queue.length}</div>
        </div>
        {APPROVALS.map(a => {
          const agent = AGENTS.find(x => x.name === a.agent);
          const verdict = decided[a.id];
          return (
            <button
              key={a.id}
              className={"apr-item" + (selected === a.id ? " active" : "") + (verdict ? " decided" : "")}
              onClick={() => setSelected(a.id)}
            >
              <AgentAvatar agent={agent} size={24}/>
              <div className="apr-item-body">
                <div className="apr-item-title">{a.title}</div>
                <div className="apr-item-meta">
                  <span className="tag">{a.kind}</span>
                  <span className="dim mono" style={{fontSize: 10}}>{a.createdAt}</span>
                </div>
              </div>
              {verdict === "approved" && <span className="tag ok"><Icon.Check size={10}/></span>}
              {verdict === "rejected" && <span className="tag err"><Icon.X size={10}/></span>}
            </button>
          );
        })}
      </div>

      <div className="apr-detail">
        {current ? (
          <ApprovalDetail approval={current} verdict={decided[current.id]} onDecide={decide} />
        ) : (
          <div className="apr-empty">
            <Icon.Check size={32}/>
            <div style={{marginTop: 12, color: "var(--text-1)"}}>You're all caught up.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApprovalDetail({ approval: a, verdict, onDecide }) {
  const agent = AGENTS.find(x => x.name === a.agent);
  return (
    <div className="apr-d">
      <div className="apr-d-head">
        <div className="apr-d-head-left">
          <AgentAvatar agent={agent} size={32}/>
          <div>
            <div className="apr-d-agent">{a.agent} <span className="dim">· {agent.role}</span></div>
            <div className="apr-d-kind"><span className="tag">{a.kind}</span></div>
          </div>
        </div>
        <div className="apr-d-head-right dim mono" style={{fontSize: 11}}>{a.createdAt}</div>
      </div>
      <h2 className="apr-d-title">{a.title}</h2>

      {a.to && (
        <div className="apr-d-row">
          <span className="eyebrow">To</span>
          <span className="mono">{a.to}</span>
        </div>
      )}

      <div className="apr-d-preview">
        {a.preview}
      </div>

      <div className="apr-d-meta">
        {Object.entries(a.meta).map(([k, v]) => (
          <div key={k} className="apr-d-meta-item">
            <div className="eyebrow">{k}</div>
            <div className="apr-d-meta-val mono">{v}</div>
          </div>
        ))}
      </div>

      <div className="apr-d-trail">
        <div className="eyebrow" style={{marginBottom: 6}}>Why this was drafted</div>
        <div className="apr-d-trail-list">
          <div className="apr-d-trail-item"><Icon.Dot size={10}/> Hermes assigned <b>{a.agent}</b> based on task type · <span className="dim">9:31</span></div>
          <div className="apr-d-trail-item"><Icon.Dot size={10}/> Grounded in CRM, email history, company tone guide · <span className="dim">9:32</span></div>
          <div className="apr-d-trail-item"><Icon.Dot size={10}/> Tool <span className="mono">{agent.id === "sales" ? "email.send" : agent.id === "marketing" ? "instagram.post" : "publish"}</span> is <span className="warn-text">gated</span> — awaiting you</div>
        </div>
      </div>

      <div className="apr-d-actions">
        {verdict ? (
          <div className="apr-d-decided">
            {verdict === "approved" ? (
              <><Icon.Check size={16} style={{color: "var(--ok)"}}/> Approved. {a.agent} will execute now.</>
            ) : (
              <><Icon.X size={16} style={{color: "var(--err)"}}/> Rejected. {a.agent} will revise.</>
            )}
          </div>
        ) : (
          <>
            <button className="btn lg" onClick={() => onDecide(a.id, "rejected")}>
              <Icon.X size={13}/> Reject & revise
            </button>
            <button className="btn lg" onClick={() => onDecide(a.id, "approved")}>
              Edit first
            </button>
            <button className="btn lg primary" onClick={() => onDecide(a.id, "approved")}>
              <Icon.Check size={13}/> Approve & execute
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LeadsView() {
  return (
    <div className="leads">
      <div className="leads-top">
        <div className="leads-stats">
          <Metric label="Open pipeline" value="NOK 1.24M" sub="+12%" data={SPARK.revenue} color="var(--ok)"/>
          <Metric label="Avg lead score" value="69" sub="+4 pts" data={[62,63,65,64,66,67,65,68,69,69,70,69,69,69]} color="var(--info)"/>
          <Metric label="Won · 30d" value="4" sub="NOK 412k" data={[1,1,2,2,2,3,3,3,3,4,4,4,4,4]} color="var(--accent)"/>
          <Metric label="Artemis drafts" value="12" sub="6 in queue" data={[3,4,5,6,7,7,8,9,10,10,11,11,12,12]} color="var(--agent-sales)"/>
        </div>
      </div>
      <div className="leads-table card">
        <div className="leads-table-head">
          <h3>Leads · scored by Artemis</h3>
          <div style={{display: "flex", gap: 8}}>
            <button className="btn sm"><Icon.Plus size={12}/> New lead</button>
            <button className="btn sm ghost"><Icon.More size={14}/></button>
          </div>
        </div>
        <table className="lt">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th className="lt-num">Score</th>
              <th>Stage</th>
              <th>Source</th>
              <th className="lt-num">Est. value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {LEADS.map((l, i) => (
              <tr key={i}>
                <td><b style={{color: "var(--text-0)"}}>{l.name}</b></td>
                <td>{l.contact}</td>
                <td className="lt-num">
                  <div className="score-cell">
                    <span className="score-bar">
                      <span className="score-bar-fill" style={{width: l.score + "%", background: l.score > 75 ? "var(--ok)" : l.score > 60 ? "var(--warn)" : "var(--text-3)"}}></span>
                    </span>
                    <span className="mono" style={{width: 26}}>{l.score}</span>
                  </div>
                </td>
                <td><span className="tag">{l.stage}</span></td>
                <td className="dim">{l.source}</td>
                <td className="lt-num mono">{l.value}</td>
                <td><button className="btn sm ghost" style={{padding: 0, width: 24}}><Icon.More size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContentView() {
  const grouped = {};
  CONTENT.forEach(c => {
    const k = c.month;
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(c);
  });
  return (
    <div className="content-view">
      <div className="cv-head">
        <div>
          <h3>Content calendar</h3>
          <div className="muted" style={{fontSize: 12.5, marginTop: 4}}>Drafted by Calliope · scheduled by Atlas · approved by you</div>
        </div>
        <div style={{display: "flex", gap: 8}}>
          <button className="btn sm ghost">Week</button>
          <button className="btn sm" style={{background: "var(--bg-3)"}}>Month</button>
          <button className="btn sm primary"><Icon.Plus size={12}/> New</button>
        </div>
      </div>
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month} className="cv-group">
          <div className="cv-month eyebrow">{month === "Apr" ? "April 2026" : "May 2026"}</div>
          <div className="cv-list">
            {items.map((c, i) => (
              <div key={i} className="cv-item">
                <div className="cv-date">
                  <div className="cv-day num">{c.day}</div>
                  <div className="cv-mon">{c.month}</div>
                </div>
                <div className="cv-channel-strip" data-channel={c.channel}></div>
                <div className="cv-body">
                  <div className="cv-title">{c.title}</div>
                  <div className="cv-meta">
                    <span className="tag">{c.channel}</span>
                    <StatusTag status={c.status}/>
                    <span className="dim">by {c.agent}</span>
                  </div>
                </div>
                <button className="btn sm ghost"><Icon.Eye size={12}/> Preview</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusTag({ status }) {
  const map = {
    "pending-approval": { label: "Needs approval", cls: "warn" },
    "scheduled":        { label: "Scheduled",       cls: "ok" },
    "draft":            { label: "Draft",           cls: "" },
    "idea":             { label: "Idea",            cls: "info" },
  };
  const m = map[status] || { label: status, cls: "" };
  return <span className={"tag " + m.cls}>{m.label}</span>;
}

function PlaceholderView({ title, icon }) {
  const Ic = Icon[icon] || Icon.Sparkle;
  return (
    <div className="placeholder">
      <div className="placeholder-inner">
        <Ic size={40}/>
        <div className="placeholder-title">{title}</div>
        <div className="placeholder-sub">Not yet mocked in this prototype. Jump to Agents or Approvals to see the hero flows.</div>
      </div>
    </div>
  );
}

Object.assign(window, { ApprovalsView, LeadsView, ContentView, PlaceholderView });
