import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blogify",
  description: "Create and share your blogs with the world",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-h-screen bg-[url('/images/cosmic-bg.jpg')] bg-cover bg-fixed bg-center text-white ${geistSans.variable} ${geistMono.variable}`}>
        {/* Cosmic gradient overlay */}
        <div className="fixed inset-0 bg-gradient-to-br from-[rgba(161,98,232,0.15)] to-[rgba(8,232,222,0.1)] pointer-events-none" />
        
        {/* Frosted glass background layer */}
        <div className="min-h-screen backdrop-blur-2xl bg-[rgba(255,255,255,0.08)]">
          <Navbar />
          
          {/* Main content with subtle parallax effect */}
          <main className="max-w-6xl mx-auto px-6 py-8 transform-[translateZ(0)]">
            <div className="relative z-10">
              {children}
            </div>
            
            {/* Floating particles for depth */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-[rgba(161,98,232,0.4)]"
                  style={{
                    width: Math.random() * 5 + 1 + 'px',
                    height: Math.random() * 5 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animation: `float ${Math.random() * 20 + 10}s linear infinite`,
                    opacity: Math.random() * 0.5 + 0.1
                  }}
                />
              ))}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}