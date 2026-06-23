import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


const fetchNewsById = async (id) => {
  const { data } = await axios.get(`https://oxuaz.davidjs.dev/news/${id}`)
  return data
}

export const Route = createFileRoute('/news/$id')({
  component: NewsDetail,
})

function NewsDetail() {
  const { id } = Route.useParams() 

  const { data: news, isLoading, error } = useQuery({
    queryKey: ['news', id],
    queryFn: () => fetchNewsById(id),
  })

  if (isLoading) return <div className="p-10 text-center">Yüklənir...</div>
  if (error) return <div className="p-10 text-center text-red-500">Xəbər tapılmadı.</div>

  return (
    <div className="mx-auto max-w-4xl p-6 lg:px-8">
      <img 
        src={news.img} 
        alt={news.title} 
        className="w-full h-96 object-cover rounded-2xl mb-8" 
      />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
        {news.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
        {news.description}
      </p>
    </div>
  )
}