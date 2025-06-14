import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';
import { Cart } from './cart';
import { Product } from './product';

interface CartProductAttributes {
    cartItemId: string;
    quantity: number;
    cartId: string;
    productId: string;
}

class CartProductModel extends Model<CartProductAttributes> implements CartProductAttributes {
  public cartItemId!: string
  public quantity!: number
  public cartId!: string
  public productId!: string
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
    },
    cartId: {
      type: DataTypes.UUID,
      references: {
        model: Cart,
        key: 'cartId'
      },
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: Product,
        key: 'productId'
      },
    },
  },
  {
    sequelize,
    tableName: 'cart_products',
    modelName: 'cartProduct',
    createdAt: false
  }
);

export { CartProduct };