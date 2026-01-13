import { useState, useEffect, useMemo } from "react";
import { AdminAPI } from "../../../../api/admin.api";

export const useWaiters = () => {
  const [staff, setStaff] = useState([]);
  const [floors, setFloors] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
      AdminAPI.getStaff().then(setStaff);
    AdminAPI.getFloors().then(setFloors);
    }, []);
  

  const waiters = useMemo(() => staff.filter((s) => s.role === "Waiter"), [staff]);

  const filteredWaiters = useMemo(() => {
    return waiters.filter((w) => {
      if (activeTab === "on") return w.onDuty;
      if (activeTab === "off") return !w.onDuty;
      return true;
    });
  }, [waiters, activeTab]);

  const toggleDuty = (waiterId) => {
    setStaff((prev) =>
      prev.map((w) =>
        w.id === waiterId
          ? {
              ...w,
              onDuty: !w.onDuty,
              tables: w.onDuty ? [] : w.tables,
            }
          : w
      )
    );
  };

  return {
    staff,
    setStaff,
    floors,
    activeTab,
    setActiveTab,
    filteredWaiters,
    toggleDuty,
  };
};