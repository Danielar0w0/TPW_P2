export class User {

    constructor(
        public username: string,
        public password: string,
        public user_email?: string,
        public image?: string,
        public admin: boolean = false,
    ) {
    }

    static getNullUser(): User {
        return new User('', '', '', '', false);
    }

}
