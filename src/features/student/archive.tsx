import { useState } from "react";
import { CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ArchiveItem } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function ArchiveView({ archive }: { archive: ArchiveItem[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("Todas as disciplinas");
  const [open, setOpen] = useState<number | null>(null);
  const results = archive.filter(
    (item) =>
      (subject === "Todas as disciplinas" || item.subject === subject) &&
      `${item.title} ${item.topic} ${item.answer}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        eyebrow="Conhecimento compartilhado"
        title="Acervo de dúvidas"
        text="Encontre respostas revisadas por monitores. Pesquise pelo assunto, pela pergunta ou por uma palavra da explicação."
      />
      <div className="grid gap-3 border-y border-border py-4 md:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="relative block">
          <span className="sr-only">Buscar no acervo</span>
          <MagnifyingGlass
            aria-hidden="true"
            className="absolute left-3 top-3 size-5 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pergunta ou palavra-chave"
            className="h-11 pl-10"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por disciplina</span>
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option>Todas as disciplinas</option>
            <option>Algoritmos</option>
            <option>Estrutura de Dados</option>
            <option>Banco de Dados</option>
          </select>
        </label>
      </div>
      <p className="my-5 text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "resposta encontrada" : "respostas encontradas"}
      </p>
      {results.length ? (
        <div className="divide-y divide-border border-y border-border">
          {results.map((item) => {
            const isOpen = open === item.id;
            const answerId = `archive-answer-${item.id}`;
            return (
              <article key={item.id} className="py-1">
                <button
                  type="button"
                  className="flex min-h-20 w-full items-center justify-between gap-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span>
                    <span className="text-sm font-medium text-primary">{item.subject}</span>
                    <span className="mx-2 text-muted-foreground" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-sm text-muted-foreground">{item.topic}</span>
                    <span className="mt-2 block font-semibold">{item.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {item.preview}
                    </span>
                  </span>
                  <CaretRight
                    aria-hidden="true"
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-90 text-primary",
                    )}
                  />
                </button>
                <div
                  id={answerId}
                  hidden={!isOpen}
                  className={cn(
                    "border-t border-border py-5 pl-0 sm:pl-4",
                    isOpen && "answer-reveal",
                  )}
                >
                  <p className="text-sm font-semibold text-primary">Resposta do monitor</p>
                  <p className="mt-2 max-w-prose whitespace-pre-line text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma resposta com esses termos"
          text="Tente outra palavra ou selecione Todas as disciplinas."
        />
      )}
    </>
  );
}
