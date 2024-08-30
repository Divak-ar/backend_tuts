import express from "express";
import "dotenv/config";
import fileupload from "express-fileupload";
import helmet from "helmet";
import cors from "cors";
import { limiter } from "./config/ratelimiter.js";

const PORT = process.env.PORT || 4203;

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// to serve static files (public folder and it's content) on the server localhost:4000/images/imagename.jpg
app.use(express.static("public"));
// to use fileupload express middleware (alternative to multer)
app.use(fileupload());
app.use(helmet());
app.use(cors());
// reducing the rate of requests from a single IP to 100 requests per 30 minutes
app.use(limiter);

app.get("/", (req, res) => {
  res.send("it's working fine....");
});


// routes
import ApiRoutes from "./routes/api.js";

app.use("/api", ApiRoutes);

app.listen(PORT, () => {
  console.log(`Sever started at http://localhost:${PORT}`);
});
