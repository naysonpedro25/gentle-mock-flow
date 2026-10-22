"use client";

import { useRouter } from "next/navigation";
import { StudentDashboard } from "./dashboard";
import { ArchiveView } from "./archive";
import { NewQuestion } from "./new-question";
import { MyQuestions } from "./my-questions";
import { CollectiveClasses } from "./classes";
import { usePrototype } from "@/components/prototype-state";
import type { StudentView } from "@/lib/mock-data";

const studentPaths: Record<StudentView, string> = {
  inicio: "/aluno",
  acervo: "/aluno/acervo",
  nova: "/aluno/nova-duvida",
  duvidas: "/aluno/duvidas",
  aulas: "/aluno/aulas",
};

export function StudentDashboardRoute() {
  const router = useRouter();
  const { questions } = usePrototype();

  return (
    <StudentDashboard setView={(view) => router.push(studentPaths[view])} questions={questions} />
  );
}

export function StudentArchiveRoute() {
  const { archive } = usePrototype();
  return <ArchiveView archive={archive} />;
}

export function NewQuestionRoute() {
  const router = useRouter();
  const { questions, setQuestions, archive, notify } = usePrototype();

  return (
    <NewQuestion
      questions={questions}
      setQuestions={setQuestions}
      archive={archive}
      setView={(view) => router.push(studentPaths[view])}
      notify={notify}
    />
  );
}

export function MyQuestionsRoute() {
  const { questions } = usePrototype();
  return <MyQuestions questions={questions.filter((question) => question.author === "Você")} />;
}

export function StudentClassesRoute() {
  const { classes, notify } = usePrototype();
  return <CollectiveClasses classes={classes} notify={notify} />;
}
