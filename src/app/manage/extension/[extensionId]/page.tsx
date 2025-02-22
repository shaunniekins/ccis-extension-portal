"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatDate } from "@/lib/compUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Document {
  id: string;
  fileName: string;
  fileUrl: string;
  category: string;
}

export default function ExtensionId() {
  const [projectData, setProjectData] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const path = usePathname();
  const pathSegments = path?.split("/").filter(Boolean) || [];
  const lastSegment = pathSegments[pathSegments.length - 1];

  const tabs = [
    "MOA",
    "Meetings",
    "Documents",
    "Letters",
    "Certifications",
    "Reports",
    "References",
    "Involved Personnels",
    "Trainings and Workshops",
  ];

  const currentTab = searchParams.get("tab") || "MOA";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    setSelectedDocument(null);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    fetch(`/api/projects/${lastSegment}`)
      .then((res) => res.json())
      .then((data) => setProjectData(data));
  }, [lastSegment]);

  useEffect(() => {
    if (projectData?.id) {
      fetch(`/api/projects/${projectData.id}/documents`)
        .then((res) => res.json())
        .then((data) => setDocuments(data));
    }
  }, [projectData?.id]);

  const filteredDocuments = documents.filter(
    (doc) => doc.category === currentTab.replace(" ", "_")
  );

  return (
    <div className="h-full w-full flex flex-col p-4 bg-muted/50 rounded-lg shadow-[0_0_0_1px_hsl(var(--sidebar-border))]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{projectData?.title}</h3>
          <div className="flex flex-col text-sm">
            <div>{projectData?.description}</div>
            <div>{projectData?.projectLeader}</div>
            <div>{projectData?.proponents}</div>
            <div>{projectData?.partner.name}</div>

            <div>
              Timeframe: {formatDate(projectData?.dateStarted)} -{" "}
              {formatDate(projectData?.dateCompletion)}
            </div>
          </div>
        </div>

        <div className="mr-4">
          {projectData?.id && (
            <QRCodeSVG
              value={`/manage/extension/${projectData.id}`}
              size={128}
            />
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className="flex-1 data-[state=active]:flex data-[state=active]:flex-col"
            >
              <div className="flex items-stretch gap-6 h-full">
                <div className="flex flex-col w-80 bg-background rounded-lg border">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Lists of {tab}</h3>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="divide-y">
                      {filteredDocuments.map((doc) => (
                        <button
                          key={doc.id}
                          className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors ${
                            selectedDocument?.id === doc.id
                              ? "bg-muted"
                              : "bg-transparent"
                          }`}
                          onClick={() => setSelectedDocument(doc)}
                        >
                          {doc.fileName}
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div className="flex-1 bg-background rounded-lg border">
                  {selectedDocument ? (
                    <iframe
                      src={selectedDocument.fileUrl}
                      className="w-full h-full rounded-lg"
                      title={selectedDocument.fileName}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      Select a document to view
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
