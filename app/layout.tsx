import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sign In | Authentication App',
  description: 'Secure authentication platform with sign in and registration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-(--color-background) text-(--color-text)">
        {children}
      </body>
    </html>
  );
}
