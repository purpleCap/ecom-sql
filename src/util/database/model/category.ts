import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { CategoryAttributes } from "../../../interfaces/category";
import { Product } from "./product";


class CategoryModel extends Model<CategoryAttributes> implements CategoryAttributes {
    public categoryId?: string;
    public title!: string;
    // public category!: string;

}

const Category = CategoryModel.init(
    {
        categoryId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'categorys',
        modelName: 'Category',
    }
);

// Category.belongsToMany(Product, {
//     through: ProductCategory,
// });

export { Category };