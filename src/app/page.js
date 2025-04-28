"use client";
import MainContent from "./components/main-content-dashboard/main-content";

export default function Home() {
  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
      <MainContent />
    </div>
  );
}
