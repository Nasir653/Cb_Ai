import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalContextProvider } from "../provider/context";

import DashboardSidebar from "./components/dashboard-sidebar/dashboard-sidebar";
import Header from "./components/header/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap everything inside GlobalContextProvider */}
        <GlobalContextProvider>
          <div className="flex h-full w-full flex-col">
            <div className="relative flex h-full w-full flex-1 overflow-hidden transition-colors z-0">
              <div className="relative flex h-full w-full flex-row overflow-hidden">
                <div className="flex">
                  {/* Sidebar */}
                  <DashboardSidebar />
                </div>

                <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                  {/* header */}
                  <Header />

                  {/* Page content */}
                  {children}
                </div>
              </div>

              <div className="relative z-[1] flex-shrink-0 overflow-x-hidden max-lg:!w-0">
                <div className="absolute h-full pointer-events-none w-[400px]">
                  <div className="flex h-full flex-col"></div>
                </div>
              </div>
            </div>
          </div>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
