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
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @return {Promise<{text: string, numPages: number, info: object}>}
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        
        // Convert Buffer to Uint8Array (required by pdfjs-dist)
        const uint8Array = new Uint8Array(dataBuffer);
        
        // Load the PDF document
        const loadingTask = getDocument({
            data: uint8Array,
            verbosity: 0 // Suppress warnings
        });
        
        const pdfDocument = await loadingTask.promise;
        
        // Extract text from all pages
        let fullText = "";
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Join text items properly - sometimes they come as individual characters
            const pageText = textContent.items
                .map(item => item.str)
                .join(""); // Use empty string instead of space
            
            fullText += pageText + "\n\n";
        }

        // Clean up the extracted text
        const cleanedText = fullText
            .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
            .trim();

        return {
            text: cleanedText,
            numPages: pdfDocument.numPages,
            info: {}
        };
    } catch (error) {
        console.error("PDF Parsing error:", error);
        console.error("Error details:", error.message);
        throw new Error("Failed to extract text from PDF");
    }
};