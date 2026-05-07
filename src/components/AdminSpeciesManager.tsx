// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminSpeciesManager.tsx  ← NEW FILE
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import AdminDataTable, { Column } from './AdminDataTable';
import AdminFormModal, { FormField, FormInput, FormTextarea, FormSelect, FormRow } from './AdminFormModal';

interface Species {
  _id: string;
  name: string;
  scientificName: string;
  conservationStatus: string;
  ecosystem?: { _id: string; name: string };
  zone?: { _id: string; name: string };
  imageUrl?: string;
  population?: number;
  threats?: string[];
  habitat?: string;
  diet?: string;
  description?: string;
  funFacts?: string[];
  coordinates?: { lat: number; lng: number; locationName?: string };
  createdAt: string;
}

interface Ecosystem { _id: string; name: string; }
interface Zone { _id: string; name: string; }

const CONSERVATION_STATUSES = [
  'Extinct', 'Extinct in Wild', 'Critically Endangered', 'Endangered',
  'Vulnerable', 'Near Threatened', 'Least Concern', 'Data Deficient',
].map((s) => ({ value: s, label: s }));

const STATUS_COLORS: Record<string, string> = {
  'Critically Endangered': '#ef4444', 'Endangered': '#f97316', 'Vulnerable': '#eab308',
  'Near Threatened': '#84cc16', 'Least Concern': '#22c55e', 'Data Deficient': '#94a3b8',
  'Extinct in Wild': '#7c3aed', 'Extinct': '#6b7280',
};

interface Props { adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>; }

const emptyForm = {
  name: '', scientificName: '', description: '', conservationStatus: '',
  ecosystem: '', zone: '', population: '', habitat: '', diet: '',
  threats: '', funFacts: '', imageUrl: '',
  lat: '', lng: '', locationName: '',
};

