import { createFileRoute } from "@tanstack/react-router";
import { MonitoriaApp } from "@/components/monitoria-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Monitora IC — Central de Monitoria" },
      {
        name: "description",
        content: "Central acadêmica para tirar dúvidas e organizar atendimentos de monitoria do Instituto de Computação.",
      },
      { property: "og:title", content: "Monitora IC — Central de Monitoria" },
      {
        property: "og:description",
        content: "Dúvidas, atendimentos e aulas coletivas de monitoria em um só lugar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MonitoriaApp,
});