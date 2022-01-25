export class Session {

    constructor(private _user_id: number, private _email: string, private _token: string, ) { }

    static getCurrentSession(): Session | null {

        let storedUser = localStorage.getItem('user');

        if (storedUser !== undefined && storedUser !== null) {

            let currentSessionJsonObj = JSON.parse(storedUser);
            return new Session(currentSessionJsonObj['user_id'], currentSessionJsonObj['email'], currentSessionJsonObj['token']);

        }

        return null;

    }

    get userId(): number {
        return this._user_id;
    }

    set userId(value: number) {
        this._user_id = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get token(): string {
        return this._token;
    }

    set token(value: string) {
        this._token = value;
    }

}
