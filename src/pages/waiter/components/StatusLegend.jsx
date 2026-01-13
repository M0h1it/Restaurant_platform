import { FaPhoneAlt, FaReceipt } from "react-icons/fa";

export default function StatusLegend() {
  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-2 shadow-sm"
      style={{
        background: "#FFFFFF",
        borderRadius: "14px",
        border: "1px solid #dedede",
      }}
    >

      {/* LEFT SIDE */}
      <div className="d-flex flex-column gap-2">

        {/* Active */}
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: "20px",
            height: "2px",
            background: "red"
          }}></div>

          <span className="small">Active</span>
        </div>

        {/* Inactive */}
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: "20px",
            height: "2px",
            borderBottom: "2px dashed gray"
          }}></div>

          <span className="small">Inactive</span>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="d-flex flex-column gap-2">

        {/* Query */}
        <div className="d-flex align-items-center gap-2">
          <FaPhoneAlt size={18} className="text-danger" />
          <span className="small">Calling you</span>
        </div>

        {/* Bill */}
        <div className="d-flex align-items-center gap-2">
          <FaReceipt size={18} className="text-danger" />
          <span className="small">Asking for bill</span>
        </div>

      </div>

    </div>
  );
}
