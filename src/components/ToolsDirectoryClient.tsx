'use client';

import { useMemo, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import ToolDirectoryGridCard from '@/components/ToolDirectoryGridCard';
import type { Tool } from '@/types/database';

type SortOption = 'name' | 'pricing' | 'confidence';
type FilterGroup = 'category' | 'pricing' | 'platform' | 'difficulty';
type SearchParamsLike = {
  get: (name: string) => string | null;
  getAll: (name: string) => string[];
};

const sortOrder: SortOption[] = ['name', 'pricing', 'confidence'];

function uniqueSorted(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right),
  );
}

function matchesQuery(tool: Tool, query: string) {
  const haystack = [
    tool.name,
    tool.category,
    tool.shortDescription,
    tool.description,
    tool.pricing,
    tool.pricingRange,
    tool.bestFor,
    ...tool.useCases,
    ...tool.features,
    ...tool.platforms,
    ...tool.integrations,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function getFilters(searchParams: SearchParamsLike) {
  return {
    categories: searchParams.getAll('category'),
    pricings: searchParams.getAll('pricing'),
    platforms: searchParams.getAll('platform'),
    difficulties: searchParams.getAll('difficulty'),
    sort: (searchParams.get('sort') as SortOption | null) ?? 'name',
  };
}

function getPricingRank(tool: Tool) {
  const order = ['free', 'freemium', 'paid', 'custom'];
  const rank = order.indexOf(tool.pricingModel);
  return rank === -1 ? order.length : rank;
}

export default function ToolsDirectoryClient({ tools }: { tools: Tool[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const query = searchParams.get('q')?.trim() || '';

  const { categories, pricings, platforms, difficulties, sort } = useMemo(
    () => getFilters(searchParams),
    [searchParams],
  );

  const categoryOptions = useMemo(
    () => uniqueSorted(tools.map((tool) => tool.category)),
    [tools],
  );
  const pricingOptions = useMemo(
    () => uniqueSorted(tools.map((tool) => tool.pricing)),
    [tools],
  );
  const platformOptions = useMemo(
    () => uniqueSorted(tools.flatMap((tool) => tool.platforms)),
    [tools],
  );
  const difficultyOptions = useMemo(
    () => uniqueSorted(tools.map((tool) => tool.difficulty)),
    [tools],
  );

  const filteredTools = useMemo(() => {
    const q = searchParams.get('q')?.trim() || '';

    let result = tools.filter((tool) => {
      if (q && !matchesQuery(tool, q)) return false;
      if (categories.length > 0 && !categories.includes(tool.category)) return false;
      if (pricings.length > 0 && !pricings.includes(tool.pricing)) return false;
      if (
        platforms.length > 0 &&
        !platforms.some((platform: string) => tool.platforms.includes(platform))
      ) {
        return false;
      }
      if (difficulties.length > 0 && !difficulties.includes(tool.difficulty)) return false;
      return true;
    });

    if (sort === 'pricing') {
      result = [...result].sort(
        (left, right) =>
          getPricingRank(left) - getPricingRank(right) || left.name.localeCompare(right.name),
      );
    } else if (sort === 'confidence') {
      result = [...result].sort(
        (left, right) =>
          (right.sourceConfidence ?? 0.8) - (left.sourceConfidence ?? 0.8) ||
          left.name.localeCompare(right.name),
      );
    } else {
      result = [...result].sort((left, right) => left.name.localeCompare(right.name));
    }

    return result;
  }, [categories, difficulties, platforms, pricings, searchParams, sort, tools]);

  const activeFilters = [
    ...categories.map((value: string) => ({ group: 'category' as const, value })),
    ...pricings.map((value: string) => ({ group: 'pricing' as const, value })),
    ...platforms.map((value: string) => ({ group: 'platform' as const, value })),
    ...difficulties.map((value: string) => ({ group: 'difficulty' as const, value })),
  ];

  function updateParams(mutator: (nextParams: URLSearchParams) => void) {
    startTransition(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      mutator(nextParams);
      const next = nextParams.toString();
      router.replace(next ? `${pathname}?${next}` : pathname);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateParams((nextParams) => {
      const formData = new FormData(event.currentTarget);
      const submittedQuery = String(formData.get('q') || '').trim();

      if (submittedQuery) {
        nextParams.set('q', submittedQuery);
      } else {
        nextParams.delete('q');
      }
    });
  }

  function toggleFilter(group: FilterGroup, value: string) {
    updateParams((nextParams) => {
      const current = nextParams.getAll(group);
      nextParams.delete(group);

      if (current.includes(value)) {
        current.filter((entry) => entry !== value).forEach((entry) => nextParams.append(group, entry));
      } else {
        [...current, value].sort((left, right) => left.localeCompare(right)).forEach((entry) =>
          nextParams.append(group, entry),
        );
      }
    });
  }

  function removeFilter(group: FilterGroup, value: string) {
    updateParams((nextParams) => {
      const current = nextParams.getAll(group).filter((entry) => entry !== value);
      nextParams.delete(group);
      current.forEach((entry) => nextParams.append(group, entry));
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.replace(pathname);
    });
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="space-y-6">
        <section className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Software directory</h1>
          <p className="text-sm text-muted-foreground">
            Browse and filter reviewed tools by category, pricing, and platform.
          </p>
        </section>

        <form
          action="/tools"
          onSubmit={handleSubmit}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex min-w-[220px] flex-1 items-center gap-3 rounded-[1rem] border border-border bg-card px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              key={query}
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search tools..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <select
            value={sort}
            onChange={(event) =>
              updateParams((nextParams) => {
                const nextSort = event.target.value as SortOption;
                if (nextSort === 'name') {
                  nextParams.delete('sort');
                } else if (sortOrder.includes(nextSort)) {
                  nextParams.set('sort', nextSort);
                }
              })
            }
            className="rounded-[1rem] border border-border bg-card px-4 py-3 text-sm text-foreground outline-none"
          >
            <option value="name">Sort: A-Z</option>
            <option value="pricing">Sort: Free first</option>
            <option value="confidence">Sort: Confidence</option>
          </select>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-[1rem] border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/20 hover:bg-primary-soft hover:text-primary disabled:opacity-70"
          >
            Search
          </button>

          <span className="ml-auto text-sm text-muted-foreground">
            {filteredTools.length} tool{filteredTools.length === 1 ? '' : 's'}
          </span>
        </form>

        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <button
                key={`${filter.group}:${filter.value}`}
                type="button"
                onClick={() => removeFilter(filter.group, filter.value)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-medium text-primary"
              >
                {filter.value}
                <X className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-start gap-6">
          <aside className="sticky top-28 hidden w-[210px] shrink-0 rounded-[1.5rem] border border-border bg-card p-5 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Filter
            </p>

            <div className="mt-5 space-y-5">
              <FilterBlock
                label="Category"
                options={categoryOptions}
                selected={categories}
                onToggle={(value) => toggleFilter('category', value)}
              />
              <FilterBlock
                label="Pricing"
                options={pricingOptions}
                selected={pricings}
                onToggle={(value) => toggleFilter('pricing', value)}
              />
              <FilterBlock
                label="Platform"
                options={platformOptions}
                selected={platforms}
                onToggle={(value) => toggleFilter('platform', value)}
              />
              <FilterBlock
                label="Difficulty"
                options={difficultyOptions}
                selected={difficulties}
                onToggle={(value) => toggleFilter('difficulty', value)}
                bordered={false}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {filteredTools.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredTools.map((tool) => (
                  <ToolDirectoryGridCard key={tool.slug} tool={tool} />
                ))}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-border bg-card px-6 py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  No tools match your filters.{' '}
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="font-medium text-primary hover:text-primary-hover"
                  >
                    Clear filters
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-3 lg:hidden">
          <details className="rounded-[1.5rem] border border-border bg-card p-5">
            <summary className="cursor-pointer text-sm font-medium text-foreground">Filters</summary>
            <div className="mt-4 space-y-5">
              <FilterBlock
                label="Category"
                options={categoryOptions}
                selected={categories}
                onToggle={(value) => toggleFilter('category', value)}
              />
              <FilterBlock
                label="Pricing"
                options={pricingOptions}
                selected={pricings}
                onToggle={(value) => toggleFilter('pricing', value)}
              />
              <FilterBlock
                label="Platform"
                options={platformOptions}
                selected={platforms}
                onToggle={(value) => toggleFilter('platform', value)}
              />
              <FilterBlock
                label="Difficulty"
                options={difficultyOptions}
                selected={difficulties}
                onToggle={(value) => toggleFilter('difficulty', value)}
                bordered={false}
              />
            </div>
          </details>
        </div>

        {query ? (
          <div className="text-xs text-muted-foreground">
            Search is matching tool names, descriptions, categories, pricing, features, platforms, and use cases.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FilterBlock({
  label,
  options,
  selected,
  onToggle,
  bordered = true,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  bordered?: boolean;
}) {
  return (
    <div className={bordered ? 'border-b border-border pb-5' : ''}>
      <p className="mb-2 text-sm text-muted-foreground">{label}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => onToggle(option)}
              className="h-4 w-4 accent-primary"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
