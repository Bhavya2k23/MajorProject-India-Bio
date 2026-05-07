// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminMapDataManager.tsx  ← NEW FILE
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import AdminFormModal, { FormField, FormInput, FormRow } from './AdminFormModal';

interface MapSpecies {
  _id: string;
  name: string;
  scientificName: string;
  conservationStatus: string;
  coordinates?: { lat: number; lng: number; locationName?: string };
  ecosystem?: { name: string };
  zone?: { name: string };
  imageUrl?: string;
}

const STATUS_COLORS: Record<string, string> = {
  'Critically Endangered': '#ef4444', 'Endangered': '#f97316', 'Vulnerable': '#eab308',
  'Near Threatened': '#84cc16', 'Least Concern': '#22c55e', 'Data Deficient': '#94a3b8',
};

interface Props { adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>; }

export default function AdminMapDataManager({ adminFetch }: Props) {
  const [species, setSpecies] = useState<MapSpecies[]>([]);
  const [allSpecies, setAllSpecies] = useState<MapSpecies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpecies, setEditingSpecies] = useState<MapSpecies | null>(null);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locationName, setLocationName] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [viewMode, setViewMode] = useState<'mapped' | 'all'>('mapped');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMapSpecies = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [mapData, allData] = await Promise.all([
        adminFetch('/map/species'),
        adminFetch('/species?limit=200'),
      ]);
      setSpecies(mapData.data);
      setAllSpecies(allData.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [adminFetch]);

  useEffect(() => { fetchMapSpecies(); }, [fetchMapSpecies]);

  const handleEditCoords = (sp: MapSpecies) => {
    setEditingSpecies(sp);
    setLat(sp.coordinates?.lat != null ? String(sp.coordinates.lat) : '');
    setLng(sp.coordinates?.lng != null ? String(sp.coordinates.lng) : '');
    setLocationName(sp.coordinates?.locationName || '');
    setModalOpen(true);
  };

  const handleSaveCoords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpecies) return;
    if (!lat || !lng) { showToast('Latitude and Longitude are required.', 'error'); return; }
    setSaving(true);
    try {
      await adminFetch(`/map/species/${editingSpecies._id}/coordinates`, {
        method: 'PATCH',
        body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng), locationName }),
      });
      showToast('Coordinates updated!');
      setModalOpen(false);
      fetchMapSpecies();
    } catch (e: any) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const displayList = viewMode === 'mapped'
    ? species.filter((sp) => !search || sp.name.toLowerCase().includes(search.toLowerCase()))
    : allSpecies.filter((sp) => !search || sp.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600 }}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ color: '#e8f5e9', fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'Georgia', serif" }}>📍 Map Data Management</h2>
          <p style={{ color: 'rgba(134,239,172,0.5)', fontSize: 13, margin: '4px 0 0' }}>
            {species.length} species mapped · {allSpecies.length} total species
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['mapped', 'all'].map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode as any)} style={{ background: viewMode === mode ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${viewMode === mode ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '7px 14px', color: viewMode === mode ? '#4ade80' : 'rgba(167,243,208,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>
              {mode === 'mapped' ? '📍 Mapped Only' : '🦁 All Species'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
        <input type="text" placeholder="Search species..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '9px 12px 9px 36px', color: '#e8f5e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13 }}>⚠️ {error}</div>}

      {/* Species Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {displayList.map((sp) => {
            const hasCords = sp.coordinates?.lat != null && sp.coordinates?.lng != null;
            return (
              <div key={sp._id} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${hasCords ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 14, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {sp.imageUrl ? <img src={sp.imageUrl} alt={sp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 20 }}>🦁</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#e8f5e9', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.name}</div>
                  <div style={{ color: 'rgba(134,239,172,0.5)', fontSize: 12, fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.scientificName}</div>
                  {hasCords ? (
                    <div style={{ color: '#4ade80', fontSize: 11, marginTop: 4 }}>
                      📍 {sp.coordinates!.lat.toFixed(4)}, {sp.coordinates!.lng.toFixed(4)}
                      {sp.coordinates!.locationName && ` · ${sp.coordinates!.locationName}`}
                    </div>
                  ) : (
                    <div style={{ color: 'rgba(239,68,68,0.7)', fontSize: 11, marginTop: 4 }}>⚠️ No coordinates set</div>
                  )}
                </div>
                <button onClick={() => handleEditCoords(sp)} style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '6px 10px', color: '#4ade80', cursor: 'pointer', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                  {hasCords ? '✏️' : '📍'} {hasCords ? 'Edit' : 'Set'}
                </button>
              </div>
            );
          })}
          {displayList.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'rgba(134,239,172,0.5)' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
              <p>No species found.</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Coordinates Modal */}
      <AdminFormModal
        isOpen={modalOpen}
        title={`📍 Set Coordinates — ${editingSpecies?.name || ''}`}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveCoords}
        loading={saving}
        submitLabel="Save Coordinates"
        size="sm"
      >
        <div style={{ background: 'rgba(34,197,94,0.06)', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: 'rgba(134,239,172,0.6)', marginBottom: 4 }}>
          💡 Use decimal degrees format. India range: Lat 8–37°N, Lng 68–97°E
        </div>
        <FormRow cols={2}>
          <FormField label="Latitude" required>
            <FormInput type="number" step="0.0001" min="-90" max="90" placeholder="e.g. 20.5937" value={lat} onChange={(e) => setLat(e.target.value)} required />
          </FormField>
          <FormField label="Longitude" required>
            <FormInput type="number" step="0.0001" min="-180" max="180" placeholder="e.g. 78.9629" value={lng} onChange={(e) => setLng(e.target.value)} required />
          </FormField>
        </FormRow>
        <FormField label="Location Name" hint="e.g. National Park or region name">
          <FormInput placeholder="e.g. Jim Corbett National Park, Uttarakhand" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
        </FormField>
        {lat && lng && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: '#86efac', textAlign: 'center' }}>
            📍 Preview: {parseFloat(lat).toFixed(4)}°N, {parseFloat(lng).toFixed(4)}°E
          </div>
        )}
      </AdminFormModal>
    </div>
  );
}