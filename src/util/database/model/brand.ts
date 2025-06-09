import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { BrandAttributes } from "../../../interfaces/brand";
import { Product } from "./product";


class BrandModel extends Model<BrandAttributes> implements BrandAttributes {
    public brandId?: string;
    public title!: string;

}

const Brand = BrandModel.init(
    {
        brandId: {
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
        tableName: 'brands',
        modelName: 'brand',
    }
);

// Category.belongsToMany(Product, {
//     through: ProductCategory,
// });

export { Brand };