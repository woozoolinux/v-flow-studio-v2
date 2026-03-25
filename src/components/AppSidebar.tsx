import { Flame, ShoppingBag, Flag, Layers, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type CategoryKey = "정치" | "쇼핑" | "국뽕" | "일반";

const categories: { title: CategoryKey; icon: typeof Flame; active: boolean }[] = [
  { title: "정치", icon: Flame, active: true },
  { title: "쇼핑", icon: ShoppingBag, active: true },
  { title: "국뽕", icon: Flag, active: false },
  { title: "일반", icon: Layers, active: false },
];

interface AppSidebarProps {
  selected: CategoryKey;
  onSelect: (cat: CategoryKey) => void;
}

export function AppSidebar({ selected, onSelect }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClick = (cat: typeof categories[0]) => {
    if (!cat.active) {
      setShowComingSoon(true);
    } else {
      onSelect(cat.title);
    }
  };

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-foreground">
                  V-Flow AI
                </span>
                <span className="text-[11px] text-muted-foreground">
                  콘텐츠 자동화 엔진
                </span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
              카테고리
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {categories.map((cat) => (
                  <SidebarMenuItem key={cat.title}>
                    <SidebarMenuButton
                      onClick={() => handleClick(cat)}
                      className={`transition-all duration-200 ${
                        selected === cat.title && cat.active
                          ? "bg-accent text-accent-foreground font-semibold"
                          : "hover:bg-muted/60"
                      } ${!cat.active ? "opacity-60" : ""}`}
                    >
                      <cat.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{cat.title}</span>}
                      {!collapsed && !cat.active && (
                        <span className="ml-auto text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog open={showComingSoon} onOpenChange={setShowComingSoon}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              업데이트 예정
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed">
              해당 카테고리는 현재 개발 중이며, 곧 업데이트될 예정입니다.
              <br />
              더 나은 경험을 위해 열심히 준비 중이니 조금만 기다려주세요! 🚀
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button variant="outline" onClick={() => setShowComingSoon(false)}>
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
