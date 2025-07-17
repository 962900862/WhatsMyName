# Application Template System

一个高性能、可扩展的应用模板系统，支持基于 i18n 文件的动态路由生成和应用配置。只需添加 i18n JSON 文件即可自动生成新应用页面。

## 🚀 特性

- **动态应用系统**: 只需添加 i18n JSON 文件即可自动生成新应用页面
- **组件化架构**: 清晰的组件分层，按功能和类型分门别类
- **多语言支持**: 完整的国际化支持，支持 10+ 语言
- **SEO 优化**: 自动生成元数据、结构化数据和多语言链接
- **模板系统**: 多种预定义页面模板，支持自定义覆盖
- **性能优化**: 动态导入、缓存机制、代码分割
- **配置生成器**: 可视化应用配置生成器
- **简单易用**: 只需 JSON 配置即可创建完整应用页面

## 📁 项目结构

```
components/
├── core/                    # 核心组件
│   ├── layouts/            # 布局组件
│   │   ├── dashboard/     # 仪表板布局
│   │   └── console/       # 控制台布局
│   ├── navigation/        # 导航组件
│   ├── seo/              # SEO 组件
│   └── providers/        # 提供者组件
├── features/              # 功能组件
│   ├── auth/             # 认证相关
│   ├── analytics/        # 分析统计
│   └── theme/           # 主题相关
├── apps/                # 应用组件
│   ├── generator/       # 生成器类应用
│   ├── calculator/      # 计算器类应用
│   └── utility/         # 实用应用类
├── examples/            # 示例组件
├── blocks/             # 页面区块组件
└── ui/                 # UI 基础组件

lib/
├── workspace-manager.tsx   # 应用管理器
├── workspace-scanner.ts   # 应用扫描器
├── page-builder.ts       # 页面构建器
├── performance.ts        # 性能优化工具
└── legacy-config.tsx     # 遗留配置（兼容性）

i18n/
├── pages/              # 页面翻译文件
│   ├── example-app/    # 示例应用
│   ├── config-generator/ # 配置生成器
│   └── [app-name]/    # 其他应用...
└── messages/          # 通用翻译文件
```

## 🛠️ 快速开始

### 方法 1: 使用配置生成器（推荐）

1. 访问 `/config-generator` 页面
2. 填写应用配置表单
3. 下载生成的 i18n JSON 文件
4. 按照提示创建对应的应用组件

### 方法 2: 手动创建

#### 步骤 1: 创建 i18n 配置

创建 `i18n/pages/my-app/en.json`:

```json
{
  "theme": "light",
  "seo": {
    "title": "My App | Amazing Application for Everyone",
    "description": "A powerful application that helps you achieve amazing results quickly and easily.",
    "keywords": "app, utility, generator, helpful"
  },
  "hero": {
    "title": "My Amazing App",
    "highlight_text": "Amazing App",
    "description": "Create amazing things with our powerful application.<br/>Simple, fast, and effective.",
    "show_happy_users": false,
    "show_badge": false
  },
  "features": {
    "name": "features",
    "title": "Key Features",
    "description": "Everything you need for success.",
    "items": [
      {
        "title": "Easy to Use",
        "description": "Intuitive interface that anyone can master quickly.",
        "icon": "RiUserLine"
      }
    ]
  },
  "category": "utility",
  "template": "standard-tool",
  "featured": true,
  "tags": ["utility", "app", "helpful"]
}
```

#### 步骤 2: 创建应用组件

创建 `components/apps/utility/my-app/index.tsx`:

```tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyApp() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleProcess = () => {
    // 你的应用逻辑
    setResult(`Processed: ${input}`);
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>My Amazing App</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input..."
            />
            <Button onClick={handleProcess} className="w-full">
              Process
            </Button>
            {result && (
              <div className="p-4 bg-muted rounded-lg">
                <p>{result}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
```

#### 步骤 3: 访问你的应用

应用将自动出现在：
- `/my-app` - 应用页面
- `/apps` - 应用列表页面

## 🎨 页面模板

### 可用模板

1. **standard-tool**: 完整的应用页面，包含所有营销区块
2. **minimal-tool**: 精简页面，只包含核心区块
3. **marketing-focused**: 营销重点页面，强调转化
4. **calculator-tool**: 专为计算器应用优化

### 模板区块

每个模板包含不同的页面区块：

- **hero**: 英雄区域（标题、描述）
- **branding**: 品牌区域
- **feature1/feature2/feature3**: 功能特性区域
- **feature**: 功能网格
- **faq**: 常见问题
- **cta**: 行动号召
- **video**: 视频区域

