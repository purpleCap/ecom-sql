// models/blogLike.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../database";
import { Blog } from "./blog";
import { User } from "./user";

class BlogLike extends Model {}

BlogLike.init(
  {
    blogId: {
      type: DataTypes.UUID,
      references: {
        model: Blog,
        key: 'blogId',
      },
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id',
      },
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'blog_like',
    tableName: 'blog_likes',
    timestamps: false,
  }
);

export { BlogLike };
