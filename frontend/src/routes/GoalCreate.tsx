import { useNavigate } from 'react-router-dom';
import GoalForm from '../features/goals/components/GoalForm';
import { goalsApi } from '../lib/api/goalsApi';

const GoalCreate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fde68a,_transparent_30%),radial-gradient(circle_at_top_right,_#bfdbfe,_transparent_35%),#fafaf9] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-stone-200 bg-white/85 p-8 shadow-xl backdrop-blur">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-stone-500">Goal create</div>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-stone-950">Tao muc tieu moi</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Bat dau tu goal, sau do di tiep sang milestone va task. Day la flow chinh cua app hien tai.
            </p>
          </div>

          <div className="mt-8">
            <GoalForm
              onCancel={() => navigate('/goals')}
              onSubmit={async (payload) => {
                const goal = await goalsApi.create(payload);
                navigate(`/goals/${goal.id}`);
              }}
              submitLabel="Tao goal"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCreate;
