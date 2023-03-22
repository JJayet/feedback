import { users } from '$lib/trpc/routes/users'
import { feedbacks } from '$lib/trpc/routes/feedbacks'
import { t } from '$lib/trpc/t'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

export const router = t.router({
  feedbacks,
  users,
})

export type Router = typeof router

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>
export type RouterOutputs = inferRouterOutputs<Router>
