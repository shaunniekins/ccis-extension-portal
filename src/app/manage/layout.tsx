"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  CircleUserRound,
  FileText,
  FolderClosed,
  Handshake,
  Plus,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AdminSlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    projectLeader: "",
    proponents: "",
    dateStarted: "",
    partnerId: "",
  });

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data));
  }, []);

  const handleCreatePartner = async () => {
    try {
      const response = await fetch("/api/partners/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: partnerName }),
      });

      if (!response.ok) throw new Error("Failed to create partner");

      toast.success("Partner created successfully");
      setIsPartnerDialogOpen(false);
      setPartnerName("");
      // Optionally refresh the page or update the partners list
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create partner");
      console.error(error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch("/api/projects/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error("Failed to create project");

      toast.success("Project created successfully");
      setIsProjectDialogOpen(false);
      setProjectData({
        title: "",
        description: "",
        projectLeader: "",
        proponents: "",
        dateStarted: "",
        partnerId: "",
      });
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    }
  };

  const path = usePathname();
  const pathSegments = path?.split("/").filter(Boolean) || [];
  const lastSegment = pathSegments[pathSegments.length - 1];
  const secondToLastSegment = pathSegments[pathSegments.length - 2];

  const isIdSegment = !isNaN(Number(lastSegment));
  const displaySegment = isIdSegment ? secondToLastSegment : lastSegment;
  const capitalizedSegment =
    displaySegment?.charAt(0).toUpperCase() + displaySegment?.slice(1);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 px-4">
          <div className="flex items-center">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/manage/dashboard">
                    {capitalizedSegment}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {isIdSegment && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{lastSegment}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <Plus />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileText />
                  Insert PDF File
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsProjectDialogOpen(true);
                  }}
                >
                  <FolderClosed />
                  Add New Program / Project
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsPartnerDialogOpen(true);
                  }}
                >
                  <Handshake />
                  Add New Partner
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
              open={isPartnerDialogOpen}
              onOpenChange={setIsPartnerDialogOpen}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Partner</DialogTitle>
                  <DialogDescription>
                    Enter the name of the new partner organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="partner-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="partner-name"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter partner name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreatePartner}
                    disabled={!partnerName.trim()}
                  >
                    Create Partner
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isProjectDialogOpen}
              onOpenChange={setIsProjectDialogOpen}
            >
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Program / Project</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new program or project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="partner-select" className="text-right">
                      Partner
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setProjectData({ ...projectData, partnerId: value })
                      }
                      value={projectData.partnerId}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a partner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Partners</SelectLabel>
                          {partners.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id}>
                              {partner.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={projectData.title}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          title: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={projectData.description}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          description: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="projectLeader" className="text-right">
                      Project Leader
                    </Label>
                    <Input
                      id="projectLeader"
                      value={projectData.projectLeader}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          projectLeader: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="proponents" className="text-right">
                      Proponents
                    </Label>
                    <Input
                      id="proponents"
                      value={projectData.proponents}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          proponents: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateStarted" className="text-right">
                      Date Started
                    </Label>
                    <Input
                      id="dateStarted"
                      type="date"
                      value={projectData.dateStarted}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          dateStarted: e.target.value,
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateProject}
                    disabled={!projectData.title || !projectData.partnerId}
                  >
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size={"icon"} variant={"ghost"} className="rounded-lg">
              <Settings />
            </Button>
            <Button size={"sm"} variant={"ghost"} className="rounded-lg">
              <CircleUserRound />
              <h3 className="text-sm">Hi, Shaun</h3>
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
