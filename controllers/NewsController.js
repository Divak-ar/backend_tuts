import { newsSchema } from "../validations/newsValidation.js";
import { errors } from "@vinejs/vine";
import vine from "@vinejs/vine";
import {
  generateRandomNum,
  imageValidator,
  removeImage,
} from "../utils/helper.js";
import prisma from "../DB/db.config.js";
import NewsApiTransform from "../transform/newsApiTransform.js";

class NewsController {
  static async index(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      if (page <= 0) {
        page = 1;
      }

      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;

      const news = await prisma.news.findMany({
        skip,
        take: limit,

        include: {
          user: {
            select: {
              name: true,
              id: true,
              profile: true,
            },
          },
        },
      });

      const newsTransform = news?.map((item) => {
        const transformed = NewsApiTransform.transform(item);
        // console.log(transformed);
        return transformed;
      });

      const totalNews = await prisma.news.count();
      const totalPages = Math.ceil(totalNews / limit);

      return res.status(200).json({
        news: newsTransform,
        metadata: {
          totalNewsArticles: totalNews,
          currentPage: page,
          limit,
          totalPages,
        },
      });
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

  static async show(req, res) {
    try {
      const id = req.params.id;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: {
            select: {
              name: true,
              profile: true,
              id: true,
            },
          },
        },
      });

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      const newsTransform = NewsApiTransform.transform(news);

      return res.status(200).json({ news: newsTransform });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req, res) {
    try {
      const id = req.params.id;
      const user = req.user;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      if (news.user_id != user.id) {
        return res
          .status(403)
          .json({ message: "Forbidden, Unauthorized to update this news" });
      }

      // image is optional
      const image = req?.files?.image;
      const body = req.body;

      // validating the news
      const validator = vine.compile(newsSchema);
      const payload = await validator.validate(body);

      // if image exist
      if (image) {
        // check if image passed in req.files is of valid format
        const message = imageValidator(image?.size, image?.mimetype);
        if (message !== null) {
          return res.status(400).json({ errors: { image: message } });
        }
      }

      // upload new image if image exist
      if (image) {
        const imgExt = image?.name.split(".");
        const imageName = `${generateRandomNum()}.${imgExt[imgExt.length - 1]}`;
        const uploadPath = process.cwd() + "/public/images/" + imageName;
        try {
          await image.mv(uploadPath);
          payload.image = imageName;

          // Delete old image
          removeImage(news.image);
        } catch (err) {
          console.error("Error uploading image:", err);
          throw err;
        }
      }

      //   update news db
      await prisma.news.update({
        data: payload,
        where: {
          id: Number(id),
        },
      });

      return res
        .status(200)
        .json({ message: "News updated successfully", payload });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      }

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async destroy(req, res) {
    try {

      const { id } = req.params;
      const user = req.user;

      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      console.log(news)

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      if (user.id !== news.user_id) {
        return res
          .status(403)
          .json({ message: "Forbidden, Unauthorized to delete this news" });
      }

      console.log(user)

      // delete image from filesystem
      removeImage(news.image);

      await prisma.news.delete({
        where: {
          id: Number(id),
        },
      });

      return res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default NewsController;
