"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginScreen } from "@/components/shared-ui";
import { usePrototype } from "@/components/prototype-state";
import type { Role } from "@/lib/mock-data";

export function LoginForm() {
  const { role, signIn } = usePrototype();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("aluno");
  const [error, setError] = useState("");

  useEffect(() => {
    if (role) {
      router.replace(role === "aluno" ? "/aluno" : "/monitor");
    }
  }, [role, router]);

  const login = () => {
    const message = signIn(email, selectedRole);
    if (message) {
      setError(message);
      return;
    }
    router.push(selectedRole === "aluno" ? "/aluno" : "/monitor");
  };

  return (
    <LoginScreen
      email={email}
      setEmail={setEmail}
      selectedRole={selectedRole}
      setSelectedRole={setSelectedRole}
      error={error}
      onLogin={login}
    />
  );
}
