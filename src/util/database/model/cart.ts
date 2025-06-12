import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';
import { User } from './user';


interface CartAttributes {
  cartId: string;
  userId: string
}

class CartModel extends Model<CartAttributes> implements CartAttributes {
  public cartId!: string
  public userId!: string
}

const Cart  = CartModel.init(
  {
    cartId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true
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
    tableName: 'carts',
    modelName: 'cart',
    createdAt: false
  }
);

export { Cart };