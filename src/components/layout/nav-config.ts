import {
  Activity,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Clapperboard,
  Film,
  FileText,
  FolderOpen,
  Home,
  IndianRupee,
  LayoutDashboard,
  ListChecks,
  MapPin,
  NotebookPen,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Phase in docs/IMPLEMENTATION_PLAN.md that builds this module. */
  phase: number;
};

export const globalNav: NavItem[] = [
  { label: "Home", href: "/home", icon: Home, phase: 2 },
  { label: "Projects", href: "/projects", icon: Clapperboard, phase: 2 },
  { label: "People", href: "/people", icon: Users, phase: 3 },
  { label: "Locations", href: "/locations", icon: MapPin, phase: 3 },
  { label: "Settings", href: "/settings", icon: Settings, phase: 2 },
];

/** Project modules in PRD §7 order. `href` is relative to `/projects/[projectId]`. */
export const projectNav: NavItem[] = [
  { label: "Overview", href: "overview", icon: LayoutDashboard, phase: 2 },
  { label: "Script & Scenes", href: "scenes", icon: BookOpen, phase: 3 },
  { label: "Breakdown", href: "breakdown", icon: ListChecks, phase: 4 },
  { label: "Storyboards", href: "storyboards", icon: Film, phase: 4 },
  { label: "Shot Lists", href: "shots", icon: ClipboardList, phase: 4 },
  { label: "Schedule", href: "schedule", icon: CalendarDays, phase: 4 },
  { label: "Cast & Crew", href: "people", icon: Users, phase: 3 },
  { label: "Locations", href: "locations", icon: MapPin, phase: 3 },
  { label: "Budget", href: "budget", icon: IndianRupee, phase: 6 },
  { label: "Call Sheets", href: "call-sheets", icon: FileText, phase: 5 },
  { label: "Daily Reports", href: "reports", icon: NotebookPen, phase: 5 },
  { label: "Files", href: "files", icon: FolderOpen, phase: 7 },
  { label: "Activity", href: "activity", icon: Activity, phase: 7 },
];

/** Mobile bottom nav inside a project prioritises on-set needs (PRD §7). */
export const projectMobileNav = ["overview", "schedule", "call-sheets", "reports"];
export const globalMobileNav = ["/home", "/projects", "/people", "/settings"];

export function projectHref(projectId: string, module: string) {
  return `/projects/${projectId}/${module}`;
}

export function findProjectModule(slug: string) {
  return projectNav.find((item) => item.href === slug);
}
