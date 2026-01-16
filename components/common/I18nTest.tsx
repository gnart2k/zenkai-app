'use client';

import { useI18n } from '@/components/common/I18nProvider';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
];

export function I18nTest() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div className="p-6 space-y-4 border rounded-lg">
      <h3 className="text-lg font-semibold">I18n Test Component (localStorage)</h3>
      
      <div className="flex gap-2">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            variant={language === lang.code ? "default" : "outline"}
            size="sm"
          >
            {lang.flag} {lang.name}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <p><strong>Current Language:</strong> {language}</p>
        <p><strong>localStorage language:</strong> {typeof window !== 'undefined' ? localStorage.getItem('language') : 'N/A'}</p>
        <p><strong>Welcome:</strong> {t('welcome')}</p>
        <p><strong>Save:</strong> {t('save')}</p>
        <p><strong>Dashboard Title:</strong> {t('dashboard.title')}</p>
        <p><strong>Auth Sign In:</strong> {t('auth.signIn')}</p>
        <p><strong>Pricing:</strong> {t('pricing.title')}</p>
        <p><strong>Settings:</strong> {t('settings')}</p>
      </div>
    </div>
  );
}