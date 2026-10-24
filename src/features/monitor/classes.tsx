import { useState } from "react";
import { BookOpen, CalendarCheck, CheckCircle, Users } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatClassDate, formatClassTime } from "@/lib/class-format";
import type { ClassSession } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function MonitorClasses({
  classes,
  setClasses,
  notify,
}: {
  classes: ClassSession[];
  setClasses: React.Dispatch<React.SetStateAction<ClassSession[]>>;
  notify: (message: string) => void;
}) {
  const [subject, setSubject] = useState("Algoritmos");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [min, setMin] = useState("5");

  const create = () => {
    if (!topic.trim() || !date || !time || !room.trim()) {
      notify("Preencha tema, data, horário e sala para criar a aula.");
      return;
    }
    setClasses((previous) => [
      {
        id: Date.now(),
        subject,
        topic: topic.trim(),
        date,
        time,
        room: room.trim(),
        description: description.trim() || "Encontro aberto a todos os alunos da disciplina.",
        people: 0,
        min: Math.max(1, Number(min) || 5),
        monitor: "Carlos",
      },
      ...previous,
    ]);
    setTopic("");
    setDate("");
    setTime("");
    setRoom("");
    setDescription("");
    setMin("5");
    notify("Aula coletiva criada. Os alunos já podem confirmar presença.");
  };

  const mine = classes.filter((item) => item.monitor === "Carlos");

  return (
    <>
      <PageHeader
        eyebrow="Ensino em grupo"
        title="Aulas coletivas"
        text="Organize um encontro aberto e convide alunos com dúvidas parecidas."
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_0.85fr]">
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            create();
          }}
        >
          <div>
            <h2 className="font-display text-lg font-bold">Nova aula coletiva</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A reserva da sala é feita no sistema próprio do instituto.
            </p>
          </div>
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
              Tema da aula
              <Input
                required
                maxLength={120}
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-2 h-11 font-normal"
                placeholder="Ex.: Recursão e casos base"
              />
            </label>
            <label className="text-sm font-semibold">
              Data
              <Input
                required
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-2 h-11 font-normal"
              />
            </label>
            <label className="text-sm font-semibold">
              Horário
              <Input
                required
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="mt-2 h-11 font-normal"
              />
            </label>
            <label className="text-sm font-semibold">
              Sala
              <Input
                required
                maxLength={80}
                value={room}
                onChange={(event) => setRoom(event.target.value)}
                className="mt-2 h-11 font-normal"
                placeholder="Ex.: Sala 12, Bloco B"
              />
            </label>
            <label className="text-sm font-semibold">
              Mínimo de alunos
              <Input
                required
                type="number"
                min={1}
                step={1}
                value={min}
                onChange={(event) => setMin(event.target.value)}
                className="mt-2 h-11 font-normal"
              />
            </label>
          </div>
          <label className="block text-sm font-semibold">
            Descrição (opcional)
            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-24 font-normal"
              placeholder="O que será abordado no encontro?"
            />
          </label>
          <p className="border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            Informe uma sala já reservada no sistema do instituto. A publicação não reserva o
            espaço.
          </p>
          <div className="flex justify-end">
            <Button type="submit">
              <Users aria-hidden="true" />
              Publicar aula
            </Button>
          </div>
        </form>
        <aside>
          <h2 className="mb-3 font-display text-lg font-bold">Aulas que você criou</h2>
          {mine.length ? (
            <div className="divide-y divide-border border-y border-border">
              {mine.map((item) => {
                const ready = item.people >= item.min;
                return (
                  <article key={item.id} className="py-4">
                    <p className="text-sm font-medium text-primary">{item.subject}</p>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-semibold">{item.topic}</h3>
                      {ready && (
                        <span className="flex items-center gap-2 text-xs font-semibold text-success">
                          <CheckCircle aria-hidden="true" />
                          Mínimo atingido
                        </span>
                      )}
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarCheck aria-hidden="true" />
                        {formatClassDate(item.date)} · {formatClassTime(item.time)}
                      </p>
                      <p className="flex items-center gap-2">
                        <BookOpen aria-hidden="true" />
                        {item.room}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users aria-hidden="true" />
                        {item.people} confirmados · mínimo {item.min}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Nenhuma aula criada"
              text="Use o formulário para publicar seu primeiro encontro."
            />
          )}
        </aside>
      </div>
    </>
  );
}
