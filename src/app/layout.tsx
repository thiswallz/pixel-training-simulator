import type {Metadata, Viewport} from "next";
import localFont from "next/font/local";
import "./globals.scss";
import {Providers} from "@/app/providers";

const geistSans = localFont({
    src: "./fonts/Jersey10-Regular.ttf",
    variable: "--font-geist-sans",
});

export const metadata: Metadata = {
    title: "Pixel Perfect Simulator",
    keywords: "pixel perfect, figma, simulator, design, training, screening, candidates",
    description: "Practice and learn how to build pixel perfect designs with fun. Use Figma as in real life. Use this app for training or screening candidates.",
};

export const viewport: Viewport = {
    width: 'device-width, shrink-to-fit=no',
    minimumScale: 1,
    initialScale: 1,
    userScalable: false,
    viewportFit: "contain"
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable}`}>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
