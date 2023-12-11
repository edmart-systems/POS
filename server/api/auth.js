const router = require("express").Router();
const { User } = require("../models/models");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const {
  verifyPhoneNumber,
  verifyEmail,
  verifyPassword,
  verifyToken,
  tokenRefresh,
} = require("../config/config");

//Creating an account
router.post("/account", async (req, res) => {
  const { email, bss_name, password, contact } = req.body;
  if (verifyEmail(email)) {
    if (verifyPassword(password)) {
      if (verifyPhoneNumber(contact)) {
        try {
          const hashed_password = cryptoJs.AES.encrypt(
            password,
            process.env.PARSE_SECRET
          ).toString();
          const original_password = cryptoJs.AES.decrypt(
            hashed_password,
            process.env.PARSE_SECRET
          ).toString(cryptoJs.enc.Utf8);
          // Check if the user with the provided email already exists
          const existingUser = await User.findOne({
            where: { email: email },
          });
          if (!existingUser) {
            if (original_password === password) {
              //procced and register user
              const newUser = await User.create({
                email,
                password: hashed_password,
                contact,
                bss_name,
              });
              res.json({
                status: true,
                data: "User registered successfully",
                user: newUser,
              });
            } else {
            }
          } else {
            res.json({
              status: false,
              data: "user alreasy registered",
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({
            status: false,
            data: "An error occurred while registering the user",
          });
        }
      } else {
        res.json({
          status: false,
          data: "wrong contact format",
        });
      }
    } else {
      res.json({
        status: false,
        data: "weak password",
      });
    }
  } else {
    res.json({
      status: false,
      data: "wrong email format",
    });
  }
});

//login .....for both user & admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  //email validation
  if (verifyEmail(email)) {
    try {
      //find user by email
      const user = await User.findOne({
        where: { email: email },
      });
      if (user) {
        //decrypt users passowrd
        const original_password = cryptoJs.AES.decrypt(
          user.password,
          process.env.PARSE_SECRET
        ).toString(cryptoJs.enc.Utf8);
        //verify password
        if (original_password === password) {
          //generate access token
          const accessToken = jwt.sign(
            {
              user_id: user.user_id,
              email: user.email,
              role: user.role, // Include the user's role in the token payload
            },
            process.env.ACCESS_SECRET,
            {
              expiresIn: "30m",
            }
          );
          // generate a refresh token
          const refreshToken = jwt.sign(
            {
              user_id: user.user_id,
              email: user.email,
              role: user.role,
            },
            process.env.REFRESH_SECRET,
            {
              expiresIn: "1h",
            }
          );
          //login response
          res.json({
            status: true,
            data: "Login successful",
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          res.json({
            status: false,
            data: "wrong password",
          });
        }
      } else {
        res.json({
          status: false,
          data: "user not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        data: "An error occurred while registering the user",
      });
    }
  } else {
    res.json({
      status: false,
      data: "wrong email format",
    });
  }
});

// Logout route
router.delete("/logout", async (req, res) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // If the token exists, remove it from local storage
      localStorage.removeItem("accessToken");

      res.json({
        status: true,
        message: "Logged out successfully",
      });
    } else {
      res.status(401).json({
        status: false,
        message: "No access token found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      data: "An error occurred while logging out",
    });
  }
});

// Route for token refresh
router.post("/refresh", tokenRefresh, (req, res) => {
  // If the middleware reaches this point, a new access token has been attached to req.accessToken
  res.json({
    status: true,
    message: "Access token refreshed.",
    accessToken: req.accessToken,
  });
});

// Protected route using the verifyToken middleware
//this route may not be used. it demonstrates how protected routes can be written.
router.get("/protected", verifyToken, (req, res) => {
  // The verifyToken middleware has already verified the token and attached user information to req.user
  const user = req.user;

  if (user.role === "admin") {
    res.json({ message: "Admin route accessed.", user });
  } else {
    res.json({ message: "User route accessed.", user });
  }
});

//route for getting all admins
router.get("/admins", verifyToken, async (req, res) => {
  const admin = await User.findAll({
    where: {
      role: "admin",
    },
  });
  try {
    if (admin.length > 0) {
      res.send({
        data: "admin",
        status: true,
        result: admin,
      });
    } else {
      res.send({
        data: "No admins found",
        status: false,
      });
    }
  } catch (error) {
    res.send({ status: false, data: "An Error Occured", result: error });
  }
});

module.exports = router;
