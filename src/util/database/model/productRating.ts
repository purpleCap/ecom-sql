import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';
import { User } from './user';
import { Product } from './product';

interface ProductRatingAttributes {
    ratingId?: string;
    itemRating: number;
    userId: string;
    productId: string;
}

class ProductRatingModel extends Model<ProductRatingAttributes> implements ProductRatingAttributes {
  public ratingId!: string
  public itemRating!: number
  public userId!: string
  public productId!: string
}

const ProductRating  = ProductRatingModel.init(
  {
    ratingId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true
    },
    itemRating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: 'productId'
      }
    }
  },
  {
    sequelize,
    tableName: 'product_ratings',
    modelName: 'product_rating',
    createdAt: false
  }
);

export { ProductRating };