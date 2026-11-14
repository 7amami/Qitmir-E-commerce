'use client';

import type { NavGroup, NavItem } from '@/types';

// Navigation is shown without account or organization-based filtering.
export function useFilteredNavItems(items: NavItem[]) {
  return items;
}

export function useFilteredNavGroups(groups: NavGroup[]) {
  return groups;
}
