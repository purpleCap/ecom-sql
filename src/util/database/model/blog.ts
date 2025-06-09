import { BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { BlogAttributes } from "../../../interfaces/blog";
import { Category } from "./category";
import { User } from "./user";


export class BlogModel extends Model<BlogAttributes> implements BlogAttributes {
    public blogId?: string;
    public title!: string;
    public description!: string;
    public numViews!: number;
    public image?: string;
    public category!: Enumerator;
    public userId!: string;
    public categoryId!: string;
    public createdBy!: string;

    public addLikedUser!: Function;
    public removeDislikedUser!: Function;
    public addDislikedUser!: Function;
    public removeLikedUser!: Function;

}

const Blog = BlogModel.init(
    {
        blogId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
        },
        numViews: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        category: {
            type: DataTypes.UUID,
            references: {
                model: Category,
                key: 'categoryId'
            }
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: User,
              key: 'id'
            }
          }
    },
    {
        sequelize,
        tableName: 'blogs',
        modelName: 'blog',
    }
);

export { Blog };