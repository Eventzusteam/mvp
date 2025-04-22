import crypto from "crypto"

// CSRF Token management (Stateless using httpOnly cookie for secret)

// Helper function to hash the secret into a token
const hashSecret = (secret) => {
  return crypto.createHash("sha256").update(secret).digest("hex")
}

// Generates a CSRF secret and sets it in an httpOnly cookie.
// Returns the secret itself (not the token to be sent to client).
const generateAndSetCsrfSecret = (req, res) => {
  // Generate a secure random secret
  const secret = crypto.randomBytes(32).toString("hex")

  // Set the secret in an HttpOnly cookie
  res.cookie("csrfSecret", secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Use 'lax' for cross-origin compatibility
    maxAge: 24 * 60 * 60 * 1000, // 24 hours, align with session or token lifetime
    path: "/", // Ensure cookie is available across the site
  })

  // console.log("[CSRF Middleware] Generated and set new csrfSecret cookie.")
  return secret // Return the raw secret
}

// Middleware to validate CSRF token
export const validateCsrfToken = (req, res, next) => {
  // Skip validation for GET, HEAD, OPTIONS requests as they should be safe
  // console.log(
  //   `[CSRF Validate] Request received: Method=${req.method}, Path=${req.path}`
  // )
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    // console.log(
    //   `[CSRF Validate] Skipping validation for safe method: ${req.method}`
    // )
    return next()
  }

  const secretFromCookie = req.cookies.csrfSecret
  const tokenFromHeader = req.headers["x-csrf-token"]

  // console.log(`[CSRF Validate] Raw Headers: ${JSON.stringify(req.headers)}`)
  // console.log(`[CSRF Validate] Raw Cookies: ${JSON.stringify(req.cookies)}`)
  // console.log(
  //   `[CSRF Validate] Extracted Secret from Cookie ('csrfSecret'): ${secretFromCookie}`
  // )
  // console.log(
  //   `[CSRF Validate] Extracted Token from Header ('x-csrf-token'): ${tokenFromHeader}`
  // )

  // If no secret in cookie or token in header, reject
  if (!secretFromCookie) {
    console.error("[CSRF Validate] Failed: csrfSecret cookie missing.")
    return res
      .status(403)
      .json({ error: "CSRF validation failed: Secret missing." })
  }
  if (!tokenFromHeader) {
    console.error("[CSRF Validate] Failed: x-csrf-token header missing.")
    return res
      .status(403)
      .json({ error: "CSRF validation failed: Token missing." })
  }

  // Validate the token by hashing the secret from the cookie
  const expectedToken = hashSecret(secretFromCookie)
  // console.log(
  //   `[CSRF Validate] Expected token (hashed from cookie secret): ${expectedToken}`
  // )

  if (expectedToken !== tokenFromHeader) {
    console.error(
      `[CSRF Validate] Failed: Token mismatch. Header='${tokenFromHeader}', Expected='${expectedToken}'`
    )
    return res
      .status(403)
      .json({ error: "CSRF validation failed: Token mismatch." })
  }

  // console.log("[CSRF Validate] Success: Token validated.")
  // Token is valid, proceed
  next()
}

// Middleware to provide CSRF token (derived from secret)
export const csrfProtection = (req, res, next) => {
  let secret = req.cookies.csrfSecret

  // If no secret cookie exists, generate one
  if (!secret) {
    secret = generateAndSetCsrfSecret(req, res)
    // console.log(
    //   "[CSRF Protection] No existing secret found, generated a new one."
    // )
  } else {
    // console.log("[CSRF Protection] Using existing csrfSecret from cookie.")
  }

  // Generate the token by hashing the secret
  const token = hashSecret(secret)
  // console.log(`[CSRF Protection] Generated token for client: ${token}`)

  // Attach token to response locals (e.g., for server-rendered pages, though not used here)
  res.locals.csrfToken = token
  // Provide a function to get the token (used by /api/auth/csrf-token route)
  res.getToken = () => token

  next()
}

// No cleanup needed for in-memory map anymore

export default { csrfProtection, validateCsrfToken }
