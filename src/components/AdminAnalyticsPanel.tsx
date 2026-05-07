// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminAnalyticsPanel.tsx  ← NEW FILE
// ============================================================
import React, { useEffect, useState } from 'react';

interface Props { adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>; }

const STATUS_COLORS: Record<string, string> = {
  'Critically Endangered': '#ef4444', 'Endangered': '#f97316', 'Vulnerable': '#eab308',
  'Near Threatened': '#84cc16', 'Least Concern': '#22c55e', 'Data Deficient': '#94a3b8',
  'Extinct in Wild': '#7c3aed', 'Extinct': '#374151',
};

const GREENS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#84cc16', '#a3e635', '#bbf7d0', '#86efac'];

export default function AdminAnalyticsPanel({ adminFetch }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminFetch('/dashboard/stats');
        setStats(data.data);
      } catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    };
    load();
  }, [adminFetch]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div style={{ width: 40, height: 40, border: '3px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (error) return <div style={{ color: '#fca5a5', padding: 20 }}>⚠️ {error}</div>;
  if (!stats) return null;

  const { overview, charts } = stats;
  const total = charts.speciesByConservation.reduce((s: number, x: any) => s + x.count, 0) || 1;
  const endangeredTotal = charts.speciesByConservation
    .filter((s: any) => ['Critically Endangered', 'Endangered', 'Vulnerable'].includes(s._id))
    .reduce((s: number, x: any) => s + x.count, 0);
  const threatRate = total > 0 ? ((endangeredTotal / total) * 100).toFixed(1) : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ color: '#e8f5e9', fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'Georgia', serif" }}>📈 Biodiversity Analytics</h2>
        <p style={{ color: 'rgba(134,239,172,0.5)', fontSize: 13, margin: '4px 0 0' }}>In-depth analysis of biodiversity data</p>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Threat Rate', value: `${threatRate}%`, desc: 'Species under threat', icon: '⚠️', color: '#f97316' },
          { label: 'Data Coverage', value: `${((overview.totalSpecies / Math.max(overview.totalSpecies, 1)) * 100).toFixed(0)}%`, desc: 'Species documented', icon: '📊', color: '#06b6d4' },
          { label: 'Ecosystems/Zone', value: (overview.totalEcosystems / Math.max(overview.totalZones, 1)).toFixed(1), desc: 'Average density', icon: '🌳', color: '#a78bfa' },
          { label: 'Species/Ecosystem', value: (overview.totalSpecies / Math.max(overview.totalEcosystems, 1)).toFixed(1), desc: 'Average per ecosystem', icon: '🦁', color: '#22c55e' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: `${kpi.color}12`, border: `1px solid ${kpi.color}30`, borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{kpi.icon}</div>
            <div style={{ color: kpi.color, fontSize: 28, fontWeight: 800, lineHeight: 1, fontFamily: "'Georgia', serif" }}>{kpi.value}</div>
            <div style={{ color: '#e8f5e9', fontSize: 13, fontWeight: 600, marginTop: 4 }}>{kpi.label}</div>
            <div style={{ color: 'rgba(134,239,172,0.5)', fontSize: 11, marginTop: 2 }}>{kpi.desc}</div>
          </div>
        ))}
      </div>

      {/* Threat Level Breakdown */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 16, padding: '22px' }}>
        <h3 style={{ color: '#e8f5e9', fontSize: 16, fontWeight: 700, margin: '0 0 18px' }}>🔴 Conservation Status Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {charts.speciesByConservation.map((item: any) => {
            const pct = total > 0 ? (item.count / total) * 100 : 0;
            const color = STATUS_COLORS[item._id] || '#94a3b8';
            return (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ color: 'rgba(167,243,208,0.7)', fontSize: 13, width: 190, flexShrink: 0 }}>{item._id || 'Unknown'}</span>
                <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 5, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ color: color, fontWeight: 700, fontSize: 14, width: 36, textAlign: 'right' }}>{item.count}</span>
                <span style={{ color: 'rgba(134,239,172,0.4)', fontSize: 12, width: 42, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two column charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {/* Ecosystem breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 16, padding: '22px' }}>
          <h3 style={{ color: '#e8f5e9', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>🌳 Top Ecosystems by Species</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {charts.speciesByEcosystem.slice(0, 8).map((item: any, i: number) => {
              const maxCount = charts.speciesByEcosystem[0]?.count || 1;
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 11, width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: 'rgba(167,243,208,0.7)', fontSize: 12, width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item._id || 'Unknown'}</span>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: GREENS[i % GREENS.length], borderRadius: 4 }} />
                  </div>
                  <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, width: 28, textAlign: 'right' }}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 16, padding: '22px' }}>
          <h3 style={{ color: '#e8f5e9', fontSize: 15, fontWeight: 700, margin: '0 0 16px' }}>🗺️ Top Zones by Species</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {charts.speciesByZone.slice(0, 8).map((item: any, i: number) => {
              const maxCount = charts.speciesByZone[0]?.count || 1;
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 11, width: 16, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: 'rgba(167,243,208,0.7)', fontSize: 12, width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item._id || 'Unknown'}</span>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: GREENS[(i + 3) % GREENS.length], borderRadius: 4 }} />
                  </div>
                  <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700, width: 28, textAlign: 'right' }}>{item.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary insights */}
      <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 16, padding: '20px 22px' }}>
        <h3 style={{ color: '#e8f5e9', fontSize: 15, fontWeight: 700, margin: '0 0 14px' }}>🔬 Biodiversity Intelligence Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { label: 'Total Species Documented', value: overview.totalSpecies, icon: '🦁' },
            { label: 'Under Threat (3 categories)', value: endangeredTotal, icon: '⚠️' },
            { label: 'Biogeographic Zones', value: overview.totalZones, icon: '🗺️' },
            { label: 'Distinct Ecosystems', value: overview.totalEcosystems, icon: '🌳' },
            { label: 'Quiz Questions Available', value: overview.totalQuizQuestions, icon: '❓' },
            { label: 'Threat Rate', value: `${threatRate}%`, icon: '📊' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ color: '#4ade80', fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{item.value}</div>
                <div style={{ color: 'rgba(134,239,172,0.55)', fontSize: 11, marginTop: 2 }}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}