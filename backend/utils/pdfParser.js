// import fs from "fs/promises"
// import { PDFParse } from "pdf-parse"
// /**
//  * Extract text from PDF file
//  * @param {string} filePath - Path to PDF file
//  * @return {Promise<{text: string, numPages:number}>}
//  */

// export const extractTextFromPDF = async (filePath) => {
//     try {
//         const dataBuffer = fs.readFile(filePath);
//         const data = await new PDFParse(dataBuffer);

//         return {
//             text: data.text,
//             numPages: data.numPages,
//             info: data.info
//         };
//     } catch (error) {
//         console.error("PDF Parsing error:", error);
//         throw new Error("Failed to extract text from PDF");
//     }
// };
import fs from "fs";

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @return {Promise<{text: string, numPages: number, info: object}>}
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        // Dynamic import for CommonJS module
        const pdfParse = (await import("pdf-parse")).default;
        
        const dataBuffer = fs.readFileSync(filePath);
        
        // Parse PDF using pdf-parse
        const data = await pdfParse(dataBuffer);
        
        // Clean up the extracted text
        const cleanedText = data.text
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim();

        return {
            text: cleanedText,
            numPages: data.numpages,
            info: data.info || {}
        };
    } catch (error) {
        console.error("PDF Parsing error:", error);
        console.error("Error details:", error.message);
        throw new Error("Failed to extract text from PDF");
    }
};