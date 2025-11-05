import * as pdfParseModule from "pdf-parse";

async function parsePdfBuffer(buffer) {
  const pdfLib = pdfParseModule?.default ?? pdfParseModule;

  // Try calling as a function
  if (typeof pdfLib === "function") {
    try {
      return await pdfLib(buffer);
    } catch (err) {
      // fall through to try constructor/instance API
      console.warn("pdf-parse function call failed, trying constructor/instance API:", err.message);
    }
  }

  // Try constructor / instance parse()
  try {
    const instance = new pdfLib(buffer);
    if (typeof instance.parse === "function") {
      return await instance.parse();
    }
    if (instance && typeof instance.then === "function") {
      return await instance;
    }
  } catch (err) {
    // rethrow for outer handler to capture details
    throw err;
  }

  // last attempt
  return await pdfLib(buffer);
}

export const analyzePDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const data = await parsePdfBuffer(req.file.buffer);
    const text = (data?.text || "").trim();
    const pages = data?.numpages ?? data?.numPages ?? null;
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;

    return res.json({
      pages,
      wordCount,
      preview: text.slice(0, 2000),
      textLength: text.length,
    });
  } catch (err) {
    // log full error for debugging
    console.error("analyzePDF error:", err && err.stack ? err.stack : err);
    return res.status(500).json({ error: "Failed to process document", details: err?.message || String(err) });
  }
};