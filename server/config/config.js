const jwt = require("jsonwebtoken");
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

//method for verifying password
const verifyPassword = (password) => {
  const lengthRegex = /^.{8,}$/; // At least 8 characters
  const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
  const lowercaseRegex = /[a-z]/; // At least one lowercase letter
  const digitRegex = /\d/; // At least one digit
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // At least one special character
  // Check if the password meets all criteria
  const isLengthValid = lengthRegex.test(password);
  const isUppercaseValid = uppercaseRegex.test(password);
  const isLowercaseValid = lowercaseRegex.test(password);
  const isDigitValid = digitRegex.test(password);
  const isSpecialCharValid = specialCharRegex.test(password);
  // Return true if all criteria are met, otherwise false
  if (
    isLengthValid &&
    isUppercaseValid &&
    isLowercaseValid &&
    isDigitValid &&
    isSpecialCharValid
  ) {
    return true;
  } else {
    return false;
  }
};

//method for verifying email
const verifyEmail = (email) => {
  const regex =
    /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)$/;
  if (email.match(regex)) {
    return true;
  } else {
    return false;
  }
};

//method for verifying phone number
const verifyPhoneNumber = (phoneNumber) => {
  // Check if the phone number consists of exactly 10 numeric digits, including the first zero
  const phoneRegex = /^[0-9]{10}$/;

  // Check if the phone number follows the specified format
  if (phoneRegex.test(phoneNumber)) {
    return true; // Valid phone number
  } else {
    return false;
  }
};
// Verifies the access token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Invalid token.", error: err, invalidtoken: token });
    }

    // Token is valid, attach user information to the request
    req.user = decoded;
    next();
  });
}

// Verifies the refresh token
function verifyRefreshToken(refreshToken, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
}

// Middleware to handle token refresh
function tokenRefresh(req, res, next) {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not provided." });
  }

  verifyRefreshToken(refreshToken, REFRESH_SECRET)
    .then((decoded) => {
      // Generate a new access token
      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
        },
        ACCESS_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Attach the new access token to the request
      req.accessToken = newAccessToken;
      next();
    })
    .catch((err) => {
      res.status(401).json({ message: "Invalid refresh token." });
    });
}

module.exports = {
  verifyPassword,
  verifyPhoneNumber,
  verifyEmail,
  tokenRefresh,
  verifyToken,
};
