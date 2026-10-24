import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CaretRight,
  Check,
  MagnifyingGlass,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ArchiveItem, Question, StudentView } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function NewQuestion({
  questions,
  setQuestions,
  archive,
  setView,
  notify,
}: {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  archive: ArchiveItem[];
  setView: (view: StudentView) => void;
  notify: (message: string) => void;
}) {
  const [subject, setSubject] = useState("Algoritmos");
  const [topic, setTopic] = useState("Recursão");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resolved, setResolved] = useState<number | null>(null);
  const suggestions = useMemo(() => {
    const terms = [
      ...new Set(`${title} ${description}`.toLowerCase().match(/[a-zá-ú0-9]{3,}/g) ?? []),
    ];
    if (terms.length === 0) return [];

    return archive
      .filter((item) => item.subject === subject)
      .map((item) => {
        const searchable =
          `${item.title} ${item.topic} ${item.preview} ${item.answer}`.toLowerCase();
        return {
          item,
          relevance: terms.filter((term) => searchable.includes(term)).length,
        };
      })
      .filter((entry) => entry.relevance > 0)
      .sort((first, second) => second.relevance - first.relevance)
      .slice(0, 2)
      .map((entry) => entry.item);
  }, [archive, description, subject, title]);

  const submit = () => {
    if (!title.trim() || !description.trim()) {
      notify("Preencha o título e a descrição da dúvida.");
      return;
    }
    const loads = [
      {
        name: "Carlos",
        count: questions.filter(
          (question) => question.monitor === "Carlos" && question.status !== "Respondida",
        ).length,
      },
      {
        name: "Ana",
        count: questions.filter(
          (question) => question.monitor === "Ana" && question.status !== "Respondida",
        ).length,
      },
    ];
    loads.sort((first, second) => first.count - second.count);
    const assignedMonitor = loads[0]?.name ?? "Carlos";
    setQuestions((previous) => [
      {
        id: Date.now(),
        title: title.trim(),
        subject,
        topic,
        status: "Pendente",
        monitor: assignedMonitor,
        author: "Você",
        time: "agora",
        description: description.trim(),
      },
      ...previous,
    ]);
    notify(`Dúvida enviada e atribuída ao monitor ${assignedMonitor}.`);
    setView("duvidas");
  };

  if (resolved !== null) {
    const item = archive.find((entry) => entry.id === resolved);
    return (
      <section className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-success">Resposta do acervo</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em]">
          Talvez isso resolva sua dúvida
        </h1>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
          Nenhum chamado foi criado. Você ainda pode voltar ao formulário se precisar de ajuda.
        </p>
        {item && (
          <article className="mt-7 border-y border-border py-5">
            <p className="text-sm font-medium text-primary">
              {item.subject} · {item.topic}
            </p>
            <h2 className="mt-2 font-semibold">{item.title}</h2>
            <p className="mt-3 max-w-prose whitespace-pre-line text-sm leading-relaxed">
              {item.answer}
            </p>
          </article>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setResolved(null)}>
            <ArrowLeft aria-hidden="true" />
            Voltar à dúvida
          </Button>
          <Button onClick={() => setView("inicio")}>Voltar ao início</Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Novo atendimento"
        title="Envie sua dúvida"
        text="Explique o que está tentando fazer e onde encontrou dificuldade."
        action={
          <Button variant="ghost" onClick={() => setView("inicio")}>
            <ArrowLeft aria-hidden="true" />
            Voltar ao início
          </Button>
        }
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_0.72fr]">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Disciplina
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option>Algoritmos</option>
                <option>Estrutura de Dados</option>
                <option>Banco de Dados</option>
              </select>
            </label>
            <label className="text-sm font-semibold">
              Tópico
              <select
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option>Recursão</option>
                <option>Grafos</option>
                <option>Complexidade</option>
                <option>SQL</option>
              </select>
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Título da dúvida
            <Input
              required
              maxLength={120}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 h-11 font-normal"
              placeholder="Resuma sua dúvida em uma frase"
            />
          </label>
          <label className="block text-sm font-semibold">
            Descrição
            <Textarea
              required
              maxLength={1500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-36 font-normal"
              placeholder="Conte o que tentou e em qual etapa teve dificuldade..."
            />
          </label>
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">Campos obrigatórios</p>
            <Button type="submit">
              <PaperPlaneTilt aria-hidden="true" />
              Enviar para monitoria
            </Button>
          </div>
        </form>
        <aside className="border-t-2 border-primary pt-4 lg:mt-1">
          <h2 className="font-display text-lg font-bold">Respostas que podem ajudar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            As sugestões consideram o texto que você escreveu.
          </p>
          {suggestions.length ? (
            <div className="mt-4 divide-y divide-border border-y border-border">
              {suggestions.map((item) => (
                <article key={item.id} className="py-4">
                  <p className="text-sm font-medium text-primary">
                    {item.subject} · {item.topic}
                  </p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.preview}
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    className="mt-2 h-auto justify-start px-0 py-2"
                    onClick={() => setResolved(item.id)}
                  >
                    Ler resposta
                    <CaretRight aria-hidden="true" />
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 border-y border-border py-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <MagnifyingGlass aria-hidden="true" />
                {title || description
                  ? "Ainda não encontramos uma resposta próxima"
                  : "As sugestões aparecem enquanto você escreve"}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {title || description
                  ? "Você pode enviar a dúvida para um monitor."
                  : "Descreva o assunto e consulte respostas relacionadas antes de enviar."}
              </p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
