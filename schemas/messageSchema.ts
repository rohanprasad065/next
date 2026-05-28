import {z} from 'zod';
export const messageSchema = z.object({
    content: z.string().min(1, "Message content cannot be empty").max(1000, "Message content must be at most 1000 characters"),
})