import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'إدارة التجارة الإلكترونية',
    items: [
      { title: 'لوحة التحكم', url: '/dashboard/erp', icon: 'dashboard', isActive: false, shortcut: ['d', 'd'], items: [] },
      { title: 'المنتجات', url: '/dashboard/erp', icon: 'product', isActive: false, items: [] },
      { title: 'الطلبات', url: '/dashboard/erp', icon: 'kanban', isActive: false, items: [] },
      { title: 'المصاريف والأرباح', url: '/dashboard/erp', icon: 'billing', isActive: false, items: [] }
    ]
  }
];
