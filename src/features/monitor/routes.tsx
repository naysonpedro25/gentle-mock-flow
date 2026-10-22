"use client";

import { useRouter } from "next/navigation";
import { MonitorDashboard } from "./dashboard";
import { QueueView } from "./queue";
import { MonitorClasses } from "./classes";
import { usePrototype } from "@/components/prototype-state";
import type { MonitorView } from "@/lib/mock-data";

const monitorPaths: Record<MonitorView, string> = {
  inicio: "/monitor",
  fila: "/monitor/fila",
  aulas: "/monitor/aulas",
};

export function MonitorDashboardRoute() {
  const router = useRouter();
  const { questions, setQuestions, archive, setArchive, classes, setClasses, notify } =
    usePrototype();

  return (
    <MonitorDashboard setView={(view) => router.push(monitorPaths[view])} questions={questions} />
  );
}

export function MonitorQueueRoute() {
  const { questions, setQuestions, archive, setArchive, notify } = usePrototype();
  return (
    <QueueView
      questions={questions}
      setQuestions={setQuestions}
      archive={archive}
      setArchive={setArchive}
      notify={notify}
    />
  );
}

export function MonitorClassesRoute() {
  const { classes, setClasses, notify } = usePrototype();
  return <MonitorClasses classes={classes} setClasses={setClasses} notify={notify} />;
}
