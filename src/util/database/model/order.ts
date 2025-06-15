import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { User } from "./user";
import { Brand } from "./brand";
import { Address } from "./address";
import { Coupon } from "./coupon";
import { Payment } from "./payment";

export interface OrderAttributes {
    orderId?: string;
    addressId: string;
    couponId?: string;
    paymentId: string;
    deliveryCharge?: number;
    tax?: number;
    promotion?: number;
    cartTotal?: number;
    subTotal?: number;
    createdBy?: string;
}

export class OrderModel extends Model<OrderAttributes> implements OrderAttributes {
    public orderId?: string;
    public addressId!: string;
    public couponId?: string;
    public paymentId!: string;
    public deliveryCharge?: number;
    public tax?: number;
    public promotion?: number;
    public cartTotal?: number;
    public subTotal?: number;
    public createdBy?: string;

}

const Order = OrderModel.init(
    {
        orderId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        addressId: {
            type: DataTypes.UUID,
            references: {
                model: Address,
                key: 'addressId'
            }
        },
        couponId: {
            type: DataTypes.UUID,
            references: {
                model: Coupon,
                key: 'couponId'
            },
            defaultValue: null
        },
        paymentId: {
            type: DataTypes.UUID,
            references: {
                model: Payment,
                key: 'paymentId'
            },
            allowNull: false
        },
        deliveryCharge: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        tax: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        promotion: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },
        createdBy: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'id'
            }
        },
        cartTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        },
        subTotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0
        }
    },
    {
        sequelize,
        tableName: 'orders',
        modelName: 'order',
    }
);

export { Order };