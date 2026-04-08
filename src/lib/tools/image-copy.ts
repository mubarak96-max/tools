import type { ImageTool } from "@/lib/tools/image-catalog";
import { IMAGE_FORMAT_LABELS } from "@/lib/tools/image-format-conversion";

export function buildImageToolCopy(tool: ImageTool) {
  const reviewFaq = {
    question: "Should I check the final result before downloading it?",
    answer:
      "Yes. Browser-based image tools are fast, but it is still worth checking dimensions, legibility, file size, and color appearance before you use the output anywhere public.",
  };

  if (tool.conversion) {
    const sourceLabel = IMAGE_FORMAT_LABELS[tool.conversion.source];
    const targetLabel = IMAGE_FORMAT_LABELS[tool.conversion.target];

    return {
      heading: `When converting ${sourceLabel} to ${targetLabel} is useful`,
      paragraphs: [
        `${sourceLabel} to ${targetLabel} conversion helps when a file is in the wrong format for a website, CMS, upload field, email attachment, or editing workflow. Sometimes the content is fine and only the format needs to change.`,
        `This page keeps that job focused on one exact conversion. Upload a ${sourceLabel} file, export it as ${targetLabel}, and download the result without switching through unrelated image tools.`,
      ],
      faqs: [
        {
          question: `Why would I convert ${sourceLabel} to ${targetLabel}?`,
          answer:
            `${targetLabel} may be easier to upload, edit, share, or reuse depending on the tool you are working in. Converting the file is often faster than recreating the image from scratch.`,
        },
        {
          question: `Will the converted ${targetLabel} file look exactly the same as the original ${sourceLabel}?`,
          answer:
            "The visible image should stay close to the original, but some formats handle compression, transparency, and metadata differently. It is always worth checking the output before you use it publicly.",
        },
        reviewFaq,
      ],
    };
  }

  switch (tool.kind) {
    case "random-color-generator":
      return {
        heading: "How this color generator helps",
        paragraphs: [
          "Picking colors from scratch can slow down design work, especially when you just need a fresh starting point for a background, accent, border, or mockup. This generator gives you quick options without opening a separate palette tool.",
          "Use it when you need single-color inspiration, a rough palette to iterate on, or a fast way to copy clean hex values into CSS, Tailwind, Figma, or any design workflow.",
        ],
        faqs: [
          {
            question: "What is a random color generator useful for?",
            answer:
              "It is useful for quick design exploration, placeholder styling, moodboard work, UI experiments, and any situation where you want fast color ideas without manually choosing every shade.",
          },
          {
            question: "Can I copy individual colors and full palettes?",
            answer:
              "Yes. The page is meant for both quick one-off colors and small palette sets, so you can copy exactly what you need and move on.",
          },
          reviewFaq,
        ],
      };
    case "image-to-base64":
      return {
        heading: "When image to Base64 conversion is useful",
        paragraphs: [
          "Base64 image conversion is useful when you need to embed a small image directly into HTML, CSS, JSON, or another payload without uploading it separately first.",
          "This page keeps the process simple: upload an image, review the preview, then copy either the raw Base64 string or the full data URL depending on what your next tool expects.",
        ],
        faqs: [
          {
            question: "What is the difference between Base64 and a data URL?",
            answer:
              "Base64 is the encoded string itself. A data URL includes the MIME type prefix as well, which makes it ready to drop directly into image sources or CSS values.",
          },
          {
            question: "When should I use this instead of a normal image file?",
            answer:
              "Use it for inline embeds, quick tests, email templates, small assets, or payload-based workflows. For larger images, normal files are usually easier to manage and more efficient.",
          },
          reviewFaq,
        ],
      };
    case "image-colors-inverter":
      return {
        heading: "How this image inverter is useful",
        paragraphs: [
          "Inverting colors can help with quick visual experiments, meme edits, dark-on-light reversals, or checking how an image behaves with the opposite color balance.",
          "This page is designed for lightweight browser editing: upload the image, review the inverted version side by side, and download it immediately when it looks right.",
        ],
        faqs: [
          {
            question: "What happens when I invert image colors?",
            answer:
              "Each visible color channel is flipped to its opposite value, which creates a negative-style version of the image. Light areas become dark, and colors shift to their complementary opposites.",
          },
          {
            question: "Will this change the image size or crop it?",
            answer:
              "No. The tool keeps the same dimensions and only changes the pixel colors.",
          },
          reviewFaq,
        ],
      };
    case "flip-image-online":
      return {
        heading: "When flipping an image online saves time",
        paragraphs: [
          "Flipping an image is a small task, but it comes up often: mirrored product shots, reversed screenshots, social graphics, icons, and assets that need a quick orientation fix before publishing.",
          "This tool keeps it simple by letting you upload once, preview the flipped result, and download the corrected image without opening a heavier editor.",
        ],
        faqs: [
          {
            question: "What is the difference between horizontal and vertical flip?",
            answer:
              "A horizontal flip mirrors the image left-to-right. A vertical flip mirrors it top-to-bottom. The right choice depends on whether you are correcting direction or rotating the visual emphasis.",
          },
          {
            question: "Will this reduce image quality?",
            answer:
              "The tool preserves the image dimensions and applies the flip in the browser. It is still worth checking the downloaded file if the image contains very fine details or text.",
          },
          reviewFaq,
        ],
      };
    case "image-cropper-resizer":
      return {
        heading: "How this cropper and resizer helps",
        paragraphs: [
          "Cropping and resizing are two of the most common image cleanup tasks. This page lets you tighten the visible area, set a new output size, and download the updated image without opening a full editor.",
          "It is useful for profile images, blog uploads, CMS assets, screenshots, thumbnails, and any workflow where the source image is close to right but still needs one quick adjustment before publishing.",
        ],
        faqs: [
          {
            question: "What is the difference between cropping and resizing?",
            answer:
              "Cropping removes part of the image outside the selected region. Resizing keeps the selected region but changes the final output dimensions.",
          },
          {
            question: "When should I crop before resizing?",
            answer:
              "Crop first when the framing is wrong or there is extra background you do not want. Resize after that when you need the final image to fit a specific slot, thumbnail size, or upload requirement.",
          },
          reviewFaq,
        ],
      };
    case "image-compressor":
      return {
        heading: "How this image compressor helps",
        paragraphs: [
          "Large image files slow down uploads, emails, CMS entries, and page speed. This tool lets you reduce file size quickly in the browser while still checking the visual result before you download it.",
          "It is useful for web uploads, blog images, support attachments, and any workflow where you need a lighter file but still want control over output format and quality.",
        ],
        faqs: [
          {
            question: "What is the best way to compress an image without ruining it?",
            answer:
              "Start with a moderate quality setting, compare the preview, and only push compression harder if the file is still too large. WebP and JPEG usually compress more efficiently than PNG for photos.",
          },
          {
            question: "Will compression change the image dimensions?",
            answer:
              "Not by itself. Compression mainly affects how the image data is stored. If you need smaller dimensions too, crop or resize the image separately.",
          },
          reviewFaq,
        ],
      };
    case "image-watermark":
      return {
        heading: "When a watermark tool is useful",
        paragraphs: [
          "Watermarks are useful when you want to label preview images, add attribution, protect draft visuals, or brand assets before sharing them publicly.",
          "This page is designed for quick text watermarking in the browser: upload the source image, adjust the text, preview the overlay, and download the marked version without a heavier editor.",
        ],
        faqs: [
          {
            question: "What kind of watermark works best?",
            answer:
              "A short, readable watermark usually works best. Keep the text legible enough to be visible, but not so heavy that it ruins the underlying image.",
          },
          {
            question: "Should I place the watermark in a corner or across the image?",
            answer:
              "Corner placement is cleaner for everyday branding. A larger centered or diagonal placement is more noticeable when the goal is stronger content protection.",
          },
          reviewFaq,
        ],
      };
    case "image-pixelator":
      return {
        heading: "How this pixelator is useful",
        paragraphs: [
          "Pixelation can be used for stylized graphics, retro effects, censored areas, and quick mockups where a rougher block-based look is part of the design.",
          "This page lets you increase pixel size visually and download the result once the image reaches the level of chunkiness or abstraction you want.",
        ],
        faqs: [
          {
            question: "What does pixelation actually change?",
            answer:
              "It reduces visual detail by grouping neighboring pixels into larger color blocks. The stronger the pixelation, the less fine detail remains.",
          },
          {
            question: "When is pixelation better than blur?",
            answer:
              "Pixelation is better when you want a deliberate visual effect or a stronger block-based censoring style. Blur is usually better when you want something softer and less stylized.",
          },
          reviewFaq,
        ],
      };
    case "image-blur-pixelate":
      return {
        heading: "How blur and pixelation differ",
        paragraphs: [
          "Blur softens an image by smoothing detail, while pixelation reduces detail by turning it into larger square blocks. This tool gives you both options on one standalone page because they solve similar image-obscuring tasks in different ways.",
          "Use it for privacy masking, stylized edits, visual hierarchy experiments, or quick before-and-after comparisons when you need to reduce detail without opening a full editor.",
        ],
        faqs: [
          {
            question: "Should I blur, pixelate, or use both?",
            answer:
              "Use blur when you want a softer effect. Use pixelation when you want a stronger block-style treatment. Combine both when you need to hide detail more aggressively while still controlling the look.",
          },
          {
            question: "Is this only for censorship effects?",
            answer:
              "No. It is also useful for stylized artwork, background softening, mockups, and directing attention away from less important parts of an image.",
          },
          reviewFaq,
        ],
      };
    case "paste-image-to-download":
      return {
        heading: "Why clipboard image download is useful",
        paragraphs: [
          "A lot of screenshots and copied images live on the clipboard for only a moment. This page turns that quick copy-paste step into a simple download workflow so you can save the image immediately instead of opening an editor first.",
          "It is useful for pasted screenshots, copied chat images, snippets from docs, and any case where you already have the image in the clipboard and just want a file back.",
        ],
        faqs: [
          {
            question: "What kinds of pasted images work here?",
            answer:
              "Clipboard images from screenshots, copied graphics, browser content, and many desktop apps usually work as long as the browser exposes the image data to the page.",
          },
          {
            question: "Do I have to upload a file first?",
            answer:
              "No. This page is built specifically for paste-first workflows, so the image can come straight from the clipboard.",
          },
          reviewFaq,
        ],
      };
    case "trim-transparent-pixels":
      return {
        heading: "When trimming transparent pixels saves time",
        paragraphs: [
          "Transparent padding is common in exported PNGs, icons, stickers, and screenshots. This tool finds the visible bounds automatically and crops away the empty transparent edges for you.",
          "It is useful when an asset looks centered but still takes up too much space around the edges, or when you need a tighter image before using it in a design, CMS, or export flow.",
        ],
        faqs: [
          {
            question: "What does trimming transparent pixels remove?",
            answer:
              "It removes only fully transparent outer edges. Visible pixels remain untouched, so the content stays the same while the canvas becomes tighter.",
          },
          {
            question: "Does this work best with PNG files?",
            answer:
              "Yes. It is most useful for images that actually contain transparency, which usually means PNG or similar alpha-capable formats.",
          },
          reviewFaq,
        ],
      };
    case "add-borders-to-image":
      return {
        heading: "Why adding a border can help an image",
        paragraphs: [
          "A border can give an image more separation from the background, make screenshots easier to read, or help a visual fit neatly into a design system with consistent framing.",
          "This page lets you add a clean solid border quickly without opening a design tool. Choose the border size and color, preview the result, and download it once the framing feels right.",
        ],
        faqs: [
          {
            question: "When should I add a border to an image?",
            answer:
              "Use a border when the image blends into the page background too much, when screenshots need clearer edges, or when you want more consistent framing across a group of visuals.",
          },
          {
            question: "Should the border color match the image or the layout?",
            answer:
              "Usually the layout. Neutral borders work best for screenshots and UI captures, while accent borders are more useful when the border itself is part of the design style.",
          },
          reviewFaq,
        ],
      };
    case "split-images-online":
      return {
        heading: "When splitting an image online is useful",
        paragraphs: [
          "Splitting one image into smaller pieces is useful for tile layouts, social carousels, grid-based posts, print sections, and any workflow where one visual needs to become several smaller assets.",
          "This page keeps the task focused: choose how many rows and columns you want, generate the pieces, and download only the segments you actually need.",
        ],
        faqs: [
          {
            question: "What happens when I split an image into rows and columns?",
            answer:
              "The tool divides the original image into equal rectangular sections based on the row and column settings, then outputs each section as its own downloadable image.",
          },
          {
            question: "Will splitting reduce image quality?",
            answer:
              "The tool keeps the original pixel data for each section. The main change is that the source image becomes several separate files instead of one full canvas.",
          },
          reviewFaq,
        ],
      };
    case "merge-images-online":
      return {
        heading: "Why a merge tool saves time",
        paragraphs: [
          "Merging images is useful when you want one combined file instead of several separate uploads, especially for before-and-after comparisons, product variants, story panels, or stacked reference boards.",
          "This page lets you upload multiple files, choose a direction, control the spacing, and generate one clean merged result without opening a layout editor.",
        ],
        faqs: [
          {
            question: "Can I merge images vertically or horizontally?",
            answer:
              "Yes. This page supports both stacked and side-by-side output so you can choose the layout that fits your final destination better.",
          },
          {
            question: "Do all images need to be the same size first?",
            answer:
              "No. The tool can still combine them, but the final result will look cleaner when the source images are roughly similar in size or aspect ratio.",
          },
          reviewFaq,
        ],
      };
    case "pixel-art-converter":
      return {
        heading: "How a pixel-art converter is useful",
        paragraphs: [
          "Pixel-art conversion is useful when you want a retro game look, a simplified blocky illustration, or a more stylized low-detail version of an image.",
          "This page combines bigger pixel blocks with lighter color reduction so you can push a photo or graphic toward pixel art without installing a desktop tool.",
        ],
        faqs: [
          {
            question: "What is the difference between pixelation and pixel-art conversion?",
            answer:
              "Basic pixelation mainly enlarges the visible blocks. Pixel-art conversion goes a bit further by also simplifying the color detail so the result feels more stylized and less photographic.",
          },
          {
            question: "How do I get a cleaner pixel-art look?",
            answer:
              "Use larger block sizes and fewer color levels. That combination usually creates a stronger retro effect than pixel size alone.",
          },
          reviewFaq,
        ],
      };
    case "image-to-ascii-converter":
      return {
        heading: "Why image to ASCII conversion is still useful",
        paragraphs: [
          "ASCII image conversion is useful for text-based mockups, dev experiments, retro terminal visuals, creative posts, and any workflow where you want an image translated into characters instead of pixels.",
          "This page samples the uploaded image, converts brightness into characters, and gives you copyable ASCII output without needing a separate command-line tool.",
        ],
        faqs: [
          {
            question: "What makes ASCII art readable?",
            answer:
              "Readable ASCII art depends on the character set, output width, and image contrast. Cleaner source images with stronger light-dark separation usually convert better.",
          },
          {
            question: "Can I copy the ASCII output into other apps?",
            answer:
              "Yes. The output is plain text, so you can copy it into editors, chat apps, code blocks, docs, or anywhere else that preserves monospace formatting reasonably well.",
          },
          reviewFaq,
        ],
      };
    case "online-collage-maker":
      return {
        heading: "When a simple collage maker is enough",
        paragraphs: [
          "A lightweight collage maker is useful when you just need a quick grid of several images for a brief, summary, showcase, or social post without spending time in a full design app.",
          "This page focuses on the essentials: upload a set of images, choose the columns, set the spacing and background, then download the combined collage.",
        ],
        faqs: [
          {
            question: "What kind of images work best in a collage?",
            answer:
              "Images with similar proportions and visual weight usually look more balanced together, but you can still use mixed sizes when speed matters more than perfect symmetry.",
          },
          {
            question: "Can I make a collage for social previews or moodboards?",
            answer:
              "Yes. This kind of simple collage is especially useful for social drafts, quick summaries, client options, and reference boards.",
          },
          reviewFaq,
        ],
      };
    case "laser-eyes-meme-generator":
      return {
        heading: "What makes a laser-eyes meme tool useful",
        paragraphs: [
          "Laser-eyes edits are mostly about speed. When the joke or meme idea is already clear, the useful part is being able to position the effect quickly, preview it, and export the image without wrestling with a full editor.",
          "This page keeps that workflow tight by giving you simple eye positioning and beam controls so you can make the edit fast and move on.",
        ],
        faqs: [
          {
            question: "How do I get the laser eyes to line up properly?",
            answer:
              "Start by matching each eye position closely, then adjust the beam length and angle only after the glow sits in the right place. The eye positions matter more than the beam styling.",
          },
          {
            question: "Does this work best on front-facing photos?",
            answer:
              "Yes. Front-facing or near-front-facing portraits are the easiest because both eyes are visible and the effect looks more balanced.",
          },
          reviewFaq,
        ],
      };
    case "image-exif-viewer-metadata-remover":
      return {
        heading: "Why EXIF data matters",
        paragraphs: [
          "Images can carry hidden metadata such as camera model, date taken, orientation, and location-related information. That metadata can be useful when you want to inspect a file, but it can also be something you want to remove before sharing the image publicly.",
          "This page gives you both actions in one place: inspect readable metadata from the uploaded file, then export a clean browser-rendered copy with that metadata stripped out.",
        ],
        faqs: [
          {
            question: "What kind of metadata can EXIF contain?",
            answer:
              "EXIF can include camera make and model, capture date, orientation, lens details, focal length, and in some cases location-related data depending on how the image was created.",
          },
          {
            question: "How does metadata removal work here?",
            answer:
              "The page redraws the image onto a fresh browser canvas and exports a new file. That new export keeps the visible image but drops the original EXIF metadata block.",
          },
          reviewFaq,
        ],
      };
    case "website-color-palette-extractor":
      return {
        heading: "When extracting colors from a website helps",
        paragraphs: [
          "Website color extraction is useful when you want to study a brand palette, match a UI more closely, or pull out recurring accent colors from a site before designing related assets.",
          "This page fetches a live URL, scans its HTML and stylesheet content for recurring color values, and turns the strongest matches into a quick copyable palette.",
        ],
        faqs: [
          {
            question: "What colors does the extractor look for?",
            answer:
              "It looks for color values used in the page markup and stylesheet content, including common hex, RGB, and HSL-style colors that usually drive the visible interface palette.",
          },
          {
            question: "Will the extracted palette always match what I see on screen?",
            answer:
              "It will usually get you close, but some sites generate colors dynamically, use images heavily, or load styles in ways that affect what can be detected from the source.",
          },
          reviewFaq,
        ],
      };
    case "website-screenshot-tool":
      return {
        heading: "Why a website screenshot tool is useful",
        paragraphs: [
          "Website screenshots are useful for reviews, QA notes, competitor research, design references, and client communication. The practical value is being able to grab a rendered page quickly without opening a separate capture app.",
          "This page takes a live URL, opens it in a browser renderer, and returns a downloadable screenshot so you can capture the page you need without leaving the site.",
        ],
        faqs: [
          {
            question: "Will the screenshot match the live site exactly?",
            answer:
              "It should be close, but live websites can still vary based on location, cookies, login state, scripts, or time-sensitive content. It is best to review the final image after capture.",
          },
          {
            question: "When should I use full-page capture?",
            answer:
              "Use full-page capture when you need the whole scrollable page. Use a fixed viewport when you only care about the visible top section or want a smaller output file.",
          },
          reviewFaq,
        ],
      };
  }
}
