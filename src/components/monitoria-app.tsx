import { useState } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Send,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Role = "aluno" | "monitor";
type StudentView = "inicio" | "acervo" | "nova" | "duvidas" | "aulas";
type MonitorView = "inicio" | "fila" | "aulas";
type QuestionStatus = "Pendente" | "Em atendimento" | "Respondida";

type Question = {
  id: number;
  title: string;
  subject: string;
  topic: string;
  status: QuestionStatus;
  monitor?: string;
  author?: string;
  time?: string;
};

type ArchiveItem = {
  id: number;
  subject: string;
  topic: string;
  title: string;
  preview: string;
  answer: string;
};

type ClassSession = {
  id: number;
  subject: string;
  topic: string;
  date: string;
  time: string;
  room: string;
  description: string;
  people: number;
  min: number;
  monitor: string;
};

const initialClasses: ClassSession[] = [
  { id: 1, subject: "Algoritmos", topic: "Recursão e análise de complexidade", date: "30 set", time: "14h", room: "Sala 12 — Bloco B", description: "Revisão dos casos base e da pilha de chamadas com exercícios guiados.", people: 7, min: 5, monitor: "Carlos" },
  { id: 2, subject: "Banco de Dados", topic: "Normalização e modelagem relacional", date: "02 out", time: "16h", room: "Laboratório 3", description: "Da primeira à terceira forma normal com exemplos de modelagem.", people: 3, min: 5, monitor: "Ana" },
];

const initialQuestions: Question[] = [
  { id: 1, title: "Como funciona a recursão na busca binária?", subject: "Algoritmos", topic: "Recursão", status: "Em atendimento", monitor: "Carlos", author: "Marina", time: "há 18 min" },
  { id: 2, title: "Diferença entre pilha e fila na prática", subject: "Estrutura de Dados", topic: "Estruturas lineares", status: "Pendente", monitor: "Ana", author: "Pedro", time: "há 32 min" },
  { id: 3, title: "Quando usar chave estrangeira?", subject: "Banco de Dados", topic: "Modelagem", status: "Respondida", monitor: "Carlos", author: "Você", time: "ontem" },
  { id: 4, title: "Complexidade do algoritmo de Dijkstra", subject: "Algoritmos", topic: "Grafos", status: "Pendente", monitor: "Carlos", author: "Lucas", time: "há 1h" },
  { id: 5, title: "Normalização até a terceira forma normal", subject: "Banco de Dados", topic: "Normalização", status: "Pendente", monitor: "Ana", author: "Bianca", time: "há 2h" },
];

const initialArchive: ArchiveItem[] = [
  { id: 1, subject: "Algoritmos", topic: "Recursão", title: "Como identificar o caso base em uma função recursiva?", preview: "Toda função recursiva precisa de uma condição de parada...", answer: "O caso base é a condição que pode ser resolvida diretamente, sem uma nova chamada recursiva. Comece identificando a menor entrada possível do problema e garanta que cada chamada se aproxime dela." },
  { id: 2, subject: "Estrutura de Dados", topic: "Árvores", title: "Qual a diferença entre árvore binária e AVL?", preview: "A AVL mantém o balanceamento automaticamente após inserções...", answer: "Uma árvore binária limita cada nó a dois filhos. A AVL adiciona uma regra de balanceamento: a diferença de altura entre as subárvores nunca pode ultrapassar 1." },
  { id: 3, subject: "Banco de Dados", topic: "SQL", title: "INNER JOIN e LEFT JOIN retornam os mesmos dados?", preview: "O INNER JOIN retorna apenas correspondências; o LEFT...", answer: "Não. INNER JOIN mantém somente linhas com correspondência nas duas tabelas. LEFT JOIN mantém todas as linhas da tabela à esquerda, preenchendo ausências com NULL." },
  { id: 4, subject: "Algoritmos", topic: "Grafos", title: "Como escolher entre BFS e DFS?", preview: "BFS é adequada para menores caminhos sem peso, enquanto...", answer: "Use BFS para explorar por níveis e encontrar menores caminhos em grafos sem peso. Use DFS para explorar profundamente, detectar ciclos e realizar ordenação topológica." },
];

