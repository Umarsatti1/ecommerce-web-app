import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MetaData } from "../models/pagination"
import { useState } from "react"

interface Props {
    metaData: MetaData
    onPageChange: (page: number) => void
}

export default function AppPagination({metaData, onPageChange}: Props) {
    const {currentPage, totalCount, totalPages, pageSize} = metaData
    const [pageNumber, setPageNumber] = useState(currentPage)

    function handlePageChange(page: number) {
        setPageNumber(page)
        onPageChange(page)
    }

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
                Showing {(currentPage-1)*pageSize+1}-
                {currentPage*pageSize > totalCount 
                    ? totalCount 
                    : currentPage*pageSize} of {totalCount} results
            </p>
            
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Prev
                </button>

                <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`min-w-[2.5rem] rounded-md px-3 py-2 text-sm font-medium ${
                                pageNumber === i + 1
                                    ? 'bg-gray-900 text-white'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}