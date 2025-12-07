import { redirect } from 'next/navigation';

export default function Home() {
  // Langsung lempar ke admin (yang nanti dicegat middleware ke login)
  redirect('/admin');
}