"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { RolesPermissionsPage } from "@/modules/dashboard/components/RolesPermissionsPage";

const RolesPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return <RolesPermissionsPage />;
};

export default RolesPage;
