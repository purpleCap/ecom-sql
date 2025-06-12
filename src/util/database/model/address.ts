import { BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin, DataTypes, ForeignKey, Model, } from "sequelize";
import sequelize from "../database";

import { Category } from "./category";
import { User } from "./user";

export interface AddressAttributes {
    addressId?: string;
    houseNumName: string;
    street: string;
    city: string;
    landmark?: string,
    lat?: string;
    lon?: string;
    state: string;
    district: string;
    pincode: string;
    note?:string;
    userId?: string

  }


export class AddressModel extends Model<AddressAttributes> implements AddressAttributes {
    public addressId?: string;
    public houseNumName!: string;
    public street!: string;
    public city!: string;
    public landmark?: string;
    public lat?: string;
    public lon?: string;
    public state!: string;
    public district!: string;
    public pincode!: string;
    public note?:string;
    public userId?: string;

}

const Address = AddressModel.init(
    {
        addressId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true
        },
        houseNumName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        landmark: {
            type: DataTypes.STRING,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pincode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        note: {
            type: DataTypes.STRING,
        },
        lat: {
            type: DataTypes.STRING,
        },
        lon: {
            type: DataTypes.STRING,
        },
        userId: {
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
        tableName: 'addresses',
        modelName: 'address',
    }
);

export { Address };