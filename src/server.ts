import express, { NextFunction, Request, Response } from "express";
import { PORT } from './secret'
import dbConnect from "./config/dbConnect";
import rootRouter from "./routes/index.routes";
import { CustomError } from "./errors/custom-errors";
import cookieParser from 'cookie-parser';
import { Category } from "./util/database/model/category";
import morgan from 'morgan';
import { User } from "./util/database/model/user";
import { Cart } from "./util/database/model/cart";
import { Product } from "./util/database/model/product";
import { CartProduct } from "./util/database/model/cart-product";
import { Blog } from "./util/database/model/blog";
import { Brand } from "./util/database/model/brand";
import { Wishlist } from "./util/database/model/wishlist";
import { WishlistProduct } from "./util/database/model/wishlist-product";
import { ProductRating } from "./util/database/model/productRating";
import { Address } from "./util/database/model/address";

const server = express();

server.use(cookieParser());
server.use(express.json());
server.use(morgan('dev'));

server.use('/api', rootRouter);


server.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    if(JSON.stringify(error) !== '{}') {
        res.status(error.statusCode || 500).json({...error, errors: error?.serializeErrors ? error.serializeErrors() : error});
    } else {
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
});

// ALL TABLE RELATIONS ARE HERE

User.hasOne(Cart, {
    foreignKey: "userId",
    as: "cart"
});

Cart.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
});

User.hasMany(Product, {
    foreignKey: "userId"
})
Cart.belongsToMany(Product, {
    through: CartProduct,
})

// Cart.hasMany(Product, {
//     foreignKey: "cartId",
// });

Product.belongsToMany(Cart, {
    through: CartProduct,
});

Product.belongsTo(User, {
    foreignKey: "userId"
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


dbConnect(() => server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    (async () => {
        try {
            if(!await User.findOne({where: {email: 'demo@demo.com'}, attributes: ['email']})) {
                await User.create({
                    firstname: "Test",
                    lastname: "User",
                    email: "demo@demo.com",
                    mobile: '8989778760',
                    password: "Pass@123"
                })
                await User.create({
                    firstname: "Admin",
                    lastname: "User",
                    email: "demoadmin@demo.com",
                    mobile: '9001221200',
                    password: "Pass@123",
                    role: 'admin'
                })
            }
            if((await Category.findAll()).length == 0) {
                await Category.create({
                    title: 'Electronics'
                })
            }
        } catch (err) {
            console.log(err);
        }
    })()
}));


export default server;