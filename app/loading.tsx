import React from "react";

import { ChummeLoader } from "@/modules/shared/components/ChummeLoader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center">
      <ChummeLoader />
    </div>
  );
}
