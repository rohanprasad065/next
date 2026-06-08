'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'

const Page = () => {
  const [username, setUsername] = useState('')
  const [usernemeMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [issubmiting, setIsSubmiting] = useState(false)

  const router = useRouter()

  const [debouncedUsername] = useDebounceValue(username, 500)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!debouncedUsername) return

      setIsCheckingUsername(true)
      setUsernameMessage('')

      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        )

        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>

        setUsernameMessage(
          axiosError.response?.data.message ||
            'Error checking username'
        )
      } finally {
        setIsCheckingUsername(false)
      }
    }

    checkUsernameUnique()
  }, [debouncedUsername])

  const onSubmit = async (
    data: z.infer<typeof signUpSchema>
  ) => {
    setIsSubmiting(true)

    try {
      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        data
      )

      toast.success(response.data.message)

      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error('Error signing up:', error)

      const axiosError = error as AxiosError<ApiResponse>

      const errorMessage =
        axiosError.response?.data.message ||
        'Error signing up. Please try again.'

      toast.error(errorMessage)
    } finally {
      setIsSubmiting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Join Mystery Message
          </h1>

          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Field>
            <FieldLabel htmlFor="username">
              Username
            </FieldLabel>

            <Input
              id="username"
              placeholder="username"
              {...form.register('username')}
              onChange={(e) => {
                form.setValue('username', e.target.value)
                setUsername(e.target.value)
              }}
            />

            <div className="text-sm">
              {isCheckingUsername ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <p>{usernemeMessage}</p>
              )}
            </div>

            <FieldError>
              {form.formState.errors.username?.message}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">
              Email
            </FieldLabel>

            <Input
              id="email"
              type="email"
              placeholder="email"
              {...form.register('email')}
            />

            <FieldError>
              {form.formState.errors.email?.message}
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            <Input
              id="password"
              type="password"
              placeholder="password"
              {...form.register('password')}
            />

            <FieldError>
              {form.formState.errors.password?.message}
            </FieldError>
          </Field>

          <Button
            type="submit"
            disabled={
              isCheckingUsername || issubmiting
            }
            className="w-full"
          >
            {issubmiting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Page
 