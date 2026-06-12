'use client'

import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'

type MessageCardProps = {
  message: Message
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({
  message,
  onMessageDelete,
}: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const messageId = String(message._id)

      const response = await axios.delete<ApiResponse>(
        `/api/messages/${messageId}`
      )

      toast.success(response.data.message)

      onMessageDelete(messageId)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast.error(
        axiosError.response?.data.message ||
          'Failed to delete message'
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Anonymous Message</CardTitle>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone.
                  This message will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <CardDescription>
          {new Date(
            message.createdAt
          ).toLocaleString()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p>{message.content}</p>
      </CardContent>
    </Card>
  )
}

export default MessageCard