// import React, { useState, useEffect } from 'react'
// import { Plus, Trash2 } from 'lucide-react'
// import toast from 'react-hot-toast'
// import quizService from '../../service/quizService'
// import aiService from '../../service/aiService'
// import Spinner from '../common/Spinner'
// import Button from '../common/Button'
// import Modal from '../common/Modal'
// import QuizCard from './QuizCard'
// import EmptyState from '../common/EmptyState'

// const QuizManager = ({documentId}) => {

//     const [quizzes, setQuizzes] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [generating, setGenerating] = useState(false)
//     const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
//     const [numQuestions, setNumQuestions] = useState(5)
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
//     const [deleting, setDeleting] = useState(false)
//     const [selectedQuiz, setSelectedQuiz] = useState(null)

//     const fetchQuizzes = async () => {
//         setLoading(true)
//         try {
//             const data = await quizService.getQuizzesForDocument(documentId);
//             setQuizzes(data.data);
//         } catch (error) {
//             toast.error("Failed to fetch quizzes.")
//             console.error(error)
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         if(documentId) {
//             fetchQuizzes()
//         }
//     },[documentId])

//     const handleGenerateQuiz = async(e) => {
//         e.preventDefault();
//         setGenerating(true);
//         try {
//             await aiService.generateQuiz(documentId, { numQuestions })
//             toast.success('Quiz generated successfully!!')
//             setIsGenerateModalOpen(false)
//             fetchQuizzes()
//         } catch (error) {
//             toast.error(error.message || 'Failed to generate quiz!!')
//         } finally {
//             setGenerating(false)
//         }
//     }

//     const handleDeleteRequest = (quiz) => {
//         setSelectedQuiz(quiz)
//         setIsDeleteModalOpen(true)
//     }

//     const handleConfirmDelete = async () => {

//     }

//     const renderQuizContent = () => {
//         if(loading) {
//             return <Spinner />
//         }
//         if(quizzes.length === 0) {
//             return (
//                 <EmptyState title="No QUizzes Yet" description="Generate a Quiz from your document to test your knowledge." />
//             )
//         }
//         return (
//             <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
//                 {quizzes.map((quiz) => (
//                     <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
//                 ))}
//             </div>
//         )
//     }

//     return (
//         <div className='bg-white border border-neutral-200 rounded-lg p-6'>
//             <div className='flex justify-end gap-2 mb-4'>
//             <Button onClick={() => setIsGenerateModalOpen(true)}>
//                 <Plus size={16} />
//                 Generate Quiz
//             </Button>
//             </div>
//             {renderQuizContent()}
//         </div>
//     )
// }

// export default QuizManager
import React, { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

import quizService from '../../service/quizService'
import aiService from '../../service/aiService'

import Spinner from '../common/Spinner'
import Button from '../common/Button'
import Modal from '../common/Modal'
import QuizCard from './QuizCard'
import EmptyState from '../common/EmptyState'

const QuizManager = ({ documentId }) => {

    // -------------------- STATE --------------------
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(true)

    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
    const [numQuestions, setNumQuestions] = useState(5)
    const [generating, setGenerating] = useState(false)

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedQuiz, setSelectedQuiz] = useState(null)
    const [deleting, setDeleting] = useState(false)

    // -------------------- FETCH QUIZZES --------------------
    const fetchQuizzes = async () => {
        setLoading(true)
        try {
            const res = await quizService.getQuizzesForDocument(documentId)
            setQuizzes(res.data)
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch quizzes')
        } finally {
            setLoading(false)
        }
    }

    // Fetch when documentId changes
    useEffect(() => {
        if (documentId) {
            fetchQuizzes()
        }
    }, [documentId])

    // -------------------- GENERATE QUIZ --------------------
    const handleGenerateQuiz = async (e) => {
        e.preventDefault()

        setGenerating(true)
        try {
            await aiService.generateQuiz(documentId, { numQuestions })
            toast.success('Quiz generated successfully!')
            setIsGenerateModalOpen(false)
            fetchQuizzes()
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Failed to generate quiz')
        } finally {
            setGenerating(false)
        }
    }

    // -------------------- DELETE QUIZ --------------------
    const handleDeleteRequest = (quiz) => {
        setSelectedQuiz(quiz)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedQuiz) return

        setDeleting(true)
        try {
            await quizService.deleteQuiz(selectedQuiz._id)
            toast.success('Quiz deleted')
            setIsDeleteModalOpen(false)
            setSelectedQuiz(null)
            fetchQuizzes()
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete quiz')
        } finally {
            setDeleting(false)
        }
    }

    // -------------------- RENDER CONTENT --------------------
    const renderQuizContent = () => {
        if (loading) return <Spinner />

        if (quizzes.length === 0) {
            return (
                <EmptyState
                    title="No Quizzes Yet"
                    description="Generate a quiz from your document to test your knowledge."
                    buttonText="Generate Quiz"
                    onActionClick={() => setIsGenerateModalOpen(true)}
                />
            )
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {quizzes.map((quiz) => (
                    <QuizCard
                        key={quiz._id}
                        quiz={quiz}
                        onDelete={handleDeleteRequest}
                    />
                ))}
            </div>
        )
    }

    // -------------------- JSX --------------------
    return (
        <div className="bg-white border border-neutral-200 rounded-lg p-6">

            {/* Header */}
            <div className="flex justify-end gap-2 mb-4">
                <Button onClick={() => setIsGenerateModalOpen(true)}>
                    <Plus size={16} />
                    Generate Quiz
                </Button>
            </div>

            {/* Quiz List */}
            {renderQuizContent()}

            {/* ---------------- GENERATE MODAL ---------------- */}
            <Modal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
                title="Generate Quiz"
            >
                <form onSubmit={handleGenerateQuiz} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={20}
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(Number(e.target.value))}
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    <Button type="submit" disabled={generating}>
                        {generating ? 'Generating...' : 'Generate'}
                    </Button>
                </form>
            </Modal>

            {/* ---------------- DELETE MODAL ---------------- */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Quiz"
            >
                <p className="text-sm text-slate-600 mb-4">
                    Are you sure you want to delete this quiz?
                </p>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => setIsDeleteModalOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={handleConfirmDelete}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </Modal>

        </div>
    )
}

export default QuizManager
