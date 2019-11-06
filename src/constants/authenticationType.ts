export enum AuthenticationTypeConst {
    AWS = 1,
    Azure
}

export class AuthenticationTypeUtil {
    public static FromString(type:string) : AuthenticationTypeConst {
        let typeInLowerCase = type.trim().toLocaleLowerCase();
        if(typeInLowerCase === 'aws') {
            return AuthenticationTypeConst.AWS;
        } else {
            return AuthenticationTypeConst.Azure;
        }
    }
}