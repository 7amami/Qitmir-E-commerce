'use client';

import Image from 'next/image';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

export function OrgSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' className='h-16 cursor-default gap-3 px-2' aria-label='Qitmir E-commerce'>
          <Image src='/qitmir-logo.svg' alt='Qitmir قيتمير' width={150} height={48} className='h-auto w-36 object-contain' priority />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
