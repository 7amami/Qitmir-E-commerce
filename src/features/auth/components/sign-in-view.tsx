import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignInViewPage() {
  return <main className='flex min-h-screen items-center justify-center p-6'><Card className='w-full max-w-md'><CardHeader><CardTitle>Sign-in is disabled</CardTitle></CardHeader><CardContent className='text-muted-foreground'>This dashboard is currently configured for personal use without user accounts.</CardContent></Card></main>;
}
