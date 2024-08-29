import express from "express";
import "dotenv/config";
import fileupload from "express-fileupload";

const PORT = process.env.PORT || 4203;

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(fileupload());

app.get("/", (req, res) => {
  res.send("it's working fine....");
});


// routes
import ApiRoutes from "./routes/api.js";

app.use("/api", ApiRoutes);

app.listen(PORT, () => {
  console.log(`Sever started at http://localhost:${PORT}`);
});
