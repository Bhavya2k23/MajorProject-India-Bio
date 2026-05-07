// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminZoneManager.tsx  ← NEW FILE
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import AdminDataTable, { Column } from './AdminDataTable';
import AdminFormModal, { FormField, FormInput, FormTextarea, FormSelect, FormRow } from './AdminFormModal';

interface Zone {
  _id: string;
  name: string;
  type: string;
  description: string;
  states?: string[];
  area?: string;
  keySpecies?: string[];
  threats?: string[];
  imageUrl?: string;
  speciesCount?: number;
  createdAt: string;
}

const ZONE_TYPES = [
  'Trans-Himalayan', 'Himalayan', 'Indian Desert', 'Semi-Arid',
  'Western Ghats', 'Deccan Peninsula', 'Gangetic Plain',
  'North-East India', 'Islands', 'Coasts', 'Other',
].map((t) => ({ value: t, label: t }));

const emptyZone = { name: '', type: '', description: '', states: '', area: '', keySpecies: '', threats: '', imageUrl: '' };

interface Props { adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>; }

export default function AdminZoneManager({ adminFetch }: Props) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyZone });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchZones = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await adminFetch(`/zones?search=${search}`);
      setZones(data.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [adminFetch, search]);

  useEffect(() => { fetchZones(); }, [fetchZones]);

  const handleAdd = () => { setEditingId(null); setFormData({ ...emptyZone }); setModalOpen(true); };

  const handleEdit = (zone: Zone) => {
    setEditingId(zone._id);
    setFormData({
      name: zone.name || '', type: zone.type || '', description: zone.description || '',
      states: zone.states?.join(', ') || '', area: zone.area || '',
      keySpecies: zone.keySpecies?.join(', ') || '', threats: zone.threats?.join(', ') || '',
      imageUrl: zone.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/zones/${id}`, { method: 'DELETE' });
      showToast('Zone deleted.'); fetchZones();
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.type) { showToast('Name and type are required.', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(), type: formData.type, description: formData.description.trim(),
        area: formData.area, imageUrl: formData.imageUrl,
        states: formData.states ? formData.states.split(',').map((s) => s.trim()).filter(Boolean) : [],
        keySpecies: formData.keySpecies ? formData.keySpecies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        threats: formData.threats ? formData.threats.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editingId) {
        await adminFetch(`/zones/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Zone updated!');
      } else {
        await adminFetch('/zones', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Zone added!');
      }
      setModalOpen(false); fetchZones();
    } catch (e: any) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const columns: Column<Zone>[] = [
    { key: 'name', label: 'Zone Name', render: (z) => <span style={{ color: '#e8f5e9', fontWeight: 600 }}>{z.name}</span> },
    { key: 'type', label: 'Type', render: (z) => <span style={{ background: 'rgba(167,139,250,0.15)', color: '#c4b5fd', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>{z.type}</span> },
    { key: 'area', label: 'Area', render: (z) => <span style={{ color: 'rgba(134,239,172,0.6)' }}>{z.area || '—'}</span> },
    { key: 'speciesCount', label: 'Species', render: (z) => <span style={{ color: '#4ade80', fontWeight: 700 }}>{z.speciesCount ?? 0}</span> },
    { key: 'states', label: 'States', render: (z) => <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 12 }}>{z.states?.slice(0, 3).join(', ') || '—'}</span> },
    { key: 'keySpecies', label: 'Key Species', render: (z) => <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 12 }}>{z.keySpecies?.slice(0, 2).join(', ') || '—'}</span> },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600 }}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>}
      <AdminDataTable title="Biogeographic Zone Management" icon="🗺️" data={zones} columns={columns} loading={loading} error={error} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} searchValue={search} onSearchChange={setSearch} addLabel="Add Zone" />
      <AdminFormModal isOpen={modalOpen} title={editingId ? '✏️ Edit Zone' : '➕ Add Zone'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} loading={saving} submitLabel={editingId ? 'Update' : 'Add'} size="lg">
        <FormRow cols={2}>
          <FormField label="Zone Name" required><FormInput placeholder="e.g. Western Ghats" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required /></FormField>
          <FormField label="Zone Type" required><FormSelect value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))} options={ZONE_TYPES} /></FormField>
        </FormRow>
        <FormField label="Description"><FormTextarea placeholder="Describe this biogeographic zone..." value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} /></FormField>
        <FormRow cols={2}>
          <FormField label="Area"><FormInput placeholder="e.g. 160,000 km²" value={formData.area} onChange={(e) => setFormData((f) => ({ ...f, area: e.target.value }))} /></FormField>
          <FormField label="Image URL"><FormInput placeholder="https://..." value={formData.imageUrl} onChange={(e) => setFormData((f) => ({ ...f, imageUrl: e.target.value }))} /></FormField>
        </FormRow>
        <FormField label="States / Union Territories" hint="Comma-separated"><FormInput placeholder="e.g. Kerala, Karnataka, Goa" value={formData.states} onChange={(e) => setFormData((f) => ({ ...f, states: e.target.value }))} /></FormField>
        <FormField label="Key Species" hint="Comma-separated"><FormInput placeholder="e.g. Lion-tailed Macaque, Malabar Civet" value={formData.keySpecies} onChange={(e) => setFormData((f) => ({ ...f, keySpecies: e.target.value }))} /></FormField>
        <FormField label="Major Threats" hint="Comma-separated"><FormInput placeholder="e.g. Deforestation, Human-wildlife conflict" value={formData.threats} onChange={(e) => setFormData((f) => ({ ...f, threats: e.target.value }))} /></FormField>
      </AdminFormModal>
    </div>
  );
}