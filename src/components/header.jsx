import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../api/categories/categories'
import { getNews } from '../api/news/news'
import { Spinner } from './ui/spinner'
import { Link } from '@tanstack/react-router'
import { useTheme } from './ThemeContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useLanguage } from './LanguageContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef(null)
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()

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

        {/* AXTARIŞ */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
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
                <p className="p-4 text-sm text-zinc-500">{t('noResults')}</p>
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

        {/* DİL SEÇİMİ + DARK MODE + LOG IN — DESKTOP */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm bg-transparent border border-zinc-200 dark:border-indigo-700 rounded-md px-2 py-1 text-gray-700 dark:text-white cursor-pointer outline-none"
          >
            <option value="az"> AZ</option>
            <option value="en"> EN</option>
            <option value="ru"> RU</option>
          </select>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-indigo-800 transition-colors"
          >
            {theme === 'dark'
              ? <SunIcon className="size-5 text-yellow-400" />
              : <MoonIcon className="size-5 text-gray-600" />
            }
          </button>

          <Link to="/admin" className="text-sm font-semibold text-gray-900 dark:text-white hover:text-indigo-600">
            {t('login')} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {/* DİL SEÇİMİ + DARK MODE + MENYU — MOBİL */}
        <div className="flex lg:hidden items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm bg-transparent border border-zinc-200 dark:border-indigo-700 rounded-md px-2 py-1 text-gray-700 dark:text-white cursor-pointer outline-none"
          >
            <option value="az">AZ</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-indigo-800 transition-colors"
          >
            {theme === 'dark'
              ? <SunIcon className="size-5 text-yellow-400" />
              : <MoonIcon className="size-5 text-gray-600" />
            }
          </button>

          <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 p-2.5 text-gray-700 dark:text-white">
            <Bars3Icon className="size-6" />
          </button>
        </div>
      </nav>

      {/* MOBİL MENYU */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10 bg-black/20" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-indigo-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <img alt="Logo" src="https://oxu.az/media/img/logo.svg?v=1" className="h-5 w-auto" />
            </Link>
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 p-2.5 text-gray-700 dark:text-white">
              <XMarkIcon className="size-6" />
            </button>
          </div>

          {/* MOBİL AXTARIŞ */}
          <div className="mt-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-zinc-100 dark:bg-indigo-950 rounded-full pl-4 pr-10 py-2 text-sm outline-none"
            />
            <MagnifyingGlassIcon className="size-4 absolute right-3 top-2.5 text-zinc-400" />
            {searchQuery.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800 mt-2 rounded-xl overflow-hidden z-20">
                {filteredNews.length > 0 ? (
                  filteredNews.map(news => (
                    <Link
                      key={news._id}
                      to={`/news/${news._id}`}
                      onClick={() => { setSearchQuery(''); setMobileMenuOpen(false) }}
                      className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-b last:border-0"
                    >
                      <img src={news.img} className="w-10 h-10 object-cover rounded" />
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1">{news.title}</span>
                    </Link>
                  ))
                ) : (
                  <p className="p-4 text-sm text-zinc-500">{t('noResults')}</p>
                )}
              </div>
            )}
          </div>

          {/* MOBİL KATEQORİYALAR */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {isCatsLoading ? <Spinner /> : categories?.map((item) => (
                  <Link
                    key={item._id}
                    to={`/categories/${item._id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-indigo-200 hover:bg-gray-50 dark:hover:bg-indigo-800"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-indigo-800"
                >
                  {t('login')}
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}