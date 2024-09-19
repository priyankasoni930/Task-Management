"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchTasks();
    }
  }, [router]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        throw new Error("Failed to fetch tasks");
      }
    } catch (error) {
      setError("Failed to fetch tasks");
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Create a new array of tasks
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(source.index, 1);
    reorderedItem.status = destination.droppableId;
    newTasks.splice(destination.index, 0, reorderedItem);

    // Update the state immediately
    setTasks(newTasks);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: destination.droppableId }),
      });
      if (response.ok) {
        const updatedTaskData = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === draggableId ? updatedTaskData : task
          )
        );
        toast({
          title: "Success",
          description: `Task moved to ${destination.droppableId}`,
        });
      } else {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please refresh the page.",
        variant: "destructive",
      });
      // Optionally, you can revert the state here if you want
      // fetchTasks();
    }
  };

  if (isLoading)
    return (
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ))}
      </div>
    );

  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  const columns = [
    { id: "To Do", icon: Circle },
    { id: "In Progress", icon: AlertCircle },
    { id: "Completed", icon: CheckCircle2 },
  ];

  const getColumnColor = (columnId) => {
    switch (columnId) {
      case "To Do":
        return "bg-blue-100";
      case "In Progress":
        return "bg-yellow-100";
      case "Completed":
        return "bg-green-100";
      default:
        return "bg-gray-100";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Kanban Board</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`${getColumnColor(
                column.id
              )} p-4 rounded-lg shadow-md`}
            >
              <h2 className="text-xl text-black font-semibold mb-4 flex items-center">
                {React.createElement(column.icon, { className: "mr-2" })}
                {column.id}
              </h2>
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <ScrollArea
                    className={`space-y-4 min-h-[500px] ${
                      snapshot.isDraggingOver ? "bg-opacity-50" : ""
                    }`}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tasks
                      .filter((task) => task.status === column.id)
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white cursor-move transition-all ${
                                snapshot.isDragging
                                  ? "shadow-lg scale-105"
                                  : "hover:shadow-md"
                              }`}
                            >
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  {task.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600 mb-2">
                                  {task.description}
                                </p>
                                <div className="flex justify-between items-center">
                                  <Badge
                                    className={`${getPriorityColor(
                                      task.priority
                                    )} text-white`}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      task.dueDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ScrollArea>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
