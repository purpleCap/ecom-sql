import { DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { PaymentAttributes } from "@/src/interfaces/payment";


class PaymentModel extends Model<PaymentAttributes> implements PaymentAttributes {
    public paymentId?: string;
    public name!: string;
    public paymentCode!: string;
}

const Payment = PaymentModel.init(
    {
        paymentId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'payments',
        modelName: 'payment',
    }
);

export { Payment };