import GoalList from '../components/GoalList';

const Goals = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b-4 border-black bg-black px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Module cot loi</div>
          <h1 className="mt-3 text-3xl font-black uppercase tracking-tight">Muc tieu ca nhan</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-300">
            Man nay chi giu cac thao tac xoay quanh muc tieu. Projects, habit, report va cac man demo cu
            da duoc tach khoi flow chinh.
          </p>
        </div>
      </div>

      <GoalList />
    </div>
  );
};

export default Goals;
