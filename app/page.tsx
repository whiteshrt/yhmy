'use client'
import React, {useEffect} from 'react';
import { NextUIProvider } from '@nextui-org/react';
import LoginCard from '@/components/cards/loginpage/LoginCard';
import {useSessions} from "@/hooks/useSessions";
import {useRouter} from "next/navigation";
export default function Home() {
    const { loggedUser } = useSessions();
    const router = useRouter();
    useEffect(() => {
        if (loggedUser!=null) {
            router.push('/home');
        }
    }, [loggedUser, router]);

    return (
      <NextUIProvider>
          <main className="dark flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-600 to-violet-600">
          <LoginCard />
        </main>
      </NextUIProvider>
  );
}
