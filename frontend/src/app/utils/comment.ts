import {User} from "./user";
import {Post} from "./post";

export class Comment {

  constructor(
    public comment_id: number,
    public user: User,
    public post: Post,
    public content: string,
  ) {}

}
