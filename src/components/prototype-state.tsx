"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  initialArchive,
  initialClasses,
  initialQuestions,
  type ArchiveItem,
  type ClassSession,
  type Question,
  type Role,
} from "@/lib/mock-data";

type PrototypeState = {
  role: Role | null;
  questions: Question[];
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  archive: ArchiveItem[];
  setArchive: Dispatch<SetStateAction<ArchiveItem[]>>;
  classes: ClassSession[];
  setClasses: Dispatch<SetStateAction<ClassSession[]>>;
  confirmedClassIds: number[];
  setConfirmedClassIds: Dispatch<SetStateAction<number[]>>;
  signIn: (email: string, role: Role) => string | null;
  signOut: () => void;
  notify: (message: string) => void;
  toast: string;
};

const PrototypeContext = createContext<PrototypeState | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);
  const [questions, setQuestions] = useState(initialQuestions);
  const [archive, setArchive] = useState(initialArchive);
  const [classes, setClasses] = useState(initialClasses);
  const [confirmedClassIds, setConfirmedClassIds] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const toastTimeout = useRef<number | null>(null);

  const signIn = useCallback((email: string, selectedRole: Role) => {
    if (!email.trim().toLowerCase().endsWith("@ic.ufal.br")) {
      return "Use seu e-mail institucional com final @ic.ufal.br.";
    }
    setRole(selectedRole);
    return null;
  }, []);

  const signOut = useCallback(() => setRole(null), []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimeout.current !== null) {
      window.clearTimeout(toastTimeout.current);
    }
    toastTimeout.current = window.setTimeout(() => setToast(""), 2800);
  }, []);

  return (
    <PrototypeContext.Provider
      value={{
        role,
        questions,
        setQuestions,
        archive,
        setArchive,
        classes,
        setClasses,
        confirmedClassIds,
        setConfirmedClassIds,
        signIn,
        signOut,
        notify,
        toast,
      }}
    >
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) {
    throw new Error("usePrototype must be used inside PrototypeProvider.");
  }
  return context;
}
