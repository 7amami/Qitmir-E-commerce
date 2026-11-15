import { NavGroup } from '@/types';

export const navGroups: NavGroup[] = [
  {
    label: 'إدارة التجارة الإلكترونية',
    items: [
      {
        title: 'نظام التجارة الإلكترونية',
        url: '/dashboard/erp',
        icon: 'dashboard',
        isActive: true,
        shortcut: ['d', 'd'],
        items: []
      }
    ]
  }
];
