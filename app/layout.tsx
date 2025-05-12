import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecipeListWrapper from "./components/RecipeListWrapper";
import { RecipeProvider } from "./context/RecipeContext";

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
        <RecipeProvider>
          <div className="flex h-screen">
            <div className="w-64 flex-shrink-0">
              <RecipeListWrapper />
            </div>
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </RecipeProvider>
      </body>
    </html>
  );
}
