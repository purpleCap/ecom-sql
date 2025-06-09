import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';

interface WishlistProductAttributes {
    wishlistItemId: string;
    // WishlistId: string;
    // productId: string;
}

class WishlistProductModel extends Model<WishlistProductAttributes> implements WishlistProductAttributes {
  public wishlistItemId!: string
  // public WishlistId!: string
  // public productId!: string
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
  },
  {
    sequelize,
    tableName: 'wishlist_products',
    modelName: 'wishlistProduct',
    createdAt: false
  }
);

export { WishlistProduct };