import {User} from "./user";
import {environment} from "../../environments/environment";

export class Post {

    constructor(
        public post_id: number,
        public user: string,
        public description: string,
        public date: Date,
        public file: string,
    ) { }

    fileTreated(): string {
        let newFileName = this.file.replace("/BubbleAPI", "");
        return environment.apiURL + newFileName;
    }

}
