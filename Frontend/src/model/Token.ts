export default class Token {
    expiration: number;
    iat: number;
    roles: string[];
    sub: string;
    type: string;

    constructor(
        expiration: number,
        iat: number,
        roles: string[],
        sub: string,
        type: string,
    ) {
        this.expiration = expiration;
        this.iat = iat;
        this.roles = roles;
        this.sub = sub;
        this.type = type;
    }
}
