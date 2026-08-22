"use client";

import { useEffect, useRef } from "react";

export function safelyShowModal(dialog: HTMLDialogElement | null) {
  if (dialog && !dialog.open) {
    dialog.showModal();
  }
}

type ModalDialogProps = React.PropsWithChildren & {
  isOpen: boolean;
  dismiss?: boolean;
  setIsOpen: (e: boolean) => void;
};

export function ModalDialog({
  children,
  isOpen,
  dismiss = true,
  setIsOpen,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen) {
      safelyShowModal(dialog);
    } else {
      dialog?.close();
    }

    return () => {
      dialog?.close();
    };
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    function handleClose() {
      setIsOpen(false);
    }

    function lightDismiss(e: MouseEvent) {
      const { target } = e;

      if (target instanceof Element && target.nodeName === "DIALOG") {
        handleClose();
      }
    }

    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }

    if (dismiss) {
      dialog?.addEventListener("click", lightDismiss as EventListener);
    }

    dialog?.addEventListener("keydown", closeOnEscape);

    return () => {
      if (dismiss) {
        dialog?.removeEventListener(
          "click",
          lightDismiss as EventListener
        );
      }

      dialog?.removeEventListener("keydown", closeOnEscape);
    };
  }, [setIsOpen, dismiss]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[min(480px,92vw)] max-w-lg rounded-2xl bg-white p-6 text-gray-900 shadow-2xl backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm outline-none dark:bg-gray-800 dark:text-white"
    >
      {children}
    </dialog>
  );
}