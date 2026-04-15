import type { EditorialContent } from "@/lib/tool-page-content/common";

export function renderEditorialContent(content: EditorialContent) {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {content.introHeading}
      </h2>
      {content.introParagraphs.map((paragraph) => (
        <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
          {paragraph}
        </p>
      ))}
      {content.sections.map((section) => (
        <div key={section.heading}>
          <h2 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
            {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
