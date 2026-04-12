"use client";

import type { FreeToolMeta } from "@/types/tools";
import { hrefToSlug } from "@/lib/tool-icon-resolve";
import { ToolIcon } from "@/lib/tool-icons";

export function FreeToolIcon({
  tool,
  size = 18,
  className = "text-muted-foreground",
}: {
  tool: FreeToolMeta;
  size?: number;
  className?: string;
}) {
  return (
    <ToolIcon
      slug={hrefToSlug(tool.href)}
      title={tool.name}
      category={tool.category}
      iconify={tool.iconify}
      size={size}
      className={className}
    />
  );
}
