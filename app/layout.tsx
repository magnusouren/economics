import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Økonomikalkulator',
    description: 'En enkel økonomikalkulator for privatpersoner',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
            >
                <Navbar />
                <div className='-mt-16 w-full h-64 bg-chart-2'></div>
                <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {children}
                </main>
            </body>
        </html>
    );
}
