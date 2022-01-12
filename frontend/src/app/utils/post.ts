import {User} from "./user";

export class Post {

  constructor(
    public post_id: number,
    public user: User,
    public description: string,
    public date: Date,
    public file: string,
  ) { }

}
