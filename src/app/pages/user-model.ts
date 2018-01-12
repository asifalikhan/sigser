// export interface Flist {
//     id: string;
// }

export class UserModel {

    constructor(
        public id?: string,
        public name?: string,
        public email?: string,
        public password?: string,
        public connected?: boolean, 
        public notification?: { from: string, id: string, time: string, message: string, read: boolean }[],
        public friendList?: { id: string }[],
    ) { }
}
