// import React from "react"
// import { useNavigate } from "react-router-dom"
// import { FileText, Trash2, BookOpen, BrainCircuit, Clock} from "lucide-react"
// import moment from 'moment'

// const formatFileSize = (bytes) => {
//     if( bytes === undefined || bytes === null) return 'N/A';

//     const units = ['B', 'KB', 'MB', 'GB', 'TB']
//     let size = bytes;
//     let unitIndex = 0;

//     while(size >= 1024 && unitIndex < units.length -1) {
//         size /= 1024;
//         unitIndex++;
//     }

//     return `${size.toFixed(1)} ${units[unitIndex]}`;
// }
// const DocumentCard = ({
//     document, onDelete
// }) => {
//     const navigate = useNavigate();
//     const handleNavigate = () => {
//         navigate(`/documents/${document._id}`);
//     }

//     const handleDelete = (e) => {
//         e.stopPropagation()
//         onDelete(document)
//     }

//     return (
//         <div className=""
//         onClick={handleNavigate}>
//             {/* Header Section */}
//             <div>
//                 <div className="">
//                     <div className="">
//                     <FileText classsName='' strokeWidth={2} />
//                     </div>
//                     <button
//                     onClick={handleDelete}
//                     className="">
//                         <Trash2 className="" strokeWidth={2} />
//                     </button>
//                 </div>
//                 {/* Title Section */}
//                 <h3 className="" title={document.title}>
//                     {document.title}
//                 </h3>
//                 {/* Document info */}
//                 <div className="">
//                     {document.fileSize !== undefined && (
//                         <>
//                         <span className="">{formatFileSize(document.fileSize)}</span>
//                         </>
//                     )}
//                 </div>
//                 {/* Stats Section */}
//                 <div className="">
//                     {document.flashcardCount !== undefined && (
//                         <div className="">
//                             <BookOpen className="" strokeWidth={2} />
//                             <span className="">{document.flashcardCount} Flashcards</span>
//                         </div>
//                     )}
//                     {document.quizCount !== undefined && (
//                         <div className="">
//                             <BrainCircuit className="" strokeWidth={2} />
//                             <span className="">{document.quizCount} Quizzes</span>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Footer */}
//             <div className="">
//                 <div className="">
//                     <Clock className="" strokeWidth={2} />
//                     <span>Upload {moment(document.createdAt).fromNow()}</span>
//                 </div>
//             </div>
//             {/* Hover Indicator */}
//             <div className="">
                
//             </div>
//         </div>
//     )
// }

// export default DocumentCard
import React from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Trash2, BookOpen, BrainCircuit, Clock} from "lucide-react"
import moment from 'moment'

const formatFileSize = (bytes) => {
    if( bytes === undefined || bytes === null) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes;
    let unitIndex = 0;

    while(size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

const DocumentCard = ({
    document, onDelete
}) => {
    const navigate = useNavigate();
    
    const handleNavigate = () => {
        navigate(`/documents/${document._id}`);
    }

    const handleDelete = (e) => {
        e.stopPropagation()
        onDelete(document)
    }

    return (
        <div className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer overflow-hidden"
        onClick={handleNavigate}>
            {/* Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                        <FileText className='w-6 h-6 text-white' strokeWidth={2} />
                    </div>
                    <button
                    onClick={handleDelete}
                    className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                </div>
                
                {/* Title Section */}
                <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-200" title={document.title}>
                    {document.title}
                </h3>
                
                {/* Document info */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    {document.fileSize !== undefined && (
                        <>
                        <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">{formatFileSize(document.fileSize)}</span>
                        </>
                    )}
                </div>
                
                {/* Stats Section */}
                <div className="flex items-center gap-4 pt-2">
                    {document.flashcardCount !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <BookOpen className="w-4 h-4 text-purple-500" strokeWidth={2} />
                            <span className="font-medium">{document.flashcardCount} Flashcards</span>
                        </div>
                    )}
                    {document.quizCount !== undefined && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <BrainCircuit className="w-4 h-4 text-emerald-500" strokeWidth={2} />
                            <span className="font-medium">{document.quizCount} Quizzes</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200/60">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>Uploaded {moment(document.createdAt).fromNow()}</span>
                </div>
            </div>
            
            {/* Hover Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left">
            </div>
        </div>
    )
}

export default DocumentCard