import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Amount must be a number.' })
    .positive({ message: 'Amount must be greater than 0.' }),

  date: z
    .string({ required_error: 'Date is required.' })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format.',
    }),

  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters.' })
    .max(300, { message: 'Description must not be longer than 300 characters.' }),
});
