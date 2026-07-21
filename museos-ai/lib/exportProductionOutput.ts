"use client";

import {
  GeneratedProductionOutput,
  PitchDeckOutputData,
  StoryboardOutputData,
} from "@/types/creative";

export type ProductionExportFormat =
  | "markdown"
  | "json"
  | "pdf"
  | "powerpoint";

export async function exportProductionOutput(
  output: GeneratedProductionOutput,
  format: ProductionExportFormat
): Promise<void> {
  switch (format) {
    case "markdown":
      exportMarkdown(output);
      return;

    case "json":
      exportJson(output);
      return;

    case "pdf":
      await exportPdf(output);
      return;

    case "powerpoint":
      await exportPowerPoint(output);
      return;

    default:
      throw new Error(
        "Unsupported production export format."
      );
  }
}

function exportMarkdown(
  output: GeneratedProductionOutput
): void {
  const markdown = createMarkdownDocument(output);

  downloadTextFile(
    markdown,
    `${createFileName(output)}.md`,
    "text/markdown;charset=utf-8"
  );
}

function exportJson(
  output: GeneratedProductionOutput
): void {
  const payload = {
    exportedBy: "MuseOS",
    exportedAt: new Date().toISOString(),
    provenance: {
      projectTitle: output.projectTitle,
      branchName:
        output.branchName || "Main",
      versionId: output.versionId,
      versionLabel:
        output.versionLabel ||
        "Current version",
      generatedAt: new Date(
        output.generatedAt
      ).toISOString(),
      provider: output.provider,
    },
    output,
  };

  downloadTextFile(
    JSON.stringify(payload, null, 2),
    `${createFileName(output)}.json`,
    "application/json;charset=utf-8"
  );
}

async function exportPdf(
  output: GeneratedProductionOutput
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const document = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth =
    document.internal.pageSize.getWidth();

  const pageHeight =
    document.internal.pageSize.getHeight();

  const margin = 18;
  const contentWidth =
    pageWidth - margin * 2;

  let y = margin;

  const addPageIfNeeded = (
    requiredHeight: number
  ) => {
    if (
      y + requiredHeight >
      pageHeight - margin
    ) {
      addFooter(
        document,
        output,
        pageWidth,
        pageHeight
      );

      document.addPage();
      y = margin;
    }
  };

  document.setFillColor(
    20,
    18,
    30
  );

  document.rect(
    0,
    0,
    pageWidth,
    48,
    "F"
  );

  document.setTextColor(
    255,
    255,
    255
  );

  document.setFont(
    "helvetica",
    "bold"
  );

  document.setFontSize(9);

  document.text(
    "MUSEOS PRODUCTION OUTPUT",
    margin,
    15
  );

  document.setFontSize(22);

  const titleLines =
    document.splitTextToSize(
      output.title,
      contentWidth
    );

  document.text(
    titleLines,
    margin,
    26
  );

  y = 58;

  addProvenanceBlock(
    document,
    output,
    margin,
    y,
    contentWidth
  );

  y += 30;

  if (
    output.structuredData?.format ===
    "pitch-deck"
  ) {
    y = renderPitchDeckPdf(
      document,
      output.structuredData,
      y,
      margin,
      contentWidth,
      pageHeight,
      addPageIfNeeded
    );
  } else if (
    output.structuredData?.format ===
    "storyboard"
  ) {
    y = renderStoryboardPdf(
      document,
      output.structuredData,
      y,
      margin,
      contentWidth,
      pageHeight,
      addPageIfNeeded
    );
  } else {
    renderTextOutputPdf(
      document,
      output.content,
      y,
      margin,
      contentWidth,
      pageHeight,
      addPageIfNeeded
    );
  }

  addFooter(
    document,
    output,
    pageWidth,
    pageHeight
  );

  document.save(
    `${createFileName(output)}.pdf`
  );
}

