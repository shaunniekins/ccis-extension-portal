import * as React from "react";
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

// This is sample data.
const data = {
  navMain: [
    // {
    //   title: "Dashboard",
    //   url: "#",
    //   icon: LayoutDashboard,
    //   isActive: false,
    //   noItem: true,
    // },
    {
      title: "Extension Programs",
      // url: "extension",
      code: "extension",
      icon: FolderClosed,
      isActive: true,
      items: [
        {
          id: 1,
          title:
            "Adopt an Agency Extension Program - DENR-NGP Information System",
        },
      ].sort((a, b) => a.title.localeCompare(b.title)),
    },
    {
      title: "Partners",
      // url: "extension",
      code: "partner",

      icon: Handshake,
      isActive: true,
      items: [
        {
          id: 1,
          title: "DOT",
        },
        {
          id: 2,
          title: "LOA",
        },
        {
          id: 3,
          title: "ACES",
        },
        {
          id: 4,
          title: "DENR NGP",
        },
        {
          id: 5,
          title: "DepedAgNor DPTPIT",
        },
        {
          id: 6,
          title: "DSWD",
        },
        {
          id: 7,
          title: "BAFE",
        },
        {
          id: 8,
          title: "PNP",
        },
      ].sort((a, b) => a.title.localeCompare(b.title)),
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div> */}

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
                      <span
                        // href={item.url}
                        className="font-medium text-xs uppercase cursor-pointer"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                        {/* ${
                            item.noItem && "invisible"
                          } */}
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
                            <SidebarMenuSubButton
                              asChild
                              className={`${
                                item.code === "extension" && "py-6"
                              }`}
                            >
                              <a href={`/manage/${item.code}/${subItem.id}`}>
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
