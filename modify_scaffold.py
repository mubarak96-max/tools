import sys

with open('src/components/tools/ToolPageScaffold.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add relatedGuides to props destruct
content = content.replace('  faqs,\n}: {', '  faqs,\n  relatedGuides,\n}: {')

# Add relatedGuides to type definition
content = content.replace('  faqs?: Array<{ question: string; answer: string }>;\n}) {', '  faqs?: Array<{ question: string; answer: string }>;\n  relatedGuides?: Array<{ title: string; href: string; description?: string }>;\n}) {')

# Add the render block
render_block = """
      {relatedGuides && relatedGuides.length > 0 ? (
        <section className="glass-card rounded-[1.75rem] border border-border/80 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Related Guides & Deep Dives</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group rounded-[1.25rem] border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-sm flex flex-col"
              >
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary">{guide.title}</h3>
                {guide.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
                )}
                <div className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read guide <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
"""

content = content.replace('      <RelatedToolsSection', render_block.strip() + '\n\n      <RelatedToolsSection')

with open('src/components/tools/ToolPageScaffold.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success!')
