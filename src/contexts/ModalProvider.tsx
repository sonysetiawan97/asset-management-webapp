import { useState, type FC, type ReactNode } from "react";
import { ModalContext } from "./ModalContext";
import { Modal } from "@components/Modal";

export const ModalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);
  const [options, setOptions] = useState<{
    title?: string;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
  }>({
    title: "Title",
    footer: null,
    size: "md",
  });

  const openModal = (
    modalContent: ReactNode,
    modalOptions?: {
      title?: string;
      footer?: ReactNode;
      size?: "sm" | "md" | "lg" | "xl";
    }
  ) => {
    setContent(modalContent);
    setOptions(modalOptions ?? {});
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
    setOptions({});
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, content, options }}
    >
      {children}
      <Modal isOpen={isOpen} closeModal={closeModal} {...options}>
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};
