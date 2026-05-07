// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminDashboardOverview.tsx  ← NEW FILE
// ============================================================
import React, { useEffect, useState } from 'react';

interface DashboardStats {
  overview: {
    totalSpecies: number;
    endangeredCount: number;
    totalEcosystems: number;
    totalZones: number;
    totalQuizQuestions: number;
  };
  charts: {
    speciesByConservation: { _id: string; count: number }[];
    speciesByEcosystem: { _id: string; count: number }[];
    speciesByZone: { _id: string; count: number }[];
  };
  recentSpecies: {
    _id: string;
    name: string;
    scientificName: string;
    conservationStatus: string;
    imageUrl?: string;
    createdAt: string;
  }[];
}

interface Props {
  adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const STATUS_COLORS: Record<string, string> = {
  'Critically Endangered': '#ef4444',
  Endangered: '#f97316',
  Vulnerable: '#eab308',
  'Near Threatened': '#84cc16',
  'Least Concern': '#22c55e',
  'Data Deficient': '#94a3b8',
  'Extinct in Wild': '#7c3aed',
  Extinct: '#374151',
};

const PALETTE = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];

export default function AdminDashboardOverview({ adminFetch }: Props) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminFetch('/dashboard/stats');
        setStats(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [adminFetch]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;
  if (!stats) return null;

  const { overview, charts, recentSpecies } = stats;

  // Build bar chart data
  const maxEcoCount = Math.max(...charts.speciesByEcosystem.map((e) => e.count), 1);
  const maxZoneCount = Math.max(...charts.speciesByZone.map((z) => z.count), 1);

  return (
    <div style={styles.container}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>Dashboard Overview</h2>
          <p style={styles.pageDesc}>Real-time biodiversity intelligence summary</p>
        </div>
        <div style={styles.liveIndicator}>
          <span style={styles.liveDot} />
          <span style={styles.liveText}>Live Data</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {[
          { label: 'Total Species', value: overview.totalSpecies, icon: '🦁', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Endangered Species', value: overview.endangeredCount, icon: '⚠️', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
          { label: 'Ecosystems', value: overview.totalEcosystems, icon: '🌳', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
          { label: 'Biogeographic Zones', value: overview.totalZones, icon: '🗺️', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
          { label: 'Quiz Questions', value: overview.totalQuizQuestions, icon: '❓', color: '#fb923c', bg: 'rgba(251,146,60,0.1)' },
        ].map((stat) => (
          <div key={stat.label} style={{ ...styles.statCard, background: stat.bg, borderColor: `${stat.color}33` }}>
            <div style={styles.statIconWrap}>
              <span style={styles.statIcon}>{stat.icon}</span>
            </div>
            <div style={styles.statInfo}>
              <span style={{ ...styles.statValue, color: stat.color }}>{stat.value.toLocaleString()}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {/* Conservation Status Donut */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🔴 Conservation Status Distribution</h3>
          <div style={styles.donutContainer}>
            {charts.speciesByConservation.map((item, i) => {
              const color = STATUS_COLORS[item._id] || '#94a3b8';
              const total = charts.speciesByConservation.reduce((s, x) => s + x.count, 0);
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={i} style={styles.statusRow}>
                  <div style={{ ...styles.statusDot, background: color }} />
                  <span style={styles.statusName}>{item._id || 'Unknown'}</span>
                  <div style={styles.statusBarWrap}>
                    <div style={{ ...styles.statusBar, width: `${pct}%`, background: color }} />
                  </div>
                  <span style={styles.statusCount}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Species by Ecosystem Bar */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🌳 Species by Ecosystem</h3>
          <div style={styles.barChart}>
            {charts.speciesByEcosystem.slice(0, 8).map((item, i) => (
              <div key={i} style={styles.barRow}>
                <span style={styles.barLabel}>{item._id?.slice(0, 16) || 'Unknown'}</span>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(item.count / maxEcoCount) * 100}%`,
                      background: PALETTE[i % PALETTE.length],
                    }}
                  />
                </div>
                <span style={styles.barValue}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Species by Zone Bar */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>🗺️ Species by Biogeographic Zone</h3>
          <div style={styles.barChart}>
            {charts.speciesByZone.slice(0, 8).map((item, i) => (
              <div key={i} style={styles.barRow}>
                <span style={styles.barLabel}>{item._id?.slice(0, 16) || 'Unknown'}</span>
                <div style={styles.barTrack}>
                  <div
                    style={{
                      ...styles.barFill,
                      width: `${(item.count / maxZoneCount) * 100}%`,
                      background: PALETTE[(i + 4) % PALETTE.length],
                    }}
                  />
                </div>
                <span style={styles.barValue}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Species */}
      {recentSpecies.length > 0 && (
        <div style={styles.recentCard}>
          <h3 style={styles.chartTitle}>🕒 Recently Added Species</h3>
          <div style={styles.recentList}>
            {recentSpecies.map((sp) => (
              <div key={sp._id} style={styles.recentItem}>
                <div style={styles.recentAvatar}>
                  {sp.imageUrl ? (
                    <img src={sp.imageUrl} alt={sp.name} style={styles.recentImg} />
                  ) : (
                    <span style={{ fontSize: 20 }}>🦁</span>
                  )}
                </div>
                <div style={styles.recentInfo}>
                  <span style={styles.recentName}>{sp.name}</span>
                  <span style={styles.recentSci}>{sp.scientificName}</span>
                </div>
                <div
                  style={{
                    ...styles.statusBadge,
                    background: `${STATUS_COLORS[sp.conservationStatus] || '#94a3b8'}22`,
                    color: STATUS_COLORS[sp.conservationStatus] || '#94a3b8',
                    borderColor: `${STATUS_COLORS[sp.conservationStatus] || '#94a3b8'}44`,
                  }}
                >
                  {sp.conservationStatus}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ color: 'rgba(134,239,172,0.6)', fontSize: 14 }}>Loading dashboard data...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div style={{ padding: 40, textAlign: 'center', color: '#fca5a5' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
      <p>{message}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 24 },
  pageHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  pageTitle: { color: '#e8f5e9', fontSize: 24, fontWeight: 800, margin: 0, fontFamily: "'Georgia', serif" },
  pageDesc: { color: 'rgba(134,239,172,0.5)', fontSize: 14, margin: '4px 0 0' },
  liveIndicator: { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '6px 14px' },
  liveDot: { width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'pulse 2s ease-in-out infinite' },
  liveText: { color: '#86efac', fontSize: 12, fontWeight: 600 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 },
  statCard: { borderRadius: 16, border: '1px solid', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 },
  statIconWrap: { width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statIcon: { fontSize: 22 },
  statInfo: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  statValue: { fontSize: 26, fontWeight: 800, lineHeight: 1, fontFamily: "'Georgia', serif" },
  statLabel: { color: 'rgba(167,243,208,0.6)', fontSize: 12, fontWeight: 500 },
  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  chartCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 16, padding: '20px 20px', display: 'flex', flexDirection: 'column', gap: 16 },
  chartTitle: { color: '#e8f5e9', fontSize: 15, fontWeight: 700, margin: 0 },
  donutContainer: { display: 'flex', flexDirection: 'column', gap: 8 },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  statusName: { color: 'rgba(167,243,208,0.7)', fontSize: 12, width: 140, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statusBarWrap: { flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' },
  statusBar: { height: '100%', borderRadius: 4, transition: 'width 0.6s ease' },
  statusCount: { color: '#e8f5e9', fontSize: 12, fontWeight: 700, width: 32, textAlign: 'right' },
  barChart: { display: 'flex', flexDirection: 'column', gap: 10 },
  barRow: { display: 'flex', alignItems: 'center', gap: 8 },
  barLabel: { color: 'rgba(167,243,208,0.7)', fontSize: 11, width: 110, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barTrack: { flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, transition: 'width 0.6s ease' },
  barValue: { color: '#e8f5e9', fontSize: 12, fontWeight: 700, width: 28, textAlign: 'right' },
  recentCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 16, padding: '20px' },
  recentList: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 },
  recentItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 12 },
  recentAvatar: { width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  recentImg: { width: '100%', height: '100%', objectFit: 'cover' },
  recentInfo: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  recentName: { color: '#e8f5e9', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  recentSci: { color: 'rgba(134,239,172,0.5)', fontSize: 12, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  statusBadge: { fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: '1px solid', whiteSpace: 'nowrap', flexShrink: 0 },
};