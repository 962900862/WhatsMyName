"use client";

// import * as Ai from "react-icons/ai"; // Ant Design icons
// import * as Bi from "react-icons/bi"; // Boxicons
// import * as Bs from "react-icons/bs"; // Bootstrap icons

// import * as Md from "react-icons/md"; // Material Design icons
// import * as Pi from "react-icons/pi"; // Phosphor Icons
import * as Ri from "react-icons/ri"; // Remix icons

import { ReactNode } from "react";

// import * as Cg from "react-icons/cg"; // Circum icons
// import * as Ci from "react-icons/ci"; // css.gg
// import * as Di from "react-icons/di"; // Devicons
// import * as Fa from "react-icons/fa"; // Font Awesome icons
// import * as Fa6 from "react-icons/fa6"; // Font Awesome 6 icons
// import * as Fc from "react-icons/fc"; // Flat Color icons
// import * as Fi from "react-icons/fi"; // Feather icons
// import * as Gi from "react-icons/gi"; // Game Icons
// import * as Go from "react-icons/go"; // Github Octicons icons
// import * as Gr from "react-icons/gr"; // Grommet-Icons
// import * as Hi from "react-icons/hi"; // Heroicons
// import * as Hi2 from "react-icons/hi2"; // Heroicons 2
// import * as Im from "react-icons/im"; // IcoMoon Free
// import * as Io from "react-icons/io"; // Ionicons 4
// import * as Io5 from "react-icons/io5"; // Ionicons 5
// import * as Lia from "react-icons/lia"; // Icons8 Line Awesome
import * as Lu from "lucide-react";

// import * as Rx from "react-icons/rx"; // Radix Icons
// import * as Si from "react-icons/si"; // Simple Icons
// import * as Sl from "react-icons/sl"; // Simple Line Icons
// import * as Tb from "react-icons/tb"; // Tabler Icons
// import * as Tfi from "react-icons/tfi"; // Themify Icons
// import * as Ti from "react-icons/ti"; // Typicons
// import * as Vsc from "react-icons/vsc"; // VS Code icons
// import * as Wi from "react-icons/wi"; // Weather icons

// Map of prefixes to icon packages
const iconPackages: Record<string, any> = {
  // Ai,
  // Bs,
  // Bi,
  // Ci,
  // Cg,
  // Di,
  // Fi,
  // Fc,
  // Fa,
  // Fa6,
  // Go,
  // Gi,
  // Gr,
  // Hi,
  // Hi2,
  // Im,
  // Io,
  // Io5,
  // Lia,
  Lu,
  // Md,
  // Pi,
  Ri,
  // Rx,
  // Si,
  // Sl,
  // Tb,
  // Tfi,
  // Ti,
  // Vsc,
  // Wi,
};

