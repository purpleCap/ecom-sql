import { Model, DataTypes, ForeignKey } from 'sequelize';
import sequelize from '../database';
import { User } from './user';


interface WishlistAttributes {
  wishlistId: string;
  userId: string
}

class WishlistModel extends Model<WishlistAttributes> implements WishlistAttributes {
  public wishlistId!: string
  public userId!: string
}

const Wishlist  = WishlistModel.init(
  {
    wishlistId: {
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
    tableName: 'wishlists',
    modelName: 'wishlist',
    createdAt: false
  }
);

export { Wishlist };