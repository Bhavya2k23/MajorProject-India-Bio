// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminEcosystemManager.tsx  ← NEW FILE
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import AdminDataTable, { Column } from './AdminDataTable';
import AdminFormModal, { FormField, FormInput, FormTextarea, FormSelect, FormRow } from './AdminFormModal';

interface Ecosystem {
  _id: string;
  name: string;
  type: string;
  description: string;
  climate?: string;
  states?: string[];
  keyFeatures?: string[];
  threats?: string[];
  imageUrl?: string;
  speciesCount?: number;
  createdAt: string;
}

const ECO_TYPES = ['Forest', 'Wetland', 'Marine', 'Grassland', 'Desert', 'Mountain', 'Coastal', 'Freshwater', 'Mangrove', 'Other'].map((t) => ({ value: t, label: t }));
const emptyEco = { name: '', type: '', description: '', climate: '', states: '', keyFeatures: '', threats: '', imageUrl: '' };

interface Props { adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>; }

export default function AdminEcosystemManager({ adminFetch }: Props) {
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyEco });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEcosystems = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ search });
      const data = await adminFetch(`/ecosystems?${params}`);
      setEcosystems(data.data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [adminFetch, search]);

  useEffect(() => { fetchEcosystems(); }, [fetchEcosystems]);

  const handleAdd = () => { setEditingId(null); setFormData({ ...emptyEco }); setModalOpen(true); };

  const handleEdit = (eco: Ecosystem) => {
    setEditingId(eco._id);
    setFormData({
      name: eco.name || '', type: eco.type || '', description: eco.description || '',
      climate: eco.climate || '', states: eco.states?.join(', ') || '',
      keyFeatures: eco.keyFeatures?.join(', ') || '', threats: eco.threats?.join(', ') || '',
      imageUrl: eco.imageUrl || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/ecosystems/${id}`, { method: 'DELETE' });
      showToast('Ecosystem deleted.'); fetchEcosystems();
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.type) { showToast('Name and type are required.', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(), type: formData.type, description: formData.description.trim(),
        climate: formData.climate, imageUrl: formData.imageUrl,
        states: formData.states ? formData.states.split(',').map((s) => s.trim()).filter(Boolean) : [],
        keyFeatures: formData.keyFeatures ? formData.keyFeatures.split(',').map((f) => f.trim()).filter(Boolean) : [],
        threats: formData.threats ? formData.threats.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editingId) {
        await adminFetch(`/ecosystems/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Ecosystem updated!');
      } else {
        await adminFetch('/ecosystems', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Ecosystem added!');
      }
      setModalOpen(false); fetchEcosystems();
    } catch (e: any) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const columns: Column<Ecosystem>[] = [
    { key: 'name', label: 'Name', render: (e) => <span style={{ color: '#e8f5e9', fontWeight: 600 }}>{e.name}</span> },
    { key: 'type', label: 'Type', render: (e) => <span style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', borderRadius: 20, padding: '2px 10px', fontSize: 12 }}>{e.type}</span> },
    { key: 'climate', label: 'Climate', render: (e) => <span style={{ color: 'rgba(134,239,172,0.6)' }}>{e.climate || '—'}</span> },
    { key: 'speciesCount', label: 'Species', render: (e) => <span style={{ color: '#4ade80', fontWeight: 700 }}>{e.speciesCount ?? 0}</span> },
    { key: 'states', label: 'States', render: (e) => <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 12 }}>{e.states?.slice(0, 3).join(', ') || '—'}</span> },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>}
      <AdminDataTable title="Ecosystem Management" icon="🌳" data={ecosystems} columns={columns} loading={loading} error={error} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} searchValue={search} onSearchChange={setSearch} addLabel="Add Ecosystem" />
      <AdminFormModal isOpen={modalOpen} title={editingId ? '✏️ Edit Ecosystem' : '➕ Add Ecosystem'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} loading={saving} submitLabel={editingId ? 'Update' : 'Add'} size="lg">
        <FormRow cols={2}>
          <FormField label="Ecosystem Name" required><FormInput placeholder="e.g. Western Ghats Forest" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required /></FormField>
          <FormField label="Type" required><FormSelect value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))} options={ECO_TYPES} /></FormField>
        </FormRow>
        <FormField label="Description"><FormTextarea placeholder="Describe this ecosystem..." value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} /></FormField>
        <FormRow cols={2}>
          <FormField label="Climate"><FormInput placeholder="e.g. Tropical Wet" value={formData.climate} onChange={(e) => setFormData((f) => ({ ...f, climate: e.target.value }))} /></FormField>
          <FormField label="Image URL"><FormInput placeholder="https://..." value={formData.imageUrl} onChange={(e) => setFormData((f) => ({ ...f, imageUrl: e.target.value }))} /></FormField>
        </FormRow>
        <FormField label="States" hint="Comma-separated"><FormInput placeholder="e.g. Kerala, Karnataka, Tamil Nadu" value={formData.states} onChange={(e) => setFormData((f) => ({ ...f, states: e.target.value }))} /></FormField>
        <FormField label="Key Features" hint="Comma-separated"><FormInput placeholder="e.g. High rainfall, Dense canopy" value={formData.keyFeatures} onChange={(e) => setFormData((f) => ({ ...f, keyFeatures: e.target.value }))} /></FormField>
        <FormField label="Threats" hint="Comma-separated"><FormInput placeholder="e.g. Deforestation, Mining" value={formData.threats} onChange={(e) => setFormData((f) => ({ ...f, threats: e.target.value }))} /></FormField>
      </AdminFormModal>
    </div>
  );
}