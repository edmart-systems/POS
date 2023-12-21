const router = require("express").Router();
const { Business } = require("../models/models");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const {
  verifyPhoneNumber,
  verifyEmail,
  verifyPassword,
  verifyToken,
  tokenRefresh,
} = require("../config/config");

//creating a business
router.post("/business", async (req, res) => {
  const {
    bss_name,
    bss_email,
    bss_password,
    bss_country,
    bss_contact,
    fy_start,
    fy_end,
    bss_logo,
    industry,
    address_1,
    address_2,
  } = req.body;

  if (verifyEmail(bss_email)) {
    if (verifyPhoneNumber(bss_contact)) {
      if (verifyPassword(bss_password)) {
        try {
          //Hash password
          const hash_password = cryptoJs.AES.encrypt(
            bss_password,
            process.env.PARSE_SECRET
          ).toString();
          //check whether the email has already been used to create another business
          const email_availability = await Business.findOne({
            where: { bss_email: bss_email },
          });
          if (!email_availability) {
            //procced to create a business
            const business = await Business.create({
              bss_name,
              bss_email,
              bss_password: hash_password,
              bss_country,
              bss_contact,
              fy_start,
              fy_end,
              bss_logo,
              industry,
              address_1,
              address_2,
            });
            res.json({
              status: true,
              data: "New business created",
              user: business,
            });
          } else {
            res.json({
              status: false,
              data: "email already used",
            });
          }
        } catch (error) {
          res.send({ status: false, data: "An Error Occured", result: error });
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
        data: "wrong contact format",
      });
    }
  } else {
    res.json({
      status: false,
      data: "wrong email format",
    });
  }
});

module.exports = router;
