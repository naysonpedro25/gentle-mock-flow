import { useState } from "react";
import { Check, CheckCircle2, Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArchiveItem, Question, StudentView } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared-ui";

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
  setView: (v: StudentView) => void;
  notify: (m: string) => void;
}) {
  const [subject, setSubject] = useState("Algoritmos");
  const [topic, setTopic] = useState("Recursão");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resolved, setResolved] = useState<number | null>(null);
  const suggestions =
    title.length > 8 || description.length > 15
      ? archive.filter((a) => a.subject === subject).slice(0, 2)
      : [];
  const submit = () => {
    if (!title.trim() || !description.trim()) {
      notify("Preencha o título e a descrição da dúvida.");
      return;
    }
    const loads = [
      {
        name: "Carlos",
        count: questions.filter((q) => q.monitor === "Carlos" && q.status !== "Respondida").length,
      },
      {
        name: "Ana",
        count: questions.filter((q) => q.monitor === "Ana" && q.status !== "Respondida").length,
      },
    ];
    loads.sort((a, b) => a.count - b.count);
    const assignedMonitor = loads[0]?.name ?? "Carlos";
    setQuestions((prev) => [
      {
        id: Date.now(),
        title,
        subject,
        topic,
        status: "Pendente",
        monitor: assignedMonitor,
        author: "Você",
        time: "agora",
      },
      ...prev,
    ]);
    notify(`Dúvida enviada e atribuída ao monitor ${assignedMonitor}.`);
    setView("duvidas");
  };
  if (resolved) {
    const item = archive.find((a) => a.id === resolved);
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success">
            <CheckCircle2 className="size-7" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Dúvida resolvida pelo acervo</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Nenhum chamado foi aberto para a monitoria.
          </p>
          <div className="mt-6 rounded-md bg-muted/50 p-5 text-left">
            <p className="font-semibold">{item?.title}</p>
            <p className="mt-2 text-sm leading-relaxed">{item?.answer}</p>
          </div>
          <Button className="mt-6" onClick={() => setView("inicio")}>
            Voltar para o início
          </Button>
        </div>
      </div>
    );
  }
  return (
    <>
      <PageHeader
        eyebrow="Novo atendimento"
        title="Envie sua dúvida"
        text="Enquanto você escreve, buscamos respostas parecidas no acervo."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_.82fr]">
        <div className="rounded-lg border bg-card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Disciplina
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal"
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
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal"
              >
                <option>Recursão</option>
                <option>Grafos</option>
                <option>Complexidade</option>
                <option>SQL</option>
              </select>
            </label>
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Título da dúvida
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 h-10 font-normal"
              placeholder="Resuma sua dúvida em uma frase"
            />
          </label>
          <label className="mt-5 block text-sm font-semibold">
            Descrição
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-36 font-normal"
              placeholder="Conte onde você teve dificuldade e o que já tentou..."
            />
          </label>
          <div className="mt-6 flex justify-end">
            <Button onClick={submit}>
              <Send />
              Enviar para monitoria
            </Button>
          </div>
        </div>
        <aside>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-bold">Dúvidas parecidas já solucionadas</h2>
          </div>
          {suggestions.length ? (
            <div className="space-y-3">
              {suggestions.map((item, i) => (
                <article key={item.id} className="rounded-lg border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">{item.topic}</span>
                    <span className="rounded-full bg-success-soft px-2 py-1 text-xs font-bold text-success">
                      {92 - i * 7}% similar
                    </span>
                  </div>
                  <h3 className="mt-3 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.preview}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setResolved(item.id)}
                  >
                    <Check />
                    Isso resolveu minha dúvida
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
              <Search className="mx-auto size-7 text-muted-foreground/60" />
              <p className="mt-3 text-sm font-semibold">Comece a escrever</p>
              <p className="mt-1 text-xs text-muted-foreground">
                As sugestões aparecerão aqui automaticamente.
              </p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
