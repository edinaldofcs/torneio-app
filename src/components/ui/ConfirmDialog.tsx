"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title = "Confirmação",
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
          <Dialog.Title className="text-xl font-bold mb-2">{title}</Dialog.Title>
          <Dialog.Description className="text-gray-700 mb-4">{message}</Dialog.Description>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
              onClick={onConfirm}
            >
              Confirmar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
