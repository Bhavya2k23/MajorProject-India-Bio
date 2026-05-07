// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminDataTable.tsx  ← NEW FILE
// Reusable CRUD table component used across all admin managers
// ============================================================
import React, { useState } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  width?: number | string;
}

interface Props<T extends { _id: string }> {
  title: string;
  icon: string;
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error?: string;
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete: (id: string, name: string) => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  pagination?: { total: number; page: number; pages: number; onPageChange: (p: number) => void };
  addLabel?: string;
  filters?: React.ReactNode;
}

export default function AdminDataTable<T extends { _id: string }>({
  title, icon, data, columns, loading, error,
  onAdd, onEdit, onDelete,
  searchValue, onSearchChange,
  pagination, addLabel = 'Add New', filters,
}: Props<T>) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (id: string, name: string) => setDeleteConfirm({ id, name });
  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      onDelete(deleteConfirm.id, deleteConfirm.name);
      setDeleteConfirm(null);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}><span style={{ marginRight: 10 }}>{icon}</span>{title}</h2>
          {pagination && <p style={styles.totalText}>{pagination.total} total records</p>}
        </div>
        <button style={styles.addBtn} onClick={onAdd}>
          <span style={{ fontSize: 16 }}>＋</span> {addLabel}
        </button>
      </div>

      {/* Search + Filters */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={styles.searchInput}
          />
          {searchValue && (
            <button style={styles.clearBtn} onClick={() => onSearchChange('')}>✕</button>
          )}
        </div>
        {filters}
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Table */}
      <div style={styles.tableWrap}>
        {loading ? (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <span style={{ color: 'rgba(134,239,172,0.5)', fontSize: 14 }}>Loading data...</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : data.length === 0 ? (
          <div style={styles.emptyWrap}>
            <span style={{ fontSize: 48 }}>📭</span>
            <p style={{ color: 'rgba(134,239,172,0.5)', margin: '8px 0' }}>No records found.</p>
            <button style={styles.addBtn} onClick={onAdd}>Add First Record</button>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                {columns.map((col) => (
                  <th key={col.key} style={{ ...styles.th, width: col.width }}>{col.label}</th>
                ))}
                <th style={{ ...styles.th, width: 120, textAlign: 'right' as const }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row._id} style={{ ...styles.tr, background: i % 2 === 0 ? 'transparent' : 'rgba(34,197,94,0.02)' }}>
                  {columns.map((col) => (
                    <td key={col.key} style={styles.td}>
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                    </td>
                  ))}
                  <td style={{ ...styles.td, textAlign: 'right' as const }}>
                    <div style={styles.actions}>
                      <button style={styles.editBtn} onClick={() => onEdit(row)} title="Edit">✏️</button>
                      <button style={styles.deleteBtn} onClick={() => handleDeleteClick(row._id, (row as any).name || (row as any).question || row._id)} title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{ ...styles.pageBtn, opacity: pagination.page <= 1 ? 0.4 : 1 }}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >← Prev</button>
          <span style={styles.pageInfo}>Page {pagination.page} of {pagination.pages}</span>
          <button
            style={{ ...styles.pageBtn, opacity: pagination.page >= pagination.pages ? 0.4 : 1 }}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
          >Next →</button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <div style={{ fontSize: 48, textAlign: 'center' as const, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ color: '#e8f5e9', margin: '0 0 8px', textAlign: 'center' as const }}>Confirm Delete</h3>
            <p style={{ color: 'rgba(167,243,208,0.7)', textAlign: 'center' as const, fontSize: 14 }}>
              Are you sure you want to delete:<br />
              <strong style={{ color: '#fca5a5' }}>"{deleteConfirm.name}"</strong>?<br />
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button style={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={styles.confirmDeleteBtn} onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { display: 'flex', flexDirection: 'column', gap: 18 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  title: { color: '#e8f5e9', fontSize: 22, fontWeight: 800, margin: 0, fontFamily: "'Georgia', serif" },
  totalText: { color: 'rgba(134,239,172,0.5)', fontSize: 13, margin: '4px 0 0' },
  addBtn: { background: 'linear-gradient(135deg, #16a34a, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap' },
  toolbar: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  searchWrap: { position: 'relative', flex: 1, minWidth: 200, display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: 12, fontSize: 14, pointerEvents: 'none' },
  searchInput: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '9px 12px 9px 36px', color: '#e8f5e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  clearBtn: { position: 'absolute', right: 10, background: 'none', border: 'none', color: 'rgba(167,243,208,0.5)', cursor: 'pointer', fontSize: 12 },
  errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13, display: 'flex', gap: 8 },
  tableWrap: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(34,197,94,0.12)', borderRadius: 16, overflow: 'auto' },
  loadingWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 14 },
  spinner: { width: 36, height: 36, border: '3px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  emptyWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 8 },
  table: { width: '100%', borderCollapse: 'collapse' as const, minWidth: 600 },
  headerRow: { borderBottom: '1px solid rgba(34,197,94,0.15)' },
  th: { padding: '12px 16px', color: 'rgba(134,239,172,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left' as const, whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid rgba(34,197,94,0.06)', transition: 'background 0.15s' },
  td: { padding: '11px 16px', color: 'rgba(229,241,225,0.85)', fontSize: 13, verticalAlign: 'middle' },
  actions: { display: 'flex', gap: 6, justifyContent: 'flex-end' },
  editBtn: { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 13 },
  deleteBtn: { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '5px 9px', cursor: 'pointer', fontSize: 13 },
  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 },
  pageBtn: { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '7px 14px', color: '#86efac', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  pageInfo: { color: 'rgba(134,239,172,0.6)', fontSize: 13 },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
  confirmModal: { background: 'linear-gradient(135deg, #0d2818, #0a1628)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '32px 28px', maxWidth: 380, width: '100%' },
  cancelBtn: { flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px', color: '#e8f5e9', cursor: 'pointer', fontSize: 14, fontWeight: 600 },
  confirmDeleteBtn: { flex: 1, background: 'linear-gradient(135deg, #dc2626, #b91c1c)', border: 'none', borderRadius: 10, padding: '10px', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 700 },
};