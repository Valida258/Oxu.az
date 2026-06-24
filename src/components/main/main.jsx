import { getNewsPaginated } from '@/api/news/news'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { NewsCardSkeleton } from '../news/news-card-skleton'
import { NewsCard } from '../news/news-card'
import { useLanguage } from '../LanguageContext'

const Main = () => {
    const [page, setPage] = useState(1)
    const [inputPage, setInputPage] = useState('')
    const { t } = useLanguage()

    const { data, isLoading } = useQuery({
        queryKey: ['news', page],
        queryFn: () => getNewsPaginated(page, 6),
    })

    const totalPages = data?.meta?.totalPages || 1

    const goToPage = (p) => {
        const num = Number(p)
        if (num >= 1 && num <= totalPages) {
            setPage(num)
            setInputPage('')
        }
    }

    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (page > 3) pages.push('...')
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i)
            }
            if (page < totalPages - 2) pages.push('...')
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div>
            <div className="container mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <NewsCardSkeleton key={i} />
                    ))
                    : data?.data?.map((item) => (
                        <NewsCard
                            key={item._id}
                            title={item.title}
                            img={item.img}
                            category_id={item.category_id}
                            createdAt={item.createdAt}
                            view={item.view}
                            like={item.like}
                            dislike={item.dislike}
                            to={`/news/${item._id}`}
                            id={item._id}
                        />
                    ))}
            </div>

            {!isLoading && (
                <div className="flex flex-col items-center gap-4 mt-10">

                    {/* Nömrəli düymələr + Prev/Next */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <button
                            disabled={!data?.meta?.hasPrevPage}
                            onClick={() => goToPage(page - 1)}
                            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                        >
                            ←
                        </button>

                        {getPageNumbers().map((p, i) =>
                            p === '...' ? (
                                <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => goToPage(p)}
                                    className={`px-3 py-2 rounded font-semibold transition-colors ${
                                        p === page
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            disabled={!data?.meta?.hasNextPage}
                            onClick={() => goToPage(page + 1)}
                            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                        >
                            →
                        </button>
                    </div>

                    {/* Input ilə birbaşa səhifəyə keç */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{t('goToPage')}</span>
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={inputPage}
                            onChange={(e) => setInputPage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && goToPage(inputPage)}
                            placeholder={`1 - ${totalPages}`}
                            className="w-20 border border-gray-300 rounded px-2 py-1 text-sm text-center outline-none focus:border-indigo-500"
                        />
                        <button
                            onClick={() => goToPage(inputPage)}
                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                        >
                            {t('go')}
                        </button>
                    </div>

                </div>
            )}
        </div>
    )
}

export default Main