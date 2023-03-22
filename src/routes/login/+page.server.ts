import { JWT_SECRET } from '$env/static/private'
import prisma from '$lib/prisma'
import { fail } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    try {
      const data = await request.formData()
      const email = data.get('email') as string
      const password = data.get('password') as string

      const { id, firstName, lastName } = await prisma.user.findFirstOrThrow({
        where: { email, password },
        select: { id: true, firstName: true, lastName: true },
      })

      cookies.set('jwt', jwt.sign({ id, firstName, lastName }, JWT_SECRET), {
        path: '/',
        secure: false,
      })

      return { success: true }
      // 👆 or, if we're using HTTP headers based auth, we could return the token,
      // and let the client set the header on subsequent requests
    } catch {
      return fail(401, { error: 'Authentication failed' })
    }
  },
}
