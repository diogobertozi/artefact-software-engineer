import Link from 'next/link';

export default function NotFound() {
  return <><h1>Page unavailable</h1><p>The requested page or task could not be found.</p><Link href="/">Back to tasks</Link></>;
}
