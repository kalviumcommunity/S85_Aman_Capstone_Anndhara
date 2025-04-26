const User = require('../model/user');
const userCreatePost = async (req, res) => {
    try {
        const { user, email, password, photo, role, phone } = req.body;
        if (!user || !email || !password || !role || !phone) {
            return res.status(400).json({
                message: 'All fields are required!',
                missingFields: {
                    user: !user ? 'User is required' : undefined,
                    email: !email ? 'Email is required' : undefined,
                    password: !password ? 'Password is required' : undefined,
                    phone: !phone ? 'Phone is required' : undefined,
                    role: !role ? 'Role is required' : undefined,
                },
            });
        }
        const newUser = new User({
            user, email, password, photo, role, phone
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
const userCreateGet = async (req, res) => {
    try {

        const user = await User.find({}, -'password');
        return res.status(200).json({
            message: 'User fetched scucessfull! ',
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

        return res.status(200).json({message:'User Update Sucessfully!',
            success:true,
            data:updatedUser,
        })
    } catch (error) {
return res.status(500).json({message:'Server error occurred while updating user.',
    success:false,
    error:error.message,
});
    }
}


module.exports = {
    userCreatePost,
    userCreateGet,
    userCreatePut
}