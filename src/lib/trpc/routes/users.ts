import prisma from '$lib/prisma'
import { auth } from '$lib/trpc/middleware/auth'
import { logger } from '$lib/trpc/middleware/logger'
import { t } from '$lib/trpc/t'
import { z } from 'zod'

export const users = t.router({
  list: t.procedure
    .use(logger)
    .input(z.string().optional())
    .query(({ input }) =>
      prisma.user.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              givenFeedbacks: true,
              receivedFeedbacks: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        where: input
          ? {
              OR: [
                { firstName: { contains: input } },
                { lastName: { contains: input } },
              ],
            }
          : undefined,
      })
    ),

  load: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(z.string())
    .query(({ input }) =>
      prisma.user.findUniqueOrThrow({
        where: {
          id: input,
        }
      })
    ),

  loadFeedbacks: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(z.object({search: z.string().optional(), userId: z.string()}))
    .query(({ input }) =>
      prisma.user.findUniqueOrThrow({
        include: { givenFeedbacks: true, receivedFeedbacks: true },
        where: {
          id: input.userId,
          ...(input.search ? {
              OR: [
                { firstAnswer: { contains: input.search } },
                { secondAnswer: { contains: input.search } },
                { thirdAnswer: { contains: input.search } },
                { givenByUser: { firstName: { contains: input.search }, lastName: { contains: input.search } } },
              ],
            }
          : {}),
        }
      })
    ),

  save: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(
      z.object({
        id: z.string().nullable(),
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input: { id, ...rest } }) => {
      if (id) {
        await prisma.user.update({
          data: { ...rest },
          where: { id },
        })
      } else {
        await prisma.user.create({
          data: { ...rest },
        })
      }
    }),
})
