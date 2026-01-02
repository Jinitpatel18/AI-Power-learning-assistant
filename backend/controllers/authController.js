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
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide email and password",
                statuscode: 400
            })
        }


        const user = await User.findOne({ email }).select("+password")

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials",
                statuscode: 401
            })
        }

        // check password
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials.",
                statuscode: 401
            })
        }

        // generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            token,
            message: "Login successfully."
        })
    } catch (error) {
        next(error);
    }
}

//@desc get user profile
//@ route get api/auth/profile
//access private
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findOne(req.user._id);

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        next(error);
    }
}

//@desc update user profile
//@routes put /api/auth/profile
//access private

export const updateProfile = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne(req.user._id)

        if (username) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;

        await user.save()

        res.status(200).json({
            success: true,
            data: {
                id: _id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: "Profile update successfully."
        })
    } catch (error) {
        next(error);
    }
}

// @desc change password
// @routes post api/auth/change-password
//access private
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: "Please provide current and new password",
                statuscode: 400,
            })
        }

        const user = await User.findById(req.user._id).select("+password");
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            res.status(401).json({
                success: false,
                error: "current password is invalid",
                statuscode: 401
            })
        }

        //update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password changed successfully."
        })
    } catch (error) {
        next(error);
    }
}

