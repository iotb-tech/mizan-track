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
  dismiss,
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
    function handleClose(e: Event | KeyboardEvent) {
      setIsOpen(false);
    }

    function lightDismiss(e: Event) {
      const { target } = e;
      if (target instanceof Element && target.nodeName === "DIALOG") {
        handleClose(e);
      }
    }

    function closeOnEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose(e);
      }
    }

    if (dismiss) {
      dialog?.addEventListener("click", lightDismiss);
    }

    dialog?.addEventListener("keydown", closeOnEscape);

    return () => {
      if (dismiss) {
        dialog?.removeEventListener("click", lightDismiss);
      }
      dialog?.removeEventListener("keydown", closeOnEscape);
    };
  }, [setIsOpen, dismiss]);
  return <dialog ref={dialogRef} className="m-auto p-6 backdrop-blur-3xl overflow-hidden  rounded-xl">{children}</dialog>;
}
