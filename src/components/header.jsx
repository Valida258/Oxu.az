'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories/categories'
import { getNews } from '../api/news/news' 
import { Spinner } from './ui/spinner'
import { Link } from '@tanstack/react-router'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)

  const { data: categories, isLoading: isCatsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  const { data: allNews } = useQuery({
    queryKey: ['news'],
    queryFn: getNews,
    select: (data) => data.data || data
  })

  const filteredNews = searchQuery.trim().length > 0 
    ? allNews?.filter(news => 
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5) 
    : []

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('')
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="bg-white dark:bg-indigo-900 border-b border-zinc-100 dark:border-indigo-950 relative z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 gap-x-6">
        
        {/* LOGO */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <img alt="Logo" src="https://oxu.az/media/img/logo.svg?v=1" className="h-5 w-auto dark:hidden" />
          </Link>
        </div>

        {/* CANLI AXTARIŞ QUTUSU */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Xəbər axtar..."
            className="w-full bg-zinc-100 dark:bg-indigo-950 rounded-full pl-4 pr-10 py-1.5 text-sm outline-none"
          />
          <MagnifyingGlassIcon className="size-4 absolute right-3 top-2 text-zinc-400" />

          {searchQuery.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800 mt-2 rounded-xl overflow-hidden">
              {filteredNews.length > 0 ? (
                filteredNews.map(news => (
                  <Link 
                    key={news._id} 
                    to={`/news/${news._id}`}
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b last:border-0"
                  >
                    <img src={news.img} className="w-10 h-10 object-cover rounded" />
                    <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">{news.title}</span>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-sm text-zinc-500">Heç bir nəticə tapılmadı.</p>
              )}
            </div>
          )}
        </div>

        {/* KATEQORİYALAR */}
        <div className="hidden lg:flex lg:gap-x-6 items-center">
          {isCatsLoading ? <Spinner /> : categories?.map((item) => (
            <Link key={item._id} to={`/categories/${item._id}`} className="text-sm font-semibold text-gray-700 dark:text-indigo-200">
              {item.name}
            </Link>
          ))}
        </div>

        {/* LOG IN (BƏRPA OLUNDU) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link to="/admin" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* MOBİL MENYU */}
        <div className="flex lg:hidden">
          <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 p-2.5 text-gray-700">
            <Bars3Icon className="size-6" />
          </button>
        </div>
      </nav>
      {/* ... DialogPanel hissəsi eyni qala bilər ... */}
    </header>
  )
}