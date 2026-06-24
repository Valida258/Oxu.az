import { createContext, useContext, useState } from 'react'

const translations = {
  az: {
    // Header
    searchPlaceholder: 'Xəbər axtar...',
    noResults: 'Heç bir nəticə tapılmadı.',
    login: 'Daxil ol',
    // Main pagination
    goToPage: 'Səhifəyə keç:',
    go: 'Get',
    // Admin layout
    adminPanel: 'Admin Panel',
    adminSub: 'Oxu.az idarəetmə',
    // Admin sidebar
    adminTitle: 'Oxu.Az Admin',
    overview: 'Ümumi Baxış',
    categories: 'Kateqoriyalar',
    addNews: 'Xəbər Əlavə Et',
    editNews: 'Xəbəri Redaktə Et',
    logout: 'Çıxış et',
    // Admin overview
    dashboardTitle: 'İdarəetmə Paneli',
    categoriesCount: 'Kateqoriyalar',
    totalNews: 'Ümumi Xəbərlər',
    status: 'Status',
    active: 'Aktiv',
    existingNews: 'Mövcud Xəbərlər',
    loading: 'Yüklənir...',
    noNewsYet: 'Hələ ki xəbər əlavə edilməyib.',
    edit: 'Dəyişdir',
    delete: 'Sil',
    noCategory: 'Kateqoriyasız',
    // Admin categories
    categoryManagement: 'Kateqoriya İdarəetməsi',
    newCategory: 'Yeni Kateqoriya',
    categoryName: 'Kateqoriya Adı',
    categoryPlaceholder: 'Məsələn: İdman',
    addBtn: 'Əlavə et',
    existingCategories: 'Mövcud Kateqoriyalar',
    colId: 'ID',
    colName: 'Ad',
    colAction: 'Əməliyyat',
    // Admin news form
    newNewsTitle: 'Yeni Xəbər Paylaşın',
    editNewsTitle: 'Xəbəri Redaktə Edin',
    titleLabel: 'Başlıq',
    titlePlaceholder: 'Xəbərin başlığını daxil edin',
    categoryLabel: 'Kateqoriya',
    selectCategory: '-- Kateqoriya seçin --',
    imageMethod: 'Şəkil Əlavə Etmə Metodu',
    uploadFile: 'Kompyuterdən fayl yüklə',
    imageUrl: 'Şəkil Linki (URL)',
    coverImage: 'Örtük Şəkli',
    updateImage: 'Şəkli Yenilə (seçilməzsə köhnəsi qalır)',
    selectedFile: 'Seçilən fayl:',
    imageUrlLabel: 'Şəkil URL Linki',
    imageUrlPlaceholder: 'https://example.com/shekil.jpg',
    contentLabel: 'Məzmun',
    contentPlaceholder: 'Xəbər mətnini bura qeyd edin...',
    saving: 'Gözləyin...',
    save: 'Yadda Saxla',
    addNewsBtn: 'Əlavə Et',
    cancel: 'Ləğv et',
  },
  en: {
    // Header
    searchPlaceholder: 'Search news...',
    noResults: 'No results found.',
    login: 'Log in',
    // Main pagination
    goToPage: 'Go to page:',
    go: 'Go',
    // Admin layout
    adminPanel: 'Admin Panel',
    adminSub: 'Oxu.az management',
    // Admin sidebar
    adminTitle: 'Oxu.Az Admin',
    overview: 'Overview',
    categories: 'Categories',
    addNews: 'Add News',
    editNews: 'Edit News',
    logout: 'Log out',
    // Admin overview
    dashboardTitle: 'Dashboard',
    categoriesCount: 'Categories',
    totalNews: 'Total News',
    status: 'Status',
    active: 'Active',
    existingNews: 'Existing News',
    loading: 'Loading...',
    noNewsYet: 'No news added yet.',
    edit: 'Edit',
    delete: 'Delete',
    noCategory: 'Uncategorized',
    // Admin categories
    categoryManagement: 'Category Management',
    newCategory: 'New Category',
    categoryName: 'Category Name',
    categoryPlaceholder: 'E.g: Sports',
    addBtn: 'Add',
    existingCategories: 'Existing Categories',
    colId: 'ID',
    colName: 'Name',
    colAction: 'Action',
    // Admin news form
    newNewsTitle: 'Publish New News',
    editNewsTitle: 'Edit News',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter news title',
    categoryLabel: 'Category',
    selectCategory: '-- Select category --',
    imageMethod: 'Image Upload Method',
    uploadFile: 'Upload from computer',
    imageUrl: 'Image URL',
    coverImage: 'Cover Image',
    updateImage: 'Update Image (old one kept if not selected)',
    selectedFile: 'Selected file:',
    imageUrlLabel: 'Image URL',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    contentLabel: 'Content',
    contentPlaceholder: 'Enter news content...',
    saving: 'Please wait...',
    save: 'Save',
    addNewsBtn: 'Add',
    cancel: 'Cancel',
  },
  ru: {
    // Header
    searchPlaceholder: 'Поиск новостей...',
    noResults: 'Ничего не найдено.',
    login: 'Войти',
    // Main pagination
    goToPage: 'Перейти на страницу:',
    go: 'Перейти',
    // Admin layout
    adminPanel: 'Панель администратора',
    adminSub: 'Управление Oxu.az',
    // Admin sidebar
    adminTitle: 'Oxu.Az Админ',
    overview: 'Обзор',
    categories: 'Категории',
    addNews: 'Добавить новость',
    editNews: 'Редактировать новость',
    logout: 'Выйти',
    // Admin overview
    dashboardTitle: 'Панель управления',
    categoriesCount: 'Категории',
    totalNews: 'Всего новостей',
    status: 'Статус',
    active: 'Активен',
    existingNews: 'Существующие новости',
    loading: 'Загрузка...',
    noNewsYet: 'Новостей пока нет.',
    edit: 'Изменить',
    delete: 'Удалить',
    noCategory: 'Без категории',
    // Admin categories
    categoryManagement: 'Управление категориями',
    newCategory: 'Новая категория',
    categoryName: 'Название категории',
    categoryPlaceholder: 'Например: Спорт',
    addBtn: 'Добавить',
    existingCategories: 'Существующие категории',
    colId: 'ID',
    colName: 'Название',
    colAction: 'Действие',
    // Admin news form
    newNewsTitle: 'Опубликовать новость',
    editNewsTitle: 'Редактировать новость',
    titleLabel: 'Заголовок',
    titlePlaceholder: 'Введите заголовок новости',
    categoryLabel: 'Категория',
    selectCategory: '-- Выберите категорию --',
    imageMethod: 'Метод загрузки изображения',
    uploadFile: 'Загрузить с компьютера',
    imageUrl: 'Ссылка на изображение',
    coverImage: 'Обложка',
    updateImage: 'Обновить изображение (старое сохранится если не выбрать)',
    selectedFile: 'Выбранный файл:',
    imageUrlLabel: 'URL изображения',
    imageUrlPlaceholder: 'https://example.com/image.jpg',
    contentLabel: 'Содержание',
    contentPlaceholder: 'Введите текст новости...',
    saving: 'Подождите...',
    save: 'Сохранить',
    addNewsBtn: 'Добавить',
    cancel: 'Отмена',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('az')
  const t = (key) => translations[lang][key] || key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}