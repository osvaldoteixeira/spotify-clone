import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TbPlaylist } from 'react-icons/tb';
import { AiOutlinePlus } from 'react-icons/ai';

interface LibraryProps {
  className?: string;
}

const Library: React.FC<LibraryProps> = ({
  className
}) => {
  const onClick = () => {
    // Será implementado posteriormente com a autenticação
  };

  return (
    <div className={twMerge(`
      flex
      flex-col
      h-full
      bg-neutral-900
      p-4
      rounded-lg
    `, className)}>
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="inline-flex items-center gap-x-2">
          <TbPlaylist size={26} className="text-neutral-400" />
          <p className="text-neutral-400 font-medium text-md">Sua Biblioteca</p>
        </div>
        <AiOutlinePlus 
          onClick={onClick}
          size={20}
          className="
            text-neutral-400
            cursor-pointer
            hover:text-white
            transition
          "
        />
      </div>
      <div className="flex flex-col gap-y-2 mt-4 px-3">
        <div className="text-neutral-400 text-sm">
          Nenhuma música adicionada ainda.
        </div>
      </div>
    </div>
  );
};

export default Library;
