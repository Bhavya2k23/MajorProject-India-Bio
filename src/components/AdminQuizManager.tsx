// ============================================================
// FILE: india-s-wild-explorer/src/components/AdminQuizManager.tsx  ← NEW FILE
// ============================================================
import React, { useState, useEffect, useCallback } from 'react';
import AdminDataTable, { Column } from './AdminDataTable';
import AdminFormModal, { FormField, FormInput, FormTextarea, FormSelect, FormRow } from './AdminFormModal';

interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: string;
  category: string;
  createdAt: string;
}

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'].map((d) => ({ value: d, label: d }));
const CATEGORIES = ['Species', 'Ecosystem', 'Zone', 'Conservation', 'General', 'Threats', 'Habitat'].map((c) => ({ value: c, label: c }));
const CORRECT_OPTIONS = [0, 1, 2, 3].map((i) => ({ value: String(i), label: `Option ${i + 1}` }));

const DIFF_COLORS: Record<string, string> = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' };
const CATEGORY_COLORS: Record<string, string> = { Species: '#06b6d4', Ecosystem: '#16a34a', Zone: '#a78bfa', Conservation: '#f97316', General: '#94a3b8', Threats: '#ef4444', Habitat: '#84cc16' };

const emptyForm = { question: '', option0: '', option1: '', option2: '', option3: '', correctAnswer: '0', explanation: '', difficulty: 'Medium', category: 'General' };

interface Props { adminFetch: (endpoint: string, options?: RequestInit) => Promise<any>; }

