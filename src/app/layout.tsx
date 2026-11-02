import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Data Command Center',
  description: 'Personal Workspace for Data Professionals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}