"use client";

import React, {createContext, useContext, ReactNode, useState} from "react";
import { authClient, Session } from "@/lib/auth-client";
import { useRouter } from "next/navigation"; // 1. เพิ่ม Router เพื่อใช้เปลี่ยนหน้า

// 2. เพิ่ม signOut เข้าไปใน Type
interface UserContextType {
    session: Session["session"] | null;
    user: Session["user"] | null;
    isLoading: boolean;
    error: Error | null;
    signOut: () => Promise<void>; // <--- เพิ่มตรงนี้
}

const isMockMode = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data, isPending, error } = authClient.useSession();
    const router = useRouter(); // เรียกใช้ Router

    const [mockData, setMockData] = useState<{ session: any; user: any } | null>({
        session: { id: "mock-session", expiresAt: new Date() },
        user: { id: "mock-1", name: "Mock User", email: "mock@test.com" }
    });


    const handleSignOut = async () => {
        if (isMockMode) {
            console.log("Mock: Signing out...");
            setMockData(null);
            router.refresh();
            return;
        }

        try {
            await authClient.signOut();
            //router.push("/signin");
            router.refresh();
        } catch (err) {
            console.error("Sign out failed", err);
        }
    };

    const value = isMockMode ? {
        session: mockData?.session || null,
        user: mockData?.user || null,
        isLoading: false, // ในโหมด mock ให้เสร็จทันทีหรือทำหน่วงเวลาก็ได้
        error: null,
        signOut: handleSignOut,
    } : {
        session: data?.session || null,
        user: data?.user || null,
        isLoading: isPending,
        error: error || null,
        signOut: handleSignOut,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return context;
};