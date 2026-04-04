'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRightLeft,
  Files,
  LayoutDashboard,
  ListChecks,
  Plus,
  Tags,
  UserCircle2,
  Wrench,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type NavBadgeTone = 'neutral' | 'success' | 'danger';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: NavBadgeTone;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

type MobileTab = {
  href: string;
  label: string;
  icon: LucideIcon;
  prominent?: boolean;
};

const desktopSections: NavSection[] = [
  {
    label: 'Content',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutDashboard },
      { href: '/admin/tools', label: 'Tools', icon: Wrench },
      { href: '/admin/pages', label: 'Pages', icon: Files },
      { href: '/admin/comparisons', label: 'Comparisons', icon: ArrowRightLeft },
    ],
  },
  {
    label: 'Editorial',
    items: [
      { href: '/admin/review', label: 'Review Queue', icon: ListChecks },
      { href: '/admin/categories', label: 'Taxonomies', icon: Tags },
    ],
  },
];

const mobileTabs: MobileTab[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/tools', label: 'Tools', icon: Wrench },
  { href: '/admin/tools/new', label: 'Add', icon: Plus, prominent: true },
  { href: '/admin/pages', label: 'Pages', icon: Files },
  { href: '/admin/review', label: 'Review', icon: ListChecks },
];

function matchesPath(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function badgeToneClass(tone: NavBadgeTone = 'neutral') {
  switch (tone) {
    case 'success':
      return 'bg-success-soft text-success-soft-foreground';
    case 'danger':
      return 'bg-danger-soft text-danger-soft-foreground';
    case 'neutral':
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function AdminShellNav({
  toolCount,
  reviewCount,
  lowConfidenceCount,
}: {
  toolCount: number;
  reviewCount: number;
  lowConfidenceCount: number;
}) {
  const pathname = usePathname();

  const sections = desktopSections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.href === '/admin/tools') {
        return { ...item, badge: String(toolCount), badgeTone: 'success' as const };
      }

      if (item.href === '/admin/review') {
        return { ...item, badge: String(reviewCount), badgeTone: 'neutral' as const };
      }

      if (item.href === '/admin/categories' && lowConfidenceCount > 0) {
        return { ...item, badge: String(lowConfidenceCount), badgeTone: 'danger' as const };
      }

      return item;
    }),
  }));

  return (
    <>
      <aside className="hidden w-[220px] shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-[0.8rem] bg-primary-soft text-xs font-semibold text-primary">
            F
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">findmytool</p>
          </div>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Admin
          </span>
        </div>

        <div className="flex-1 px-3 py-3">
          {sections.map((section) => (
            <div key={section.label} className="mb-6 last:mb-0">
              <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {section.label}
              </p>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = matchesPath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-3 rounded-[0.95rem] px-3 py-2.5 text-sm transition-colors',
                        active
                          ? 'bg-muted text-foreground'
                          : 'text-slate-700 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0',
                          active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
                        )}
                      />
                      <span>{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            'ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium',
                            badgeToneClass(item.badgeTone),
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
              N
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">Admin</p>
              <p className="text-[11px] text-muted-foreground">Publisher</p>
            </div>
            <Link href="/" className="text-muted-foreground hover:text-primary" target="_blank">
              <UserCircle2 className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="border-b border-border bg-card px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[0.7rem] bg-primary-soft text-[11px] font-semibold text-primary">
              F
            </div>
            <span className="text-sm font-semibold text-foreground">findmytool</span>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Admin
            </span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
            N
          </div>
        </div>

        <div className="mt-3 rounded-[0.95rem] border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground">
          Search records...
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/98 px-2 pb-5 pt-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-5 gap-1">
          {mobileTabs.map((item) => {
            const Icon = item.icon;
            const active = matchesPath(pathname, item.href);

            if (item.prominent) {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 py-1">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 py-1"
              >
                <Icon className={cn('h-5 w-5', active ? 'text-foreground' : 'text-muted-foreground')} />
                <span className={cn('text-[10px]', active ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                  {item.label}
                </span>
                <span className={cn('h-1 w-1 rounded-full', active ? 'bg-foreground' : 'bg-transparent')} />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
