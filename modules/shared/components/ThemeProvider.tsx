"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemeProviderProps,
} from "next-themes";
import React from "react";

export const ThemeProvider = ({
  children,
  ...props
}: NextThemeProviderProps) => {
  return (
    <NextThemesProvider enableColorScheme={false} {...props}>
      {children}
    </NextThemesProvider>
  );
};
