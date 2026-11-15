'use client';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';

export function OrgSwitcher() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='h-14 cursor-default gap-3 px-2'
          aria-label='Qitmir E-commerce'
        >
          <div className='relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#002432] text-[#F78837] shadow-sm ring-1 ring-[#F78837]/30'>
            <span className='-rotate-45 text-[25px] font-black leading-none'>Q</span>
            <span className='absolute bottom-1 right-1 size-1.5 rounded-full bg-[#F78837]' />
          </div>
          <div className={`grid min-w-0 flex-1 leading-tight ${collapsed ? 'invisible max-w-0 overflow-hidden' : 'visible max-w-full'}`}>
            <span className='truncate text-base font-bold tracking-wide text-[#F78837]'>Qitmir</span>
            <span className='truncate text-[11px] font-medium text-muted-foreground'>قيتمير · E-commerce ERP</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
