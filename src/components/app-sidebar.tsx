import React, { useEffect, useState } from "react";
import { ChevronRight, FolderClosed, Handshake } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data));
  }, []);

  const data = {
    navMain: [
      {
        title: "Extension Programs",
        code: "extension",
        icon: FolderClosed,
        isActive: true,
        items: projects
          .map((project) => ({
            id: project.id,
            title: project.title,
          }))
          .sort((a, b) => a.title.localeCompare(b.title)),
      },
      {
        title: "Partners",
        code: "partner",
        icon: Handshake,
        isActive: true,
        items: partners
          .map((partner) => ({
            id: partner.id,
            title: partner.name,
          }))
          .sort((a, b) => a.title.localeCompare(b.title)),
      },
    ],
  };

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/manage/dashboard">
                <span className="font-semibold">CCIS Extension Portal</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger asChild>
                      <span className="font-medium text-xs uppercase cursor-pointer">
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight
                          className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
                        />
                      </span>
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    {item.items?.length ? (
                      <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="truncate">
                              <a
                                href={`/manage/${item.code}/${subItem.id}`}
                                className="block truncate w-full"
                                title={subItem.title}
                              >
                                {subItem.title}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    ) : null}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
