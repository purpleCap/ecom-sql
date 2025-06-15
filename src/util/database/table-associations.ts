import { Address } from "./model/address";
import { Blog } from "./model/blog";
import { Brand } from "./model/brand";
import { Cart } from "./model/cart";
import { CartProduct } from "./model/cart-product";
import { Category } from "./model/category";
import { Coupon } from "./model/coupon";
import { Order } from "./model/order";
import { OrderProduct } from "./model/order-product";
import { Payment } from "./model/payment";
import { Product } from "./model/product";
import { ProductRating } from "./model/productRating";
import { User } from "./model/user";
import { Wishlist } from "./model/wishlist";
import { WishlistProduct } from "./model/wishlist-product";

export default () => {

    User.hasOne(Cart, {
        foreignKey: "userId",
        as: "cart"
    });

    Cart.belongsTo(User, {
        foreignKey: "userId",
        as: "user"
    });

    User.hasMany(Product, {
        foreignKey: "createdBy"
    })
    Cart.belongsToMany(Product, {
        through: CartProduct,
        foreignKey: "cartId"
    })

    Product.belongsToMany(Cart, {
        through: CartProduct,
        foreignKey: "productId"
    });

    CartProduct.belongsTo(Product, { 
        foreignKey: 'productId'
    });
    
    Product.hasMany(CartProduct, { 
        foreignKey: 'productId'
    });

    CartProduct.belongsTo(Cart, { 
        foreignKey: 'cartId'
    });

    Cart.hasMany(CartProduct, { 
        foreignKey: 'cartId'
    });

    Product.belongsTo(User, {
        foreignKey: "createdBy"
    });

    Product.belongsTo(Category, {
        foreignKey: "categoryId",
        as: "categorys"
    });

    Product.belongsTo(Brand, {
        foreignKey: "brandId",
        as: "brands"
    });

    Blog.belongsToMany(User, {
        through: 'blog_likes',
        as: 'likedUsers',
        foreignKey: 'blogId',
        otherKey: 'userId',
    });

    User.belongsToMany(Blog, {
        through: 'blog_likes',
        as: 'likedBlogs',
        foreignKey: 'userId',
        otherKey: 'blogId',
    });

    Blog.belongsToMany(User, {
        through: 'blog_dislikes',
        as: 'dislikedUsers',
        foreignKey: 'blogId',
        otherKey: 'userId',
    });

    User.belongsToMany(Blog, {
        through: 'blog_dislikes',
        as: 'dislikedBlogs',
        foreignKey: 'userId',
        otherKey: 'blogId',
    });

    Blog.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'creator',
    });

    User.hasMany(Blog, {
        foreignKey: 'createdBy',
        as: 'blogsCreated',
    });

    User.hasOne(Wishlist, {
        foreignKey: "userId"
    });

    Wishlist.belongsTo(User, {
        foreignKey: "userId",
        as: "user"
    });

    Wishlist.belongsToMany(Product, {
        through: WishlistProduct,
        foreignKey: "wishlistId"
    })

    Product.belongsToMany(Wishlist, {
        through: WishlistProduct,
        foreignKey: "productId"
    });


    User.belongsToMany(Product, {
        through: ProductRating,
        foreignKey: 'userId',
        as: 'productRatings',
    });

    Product.belongsToMany(User, {
        through: ProductRating,
        foreignKey: 'productId',
    });

    User.hasMany(Address, {
        foreignKey: 'userId',
    });

    Address.belongsTo(User, {
        foreignKey: 'userId',
    });

    Order.belongsTo(User, {
        foreignKey: 'createdBy'
    });

    User.hasMany(Order, {
        foreignKey: 'createdBy'
    });

    Order.belongsTo(Address, {
        foreignKey: 'addressId'
    });

    Address.hasMany(Order, {
        foreignKey: 'addressId'
    });

    Order.belongsTo(Coupon, {
        foreignKey: 'couponId'
    });

    Coupon.hasMany(Order, {
        foreignKey: 'couponId'
    });

    Order.belongsTo(Payment, {
        foreignKey: 'paymentId'
    });

    Order.belongsToMany(Product, {
        through: OrderProduct,
        foreignKey: "orderId"
    });

    Product.belongsToMany(Order, {
        through: OrderProduct,
        foreignKey: "productId"
    });
}