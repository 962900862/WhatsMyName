import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, NextRequest } from 'next/server';

// 增强中间件，添加x-url头部信息
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // 调用国际化中间件
  const response = intlMiddleware(request);
  
  // 添加当前URL到响应头部
  if (response) {
    response.headers.set('x-url', request.url);
  }
  
  return response;
}

export const config = {
  matcher: [
    // 匹配所有路径除了API和静态资源
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"
  ],
};
