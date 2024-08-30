import { newsSchema } from "../validations/newsValidation.js";
import { errors } from "@vinejs/vine";
import vine from "@vinejs/vine";
import { generateRandomNum, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
  static async index(req, res) {
    try {
      const news = await prisma.news.findMany({
        include: {
            user: {
                select:{
                    name: true,
                    id: true,
                    profile: true
                }
            }
        }
      });

      const newsTransform = news?.map((item) => {
        const transformed = NewsApiTransform.transform(item);
        // console.log(transformed);
        return transformed;
      });

      //   console.log(newsTransform);
      return res.status(200).json({ news: newsTransform });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async store(req, res) {
    try {
      const user = req.user;
      const body = req.body;

      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No image file uploaded" });
      }

      //   validate image
      const image = req.files.image;
      const message = imageValidator(image?.size, image.mimetype);
      if (message !== null) {
        return res.status(400).json({ errors: { image: message } });
      }

      //   store image
      const imgExt = image?.name.split(".");
      const imageName = `${generateRandomNum()}.${imgExt[imgExt.length - 1]}`;
      const uploadPath = process.cwd() + "/public/images/" + imageName;
      image.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      //   adding extra info to payload
      payload.image = imageName;
      payload.user_id = req.user.id;

      // store news in db

      const news = await prisma.news.create({
        data: payload,
      });

      return res
        .status(200)
        .json({ message: "News created successfully", news });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async show(req, res) {}

  static async update(req, res) {}

  static async destroy(req, res) {}
}

export default NewsController;
