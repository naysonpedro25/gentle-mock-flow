import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArchiveItem } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function ArchiveView({ archive }: { archive: ArchiveItem[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Todas");
  const [open, setOpen] = useState<number | null>(null);
  const results = archive.filter(
    (a) =>
      (subject === "Todas" || a.subject === subject) &&
      `${a.title} ${a.topic}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="Conhecimento compartilhado"
        title="Acervo de dúvidas"
        text="Consulte respostas revisadas por monitores em semestres anteriores."
      />
      <div className="rounded-lg border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por dúvida, tema ou palavra-chave"
              className="h-10 pl-9"
            />
          </div>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option>Todas</option>
            <option>Algoritmos</option>
            <option>Estrutura de Dados</option>
            <option>Banco de Dados</option>
          </select>
        </div>
      </div>
      <p className="mb-3 mt-6 text-sm font-semibold">{results.length} respostas encontradas</p>
      <div className="space-y-3">
        {results.map((item) => (
          <article key={item.id} className="rounded-lg border bg-card">
            <button
              type="button"
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
              onClick={() => setOpen(open === item.id ? null : item.id)}
            >
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">
                    {item.subject}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {item.topic}
                  </span>
                </div>
                <h2 className="mt-3 font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.preview}</p>
              </div>
              <ChevronRight
                className={cn(
                  "mt-1 size-5 shrink-0 text-muted-foreground transition-transform",
                  open === item.id && "rotate-90",
                )}
              />
            </button>
            {open === item.id && (
              <div className="border-t bg-muted/30 p-5">
                <p className="text-sm font-semibold text-primary">Resposta revisada</p>
                <p className="mt-2 text-sm leading-relaxed">{item.answer}</p>
              </div>
            )}
          </article>
        ))}
      </div>
      {results.length === 0 && (
        <EmptyState
          title="Nenhuma resposta encontrada"
          text="Tente buscar por outro termo ou disciplina."
        />
      )}
    </>
  );
}
