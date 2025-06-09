import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";
import bcrypt from 'bcryptjs';
import { Category } from "./category";
import { UserAttributes } from "../../../interfaces/user";


class UserModel extends Model<UserAttributes> implements UserAttributes {
    public id?: string | undefined;
    public firstname!: string;
    public lastname!: string;
    public mobile!: string;
    public email!: string;
    public isDeleted?: '0' | '1';
    public isBlocked?: '0' | '1';
    public refreshToken?: string;
    public role?: string;
    public password?: string;

    public getLikedBlogs!: Function;
    public getDislikedBlogs!: Function;

}

const User = UserModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mobile: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
        },
        isDeleted: {
            type: DataTypes.STRING,
            defaultValue: '0'
        },
        isBlocked: {
            type: DataTypes.STRING,
            defaultValue: '0'
        },
        refreshToken: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'user'
        }
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    }
);


User.beforeSave(async (user: UserModel) => {
    if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password!, salt);
    }
});


export { User };