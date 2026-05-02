"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Tool = {
  name: string;
  href: string;
  description: string;
  category: string;
};

interface ToolGridProps {
  tools: Tool[];
}

export default function ToolGrid({ tools }: ToolGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(tools.map((t) => t.category))];
    return cats;
  }, [tools]);

  const filteredTools = useMemo(() => {
    if (activeCategory === "All") return tools;
    return tools.filter((t) => t.category === activeCategory);
  }, [tools, activeCategory]);

  const getTagColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "finance":
        return "bg-success-soft text-success";
      case "text":
        return "bg-[#fdf4ff] text-[#9333ea]";
      case "image":
        return "bg-primary-soft text-primary";
      case "seo":
        return "bg-warning-soft text-warning";
      case "health":
        return "bg-danger-soft text-danger";
      case "marketing":
        return "bg-info-soft text-info";
      default:
        return "bg-muted text-secondary";
    }
  };

  return (
    <div className="content">
      {/* Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`stripe-chip ${activeCategory === cat ? "on" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground font-medium">
          {filteredTools.length} tools
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Link key={tool.href} href={tool.href} className="stripe-card group">
            <div className="flex items-start justify-between">
              <div className="text-[13px] font-semibold text-foreground leading-tight group-hover:text-primary transition-colors pr-6">
                {tool.name}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary shrink-0" />
            </div>
            <div className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {tool.description}
            </div>
            <div className="mt-auto pt-2">
              <span className={`stripe-tag ${getTagColor(tool.category)}`}>
                {tool.category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
