"use client";

import { useState, useRef } from "react";
import { CalendarIcon, ImageIcon, Star, X } from "lucide-react";
import { Button } from "@components/components/ui/button";
import { Input } from "@components/components/ui/input";
import { Textarea } from "@components/components/ui/textarea";
import { Calendar } from "@components/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@components/lib/utils";

export function TaskForm({ onSubmit, onCancel, initialData }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? new Date(initialData.dueDate) : undefined
  );
  const [important, setImportant] = useState(initialData?.important || false);
  const [image, setImage] = useState(initialData?.image || null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const task = {
      id: initialData?.id || crypto.randomUUID(),
      title,
      description,
      dueDate: dueDate ? dueDate.toISOString() : "",
      status: initialData?.status || "not-started",
      important,
      image,
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSubmit(task);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-800/70 rounded-lg p-4 backdrop-blur-sm"
    >
      <div className="space-y-4">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          required
        />

        <Textarea
          placeholder="Add description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 min-h-24"
        />

        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-slate-700/50 border-slate-600 text-slate-300",
                  dueDate && "text-white"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Set due date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            type="button"
            variant="outline"
            className={cn(
              "bg-slate-700/50 border-slate-600 text-slate-300",
              important && "text-amber-400 border-amber-400/50"
            )}
            onClick={() => setImportant(!important)}
          >
            <Star
              className={cn("mr-2 h-4 w-4", important && "fill-amber-400")}
            />
            {important ? "Important" : "Mark as important"}
          </Button>

          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 text-slate-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              {image ? "Change image" : "Add image"}
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {dueDate && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-slate-400"
              onClick={() => setDueDate(undefined)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear due date</span>
            </Button>
          )}
        </div>

        {image && (
          <div className="relative">
            <img
              src={image || "/image.png"}
              alt="Task preview"
              className="mt-2 max-h-40 rounded-md object-cover"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-slate-900/70 text-white hover:bg-slate-900"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            {initialData ? "Update" : "Add"} Task
          </Button>
        </div>
      </div>
    </form>
  );
}
