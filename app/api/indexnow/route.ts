import { NextResponse } from "next/server";

// IndexNow API密钥
const INDEXNOW_KEY = "5e4f2948e5c04203bdf74342ec92f1f6";
// 网站域名
const HOST = process.env.NEXT_PUBLIC_WEB_URL?.replace(/^https?:\/\//, '') || "bigbeautifulbillcalculator.org";

export const runtime = "edge";

// 这个API路由允许内部服务提交URL变更
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { urls, secret } = data;

    // 简单的安全检查 - 实际项目中应使用更安全的认证方式
    if (secret !== process.env.INDEXNOW_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
    }

    // 格式化URL列表，确保所有URL都属于同一域名
    const urlList = urls.filter(url => {
      try {
        const urlObj = new URL(url);
        return urlObj.hostname === HOST;
      } catch (e) {
        return false;
      }
    });

    if (urlList.length === 0) {
      return NextResponse.json({ error: "No valid URLs provided" }, { status: 400 });
    }

    // 构建IndexNow API请求
    const indexNowData = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
      urlList
    };

    // 发送到IndexNow API
    const response = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(indexNowData)
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "URLs submitted to IndexNow",
        submitted: urlList
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: "IndexNow submission failed", 
        status: response.status,
        details: errorText
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// 提供IndexNow密钥文件的GET路由 (冗余验证，主要应使用静态文件)
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: {
      "Content-Type": "text/plain"
    }
  });
} 