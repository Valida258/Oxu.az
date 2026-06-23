import Main from '@/components/main/main'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Main,
})