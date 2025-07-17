"use client";

import googleOneTap from "google-one-tap";
import { signIn } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export default function useOneTapLogin() {
  const { data: session, status } = useSession();

  const handleLogin = async function (credentials: string) {
    const res = await signIn("google-one-tap", {
      credential: credentials,
      redirect: false,
    });
    console.log("signIn ok", res);
  };

  const oneTapLogin = useCallback(function () {
    // 安全地获取客户端环境变量
    const clientId = typeof window !== 'undefined' && 
      window.__NEXT_DATA__?.props?.pageProps?.googleId || 
      process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID || '';

    // 如果没有客户端ID，则不执行登录
    if (!clientId) {
      // 静默跳过，不显示警告（开发环境中经常没有配置Google OAuth）
      return;
    }

    const options = {
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: "signin",
    };

    try {
      // 确保只在客户端执行
      if (typeof window !== 'undefined') {
        googleOneTap(options, (response: any) => {
          console.log("onetap login ok", response);
          handleLogin(response.credential);
        });
      }
    } catch (error) {
      console.error("Error initializing Google One Tap:", error);
    }
  }, []);

  useEffect(() => {
    // 只在客户端执行
    if (typeof window === 'undefined') return;

    if (status === "unauthenticated") {
      // 执行初始登录
      oneTapLogin();

      const intervalId = setInterval(() => {
        oneTapLogin();
      }, 3000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [status, oneTapLogin]);

  return oneTapLogin;
}
