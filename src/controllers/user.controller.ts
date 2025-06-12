import { NextFunction, Request, Response } from "express";
import { SuccessResponse } from "../model/success";
import { Product, ProductModel } from "../util/database/model/product";
import { BadRequestError } from "../errors/bad-request-error";
import { User } from "../util/database/model/user";
import { Cart } from "../util/database/model/cart";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { generatetJWTToken, verifyJWT } from "../helper/getJWTToken";
import { NotFoundError } from "../errors/not-found-error";
import { generateRefreshToken } from "../helper/getRefreshToken";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { WishlistProduct } from "../util/database/model/wishlist-product";
import { Address } from "../util/database/model/address";

const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        const savedUser = await User.create({email: body.email, password: body.password, mobile: body.mobile, firstname: body.firstname, lastname: body.lastname});

        res.status(200).json(new SuccessResponse({message: "User created", data: savedUser}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {username, password} = req.body;
        
        const savedUser = await User.findAll({
            where: {
                [Op.or] : [{
                    email: username
                }, {
                    mobile: username
                }]
            },
            // raw: true
        });
    

        if(!savedUser.length) {
            throw new NotFoundError();
        }


        const isAuthenticated = await bcrypt.compare(password, savedUser[0]!.password ?? "");
        if(!isAuthenticated) {
            throw new BadRequestError("You are not authorized");
        }
        
        const refreshToken = generateRefreshToken(savedUser[0].id || "");
        savedUser[0].refreshToken = refreshToken;
        await savedUser[0].save();

        res.cookie('ecomrefreshtoken', refreshToken, {
            httpOnly: true,
            maxAge: 24*60*60*1000
        })

        res.status(200).json(new SuccessResponse({message: "loggedin successfully", data: {...savedUser[0].dataValues, token: generatetJWTToken(savedUser[0])}}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}


const blockUnblock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id;

        const fetchedUser = await User.findByPk(id);
        if(fetchedUser?.isBlocked === '0'){
            fetchedUser!.isBlocked = '1';
        } else {
            fetchedUser!.isBlocked = '0';
        }

        await fetchedUser?.save();

        res.status(200).json(new SuccessResponse({message: fetchedUser!.isBlocked === "0" ? "User unblocked" : "User blocked", data: null}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}


const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id;

        const fetchedUser = await User.findByPk(id);
        if(fetchedUser?.isDeleted === '0'){
            fetchedUser!.isDeleted = '1';
        } else {
            fetchedUser!.isDeleted = '0';
        }

        await fetchedUser?.save();

        res.status(200).json(new SuccessResponse({message: fetchedUser!.isDeleted === "0" ? "User revived back" : "User deleted", data: null}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}


const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params?.id;
        if(req.currentUser?.userId !== id) {
            throw new BadRequestError("You are not authorized");
        }
        const body = req.body;

        const fetchedUser = await User.findByPk(id);
        if(body.firstname) {
            fetchedUser!.firstname = body.firstname;
        }
        if(body.lastname) {
            fetchedUser!.lastname = body.lastname;
        }
        if(body.mobile) {
            fetchedUser!.mobile = body.mobile;
        }

        await fetchedUser?.save();

        res.status(200).json(new SuccessResponse({message: "Information updated"}))
    } catch(err) {
        console.log(err)
        next(err);
    }
}


const getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookie = req.cookies;
        if(!cookie?.ecomrefreshtoken) {
            throw new NotAuthorizedError();
        }

        const decodedData  = verifyJWT(cookie.ecomrefreshtoken) as { userId: string }

        const fetchedUser = await User.findOne({
            where: {
                refreshToken: cookie.ecomrefreshtoken
            }
        });

        if(!fetchedUser || fetchedUser.id !== decodedData.userId) {
            throw new BadRequestError("User not found");
        }

        const jwttoken = generatetJWTToken(fetchedUser);


        res.status(200).json(new SuccessResponse({message: "New Access Token", data: {
            accessToken: jwttoken
        }}));
    } catch(err) {
        next(err);
    }
}

const signout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cookie = req.cookies;
        if(!cookie.ecomrefreshtoken) {
            throw new NotAuthorizedError();
        }

        const fetchedUser = await User.findOne({
            where: {
                refreshToken: cookie.ecomrefreshtoken
            }
        });

        res.clearCookie('ecomrefreshtoken', {
            httpOnly: true,
            secure: true
        });
        if(!fetchedUser) {
            res.status(204);
            return;
        }
        fetchedUser.refreshToken = "";
        await fetchedUser.save();
        res.status(200).json(new SuccessResponse({message: "signed out"}));
    } catch(err) {
        next(err);
    }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.currentUser;
        const { password } = req.body;

        const fetchedUser = await User.findByPk(userData?.userId);

        if(!fetchedUser) {
            throw new BadRequestError("User not found");
        }

        fetchedUser.password = password;

        await fetchedUser.save();
        res.status(200).json(new SuccessResponse({message: "Password has been reset"}));
    } catch(err) {
        next(err);
    }
}

const getWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;

        const fetchedUser = await User.findByPk(userId);

        if(!fetchedUser) {
            throw new BadRequestError("User not found");
        }

        const wishlist = await fetchedUser.getWishlist();
        if(!wishlist) {
            throw new BadRequestError("Wishlist is empty");
        }
        const allProd = await wishlist.getProducts();
        const prodWithBrands = await Promise.all(
            allProd.map(async (prod: ProductModel) => {
              const brandDetail = await prod.getBrands({ raw: true });
              return {
                ...prod.toJSON(),
                brandDetail
              };
            })
          );
        res.status(200).json(new SuccessResponse({message: "User wishlist", data: prodWithBrands}));
    } catch(err) {
        console.log(err)
        next(err);
    }
}

const getCartlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;

        const fetchedUser = await User.findByPk(userId);

        if(!fetchedUser) {
            throw new BadRequestError("User not found");
        }

        const cartlist = await fetchedUser.getCart();
        const allProd = await cartlist.getProducts();
        const prodWithBrands = await Promise.all(
            allProd.map(async (prod: ProductModel) => {
              const brandDetail = await prod.getBrands({ raw: true });
              return {
                ...prod.toJSON(),
                brandDetail
              };
            })
          );
        res.status(200).json(new SuccessResponse({message: "User Cart", data: prodWithBrands}));
    } catch(err) {
        next(err);
    }
}

const saveAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;

        const fetchedUser = await User.findByPk(userId);

        if(!fetchedUser) {
            throw new BadRequestError("User not found");
        }

        const { street, city, district, pincode, houseNumName, state, note=null, landmark=null, lat=null, lon=null  } = req.body;
        const newAddress = await fetchedUser.createAddress({
            street, city, district, state, pincode, houseNumName, note, landmark, lat, lon
        });



        res.status(201).json(new SuccessResponse({statusCode: 201, message: "New addresses created", data: newAddress}));
    } catch(err) {
        next(err);
    }
}

const getAddresses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;

        const fetchedUser = await User.findByPk(userId);

        if(!fetchedUser) {
            throw new BadRequestError("User not found");
        }

        const allAddresses = await fetchedUser.getAddresses();



        res.status(200).json(new SuccessResponse({statusCode: 200, message: "User addresses", data: allAddresses}));
    } catch(err) {
        next(err);
    }
}


const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        const addressId = req.body.addressId;

        if(!addressId) {
            throw new BadRequestError("Provide addressId");
        }

        const address = await Address.findOne({
            where: {
                addressId,
                userId
            }
        });

        if(!address) {
            throw new BadRequestError("Address not found");
        }

        const { street, city, district, pincode, houseNumName, state, note=null, landmark=null, lat=null, lon=null  } = req.body;
        address.state = state;
        address.street = street;
        address.district = district;
        address.houseNumName = houseNumName;
        address.city = city;
        address.pincode = pincode;
        address.note = note;
        address.landmark = landmark;
        address.lat = lat;
        address.lon = lon;

        await address.save();

        res.status(200).json(new SuccessResponse({statusCode: 200, message: "Address updated successfully", data: address}));
    } catch(err) {
        next(err);
    }
}

const getOneAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.currentUser?.userId;
        const addressId = req.params.addressId;

        if(!addressId) {
            throw new BadRequestError("Provide addressId");
        }

        const address = await Address.findOne({
            where: {
                addressId,
                userId
            },
            raw: true
        });

        if(!address) {
            throw new BadRequestError("Address not found");
        }

        res.status(200).json(new SuccessResponse({statusCode: 200, message: "User address", data: address}));
    } catch(err) {
        next(err);
    }
}


const userController = { 
    signup, 
    signin, 
    blockUnblock, 
    deleteUser, 
    updateUser, 
    getAccessToken, 
    signout, 
    resetPassword, 
    getWishlist, 
    getCartlist, 
    saveAddress,
    getAddresses,
    updateAddress,
    getOneAddress
};
export default userController;