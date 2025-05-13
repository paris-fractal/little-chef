import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import RecipeListWrapper from "./components/RecipeListWrapper";

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Little Chef",
  description: "Your AI cooking companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.className} bg-[#faf6f1] text-[#2c3e50]`}>
        <div className="flex h-screen">
          <div className="w-64 flex-shrink-0 border-r border-[#e8d5c4] bg-[#f5efe9]">
            <h1 className="text-2xl font-bold p-4 border-b border-[#e8d5c4]">Little Chef</h1>
            <RecipeListWrapper />
          </div>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