async function exportPowerPoint(
  output: GeneratedProductionOutput
): Promise<void> {
  if (
    output.structuredData?.format !==
    "pitch-deck"
  ) {
    throw new Error(
      "PowerPoint export is available only for pitch-deck outputs."
    );
  }

  const module = await import(
    "pptxgenjs"
  );

  const PptxGenJS =
    module.default;

  const presentation =
    new PptxGenJS();

  presentation.layout = "LAYOUT_WIDE";
  presentation.author = "MuseOS";
  presentation.company = "MuseOS";
  presentation.subject =
    output.projectTitle;
  presentation.title =
    output.structuredData.deckTitle;

  presentation.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
  };

  const deck =
    output.structuredData;

  addPowerPointCover(
    presentation,
    deck,
    output
  );

  deck.slides.forEach((deckSlide) => {
    const slide =
      presentation.addSlide();

    slide.background = {
      color: "11101A",
    };

    slide.addShape(
      presentation.ShapeType.rect,
      {
        x: 0,
        y: 0,
        w: 0.12,
        h: 7.5,
        fill: {
          color: "8B5CF6",
        },
        line: {
          color: "8B5CF6",
        },
      }
    );

    slide.addText(
      deck.deckTitle.toUpperCase(),
      {
        x: 0.65,
        y: 0.42,
        w: 9,
        h: 0.28,
        fontFace: "Aptos",
        fontSize: 8,
        bold: true,
        color: "A78BFA",
        charSpacing: 1.8,
        margin: 0,
      }
    );

    slide.addText(
      String(
        deckSlide.slideNumber
      ).padStart(2, "0"),
      {
        x: 11.8,
        y: 0.35,
        w: 0.8,
        h: 0.4,
        fontFace: "Aptos",
        fontSize: 12,
        color: "6B6778",
        align: "right",
        margin: 0,
      }
    );

    slide.addText(
      deckSlide.title.toUpperCase(),
      {
        x: 0.65,
        y: 1.05,
        w: 7.8,
        h: 0.35,
        fontFace: "Aptos",
        fontSize: 9,
        bold: true,
        color: "8F8A9D",
        charSpacing: 1.4,
        margin: 0,
      }
    );

    slide.addText(
      deckSlide.headline,
      {
        x: 0.65,
        y: 1.55,
        w: 7.8,
        h: 1.65,
        fontFace:
          "Aptos Display",
        fontSize: 27,
        bold: true,
        color: "FFFFFF",
        breakLine: false,
        valign: "middle",
        margin: 0,
        fit: "shrink",
      }
    );

    const bulletRuns =
      deckSlide.supportingPoints.map(
        (point) => ({
          text: point,
          options: {
            bullet: {
              indent: 14,
            },
            breakLine: true,
            color: "C8C4D0",
          },
        })
      );

    slide.addText(
      bulletRuns,
      {
        x: 0.72,
        y: 3.55,
        w: 7.3,
        h: 2.15,
        fontFace: "Aptos",
        fontSize: 13,
        color: "C8C4D0",
        breakLine: true,
        paraSpaceAfter: 10,
        margin: 0,
        valign: "top",
        fit: "shrink",
      }
    );

    slide.addShape(
      presentation.ShapeType.roundRect,
      {
        x: 8.7,
        y: 1.3,
        w: 3.85,
        h: 4.7,
        rectRadius: 0.08,
        fill: {
          color: "1B1925",
          transparency: 4,
        },
        line: {
          color: "302D3A",
          transparency: 20,
        },
      }
    );

    slide.addText(
      "VISUAL DIRECTION",
      {
        x: 9.05,
        y: 1.72,
        w: 3.05,
        h: 0.25,
        fontFace: "Aptos",
        fontSize: 8,
        bold: true,
        color: "A78BFA",
        charSpacing: 1.4,
        margin: 0,
      }
    );

    slide.addText(
      deckSlide.visualDirection,
      {
        x: 9.05,
        y: 2.15,
        w: 3.05,
        h: 2.7,
        fontFace: "Aptos",
        fontSize: 12,
        color: "BDB8C8",
        valign: "middle",
        margin: 0,
        fit: "shrink",
      }
    );

    slide.addText(
      `Generated from ${
        output.branchName || "Main"
      } · ${
        output.versionLabel ||
        "Current version"
      }`,
      {
        x: 0.65,
        y: 7.05,
        w: 8.5,
        h: 0.18,
        fontFace: "Aptos",
        fontSize: 7,
        color: "625E6D",
        margin: 0,
      }
    );

    slide.addNotes(
      deckSlide.speakerNotes
    );
  });

  await presentation.writeFile({
    fileName: `${createFileName(
      output
    )}.pptx`,
    compression: true,
  });
}

