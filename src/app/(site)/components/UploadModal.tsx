"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/libs/hooks';
import uniqid from 'uniqid';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const UploadModal = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Campos obrigatórios não preenchidos');
        return;
      }

      const uniqueID = uniqid();

      // Upload song
      const { 
        data: songData, 
        error: songError 
      } = await supabaseClient
        .storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (songError) {
        setIsLoading(false);
        return toast.error('Falha ao enviar a música.');
      }

      // Upload image
      const { 
        data: imageData, 
        error: imageError
      } = await supabaseClient
        .storage
        .from('images')
        .upload(`image-${values.title}-${uniqueID}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (imageError) {
        setIsLoading(false);
        return toast.error('Falha ao enviar a imagem.');
      }

      // Create record 
      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path
        });

      if (supabaseError) {
        return toast.error(supabaseError.message);
      }
      
      router.refresh();
      setIsLoading(false);
      toast.success('Música enviada com sucesso!');
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error('Algo deu errado');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Adicionar uma música"
      description="Envie um arquivo MP3"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Título da música"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Autor"
        />
        <div>
          <div className="pb-1">
            Selecione um arquivo de música
          </div>
          <Input
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="song"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">
            Selecione uma imagem
          </div>
          <Input
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Criar
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;
