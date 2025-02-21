"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { formatDate } from "@/lib/compUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ExtensionId() {
  const [projectData, setProjectData] = useState<Project | null>(null);
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
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    fetch(`/api/projects/${lastSegment}`)
      .then((res) => res.json())
      .then((data) => setProjectData(data));
  }, [lastSegment]);

  // useEffect(() => {
  //   console.log("projectData: ", projectData);
  // }, [projectData]);

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

      <div className="flex-1">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab.replace("_", " ")}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab} value={tab}>
              Content for {tab.replace("_", " ")}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
