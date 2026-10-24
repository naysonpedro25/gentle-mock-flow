export type Role = "aluno" | "monitor";

export type StudentView = "inicio" | "acervo" | "nova" | "duvidas" | "aulas";

export type MonitorView = "inicio" | "fila" | "aulas";

export type QuestionStatus = "Pendente" | "Em atendimento" | "Respondida";

export type Question = {
  id: number;
  title: string;
  subject: string;
  topic: string;
  status: QuestionStatus;
  monitor?: string;
  author?: string;
  time?: string;
  description?: string;
};

export type ArchiveItem = {
  id: number;
  subject: string;
  topic: string;
  title: string;
  preview: string;
  answer: string;
};

export type ClassSession = {
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

export const initialClasses: ClassSession[] = [
  {
    id: 1,
    subject: "Algoritmos",
    topic: "Recursão e análise de complexidade",
    date: "2026-10-30",
    time: "14:00",
    room: "Sala 12 — Bloco B",
    description: "Revisão dos casos base e da pilha de chamadas com exercícios guiados.",
    people: 7,
    min: 5,
    monitor: "Carlos",
  },
  {
    id: 2,
    subject: "Banco de Dados",
    topic: "Normalização e modelagem relacional",
    date: "2026-11-02",
    time: "16:00",
    room: "Laboratório 3",
    description: "Da primeira à terceira forma normal com exemplos de modelagem.",
    people: 3,
    min: 5,
    monitor: "Ana",
  },
];

export const initialQuestions: Question[] = [
  {
    id: 1,
    title: "Como funciona a recursão na busca binária?",
    subject: "Algoritmos",
    topic: "Recursão",
    status: "Em atendimento",
    monitor: "Carlos",
    author: "Marina",
    time: "há 18 min",
    description:
      "Estou implementando uma busca binária recursiva e não entendi como atualizar os limites em cada chamada. Como a função sabe quando parar?",
  },
  {
    id: 2,
    title: "Diferença entre pilha e fila na prática",
    subject: "Estrutura de Dados",
    topic: "Estruturas lineares",
    status: "Pendente",
    monitor: "Ana",
    author: "Pedro",
    time: "há 32 min",
    description:
      "Sei que pilhas seguem LIFO e filas seguem FIFO, mas gostaria de entender em que situação real cada uma é mais adequada.",
  },
  {
    id: 3,
    title: "Quando usar chave estrangeira?",
    subject: "Banco de Dados",
    topic: "Modelagem",
    status: "Respondida",
    monitor: "Carlos",
    author: "Você",
    time: "ontem",
    description:
      "Tenho uma tabela de pedidos e outra de clientes. Em quais situações devo relacioná-las usando uma chave estrangeira?",
  },
  {
    id: 4,
    title: "Complexidade do algoritmo de Dijkstra",
    subject: "Algoritmos",
    topic: "Grafos",
    status: "Pendente",
    monitor: "Carlos",
    author: "Lucas",
    time: "há 1h",
    description:
      "Estou analisando Dijkstra e fiquei em dúvida sobre a complexidade quando uso uma fila de prioridade.",
  },
  {
    id: 5,
    title: "Normalização até a terceira forma normal",
    subject: "Banco de Dados",
    topic: "Normalização",
    status: "Pendente",
    monitor: "Ana",
    author: "Bianca",
    time: "há 2h",
    description:
      "Tenho dificuldade para identificar dependências funcionais e decompor uma tabela até a terceira forma normal.",
  },
];

export const initialArchive: ArchiveItem[] = [
  {
    id: 1,
    subject: "Algoritmos",
    topic: "Recursão",
    title: "Como identificar o caso base em uma função recursiva?",
    preview: "Toda função recursiva precisa de uma condição de parada...",
    answer:
      "O caso base é a condição que pode ser resolvida diretamente, sem uma nova chamada recursiva. Comece identificando a menor entrada possível do problema e garanta que cada chamada se aproxime dela.",
  },
  {
    id: 2,
    subject: "Estrutura de Dados",
    topic: "Árvores",
    title: "Qual a diferença entre árvore binária e AVL?",
    preview: "A AVL mantém o balanceamento automaticamente após inserções...",
    answer:
      "Uma árvore binária limita cada nó a dois filhos. A AVL adiciona uma regra de balanceamento: a diferença de altura entre as subárvores nunca pode ultrapassar 1.",
  },
  {
    id: 3,
    subject: "Banco de Dados",
    topic: "SQL",
    title: "INNER JOIN e LEFT JOIN retornam os mesmos dados?",
    preview: "O INNER JOIN retorna apenas correspondências; o LEFT...",
    answer:
      "Não. INNER JOIN mantém somente linhas com correspondência nas duas tabelas. LEFT JOIN mantém todas as linhas da tabela à esquerda, preenchendo ausências com NULL.",
  },
  {
    id: 4,
    subject: "Algoritmos",
    topic: "Grafos",
    title: "Como escolher entre BFS e DFS?",
    preview: "BFS é adequada para menores caminhos sem peso, enquanto...",
    answer:
      "Use BFS para explorar por níveis e encontrar menores caminhos em grafos sem peso. Use DFS para explorar profundamente, detectar ciclos e realizar ordenação topológica.",
  },
];
