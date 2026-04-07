import { FormEvent, useMemo, useState } from 'react';
import { CreateGoalPayload } from '../../../lib/api/goalsApi';
import Button from '../../../components/ui/Button';

interface GoalFormProps {
  initialValues?: Partial<CreateGoalPayload>;
  submitLabel?: string;
  onSubmit: (data: CreateGoalPayload) => Promise<void>;
  onCancel?: () => void;
}

const today = new Date().toISOString().split('T')[0];

const GoalForm = ({
  initialValues,
  onCancel,
  onSubmit,
  submitLabel = 'Luu muc tieu',
}: GoalFormProps) => {
  const [form, setForm] = useState<CreateGoalPayload>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    goal_type: initialValues?.goal_type ?? 'short_term',
    priority: initialValues?.priority ?? 'medium',
    status: initialValues?.status ?? 'not_started',
    start_date: initialValues?.start_date ?? today,
    target_date: initialValues?.target_date ?? today,
    note: initialValues?.note ?? '',
  });
  const [error, setError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => {
    if (form.title.trim().length < 3) return false;
    if (form.description.trim().length < 10) return false;
    if (!form.start_date || !form.target_date) return false;

    return form.target_date >= form.start_date;
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      setError('Vui long dien day du va dam bao ngay muc tieu khong nho hon ngay bat dau.');
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
      setError(submitError?.response?.data?.message ?? 'Khong luu duoc muc tieu.');
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof CreateGoalPayload>(key: K, value: CreateGoalPayload[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ten muc tieu</span>
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Vi du: Hoan thanh flow goal CRUD"
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Mo ta</span>
          <textarea
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            rows={4}
            placeholder="Mo ta ngan gon ve ket qua ban muon dat duoc."
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Loai muc tieu</span>
          <select
            value={form.goal_type}
            onChange={(event) => updateField('goal_type', event.target.value as CreateGoalPayload['goal_type'])}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          >
            <option value="short_term">Ngan han</option>
            <option value="mid_term">Trung han</option>
            <option value="long_term">Dai han</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Do uu tien</span>
          <select
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value as CreateGoalPayload['priority'])}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          >
            <option value="low">Thap</option>
            <option value="medium">Trung binh</option>
            <option value="high">Cao</option>
            <option value="critical">Rat cao</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Trang thai</span>
          <select
            value={form.status}
            onChange={(event) => updateField('status', event.target.value as CreateGoalPayload['status'])}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          >
            <option value="not_started">Chua bat dau</option>
            <option value="in_progress">Dang thuc hien</option>
            <option value="paused">Tam dung</option>
            <option value="completed">Hoan thanh</option>
            <option value="cancelled">Da huy</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ngay bat dau</span>
          <input
            type="date"
            value={form.start_date}
            onChange={(event) => updateField('start_date', event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ngay muc tieu</span>
          <input
            type="date"
            value={form.target_date}
            onChange={(event) => updateField('target_date', event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ghi chu</span>
          <textarea
            value={form.note}
            onChange={(event) => updateField('note', event.target.value)}
            rows={3}
            placeholder="Ghi lai cach do thanh cong hoac boi canh can nho."
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>
      </div>

      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Huy
          </Button>
        ) : null}
        <Button disabled={submitting} type="submit">
          {submitting ? 'Dang luu...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default GoalForm;
