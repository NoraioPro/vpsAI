// Icon library — line icons, 1.5px stroke, 16px default.

const I = ({ children, size = 16, stroke = 1.5, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flex: "none", ...style }}
  >
    {children}
  </svg>
);

const Icon = {
  Hermes: (p) => (
    <I {...p}>
      <path d="M12 3v18" />
      <path d="M8 6c2 2 4 2 4 0" />
      <path d="M16 6c-2 2-4 2-4 0" />
      <path d="M8 10c2 2 4 2 4 0" />
      <path d="M16 10c-2 2-4 2-4 0" />
      <path d="M6 4l2 2" />
      <path d="M18 4l-2 2" />
    </I>
  ),
  Home:     (p) => <I {...p}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></I>,
  Chat:     (p) => <I {...p}><path d="M4 5h16v11H9l-5 4V5z"/></I>,
  Agents:   (p) => <I {...p}><circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/></I>,
  Approvals:(p) => <I {...p}><path d="M20 6L9 17l-5-5"/></I>,
  Leads:    (p) => <I {...p}><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><path d="M17 11l2 2 4-4"/></I>,
  Content:  (p) => <I {...p}><rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M8 4v5"/></I>,
  Flows:    (p) => <I {...p}><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3h12V9M12 12v3"/></I>,
  Files:    (p) => <I {...p}><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/></I>,
  Settings: (p) => <I {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></I>,
  Shield:   (p) => <I {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z"/></I>,
  Send:     (p) => <I {...p}><path d="M4 20l16-8L4 4l3 8-3 8z"/><path d="M7 12h13"/></I>,
  Plus:     (p) => <I {...p}><path d="M12 5v14M5 12h14"/></I>,
  Play:     (p) => <I {...p}><path d="M6 4l14 8-14 8V4z"/></I>,
  Pause:    (p) => <I {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></I>,
  Search:   (p) => <I {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></I>,
  Check:    (p) => <I {...p}><path d="M20 6L9 17l-5-5"/></I>,
  X:        (p) => <I {...p}><path d="M6 6l12 12M18 6L6 18"/></I>,
  ArrowRight:(p)=> <I {...p}><path d="M5 12h14M13 5l7 7-7 7"/></I>,
  ArrowUp:  (p) => <I {...p}><path d="M12 19V5M5 12l7-7 7 7"/></I>,
  ArrowDown:(p) => <I {...p}><path d="M12 5v14M5 12l7 7 7-7"/></I>,
  More:     (p) => <I {...p}><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></I>,
  Clock:    (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></I>,
  Calendar: (p) => <I {...p}><rect x="3" y="4" width="18" height="17" rx="1"/><path d="M3 9h18M8 2v4M16 2v4"/></I>,
  Mic:      (p) => <I {...p}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></I>,
  Paperclip:(p) => <I {...p}><path d="M21 11l-9 9a5 5 0 01-7-7l9-9a3 3 0 014 4l-9 9a1 1 0 01-2-2l8-8"/></I>,
  Sparkle:  (p) => <I {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 3l.6 1.8L21 5.5l-1.4.7L19 8l-.6-1.8L17 5.5l1.4-.7L19 3z"/></I>,
  Bolt:     (p) => <I {...p}><path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/></I>,
  Server:   (p) => <I {...p}><rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01"/></I>,
  Lock:     (p) => <I {...p}><rect x="4" y="11" width="16" height="10" rx="1"/><path d="M8 11V7a4 4 0 018 0v4"/></I>,
  VPN:      (p) => <I {...p}><path d="M3 12a9 9 0 0018 0M3 12a9 9 0 019-9M3 12a9 9 0 019 9M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></I>,
  Bell:     (p) => <I {...p}><path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></I>,
  Eye:      (p) => <I {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></I>,
  Upload:   (p) => <I {...p}><path d="M4 17v3h16v-3M12 3v13M6 9l6-6 6 6"/></I>,
  Download: (p) => <I {...p}><path d="M4 17v3h16v-3M12 3v13M6 11l6 6 6-6"/></I>,
  Folder:   (p) => <I {...p}><path d="M3 6a1 1 0 011-1h5l2 2h9a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V6z"/></I>,
  Database: (p) => <I {...p}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></I>,
  Mail:     (p) => <I {...p}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/></I>,
  User:     (p) => <I {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></I>,
  Refresh:  (p) => <I {...p}><path d="M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5"/><path d="M18 3v5h-5M6 21v-5h5"/></I>,
  Dot:      (p) => <I {...p}><circle cx="12" cy="12" r="2" fill="currentColor"/></I>,
  Globe:    (p) => <I {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></I>,
  Building: (p) => <I {...p}><rect x="4" y="3" width="16" height="18"/><path d="M9 8h.01M15 8h.01M9 12h.01M15 12h.01M9 16h.01M15 16h.01"/></I>,
  TrendUp:  (p) => <I {...p}><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></I>,
};

window.Icon = Icon;
