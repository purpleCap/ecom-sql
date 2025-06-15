import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { ProductAttributes } from "../../../interfaces/product";
import { Category } from "./category";
import { User } from "./user";
import { Brand } from "./brand";


export class ProductModel extends Model<ProductAttributes> implements ProductAttributes {
    public productId?: string | undefined;
    public title!: string;
    public slug!: string;
    public description!: string;
    public price!: number;
    public stockQuantity!: number;
    public image?: string;
    public sold?: number;
    public brandId!: string;
    public createdBy!: string;
    public categoryId!: string;

    public getBrands!: Function;

}

const Product = ProductModel.init(
    {
        productId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        categoryId: {
            type: DataTypes.UUID,
            references: {
                model: Category,
                key: 'categoryId'
            }
        },
        createdBy: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        stockQuantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        price: {
            type: DataTypes.FLOAT,
        },
        image: {
            type: DataTypes.STRING,
        },
        sold: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        brandId: {
            type: DataTypes.UUID,
            references: {
                model: Brand,
                key: 'brandId'
            }
        }
    },
    {
        sequelize,
        tableName: 'products',
        modelName: 'product',
    }
);

// Product.belongsToMany(Category, {
//     through: ProductCategory
// });

// Product.belongsTo(User, {
//     foreignKey: 'userId'
// });

// User.hasMany(Product, {
//     foreignKey: 'id'
// })

// Product.hasMany(Address);

export { Product };