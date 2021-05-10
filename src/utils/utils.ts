import { MongooseDocument } from 'mongoose';
export default class Utils {
    public static toObject(doc: any) {
        return JSON.parse(JSON.stringify(doc));
    }
}
