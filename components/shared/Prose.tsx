import Image from "next/image";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";

export type ImageDimensions = Record<string, { width: number; height: number; alt: string }>;

type Props = {
  markdown: string;
  className?: string;
  /** Known images (by URL) so they can render through next/image without layout shift. */
  images?: ImageDimensions;
};

function buildComponents(images: ImageDimensions): Components {
  return {
    // The page owns the h1; demote anything the author writes.
    h1: ({ children }) => <h2>{children}</h2>,
    a: ({ href, children }) => {
      const external = typeof href === "string" && /^https?:\/\//.test(href);
      return (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>
          {children}
        </a>
      );
    },
    img: ({ src, alt, title }) => {
      const url = typeof src === "string" ? src : "";
      const known = images[url];
      const caption = title?.trim();
      const image = known ? (
        <Image src={url} alt={alt ?? known.alt} width={known.width} height={known.height} sizes="(min-width: 1024px) 60vw, 100vw" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt ?? ""} loading="lazy" decoding="async" />
      );
      return (
        <figure>
          {image}
          {caption ? <figcaption>{caption}</figcaption> : null}
        </figure>
      );
    },
    // Unwrap paragraphs that only contain an image so <figure> is not nested in <p>.
    p: ({ children, node }) => {
      const only = node?.children.length === 1 ? node.children[0] : undefined;
      if (only && only.type === "element" && only.tagName === "img") return <>{children}</>;
      return <p>{children}</p>;
    },
  };
}

/**
 * Markdown renderer for case studies and bios. No raw HTML is ever rendered
 * (skipHtml) and react-markdown's default URL transform drops javascript: links.
 */
export function Prose({ markdown, className, images = {} }: Props) {
  return (
    <div className={cn("prose", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={buildComponents(images)}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
