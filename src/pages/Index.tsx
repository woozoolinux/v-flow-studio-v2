import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, type CategoryKey } from "@/components/AppSidebar";
import { PoliticsHub } from "@/components/PoliticsHub";
import { ShoppingHub } from "@/components/ShoppingHub";

const Index = () => {
  const [activeTab, setActiveTab] = useState<CategoryKey>("정치");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar selected={activeTab} onSelect={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b border-border/60 px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-3" />
            <span className="text-sm font-medium text-muted-foreground">
              V-Flow AI · 콘텐츠 제작 자동화
            </span>
          </header>
          <main className="flex-1 p-6 lg:p-8">
            {activeTab === "정치" && <PoliticsHub />}
            {activeTab === "쇼핑" && <ShoppingHub />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
