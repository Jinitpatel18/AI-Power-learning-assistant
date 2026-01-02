import Flashcard from "../models/Flashcard.js";
import mongoose from "mongoose";

//@desc get all flashcards for a document
//@@routes get /api/flashcards/:documentId
//@access private
export const getFlashcards = async (req, res, next) => {
    try {
        // Extract documentId and ensure it's a string
        let { documentId } = req.params;

        // If documentId is an object, try to extract the string value
        if (typeof documentId === 'object' && documentId !== null) {
            // If it has an _id property, use that
            if (documentId._id) {
                documentId = documentId._id.toString();
            } else if (documentId.id) {
                documentId = documentId.id.toString();
            } else {
                // Try to stringify and check if it's a valid ObjectId
                documentId = String(documentId);
            }
        } else {
            documentId = String(documentId);
        }

        // Validate that documentId is a valid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(documentId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid documentId format",
                statuscode: 400
            });
        }

        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: documentId
        })
            .populate('documentId', 'title fileName')
            .sort({ createAt: -1 })

        res.status(200).json({
            success: true,
            data: flashcards,
            count: flashcards.length
        })
    } catch (error) {
        next(error)
    }
}

//@desc get all flashcard sets for a user
//@route get /api/flashcards
//@access private
// export const getAllFlashcardSets = async (req, res, next) => {
//     try {
//         const flashcardSets = await Flashcard.find({ userId: req.user._id })
//             .populate('documentId', 'title')
//             .sort({ createAt: -1 })

//         res.status(200).json({
//             success: true,
//             count: flashcardSets.length,
//             data: flashcardSets
//         })
//     } catch (error) {
//         next(error);
//     }
// }
export const getAllFlashcardSets = async (req, res, next) => {
    try {
        const flashcardSets = await Flashcard.find({
            userId: req.user._id,
            documentId: { $ne: null }   // ✅ FILTER NULLS
        })
            .populate('documentId', 'title')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets
        })
    } catch (error) {
        next(error)
    }
}

//@desc mark flashcard as reviewed
//@route post /api/flashcard/:cardId/review
//@access private
export const reviewFlashcard = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        })

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: "Flashcard set or card not found",
                statuscode: 404
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)

        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                error: "Card not found in set",
                statuscode: 404
            })
        }

        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.cards[cardIndex].reviewCount += 1;

        await flashcardSet.save()

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: "Flashcard reviewed successfully."
        })
    } catch (error) {
        next(error)
    }
}

//@desc toggle star/favorite on flashcard
//route api/flashcards/cardId/star
//@access private
export const toggleStarFlashcard = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        })

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: "Flashcard set or card not found",
                statuscode: 404
            })
        }

        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId)

        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                error: "Card not found in set",
                statuscode: 404
            })
        }

        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred

        await flashcardSet.save()

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? "starred" : "unStarred"}`
        })
    } catch (error) {
        next(error)
    }
}

//@desc delete flashcard set
//@route delete /api/flashcards/:id
//@access private
export const deleteFlashcardSets = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                error: "flashcard ste not found",
                statuscode: 404
            })
        }

        await flashcardSet.deleteOne()

        res.status(200).json({
            success: true,
            message: "Flashcard set delete successfully"
        })
    } catch (error) {
        next(error)
    }
}