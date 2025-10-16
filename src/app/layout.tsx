import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MSWProvider } from "@/components/MSWProvider";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "My Blog",
  description: "Personal blog with modern UI/UX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} antialiased`}>
        <MSWProvider>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <Header />
                <main className="pt-24">
                  {children}
                </main>
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
