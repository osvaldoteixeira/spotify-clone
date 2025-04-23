"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children
}) => {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(isOpen);

  React.useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  React.useEffect(() => {
    setShowModal(false);
  }, [pathname]);

  return (
    <Dialog open={showModal} defaultOpen={showModal} onOpenChange={onChange}>
      <DialogContent
        className="
          fixed 
          drop-shadow-md 
          border 
          border-neutral-700 
          top-[50%] 
          left-[50%] 
          max-h-full 
          h-full 
          md:h-auto 
          md:max-h-[85vh] 
          w-full 
          md:w-[90vw] 
          md:max-w-[450px] 
          translate-x-[-50%] 
          translate-y-[-50%] 
          rounded-md 
          bg-neutral-800 
          p-[25px] 
          focus:outline-none
        "
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-bold mb-4">
            {title}
          </DialogTitle>
          <DialogDescription className="mb-5 text-sm leading-normal text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div>
          {children}
        </div>
        <div className="absolute top-[10px] right-[10px]">
          <button
            onClick={() => onChange(false)}
            className="
              text-neutral-400 
              hover:text-white 
              focus:outline-none 
              focus:ring-0
            "
          >
            <IoMdClose size={24} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