export default function AdminQuizManager({ adminFetch }: Props) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterCat, setFilterCat] = useState('');
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

  const fetchQuestions = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15', search });
      if (filterDiff) params.set('difficulty', filterDiff);
      if (filterCat) params.set('category', filterCat);
      const data = await adminFetch(`/quiz?${params}`);
      setQuestions(data.data);
      setPagination({ total: data.pagination.total, pages: data.pagination.pages });
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [adminFetch, page, search, filterDiff, filterCat]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleAdd = () => { setEditingId(null); setFormData({ ...emptyForm }); setModalOpen(true); };

  const handleEdit = (q: QuizQuestion) => {
    setEditingId(q._id);
    setFormData({
      question: q.question || '', option0: q.options[0] || '', option1: q.options[1] || '',
      option2: q.options[2] || '', option3: q.options[3] || '', correctAnswer: String(q.correctAnswer),
      explanation: q.explanation || '', difficulty: q.difficulty || 'Medium', category: q.category || 'General',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminFetch(`/quiz/${id}`, { method: 'DELETE' });
      showToast('Question deleted.'); fetchQuestions();
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const opts = [formData.option0, formData.option1, formData.option2, formData.option3];
    if (!formData.question.trim() || opts.some((o) => !o.trim())) {
      showToast('Question and all 4 options are required.', 'error'); return;
    }
    setSaving(true);
    try {
      const payload = {
        question: formData.question.trim(), options: opts.map((o) => o.trim()),
        correctAnswer: parseInt(formData.correctAnswer), explanation: formData.explanation.trim(),
        difficulty: formData.difficulty, category: formData.category,
      };
      if (editingId) {
        await adminFetch(`/quiz/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Question updated!');
      } else {
        await adminFetch('/quiz', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Question added!');
      }
      setModalOpen(false); fetchQuestions();
    } catch (e: any) { showToast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  const columns: Column<QuizQuestion>[] = [
    {
      key: 'question', label: 'Question', width: '40%',
      render: (q) => <span style={{ color: '#e8f5e9', fontSize: 13 }}>{q.question.length > 90 ? q.question.slice(0, 90) + '…' : q.question}</span>,
    },
    {
      key: 'difficulty', label: 'Difficulty',
      render: (q) => <span style={{ background: `${DIFF_COLORS[q.difficulty] || '#94a3b8'}22`, color: DIFF_COLORS[q.difficulty] || '#94a3b8', border: `1px solid ${DIFF_COLORS[q.difficulty] || '#94a3b8'}44`, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{q.difficulty}</span>,
    },
    {
      key: 'category', label: 'Category',
      render: (q) => <span style={{ background: `${CATEGORY_COLORS[q.category] || '#94a3b8'}18`, color: CATEGORY_COLORS[q.category] || '#94a3b8', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{q.category}</span>,
    },
    {
      key: 'correctAnswer', label: 'Correct Answer',
      render: (q) => <span style={{ color: '#4ade80', fontSize: 12 }}>Option {q.correctAnswer + 1}: {q.options[q.correctAnswer]?.slice(0, 30) || '—'}</span>,
    },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {toast && <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 10000, background: toast.type === 'success' ? 'rgba(22,163,74,0.95)' : 'rgba(220,38,38,0.95)', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 14, fontWeight: 600 }}>{toast.type === 'success' ? '✅' : '❌'} {toast.msg}</div>}
      <AdminDataTable
        title="Quiz Management" icon="❓" data={questions} columns={columns} loading={loading} error={error}
        onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete}
        searchValue={search} onSearchChange={(v) => { setSearch(v); setPage(1); }} addLabel="Add Question"
        pagination={{ total: pagination.total, page, pages: pagination.pages, onPageChange: setPage }}
        filters={
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={filterDiff} onChange={(e) => { setFilterDiff(e.target.value); setPage(1); }} style={filterStyle}>
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select value={filterCat} onChange={(e) => { setFilterCat(e.target.value); setPage(1); }} style={filterStyle}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        }
      />
      <AdminFormModal isOpen={modalOpen} title={editingId ? '✏️ Edit Question' : '➕ Add Quiz Question'} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} loading={saving} submitLabel={editingId ? 'Update' : 'Add'} size="lg">
        <FormField label="Question" required>
          <FormTextarea placeholder="Enter the quiz question..." value={formData.question} onChange={(e) => setFormData((f) => ({ ...f, question: e.target.value }))} rows={3} required />
        </FormField>
        <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '14px 16px' }}>
          <p style={{ color: 'rgba(134,239,172,0.7)', fontSize: 12, fontWeight: 700, margin: '0 0 12px', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Answer Options (all 4 required)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[0, 1, 2, 3].map((i) => (
              <FormField key={i} label={`Option ${i + 1}`} required>
                <div style={{ position: 'relative' }}>
                  <FormInput
                    placeholder={`Option ${i + 1}`}
                    value={(formData as any)[`option${i}`]}
                    onChange={(e) => setFormData((f) => ({ ...f, [`option${i}`]: e.target.value }))}
                    style={{ paddingRight: formData.correctAnswer === String(i) ? 36 : 12 }}
                    required
                  />
                  {formData.correctAnswer === String(i) && (
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>✅</span>
                  )}
                </div>
              </FormField>
            ))}
          </div>
        </div>
        <FormRow cols={3}>
          <FormField label="Correct Answer" required>
            <FormSelect value={formData.correctAnswer} onChange={(e) => setFormData((f) => ({ ...f, correctAnswer: e.target.value }))} options={CORRECT_OPTIONS} />
          </FormField>
          <FormField label="Difficulty">
            <FormSelect value={formData.difficulty} onChange={(e) => setFormData((f) => ({ ...f, difficulty: e.target.value }))} options={DIFFICULTIES} />
          </FormField>
          <FormField label="Category">
            <FormSelect value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))} options={CATEGORIES} />
          </FormField>
        </FormRow>
        <FormField label="Explanation (optional)" hint="Shown after user answers">
          <FormTextarea placeholder="Explain why the correct answer is right..." value={formData.explanation} onChange={(e) => setFormData((f) => ({ ...f, explanation: e.target.value }))} rows={2} />
        </FormField>
      </AdminFormModal>
    </div>
  );
}

const filterStyle: React.CSSProperties = {
  background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8,
  padding: '7px 10px', color: '#e8f5e9', fontSize: 13, outline: 'none', cursor: 'pointer',
};