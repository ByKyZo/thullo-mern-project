import jwt, { Secret } from 'jsonwebtoken';

export default class Utils {
    public static toObject(doc: any) {
        return JSON.parse(JSON.stringify(doc));
    }
    public static checkToken(token: string): any {
        const tokenDecoded: any = jwt.verify(
            token,
            process.env.SECRET_TOKEN as Secret,
            async (err) => {
                if (err) return console.log('INVALID_TOKEN');

                const tokenDecoded = await jwt.decode(token);

                return tokenDecoded;
            }
        );

        return tokenDecoded;
    }
    public static isEmpty = (value: any) => {
        return (
            value === undefined ||
            value === null ||
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value === 'string' && value.trim().length === 0)
        );
    };
}
