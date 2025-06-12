import { UserAttributes } from "../interfaces/user";
import jwt from "jsonwebtoken";

const generateRefreshToken = (id: string) => {
    const token = jwt.sign({
        userId: id
    }, "areallylongstringaskey", { expiresIn: '48h' });

    return token;
};

export { generateRefreshToken };

