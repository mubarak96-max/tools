import * as prettier from "prettier/standalone";
import * as babelPlugin from "prettier/plugins/babel";
import * as estreePlugin from "prettier/plugins/estree";
import * as htmlPlugin from "prettier/plugins/html";
import * as postcssPlugin from "prettier/plugins/postcss";
import { XMLBuilder, XMLParser, XMLValidator } from "fast-xml-parser";
import { minify as minifyJs } from "terser";
import { minify as minifyCss } from "csso";

export type CodeLanguage = "json" | "javascript" | "html" | "css" | "xml";
export type CodeAction = "prettify" | "minify" | "validate";

const parserMap: Record<Exclude<CodeLanguage, "xml">, string> = {
  json: "json",
  javascript: "babel",
  html: "html",
  css: "css",
};

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
});

export async function transformCode(language: CodeLanguage, action: CodeAction, input: string) {
  try {
    if (language === "xml") {
      if (action === "validate") {
        const result = XMLValidator.validate(input);
        return { output: result === true ? "Valid XML" : result.err.msg };
      }

      if (action === "minify") {
        return { output: input.replace(/>\s+</g, "><").trim() };
      }

      return { output: xmlBuilder.build(xmlParser.parse(input)) };
    }

    if (action === "validate") {
      if (language === "json") {
        JSON.parse(input);
        return { output: "Valid JSON" };
      }

      await prettier.format(input, {
        parser: parserMap[language],
        plugins: [babelPlugin, estreePlugin, htmlPlugin, postcssPlugin],
      });
      return { output: `Valid ${language}` };
    }

    if (action === "minify") {
      if (language === "json") {
        return { output: JSON.stringify(JSON.parse(input)) };
      }

      if (language === "javascript") {
        const result = await minifyJs(input);
        return { output: result.code || "" };
      }

      if (language === "html") {
        return {
          output: input.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim(),
        };
      }

      if (language === "css") {
        return { output: minifyCss(input).css };
      }
    }

    return {
      output: await prettier.format(input, {
        parser: parserMap[language],
        plugins: [babelPlugin, estreePlugin, htmlPlugin, postcssPlugin],
      }),
    };
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Formatting failed.",
    };
  }
}
