"use client";

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, description, className }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  const [isMounted, setIsMounted] = React.useState(false);
  useEffect(() => {
      setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative w-full max-w-lg bg-white rounded-lg shadow-modal animate-slide-up p-6 m-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 id="modal-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          {description && (
            <p id="modal-description" className="text-sm text-neutral-500">
              {description}
            </p>
          )}
        </div>
        
        <div className="mt-4">{children}</div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>,
    document.body
  );
};

export { Modal };
