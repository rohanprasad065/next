"use client";
import React from 'react' 
import { toast } from 'sonner'  
import {  useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { verifySchema } from '@/schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'
import axios , { AxiosError }from 'axios'
import { Controller } from "react-hook-form"

import {
  Field,
  FieldError,
  
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApiResponse } from '@/types/ApiResponse'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams()
    const form = useForm<z.infer<typeof verifySchema>>({
  resolver: zodResolver(verifySchema),
  defaultValues: {
    code: '',
  },
})
    
      const onSubmit = async (data:z.infer<typeof verifySchema>) => {
        try {
           const response =  await axios.post(`/api/verify-code`, {
                username: params.username,
               code: data.code
            })
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            console.error('Error verifying code:', error)
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(
                axiosError.response?.data.message ||
                  'Error verifying code'
              )
              
        }
      }
  return (
    <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="space-y-6"
>
  <Controller
    name="code"
    control={form.control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor={field.name}>
          Verification Code
        </FieldLabel>

        <Input
          {...field}
          id={field.name}
          placeholder="Enter verification code"
          aria-invalid={fieldState.invalid}
        />

        {fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        )}
      </Field>
    )}
  />

  <Button type="submit">
    Verify
  </Button>
</form>
  );
}


export default VerifyAccount