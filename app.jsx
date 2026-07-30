// Main app — navigation state + tweaks panel.

const { useState: useStateM, useEffect: useEffectM } = React;

const DEFAULT_TWEAKS = {
  accent: "copper",
  density: "comfortable",
  showAgentNames: true,
  hermesIntensity: "subtle",
  showApprovalGates: true,
};

function App() {
  const [view, setView] = useStateM("agents");
  const [tweaks, setTweaks] = useTweaks(DEFAULT_TWEAKS);

  useEffectM(() => {
    const root = document.documentElement;
    const accents = {
      copper:   { a: "#C89B5C", as: "#E0B578", ink: "#1A1209" },
      emerald:  { a: "#5FB286", as: "#7FC9A1", ink: "#08170F" },
      slate:    { a: "#7A9CC9", as: "#9FB8D8", ink: "#0A1220" },
      crimson:  { a: "#C86B5C", as: "#DD8977", ink: "#1D0907" },
    };
    const col = accents[tweaks.accent] || accents.copper;
    root.style.setProperty("--accent", col.a);
    root.style.setProperty("--accent-strong", col.as);
    root.style.setProperty("--accent-ink", col.ink);
    root.style.setProperty("--accent-soft", col.a + "20");

    document.body.dataset.density = tweaks.density;
    document.body.dataset.hermes = tweaks.hermesIntensity;
    document.body.dataset.showGates = tweaks.showApprovalGates ? "on" : "off";
  }, [tweaks]);

  return (
    <div className="app">
      <Sidebar view={view} onNav={setView} />
      <div className="main">
        <ViewRouter view={view} setView={setView} />
      </div>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand">
          <TweakRadio
            label="Accent color"
            value={tweaks.accent}
            options={[
              { value: "copper",  label: "Copper" },
              { value: "emerald", label: "Emerald" },
              { value: "slate",   label: "Slate" },
              { value: "crimson", label: "Crimson" },
            ]}
            onChange={v => setTweaks("accent", v)}
          />
          <TweakRadio
            label="Hermes intensity"
            value={tweaks.hermesIntensity}
            options={[
              { value: "subtle",  label: "Subtle" },
              { value: "named",   label: "Named" },
              { value: "strong",  label: "Strong" },
            ]}
            onChange={v => setTweaks("hermesIntensity", v)}
          />
        </TweakSection>
        <TweakSection label="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            options={[
              { value: "compact",     label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
            ]}
            onChange={v => setTweaks("density", v)}
          />
          <TweakToggle
            label="Show agent names"
            value={tweaks.showAgentNames}
            onChange={v => setTweaks("showAgentNames", v)}
          />
          <TweakToggle
            label="Show approval gates"
            value={tweaks.showApprovalGates}
            onChange={v => setTweaks("showApprovalGates", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function ViewRouter({ view, setView }) {
  const tabsAgents = [
    { id: "orchestrator", label: "Orchestrator" },
    { id: "all",          label: "All agents", count: AGENTS.length },
    { id: "runs",         label: "Runs",       count: 184 },
    { id: "logs",         label: "Audit log" },
  ];
  const tabsApprovals = [
    { id: "pending", label: "Pending", count: APPROVALS.length },
    { id: "decided", label: "Decided" },
    { id: "rules",   label: "Rules" },
  ];

  if (view === "home") {
    return (
      <>
        <Topbar eyebrow="Today · Friday, April 24" title={"Welcome back, " + USER.name.split(" ")[0]}
          right={<><button className="btn sm ghost"><Icon.Refresh size={13}/></button></>}/>
        <div className="content"><OverviewView onNav={setView}/></div>
      </>
    );
  }
  if (view === "chat") {
    return (
      <>
        <Topbar eyebrow="Private · on your VPS" title="Ask your business"
          right={<><button className="btn sm"><Icon.Plus size={12}/> New chat</button></>}/>
        <div className="content" style={{padding: 0, display: "flex", flexDirection: "column", minHeight: 0}}><ChatView/></div>
      </>
    );
  }
  if (view === "agents") {
    return (
      <>
        <Topbar eyebrow="Hermes" title="Agent orchestrator"
          tabs={tabsAgents} activeTab="orchestrator" onTab={() => {}}
          right={<>
            <button className="btn sm"><Icon.Pause size={12}/> Pause all</button>
            <button className="btn sm primary"><Icon.Plus size={12}/> Add agent</button>
          </>}/>
        <div className="content"><OrchestratorView/></div>
      </>
    );
  }
  if (view === "approvals") {
    return (
      <>
        <Topbar eyebrow="Human in the loop" title="Approvals"
          tabs={tabsApprovals} activeTab="pending" onTab={() => {}}
          right={<button className="btn sm"><Icon.Settings size={12}/> Rules</button>}/>
        <div className="content" style={{padding: 0, display: "flex", minHeight: 0}}><ApprovalsView/></div>
      </>
    );
  }
  if (view === "leads") {
    return (
      <>
        <Topbar eyebrow="Artemis" title="Leads & pipeline"
          right={<><button className="btn sm"><Icon.Download size={12}/> Export</button></>}/>
        <div className="content"><LeadsView/></div>
      </>
    );
  }
  if (view === "content") {
    return (
      <>
        <Topbar eyebrow="Calliope · Atlas" title="Content calendar"
          right={<><button className="btn sm"><Icon.Sparkle size={12}/> Brainstorm</button></>}/>
        <div className="content"><ContentView/></div>
      </>
    );
  }
  if (view === "files") {
    return (
      <>
        <Topbar eyebrow="Hermes" title="Knowledge base"
          right={<>
            <button className="btn sm ghost"><Icon.Refresh size={12}/> Sync all</button>
            <button className="btn sm primary"><Icon.Plus size={12}/> Add source</button>
          </>}/>
        <div className="content" style={{padding: 0, display: "flex", minHeight: 0}}><KnowledgeView/></div>
      </>
    );
  }
  if (view === "flows") {
    return (
      <>
        <Topbar eyebrow="Hermes" title="Workflows"
          right={<>
            <button className="btn sm ghost"><Icon.Pause size={12}/> Pause all</button>
            <button className="btn sm primary"><Icon.Plus size={12}/> New workflow</button>
          </>}/>
        <div className="content" style={{padding: 0, display: "flex", minHeight: 0}}><WorkflowsView/></div>
      </>
    );
  }
  if (view === "settings") {
    return (
      <>
        <Topbar eyebrow="Hermes" title="Settings"/>
        <div className="content" style={{padding: 0, display: "flex", minHeight: 0}}><SettingsView/></div>
      </>
    );
  }
  if (view === "security") {
    return (
      <>
        <Topbar eyebrow="Hermes" title="Security center"
          right={<button className="btn sm ghost"><Icon.Download size={12}/> Export log</button>}/>
        <div className="content" style={{padding: 0, display: "flex", minHeight: 0}}><SecurityView/></div>
      </>
    );
  }
  return (
    <>
      <Topbar title="Not found"/>
      <div className="content"><PlaceholderView title="Not found" icon="Sparkle"/></div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
