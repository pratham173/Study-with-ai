import { PDFParse } from "pdf-parse";

export async function parsePDF(buffer: Buffer): Promise<string> {
  const pdfParse = new PDFParse({ data: buffer });
  try {
    const result = await pdfParse.getText();
    return result.text.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to parse PDF file");
  } finally {
    await pdfParse.destroy();
  }
}
