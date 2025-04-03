"use client";

import { useState } from "react";
import { Checkbox } from "@components/components/ui/checkbox";
import { Button } from "@components/components/ui/button";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Star,
  Clock,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";
import { cn } from "@components/lib/utils";

export function TaskList({ tasks, onDelete, onStatusChange, onEdit }) {
  const [expandedTask, setExpandedTask] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const toggleTaskExpand = (id) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "bg-slate-800/70 rounded-lg p-4 transition-all duration-200 backdrop-blur-sm",
            task.status === "completed" && "opacity-70"
          )}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.status === "completed"}
              onCheckedChange={(checked) => {
                onStatusChange(task.id, checked ? "completed" : "not-started");
              }}
              className="mt-1"
            />

            <div
              className="flex-1 min-w-0"
              onClick={() => toggleTaskExpand(task.id)}
            >
              <div className="flex items-center gap-2">
                <h3
                  className={cn(
                    "font-medium text-slate-200",
                    task.status === "completed" && "line-through text-slate-400"
                  )}
                >
                  {task.title}
                </h3>
                {task.important && (
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                )}
                {getStatusIcon(task.status)}
                {task.image && (
                  <ImageIcon
                    className="h-4 w-4 text-blue-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(task);
                    }}
                  />
                )}
              </div>

              {expandedTask === task.id && (
                <div className="mt-2 space-y-2 text-sm text-slate-300">
                  {task.description && <p>{task.description}</p>}
                  {task.dueDate && (
                    <p className="text-slate-400">
                      Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </p>
                  )}
                  {task.image && (
                    <div
                      className="mt-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview(task);
                      }}
                    >
                      <img
                        src={task.image || "/placeholder.svg"}
                        alt={task.title}
                        className="max-h-32 rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "not-started")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Not Started
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "in-progress")}
                >
                  <Clock className="mr-2 h-4 w-4 text-amber-500" />
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onStatusChange(task.id, "completed")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}

      {/* Image Preview Dialog */}
      <Dialog
        open={!!imagePreview}
        onOpenChange={(open) => !open && setImagePreview(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{imagePreview?.title}</DialogTitle>
          </DialogHeader>
          {imagePreview?.image && (
            <div className="flex justify-center">
              <img
                src={imagePreview.image || "/placeholder.svg"}
                alt={imagePreview.title}
                className="max-h-[70vh] max-w-full object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
