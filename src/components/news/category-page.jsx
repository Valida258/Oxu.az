import { getCategoryById } from '@/api/categories/categories'
import { useQuery } from '@tanstack/react-query'
import { NewsCardSkeleton } from './news-card-skleton'
import { NewsCard } from './news-card'
import { Route } from '@/routes/categories/$id'


const NewsPage = () => {
    const { id } = Route.useParams()
    console.log(id)

    const { data, isLoading } = useQuery({
        queryKey: ['news', id],
        queryFn: () => getCategoryById(id)
    })

    console.log(data)
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
        </div>
    )
}

export default NewsPage