"use client"

import {useEffect, useState} from "react";





export const REGIS_EXPIRED_DATE = process.env.NEXT_PUBLIC_TIME_END_REGIS || "2026-03-10T23:59:59+07:00";








export interface TimerStatus {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isUrgent: boolean;
    isExpired: boolean | null;
}

export const useCountdown = (targetDate:string) => {
    const [status, setStatus] = useState<TimerStatus>({
        days: 0, hours: 0, minutes: 0, seconds: 0,
        isUrgent: false, isExpired: false
    });

    useEffect(() => {
        const diff:number = new Date(targetDate).getTime() - new Date().getTime();
        if (diff <= 0) {
            setStatus(prev => ({ ...prev, isExpired: true }));
        } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            setStatus({
                days,
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60),
                isUrgent: days < 1,
                isExpired: false
            });
        }

        const timer = setInterval(() => {
            const diff:number = new Date(targetDate).getTime() - new Date().getTime();
            if (diff <= 0) {
                setStatus(prev => ({ ...prev, isExpired: true }));
                clearInterval(timer);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                setStatus({
                    days,
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                    isUrgent: days < 1,
                    isExpired: false
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return status;
};