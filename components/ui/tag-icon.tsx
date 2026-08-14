import type { ReactElement } from "react";
import {
  Accessibility,
  BarChart3,
  Blocks,
  Frame,
  Palette,
  Braces,
  Boxes,
  Brush,
  Code2,
  Compass,
  Database,
  FileCode2,
  Film,
  Gauge,
  GitBranch,
  Globe,
  Image as ImageIcon,
  Languages,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Lightbulb,
  MessageCircle,
  MousePointerClick,
  PenTool,
  Search,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Type,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps a skill/stack/service tag to a lucide icon.
 *
 * Keys are matched case-insensitively against the tag text, longest key first, so
 * "Adobe Photoshop" beats a bare "Adobe" and "Mobile App Design" beats "Design".
 * Anything unmatched renders no icon rather than a meaningless generic one — a
 * wrong icon is worse than none, because it implies a category that is not there.
 */
const MAP: Record<string, LucideIcon> = {
  // Design tools
  figma: Palette,
  framer: Frame,
  "adobe xd": PenTool,
  "adobe photoshop": ImageIcon,
  "adobe premiere pro": Film,
  canva: Brush,

  // UI/UX
  "ux research": Compass,
  wireframing: LayoutTemplate,
  prototyping: MousePointerClick,
  "design systems": Boxes,
  "usability testing": Accessibility,
  "responsive web design": LayoutGrid,
  "mobile app design": Smartphone,
  "mobile design": Smartphone,
  "visual identity": Sparkles,
  "web design": LayoutGrid,
  "design system": Boxes,
  "user flows": Workflow,
  "web & mobile ui": Smartphone,
  typography: Type,

  // Development
  html: FileCode2,
  css: Braces,
  javascript: Code2,
  java: Code2,
  wordpress: Globe,
  "git & github": GitBranch,
  supabase: Database,
  "no-code (framer)": Blocks,
  "no-code development (framer)": Blocks,
  "framer builds": Frame,
  "site migration": Share2,
  "cms setup": Database,
  "c# development": Code2,
  chatbots: MessageCircle,
  "data analysis": BarChart3,

  // Marketing
  "search engine optimization": Search,
  "seo research": Search,
  seo: Search,
  "social media marketing": Share2,
  "video editing": Film,
  "content creation": PenTool,

  // Languages
  tamil: Languages,
  english: Languages,

  // Soft skills
  leadership: Users,
  teamwork: Users,
  creativity: Lightbulb,
  "problem solving": Lightbulb,
  "risk management": ShieldCheck,
  "client communication": MessageCircle,

  // Services
  "landing pages": LayoutTemplate,
  "multi-page sites": Layers,
  "responsive build": Gauge,
  handover: Share2,
};

const KEYS = Object.keys(MAP).sort((a, b) => b.length - a.length);

export function tagIcon(tag: string): LucideIcon | null {
  const t = tag.toLowerCase().trim();
  if (MAP[t]) return MAP[t];
  const hit = KEYS.find((k) => t.includes(k));
  return hit ? MAP[hit] : null;
}

/**
 * Returns the icon element for a tag, or null when there is no confident match.
 *
 * A plain function rather than a component: selecting a component *reference* during
 * render trips `react-hooks/static-components`, and the rule is right — React cannot
 * reconcile a component whose identity changes between renders. Returning an element
 * has no such problem.
 *
 * Icons are decorative; the tag text beside them carries the meaning.
 */
export function renderTagIcon(tag: string, size = 13): ReactElement | null {
  const Icon = tagIcon(tag);
  if (!Icon) return null;
  return (
    <Icon aria-hidden size={size} strokeWidth={1.6} className="shrink-0 opacity-70" />
  );
}
