import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LogoBar } from "@/components/ui/logo-bar";
import Logo from "@/public/Logo.svg";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AstroLink",
  description: "Connect with others based on your star sign",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" sizes="any"/>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>
          <LogoBar src={Logo} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
