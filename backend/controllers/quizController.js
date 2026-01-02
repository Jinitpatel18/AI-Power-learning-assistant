import Quiz from '../models/Quiz.js'
import mongoose from 'mongoose';

//@desc Get all quizzes for a document
//@route get /api/quizzes/:documentId
//@access private
export const getQuizzes = async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: new mongoose.Types.ObjectId(documentId)
        })
            .populate('documentId', 'title fileName')
            .sort({ createdAt: -1 });

        console.log('Found quizzes:', quizzes.length);

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
};

//@desc Get a single quiz by ID
//@Route GET /api/quizzes/quiz/:id
//@access private
export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statuscode: 404
            })
        }

        res.status(200).json({
            success: true,
            data: quiz
        })
    } catch (error) {
        next(error)
    }
}

//@desc submit quiz answers
//@route Post /api/quizzes/:id/submit
//@access private

// export const submitQuiz = async (req, res, next) => {
//     try {
//         const { answers } = req.body;

//         if (!Array.isArray(answers)) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Please provide answer array',
//                 statuscode: 400
//             })
//         }

//         const quiz = await Quiz.findOne({
//             _id: req.params.id,
//             userId: req.user._id
//         })

//         if (!quiz) {
//             return res.status(404).json({
//                 success: false,
//                 error: 'Quiz not found',
//                 statuscode: 404
//             })
//         }

//         if (quiz.completedAt) {
//             return res.status(400).json({
//                 success: false,
//                 error: 'Quiz already completed',
//                 statuscode: 400
//             })
//         }

//         let correctCount = 0;
//         const userAnswers = [];

//         // answers.forEach(answer => {
//         //     const { questionIndex, selectedAnswer } = answer;

//         //     if (questionIndex < quiz.questions.length) {
//         //         const question = quiz.questions[questionIndex];
//         //         // FIX: Convert both to numbers for comparison
//         //         const isCorrect = Number(selectedAnswer) === Number(question.correctAnswer)

//         //         if (isCorrect) correctCount++;

//         //         userAnswers.push({
//         //             questionIndex,
//         //             selectedAnswer: Number(selectedAnswer),  // Store as number
//         //             isCorrect,
//         //             answeredAt: new Date()
//         //         })
//         //     }
//         // })
//         answers.forEach(answer => {
//             const { questionIndex, selectedAnswer } = answer;

//             if (questionIndex < quiz.questions.length) {
//                 const question = quiz.questions[questionIndex];

//                 console.log('=== Question', questionIndex, '===');
//                 console.log('Selected:', selectedAnswer, '(type:', typeof selectedAnswer, ')');
//                 console.log('Correct:', question.correctAnswer, '(type:', typeof question.correctAnswer, ')');
//                 console.log('Options:', question.options);
//                 console.log('Number(selected):', Number(selectedAnswer));
//                 console.log('Number(correct):', Number(question.correctAnswer));

//                 const isCorrect = Number(selectedAnswer) === Number(question.correctAnswer)
//                 console.log('Is Correct:', isCorrect);
//                 console.log('========================');

//                 if (isCorrect) correctCount++;

//                 userAnswers.push({
//                     questionIndex,
//                     selectedAnswer: Number(selectedAnswer),
//                     isCorrect,
//                     answeredAt: new Date()
//                 })
//             }
//         })
//         const score = Math.round((correctCount / quiz.totalQuestions) * 100)

//         quiz.userAnswers = userAnswers
//         quiz.score = score;
//         quiz.completedAt = new Date();

//         await quiz.save();

