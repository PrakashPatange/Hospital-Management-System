import jwt from 'jsonwebtoken';

export const generateToken = (user, message, statusCode, res) => {
  try {
    // Generate the JWT token using the user's method
    const token = user.generateJsonWebToken();

    // Determine the cookie name based on the user's role
    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    // Set the cookie expiration time in milliseconds
    const cookieExpireTime = process.env.COOKIE_EXPIRE
      ? Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000; // Default to 7 days if not set

    // Set the response with cookie and JSON data
    res
      .status(statusCode)
      .cookie(cookieName, token, {
        expires: new Date(Date.now() + cookieExpireTime),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure flag for production
        sameSite: 'strict', // Prevent CSRF attacks
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  } catch (error) {
    console.error("Error generating token:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