const studentNav = [
  { id: "inicio" as const, label: "Visão geral", icon: LayoutDashboard },
  { id: "acervo" as const, label: "Buscar no acervo", icon: Search },
  { id: "nova" as const, label: "Nova dúvida", icon: CircleHelp },
  { id: "duvidas" as const, label: "Minhas dúvidas", icon: MessageSquareText },
  { id: "aulas" as const, label: "Aulas coletivas", icon: Users },
];

const monitorNav = [
  { id: "inicio" as const, label: "Visão geral", icon: LayoutDashboard },
  { id: "fila" as const, label: "Fila de atendimento", icon: Inbox },
  { id: "aulas" as const, label: "Aulas coletivas", icon: Users },
];

function StatusBadge({ status }: { status: QuestionStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", status === "Respondida" && "bg-success-soft text-success", status === "Em atendimento" && "bg-info-soft text-info", status === "Pendente" && "bg-warning-soft text-warning")}>
      <span className="size-1.5 rounded-full bg-current" />{status}
    </span>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center"><Inbox className="mx-auto size-8 text-muted-foreground/60" /><p className="mt-3 font-semibold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{text}</p></div>;
}

export function MonitoriaApp() {
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("aluno");
  const [loginError, setLoginError] = useState("");
  const [studentView, setStudentView] = useState<StudentView>("inicio");
  const [monitorView, setMonitorView] = useState<MonitorView>("inicio");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [archive, setArchive] = useState(initialArchive);
  const [classes, setClasses] = useState(initialClasses);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const handleLogin = () => {
    if (!email.trim().toLowerCase().endsWith("@ic.ufal.br")) {
      setLoginError("Use seu e-mail institucional com final @ic.ufal.br.");
      return;
    }
    setRole(selectedRole);
    setLoginError("");
  };

  if (!role) {
    return <LoginScreen email={email} setEmail={setEmail} selectedRole={selectedRole} setSelectedRole={setSelectedRole} error={loginError} onLogin={handleLogin} />;
  }

  const logout = () => {
    setRole(null);
    setEmail("");
    setStudentView("inicio");
    setMonitorView("inicio");
    setMobileMenu(false);
  };

  const nav = role === "aluno" ? studentNav : monitorNav;
  const currentView = role === "aluno" ? studentView : monitorView;
  const setView = (id: string) => {
    if (role === "aluno") setStudentView(id as StudentView);
    else setMonitorView(id as MonitorView);
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {toast && <div role="status" className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-2 rounded-md border border-success/20 bg-card px-4 py-3 text-sm font-medium shadow-elevated"><CheckCircle2 className="size-5 text-success" />{toast}</div>}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-card/95 px-4 backdrop-blur lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu ? <X /> : <Menu />}</Button>
        <Brand compact />
      </header>
      <div className="flex min-h-screen">
        <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r bg-card p-5 transition-transform lg:translate-x-0", mobileMenu ? "translate-x-0" : "-translate-x-full")}>
          <div className="mb-8 flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Fechar menu"><X /></Button></div>
          <div className="mb-6 rounded-md bg-primary-soft p-3">
            <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><UserRound className="size-4" /></div><div><p className="text-sm font-semibold">{role === "aluno" ? "Gabriel Souza" : "Carlos Lima"}</p><p className="text-xs text-muted-foreground">{role === "aluno" ? "Aluno • Computação" : "Monitor • Algoritmos"}</p></div></div>
          </div>
          <nav className="flex-1 space-y-1" aria-label="Menu principal">
            {nav.map((item) => <Button key={item.id} variant="ghost" onClick={() => setView(item.id)} className={cn("h-11 w-full justify-start px-3", currentView === item.id && "bg-primary-soft text-primary hover:bg-primary-soft")}><item.icon />{item.label}</Button>)}
          </nav>
          <div className="border-t pt-4"><Button variant="ghost" onClick={logout} className="w-full justify-start text-muted-foreground hover:text-destructive"><LogOut />Sair da conta</Button></div>
        </aside>
        {mobileMenu && <button className="fixed inset-0 z-30 bg-overlay lg:hidden" onClick={() => setMobileMenu(false)} aria-label="Fechar menu" />}
        <main className="min-w-0 flex-1 px-4 py-7 lg:ml-72 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-6xl">
            {role === "aluno" ? <StudentArea view={studentView} setView={setStudentView} questions={questions} setQuestions={setQuestions} archive={archive} classes={classes} notify={notify} /> : <MonitorArea view={monitorView} setView={setMonitorView} questions={questions} setQuestions={setQuestions} archive={archive} setArchive={setArchive} classes={classes} setClasses={setClasses} notify={notify} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={cn("flex items-center gap-3", compact && "ml-2")}><div className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground"><GraduationCap className="size-5" /></div><div><p className="font-display text-lg font-bold leading-none">Monitora IC</p>{!compact && <p className="mt-1 text-xs text-muted-foreground">Central de monitoria</p>}</div></div>;
}

function LoginScreen({ email, setEmail, selectedRole, setSelectedRole, error, onLogin }: { email: string; setEmail: (v: string) => void; selectedRole: Role; setSelectedRole: (v: Role) => void; error: string; onLogin: () => void }) {
  const useDemo = (role: Role) => { setSelectedRole(role); setEmail(role === "aluno" ? "aluno@ic.ufal.br" : "monitor@ic.ufal.br"); };
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-primary px-14 py-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="relative z-10 max-w-xl"><div className="mb-6 grid size-14 place-items-center rounded-lg bg-primary-foreground/12"><BookOpen className="size-7" /></div><h1 className="font-display text-5xl font-bold leading-tight">Conhecimento compartilhado, dúvidas resolvidas.</h1><p className="mt-5 max-w-lg text-lg leading-relaxed text-primary-foreground/80">Um espaço para aproximar alunos e monitores e transformar cada resposta em aprendizado para toda a comunidade.</p></div>
        <div className="grid grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-7"><div><strong className="text-2xl">128</strong><p className="text-xs text-primary-foreground/70">dúvidas resolvidas</p></div><div><strong className="text-2xl">8</strong><p className="text-xs text-primary-foreground/70">monitores ativos</p></div><div><strong className="text-2xl">12</strong><p className="text-xs text-primary-foreground/70">disciplinas</p></div></div>
      </section>
      <section className="flex items-center justify-center bg-background px-5 py-10">
        <div className="w-full max-w-md"><div className="mb-9 lg:hidden"><Brand /></div><p className="text-sm font-semibold text-primary">Bem-vindo de volta</p><h2 className="mt-2 font-display text-3xl font-bold">Acesse sua conta</h2><p className="mt-2 text-sm text-muted-foreground">Entre com seu e-mail institucional para continuar.</p>
          <div className="mt-8"><label className="mb-2 block text-sm font-semibold" htmlFor="email">E-mail institucional</label><Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu.nome@ic.ufal.br" className="h-11 bg-card" onKeyDown={(e) => e.key === "Enter" && onLogin()} />{error && <p className="mt-2 text-sm text-destructive">{error}</p>}</div>
          <fieldset className="mt-6"><legend className="mb-2 text-sm font-semibold">Como você deseja entrar?</legend><div className="grid grid-cols-2 gap-3">{(["aluno", "monitor"] as Role[]).map((option) => <button key={option} type="button" onClick={() => setSelectedRole(option)} className={cn("flex h-20 items-center gap-3 rounded-md border bg-card px-4 text-left transition-all", selectedRole === option ? "border-primary ring-2 ring-primary/10" : "hover:border-primary/40")}><span className={cn("grid size-9 place-items-center rounded-md", selectedRole === option ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{option === "aluno" ? <GraduationCap className="size-5" /> : <BookOpen className="size-5" />}</span><span><strong className="block capitalize">{option}</strong><small className="text-muted-foreground">{option === "aluno" ? "Tirar dúvidas" : "Atender alunos"}</small></span></button>)}</div></fieldset>
          <Button onClick={onLogin} className="mt-7 h-11 w-full">Entrar <ChevronRight /></Button>
          <div className="mt-8 rounded-md border bg-card p-4"><p className="text-xs font-semibold uppercase text-muted-foreground">Acesso de demonstração</p><div className="mt-3 grid gap-2 sm:grid-cols-2"><Button variant="outline" size="sm" onClick={() => useDemo("aluno")}>Usar conta de aluno</Button><Button variant="outline" size="sm" onClick={() => useDemo("monitor")}>Usar conta de monitor</Button></div></div>
        </div>
      </section>
    </main>
  );
}

function PageHeader({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">{eyebrow}</p><h1 className="mt-1 font-display text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-muted-foreground">{text}</p></div>{action}</div>;
}

function StatCard({ icon: Icon, label, value, note }: { icon: typeof Inbox; label: string; value: string; note: string }) {
  return <div className="rounded-lg border bg-card p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 font-display text-3xl font-bold">{value}</p></div><span className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary"><Icon className="size-5" /></span></div><p className="mt-3 text-xs text-muted-foreground">{note}</p></div>;
}

function StudentArea({ view, setView, questions, setQuestions, archive, notify }: { view: StudentView; setView: (v: StudentView) => void; questions: Question[]; setQuestions: React.Dispatch<React.SetStateAction<Question[]>>; archive: ArchiveItem[]; notify: (m: string) => void }) {
  if (view === "acervo") return <ArchiveView archive={archive} />;
  if (view === "nova") return <NewQuestion questions={questions} setQuestions={setQuestions} archive={archive} setView={setView} notify={notify} />;
  if (view === "duvidas") return <MyQuestions questions={questions.filter((q) => q.author === "Você")} />;
  if (view === "aulas") return <CollectiveClasses notify={notify} />;
  const mine = questions.filter((q) => q.author === "Você");
  return <><PageHeader eyebrow="Área do aluno" title="Olá, Gabriel!" text="Acompanhe suas dúvidas e encontre respostas rapidamente." action={<Button onClick={() => setView("nova")}><CircleHelp />Nova dúvida</Button>} /><div className="grid gap-4 md:grid-cols-3"><StatCard icon={Clock3} label="Dúvidas em aberto" value={String(mine.filter((q) => q.status !== "Respondida").length)} note="Acompanhamento em tempo real" /><StatCard icon={CheckCircle2} label="Respondidas" value={String(mine.filter((q) => q.status === "Respondida").length)} note="No semestre atual" /><StatCard icon={CalendarCheck} label="Próxima monitoria" value="Qua, 14h" note="Sala 12 • Bloco B" /></div>
    <section className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><div className="rounded-lg border bg-card"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-display text-lg font-bold">Suas dúvidas recentes</h2><p className="text-sm text-muted-foreground">Últimas movimentações</p></div><Button variant="ghost" size="sm" onClick={() => setView("duvidas")}>Ver todas <ChevronRight /></Button></div><div className="divide-y">{mine.map((q) => <div key={q.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{q.title}</p><p className="mt-1 text-xs text-muted-foreground">{q.subject} • {q.monitor ? `Monitor ${q.monitor}` : "Aguardando monitor"}</p></div><StatusBadge status={q.status} /></div>)}</div></div><div className="rounded-lg border bg-primary-soft p-5"><Lightbulb className="size-6 text-primary" /><h2 className="mt-4 font-display text-lg font-bold">Antes de perguntar</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">O acervo reúne respostas de semestres anteriores. Sua dúvida pode já estar resolvida por lá.</p><Button variant="outline" className="mt-5 w-full bg-card" onClick={() => setView("acervo")}><Search />Buscar no acervo</Button></div></section></>;
}

function ArchiveView({ archive }: { archive: ArchiveItem[] }) {
  const [query, setQuery] = useState(""); const [subject, setSubject] = useState("Todas"); const [open, setOpen] = useState<number | null>(null);
  const results = archive.filter((a) => (subject === "Todas" || a.subject === subject) && `${a.title} ${a.topic}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader eyebrow="Conhecimento compartilhado" title="Acervo de dúvidas" text="Consulte respostas revisadas por monitores em semestres anteriores." /><div className="rounded-lg border bg-card p-4"><div className="grid gap-3 md:grid-cols-[1fr_220px]"><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque por dúvida, tema ou palavra-chave" className="h-10 pl-9" /></div><select value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option>Todas</option><option>Algoritmos</option><option>Estrutura de Dados</option><option>Banco de Dados</option></select></div></div><p className="mb-3 mt-6 text-sm font-semibold">{results.length} respostas encontradas</p><div className="space-y-3">{results.map((item) => <article key={item.id} className="rounded-lg border bg-card"><button type="button" className="flex w-full items-start justify-between gap-4 p-5 text-left" onClick={() => setOpen(open === item.id ? null : item.id)}><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">{item.subject}</span><span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{item.topic}</span></div><h2 className="mt-3 font-semibold">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">{item.preview}</p></div><ChevronRight className={cn("mt-1 size-5 shrink-0 text-muted-foreground transition-transform", open === item.id && "rotate-90")} /></button>{open === item.id && <div className="border-t bg-muted/30 p-5"><p className="text-sm font-semibold text-primary">Resposta revisada</p><p className="mt-2 text-sm leading-relaxed">{item.answer}</p></div>}</article>)}</div>{results.length === 0 && <EmptyState title="Nenhuma resposta encontrada" text="Tente buscar por outro termo ou disciplina." />}</>;
}

function NewQuestion({ questions, setQuestions, archive, setView, notify }: { questions: Question[]; setQuestions: React.Dispatch<React.SetStateAction<Question[]>>; archive: ArchiveItem[]; setView: (v: StudentView) => void; notify: (m: string) => void }) {
  const [subject, setSubject] = useState("Algoritmos"); const [topic, setTopic] = useState("Recursão"); const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [resolved, setResolved] = useState<number | null>(null);
  const suggestions = title.length > 8 || description.length > 15 ? archive.filter((a) => a.subject === subject).slice(0, 2) : [];
  const submit = () => { if (!title.trim() || !description.trim()) { notify("Preencha o título e a descrição da dúvida."); return; } const loads = [{ name: "Carlos", count: questions.filter((q) => q.monitor === "Carlos" && q.status !== "Respondida").length }, { name: "Ana", count: questions.filter((q) => q.monitor === "Ana" && q.status !== "Respondida").length }]; loads.sort((a, b) => a.count - b.count); const assignedMonitor = loads[0]?.name ?? "Carlos"; setQuestions((prev) => [{ id: Date.now(), title, subject, topic, status: "Pendente", monitor: assignedMonitor, author: "Você", time: "agora" }, ...prev]); notify(`Dúvida enviada e atribuída ao monitor ${assignedMonitor}.`); setView("duvidas"); };
  if (resolved) { const item = archive.find((a) => a.id === resolved); return <div className="mx-auto max-w-2xl"><div className="rounded-lg border bg-card p-8 text-center"><div className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success"><CheckCircle2 className="size-7" /></div><h1 className="mt-5 font-display text-2xl font-bold">Dúvida resolvida pelo acervo</h1><p className="mt-2 text-sm text-muted-foreground">Nenhum chamado foi aberto para a monitoria.</p><div className="mt-6 rounded-md bg-muted/50 p-5 text-left"><p className="font-semibold">{item?.title}</p><p className="mt-2 text-sm leading-relaxed">{item?.answer}</p></div><Button className="mt-6" onClick={() => setView("inicio")}>Voltar para o início</Button></div></div>; }
  return <><PageHeader eyebrow="Novo atendimento" title="Envie sua dúvida" text="Enquanto você escreve, buscamos respostas parecidas no acervo." /><div className="grid gap-6 lg:grid-cols-[1fr_.82fr]"><div className="rounded-lg border bg-card p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Disciplina<select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal"><option>Algoritmos</option><option>Estrutura de Dados</option><option>Banco de Dados</option></select></label><label className="text-sm font-semibold">Tópico<select value={topic} onChange={(e) => setTopic(e.target.value)} className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 font-normal"><option>Recursão</option><option>Grafos</option><option>Complexidade</option><option>SQL</option></select></label></div><label className="mt-5 block text-sm font-semibold">Título da dúvida<Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 h-10 font-normal" placeholder="Resuma sua dúvida em uma frase" /></label><label className="mt-5 block text-sm font-semibold">Descrição<Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2 min-h-36 font-normal" placeholder="Conte onde você teve dificuldade e o que já tentou..." /></label><div className="mt-6 flex justify-end"><Button onClick={submit}><Send />Enviar para monitoria</Button></div></div><aside><div className="mb-3 flex items-center gap-2"><Sparkles className="size-4 text-primary" /><h2 className="text-sm font-bold">Dúvidas parecidas já solucionadas</h2></div>{suggestions.length ? <div className="space-y-3">{suggestions.map((item, i) => <article key={item.id} className="rounded-lg border bg-card p-5"><div className="flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{item.topic}</span><span className="rounded-full bg-success-soft px-2 py-1 text-xs font-bold text-success">{92 - i * 7}% similar</span></div><h3 className="mt-3 font-semibold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.preview}</p><Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => setResolved(item.id)}><Check />Isso resolveu minha dúvida</Button></article>)}</div> : <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center"><Search className="mx-auto size-7 text-muted-foreground/60" /><p className="mt-3 text-sm font-semibold">Comece a escrever</p><p className="mt-1 text-xs text-muted-foreground">As sugestões aparecerão aqui automaticamente.</p></div>}</aside></div></>;
}

function MyQuestions({ questions }: { questions: Question[] }) {
  return <><PageHeader eyebrow="Acompanhamento" title="Minhas dúvidas" text="Veja o andamento de todos os seus pedidos de ajuda." /><div className="space-y-3">{questions.map((q) => <article key={q.id} className="rounded-lg border bg-card p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-semibold text-primary">{q.subject}</span><span className="text-xs text-muted-foreground">• {q.topic}</span></div><h2 className="mt-2 font-semibold">{q.title}</h2><p className="mt-2 text-xs text-muted-foreground">Atualizada {q.time} {q.monitor && `• Responsável: Monitor ${q.monitor}`}</p></div><StatusBadge status={q.status} /></div></article>)}{questions.length === 0 && <EmptyState title="Você ainda não enviou dúvidas" text="Quando enviar uma pergunta, ela aparecerá aqui." />}</div></>;
}

function CollectiveClasses({ notify }: { notify: (m: string) => void }) {
  const [confirmed, setConfirmed] = useState<number[]>([]); const classes = [{ id: 1, subject: "Algoritmos", topic: "Recursão e análise de complexidade", date: "30 set • 14h", room: "Sala 12 — Bloco B", people: 7, min: 5 }, { id: 2, subject: "Banco de Dados", topic: "Normalização e modelagem relacional", date: "02 out • 16h", room: "A confirmar", people: 3, min: 5 }];
  return <><PageHeader eyebrow="Aprendizado em grupo" title="Aulas coletivas" text="Confirme presença nos encontros organizados pelos monitores." /><div className="grid gap-4 lg:grid-cols-2">{classes.map((item) => { const joined = confirmed.includes(item.id); const count = item.people + (joined ? 1 : 0); const ready = count >= item.min; return <article key={item.id} className="rounded-lg border bg-card p-5"><div className="flex items-start justify-between gap-4"><span className="rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">{item.subject}</span>{ready && <span className="flex items-center gap-1 text-xs font-semibold text-success"><CheckCircle2 className="size-4" />Sala reservada</span>}</div><h2 className="mt-4 font-display text-lg font-bold">{item.topic}</h2><div className="mt-4 space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><CalendarCheck className="size-4" />{item.date}</p><p className="flex items-center gap-2"><Users className="size-4" />{count} confirmados • mínimo {item.min}</p><p className="flex items-center gap-2"><BookOpen className="size-4" />{ready ? item.room : "Sala reservada ao atingir o mínimo"}</p></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${Math.min(100, (count / item.min) * 100)}%` }} /></div><Button variant={joined ? "secondary" : "default"} className="mt-5 w-full" onClick={() => { setConfirmed((p) => joined ? p.filter((id) => id !== item.id) : [...p, item.id]); notify(joined ? "Presença removida." : "Presença confirmada!"); }}>{joined ? <><Check />Presença confirmada</> : "Confirmar presença"}</Button></article>; })}</div></>;
}

function MonitorArea({ view, setView, questions, setQuestions, archive, setArchive, notify }: { view: MonitorView; setView: (v: MonitorView) => void; questions: Question[]; setQuestions: React.Dispatch<React.SetStateAction<Question[]>>; archive: ArchiveItem[]; setArchive: React.Dispatch<React.SetStateAction<ArchiveItem[]>>; notify: (m: string) => void }) {
  const mine = questions.filter((q) => q.monitor === "Carlos" && q.status !== "Respondida");
  if (view === "fila") return <QueueView questions={questions} setQuestions={setQuestions} archive={archive} setArchive={setArchive} notify={notify} />;
  if (view === "aulas") return <MonitorClasses notify={notify} />;
  return <><PageHeader eyebrow="Área do monitor" title="Olá, Carlos!" text="Veja sua carga de atendimento e os itens que precisam de atenção." action={<Button onClick={() => setView("fila")}><Inbox />Abrir fila</Button>} /><div className="grid gap-4 md:grid-cols-3"><StatCard icon={Inbox} label="Atribuídas a você" value={String(mine.length)} note="1 nova desde ontem" /><StatCard icon={CheckCircle2} label="Respondidas" value="24" note="Neste semestre" /><StatCard icon={TrendingUp} label="Carga atual" value={mine.length <= 3 ? "Leve" : "Moderada"} note="Distribuição equilibrada" /></div><div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_.65fr]"><section className="rounded-lg border bg-card"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-display text-lg font-bold">Próximos atendimentos</h2><p className="text-sm text-muted-foreground">Sua fila por ordem de chegada</p></div><Button variant="ghost" size="sm" onClick={() => setView("fila")}>Ver fila <ChevronRight /></Button></div><div className="divide-y">{mine.slice(0, 3).map((q) => <div key={q.id} className="flex items-center gap-4 p-5"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary-soft text-sm font-bold text-primary">{q.author?.[0]}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{q.title}</p><p className="mt-1 text-xs text-muted-foreground">{q.author} • {q.subject} • {q.time}</p></div><ChevronRight className="size-4 text-muted-foreground" /></div>)}</div></section><section className="rounded-lg border border-warning/25 bg-warning-soft p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-warning/15 text-warning"><Sparkles className="size-5" /></span><div><p className="text-xs font-bold uppercase text-warning">Tópico frequente detectado</p><h2 className="mt-1 font-display text-lg font-bold">Recursão</h2></div></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">4 alunos enviaram dúvidas sobre o mesmo tema nos últimos dias.</p><Button variant="outline" className="mt-5 w-full bg-card" onClick={() => setView("aulas")}><Users />Criar aula coletiva</Button></section></div></>;
}

function QueueView({ questions, setQuestions, archive, setArchive, notify }: { questions: Question[]; setQuestions: React.Dispatch<React.SetStateAction<Question[]>>; archive: ArchiveItem[]; setArchive: React.Dispatch<React.SetStateAction<ArchiveItem[]>>; notify: (m: string) => void }) {
  const [tab, setTab] = useState<"mine" | "all">("mine"); const [selected, setSelected] = useState<number | null>(null); const [answer, setAnswer] = useState(""); const [code, setCode] = useState(""); const [publish, setPublish] = useState(true);
  const list = questions.filter((q) => q.status !== "Respondida" && (tab === "all" || q.monitor === "Carlos")); const current = questions.find((q) => q.id === selected);
  const respond = () => { if (!current || !answer.trim()) { notify("Digite uma resposta antes de concluir."); return; } setQuestions((prev) => prev.map((q) => q.id === current.id ? { ...q, status: "Respondida" } : q)); if (publish) setArchive((prev) => [{ id: Date.now(), subject: current.subject, topic: current.topic, title: current.title, preview: answer.slice(0, 90), answer: answer + (code ? `\n\nExemplo de código:\n${code}` : "") }, ...prev]); setSelected(null); setAnswer(""); setCode(""); notify(publish ? "Resposta enviada e publicada no acervo." : "Resposta enviada ao aluno."); };
  const reassign = () => { if (!current) return; setQuestions((prev) => prev.map((q) => q.id === current.id ? { ...q, monitor: "Ana", status: "Pendente" } : q)); setSelected(null); notify("Chamado reatribuído para Ana."); };
  return <><PageHeader eyebrow="Atendimentos" title="Fila de dúvidas" text="Priorize, responda ou reatribua os chamados da disciplina." /><div className="mb-5 inline-flex rounded-md bg-muted p-1"><Button size="sm" variant={tab === "mine" ? "default" : "ghost"} onClick={() => setTab("mine")}>Atribuídas a mim <span className="ml-1 rounded-full bg-primary-foreground/15 px-1.5">{questions.filter((q) => q.monitor === "Carlos" && q.status !== "Respondida").length}</span></Button><Button size="sm" variant={tab === "all" ? "default" : "ghost"} onClick={() => setTab("all")}>Fila geral <span className="ml-1 rounded-full bg-primary-foreground/15 px-1.5">{questions.filter((q) => q.status !== "Respondida").length}</span></Button></div><div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="space-y-3">{list.map((q) => <button type="button" key={q.id} onClick={() => { setSelected(q.id); setQuestions((prev) => prev.map((item) => item.id === q.id && item.status === "Pendente" ? { ...item, status: "Em atendimento" } : item)); }} className={cn("w-full rounded-lg border bg-card p-4 text-left transition-all hover:border-primary/40", selected === q.id && "border-primary ring-2 ring-primary/10")}><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-primary">{q.subject}</span><StatusBadge status={q.status} /></div><p className="mt-3 font-semibold leading-snug">{q.title}</p><p className="mt-2 text-xs text-muted-foreground">{q.author} • {q.time} {tab === "all" && `• Monitor ${q.monitor}`}</p></button>)}{list.length === 0 && <EmptyState title="Fila em dia" text="Não há chamados aguardando atendimento." />}</div><div>{current ? <div className="sticky top-8 rounded-lg border bg-card"><div className="border-b p-5"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary-soft px-2 py-1 text-xs font-semibold text-primary">{current.subject}</span><span className="text-xs text-muted-foreground">{current.topic}</span></div><h2 className="mt-3 font-display text-xl font-bold">{current.title}</h2><p className="mt-2 text-sm text-muted-foreground">Enviada por {current.author} • {current.time}</p></div><div className="p-5"><div className="mb-5 rounded-md bg-muted/50 p-4 text-sm leading-relaxed">Estou tentando entender este assunto, mas não consegui visualizar como as etapas se conectam. Poderia explicar com um exemplo simples?</div><label className="text-sm font-semibold">Sua resposta<Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-2 min-h-32 font-normal" placeholder="Explique o raciocínio passo a passo..." /></label><label className="mt-4 block text-sm font-semibold"><span className="flex items-center gap-2"><Code2 className="size-4" />Bloco de código (opcional)</span><Textarea value={code} onChange={(e) => setCode(e.target.value)} className="mt-2 min-h-24 bg-code font-mono text-code-foreground" placeholder="// Insira um exemplo" /></label><label className="mt-5 flex cursor-pointer items-start gap-3 rounded-md border p-3"><input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} className="mt-0.5 size-4 accent-primary" /><span><strong className="block text-sm">Publicar no acervo geral</strong><small className="text-muted-foreground">A resposta ficará disponível para dúvidas futuras.</small></span></label><div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between"><Button variant="outline" onClick={reassign}><ArrowLeftRight />Reatribuir</Button><Button onClick={respond}><Send />Enviar resposta</Button></div></div></div> : <div className="rounded-lg border border-dashed bg-card px-8 py-20 text-center"><MessageSquareText className="mx-auto size-9 text-muted-foreground/50" /><h2 className="mt-4 font-semibold">Selecione um chamado</h2><p className="mt-1 text-sm text-muted-foreground">A dúvida completa e as opções de resposta aparecerão aqui.</p></div>}</div></div></>;
}

function MonitorClasses({ notify }: { notify: (m: string) => void }) {
  const [created, setCreated] = useState(false);
  return <><PageHeader eyebrow="Automação de encontros" title="Aulas coletivas" text="Transforme tópicos recorrentes em um atendimento para vários alunos." /><div className="rounded-lg border border-warning/25 bg-warning-soft p-6"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-md bg-warning/15 text-warning"><Sparkles className="size-5" /></span><div><p className="text-xs font-bold uppercase text-warning">Tópico frequente detectado</p><h2 className="mt-1 font-display text-xl font-bold">Recursão e casos base</h2><p className="mt-2 text-sm text-muted-foreground">4 dúvidas relacionadas nos últimos 3 dias • Algoritmos</p></div></div>{created ? <span className="flex items-center gap-2 font-semibold text-success"><CheckCircle2 />Aula agendada</span> : <Button onClick={() => { setCreated(true); notify("Aula criada e Sala 12 reservada!"); }}><Users />Converter em aula coletiva</Button>}</div></div>{created && <div className="mt-5 rounded-lg border bg-card p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-md bg-success-soft text-success"><CalendarCheck className="size-5" /></span><div><p className="font-semibold">Aula coletiva agendada</p><p className="text-sm text-muted-foreground">Convites enviados aos alunos interessados.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-md bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Data e horário</p><p className="mt-1 text-sm font-semibold">30 set • 14h</p></div><div className="rounded-md bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Local</p><p className="mt-1 text-sm font-semibold">Sala 12 — Bloco B</p></div><div className="rounded-md bg-muted/50 p-3"><p className="text-xs text-muted-foreground">Convidados</p><p className="mt-1 text-sm font-semibold">4 alunos</p></div></div></div>}</>;
}