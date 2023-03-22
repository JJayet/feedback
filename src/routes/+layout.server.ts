import { JWT_SECRET } from '$env/static/private'
import jwt from 'jsonwebtoken'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies }) => {
  try {
    const { firstName, lastName } = jwt.verify(
      cookies.get('jwt') || '',
      JWT_SECRET
    ) as { firstName: string, lastName: string }
    return { isAuthenticated: true, firstName, lastName }
  } catch(e) {
    return { isAuthenticated: false, firstName: '', lastName: '' }
  }
}

