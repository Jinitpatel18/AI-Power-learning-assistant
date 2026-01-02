// import Document from "../models/Document.js";
// import Flashcard from "../models/Flashcard.js";
// import Quiz from "../models/Quiz.js";
// import ChatHistory from '../models/ChatHistory.js'
// import * as geminiService from '../utils/geminiService.js'
// import { findRelevantChunks } from "../utils/textChunker.js";

// //@desc generate flashcards from document
// //@route post /api/ai/generate-flashcards
// //@access private
// export const generateFlashcards = async(req, res, next) => {
//     try {
//         const { documentId, count = 10 } = req.body;
//         if(!documentId){
//             return res.status(400).json({
//                 success:false,
//                 error:"Please provide documentId",
//                 statuscode:400
//             })
//         }

//         const document = await Document.findOne({
//             _id:documentId,
//             userId:req.user._id,
//             status:'ready'
//         })
//         if(!document){
//             return res.status(404).json({
//                 success:false,
//                 error:'Document not found or not ready',
//                 statuscode:404
//             })
//         }

//         //Generate flashcards using Gemini
//         const cards = await geminiService.generateFlashcards(
//             document.extractedText,
//             parseInt(count)
//         )

//         //save to database
//         const flashcardSet = await Flashcard.create({
//             userId:req.user._id,
//             documentId:document._id,
//             cards: cards.map(card => ({
//                 question: card.question,
//                 answer: card.answer,
//                 difficulty: card.difficulty,
//                 reviewCount: 0,
//                 inStarred: false
//             }))
//         })

//         return res.status(200).json({
//             success: true,
//             data: flashcardSet,
//             message:"Flashcards generate successfully."
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// //@desc generate quiz from document
// //@route post /api/ai/generate-quiz
// //@access private
// export const generateQuiz = async(req, res, next) => {
//     try {
//         const { documentId, numQuestions = 5, title } = req.body || {};

//         if(!documentId){
//             return res.status(400).json({
//                 success:false,
//                 error:'Please provide documentId.',
//                 statuscode:400
//             })
//         }

//         const document = await Document.findOne({
//             userId: req.user._id,
//             _id:documentId,
//             status:'ready'
//         })

//         if(!document) {
//             return res.status(404).json({
//                 success: false,
//                 error:'Document not found or not ready',
//                 statuscode:404
//             })
//         }
//         //generate quiz using Gemini
//         const questions = await geminiService.generateQuiz(
//             document.extractedText,
//             parseInt(numQuestions)
//         );
//         // save to db
//         const quiz = await Quiz.create({
//             userId:req.user._id,
//             documentId:document._id,
//             title: title || `${document.title} - Quiz`,
//             questions: questions,
//             totalQuestions: questions.length,
//             userAnswers: [],
//             score:0
//         })
//         res.status(201).json({
//             success: true,
//             data: quiz,
//             message:'Quiz generate successfully.'
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// //@desc generate document summary
// //@Route post /api/ai/generate-summary
// //@access private
// export const generateSummary = async(req, res, next) => {
//     try {
//         const { documentId } = req.body;

//         if(!documentId) {
//             return res.status(400).json({
//                 success:false,
//                 error:"Please provide documentId",
//                 statuscode:400
//             })
//         }

//         const document = await Document.findOne({
//             _id:documentId,
//             userId:req.user._id,
//             status:"ready"
//         })

//         if(!document) {
//             return res.status(404).json({
//                 success:false,
//                 error:"Document not found or not ready",
//                 statuscode:404
//             })
//         }

//         const summary = await geminiService.generateSummary(document.extractedText);

//         res.status(200).json({
//             success: true,
//             data:{
//                 documentId: document._id,
//                 title: document.title,
//                 summary
//             },
//             message:"Summary generate successfully"
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// //@desc chat with document
// //@route post /api/ai/chat
// //@access private
// export const chat = async(req, res, next) => {
//     try {
//         const { documentId, question } = req.body;

