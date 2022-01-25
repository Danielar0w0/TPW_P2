import {User} from "./user";
import {Post} from "./post";

export class Comment {

  constructor(
    public comment_id: number,
    public user: string,
    public post: number,
    public content: string,
  ) {}

}
