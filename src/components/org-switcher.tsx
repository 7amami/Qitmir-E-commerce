'use client';

import { Icons } from '@/components/icons';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

export function OrgSwitcher() {
  const { state } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' className='cursor-default' aria-label='Qitmir E-commerce'>
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg'>
            <Icons.galleryVerticalEnd className='size-4' />
          </div>
          <div className={`grid flex-1 text-left text-sm leading-tight ${state === 'collapsed' ? 'invisible max-w-0 overflow-hidden' : 'visible max-w-full'}`}>
            <span className='truncate font-semibold'>Qitmir E-commerce</span>
            <span className='text-muted-foreground truncate text-xs'>Workspace</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
