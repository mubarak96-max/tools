import JsonLd from "@/components/seo/JsonLd";
import { formatPostDate, getBlogPost } from "@/lib/blog/posts";
import { buildBlogPostingJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export function BlogPostSchema({ slug }: { slug: string }) {
  const post = getBlogPost(slug);

  return (
    <JsonLd
      data={serializeJsonLd(
        buildBlogPostingJsonLd({
          path: `/blog/${post.slug}`,
          title: post.title,
          description: post.description,
          datePublished: post.datePublished,
          dateModified: post.dateModified,
        }),
      )}
    />
  );
}

export function PostDates({ slug }: { slug: string }) {
  const { datePublished, dateModified } = getBlogPost(slug);

  return (
    <span>
      Published <time dateTime={datePublished}>{formatPostDate(datePublished)}</time>
      {dateModified !== datePublished ? (
        <>
          {" · "}Updated <time dateTime={dateModified}>{formatPostDate(dateModified)}</time>
        </>
      ) : null}
    </span>
  );
}
