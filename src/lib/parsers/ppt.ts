export async function parsePPT(buffer: Buffer): Promise<string> {
  try {
    const text = buffer.toString("utf-8");
    const cleanedText = text.replace(/[^\x20-\x7E\n]/g, " ");
    const normalized = cleanedText.replace(/\s+/g, " ").trim();
    
    if (!normalized || normalized.length < 10) {
      throw new Error("Unable to extract meaningful text from PowerPoint file");
    }
    
    return normalized;
  } catch (error) {
    console.error("Error parsing PPT:", error);
    throw new Error("PowerPoint text extraction is limited. Please convert to PDF for better results.");
  }
}