//         res.status(200).json({
//             success: true,
//             data: {
//                 quizId: quiz._id,
//                 score,
//                 correctCount,
//                 totalQuestions: quiz.totalQuestions,
//                 percentage: score,
//                 userAnswers
//             },
//             message: 'Quiz submitted successfully.'
//         })
//     } catch (error) {
//         next(error)
//     }
// }
export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;

        // console.log('📝 SUBMIT QUIZ - Received answers:', JSON.stringify(answers, null, 2));

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide answer array',
                statuscode: 400
            })
        }

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statuscode: 404
            })
        }

        if (quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz already completed',
                statuscode: 400
            })
        }

        let correctCount = 0;
        const userAnswers = [];

        // console.log('📋 Total questions in quiz:', quiz.totalQuestions);

        answers.forEach((answer, idx) => {
            const { questionIndex, selectedAnswer } = answer;

            if (questionIndex < quiz.questions.length) {
                const question = quiz.questions[questionIndex];
                
                // console.log('\n======================');
                // console.log(`Question ${questionIndex + 1}:`, question.question);
                // console.log('Options:', question.options);
                // console.log('Selected Answer VALUE:', selectedAnswer, '| TYPE:', typeof selectedAnswer);
                // console.log('Correct Answer VALUE:', question.correctAnswer, '| TYPE:', typeof question.correctAnswer);
                // console.log('Number(selected):', Number(selectedAnswer));
                // console.log('Number(correct):', Number(question.correctAnswer));
                
                const isCorrect = Number(selectedAnswer) === Number(question.correctAnswer)
                
                // console.log('✅ Is Correct?:', isCorrect);
                // console.log('======================\n');

                if (isCorrect) correctCount++;

                userAnswers.push({
                    questionIndex,
                    selectedAnswer: Number(selectedAnswer),
                    isCorrect,
                    answeredAt: new Date()
                })
            }
        })

        const score = Math.round((correctCount / quiz.totalQuestions) * 100)

        // console.log('🎯 FINAL RESULTS:');
        // console.log('Correct Count:', correctCount);
        // console.log('Total Questions:', quiz.totalQuestions);
        // console.log('Score:', score);

        quiz.userAnswers = userAnswers
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            },
            message: 'Quiz submitted successfully.'
        })
    } catch (error) {
        console.error('❌ Submit Quiz Error:', error);
        next(error)
    }
}
// ```

// ## 🔍 Step 2: Submit a Quiz

// 1. Go to your app
// 2. Take a quiz
// 3. Submit answers
// 4. **Check your backend console/terminal** (not browser console!)

// You should see output like:
// ```
// 📝 SUBMIT QUIZ - Received answers: [...]
// 📋 Total questions in quiz: 5

// ======================
// Question 1: What is the capital of France?
// Options: ["London", "Berlin", "Paris", "Madrid"]
// Selected Answer VALUE: 2 | TYPE: number
// Correct Answer VALUE: Paris | TYPE: string
// Number(selected): 2
// Number(correct): NaN
// ✅ Is Correct?: false
// ======================

//@desc get quiz results
//@route get/api/quizzes.:id/result
//@access private
export const getQuizResults = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        }).populate('documentId', 'title')

        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statuscode: 404
            })
        }
        if (!quiz.completedAt) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not completed yet',
                statuscode: 400
            })
        }

        const detailedResults = quiz.questions.map((question, index) => {
            const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index)

            return {
                questionIndex: index,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
                selectedAnswer: userAnswer?.selectedAnswer || null,
                isCorrect: userAnswer?.isCorrect || false,
                explanation: question.explanation
            }
        })

        res.status(200).json({
            success: true,
            data: {
                quiz: {
                    id: quiz._id,
                    title: quiz.title,
                    document: quiz.documentId,
                    score: quiz.score,
                    totalQuestions: quiz.totalQuestions,
                    completedAt: quiz.completedAt
                },
                results: detailedResults
            }
        })
    } catch (error) {
        next(error)
    }
}

//@desc Delete quiz
//@route DELETE /api/quizzes/:id
//@access private
export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        })
        if (!quiz) {
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
                statuscode: 404
            })
        }
        await quiz.deleteOne();

        res.status(200).json({
            success: true,
            message: 'quiz delete successfully'
        })
    } catch (error) {
        next(error)
    }
}
