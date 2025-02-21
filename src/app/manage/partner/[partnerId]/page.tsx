"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getStatus } from "@/lib/compUtils";

export default function PartnerId() {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [partnerName, setPartnerName] = useState<string>("");

  const router = useRouter();
  const path = usePathname();
  const pathSegments = path?.split("/").filter(Boolean) || [];
  const lastSegment = pathSegments[pathSegments.length - 1];

  useEffect(() => {
    fetch(`/api/projects/byPartner/${lastSegment}`)
      .then((res) => res.json())
      .then((data) => {
        setProjectsData(data);
        if (data.length > 0) {
          setPartnerName(data[0].partner.name);
        }
      });
  }, [lastSegment]);

  // useEffect(() => {
  //   console.log("projectsData: ", projectsData);
  // }, [projectsData]);

  return (
    <div className="h-full w-full flex flex-col p-4 bg-muted/50 rounded-lg shadow-[0_0_0_1px_hsl(var(--sidebar-border))]">
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          List of Projects by {partnerName}
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Title</TableHead>
            <TableHead className="text-center">Description</TableHead>
            <TableHead className="text-center">Project Leader</TableHead>
            <TableHead className="text-center">Proponents</TableHead>
            <TableHead className="text-center">Date Started</TableHead>
            <TableHead className="text-center">Date Completed</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectsData.map((project) => (
            <TableRow
              key={project.id}
              className="cursor-pointer"
              onClick={() => router.push(`/manage/extension/${project.id}`)}
            >
              <TableCell className="text-center">
                {project.title || "-"}
              </TableCell>
              <TableCell className="text-center">
                {project.description || "-"}
              </TableCell>
              <TableCell className="text-center">
                {project.projectLeader || "-"}
              </TableCell>
              <TableCell className="text-center">
                {project.proponents || "-"}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(project.dateStarted)}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(project.dateCompletion)}
              </TableCell>
              <TableCell className="text-center">
                <div
                  className={`${
                    getStatus(project.dateCompletion) === "Completed"
                      ? "text-green-600 bg-green-100"
                      : "text-yellow-600 bg-yellow-100"
                  } text-center p-2 rounded-lg`}
                >
                  {getStatus(project.dateCompletion)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
