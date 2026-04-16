import React, { Suspense } from "react";

import { AuthInitializer } from "@/modules/shared/components/AuthInitializer";
import { SnackbarManager } from "@/modules/shared/components/SnackbarManager";
import { ThemeProvider } from "@/modules/shared/components/ThemeProvider";
import { QueryProvider } from "@/modules/shared/providers/QueryProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          <AuthInitializer>
            {children}
            <SnackbarManager />
          </AuthInitializer>
        </QueryProvider>
      </ThemeProvider>
    </Suspense>
  );
};
