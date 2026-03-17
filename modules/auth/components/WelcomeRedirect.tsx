"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const WelcomeRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/auth");
  }, [router]);
  
  return null;
};
