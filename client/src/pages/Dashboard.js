import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      <h3 className="pb-6 text-2xl text-center">Account Dashboard</h3>
      {user ? <h4 className="text-xl text-center">Hi, {user}!</h4> : null}
    </div>
  );
};

export default Dashboard;
