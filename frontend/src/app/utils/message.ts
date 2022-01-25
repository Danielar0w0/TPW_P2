import {User} from "./user";

export class Message {

  constructor(
    public id: number,
    public sender: string,
    public receiver: string,
    public content: string,
  ) { }

}
