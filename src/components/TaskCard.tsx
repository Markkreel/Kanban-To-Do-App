"use client";

import { Draggable } from "@hello-pangea/dnd";

type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  index: number;
  onDelete: (id: string) => void;
  status: "pending" | "ongoing" | "completed";
};

export default function TaskCard({
  id,
  title,
  description,
  index,
  onDelete,
  status,
}: TaskCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "ongoing":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-zinc-900 p-4 rounded-lg shadow-lg group relative border border-zinc-800"
        >
          <button
            onClick={() => onDelete(id)}
            className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <h3 className="text-lg font-semibold text-white pr-6">{title}</h3>
          </div>
          <p className="text-zinc-400 mt-2">{description}</p>
        </div>
      )}
    </Draggable>
  );
}