function addPowerPointCover(
  presentation: InstanceType<
    typeof import("pptxgenjs")["default"]
  >,
  deck: PitchDeckOutputData,
  output: GeneratedProductionOutput
): void {
  const slide =
    presentation.addSlide();

  slide.background = {
    color: "0D0C14",
  };

  slide.addShape(
    presentation.ShapeType.ellipse,
    {
      x: 8.8,
      y: -1.1,
      w: 5.8,
      h: 5.8,
      fill: {
        color: "6D28D9",
        transparency: 42,
      },
      line: {
        color: "6D28D9",
        transparency: 100,
      },
    }
  );

  slide.addText(
    "MUSEOS",
    {
      x: 0.75,
      y: 0.65,
      w: 2,
      h: 0.3,
      fontFace: "Aptos",
      fontSize: 10,
      bold: true,
      color: "A78BFA",
      charSpacing: 2.2,
      margin: 0,
    }
  );

  slide.addText(
    deck.deckTitle,
    {
      x: 0.75,
      y: 1.8,
      w: 9.3,
      h: 1.55,
      fontFace:
        "Aptos Display",
      fontSize: 36,
      bold: true,
      color: "FFFFFF",
      margin: 0,
      fit: "shrink",
    }
  );

  slide.addText(
    deck.deckSubtitle,
    {
      x: 0.75,
      y: 3.55,
      w: 7.7,
      h: 1.1,
      fontFace: "Aptos",
      fontSize: 17,
      color: "B8B3C3",
      margin: 0,
      fit: "shrink",
    }
  );

  slide.addText(
    [
      {
        text: output.branchName ||
          "Main",
        options: {
          bold: true,
        },
      },
      {
        text: `  ·  ${
          output.versionLabel ||
          "Current version"
        }`,
      },
    ],
    {
      x: 0.75,
      y: 6.55,
      w: 6,
      h: 0.3,
      fontFace: "Aptos",
      fontSize: 10,
      color: "777180",
      margin: 0,
    }
  );
}

function renderPitchDeckPdf(
  document: import("jspdf").jsPDF,
  deck: PitchDeckOutputData,
  startY: number,
  margin: number,
  contentWidth: number,
  pageHeight: number,
  addPageIfNeeded: (
    height: number
  ) => void
): number {
  let y = startY;

  deck.slides.forEach((slide) => {
    addPageIfNeeded(58);

    document.setFillColor(
      244,
      242,
      248
    );

    document.roundedRect(
      margin,
      y,
      contentWidth,
      52,
      3,
      3,
      "F"
    );

    document.setTextColor(
      112,
      82,
      168
    );

    document.setFont(
      "helvetica",
      "bold"
    );

    document.setFontSize(8);

    document.text(
      `SLIDE ${slide.slideNumber}`,
      margin + 5,
      y + 8
    );

    document.setTextColor(
      30,
      28,
      37
    );

    document.setFontSize(14);

    document.text(
      slide.title,
      margin + 5,
      y + 16
    );

    document.setFont(
      "helvetica",
      "normal"
    );

    document.setFontSize(11);

    const headlineLines =
      document.splitTextToSize(
        slide.headline,
        contentWidth - 10
      );

    document.text(
      headlineLines,
      margin + 5,
      y + 24
    );

    const pointText =
      slide.supportingPoints
        .map(
          (point) => `• ${point}`
        )
        .join("\n");

    document.setFontSize(9);

    const pointLines =
      document.splitTextToSize(
        pointText,
        contentWidth - 10
      );

    document.text(
      pointLines,
      margin + 5,
      y + 35
    );

    y += 59;
  });

  return y;
}

