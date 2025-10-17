import fs from "fs";
import { PDFParse } from "pdf-parse";
import { execSync } from "child_process";

export const analyzePDF= async(req,res)=>{
    try{
        const filebuffer=req.file.buffer;
        const data= await PDFParse(filebuffer);
        const text=data.text;

        const prompt = `
        Simplify the following legal or policy text and highlight risk points:
        ${text}
        `;

        const command = `ollama run mistral "${prompt.replace(/"/g, '\\"')}"`;
        const result = execSync(command, { encoding: "utf-8" });
        res.json({ simplifiedText: result });



    }catch(error) {
        console.error("❌ Error analyzing PDF:", error);
        res.status(500).json({ error: "Failed to process document" });

    }
}