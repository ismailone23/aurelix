"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TRPCProvider } from "../providers/TrpcProvider";
import { CartProvider } from "../contexts/cart-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider>
      <CartProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </CartProvider>
    </TRPCProvider>
  );
}
