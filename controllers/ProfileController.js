import { imageValidator, generateRandomNum } from "../utils/helper.js";
import prisma from "../DB/db.config.js";

class ProfileController {
  static async index(req, res) {
    try {
      const user = req.user;
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async store() {}

  static async show() {}

  static async update(req, res) {
    try {
      const { id } = req.params;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile.mimetype);

      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }

      const imgExt = profile?.name.split(".");
      const imgName = `${generateRandomNum()}.${imgExt[imgExt.length - 1]}`;

      const uploadPath = process.cwd() + "/public/images/" + imgName;

      profile.mv(uploadPath, (err) => {
        if (err) throw err;
      });

      await prisma.users.update({
        where: {
          id: Number(id),
        },
        data: {
          profile: imgName,
        },
      });

      return res
        .status(200)
        .json({
          message: "Profile updated successfully",
          name: profile.name,
          size: profile?.size,
          mimetype: profile?.mimetype,
        });
    } catch (error) {
      console.log("The error in updateProfile : ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async destroy() {}
}

export default ProfileController;
