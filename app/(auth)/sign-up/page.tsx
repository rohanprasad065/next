'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useEffect, useState } from 'react'
import {signInSchema} from "@/schemas/signInSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/"
import { Button } from '@react-email/components'
import { Loader2 } from 'lucide-react'

const page = () => {
  const [username, setUsername] = useState('')
  const [ usernemeMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [issubmiting, setIsSubmiting] = useState(false)

  const router = useRouter();
  const DebouncedUsername = useDebounceValue(username, 500)
  
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',

    },

  })
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (DebouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-username-unique?username=${DebouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'Error checking username')
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()

      
  },[DebouncedUsername])

  const onSubmit = async(data: z.infer<typeof signInSchema>) => {
    setIsSubmiting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-in', data)
      toast.success(response.data.message)
      router.replace(`/verify/${username}`)
      setIsSubmiting(false)
    } catch (error) {
      console.error('Error signing in:', error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message || 'Error signing in. Please try again.'
      toast.error(errorMessage)
      setIsSubmiting(false)
    }



  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
  <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Join Mystery Message
      </h1>

      <p className="mb-4">
        Sign up to start your anonymous adventure
      </p>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField>

          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='username'{...field}
                onChange={(e) => {
                  field.onChange(e)
                  setUsername(e.target.value)
                }
                />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          <FormField>

          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='email'{...field}
                onChange={(e) => {
                  field.onChange(e)
                  setUsername(e.target.value)
                }
                />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          <FormField>

          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input  type="password" placeholder='password'{...field}
                onChange={(e) => {
                  field.onChange(e)
                  setUsername(e.target.value)
                }
                />
              </FormControl>
              <FormMessage />
              </FormItem>
          )}
          />
          <Button type="submit" disabled={isCheckingUsername || issubmiting} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
          {
            issubmiting?(
              <>
              <Loader2 className = "mr-2 h-4 w-4 animate-spin" /> pleas wait
              </>
            ):(
              "Sign In")
          }
          </FormField>
        
      </form>
  
</div>   
  )
}

export default page; 