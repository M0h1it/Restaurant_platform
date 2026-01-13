import { Outlet } from "react-router-dom";

const WaiterLayout = () => {
  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
};

export default WaiterLayout;
