"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const AuthModal = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();
  
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  });
  
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose();
    }
  }
  
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);
    
    try {
      if (authMode === 'register') {
        const { error } = await supabaseClient.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.name
            }
          }
        });
        
        if (error) {
          toast.error(error.message);
          return;
        }
        
        toast.success('Conta criada com sucesso!');
        router.refresh();
        onClose();
      } else {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });
        
        if (error) {
          toast.error(error.message);
          return;
        }
        
        toast.success('Login realizado com sucesso!');
        router.refresh();
        onClose();
      }
    } catch (error) {
      toast.error('Algo deu errado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const onGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
    } catch (error) {
      toast.error('Algo deu errado com o login do Google.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  }
  
  return (
    <Modal
      title={authMode === 'login' ? 'Entrar' : 'Criar conta'}
      description={authMode === 'login' ? 'Faça login na sua conta' : 'Crie uma nova conta'}
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        {authMode === 'register' && (
          <Input
            id="name"
            label="Nome"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
        )}
        <Input
          id="email"
          label="Email"
          type="email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="password"
          label="Senha"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="w-full"
        >
          {authMode === 'login' ? 'Entrar' : 'Criar conta'}
        </Button>
      </form>
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm">
          {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            onClick={toggleAuthMode}
            className="text-green-500 ml-2 hover:underline"
            disabled={isLoading}
          >
            {authMode === 'login' ? 'Criar conta' : 'Entrar'}
          </button>
        </div>
      </div>
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-black px-2 text-gray-500">
            Ou continue com
          </span>
        </div>
      </div>
      <Button
        onClick={onGoogleLogin}
        disabled={isLoading}
        className="w-full mt-4 bg-white text-black hover:bg-gray-200"
      >
        <FaGoogle className="mr-2" />
        Google
      </Button>
    </Modal>
  );
}

export default AuthModal;
