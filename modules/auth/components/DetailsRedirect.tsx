"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const DetailsRedirect = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/onboarding/welcome");
  }, [router]);
  
  return null;
};
