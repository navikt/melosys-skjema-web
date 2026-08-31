import { createContext, ReactNode, use } from "react";

const SkjemaVersjonContext = createContext<string | undefined>(undefined);

export function SkjemaVersjonProvider({
  versjon,
  children,
}: {
  versjon: string;
  children: ReactNode;
}) {
  return (
    <SkjemaVersjonContext value={versjon}>{children}</SkjemaVersjonContext>
  );
}

export const useSkjemaVersjon = (): string | undefined =>
  use(SkjemaVersjonContext);
