import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfileViewPage() {
  return (
    <div className='flex w-full flex-col p-4'>
      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className='text-muted-foreground'>User profiles are disabled because this dashboard is configured for personal use without accounts.</CardContent>
      </Card>
    </div>
  );
}
