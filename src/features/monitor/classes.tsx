import { useState } from "react";
import { BookOpen, CalendarCheck, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassSession } from "@/lib/mock-data";
import { EmptyState, PageHeader } from "@/components/shared-ui";

export function MonitorClasses({
  classes,
  setClasses,
  notify,
}: {
  classes: ClassSession[];
  setClasses: React.Dispatch<React.SetStateAction<ClassSession[]>>;
  notify: (m: string) => void;
}) {
  const [subject, setSubject] = useState("Algoritmos");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [min, setMin] = useState("5");

  const create = () => {
    if (!topic.trim() || !date.trim() || !time.trim() || !room.trim()) {
      notify("Preencha tema, data, horário e sala para criar a aula.");
      return;
    }
    setClasses((prev) => [
      {
        id: Date.now(),
        subject,
        topic: topic.trim(),
        date: date.trim(),
        time: time.trim(),
        room: room.trim(),
        description: description.trim() || "Encontro aberto a todos os alunos da disciplina.",
        people: 0,
        min: Math.max(1, Number(min) || 5),
        monitor: "Carlos",
      },
      ...prev,
    ]);
    setTopic("");
    setDate("");
    setTime("");
    setRoom("");
    setDescription("");
    setMin("5");
    notify("Aula coletiva criada! Os alunos já podem confirmar presença.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Ensino em grupo"
        title="Aulas coletivas"
        text="Crie encontros abertos para vários alunos. A reserva da sala é feita no sistema próprio do instituto — aqui você apenas informa o local."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
        <div className="rounded-lg border bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-bold">Nova aula coletiva</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ao publicar, a aula fica visível para os alunos confirmarem presença.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              Tema da aula
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2 h-10 font-normal"
                placeholder="Ex.: Recursão e casos base"
              />
            </label>
            <label className="text-sm font-semibold">
              Data
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 h-10 font-normal"
                placeholder="Ex.: 05 out"
              />
            </label>
            <label className="text-sm font-semibold">
              Horário
              <Input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 h-10 font-normal"
                placeholder="Ex.: 14h"
              />
            </label>
            <label className="text-sm font-semibold">
              Sala (número e/ou nome)
              <Input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="mt-2 h-10 font-normal"
                placeholder="Ex.: Sala 12 — Bloco B"
              />
            </label>
            <label className="text-sm font-semibold">
              Mínimo de alunos
              <Input
                type="number"
                min={1}
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="mt-2 h-10 font-normal"
              />
            </label>
          </div>
          <label className="mt-5 block text-sm font-semibold">
            Descrição (opcional)
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-24 font-normal"
              placeholder="O que será abordado no encontro..."
            />
          </label>
          <div className="mt-5 rounded-md bg-info-soft p-3 text-xs leading-relaxed text-info">
            A reserva de salas do instituto é feita em outro aplicativo. Aqui você só informa o
            local para os alunos.
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={create}>
              <Users />
              Publicar aula coletiva
            </Button>
          </div>
        </div>
        <aside>
          <h2 className="mb-3 text-sm font-bold">Aulas que você criou</h2>
          <div className="space-y-3">
            {classes
              .filter((c) => c.monitor === "Carlos")
              .map((item) => {
                const ready = item.people >= item.min;
                return (
                  <article key={item.id} className="rounded-lg border bg-card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
                        {item.subject}
                      </span>
                      {ready && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-success">
                          <CheckCircle2 className="size-4" />
                          Mínimo atingido
                        </span>
                      )}
                    </div>
                    <h3 className="mt-3 font-semibold">{item.topic}</h3>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
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
                        {item.people} confirmados • mínimo {item.min}
                      </p>
                    </div>
                  </article>
                );
              })}
            {classes.filter((c) => c.monitor === "Carlos").length === 0 && (
              <EmptyState
                title="Nenhuma aula criada"
                text="Use o formulário ao lado para criar sua primeira aula coletiva."
              />
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
