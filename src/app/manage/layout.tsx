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
import { uploadFile, getPublicUrl } from "@/lib/storage-utils";

export default function AdminSlugLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    projectLeader: "",
    proponents: "",
    dateStarted: "",
    partnerId: "",
  });
  const [documentData, setDocumentData] = useState({
    projectId: "",
    category: "",
    fileName: "",
  });
  const [isCreatingPartner, setIsCreatingPartner] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);

  useEffect(() => {
    fetch("/api/partners")
      .then((res) => res.json())
      .then((data) => setPartners(data));
  }, []);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const handleCreatePartner = async () => {
    setIsCreatingPartner(true);
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
    } finally {
      setIsCreatingPartner(false);
    }
  };

  const handleCreateProject = async () => {
    setIsCreatingProject(true);
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
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleFileUpload = async () => {
    if (
      !selectedFile ||
      !documentData.projectId ||
      !documentData.category ||
      !documentData.fileName
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUploadingDocument(true);
    try {
      // Upload file to Supabase storage with custom file name
      const timestamp = Date.now();
      const fileName = `${timestamp}-${documentData.fileName}.pdf`;
      const filePath = `${documentData.category}/${fileName}`;

      await uploadFile(selectedFile, filePath);
      const fileUrl = getPublicUrl(filePath);

      // Save document details to database
      const response = await fetch("/api/documents/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileUrl,
          category: documentData.category,
          fileName: documentData.fileName,
          projectId: documentData.projectId,
        }),
      });

      if (!response.ok) throw new Error("Failed to save document");

      toast.success("Document uploaded successfully");
      setIsPdfDialogOpen(false);
      setSelectedFile(null);
      setDocumentData({
        projectId: "",
        category: "",
        fileName: "",
      });
    } catch (error) {
      toast.error("Failed to upload document");
      console.error(error);
    } finally {
      setIsUploadingDocument(false);
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
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsPdfDialogOpen(true);
                  }}
                >
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
                      disabled={isCreatingPartner}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreatePartner}
                    disabled={!partnerName.trim() || isCreatingPartner}
                  >
                    {isCreatingPartner ? "Creating..." : "Create Partner"}
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
                      disabled={isCreatingProject}
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
                      disabled={isCreatingProject}
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
                      disabled={isCreatingProject}
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
                      disabled={isCreatingProject}
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
                      disabled={isCreatingProject}
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
                      disabled={isCreatingProject}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateProject}
                    disabled={
                      !projectData.title ||
                      !projectData.partnerId ||
                      isCreatingProject
                    }
                  >
                    {isCreatingProject ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Upload PDF Document</DialogTitle>
                  <DialogDescription>
                    Upload a PDF file and associate it with a project.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pdf-file" className="text-right">
                      PDF File
                    </Label>
                    <Input
                      id="pdf-file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          // Set initial fileName from the uploaded file
                          setDocumentData((prev) => ({
                            ...prev,
                            fileName: file.name.replace(".pdf", ""),
                          }));
                        }
                      }}
                      className="col-span-3"
                      disabled={isUploadingDocument}
                    />
                  </div>

                  {selectedFile && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file-name" className="text-right">
                          File Name
                        </Label>
                        <Input
                          id="file-name"
                          value={documentData.fileName}
                          onChange={(e) =>
                            setDocumentData({
                              ...documentData,
                              fileName: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="Enter file name (without .pdf)"
                          disabled={isUploadingDocument}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category-select" className="text-right">
                          Category
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setDocumentData({
                              ...documentData,
                              category: value,
                            })
                          }
                          value={documentData.category}
                          disabled={isUploadingDocument}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              {[
                                "MOA",
                                "Meetings",
                                "Documents",
                                "Letters",
                                "Certifications",
                                "Reports",
                                "References",
                                "Involved_Personnels",
                                "Trainings_and_Workshops",
                              ].map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.replace(/_/g, " ")}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="project-select" className="text-right">
                          Project
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            setDocumentData({
                              ...documentData,
                              projectId: value,
                            })
                          }
                          value={documentData.projectId}
                          disabled={isUploadingDocument}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Projects</SelectLabel>
                              {projects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleFileUpload}
                    disabled={
                      !selectedFile ||
                      !documentData.projectId ||
                      !documentData.category ||
                      !documentData.fileName ||
                      isUploadingDocument
                    }
                  >
                    {isUploadingDocument ? "Uploading..." : "Upload Document"}
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
