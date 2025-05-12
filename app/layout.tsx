import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecipeListWrapper from "./components/RecipeListWrapper";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="flex h-screen">
          <div className="w-64 flex-shrink-0 border-r">
            <h1 className="text-2xl font-bold p-4 border-b">Little Chef</h1>
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
