import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "@workspace/ui/globals.css";
import { TRPCProvider } from "../providers/TrpcProvider";
import { AuthProvider } from "../contexts/auth-context";
import { AdminLayout } from "../components/admin-layout";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Aurelix Admin",
  description: "Admin panel for Aurelix",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <TRPCProvider>
          <AuthProvider>
            <AdminLayout>{children}</AdminLayout>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
