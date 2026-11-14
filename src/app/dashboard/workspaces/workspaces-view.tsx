'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workspacesInfoContent } from '@/config/infoconfig';

export default function WorkspacesView() {
  return (
    <PageContainer pageTitle='Workspaces' pageDescription='Your personal workspace' infoContent={workspacesInfoContent}>
      <Card>
        <CardHeader><CardTitle>Personal Workspace</CardTitle></CardHeader>
        <CardContent className='text-muted-foreground'>Organization switching and team accounts are disabled in this single-user dashboard.</CardContent>
      </Card>
    </PageContainer>
  );
}
