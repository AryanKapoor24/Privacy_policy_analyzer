import axios from "axios";
import fs from "fs";
import pdf from "pdf-parse";

export const analyzePdf = async (req, res) => {
  try {
    const file = req.file;
    if(!file){
      return res.stattus(400).json({error:"No file provided"});
    }

   const databuffer= fs.readFileSync(file.path);

   const pdfData=await pdf(databuffer);
   const text=pdfData.text;

   const prompt = `
    Simplify the following document text and highlight important or risky clauses clearly:
    ${text}
    `;

    // Send the text to Mistral running locally
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "mistral",
      prompt,
    });

    const airesult= response.data.response || response.data;

    fs.unlinkSync(file.path);

    // Send simplified text back to frontend
    res.json({ simplifiedText: aiResult });



    res.json({ result: resultText });
  } catch (error) {
    console.error("Error analyzing policy:", error.message);
    res.status(500).json({ error: "Failed to analyze policy" });
  }
};
