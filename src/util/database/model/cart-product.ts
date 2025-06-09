import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';

interface CartProductAttributes {
    cartItemId: string;
    quantity: number;
    // cartId: string;
    // productId: string;
}

class CartProductModel extends Model<CartProductAttributes> implements CartProductAttributes {
  public cartItemId!: string
  public quantity!: number
  // public cartId!: string
  // public productId!: string
}

const CartProduct  = CartProductModel.init(
  {
    cartItemId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'cart_products',
    modelName: 'CartProduct',
    createdAt: false
  }
);

export { CartProduct };