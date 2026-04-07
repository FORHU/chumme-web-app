"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { APKDownloadPage } from "@/modules/dashboard/components/APKDownloadPage";

const APKPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return <APKDownloadPage isDark={isDark} />;
};

export default APKPage;
