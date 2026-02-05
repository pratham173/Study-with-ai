export async function parseTXT(buffer: Buffer): Promise<string> {
  try {
    return buffer.toString("utf-8").trim();
  } catch (error) {
    console.error("Error parsing TXT:", error);
    throw new Error("Failed to parse TXT file");
  }
}
