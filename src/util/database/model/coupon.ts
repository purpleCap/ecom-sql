import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

export interface CouponAttributes {
    couponId?: string;
    title: string;
    expiry: string;
    discount: string;
}

class CouponModel extends Model<CouponAttributes> implements CouponAttributes {
    public couponId?: string;
    public title!: string;
    public expiry!: string;
    public discount!: string;

}

const Coupon = CouponModel.init(
    {
        couponId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false
        },
        discount: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'coupons',
        modelName: 'coupon',
    }
);

// Category.belongsToMany(Product, {
//     through: ProductCategory,
// });

export { Coupon };