import { createError, eventHandler, readBody } from 'h3'
// import { sign } from 'jsonwebtoken'
// import { resolve } from 'path'

const config = useRuntimeConfig();
export const SECRET = config.private.apiSecret

// export const ACCESS_TOKEN_TTL = 60 * 15

// export interface User {
//   id: string
//   email: string
//   username: string
//   first_name: string
//   last_name: string
// }

// export interface JwtPayload extends User {
//   scope: Array<'test' | 'user'>
//   exp?: number
// }

// interface TokensByUser {
//   access: Map<string, string>
//   refresh: Map<string, string>
// }

// export const tokensByUser: Map<string, TokensByUser> = new Map()


export default eventHandler(async (event) => {
  const credentials = await readBody(event);

  const response = await fetch('http://localhost:8000/api/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials), 
  });
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: 'Unauthorized',
    });
  }

  const responseData = await response.json();


  const { access, refresh } = responseData;

  const accessToken = access
  const refreshToken = refresh

  // const {
  //   id,
  //   email,
  //   username,
  //   first_name,
  //   last_name,
  // } = responseData;

  // const user = {
  //   id: id ,
  //   email:email ,
  //   username:username ,
  //   first_name:first_name ,
  //   last_name:last_name 
  // }

  // const tokenData: JwtPayload = { ...user, scope: ['test', 'user'] }
  // const accessToken = sign(tokenData, SECRET, {
  //   expiresIn: ACCESS_TOKEN_TTL
  // })
  // const refreshToken = sign(tokenData, SECRET, {
  //   expiresIn: 60 * 60 * 24
  // })


  //change to redis
  //  const userTokens: TokensByUser = tokensByUser.get(username) ?? {
  //   access: new Map(),
  //   refresh: new Map()
    // expiresAt: new Map()
  // }

  // const expiryTime = Date.now() + ACCESS_TOKEN_TTL * 1000;
  // userTokens.access.set(accessToken, refreshToken)
  // userTokens.refresh.set(refreshToken, accessToken)
  // tokensByUser.set(username, userTokens)

  // const cleanupExpiredTokens = () => {
  //   const now = Date.now();
    
  //   tokensByUser.forEach((userTokens, username) => {
  //     userTokens.access.forEach((value, key) => {
  //       if (value.expiresAt < now) {
  //         userTokens.access.delete(key);  
  //       }
  //     });
  

  //     userTokens.refresh.forEach((value, key) => {
  //       if (value.expiresAt < now) {
  //         userTokens.refresh.delete(key); 
  //       }
  //     });
  

  //     if (userTokens.access.size === 0 && userTokens.refresh.size === 0) {
  //       tokensByUser.delete(username);
  //     }
  //   });
  // };
  

  // setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

  return {
    token: {
      accessToken,
      refreshToken
    }
  }
})

// export function extractToken(authorizationHeader: string) {
//   return authorizationHeader.startsWith('Bearer ')
//     ? authorizationHeader.slice(7)
//     : authorizationHeader
// }