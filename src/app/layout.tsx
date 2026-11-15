import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/components/themes/font.config';
import { DEFAULT_THEME, THEMES } from '@/components/themes/theme.config';
import ThemeProvider from '@/components/themes/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import '../styles/globals.css';

const META_THEME_COLORS = { light: '#ffffff', dark: '#09090b' };
export const metadata: Metadata = {
  title: { default: 'Qitmir | إدارة التجارة الإلكترونية', template: '%s | Qitmir' },
  description: 'نظام إدارة التجارة الإلكترونية والطلبات والمخزون والمصاريف والأرباح.',
  robots: { index: false, follow: false }
};
export const viewport: Viewport = { themeColor: META_THEME_COLORS.light };
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const themeToApply = THEMES.some((t) => t.value === activeThemeValue) ? activeThemeValue! : DEFAULT_THEME;
  return (
    <html lang='ar' dir='rtl' suppressHydrationWarning data-theme={themeToApply}>
      <head><meta name='theme-color' content={META_THEME_COLORS.light} /></head>
      <body className={cn('bg-background overflow-x-hidden overscroll-none font-sans antialiased', fontVariables)}>
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange enableColorScheme>
            <Providers activeThemeValue={themeToApply}><Toaster />{children}</Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
