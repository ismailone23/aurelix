import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
// @ts-ignore
import "@workspace/ui/globals.css";
import Navbar from "@/components/navbar";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <div className="flex flex-col w-full">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
