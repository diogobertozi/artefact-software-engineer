import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './styles.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A small task manager built with Next.js and tRPC.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header"><Link href="/">Task Manager</Link></header>
        <main>{children}</main>
      </body>
    </html>
  );
}