//         if(!documentId || !question) {
//             return res.status(400).json({
//                 success:false,
//                 error:'Please provide documentId and question.',
//                 statuscode:400
//             })
//         }

//         const document = await Document.findOne({
//             _id: documentId,
//             userId:req.user._id,
//             status: "ready"
//         })

//         if(!document) {
//             return res.status(404).json({
//                 success:false,
//                 error:"Document not found or not ready",
//                 statuscode:404
//             })
//         }

//         const relevantChunks = findRelevantChunks(document.chunks, question, 3)
//         const chunkIndices = relevantChunks.map(c => c.chunkIndex);

//         let chatHistory = await ChatHistory.findOne({
//             userId: req.user._id,
//             documentId: document._id
//         })

//         if(!chatHistory) {
//             chatHistory = await ChatHistory.create({
//                 userId: req.user._id,
//                 documentId: document._id,
//                 message: []
//             })
//         }

//         //generate response using gemini
//         const answer = await geminiService.chatWithContext(question, relevantChunks );

//         //save conversation
//         chatHistory.message.push({
//             role:'user',
//             content: question,
//             timestamp: new Date(),
//             relevantChunks: []
//         },{
//             role:'assistant',
//             content:answer,
//             timestamp: new Date(),
//             relevantChunks: chunkIndices
//         })

//         await chatHistory.save();

//         res.status(200).json({
//             success:true,
//             data: {
//                 question,
//                 answer,
//                 relevantChunks: chunkIndices,
//                 chatHistoryId: chatHistory._id
//             },
//             message:'Response generate successfully.'
//         })
//     } catch (error) {
//         next(error)
//     }
// }

// //@desc Explain concept from document
// //@route post /api/ai/explain-concept
// //@access private
// export const explainConcept = async(req, res, next) => {
//     try {

//     } catch (error) {
//         next(error)
//     }
// }

// //@desc get chat history for a document
// //@route get /api/ai/chat-history/:documentId
// //@access private
// export const getChatHistory = async(req, res, next) => {
//     try {

//     } catch (error) {
//         next(error)
//     }
// }
import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from '../models/ChatHistory.js'
import * as geminiService from '../utils/geminiService.js'
import { findRelevantChunks } from "../utils/textChunker.js";

//@desc generate flashcards from document
//@route post /api/ai/generate-flashcards
//@access private
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body;
        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentId",
                statuscode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        })
        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statuscode: 404
            })
        }

        //Generate flashcards using Gemini
        const cards = await geminiService.generateFlashcards(
            document.extractedText,
            parseInt(count)
        )

        //save to database
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                inStarred: false
            }))
        })

        return res.status(200).json({
            success: true,
            data: flashcardSet,
            message: "Flashcards generate successfully."
        })
    } catch (error) {
        next(error)
    }
}

//@desc generate quiz from document
//@route post /api/ai/generate-quiz
//@access private
// export const generateQuiz = async (req, res, next) => {
//     try {
//         const { documentId, numQuestions = 5, title } = req.body || {};

//         if (!documentId) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Please provide documentId.',
//                 statuscode: 400
//             })
//         }

//         const document = await Document.findOne({
//             userId: req.user._id,
//             _id: documentId,
//             status: 'ready'
//         })

