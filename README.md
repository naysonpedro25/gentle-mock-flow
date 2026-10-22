# Monitora IC

Protótipo client-only de uma central acadêmica para dúvidas e atendimentos de monitoria. Os dados são mantidos em memória e não há serviços externos nem persistência.

## Desenvolvimento

Use Node.js e pnpm:

```sh
pnpm install
pnpm dev
```

## Scripts

- `pnpm dev` inicia o servidor de desenvolvimento.
- `pnpm build` cria a versão de produção.
- `pnpm start` serve a versão de produção.
- `pnpm lint` executa o ESLint.

## Rotas

- `/login` — acesso de demonstração para aluno ou monitor.
- `/aluno` — visão geral do aluno.
- `/aluno/acervo` — busca de respostas anteriores.
- `/aluno/nova-duvida` — envio de uma dúvida.
- `/aluno/duvidas` — acompanhamento das dúvidas enviadas.
- `/aluno/aulas` — aulas coletivas disponíveis.
- `/monitor` — visão geral do monitor.
- `/monitor/fila` — fila de atendimento.
- `/monitor/aulas` — criação de aulas coletivas.

O estado de sessão e os dados de demonstração permanecem apenas em memória; atualizar a página reinicia o protótipo.
