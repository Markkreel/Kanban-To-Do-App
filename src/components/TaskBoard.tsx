"use client";

import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

const initialColumns: Column[] = [
  {
    id: "pending",
    title: "Pending",
    tasks: [],
  },
  {
    id: "ongoing",
    title: "Ongoing",
    tasks: [],
  },
  {
    id: "completed",
    title: "Completed",
    tasks: [],
  },
];

export default function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      description: newTask.description,
      createdAt: new Date(),
    };

    setColumns(
      columns.map((col) => {
        if (col.id === "pending") {
          return { ...col, tasks: [...col.tasks, task] };
        }
        return col;
      })
    );

    toast({
      title: "Task Created",
      description: `Task "${task.title}" has been added to Pending.`,
      variant: "default",
    });

    setNewTask({ title: "", description: "" });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );

      if (!sourceColumn || !destColumn) return;

      const sourceTasks = [...sourceColumn.tasks];
      const destTasks = [...destColumn.tasks];
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, tasks: sourceTasks };
          }
          if (col.id === destination.droppableId) {
            return { ...col, tasks: destTasks };
          }
          return col;
        })
      );

      toast({
        title: "Task Moved",
        description: `Task moved to ${destColumn.title}`,
        variant: "default",
      });
    } else {
      const column = columns.find((col) => col.id === source.droppableId);
      if (!column) return;

      const copiedTasks = [...column.tasks];
      const [removed] = copiedTasks.splice(source.index, 1);
      copiedTasks.splice(destination.index, 0, removed);

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, tasks: copiedTasks };
          }
          return col;
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <form
        onSubmit={handleAddTask}
        className="mb-8 p-6 bg-zinc-900 rounded-lg border border-zinc-800"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="w-full p-2 bg-black border border-zinc-800 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="w-full p-2 bg-black border border-zinc-800 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-zinc-900 rounded-lg p-4 border border-zinc-800"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                {column.title}
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {column.tasks.map((task, index) => (
                      <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        index={index}
                        status={
                          column.id as "pending" | "ongoing" | "completed"
                        }
                        onDelete={(taskId) => {
                          setColumns(
                            columns.map((col) => ({
                              ...col,
                              tasks: col.tasks.filter((t) => t.id !== taskId),
                            }))
                          );
                          toast({
                            title: "Task Deleted",
                            description: "The task has been removed.",
                            variant: "destructive",
                          });
                        }}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