export default function AdminSpeciesManager({ adminFetch }: Props) {
  const [species, setSpecies] = useState<Species[]>([]);
  const [ecosystems, setEcosystems] = useState<Ecosystem[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEco, setFilterEco] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSpecies = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15', search });
      if (filterStatus) params.set('status', filterStatus);
      if (filterEco) params.set('ecosystem', filterEco);
      const data = await adminFetch(`/species?${params}`);
      setSpecies(data.data);
      setPagination({ total: data.pagination.total, pages: data.pagination.pages });
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [adminFetch, page, search, filterStatus, filterEco]);

  const fetchDependencies = useCallback(async () => {
    try {
      const [ecoRes, zoneRes] = await Promise.all([
        adminFetch('/ecosystems'),
        adminFetch('/zones'),
      ]);
      setEcosystems(ecoRes.data);
      setZones(zoneRes.data);
    } catch {}
  }, [adminFetch]);

  useEffect(() => { fetchSpecies(); }, [fetchSpecies]);
  useEffect(() => { fetchDependencies(); }, [fetchDependencies]);

  // ADDED support for multiple selected files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setSelectedFiles([]);
    setImagePreviews([]);
    setModalOpen(true);
  };

  const handleEdit = (sp: Species) => {
    setEditingId(sp._id);
    setFormData({
      name: sp.name || '',
      scientificName: sp.scientificName || '',
      description: sp.description || '',
      conservationStatus: sp.conservationStatus || '',
      ecosystem: sp.ecosystem?._id || '',
      zone: sp.zone?._id || '',
      population: sp.population != null ? String(sp.population) : '',
      habitat: sp.habitat || '',
      diet: sp.diet || '',
      threats: Array.isArray(sp.threats) ? sp.threats.join(', ') : '',
      funFacts: Array.isArray(sp.funFacts) ? sp.funFacts.join(', ') : '',
      imageUrl: sp.imageUrl || '',
      lat: sp.coordinates?.lat != null ? String(sp.coordinates.lat) : '',
      lng: sp.coordinates?.lng != null ? String(sp.coordinates.lng) : '',
      locationName: sp.coordinates?.locationName || '',
    });
    setSelectedFiles([]);
    setImagePreviews([]);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/species/${id}`, { method: 'DELETE' });
      showToast('Species deleted successfully.', 'success');
      fetchSpecies();
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.conservationStatus) {
      showToast('Name and conservation status are required.', 'error'); return;
    }
    setSaving(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('scientificName', formData.scientificName.trim());
      payload.append('description', formData.description.trim());
      payload.append('conservationStatus', formData.conservationStatus);
      payload.append('habitat', formData.habitat.trim());
      payload.append('diet', formData.diet.trim());
      payload.append('imageUrl', formData.imageUrl.trim());
      
      if (formData.threats) payload.append('threats', formData.threats);
      if (formData.funFacts) payload.append('funFacts', formData.funFacts);
      if (formData.ecosystem) payload.append('ecosystem', formData.ecosystem);
      if (formData.zone) payload.append('zone', formData.zone);
      if (formData.population) payload.append('population', formData.population);
      
      if (formData.lat && formData.lng) {
        payload.append('lat', formData.lat);
        payload.append('lng', formData.lng);
        if (formData.locationName) payload.append('locationName', formData.locationName);
      }

      // Append files
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
           payload.append('images', file);
        });
      }

      if (editingId) {
        // IMPORTANT: Let browser set Content-Type correctly to multipart/form-data
        // We might need to adjust adminFetch if it forces JSON. Assuming adminFetch doesn't force JSON if we pass body as FormData
        await adminFetch(`/species/${editingId}`, { 
          method: 'PUT', 
          body: payload,
          // Remove default headers if present in a typical fetch wrapper, so browser sets the boundary
          // We assume adminFetch handles FormData nicely
          headers: {}
        });
        showToast('Species updated successfully!', 'success');
      } else {
        await adminFetch('/species', { 
          method: 'POST', 
          body: payload,
          headers: {} 
        });
        showToast('Species added successfully!', 'success');
      }
      setModalOpen(false);
      fetchSpecies();
    } catch (e: any) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const columns: Column<Species>[] = [
    {
      key: 'name', label: 'Species Name', width: '25%',
      render: (sp) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            {sp.imageUrl ? <img src={sp.imageUrl} alt={sp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 16 }}>🦁</span>}
          </div>
          <div>
            <div style={{ color: '#e8f5e9', fontWeight: 600 }}>{sp.name}</div>
            <div style={{ color: 'rgba(134,239,172,0.5)', fontSize: 11, fontStyle: 'italic' }}>{sp.scientificName}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'conservationStatus', label: 'Status', width: 160,
      render: (sp) => (
        <span style={{ background: `${STATUS_COLORS[sp.conservationStatus] || '#94a3b8'}22`, color: STATUS_COLORS[sp.conservationStatus] || '#94a3b8', border: `1px solid ${STATUS_COLORS[sp.conservationStatus] || '#94a3b8'}44`, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
          {sp.conservationStatus || '—'}
        </span>
      ),
    },
    { key: 'ecosystem', label: 'Ecosystem', render: (sp) => <span style={{ color: 'rgba(134,239,172,0.7)' }}>{sp.ecosystem?.name || '—'}</span> },
    { key: 'zone', label: 'Zone', render: (sp) => <span style={{ color: 'rgba(134,239,172,0.7)' }}>{sp.zone?.name || '—'}</span> },
    {
      key: 'createdAt', label: 'Added', width: 100,
      render: (sp) => <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 12 }}>{new Date(sp.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>,
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      <AdminDataTable
        title="Species Management"
        icon="🦁"
        data={species}
        columns={columns}
        loading={loading}
        error={error}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        addLabel="Add Species"
        pagination={{ total: pagination.total, page, pages: pagination.pages, onPageChange: setPage }}
        filters={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} style={filterStyle}>
              <option value="">All Statuses</option>
              {CONSERVATION_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select value={filterEco} onChange={(e) => { setFilterEco(e.target.value); setPage(1); }} style={filterStyle}>
              <option value="">All Ecosystems</option>
              {ecosystems.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
            </select>
          </div>
        }
      />

      <AdminFormModal
        isOpen={modalOpen}
        title={editingId ? '✏️ Edit Species' : '➕ Add New Species'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel={editingId ? 'Update Species' : 'Add Species'}
        size="xl"
      >
        <FormRow cols={2}>
          <FormField label="Common Name" required>
            <FormInput placeholder="e.g. Bengal Tiger" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))} required />
          </FormField>
          <FormField label="Scientific Name">
            <FormInput placeholder="e.g. Panthera tigris tigris" value={formData.scientificName} onChange={(e) => setFormData((f) => ({ ...f, scientificName: e.target.value }))} />
          </FormField>
        </FormRow>
        <FormField label="Description">
          <FormTextarea placeholder="Brief description of the species..." value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} rows={3} />
        </FormField>
        <FormRow cols={3}>
          <FormField label="Conservation Status" required>
            <FormSelect value={formData.conservationStatus} onChange={(e) => setFormData((f) => ({ ...f, conservationStatus: e.target.value }))} options={CONSERVATION_STATUSES} />
          </FormField>
          <FormField label="Ecosystem">
            <FormSelect value={formData.ecosystem} onChange={(e) => setFormData((f) => ({ ...f, ecosystem: e.target.value }))} options={ecosystems.map((e) => ({ value: e._id, label: e.name }))} />
          </FormField>
          <FormField label="Biogeographic Zone">
            <FormSelect value={formData.zone} onChange={(e) => setFormData((f) => ({ ...f, zone: e.target.value }))} options={zones.map((z) => ({ value: z._id, label: z.name }))} />
          </FormField>
        </FormRow>
        <FormRow cols={3}>
          <FormField label="Population (estimated)">
            <FormInput type="number" placeholder="e.g. 2500" value={formData.population} onChange={(e) => setFormData((f) => ({ ...f, population: e.target.value }))} />
          </FormField>
          <FormField label="Habitat">
            <FormInput placeholder="e.g. Tropical Rainforest" value={formData.habitat} onChange={(e) => setFormData((f) => ({ ...f, habitat: e.target.value }))} />
          </FormField>
          <FormField label="Diet">
            <FormInput placeholder="e.g. Carnivore" value={formData.diet} onChange={(e) => setFormData((f) => ({ ...f, diet: e.target.value }))} />
          </FormField>
        </FormRow>
        <FormRow cols={2}>
           <FormField label="Upload Images (Up to 5)">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} style={{color: "white"}} />
              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {imagePreviews.map((src, idx) => (
                    <img key={idx} src={src} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  ))}
                </div>
              )}
           </FormField>
           <FormField label="Image URL (Fallback)">
             <FormInput placeholder="https://..." value={formData.imageUrl} onChange={(e) => setFormData((f) => ({ ...f, imageUrl: e.target.value }))} />
           </FormField>
        </FormRow>
        <FormRow cols={2}>
          <FormField label="Threats" hint="Comma-separated">
            <FormInput placeholder="e.g. Poaching, Habitat Loss" value={formData.threats} onChange={(e) => setFormData((f) => ({ ...f, threats: e.target.value }))} />
          </FormField>
          <FormField label="Fun Facts" hint="Comma-separated">
            <FormInput placeholder="e.g. Can swim, Solitary hunter" value={formData.funFacts} onChange={(e) => setFormData((f) => ({ ...f, funFacts: e.target.value }))} />
          </FormField>
        </FormRow>
        <div style={{ borderTop: '1px solid rgba(34,197,94,0.1)', paddingTop: 14 }}>
          <p style={{ color: 'rgba(134,239,172,0.6)', fontSize: 12, margin: '0 0 10px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>📍 Map Coordinates (optional)</p>
          <FormRow cols={3}>
            <FormField label="Latitude">
              <FormInput type="number" step="0.0001" placeholder="e.g. 20.5937" value={formData.lat} onChange={(e) => setFormData((f) => ({ ...f, lat: e.target.value }))} />
            </FormField>
            <FormField label="Longitude">
              <FormInput type="number" step="0.0001" placeholder="e.g. 78.9629" value={formData.lng} onChange={(e) => setFormData((f) => ({ ...f, lng: e.target.value }))} />
            </FormField>
            <FormField label="Location Name">
              <FormInput placeholder="e.g. Sundarbans, WB" value={formData.locationName} onChange={(e) => setFormData((f) => ({ ...f, locationName: e.target.value }))} />
            </FormField>
          </FormRow>
        </div>
      </AdminFormModal>
    </div>
  );
}

const filterStyle: React.CSSProperties = {
  background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8,
  padding: '7px 10px', color: '#e8f5e9', fontSize: 13, outline: 'none', cursor: 'pointer',
};