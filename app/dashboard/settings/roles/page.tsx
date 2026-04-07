"use client";

import React, { useState, useEffect } from "react";

import { RolesPermissionsPage } from "@/modules/dashboard/components/RolesPermissionsPage";

const RolesPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <RolesPermissionsPage />;
};

export default RolesPage;
