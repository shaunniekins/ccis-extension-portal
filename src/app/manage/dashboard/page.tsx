"use client";

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
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  useEffect(() => {
    console.log("projects: ", projects);
  }, [projects]);

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4 bg-muted/50 rounded-lg shadow-[0_0_0_1px_hsl(var(--sidebar-border))]">
      <div className="bg-gray-200 rounded-lg h-40">graphs here</div>

      <div className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Project Leader</TableHead>
              <TableHead className="text-center">Proponents</TableHead>
              <TableHead className="text-center">Timeframe</TableHead>

              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Partner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="cursor-pointer "
                onClick={() => router.push(`/manage/extension/${project.id}`)}
              >
                <TableCell className="text-center">{project.title}</TableCell>
                <TableCell className="text-center">
                  {project.description}
                </TableCell>
                <TableCell className="text-center">
                  {project.projectLeader}
                </TableCell>
                <TableCell className="text-center">
                  {project.proponents}
                </TableCell>
                <TableCell className="text-center">
                  {formatDate(project.dateStarted)} -{" "}
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
                <TableCell className="text-center">
                  {project.partner.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
