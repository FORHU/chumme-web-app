"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { KaraokePage } from "@/modules/collaboration/components/KaraokePage";

const KaraokePageRoute = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  return <KaraokePage isDark={isDark} />;
};

export default KaraokePageRoute;
