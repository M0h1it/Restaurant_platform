import { useState, useEffect } from "react";
import { AdminAPI } from "../../../../api/admin.api";
import { hasPermission } from "../../../../utils/permissions";
import { getCurrentUser } from "../../../../utils/auth";

export const useStaffActions = () => {
  const CURRENT_USER = getCurrentUser();
  const [staff, setStaff] = useState([]);
  const canAddStaff = hasPermission(CURRENT_USER?.role, "manage_staff");

  useEffect(() => {
    AdminAPI.getStaff().then(setStaff);
  }, []);


  const generateUserId = () => {
    if (staff.length === 0) return "U001";
    const maxId = staff.reduce((max, s) => {
      const num = Number(s.userId?.replace("U", "") || 0);
      return num > max ? num : max;
    }, 0);
    return `U${String(maxId + 1).padStart(3, "0")}`;
  };

  const addStaff = (user) => {
    if (
      staff.some(
        (s) => s.username.toLowerCase() === user.username.toLowerCase()
      )
    ) {
      alert("Username already exists");
      return false;
    }
    const updated = [
    ...staff,
    {
      id: Date.now(),
      userId: generateUserId(),
      ...user,
      isActive: true,
      onDuty: false,
      tables: user.role === "Waiter" ? [] : undefined,
    },
  ];

  setStaff(updated);
  AdminAPI.saveStaff(updated); // ✅ EXPLICIT SAVE
  return true;
  };

  const saveEdit = (updatedUser) => {
  const updated = staff.map((s) =>
    s.id === updatedUser.id ? updatedUser : s
  );

  setStaff(updated);
  AdminAPI.saveStaff(updated);
};


  const deleteUser = (id) => {
  const updated = staff.filter((s) => s.id !== id);
  setStaff(updated);
  AdminAPI.saveStaff(updated);
};


  return { staff, canAddStaff, addStaff, saveEdit, deleteUser, CURRENT_USER };
};