// A helper function to find an icon component by its name.
function getIcon(name: string): React.ComponentType<any> | null {
  // First, check a special mapping for short names or overrides.
  // This is useful for icons needed by components like Feature2.
  const shortNameMapping: Record<string, string> = {
    cube: "Cube",
    download: "Download",
    hexagon: "Hexagon",
    info: "Info",
    settings: "Settings",
    zap: "Zap",
    star: "Star",
    rocket: "Rocket",
    code: "Code",
    circle: "Circle",
    shapes: "Shapes",
    building: "Building",
    palette: "Palette",
    ruler: "Ruler",
    compass: "Compass",
    time: "Clock",
    device: "Computer",
    // Timeless Jewel Calculator icons
    gem: "Gem",
    calculator: "Calculator",
    tree: "TreePine",
    search: "Search",
    lightning: "Zap",
    copy: "Copy",
    // Steps icons
    step1: "CircleUser",
    step2: "Target",
    step3: "Hash",
    step4: "Eye",
    // Tax calculator specific icons
    "map-pin": "MapPin",
    "shield-check": "ShieldCheck", 
    "target": "Target",
    "briefcase": "Briefcase",
    "clock": "Clock",
    "refresh": "RefreshCw",
    "lock": "Lock",
    "smartphone": "Smartphone",
    "heart": "Heart",
    "arrow-right": "ArrowRight",
    // React Icons mappings to Lucide icons
    RiBuildingLine: "Building", 
    RiTimeLine: "Clock",
    RiPaletteLine: "Palette",
    RiShapeLine: "Shapes",
    RiEyeLine: "Eye",
    RiDownloadCloud2Line: "DownloadCloud",
    RiTeamLine: "Users",
    RiCheckboxMultipleLine: "ClipboardCheck",
    RiToolsFill: "Wrench",
    RiPlayLine: "Play",
    RiRulerLine: "Ruler",
    RiCompass3Line: "Compass",
    RiDownload2Line: "Download",
    RiCodeLine: "Code",
    RiDeviceLine: "Computer",
    HiOutlineSparkles: "Sparkles",
    MdOutlineBuild: "Wrench",
    RiFocus3Line: "Crosshair",
    RiCheckboxBlankCircleLine: "Circle",
    RiLayoutGridLine: "LayoutGrid",
    RiFullscreenLine: "Maximize",
    RiCalculatorLine: "Calculator",
    RiArticleLine: "FileText",
    RiGlobalLine: "Globe",
    RiPaintBrushLine: "Paintbrush",
    GoArrowRight: "ArrowRight",
    RiTwitterXFill: "Twitter",
    RiGithubFill: "Github",
    RiDiscordFill: "MessageCircle",
    RiMailLine: "Mail",
    RiCalendarLine: "Calendar",
    RiFireLine: "Flame",
    
    // Songless 主题音乐相关图标映射
    RiFlashLine: "Zap",                    // 闪电 -> 快速识别
    RiHeadphoneLine: "Headphones",         // 耳机 -> 音乐界面
    RiMusicLine: "Music",                  // 音乐 -> 音乐线条
    RiTimerLine: "Timer",                  // 计时器 -> 速度挑战
    RiCompassLine: "Compass",              // 指南针 -> 音乐发现
    RiPlayListLine: "ListMusic",           // 播放列表 -> 音乐库
    RiSettings4Line: "Settings",           // 设置 -> 自适应难度
    RiBarChartLine: "BarChart3",           // 柱状图 -> 性能分析
    RiCommunityLine: "Users",              // 社区 -> 用户群体
    RiLineChartLine: "TrendingUp",         // 折线图 -> 分析图表
    RiSpotifyLine: "Music2",               // Spotify -> 音乐2
    RiGamepadLine: "Gamepad2",             // 游戏手柄 -> 游戏模式
    RiAiGenerate: "Brain",                 // AI生成 -> 智能大脑
    RiWifiOffLine: "WifiOff",              // 离线WiFi -> 离线播放
    RiCompassDiscoverLine: "Search",       // 发现指南针 -> 搜索发现
    RiBrainLine: "Brain",                  // 大脑 -> 记忆训练
    RiTrophyLine: "Trophy",                // 奖杯 -> 排行榜
    RiQuestionnaireLine: "HelpCircle",     // 问卷 -> 问答测试
    
    // Missing icons from songless-unlimited-rap page
    RiInfinityLine: "Infinity",            // 无限 -> 无限播放
    RiMicLine: "Mic",                      // 麦克风 -> 音频录制
    RiAlbumLine: "Disc",                   // 专辑 -> 音乐专辑
    RiLightbulbFlashLine: "Lightbulb",     // 灯泡闪光 -> 智能识别
    RiRadarLine: "Radar",                  // 雷达 -> 音乐发现

    // === Emoji 直接映射到 lucide-react 图标 ===
    "⚡": "Zap",         // 闪电
    "🎵": "Music",       // 音符
    "🎤": "Mic",         // 麦克风
    "🎯": "Target",      // 靶心
    "❤️": "Heart",       // 爱心
    "📊": "BarChart3",   // 柱状图
    "🎸": "Music2",      // 吉他 -> 使用Music2图标
    "✨": "Sparkles",    // 闪光
    "🎧": "Headphones",  // 耳机
    "🎮": "Gamepad2",    // 游戏手柄
    "bar-chart": "BarChart",
  };
  
  const mappedIconName = shortNameMapping[name];
  if (mappedIconName && mappedIconName in Lu) {
    // @ts-expect-error - We've already checked that mappedIconName exists in Lu
    const IconComponent = Lu[mappedIconName];
    if (IconComponent) return IconComponent;
  }

  // If not in the map, try the prefix-based lookup (e.g., "LuRocket").
  const prefix = name.slice(0, 2);
  const iconPackage = iconPackages[prefix];
  if (iconPackage) {
    // Assumes the name format is like "LuRocket", so we extract "Rocket".
    const iconName = name.slice(2); 
    const IconComponent = iconPackage[iconName];
    if (IconComponent) {
      return IconComponent;
    }
  }

  // Fallback for direct lucide-react names if no prefix is used (e.g. "Rocket").
  // @ts-expect-error - We're doing a safe check
  const directLucideIcon = Lu[name.charAt(0).toUpperCase() + name.slice(1)];
  if (directLucideIcon) {
    return directLucideIcon;
  }
  
  console.warn(`Icon "${name}" not found, using fallback`);
  // 返回一个简单的 Emoji 或首字母占位符，保证布局不破坏
  return () => <span className="text-xl leading-none">{name}</span>;
}

export default function Icon({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
  [key: string]: any;
}) {
  const IconComponent = getIcon(name);

  if (!IconComponent) {
    // Return null or a fallback icon to prevent crashing.
    return null;
  }

  return <IconComponent className={className} {...props} />;
}
