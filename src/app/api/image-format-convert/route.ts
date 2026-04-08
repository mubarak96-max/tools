import { NextRequest, NextResponse } from "next/server";

import { IMAGE_FORMAT_CONVERSIONS, type ImageFormatConverterKind } from "@/lib/tools/image-format-conversion";
import { convertImageBuffer } from "@/lib/tools/image-magick";
import { logServerError } from "@/lib/monitoring/logger";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const kind = formData.get("kind");
    const file = formData.get("file");

    if (typeof kind !== "string" || !(kind in IMAGE_FORMAT_CONVERSIONS)) {
      return NextResponse.json({ error: "Unsupported conversion type." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "An image file is required." }, { status: 400 });
    }

    const conversion = IMAGE_FORMAT_CONVERSIONS[kind as ImageFormatConverterKind];
    const output = await convertImageBuffer(new Uint8Array(await file.arrayBuffer()), conversion.source, conversion.target);
    const filename = file.name.replace(/\.[^.]+$/u, "");

    return new NextResponse(Buffer.from(output), {
      headers: {
        "Content-Type": conversion.mimeType,
        "Content-Disposition": `attachment; filename="${filename}.${conversion.extension}"`,
      },
    });
  } catch (error) {
    logServerError("image_format_convert_failed", error);
    return NextResponse.json({ error: "Unable to convert that image right now." }, { status: 500 });
  }
}
