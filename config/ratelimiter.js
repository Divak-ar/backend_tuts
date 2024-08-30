import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  legacyHeaders: false,
  standardHeaders: "draft-7",
});
