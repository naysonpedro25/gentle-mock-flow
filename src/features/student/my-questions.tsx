import { Question } from "@/lib/mock-data";
import { EmptyState, PageHeader, StatusBadge } from "@/components/shared-ui";

export function MyQuestions({ questions }: { questions: Question[] }) {
  return (
    <>
      <PageHeader
        eyebrow="Acompanhamento"
        title="Minhas dúvidas"
        text="Veja o andamento de todos os seus pedidos de ajuda."
      />
      <div className="space-y-3">
        {questions.map((q) => (
          <article key={q.id} className="rounded-lg border bg-card p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-primary">{q.subject}</span>
                  <span className="text-xs text-muted-foreground">• {q.topic}</span>
                </div>
                <h2 className="mt-2 font-semibold">{q.title}</h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  Atualizada {q.time} {q.monitor && `• Responsável: Monitor ${q.monitor}`}
                </p>
              </div>
              <StatusBadge status={q.status} />
            </div>
          </article>
        ))}
        {questions.length === 0 && (
          <EmptyState
            title="Você ainda não enviou dúvidas"
            text="Quando enviar uma pergunta, ela aparecerá aqui."
          />
        )}
      </div>
    </>
  );
}
