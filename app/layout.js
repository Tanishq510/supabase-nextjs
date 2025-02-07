import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BCRM",
  description: "Made By TJ510",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
       <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content with Backdrop */}
      <div className="flex-grow relative">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Children Content */}
        <div className="relative z-10 p-8">
          {children}
        </div>
      </div>
    </div>
      </body>
    </html>
  );
}
