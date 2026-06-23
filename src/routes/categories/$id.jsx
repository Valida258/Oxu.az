import NewsPage from '@/components/news/category-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/$id')({
  component: NewsPage,
})