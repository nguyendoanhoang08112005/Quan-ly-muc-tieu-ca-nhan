import { FormEvent, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import { CreateMilestonePayload } from '../../../lib/api/milestonesApi';

interface MilestoneFormProps {
  onSubmit: (data: CreateMilestonePayload) => Promise<void>;
  onCancel: () => void;
}

const today = new Date().toISOString().split('T')[0];

const MilestoneForm = ({ onCancel, onSubmit }: MilestoneFormProps) => {
  const [form, setForm] = useState<CreateMilestonePayload>({
    title: '',
    description: '',
    status: 'not_started',
    start_date: today,
    target_date: today,
    note: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(() => {
    if (form.title.trim().length < 3) return false;

    return form.target_date >= form.start_date;
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!valid) {
      setError('Milestone can co ten hop le va ngay muc tieu phai tu ngay bat dau tro di.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        note: form.note.trim(),
      });
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message ?? 'Khong tao duoc milestone.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">Ten milestone</span>
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Vi du: Chot schema va relation"
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">Mo ta</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Mo ta ket qua ban muon xong trong milestone nay."
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Trang thai</span>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as CreateMilestonePayload['status'],
              }))
            }
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          >
            <option value="not_started">Chua bat dau</option>
            <option value="in_progress">Dang thuc hien</option>
            <option value="paused">Tam dung</option>
            <option value="completed">Hoan thanh</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ngay bat dau</span>
          <input
            type="date"
            value={form.start_date}
            onChange={(event) => setForm((current) => ({ ...current, start_date: event.target.value }))}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ngay muc tieu</span>
          <input
            type="date"
            value={form.target_date}
            onChange={(event) => setForm((current) => ({ ...current, target_date: event.target.value }))}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ghi chu</span>
          <input
            value={form.note}
            onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
            placeholder="Nhan manh pham vi milestone."
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} variant="secondary">
          Huy
        </Button>
        <Button disabled={submitting} type="submit">
          {submitting ? 'Dang tao...' : 'Them milestone'}
        </Button>
      </div>
    </form>
  );
};

export default MilestoneForm;
