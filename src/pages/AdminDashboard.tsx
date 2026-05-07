// ============================================================
// FILE: india-s-wild-explorer/src/pages/AdminDashboard.tsx
//
// FIX APPLIED:
//   BUG — `styles` object uses `React.CSSProperties` as the type
//         annotation, and loading/spinner vars also use it, but
//         `React` was never imported. TypeScript throws:
//         "Cannot find name 'React'."
//         ADDED: import React from 'react'
// ============================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdmin from '../hooks/useAdmin';
import AdminSidebar, { AdminSection } from '../components/AdminSidebar';
import AdminDashboardOverview from '../components/AdminDashboardOverview';
import AdminSpeciesManager from '../components/AdminSpeciesManager';
import AdminEcosystemManager from '../components/AdminEcosystemManager';
import AdminZoneManager from '../components/AdminZoneManager';
import AdminQuizManager from '../components/AdminQuizManager';
import AdminAnalyticsPanel from '../components/AdminAnalyticsPanel';
import AdminMapDataManager from '../components/AdminMapDataManager';

const SECTION_LABELS: Record<AdminSection, string> = {
  dashboard:  'Dashboard Overview',
  species:    'Species Management',
  ecosystems: 'Ecosystem Management',
  zones:      'Biogeographic Zones',
  quiz:       'Quiz Management',
  analytics:  'Biodiversity Analytics',
  map:        'Map Data Management',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, admin, logout, adminFetch } = useAdmin();
  const [activeSection, setActiveSection]       = useState<AdminSection>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  if (isLoading) {
    return (
      <div style={loadingPageStyle}>
        <div style={spinnerStyle} />
        <style>{spinKeyframes}</style>
      </div>
    );
  }

  if (!isAuthenticated || !admin) return null;

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        adminName={admin.username}
        adminRole={admin.role}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div style={styles.mainArea}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={styles.breadcrumb}>
            <span
              style={styles.breadcrumbHome}
              onClick={() => setActiveSection('dashboard')}
            >
              🏠 Admin
            </span>
            <span style={styles.breadcrumbSep}>›</span>
            <span style={styles.breadcrumbCurrent}>{SECTION_LABELS[activeSection]}</span>
          </div>

          <div style={styles.topBarRight}>
            <a href="/" target="_blank" style={styles.siteLink} rel="noreferrer">
              🌿 View Site ↗
            </a>
            <div style={styles.adminChip}>
              <div style={styles.chipAvatar}>
                {admin.username.charAt(0).toUpperCase()}
              </div>
              <span style={styles.chipName}>{admin.username}</span>
              <span style={styles.chipRole}>{admin.role}</span>
            </div>
          </div>
        </header>

        {/* Section Content */}
        <main style={styles.content}>
          {activeSection === 'dashboard'  && <AdminDashboardOverview adminFetch={adminFetch} />}
          {activeSection === 'species'    && <AdminSpeciesManager    adminFetch={adminFetch} />}
          {activeSection === 'ecosystems' && <AdminEcosystemManager  adminFetch={adminFetch} />}
          {activeSection === 'zones'      && <AdminZoneManager       adminFetch={adminFetch} />}
          {activeSection === 'quiz'       && <AdminQuizManager       adminFetch={adminFetch} />}
          {activeSection === 'analytics'  && <AdminAnalyticsPanel    adminFetch={adminFetch} />}
          {activeSection === 'map'        && <AdminMapDataManager    adminFetch={adminFetch} />}
        </main>
      </div>

      {/* Global styles for scrollbar, focus rings, animations */}
      <style>{globalStyles}</style>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────
// React.CSSProperties now resolves correctly with the import above
const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0b1a10',
    fontFamily: "'Georgia', serif",
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 60,
    background: 'rgba(10, 22, 16, 0.95)',
    borderBottom: '1px solid rgba(34,197,94,0.12)',
    flexShrink: 0,
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    gap: 12,
    flexWrap: 'wrap',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  breadcrumbHome: {
    color: 'rgba(134,239,172,0.5)',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'color 0.15s',
  },
  breadcrumbSep: {
    color: 'rgba(134,239,172,0.3)',
    fontSize: 14,
  },
  breadcrumbCurrent: {
    color: '#e8f5e9',
    fontSize: 13,
    fontWeight: 600,
  },
  topBarRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  siteLink: {
    color: 'rgba(134,239,172,0.6)',
    fontSize: 12,
    textDecoration: 'none',
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.2)',
    borderRadius: 8,
    padding: '4px 10px',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  },
  adminChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(34,197,94,0.08)',
    border: '1px solid rgba(34,197,94,0.15)',
    borderRadius: 20,
    padding: '4px 12px 4px 6px',
  },
  chipAvatar: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #16a34a, #059669)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 800,
    fontSize: 12,
  },
  chipName: {
    color: '#e8f5e9',
    fontSize: 13,
    fontWeight: 600,
  },
  chipRole: {
    color: 'rgba(134,239,172,0.5)',
    fontSize: 11,
    textTransform: 'capitalize' as const,
  },
  content: {
    flex: 1,
    padding: '28px',
    overflowY: 'auto',
    minHeight: 0,
  },
};

const loadingPageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0b1a10',
};

const spinnerStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  border: '4px solid rgba(34,197,94,0.15)',
  borderTopColor: '#22c55e',
  borderRadius: '50%',
  animation: 'adminSpin 0.8s linear infinite',
};

const spinKeyframes = `@keyframes adminSpin { to { transform: rotate(360deg); } }`;

const globalStyles = `
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
  ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(34,197,94,0.5); }
  input, textarea, select { transition: border-color 0.2s, box-shadow 0.2s; }
  input:focus, textarea:focus, select:focus {
    border-color: rgba(34,197,94,0.5) !important;
    box-shadow: 0 0 0 3px rgba(34,197,94,0.1) !important;
  }
  @keyframes adminSpin { to { transform: rotate(360deg); } }
`;