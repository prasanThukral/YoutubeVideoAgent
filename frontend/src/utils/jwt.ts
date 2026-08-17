// Reads the payload of a JWT without verifying it - fine for display purposes
// only, since the server is the one enforcing the signature on every request.
export function decodeJwt<T>(token: string): T | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)) as T
  } catch {
    return null
  }
}