//         if (!document) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Document not found or not ready',
//                 statuscode: 404
//             })
//         }
//         //generate quiz using Gemini
//         const questions = await geminiService.generateQuiz(
//             document.extractedText,
//             parseInt(numQuestions)
//         );
//         // save to db
//         const quiz = await Quiz.create({
//             userId: req.user._id,
//             documentId: document._id,
//             title: title || `${document.title} - Quiz`,
//             questions: questions,
//             totalQuestions: questions.length,
//             userAnswers: [],
//             score: 0
//         })
//         res.status(201).json({
//             success: true,
//             data: quiz,
//             message: 'Quiz generate successfully.'
//         })
//     } catch (error) {
//         next(error)
//     }
// }
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title } = req.body || {};

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId.',
                statuscode: 400
            });
        }

        const document = await Document.findOne({
            userId: req.user._id,
            _id: documentId,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statuscode: 404
            });
        }

        // const rawQuestions = await geminiService.generateQuiz(
        //     document.extractedText,
        //     parseInt(numQuestions)
        // );

        const rawQuestions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        if (!Array.isArray(rawQuestions) || rawQuestions.length < numQuestions) {
            return res.status(500).json({
                success: false,
                error: `AI failed to generate ${numQuestions} questions. Try fewer questions.`
            });
        }

        console.log("Requested:", numQuestions);
        console.log("Generated:", rawQuestions.length);


        const questions = rawQuestions.map((q, index) => {
            let correctIndex = -1;

            // 1️⃣ Q3 / Q2 format
            if (typeof q.correctAnswer === 'string' && /^Q\d+$/.test(q.correctAnswer)) {
                correctIndex = parseInt(q.correctAnswer.substring(1), 10) - 1;
            }

            // 2️⃣ "3" format
            else if (typeof q.correctAnswer === 'string' && /^[0-9]+$/.test(q.correctAnswer)) {
                correctIndex = parseInt(q.correctAnswer, 10) - 1;
            }

            // 3️⃣ Letter format (A/B/C/D)
            else if (typeof q.correctAnswer === 'string' && /^[A-D]$/i.test(q.correctAnswer)) {
                correctIndex = q.correctAnswer.toUpperCase().charCodeAt(0) - 65;
            }

            // 4️⃣ Text match ("Paris")
            else if (typeof q.correctAnswer === 'string') {
                correctIndex = q.options.findIndex(
                    opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
                );
            }

            // 🚨 FINAL HARD SAFETY (NO NaN ALLOWED)
            if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= q.options.length) {
                console.warn(`⚠️ Invalid correctAnswer from AI at Q${index + 1}, defaulting to 0`);
                correctIndex = 0;
            }

            return {
                question: q.question,
                options: q.options,
                correctAnswer: correctIndex, // ✅ ALWAYS 0–3
                explanation: q.explanation || '',
                difficulty: q.difficulty || 'medium'
            };
        });

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully.'
        });

    } catch (error) {
        console.error('❌ Generate Quiz Error:', error);
        next(error);
    }
};




//@desc generate document summary
//@Route post /api/ai/generate-summary
//@access private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: "Please provide documentId",
                statuscode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        })

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statuscode: 404
            })
        }

        const summary = await geminiService.generateSummary(document.extractedText);

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: "Summary generate successfully"
        })
    } catch (error) {
        next(error)
    }
}

//@desc chat with document
//@route post /api/ai/chat
//@access private
// export const chat = async(req, res, next) => {
//     try {
//         const { documentId, question } = req.body;

//         if(!documentId || !question) {
//             return res.status(400).json({
//                 success:false,
//                 error:'Please provide documentId and question.',
//                 statuscode:400
//             })
//         }

//         const document = await Document.findOne({
//             _id: documentId,
//             userId:req.user._id,
//             status: "ready"
//         }).lean();  // Add .lean() to get plain JavaScript objects instead of Mongoose documents

//         if(!document) {
//             return res.status(404).json({
//                 success:false,
//                 error:"Document not found or not ready",
//                 statuscode:404
//             })
//         }

//         // Find relevant chunks (returns array of chunk objects with scores)
//         const relevantChunksRaw = findRelevantChunks(document.chunks, question, 3);

//         // Clean up the chunk objects
//         const relevantChunks = relevantChunksRaw.map(chunk => ({
//             content: chunk.content || chunk._doc?.content,
//             chunkIndex: chunk.chunkIndex ?? chunk._doc?.chunkIndex,
//             pageNumber: chunk.pageNumber ?? chunk._doc?.pageNumber,
//             score: chunk.score
//         }));

//         // Extract just the indices for storage
//         const chunkIndices = relevantChunks.map(c => c.chunkIndex);

