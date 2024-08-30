import { create } from "domain";
import { getImageUrl } from "../utils/helper.js";

class NewsApiTransform {
  static transform(news) {
    // console.log(news);
    return {
      id: news.id,
      heading: news.title,
      news: news.content,
      image: getImageUrl(news.image),
      posted_by: news.user_id,
      created_at: news.created_at,
      uploaded_by: {
        id: news?.user.id,
        name: news?.user.name,
        profile:
          news?.user.profile !== null
            ? getImageUrl(news?.user.profile)
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHvZ0pbf4bXvAJgVZVuRQqrNWnoWl96cV6wQ&s",
      },
    };
  }
}

export default NewsApiTransform;
