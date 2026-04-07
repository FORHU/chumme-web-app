"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const DetailsRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/onboarding/welcome");
  }, [router]);

  return null;
};
