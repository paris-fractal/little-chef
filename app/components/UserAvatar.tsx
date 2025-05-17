'use client';

import { useState, useRef, useEffect } from 'react';
import { handleSignOut } from '@/app/actions/auth';

export default function UserAvatar({ user }: { user: { name: string; email: string } | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const initial = user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?';

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-[#a8c4d9] text-[#2c3e50] flex items-center justify-center font-medium hover:bg-[#8ab3d0] transition-colors"
            >
                {initial}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                            {user.name || user.email}
                        </div>
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 