## 🔧 应用分类

### Generator（生成器）
适用于生成内容、图形、代码等的应用
- 示例：圆形生成器、球体生成器、渐变生成器
- 组件路径：`components/apps/generator/`

### Calculator（计算器）
适用于计算、分析数据的应用
- 示例：时光珠宝计算器、数学计算器
- 组件路径：`components/apps/calculator/`

### Utility（实用工具）
适用于各种实用功能的应用
- 示例：文本处理器、配置生成器、格式转换器
- 组件路径：`components/apps/utility/`

## 📈 自动化特性

### 组件查找规则

系统会按以下顺序自动查找应用组件：

1. `components/apps/{category}/{app-id}/index.tsx`
2. `components/apps/{category}/{app-id}.tsx`
3. `components/examples/{app-id}/index.tsx`
4. `components/examples/{app-id}.tsx`
5. `components/examples/ExampleTool.tsx` (默认示例)

### 自动路由生成

- 每个 i18n 配置文件自动生成对应路由
- 支持多语言路由：`/app-name` 和 `/{locale}/app-name`
- 自动生成静态路由以提高性能

### 自动 SEO 优化

- 自动生成元数据和 OpenGraph 标签
- 自动创建多语言 hreflang 链接
- 自动生成结构化数据（JSON-LD）

## 🚀 性能优化

### 已实现的优化

1. **动态导入**: 所有应用组件都使用动态导入
2. **静态生成**: 支持 `generateStaticParams` 预渲染
3. **代码分割**: 按应用类型分割代码
4. **缓存机制**: 智能的应用配置缓存（1分钟）
5. **SEO 优化**: 自动生成元数据和结构化数据
6. **Webpack 优化**: 按组件类型分包

### 缓存机制

- 应用配置缓存时间：1分钟
- 开发环境支持热重载
- 清除缓存：`clearAppCache()`

## 📝 示例应用

项目包含以下示例应用：

- **example-app**: 基础示例应用，展示基本结构
- **config-generator**: 可视化应用配置生成器
- 其他应用（如球体生成器、渐变生成器等）

## 🛠️ 开发工具

### 配置生成器

访问 `/config-generator` 使用可视化界面生成应用配置：

- 基本信息配置
- SEO 内容设置
- 功能特性添加
- FAQ 管理
- 实时预览生成的 JSON

### 调试技巧

1. 检查浏览器控制台错误
2. 使用 `scanAvailableApps()` 查看扫描到的应用
3. 使用 `getAllAppConfigs()` 查看应用配置
4. 检查 i18n 文件格式和路径

## 🚀 部署

### 环境变量

```env
NEXT_PUBLIC_WEB_URL=https://your-domain.com
NEXT_PUBLIC_DEFAULT_THEME=light
NEXT_PUBLIC_LOCALE_DETECTION=true
```

### 构建命令

```bash
npm run build
npm run start
```

## 🔍 故障排除

### 常见问题

1. **应用不显示**: 
   - 检查 i18n 文件路径是否正确
   - 确认 JSON 格式无误
   - 检查 `en.json` 文件是否存在

2. **组件不加载**: 
   - 确认组件文件路径正确
   - 检查组件导出方式
   - 查看控制台错误信息

3. **缓存问题**: 
   - 开发环境重启服务器
   - 生产环境等待缓存过期（1分钟）

## 📄 许可证

MIT License

---

## 快速示例

创建一个简单的颜色选择器应用：

1. 创建 `i18n/pages/color-picker/en.json`
2. 创建 `components/apps/utility/color-picker/index.tsx`
3. 访问 `/color-picker` 查看结果

就是这么简单！系统会自动处理路由、SEO、多语言等所有复杂的配置。

## 📚 新的命名约定

为了让项目更清晰易懂，我们采用了以下命名约定：

### 文件命名
- `workspace-manager.tsx` - 应用管理器（原 dynamic-tools.tsx）
- `workspace-scanner.ts` - 应用扫描器（原 tool-scanner.ts）
- `legacy-config.tsx` - 遗留配置（原 tools.tsx）
- `config-generator` - 配置生成器（原 tool-generator）

### 目录结构
- `components/apps/` - 应用组件（原 components/tools/）
- `/apps` - 应用列表页面（原 /tools）
- `/[app]` - 动态应用路由（原 /[tool]）

### 概念重命名
- **Application** 替代 **Tool** - 更准确描述项目用途
- **Config Generator** 替代 **Tool Generator** - 明确其配置生成功能
- **App Manager** 替代 **Tool Manager** - 统一管理概念

这样的命名更加清晰、专业，便于团队理解和维护。