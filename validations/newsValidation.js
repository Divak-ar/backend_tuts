import vine from "@vinejs/vine";
import { customErrorReporter } from "./customErrorReporter.js";

vine.errorReporter = () => new customErrorReporter();

export const newsSchema = vine.object({
  title: vine.string().minLength(5).maxLength(120),
  content: vine.string().minLength(10).maxLength(40000),
});
