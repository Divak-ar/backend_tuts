import prisma from "../DB/db.config.js";
import vine, { errors } from "@vinejs/vine";
import {
  registrationSchema,
  loginSchema,
} from "../validations/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../config/mailer.js";
import logger from "../config/logger.js";
import { emailQueue, emailQueueName } from "../jobs/emailQueueJob.js";

class AuthController {
  static async register(req, res) {
    try {
      const body = req.body;

      const validator = vine.compile(registrationSchema);
      const payload = await validator.validate(body);

      const email = await prisma.users.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (email) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      const salt = bcrypt.genSaltSync(10);
      payload.password = bcrypt.hashSync(payload.password, salt);

      const user = await prisma.users.create({
        data: payload,
      });

      return res
        .status(200)
        .json({ message: "User created successfully", user });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        // console.log(error.errors);
        return res.status(400).json({ errors: error.messages });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async login(req, res) {
    try {
      const body = req.body;

      const validator = vine.compile(loginSchema);
      const user = await validator.validate(body);

      const userInDb = await prisma.users.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!userInDb) {
        return res
          .status(400)
          .json({ message: "User with this email does not exist" });
      }

      const isMatch = bcrypt.compareSync(user.password, userInDb.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const payloadData = {
        id: userInDb.id,
        name: userInDb.name,
        email: userInDb.email,
        profie: userInDb.profile,
      };

      const token = jwt.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });

      return res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: userInDb.id,
          name: userInDb.name,
          email: userInDb.email,
        },
        access_token: `Bearer ${token}`,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  //   send a test email
  static async sendEmail(req, res) {
    try {
      const { email } = req.query;

      const payload = [
        {
          toMail: email,
          subject: "Test Email",
          body: "<h1>Use RabbitMQ or BullMQ for these cases</h1>",
        },
        {
          toMail: email,
          subject: "Test Email2",
          body: "<h1>BullMQ makes it so we can send mutiple emails</h1>",
        },
        {
          toMail: email,
          subject: "Test Email2",
          body: "<h1>Without overloading our servers</h1>",
        },
      ];

      await emailQueue.add(emailQueueName, payload);

      

      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      logger.error({
        type: "Email error",
        body: error,
      });
      return res
        .status(500)
        .json({ message: "Internal server error in sending email" });
    }
  }
}

export default AuthController;
