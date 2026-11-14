'use client';

import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { billingInfoContent } from '@/config/infoconfig';

export default function BillingView() {
  return (
    <PageContainer infoContent={billingInfoContent} pageTitle='Billing & Plans' pageDescription='Subscription management can be configured here when needed.'>
      <Card>
        <CardHeader>
          <CardTitle>Billing is not configured</CardTitle>
          <CardDescription>This personal dashboard currently runs without Clerk Billing or user accounts.</CardDescription>
        </CardHeader>
        <CardContent className='text-muted-foreground'>You can add a payment provider later if you decide to manage subscriptions.</CardContent>
      </Card>
    </PageContainer>
  );
}
