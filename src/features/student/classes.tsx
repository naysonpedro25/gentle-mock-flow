import { useState } from "react";
import { BookOpen, CalendarCheck, Check, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClassSession } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function CollectiveClasses({
  classes,
  notify,
}: {
  classes: ClassSession[];
  notify: (m: string) => void;
}) {
  const [confirmed, setConfirmed] = useState<number[]>([]);
  return (
    <>
      <PageHeader
        eyebrow="Aprendizado em grupo"
        title="Aulas coletivas"
        text="Confirme presença nos encontros organizados pelos monitores."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {classes.map((item) => {
          const joined = confirmed.includes(item.id);
          const count = item.people + (joined ? 1 : 0);
          const ready = count >= item.min;
          return (
            <article key={item.id} className="rounded-lg border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                  {item.subject}
                </span>
                {ready && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-success">
                    <CheckCircle2 className="size-4" />
                    Aula confirmada
                  </span>
                )}
              </div>
              <h2 className="mt-4 font-display text-lg font-bold">{item.topic}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CalendarCheck className="size-4" />
                  {item.date} • {item.time}
                </p>
                <p className="flex items-center gap-2">
                  <BookOpen className="size-4" />
                  {item.room}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="size-4" />
                  {count} confirmados • mínimo {item.min} • Monitor {item.monitor}
                </p>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (count / item.min) * 100)}%` }}
                />
              </div>
              <Button
                variant={joined ? "secondary" : "default"}
                className="mt-5 w-full"
                onClick={() => {
                  setConfirmed((p) =>
                    joined ? p.filter((id) => id !== item.id) : [...p, item.id],
                  );
                  notify(joined ? "Presença removida." : "Presença confirmada!");
                }}
              >
                {joined ? (
                  <>
                    <Check />
                    Presença confirmada
                  </>
                ) : (
                  "Confirmar presença"
                )}
              </Button>
            </article>
          );
        })}
      </div>
      {classes.length === 0 && (
        <EmptyState
          title="Nenhuma aula agendada"
          text="Quando um monitor criar uma aula coletiva, ela aparecerá aqui."
        />
      )}
    </>
  );
}
