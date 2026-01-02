import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import quizService from '../../service/quizService'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Trophy
} from 'lucide-react'

const QuizResultPage = () => {
    const { quizId } = useParams()

    const [results, setResults] = useState(null)
    const [loading, setLoading] = useState(true)

    // ---------------- FETCH RESULTS ----------------
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await quizService.getQuizResults(quizId)
                setResults(data)
            } catch (error) {
                console.error(error)
                toast.error(error?.error || 'Failed to fetch quiz results')
            } finally {
                setLoading(false)
            }
        }
        fetchResults()
    }, [quizId])

    // ---------------- LOADING ----------------
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner />
            </div>
        )
    }

    // ---------------- SAFETY CHECK ----------------
    if (!results?.data?.quiz || !Array.isArray(results?.data?.results)) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-600 text-lg">Quiz results not found.</p>
            </div>
        )
    }

    // ---------------- DATA ----------------
    const quiz = results.data.quiz
    const detailedResults = results.data.results

    const score = quiz.score || 0
    const totalQuestions = detailedResults.length
    const correctAnswers = detailedResults.filter(r => r.isCorrect).length
    const incorrectAnswers = totalQuestions - correctAnswers

    const documentId = quiz.document?._id ?? quiz.document

    // ---------------- HELPERS ----------------
    const getScoreColor = (score) => {
        if (score >= 80) return 'from-emerald-500 to-teal-500'
        if (score >= 60) return 'from-amber-500 to-orange-500'
        return 'from-rose-500 to-red-500'
    }

    const getScoreMessage = (score) => {
        if (score >= 90) return 'Outstanding!'
        if (score >= 80) return 'Great Job!'
        if (score >= 70) return 'Good Work!'
        if (score >= 60) return 'Not Bad!'
        return 'Keep Practicing!'
    }

    // ---------------- JSX ----------------
    return (
        <div className="max-w-5xl mx-auto px-4">
            {/* Back Button */}
            <div className="mb-6">
                <Link
                    to={`/documents/${documentId}`}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Document
                </Link>
            </div>

            <PageHeader title={`${quiz.title || 'Quiz'} Results`} />

            {/* ---------------- SCORE CARD ---------------- */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl p-8 mb-10">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 shadow-lg">
                        <Trophy className="w-8 h-8 text-emerald-600" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
                            Your Score
                        </p>

                        <div
                            className={`inline-block text-5xl font-bold bg-gradient-to-r ${getScoreColor(
                                score
                            )} bg-clip-text text-transparent`}
                        >
                            {score}%
                        </div>

                        <p className="mt-2 text-lg font-medium text-slate-700">
                            {getScoreMessage(score)}
                        </p>
                    </div>

                    <div className="flex justify-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {correctAnswers} Correct
                        </div>
                        <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-rose-500" />
                            {incorrectAnswers} Incorrect
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------------- QUESTION REVIEW ---------------- */}
            <div className="space-y-6">
                {detailedResults.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl p-6"
                    >
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h3 className="font-semibold text-slate-900">
                                Q{index + 1}. {item.question}
                            </h3>

                            {item.isCorrect ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            )}
                        </div>

                        <div className="space-y-2">
                            {item.options.map((option, optIndex) => {
                                const isCorrect = optIndex === item.correctAnswer
                                const isSelected = optIndex === item.selectedAnswer

                                return (
                                    <div
                                        key={optIndex}
                                        className={`px-4 py-2 rounded-lg border text-sm ${isCorrect
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                                : isSelected
                                                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                                                    : 'border-slate-200 bg-slate-50'
                                            }`}
                                    >
                                        {option}
                                    </div>
                                )
                            })}
                        </div>

                        {item.explanation && (
                            <div className="mt-4 text-sm text-slate-600">
                                <strong>Explanation:</strong> {item.explanation}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuizResultPage
