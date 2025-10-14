"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

interface DarkmodeProviderProps {
  children: ReactNode;
}

const DarkmodeProvider = ({ children }: DarkmodeProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      {children}
    </ThemeProvider>
  );
};

export default DarkmodeProvider;
