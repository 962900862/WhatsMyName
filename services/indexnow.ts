/**
 * IndexNow服务 - 用于通知搜索引擎网站内容变更
 * 
 * 此服务提供了向IndexNow API提交URL变更的功能，可以在以下情况使用：
 * 1. 发布新博客文章时
 * 2. 更新现有内容时
 * 3. 删除内容时
 */

// IndexNow密钥 (与API路由中保持一致)
const INDEXNOW_KEY = "5e4f2948e5c04203bdf74342ec92f1f6";

// 环境变量中的API密钥，用于保护内部API调用
const INDEXNOW_SECRET = process.env.INDEXNOW_SECRET || "development_secret";

/**
 * 提交URL变更到IndexNow
 * @param urls 变更的URL数组
 * @returns 提交结果
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<{success: boolean, message: string}> {
  try {
    if (!urls || urls.length === 0) {
      return { success: false, message: "No URLs provided" };
    }
    
    // 使用内部API路由提交URL
    // 这样可以在服务器端和客户端都能使用这个函数
    const apiUrl = `${process.env.NEXT_PUBLIC_WEB_URL || "https://bigbeautifulbillcalculator.org"}/api/indexnow`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        urls,
        secret: INDEXNOW_SECRET
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      return { 
        success: true, 
        message: `Successfully submitted ${urls.length} URL(s) to IndexNow` 
      };
    } else {
      return { 
        success: false, 
        message: result.error || "Failed to submit URLs to IndexNow" 
      };
    }
  } catch (error) {
    console.error("IndexNow submission error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

/**
 * 提交单个URL变更到IndexNow
 * @param url 变更的URL
 * @returns 提交结果
 */
export async function submitUrlToIndexNow(url: string): Promise<{success: boolean, message: string}> {
  return submitUrlsToIndexNow([url]);
} 