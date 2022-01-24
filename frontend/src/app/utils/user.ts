export class User {

  constructor(
    public username: string,
    public password: string,
    public email?: string,
    public image?: string,
    public admin: boolean = false,
  ) { }

}
