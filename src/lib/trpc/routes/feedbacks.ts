import prisma from '$lib/prisma'
import { auth } from '$lib/trpc/middleware/auth'
import { logger } from '$lib/trpc/middleware/logger'
import { t } from '$lib/trpc/t'
import { z } from 'zod'

export const feedbacks = t.router({
  // save: t.procedure
  //   .use(logger)
  //   .use(auth) // 👈 use auth middleware
  //   .input(
  //     z.object({
  //       id: z.string().nullable(),
  //       title: z.string(),
  //       // price: z.custom<DecimalJsLike>(),
  //       price: z.string(),
  //       excerpt: z.string().nullable(),
  //       authorId: z.string(),
  //       storeIds: z.array(z.string()),
  //     })
  //   )
  //   .mutation(async ({ input: { id, storeIds, ...rest }, ctx: { userId } }) => {
  //     if (id) {
  //       await prisma.book.update({
  //         data: {
  //           ...rest,
  //           stores: { connect: storeIds.map((id) => ({ id })) },
  //           updatedByUserId: userId,
  //         },
  //         where: { id },
  //       })
  //     } else {
  //       await prisma.book.create({
  //         data: {
  //           ...rest,
  //           stores: { connect: storeIds.map((id) => ({ id })) },
  //           updatedByUserId: userId,
  //         },
  //       })
  //     }
  //   }),
})
