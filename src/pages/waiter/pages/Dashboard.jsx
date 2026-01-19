import MenuHeader from "../components/MenuHeader";
import BottomNav from "../components/BottomNav";
import StatusLegend from "../components/StatusLegend";
import TableGrid from "../components/TableGrid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "../../../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const [showLegend, setShowLegend] = useState(false);

  return (
    <div className="bg-light d-flex flex-column" style={{ height: "100vh" }}>
      <MenuHeader
        onLogOut={() => {
          logout();
          navigate("/");
        }}
        onToggleLegend={() => setShowLegend((prev) => !prev)}
      />

      {showLegend && (
        <div className="px-3 pt-2">
          <StatusLegend />
        </div>
      )}

      <div className="px-3 pt-3 flex-grow-1 overflow-auto pb-5 mb-5">
        <TableGrid />
      </div>

      <BottomNav hasNotification={true} />
    </div>
  );
}
