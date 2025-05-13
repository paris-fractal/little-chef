'use client';

import { useState, useEffect } from "react"

interface TimerProps {
    minutes: number;
    instructionIndex: number;
}

export function Timer({ minutes, instructionIndex }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(minutes * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // Play a sound when timer completes
            new Audio('/timer-complete.mp3').play().catch(() => { });
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        setTimeLeft(minutes * 60);
        setIsRunning(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleTimer}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${isRunning
                        ? 'bg-[#e8d5c4] text-[#2c3e50] hover:bg-[#d4c0af]'
                        : 'bg-[#f5efe9] text-[#718096] hover:bg-[#e8d5c4]'
                    }`}
            >
                ⏱️ {formatTime(timeLeft)}
            </button>
            {!isRunning && timeLeft < minutes * 60 && (
                <button
                    onClick={resetTimer}
                    className="text-sm text-[#718096] hover:text-[#2c3e50]"
                >
                    ↺
                </button>
            )}
        </div>
    );
} 