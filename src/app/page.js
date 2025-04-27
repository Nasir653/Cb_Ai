"use client";

import Image from "next/image";
import MainContent from "./components/main-content-dashboard/main-content";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId"); // ✅ Get sessionId from URL

  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
      {/* Main content */}
      <MainContent sessionId={sessionId} /> {/* ✅ Pass it as prop */}
    </div>
  );
}
