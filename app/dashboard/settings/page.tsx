"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SettingsPage } from "@/modules/dashboard/components/SettingsPage";

const SettingsPageRoute = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return <SettingsPage isDark={isDark} />;
};

export default SettingsPageRoute;
