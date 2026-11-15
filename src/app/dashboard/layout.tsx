import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qitmir | قيتمير - إدارة التجارة الإلكترونية',
  description: 'لوحة Qitmir لإدارة الطلبات والمخزون والمصاريف والأرباح',
  robots: { index: false, follow: false }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <main id="main-content" className="min-h-screen w-full min-w-0 overflow-x-hidden">{children}</main>;
}
