import type { Metadata } from "next";
import "@workspace/ui/globals.css";
import { TRPCProvider } from "../providers/TrpcProvider";
import { AuthProvider } from "../contexts/auth-context";
import { AdminLayout } from "../components/admin-layout";

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
      <body>
        <TRPCProvider>
          <AuthProvider>
            <AdminLayout>{children}</AdminLayout>
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
