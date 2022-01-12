import {User} from "./user";

export class Friendship {

  constructor(
    public id: number,
    public first_user: User,
    public second_user: User,
    ) {}

}
