import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const user = location.state;
  return (
    <div>
      <h3 className="pb-6 text-2xl text-center">Account Dashboard</h3>
      {user ? <h4 className="text-xl text-center">Hi, {user}!</h4> : null}
    </div>
  );
};

export default Dashboard;
