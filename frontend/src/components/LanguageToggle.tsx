'use client'

import { useLanguage } from '../contexts/LanguageContext'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle language"
    >
      <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language === 'vi' ? 'VN' : 'EN'}
      </span>
    </button>
  )
}