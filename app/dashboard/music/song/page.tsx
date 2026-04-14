"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { MusicPage } from "@/modules/collaboration/components/MusicPage";

const SongPageRoute = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? resolvedTheme === "dark" : true;
  return <MusicPage isDark={isDark} />;
};

export default SongPageRoute;
