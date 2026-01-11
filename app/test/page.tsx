import { useI18n } from '@/components/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { I18nTest } from '@/components/I18nTest';

export default function TestPage() {
  const { t, language } = useI18n();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('welcome')}</h1>
        <LanguageSwitcher />
      </div>
      
      <div className="space-y-4">
        <p><strong>Current Language:</strong> {language}</p>
        <p><strong>Loading:</strong> {t('loading')}</p>
        <p><strong>Save:</strong> {t('save')}</p>
        <p><strong>Cancel:</strong> {t('cancel')}</p>
        <p><strong>Settings:</strong> {t('settings')}</p>
        <p><strong>Welcome Back:</strong> {t('dashboard.welcomeBack')}</p>
        <p><strong>Sign In:</strong> {t('auth.signIn')}</p>
        <p><strong>Pricing Title:</strong> {t('pricing.title')}</p>
        <p><strong>Dashboard Title:</strong> {t('dashboard.title')}</p>
      </div>

      <I18nTest />
    </div>
  );
}