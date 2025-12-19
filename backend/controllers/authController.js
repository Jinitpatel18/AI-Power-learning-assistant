import jwt from 'jsonwebtoken'
import User from '../models/User.js'

//generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    })
}

//@desc register new user
//route post /api/auth/register
//@access Public

// export const register = async (req, res, next) => {
//     try {
//         const { username, email, password } = req.body;
//         const userExists = await User.findOne({ $or: [{email},{username}]});

//         if(userExists){
//             return res.status(400).json({
//                 success:false,
//                 error:
//                 userExists.email === email ? "Email already register" : "username is already exists",
//                 statuscode:400
//             })
//         }

//         // create user
//         const user = await User.create({
//             username,email,password
//         })

//         const token = generateToken(user._id)

//         res.status(201).json({
//             success:true,
//             data: {
//                 user:{
//                     id:user._id,
//                     username: user.username,
//                     email: user.email,
//                     profileImage: userImage,
//                     createAt: user.createdAt
//                 },token,
//             },
//             message:"User register successfully"
//         });
//     } catch (error) {
//         next(error);
//     }
// }

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide all fields",
                statuscode: 400
            });
        }

        const userExists = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                error:
                    userExists.email === email
                        ? "Email already registered"
                        : "Username already exists",
                statuscode: 400
            });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImage: user.profileImage || null,
                    createdAt: user.createdAt
                },
                token
            },
            message: "User registered successfully"
        });

    } catch (error) {
        next(error);
    }
};
//@desc login user
//@route post /api/auth/login
//access Public

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //validation 
        
    } catch (error) {
        next(error);
    }
}

//@desc get user profile
//@ route get api/auth/profile
//access private
export const getProfile = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

//@desc update user profile
//@routes put /api/auth/profile
//access private

export const updateProfile = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

// @desc change password
// @routes post api/auth/change-password
//access private
export const changePassword = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}

