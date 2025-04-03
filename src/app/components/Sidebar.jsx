"use client";
import React from "react";
import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  Home,
  List,
  Menu,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  Goal,
  Briefcase,
} from "lucide-react";
import { cn } from "@components/lib/utils";
import { Avatar, AvatarFallback } from "@components/components/ui/avatar";
import { Button } from "@components/components/ui/button";
import { Input } from "@components/components/ui/input";

export const Sidebar = ({
  activeList,
  setActiveList,
  counts,
  isOpen,
  setIsOpen,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const sidebarItems = [
    {
      id: "my-day",
      label: "My Day",
      icon: Home,
      count: counts?.["my-day"] || 0,
    },
    {
      id: "important",
      label: "Important",
      icon: Star,
      count: counts?.["important"] || 0,
    },
    {
      id: "planned",
      label: "Planned",
      icon: Calendar,
      count: counts?.["planned"] || 0,
    },
    {
      id: "completed",
      label: "Completed",
      icon: CheckCircle2,
      count: counts?.["completed"] || 0,
    },
    {
      id: "in-progress",
      label: "In Progress",
      icon: Clock,
      count: counts?.["in-progress"] || 0,
    },
    { id: "all", label: "All Tasks", icon: List, count: counts?.["all"] || 0 },
    { id: "goals", label: "Goals", icon: Goal, count: 0 },
    { id: "projects", label: "Projects", icon: Briefcase, count: 0 },
  ];
  return (
    <div
      className={cn(
        "h-full bg-slate-900 text-white flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-16"
      )}
    >
      <div className="flex items-center p-4">
        {isOpen ? (
          <>
            {/* avatar img */}
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-blue-500">TS</AvatarFallback>
            </Avatar>
            {/* avatar img ends */}

            {/* User Status */}
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Todo App</p>
              <p className="text-xs text-slate-400 truncate">
                Seidutesleem72@gmail.com
              </p>
            </div>
            {/* User Status ends */}
            {/* close btn */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </>
        ) : (
          // Expand btn
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            className="mx-auto text-slate-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search btn */}
      {isOpen && (
        <div className="px-4 mb-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-300 placeholder:text-slate-500"
            />
          </div>
        </div>
      )}
      {/* Search btn ends */}

      {/* sidebar nav tabs */}
      <div className="flex-1 overflow-auto">
        <nav className="px-2 py-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start mb-1 text-slate-300 hover:text-white hover:bg-slate-800",
                activeList === item.id && "bg-slate-800 text-white"
              )}
              onClick={() => setActiveList(item.id)}
            >
              <item.icon className={cn("h-5 w-5 mr-3", !isOpen && "mx-auto")} />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count > 0 && (
                    <span className="ml-auto text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>
      </div>
      {/* sidebar nav tabs ends */}

      {/* add new list btn */}
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
            !isOpen && "justify-center"
          )}
        >
          <Plus className="h-5 w-5 mr-3" />
          {isOpen && <span>New list</span>}
        </Button>
      </div>
      {/* add new list btn ends */}
    </div>
  );
};