function renderStoryboardPdf(
  document: import("jspdf").jsPDF,
  storyboard: StoryboardOutputData,
  startY: number,
  margin: number,
  contentWidth: number,
  pageHeight: number,
  addPageIfNeeded: (
    height: number
  ) => void
): number {
  let y = startY;

  document.setFont(
    "helvetica",
    "bold"
  );

  document.setFontSize(13);

  document.setTextColor(
    35,
    32,
    43
  );

  const logline =
    document.splitTextToSize(
      storyboard.logline,
      contentWidth
    );

  document.text(
    logline,
    margin,
    y
  );

  y += logline.length * 6 + 8;

  storyboard.scenes.forEach(
    (scene) => {
      addPageIfNeeded(72);

      document.setFillColor(
        245,
        243,
        248
      );

      document.roundedRect(
        margin,
        y,
        contentWidth,
        66,
        3,
        3,
        "F"
      );

      document.setTextColor(
        113,
        78,
        166
      );

      document.setFont(
        "helvetica",
        "bold"
      );

      document.setFontSize(8);

      document.text(
        `SCENE ${scene.sceneNumber} · ${scene.shotType}`,
        margin + 5,
        y + 8
      );

      document.setTextColor(
        30,
        28,
        37
      );

      document.setFontSize(14);

      document.text(
        scene.title,
        margin + 5,
        y + 16
      );

      document.setFont(
        "helvetica",
        "normal"
      );

      document.setFontSize(8);

      document.text(
        `${scene.location} · ${scene.time}`,
        margin + 5,
        y + 23
      );

      document.setFontSize(9);

      const actionLines =
        document.splitTextToSize(
          scene.action,
          contentWidth - 10
        );

      document.text(
        actionLines,
        margin + 5,
        y + 32
      );

      const visualLines =
        document.splitTextToSize(
          `Visual: ${scene.visualComposition}`,
          contentWidth - 10
        );

      document.text(
        visualLines,
        margin + 5,
        y + 46
      );

      y += 73;
    }
  );

  return y;
}

function renderTextOutputPdf(
  document: import("jspdf").jsPDF,
  content: string,
  startY: number,
  margin: number,
  contentWidth: number,
  pageHeight: number,
  addPageIfNeeded: (
    height: number
  ) => void
): void {
  let y = startY;

  document.setFont(
    "helvetica",
    "normal"
  );

  document.setFontSize(10);

  document.setTextColor(
    40,
    38,
    47
  );

  const paragraphs =
    content.split(/\n{2,}/);

  paragraphs.forEach(
    (paragraph) => {
      const normalized =
        paragraph.trim();

      if (!normalized) return;

      const lines =
        document.splitTextToSize(
          normalized,
          contentWidth
        );

      const blockHeight =
        lines.length * 5 + 5;

      addPageIfNeeded(blockHeight);

      document.text(
        lines,
        margin,
        y
      );

      y += blockHeight;
    }
  );
}

function addProvenanceBlock(
  document: import("jspdf").jsPDF,
  output: GeneratedProductionOutput,
  x: number,
  y: number,
  width: number
): void {
  document.setFillColor(
    245,
    243,
    248
  );

  document.roundedRect(
    x,
    y,
    width,
    23,
    3,
    3,
    "F"
  );

  document.setFont(
    "helvetica",
    "normal"
  );

  document.setFontSize(8);

  document.setTextColor(
    85,
    81,
    94
  );

  document.text(
    [
      `Project: ${output.projectTitle}`,
      `Branch: ${
        output.branchName || "Main"
      }`,
      `Version: ${
        output.versionLabel ||
        "Current version"
      }`,
      `Generated with: ${
        output.provider === "watsonx"
          ? "IBM Granite"
          : "Fallback mode"
      }`,
    ],
    x + 5,
    y + 6
  );
}

function addFooter(
  document: import("jspdf").jsPDF,
  output: GeneratedProductionOutput,
  pageWidth: number,
  pageHeight: number
): void {
  document.setFontSize(7);

  document.setTextColor(
    130,
    126,
    139
  );

  document.text(
    `MuseOS · ${output.projectTitle}`,
    18,
    pageHeight - 9
  );

  document.text(
    String(
      document.getNumberOfPages()
    ),
    pageWidth - 18,
    pageHeight - 9,
    {
      align: "right",
    }
  );
}

function createMarkdownDocument(
  output: GeneratedProductionOutput
): string {
  return `# ${output.title}

**Project:** ${output.projectTitle}  
**Branch:** ${output.branchName || "Main"}  
**Version:** ${
    output.versionLabel ||
    "Current version"
  }  
**Provider:** ${
    output.provider === "watsonx"
      ? "IBM Granite · watsonx.ai"
      : "Fallback mode"
  }  
**Generated:** ${new Date(
    output.generatedAt
  ).toLocaleString()}

---

${output.content}
`;
}

function createFileName(
  output: GeneratedProductionOutput
): string {
  const title =
    output.title ||
    output.projectTitle ||
    "museos-output";

  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob(
    [content],
    {
      type: mimeType,
    }
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}