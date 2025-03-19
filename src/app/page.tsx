import Image from "next/image";

import TaskBoard from "@/components/TaskBoard";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <header className="p-8 border-b border-border">
        <h1 className="text-3xl font-bold text-foreground text-white">
          TaskTide
        </h1>
      </header>
      <TaskBoard />
    </div>
  );
}
