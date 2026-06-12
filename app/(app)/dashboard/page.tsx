'use client'

import MessageCard from '@/components/ui/MessageCard'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { User } from 'next-auth'

function UserDashboard() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [isSwitchLoading, setIsSwitchLoading] =
    React.useState<boolean>(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  })

  const { register, watch, setValue } = form

  const acceptMessage = watch('acceptMessage')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter(
        (message) => message._id.toString() !== messageId
      )
    )
  }

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)

    try {
      const response = await axios.get(
        '/api/accept-messages'
      )

      setValue(
        'acceptMessage',
        response.data.isAcceptMessage
      )
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ||
          'Something went wrong'
      )
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true)
      setIsSwitchLoading(true)

      try {
        const response =
          await axios.get<ApiResponse>(
            '/api/accept-messages'
          )

        setMessages(response.data.messages || [])

        if (refresh) {
          toast.success(response.data.message)
        }
      } catch (error) {
        const axiosError =
          error as AxiosError<ApiResponse>

        toast.error(
          axiosError.response?.data.message ||
            'Something went wrong'
        )
      } finally {
        setIsSwitchLoading(false)
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (!session?.user) return

    fetchMessages()
    fetchAcceptMessage()
  }, [
    session,
    setValue,
    fetchMessages,
    fetchAcceptMessage,
  ])

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true)

    try {
      const response =
        await axios.post<ApiResponse>(
          '/api/accept-messages',
          {
            acceptMessage: !acceptMessage,
          }
        )

      setValue(
        'acceptMessage',
        !acceptMessage
      )

      toast.success(response.data.message)
    } catch (error) {
      const axiosError =
        error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ||
          'Something went wrong'
      )
    } finally {
      setIsSwitchLoading(false)
    }
  }

const username = (session?.user as User)?.username

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : ''

  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)

    toast.success(
      'Profile URL copied to clipboard'
    )
  }

  if (!session?.user) {
    return <div>Please login</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">
        User Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy Your Unique Link
        </h2>

        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />

          <Button onClick={copyToClipboard}>
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessage')}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />

        <span className="ml-2">
          Accept Messages:{' '}
          {acceptMessage ? 'On' : 'Off'}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id.toString()}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default UserDashboard