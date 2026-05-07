// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminSidebar.tsx  ← NEW FILE
// ============================================================
import React from 'react';

export type AdminSection =
  | 'dashboard'
  | 'species'
  | 'ecosystems'
  | 'zones'
  | 'quiz'
  | 'analytics'
  | 'map';

interface SidebarProps {
  activeSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  adminName: string;
  adminRole: string;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: AdminSection; icon: string; label: string; badge?: string }[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard Overview' },
  { id: 'species', icon: '🦁', label: 'Species Management' },
  { id: 'ecosystems', icon: '🌳', label: 'Ecosystems' },
  { id: 'zones', icon: '🗺️', label: 'Biogeographic Zones' },
  { id: 'quiz', icon: '❓', label: 'Quiz Management' },
  { id: 'analytics', icon: '📈', label: 'Analytics Panel' },
  { id: 'map', icon: '📍', label: 'Map Data' },
];

export default function AdminSidebar({
  activeSection,
  onNavigate,
  adminName,
  adminRole,
  onLogout,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <aside
      style={{
        ...styles.sidebar,
        width: collapsed ? 72 : 260,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Header */}
      <div style={styles.sidebarHeader}>
        <div style={styles.logoArea}>
          <span style={styles.logoEmoji}>🌿</span>
          {!collapsed && (
            <div style={styles.logoText}>
              <span style={styles.logoTitle}>BioAdmin</span>
              <span style={styles.logoVersion}>v1.0</span>
            </div>
          )}
        </div>
        <button style={styles.collapseBtn} onClick={onToggleCollapse}>
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navSection}>
          {!collapsed && <span style={styles.navLabel}>MAIN MENU</span>}
          {navItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...styles.navItem,
                ...(activeSection === item.id ? styles.navItemActive : {}),
              }}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span style={styles.navItemLabel}>{item.label}</span>}
              {!collapsed && activeSection === item.id && (
                <span style={styles.activeIndicator} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* User Info + Logout */}
      <div style={styles.sidebarFooter}>
        {!collapsed && (
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div style={styles.adminDetails}>
              <span style={styles.adminName}>{adminName}</span>
              <span style={styles.adminRole}>{adminRole}</span>
            </div>
          </div>
        )}
        <button
          style={styles.logoutBtn}
          onClick={onLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    height: '100vh',
    background: 'linear-gradient(180deg, #0a1628 0%, #0d2818 50%, #0a1628 100%)',
    borderRight: '1px solid rgba(34,197,94,0.15)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'sticky',
    top: 0,
    overflowX: 'hidden',
    zIndex: 100,
  },
  sidebarHeader: {
    padding: '20px 14px 16px',
    borderBottom: '1px solid rgba(34,197,94,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    overflow: 'hidden',
  },
  logoEmoji: {
    fontSize: 26,
    flexShrink: 0,
    filter: 'drop-shadow(0 0 8px rgba(34,197,94,0.5))',
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  logoTitle: {
    color: '#e8f5e9',
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: '0.04em',
    fontFamily: "'Georgia', serif",
    whiteSpace: 'nowrap',
  },
  logoVersion: {
    color: 'rgba(134,239,172,0.5)',
    fontSize: 10,
    letterSpacing: '0.12em',
  },
  collapseBtn: {
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 6,
    color: '#86efac',
    width: 24,
    height: 24,
    cursor: 'pointer',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: 0,
    lineHeight: 1,
  },
  nav: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  navSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  navLabel: {
    color: 'rgba(134,239,172,0.35)',
    fontSize: 10,
    letterSpacing: '0.15em',
    fontWeight: 700,
    padding: '8px 6px 4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 10px',
    borderRadius: 10,
    background: 'transparent',
    border: 'none',
    color: 'rgba(167,243,208,0.6)',
    cursor: 'pointer',
    fontSize: 14,
    width: '100%',
    textAlign: 'left',
    position: 'relative',
    transition: 'all 0.18s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  navItemActive: {
    background: 'rgba(34,197,94,0.15)',
    color: '#86efac',
    fontWeight: 600,
    border: '1px solid rgba(34,197,94,0.25)',
  },
  navIcon: {
    fontSize: 17,
    flexShrink: 0,
    width: 20,
    textAlign: 'center',
  },
  navItemLabel: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#4ade80',
    flexShrink: 0,
    boxShadow: '0 0 6px #4ade80',
  },
  sidebarFooter: {
    padding: '12px 10px 16px',
    borderTop: '1px solid rgba(34,197,94,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 6px',
    overflow: 'hidden',
  },
  adminAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #16a34a, #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
  },
  adminDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  adminName: {
    color: '#e8f5e9',
    fontSize: 13,
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  adminRole: {
    color: 'rgba(134,239,172,0.5)',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '9px 10px',
    borderRadius: 10,
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.2)',
    color: '#fca5a5',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    width: '100%',
    transition: 'all 0.18s',
  },
};