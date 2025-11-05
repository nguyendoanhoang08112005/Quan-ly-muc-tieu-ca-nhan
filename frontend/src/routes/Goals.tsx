import GoalList from '../components/GoalList';
import CreateGoal from '../components/CreateGoal';

const Goals = () => {
  return (
    <div className="goals-page">
      <h1>Quản lý mục tiêu</h1>
      <CreateGoal />
      <GoalList />
    </div>
  );
};

export default Goals;