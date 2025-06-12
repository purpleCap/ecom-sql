import { NotAuthorizedError } from "../errors/not-authorized-error";
import { UserAttributes } from "../interfaces/user";
import jwt from "jsonwebtoken";

const generatetJWTToken = (user: UserAttributes) => {
    const token = jwt.sign({
        email: user.email,
        userId: user.id,
        role: user.role
    }, "areallylongstringaskey", { expiresIn: '12h' });

    return token;
};

const verifyJWT = (token: string) : string | jwt.JwtPayload  => {
    try {
        const decoded = jwt.verify(token, "areallylongstringaskey") as { userId: string }
        return decoded ;
    } catch(err) {
        throw new NotAuthorizedError();
    }
};

export { generatetJWTToken, verifyJWT };

