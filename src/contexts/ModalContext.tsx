import { createContext, type ReactNode } from "react";

interface ModalOptions {
  title?: string;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

interface ModalContextType {
  isOpen: boolean;
  openModal: (content: ReactNode, options?: ModalOptions) => void;
  closeModal: () => void;
  content: ReactNode | null;
  options: ModalOptions;
}

export const ModalContext = createContext<ModalContextType | null>(null);
