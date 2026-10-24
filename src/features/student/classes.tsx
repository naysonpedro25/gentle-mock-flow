import {
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle as CheckCircle2,
  Users,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { formatClassDate, formatClassTime } from "@/lib/class-format";
import type { ClassSession } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function CollectiveClasses({
  classes,
  confirmed,
  setConfirmed,
  notify,
}: {
  classes: ClassSession[];
  confirmed: number[];
  setConfirmed: React.Dispatch<React.SetStateAction<number[]>>;
  notify: (m: string) => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Aprendizado em grupo"
        title="Aulas coletivas"
        text="Confirme presença nos encontros organizados pelos monitores."
      />
      <div className="divide-y divide-border border-y border-border">
        {classes.map((item) => {
          const joined = confirmed.includes(item.id);
          const count = item.people + (joined ? 1 : 0);
          const ready = count >= item.min;
          return (
            <article
              key={item.id}
              className="grid gap-5 py-5 md:grid-cols-[minmax(0,1fr)_12rem] md:items-center"
            >
              <div>
                <p className="text-sm font-semibold text-primary">{item.subject}</p>
                <h2 className="mt-1 font-display text-lg font-bold">{item.topic}</h2>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarCheck aria-hidden="true" />
                    {formatClassDate(item.date)} · {formatClassTime(item.time)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BookOpen aria-hidden="true" />
                    {item.room}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users aria-hidden="true" />
                    {count} confirmados · mínimo {item.min} · Monitor {item.monitor}
                  </span>
                </div>
                <div
                  className="mt-4 h-1 overflow-hidden bg-muted"
                  role="progressbar"
                  aria-label={`Confirmações para ${item.topic}`}
                  aria-valuemin={0}
                  aria-valuemax={item.min}
                  aria-valuenow={Math.min(count, item.min)}
                >
                  <div
                    className="h-full bg-primary transition-[width] duration-300 ease-out"
                    style={{ width: `${Math.min(100, (count / item.min) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                {ready && (
                  <span className="flex items-center gap-2 text-sm font-semibold text-success">
                    <CheckCircle2 aria-hidden="true" />
                    Mínimo atingido
                  </span>
                )}
                <Button
                  type="button"
                  variant={joined ? "secondary" : "default"}
                  aria-pressed={joined}
                  className="w-full md:w-auto"
                  onClick={() => {
                    setConfirmed((current) =>
                      joined ? current.filter((id) => id !== item.id) : [...current, item.id],
                    );
                    notify(joined ? "Presença removida." : "Presença confirmada.");
                  }}
                >
                  {joined ? (
                    <>
                      <Check aria-hidden="true" />
                      Presença confirmada
                    </>
                  ) : (
                    "Confirmar presença"
                  )}
                </Button>
              </div>
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