//         let chatHistory = await ChatHistory.findOne({
//             userId: req.user._id,
//             documentId: document._id
//         })

//         if(!chatHistory) {
//             chatHistory = await ChatHistory.create({
//                 userId: req.user._id,
//                 documentId: document._id,
//                 messages: []
//             })
//         }

//         //generate response using gemini
//         const answer = await geminiService.chatWithContext(question, relevantChunks);

//         //save conversation
//         chatHistory.messages.push({
//             role:'user',
//             content: question,
//             timestamp: new Date(),
//             relevantChunks: chunkIndices  // Save indices for user message
//         },{
//             role:'assistant',
//             content:answer,
//             timestamp: new Date(),
//             relevantChunks: chunkIndices  // Save indices for assistant response
//         })

//         await chatHistory.save();

//         res.status(200).json({
//             success:true,
//             data: {
//                 question,
//                 answer,
//                 relevantChunks: relevantChunks,  // Return full chunk objects, not just indices
//                 chatHistoryId: chatHistory._id
//             },
//             message:'Response generate successfully.'
//         })
//     } catch (error) {
//         next(error)
//     }
// }
export const chat = async (req, res, next) => {
    try {
        let { documentId, question } = req.body;

        // ✅ SAFETY: normalize question
        if (typeof question === 'object') {
            question = question?.content;
        }

        if (!documentId || typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId and a valid question.',
                statuscode: 400
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: "ready"
        }).lean();

        if (!document) {
            return res.status(404).json({
                success: false,
                error: "Document not found or not ready",
                statuscode: 404
            });
        }

        const relevantChunksRaw = findRelevantChunks(
            document.chunks,
            question,
            3
        );

        const relevantChunks = relevantChunksRaw.map(chunk => ({
            content: chunk.content || chunk._doc?.content,
            chunkIndex: chunk.chunkIndex ?? chunk._doc?.chunkIndex,
            pageNumber: chunk.pageNumber ?? chunk._doc?.pageNumber,
            score: chunk.score
        }));

        const chunkIndices = relevantChunks.map(c => c.chunkIndex);

        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        });

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            });
        }

        const answer = await geminiService.chatWithContext(
            question,
            relevantChunks
        );

        chatHistory.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date(),
                relevantChunks: chunkIndices
            },
            {
                role: 'assistant',
                content: answer,
                timestamp: new Date(),
                relevantChunks: chunkIndices
            }
        );

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks,
                chatHistoryId: chatHistory._id
            },
            message: 'Response generated successfully.'
        });

    } catch (error) {
        next(error);
    }
};

//@desc Explain concept from document
//@route post /api/ai/explain-concept
//@access private
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: 'Please Provide documentId and concept.',
                statuscode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        }).lean();  // ✅ Add .lean() for plain objects

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or ready',
                statuscode: 404
            })
        }

        const relevantChunksRaw = findRelevantChunks(document.chunks, concept, 3);

        // ✅ Clean up chunks properly
        const relevantChunks = relevantChunksRaw.map(chunk => ({
            content: chunk.content || chunk._doc?.content,
            chunkIndex: chunk.chunkIndex ?? chunk._doc?.chunkIndex,
            pageNumber: chunk.pageNumber ?? chunk._doc?.pageNumber,
            score: chunk.score
        }));

        const context = relevantChunks.map(c => c.content).join('\n\n');

        //Generate explanation using gemini
        const explanation = await geminiService.explainConcept(concept, context);

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunks: relevantChunks  // ✅ Return full chunk objects
            },
            message: 'Explanation generated successfully.'
        })
    } catch (error) {
        next(error)
    }
}

//@desc get chat history for a document
//@route get /api/ai/chat-history/:documentId
//@access private
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;  // ✅ Changed from req.body to req.params (it's a GET route)

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId',
                statuscode: 400
            })
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: documentId
        }).select('messages')

        if (!chatHistory) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No chat history found for this document'
            })
        }

        res.status(200).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully.'
        })
    } catch (error) {
        next(error)
    }
}