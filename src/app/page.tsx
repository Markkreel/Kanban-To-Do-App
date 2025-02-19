import Image from "next/image";

import TaskBoard from '@/components/TaskBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="p-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-black">TaskTide</h1>
      </header>
      <TaskBoard />
    </div>
  );
}
