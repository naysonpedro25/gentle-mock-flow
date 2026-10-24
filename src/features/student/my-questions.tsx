import { Question } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader, StatusMarker } from "@/components/shared-ui";

export function MyQuestions({
  questions,
  onCreate,
}: {
  questions: Question[];
  onCreate: () => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Acompanhamento"
        title="Minhas dúvidas"
        text="Veja o andamento de todos os seus pedidos de ajuda."
      />
      {questions.length ? (
        <div className="divide-y divide-border border-y border-border">
          {questions.map((q) => (
            <article key={q.id} className="py-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <p className="text-sm font-medium text-primary">
                    {q.subject} · {q.topic}
                  </p>
                  <h2 className="mt-2 font-semibold">{q.title}</h2>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Atualizada {q.time} {q.monitor && `· Responsável: Monitor ${q.monitor}`}
                  </p>
                </div>
                <StatusMarker status={q.status} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div>
          <EmptyState
            title="Você ainda não enviou dúvidas"
            text="Quando enviar uma pergunta, ela aparecerá aqui."
          />
          <Button className="mt-4" onClick={onCreate}>
            Enviar uma dúvida
          </Button>
        </div>
      )}
    </>
  );
}
