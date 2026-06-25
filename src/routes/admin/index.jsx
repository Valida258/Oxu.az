import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'  
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCategories, createCategory, deleteCategory } from "../../api/categories/categories";
import { getNews, createNews, deleteNews, uploadImage, updateNews } from "../../api/news/news";
import { useTheme } from '../../components/ThemeContext'
import { useLanguage } from '../../components/LanguageContext'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: AdminDashboard,
})
function AdminDashboard() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { lang, setLang, t } = useLanguage()

  const {
    data: serverCategories,
    isLoading: isCatsLoading,
    refetch: refetchCats
  } = useQuery({ queryKey: ['categories'], queryFn: getCategories })

  const {
    data: serverNews,
    isLoading: isNewsLoading,
    refetch: refetchNews
  } = useQuery({ queryKey: ['news'], queryFn: getNews })

  const [activeTab, setActiveTab] = useState('overview')
  const [catInput, setCatInput] = useState('')
  const [newsTitle, setNewsTitle] = useState('')
  const [newsDesc, setNewsDesc] = useState('')
  const [selectedCatId, setSelectedCatId] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [imageType, setImageType] = useState('file')
  const [isUploading, setIsUploading] = useState(false)
  const [editingNewsId, setEditingNewsId] = useState(null)

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate({ to: '/admin/login' })
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()
    if (!catInput.trim()) return
    try {
      await createCategory(catInput.trim())
      alert(t('addBtn') + '!')
      setCatInput('')
      refetchCats()
    } catch (error) {
      alert('Xəta: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm('Bu kateqoriyanı silmək istədiyinizdən əminsiniz?')) return
    try {
      await deleteCategory(id)
      refetchCats()
    } catch {
      alert('Silinmə zamanı xəta baş verdi!')
    }
  }

  const resetNewsForm = () => {
    setNewsTitle('')
    setNewsDesc('')
    setSelectedCatId('')
    setSelectedImage(null)
    setImageUrlInput('')
    setImageType('file')
    setEditingNewsId(null)
  }

  const handleEditNewsClick = (news) => {
    setEditingNewsId(news._id || news.id)
    setNewsTitle(news.title || '')
    setNewsDesc(news.description || news.content || '')
    const catId = typeof news.category === 'object'
      ? (news.category?._id || news.category?.id)
      : (news.category || news.category_id || '');
    setSelectedCatId(catId)
    if (news.img) {
      setImageUrlInput(news.img)
      setImageType('url')
    }
    setActiveTab('news')
  }

  const handleSaveNews = async (e) => {
    e.preventDefault()
    if (!editingNewsId && (!newsTitle.trim() || !newsDesc.trim())) {
      alert('Başlıq və məzmun mütləqdir!')
      return
    }
    try {
      setIsUploading(true)
      const newsData = {}
      if (newsTitle.trim())  newsData.title       = newsTitle.trim()
      if (newsDesc.trim())   newsData.description = newsDesc.trim()
      if (selectedCatId)     newsData.category_id = selectedCatId
      if (imageType === 'file' && selectedImage) {
        try {
          const imgUrl = await uploadImage(selectedImage)
          if (imgUrl) newsData.img = imgUrl
        } catch (imgErr) {
          console.error('Şəkil yüklənmə xətası:', imgErr)
        }
      } else if (imageType === 'url' && imageUrlInput.trim()) {
        newsData.img = imageUrlInput.trim()
      }
      if (!editingNewsId && !newsData.img) {
        newsData.img = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000'
      }
      if (editingNewsId) {
        await updateNews(editingNewsId, newsData)
      } else {
        await createNews(newsData)
      }
      resetNewsForm()
      refetchNews()
      setActiveTab('overview')
    } catch (error) {
      console.error('Server cavabı:', error.response?.data)
      alert('Xəta: ' + (error.response?.data?.message || error.response?.data || error.message))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteNews = async (id) => {
    if (!confirm('Bu xəbəri silmək istədiyinizdən əminsiniz?')) return
    try {
      await deleteNews(id)
      refetchNews()
    } catch {
      alert('Xəbər silinərkən xəta baş verdi!')
    }
  }

  const getCategoryName = (news) => {
    if (news.category && typeof news.category === 'object' && news.category.name) return news.category.name;
    if (news.category_id && typeof news.category_id === 'object' && news.category_id.name) return news.category_id.name;
    const rawCatId = news.category || news.category_id;
    const catId = typeof rawCatId === 'object' ? (rawCatId?._id || rawCatId?.id) : rawCatId;
    if (!catId || !serverCategories?.length) return t('noCategory');
    const found = serverCategories.find(c => String(c._id || c.id) === String(catId));
    return found ? found.name : t('noCategory');
  }

  const getNewsArray = () => {
    if (!serverNews) return []
    if (Array.isArray(serverNews)) return serverNews
    if (Array.isArray(serverNews.data)) return serverNews.data
    if (Array.isArray(serverNews.news)) return serverNews.news
    return []
  }

  const finalNewsList = getNewsArray()

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col md:flex-row">

      {/* SOL PANEL */}
      <div className="w-full md:w-64 bg-zinc-900 dark:bg-zinc-950 text-zinc-300 flex flex-col p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">{t('adminTitle')}</h1>
          <p className="text-xs text-zinc-500 mt-1">daivd@davidjs.dev</p>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => { setActiveTab('overview'); setEditingNewsId(null) }}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}
          >
            📊 {t('overview')}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}
          >
            📁 {t('categories')}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'news' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/50'}`}
          >
            {editingNewsId ? `✏️ ${t('editNews')}` : `📰 ${t('addNews')}`}
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto w-full bg-red-600/10 hover:bg-red-600/20 text-red-400 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {t('logout')}
        </button>
      </div>

      {/* SAĞ PANEL */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">

        {/* YUXARI SAĞ - DİL + DARK MODE */}
        <div className="flex justify-end items-center gap-3 mb-6">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-sm bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-zinc-700 dark:text-zinc-200 cursor-pointer outline-none"
          >
            <option value="az"> AZ</option>
            <option value="en"> EN</option>
            <option value="ru"> RU</option>
          </select>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors shadow-sm"
          >
            {theme === 'dark'
              ? <SunIcon className="size-4 text-yellow-400" />
              : <MoonIcon className="size-4 text-zinc-600" />
            }
          </button>
        </div>

        {/* TAB 1: ÜMUMİ BAXIŞ */}
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">{t('dashboardTitle')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('categoriesCount')}</p>
                <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">
                  {isCatsLoading ? '...' : serverCategories?.length || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('totalNews')}</p>
                <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">
                  {isNewsLoading ? '...' : finalNewsList.length}
                </p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{t('status')}</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{t('active')}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6">
              <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-4">{t('existingNews')}</h3>
              {isNewsLoading || isCatsLoading ? (
                <p className="text-sm text-zinc-400">{t('loading')}</p>
              ) : finalNewsList.length === 0 ? (
                <p className="text-sm text-zinc-400">{t('noNewsYet')}</p>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
                  {finalNewsList.map((news) => (
                    <div
                      key={news._id || news.id}
                      className="py-4 flex justify-between items-center hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-4 flex-1 pr-4">
                        {news.img && (
                          <img
                            src={news.img}
                            alt="news"
                            className="w-14 h-14 object-cover rounded-lg border border-zinc-200 dark:border-zinc-600 flex-shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{news.title}</h4>
                          <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2">{news.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                          {getCategoryName(news)}
                        </span>
                        <button
                          onClick={() => handleEditNewsClick(news)}
                          className="text-blue-500 hover:text-blue-700 text-xs font-semibold"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDeleteNews(news._id || news.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KATEQORİYALAR */}
        {activeTab === 'categories' && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">{t('categoryManagement')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm h-fit">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-4">➕ {t('newCategory')}</h3>
                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">{t('categoryName')}</label>
                    <input
                      type="text"
                      value={catInput}
                      onChange={(e) => setCatInput(e.target.value)}
                      placeholder={t('categoryPlaceholder')}
                      className="w-full border border-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {t('addBtn')}
                  </button>
                </form>
              </div>

              <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm lg:col-span-2">
                <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-4">{t('existingCategories')}</h3>
                {isCatsLoading ? (
                  <p className="text-sm text-zinc-400">{t('loading')}</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-700 text-xs text-zinc-400 uppercase font-semibold">
                          <th className="pb-3">{t('colId')}</th>
                          <th className="pb-3">{t('colName')}</th>
                          <th className="pb-3 text-right">{t('colAction')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700 text-sm">
                        {serverCategories?.map((cat) => (
                          <tr key={cat._id || cat.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-700/50">
                            <td className="py-3.5 text-zinc-400 font-mono text-xs">{cat._id || cat.id}</td>
                            <td className="py-3.5 font-medium text-zinc-800 dark:text-zinc-100">{cat.name}</td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => handleDeleteCategory(cat._id || cat.id)}
                                className="text-red-500 hover:text-red-600 text-xs font-semibold"
                              >
                                {t('delete')}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: XƏBƏR ƏLAVƏ ET / REDAKTƏ ET */}
        {activeTab === 'news' && (
          <div className="max-w-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
              {editingNewsId ? `✏️ ${t('editNewsTitle')}` : `📰 ${t('newNewsTitle')}`}
            </h2>
            <form onSubmit={handleSaveNews} className="space-y-5">

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">{t('titleLabel')}</label>
                <input
                  type="text"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  placeholder={t('titlePlaceholder')}
                  className="w-full border border-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">{t('categoryLabel')}</label>
                <select
                  value={selectedCatId}
                  onChange={(e) => setSelectedCatId(e.target.value)}
                  className="w-full border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 cursor-pointer"
                >
                  <option value="">{t('selectCategory')}</option>
                  {serverCategories?.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-700/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-600 space-y-3">
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wide">{t('imageMethod')}</label>
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-200">
                    <input
                      type="radio"
                      name="imageType"
                      value="file"
                      checked={imageType === 'file'}
                      onChange={() => setImageType('file')}
                      className="cursor-pointer"
                    />
                    📂 {t('uploadFile')}
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-700 dark:text-zinc-200">
                    <input
                      type="radio"
                      name="imageType"
                      value="url"
                      checked={imageType === 'url'}
                      onChange={() => setImageType('url')}
                      className="cursor-pointer"
                    />
                    🔗 {t('imageUrl')}
                  </label>
                </div>

                <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-600">
                  {imageType === 'file' ? (
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">
                        {editingNewsId ? t('updateImage') : t('coverImage')}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:border file:border-zinc-300 file:text-zinc-700 hover:file:bg-zinc-50 cursor-pointer"
                      />
                      {selectedImage && (
                        <p className="text-xs text-green-600 mt-1">✔ {t('selectedFile')} {selectedImage.name}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-1">{t('imageUrlLabel')}</label>
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder={t('imageUrlPlaceholder')}
                        className="w-full border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">{t('contentLabel')}</label>
                <textarea
                  rows={5}
                  value={newsDesc}
                  onChange={(e) => setNewsDesc(e.target.value)}
                  placeholder={t('contentPlaceholder')}
                  className="w-full border border-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors text-white ${
                    isUploading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500'
                  }`}
                >
                  {isUploading ? `⌛ ${t('saving')}` : editingNewsId ? `💾 ${t('save')}` : `🚀 ${t('addNewsBtn')}`}
                </button>
                {editingNewsId && (
                  <button
                    type="button"
                    onClick={() => { resetNewsForm(); setActiveTab('overview') }}
                    className="px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 text-zinc-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    {t('cancel')}
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
