import { useState } from "react";
import { ArrowsLeftRight, Code, PaperPlaneTilt } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ArchiveItem, Question } from "@/lib/mock-data";
import { EmptyState, PageHeader, StatusMarker } from "@/components/shared-ui";

export function QueueView({
  questions,
  setQuestions,
  archive,
  setArchive,
  notify,
}: {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  archive: ArchiveItem[];
  setArchive: React.Dispatch<React.SetStateAction<ArchiveItem[]>>;
  notify: (m: string) => void;
}) {
  const [tab, setTab] = useState<"mine" | "all">("mine");
  const [selected, setSelected] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [publish, setPublish] = useState(true);
  const list = questions.filter(
    (q) => q.status !== "Respondida" && (tab === "all" || q.monitor === "Carlos"),
  );
  const current = questions.find((q) => q.id === selected);
  const respond = () => {
    if (!current || !answer.trim()) {
      notify("Digite uma resposta antes de concluir.");
      return;
    }
    setQuestions((prev) =>
      prev.map((q) => (q.id === current.id ? { ...q, status: "Respondida" } : q)),
    );
    if (publish)
      setArchive((prev) => [
        {
          id: Date.now(),
          subject: current.subject,
          topic: current.topic,
          title: current.title,
          preview: answer.slice(0, 90),
          answer: answer + (code ? `\n\nExemplo de código:\n${code}` : ""),
        },
        ...prev,
      ]);
    setSelected(null);
    setAnswer("");
    setCode("");
    notify(publish ? "Resposta enviada e publicada no acervo." : "Resposta enviada ao aluno.");
  };
  const reassign = () => {
    if (!current) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === current.id ? { ...q, monitor: "Ana", status: "Pendente" } : q)),
    );
    setSelected(null);
    notify("Chamado reatribuído para Ana.");
  };
  const mineCount = questions.filter(
    (question) => question.monitor === "Carlos" && question.status !== "Respondida",
  ).length;
  const allCount = questions.filter((question) => question.status !== "Respondida").length;

  return (
    <>
      <PageHeader
        eyebrow="Atendimentos"
        title="Fila de dúvidas"
        text="Priorize, responda ou reatribua os chamados da disciplina."
      />
      <div
        className="mb-5 flex gap-6 border-b border-border"
        role="group"
        aria-label="Filtrar fila"
      >
        <Button
          aria-pressed={tab === "mine"}
          className={cn(
            "h-11 rounded-none border-b-2 border-transparent px-0 text-muted-foreground",
            tab === "mine" && "border-primary text-primary",
          )}
          variant="ghost"
          onClick={() => setTab("mine")}
        >
          Atribuídas a mim <span className="tabular-nums">{mineCount}</span>
        </Button>
        <Button
          aria-pressed={tab === "all"}
          className={cn(
            "h-11 rounded-none border-b-2 border-transparent px-0 text-muted-foreground",
            tab === "all" && "border-primary text-primary",
          )}
          variant="ghost"
          onClick={() => setTab("all")}
        >
          Fila geral <span className="tabular-nums">{allCount}</span>
        </Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="divide-y divide-border border-y border-border">
          {list.map((q) => (
            <button
              type="button"
              key={q.id}
              aria-pressed={selected === q.id}
              onClick={() => {
                setSelected(q.id);
                setQuestions((prev) =>
                  prev.map((item) =>
                    item.id === q.id && item.status === "Pendente"
                      ? { ...item, status: "Em atendimento" }
                      : item,
                  ),
                );
              }}
              className={cn(
                "w-full py-4 text-left transition-colors hover:text-primary",
                selected === q.id && "text-primary",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">
                  {q.subject} · {q.topic}
                </span>
                <StatusMarker status={q.status} />
              </div>
              <p className="mt-2 font-semibold leading-snug">{q.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {q.author} · {q.time} {tab === "all" && `· Monitor ${q.monitor}`}
              </p>
            </button>
          ))}
          {list.length === 0 && (
            <EmptyState
              title="Fila em dia"
              text={
                tab === "mine"
                  ? "Você não tem dúvidas aguardando atendimento."
                  : "Não há chamados aguardando atendimento."
              }
            />
          )}
        </div>
        <div>
          {current ? (
            <div className="sticky top-8">
              <div className="border-b border-border pb-5">
                <p className="text-sm font-medium text-primary">
                  {current.subject} · {current.topic}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold">{current.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enviada por {current.author} · {current.time}
                </p>
              </div>
              <div className="py-5">
                <p className="mb-5 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {current.description ||
                    "O aluno ainda não adicionou uma descrição detalhada para esta dúvida."}
                </p>
                <label className="text-sm font-semibold">
                  Sua resposta
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="mt-2 min-h-32 font-normal"
                    placeholder="Explique o raciocínio passo a passo..."
                  />
                </label>
                <label className="mt-4 block text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <Code aria-hidden="true" />
                    Bloco de código (opcional)
                  </span>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-2 min-h-24 bg-code font-mono text-code-foreground"
                    placeholder="// Insira um exemplo"
                  />
                </label>
                <label className="mt-5 flex cursor-pointer items-start gap-3 border-y border-border py-3">
                  <input
                    type="checkbox"
                    checked={publish}
                    onChange={(e) => setPublish(e.target.checked)}
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <span>
                    <strong className="block text-sm">Publicar no acervo geral</strong>
                    <small className="text-muted-foreground">
                      Outros alunos poderão consultar.
                    </small>
                  </span>
                </label>
                <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <Button variant="outline" onClick={reassign}>
                    <ArrowsLeftRight aria-hidden="true" />
                    Reatribuir
                  </Button>
                  <Button onClick={respond}>
                    <PaperPlaneTilt aria-hidden="true" />
                    Enviar resposta
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Escolha uma dúvida"
              text="Selecione um chamado na fila para ler a descrição e escrever uma resposta."
            />
          )}
        </div>
      </div>
    </>
  );
}
