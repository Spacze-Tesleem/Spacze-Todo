"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  ImageIcon,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { TaskList } from "@src/app/components/todo-list";
import { TaskForm } from "@src/app/components/todo-form";
import { Button } from "@components/components/ui/button";
import { Input } from "@components/components/ui/input";
import { useMediaQuery } from "@hooks/use-media-query";
import { cn } from "@components/lib/utils";

export const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage if available
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  const [activeList, setActiveList] = useState("my-day");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Auto-close sidebar on mobile
  useEffect(() => {
    setSidebarOpen(isDesktop);
  }, [isDesktop]);

  const addTask = (task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? task : t)));
    } else {
      setTasks([...tasks, task]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const editTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeList === "my-day") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }
    if (activeList === "important") return task.important;
    if (activeList === "planned") return !!task.dueDate;
    if (activeList === "completed") return task.status === "completed";
    if (activeList === "in-progress") return task.status === "in-progress";
    return true;
  });

  const listCounts = {
    "my-day": tasks.filter((t) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(t.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }).length,
    important: tasks.filter((t) => t.important).length,
    planned: tasks.filter((t) => !!t.dueDate).length,
    completed: tasks.filter((t) => t.status === "completed").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    all: tasks.length,
  };

  const getListTitle = () => {
    switch (activeList) {
      case "my-day":
        return "My Day";
      case "important":
        return "Important";
      case "planned":
        return "Planned";
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      default:
        return "All Tasks";
    }
  };
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeList={activeList}
        setActiveList={setActiveList}
        counts={listCounts}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-slate-800 to-slate-900 bg-cover bg-center",
          "bg-[url('/image.png?height=1080&width=1920')]"
        )}
      >
        <header className="p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{getListTitle()}</h1>
            <p className="text-slate-300">
              {format(new Date(), "EEEE, MMMM d")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="text-white">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Calendar className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4">
          {filteredTasks.length === 0 && !isFormOpen && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="bg-slate-800/70 p-8 rounded-lg backdrop-blur-sm">
                <div className="flex justify-center mb-4">
                  <Calendar className="h-16 w-16 text-slate-300" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Focus on your day
                </h2>
                <p className="text-slate-300 mb-6">
                  Get things done with My Day, a list
                  <br />
                  that refreshes every day.
                </p>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-slate-700 hover:bg-slate-600"
                >
                  Add task to My Day
                </Button>
              </div>
            </div>
          )}

          {(filteredTasks.length > 0 || isFormOpen) && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <TaskList
                tasks={filteredTasks}
                onDelete={deleteTask}
                onStatusChange={updateTaskStatus}
                onEdit={editTask}
              />

              {isFormOpen ? (
                <TaskForm
                  onSubmit={addTask}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingTask(null);
                  }}
                  initialData={editingTask}
                />
              ) : (
                <div className="mt-4">
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    variant="outline"
                    className="w-full justify-start text-slate-300 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add a task
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Try typing 'Pay utilities bill by Friday 6pm'"
              className="pl-10 bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
