import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import RecipeListWrapper from "./components/RecipeListWrapper";
import UserAvatar from "./components/UserAvatar";
import { auth } from "./auth";
import { headers } from 'next/headers';

const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Little Chef",
  description: "Your AI cooking companion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user ? {
    name: session.user.name || '',
    email: session.user.email || ''
  } : null;

  return (
    <html lang="en">
      <body className={`${playfair.className} bg-[#faf6f1] text-[#2c3e50]`}>
        <div className="flex h-screen">
          <div className="w-64 flex-shrink-0 border-r border-[#e8d5c4] bg-[#f5efe9]">
            <div className="flex items-center justify-between p-4 border-b border-[#e8d5c4]">
              <h1 className="text-2xl font-bold">Little Chef</h1>
              <UserAvatar user={user} />
            </div>
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
