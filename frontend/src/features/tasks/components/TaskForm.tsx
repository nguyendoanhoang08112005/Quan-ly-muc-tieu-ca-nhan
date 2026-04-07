import { FormEvent, useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import { CreateTaskPayload } from '../../../lib/api/tasksApi';

interface TaskFormProps {
  onSubmit: (data: CreateTaskPayload) => Promise<void>;
  onCancel: () => void;
}

const TaskForm = ({ onCancel, onSubmit }: TaskFormProps) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'not_started' as CreateTaskPayload['status'],
    priority: 'medium' as CreateTaskPayload['priority'],
    due_at: '',
    estimated_minutes: '',
    is_focus: false,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(() => form.title.trim().length >= 3, [form.title]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!valid) {
      setError('Task can it nhat 3 ky tu de de theo doi.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        due_at: form.due_at || null,
        estimated_minutes: form.estimated_minutes ? Number(form.estimated_minutes) : null,
        is_focus: form.is_focus,
      });
    } catch (submitError: any) {
      setError(submitError?.response?.data?.message ?? 'Khong tao duoc task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">Ten task</span>
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Vi du: Tao request validation cho task"
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-stone-700">Mo ta</span>
        <textarea
          rows={3}
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Task nay can hoan thanh dieu gi?"
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
                status: event.target.value as CreateTaskPayload['status'],
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
          <span className="mb-2 block text-sm font-semibold text-stone-700">Do uu tien</span>
          <select
            value={form.priority}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                priority: event.target.value as CreateTaskPayload['priority'],
              }))
            }
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          >
            <option value="low">Thap</option>
            <option value="medium">Trung binh</option>
            <option value="high">Cao</option>
            <option value="critical">Rat cao</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Han task</span>
          <input
            type="datetime-local"
            value={form.due_at}
            onChange={(event) => setForm((current) => ({ ...current, due_at: event.target.value }))}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">So phut du kien</span>
          <input
            type="number"
            min="1"
            value={form.estimated_minutes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                estimated_minutes: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
        <input
          type="checkbox"
          checked={form.is_focus}
          onChange={(event) => setForm((current) => ({ ...current, is_focus: event.target.checked }))}
          className="h-4 w-4 rounded border-stone-300"
        />
        <span className="text-sm font-medium text-stone-700">Danh dau day la task focus</span>
      </label>

      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} variant="secondary">
          Huy
        </Button>
        <Button disabled={submitting} type="submit">
          {submitting ? 'Dang tao...' : 'Them task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
