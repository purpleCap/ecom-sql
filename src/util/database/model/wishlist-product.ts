import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';
import { Wishlist } from './wishlist';
import { Product } from './product';

interface WishlistProductAttributes {
    wishlistItemId: string;
    wishlistId?: string;
    productId?: string;
}

class WishlistProductModel extends Model<WishlistProductAttributes> implements WishlistProductAttributes {
  public wishlistItemId!: string
  public wishlistId!: string
  public productId!: string
}

const WishlistProduct  = WishlistProductModel.init(
  {
    wishlistItemId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      autoIncrement: true
    },
    wishlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Wishlist,
        key: 'wishlistId'
      }
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Product,
        key: 'productId'
      }
    },
  },
  {
    sequelize,
    tableName: 'wishlist_products',
    modelName: 'wishlistProduct',
    createdAt: false
  }
);

export { WishlistProduct };