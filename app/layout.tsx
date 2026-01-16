import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist } from "next/font/google";
import { SWRConfig } from 'swr';
import { I18nProvider } from '@/components/common/I18nProvider';
import { getTeamForUser, getUser } from '@/lib/core/db/queries';

export const metadata: Metadata = {
  title: 'Zenkai',
  description: 'A modern SaaS platform built with Next.js, Postgres, and Stripe.'
};

export const viewport: Viewport = {
  maximumScale: 1
};

const font = Geist({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	variable: "--font-geist",
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`bg-white dark:bg-gray-950 text-black dark:text-white ${font.variable}`}>
      <body className="min-h-[100dvh] bg-gray-50">
        <I18nProvider>
          <SWRConfig
            value={{
              fallback: {
                // We do NOT await here
                // Only components that read this data will suspend
                '/api/user': getUser(),
                '/api/team': getTeamForUser()
              }
            }}
          >
            {children}
          </SWRConfig>
        </I18nProvider>
      </body>
    </html>
  );
}
