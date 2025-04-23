"use client";

import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors;
  disabled?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  id,
  label,
  register,
  errors,
  disabled,
  required,
  className,
  type = "text",
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-white mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        disabled={disabled}
        ref={ref}
        {...register && register(id, { required })}
        className={twMerge(`
          flex 
          w-full 
          rounded-md 
          bg-neutral-700
          border
          border-transparent
          px-3 
          py-3 
          text-sm 
          file:border-0 
          file:bg-transparent 
          file:text-sm 
          file:font-medium 
          placeholder:text-neutral-400
          disabled:cursor-not-allowed 
          disabled:opacity-50
          focus:outline-none
        `,
          errors && errors[id] && "border-rose-500",
          className
        )}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
