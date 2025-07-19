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
      <body className={`min-h-screen bg-gray-950 text-gray-100 ${geistSans.variable} ${geistMono.variable}`}>
        {/* Dark tech background with subtle texture */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#111_70%)] opacity-100" />
        
        {/* Main content container - left aligned */}
        <div className="min-h-screen relative">
          <Navbar />
          
          {/* Left-aligned content container */}
          <main className="w-full max-w-7xl px-2 py-8 mx-0 md:ml-12 lg:ml-2">
            <div className="relative z-10">
              {children}
            </div>
            
            {/* Tech-inspired decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              {/* Grid lines for tech vibe */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIHg9IjAiIHk9IjAiIGZpbGw9IiMzMzMzMzMiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20" />
              
              {/* Subtle corner accent */}
              <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-teal-400/20" />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}