import { FormEvent, useMemo, useState } from 'react';
import { CreateGoalPayload } from '../../../lib/api/goalsApi';
import Button from '../../../components/ui/Button';

interface GoalFormProps {
  initialValues?: Partial<CreateGoalPayload>;
  submitLabel?: string;
  onSubmit: (data: CreateGoalPayload) => Promise<void>;
  onCancel?: () => void;
}

type GoalFormField = 'title' | 'description' | 'start_date' | 'target_date' | 'submit';
type GoalFormErrors = Partial<Record<GoalFormField, string>>;

const toLocalDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const today = toLocalDateInput(new Date());

const parseDateInput = (value: string): Date | null => {
  if (!value) {
    return null;
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const localMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (localMatch) {
    const [, day, month, year] = localMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return null;
};

const addDays = (dateInput: string, days: number): string => {
  const baseDate = parseDateInput(dateInput) ?? new Date();
  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + days);

  return toLocalDateInput(nextDate);
};

const diffDays = (startDateInput: string, targetDateInput: string): number | null => {
  const startDate = parseDateInput(startDateInput);
  const targetDate = parseDateInput(targetDateInput);

  if (!startDate || !targetDate) {
    return null;
  }

  const milliseconds = targetDate.getTime() - startDate.getTime();

  return Math.round(milliseconds / (1000 * 60 * 60 * 24));
};

const GoalForm = ({
  initialValues,
  onCancel,
  onSubmit,
  submitLabel = 'Luu muc tieu',
}: GoalFormProps) => {
  const defaultStartDate = initialValues?.start_date ?? today;
  const [form, setForm] = useState<CreateGoalPayload>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    goal_type: initialValues?.goal_type ?? 'short_term',
    priority: initialValues?.priority ?? 'medium',
    status: initialValues?.status ?? 'not_started',
    start_date: defaultStartDate,
    target_date: initialValues?.target_date ?? addDays(defaultStartDate, 7),
    note: initialValues?.note ?? '',
  });
  const [errors, setErrors] = useState<GoalFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const timelineDays = useMemo(() => diffDays(form.start_date, form.target_date), [form.start_date, form.target_date]);

  const validateForm = (): GoalFormErrors => {
    const nextErrors: GoalFormErrors = {};
    const startDate = parseDateInput(form.start_date);
    const targetDate = parseDateInput(form.target_date);

    if (form.title.trim().length < 3) {
      nextErrors.title = 'Ten muc tieu can it nhat 3 ky tu.';
    }

    if (form.description.trim().length < 10) {
      nextErrors.description = 'Mo ta can it nhat 10 ky tu.';
    }

    if (!startDate) {
      nextErrors.start_date = 'Vui long chon ngay bat dau hop le.';
    }

    if (!targetDate) {
      nextErrors.target_date = 'Vui long chon ngay muc tieu hop le.';
    }

    if (startDate && targetDate && targetDate.getTime() < startDate.getTime()) {
      nextErrors.target_date = 'Ngay muc tieu phai bang hoac sau ngay bat dau.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        note: form.note.trim(),
      });
    } catch (submitError: any) {
      setErrors({
        submit: submitError?.response?.data?.message ?? 'Khong luu duoc muc tieu.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = <K extends keyof CreateGoalPayload>(key: K, value: CreateGoalPayload[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [key]: undefined,
      submit: undefined,
    }));
  };

  const handleStartDateChange = (value: string) => {
    setForm((current) => {
      const nextTargetDate =
        current.target_date && diffDays(value, current.target_date) !== null && (diffDays(value, current.target_date) ?? 0) < 0
          ? value
          : current.target_date;

      return {
        ...current,
        start_date: value,
        target_date: nextTargetDate,
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      start_date: undefined,
      target_date: undefined,
      submit: undefined,
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
          {errors.title ? <p className="mt-2 text-sm text-red-600">{errors.title}</p> : null}
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
          {errors.description ? <p className="mt-2 text-sm text-red-600">{errors.description}</p> : null}
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
            onChange={(event) => handleStartDateChange(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
          <p className="mt-2 text-xs text-stone-500">Ngay nay se duoc dung lam moc de tinh deadline.</p>
          {errors.start_date ? <p className="mt-2 text-sm text-red-600">{errors.start_date}</p> : null}
        </label>

        <div className="block">
          <span className="mb-2 block text-sm font-semibold text-stone-700">Ngay muc tieu</span>
          <input
            type="date"
            value={form.target_date}
            onChange={(event) => updateField('target_date', event.target.value)}
            min={form.start_date}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-950"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {[7, 14, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => updateField('target_date', addDays(form.start_date, days))}
                className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
              >
                +{days} ngay
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">
            {timelineDays !== null && timelineDays >= 0
              ? `Khoang cach hien tai: ${timelineDays} ngay tu ngay bat dau.`
              : 'Hay chon ngay muc tieu bang hoac sau ngay bat dau.'}
          </p>
          {errors.target_date ? <p className="mt-2 text-sm text-red-600">{errors.target_date}</p> : null}
        </div>

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

      {errors.submit ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.submit}</div> : null}

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
