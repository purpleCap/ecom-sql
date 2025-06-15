import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';
import { Cart } from './cart';
import { Product } from './product';
import { Order } from './order';

interface OrderProductAttributes {
    cartItemId: string;
    quantity: number;
    orderId: string;
    productId: string;
}

class OrderProductModel extends Model<OrderProductAttributes> implements OrderProductAttributes {
  public cartItemId!: string
  public quantity!: number
  public orderId!: string
  public productId!: string
}

const OrderProduct  = OrderProductModel.init(
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
    orderId: {
      type: DataTypes.UUID,
      references: {
        model: Order,
        key: 'orderId'
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
    tableName: 'order_products',
    modelName: 'orderProduct',
    createdAt: false
  }
);

export { OrderProduct };