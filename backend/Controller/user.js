const User = require('../model/user');
// http://localhost:9001/user/register
const userCreatePost = async (req, res) => {
    try {
        const { username, email, password, photo, role, phone } = req.body;
        if (!username || !email || !password || !role || !phone) {
            return res.status(400).json({
                message: 'All fields are required!',
                missingFields: {
                    username: !username ? 'User is required' : undefined,
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                    phone: !phone ? 'Phone is required' : undefined,
                    role: !role ? 'Role is required' : undefined,
                },
            });
        }
        const newUser = new User({
            username, email, password, photo, role, phone
        });
        await newUser.save();
        return res.status(201).json({ message: 'User is created successfully!', success: true, data: newUser })
    }
    catch (error) {
        return res.status(500).json({
            message: 'Server errror occured while creating the user.',
            success: false,
            error: error.message,
        })
    }
}
// http://localhost:9001/user
const userCreateGet = async (req, res) => {
    try {
        // const { username, password } = req.query;
        // if (username && password) {
        //     const user1 = await User.findOne({ username, password });
        //     if (!user1) {
        //         return res.status(404).json({
        //             message: 'User not found with the provided credentials',
        //             success: false,
        //             data: null,
        //         })
        //     }
        //     return res.status(200).json({ message: 'User is found', success: true, data: user1 });
        // }

        const user = await User.find({});
        return res.status(200).json({
            message: 'User fetched sucessfully! ',
            success: true,
            data: user,
        });
    } catch (error) {
        return res.json({
            message: 'Server error occurred while fetching Users. ',
            success: false,
            data: error.message,
        })
    }

}
//http://localhost:9001/user/update/680b7ef2d2de61db25949891
const userCreatePut = async (req, res) => {
    const { user, email, password, photo, role, phone } = req.body;
    try {
        const { id } = req.params;
        if (!user && !email && !password && !photo && !role && !phone) {
            return res.status(400).json({
                message: 'At least one field is required to updates',
                success: false,
            });
        }
        const updateData = {};
        if (user) updateData.user = user;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (photo) updateData.photo = photo;
        if (role) updateData.role = role;
        if (phone) updateData.phone = phone;


        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true, select: '-password' });

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User is not found!',
                success: false,


            });
        }

        return res.status(200).json({
            message: 'User Update Sucessfully!',
            success: true,
            data: updatedUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Server error occurred while updating user.',
            success: false,
            error: error.message,
        });
    }
}


module.exports = {
    userCreatePost,
    userCreateGet,
    userCreatePut
}