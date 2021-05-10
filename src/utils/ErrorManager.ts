export default class ErrorManager {
    public static checkErrors(possibleError: Array<string>, err: any) {
        const errors: any = {};

        possibleError.forEach((error) => {
            if (err.message.includes(error)) {
                const messageStartIndex = err.message.indexOf(':');
                const errMessage = err.message.substring(messageStartIndex).replace(':', '').trim();
                errors[error] = errMessage;
            }
        });

        return errors;
    }
}
