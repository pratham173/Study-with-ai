import { PDFParse } from "pdf-parse";

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = new PDFParse({ data: buffer });
    const result = await pdfParse.getText();
    return result.text.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF file");
  }
}
