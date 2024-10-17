import { createError, eventHandler, getRequestHeader, readBody } from 'h3'
import { verify } from 'jsonwebtoken'
import { SECRET } from './login.post'

export default eventHandler(async (event) => {
  const body = await readBody<{ refreshToken: string }>(event)
  const authorizationHeader = getRequestHeader(event, 'Authorization')


  if (!body.refreshToken || !authorizationHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized, missing refreshToken or Authorization header'
    })
  }

  const previousrefreshToken = body.refreshToken


  const decoded = verify(previousrefreshToken, SECRET)
  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized, refreshToken cannot be verified'
    })
  }


  const response = await fetch('http://localhost:8000/api/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: previousrefreshToken }),
  })

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Token refresh failed'
    })
  }


  const data = await response.json()

  const { access,refresh } = data
  const accessToken= access
  const refreshToken= refresh

  return {
    token: {
      accessToken,
      refreshToken
    }
  }
})