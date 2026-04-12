"use client";

import { Icon } from "@iconify/react";

import { getToolIconName, type ToolIconInput } from "@/lib/tool-icon-resolve";

export type { ToolIconInput };

type ToolIconProps = ToolIconInput & {
  size?: number;
  className?: string;
};

export function ToolIcon({
  slug,
  title,
  category,
  iconify,
  size = 18,
  className,
}: ToolIconProps) {
  const icon = getToolIconName({ slug, title, category, iconify });

  return (
    <Icon icon={icon} width={size} height={size} className={className} aria-hidden="true" />
  );
}
