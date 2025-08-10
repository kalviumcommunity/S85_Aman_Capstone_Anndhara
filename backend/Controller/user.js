const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { handleServerError } = require('../utils/errorHandler');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendValidationError, 
  sendNotFoundResponse,
  handleUpdateOperation,
  handleCreateOperation,
  handleGetOperation
} = require('../utils/responseHandler');
const { 
  validateRequiredFields, 
  validateEmail, 
  validateObjectId,
  buildUpdateData,
  validateUpdateFields
} = require('../utils/validationHelper');
// http://localhost:9001/user/register
const userCreatePost = async (req, res) => {
    try {
        const { username, email, password, photo, role, phone } = req.body;
        
        // Validate required fields
        const validation = validateRequiredFields(req.body, ['username', 'email', 'password', 'phone']);
        if (!validation.isValid) {
            return sendValidationError(res, validation.missingFields);
        }

        // Validate email format
        if (!validateEmail(email)) {
            return sendErrorResponse(res, 'Invalid email format', 400);
        }

        const userData = {
            username, 
            email, 
            password, 
            photo, 
            role: '', // Remove role from signup - will be set in profile
            phone
        };

        const result = await handleCreateOperation(res, User, userData, 'User created successfully!');
        
        if (result) {
            const payload = {
                id: result.data._id,
                email: result.data.email,
                role: result.data.role,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(201).json({ 
                message: 'User is created successfully!', 
                success: true, 
                data: result.data, 
                token 
            });
        }
    }
    catch (error) {
        if (error.code === 11000) {
            return sendErrorResponse(res, "Email is already in use. Please try logging in or use a different email.", 400);
        }
        return handleServerError(res, error, 'Server error during creating the user.');
    }
}
// login  
const userLoginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        const validation = validateRequiredFields(req.body, ['email', 'password']);
        if (!validation.isValid) {
            return sendErrorResponse(res, 'Email and password are required', 400);
        }

        const emailExist = await User.findOne({ email });
        if (!emailExist) {
            return sendErrorResponse(res, 'Invalid Credentials', 401);
        }
        
        const isMatch = await bcrypt.compare(password, emailExist.password);
        if (!isMatch) {
            return sendErrorResponse(res, 'Invalid Credentials', 401);
        }
        
        const payload = {
            id: emailExist._id,
            email: emailExist.email,
            role: emailExist.role,
        }
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        return res.status(200).json({ 
            message: 'Login Successful!', 
            success: true, 
            data: emailExist, 
            token 
        });
    } catch (error) {
        return handleServerError(res, error, 'Server error during login');
    }
}

// http://localhost:9001/user
const userCreateGet = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (id) {
            if (!validateObjectId(id)) {
                return sendErrorResponse(res, 'Invalid user ID format', 400);
            }
            
            const user = await User.findById(id);
            if (!user) {
                return sendNotFoundResponse(res, 'User');
            }
            return sendSuccessResponse(res, user, 'User fetched successfully!');
        }
        
        const users = await User.find({});
        return res.status(200).json({
            message: 'Users fetched successfully!',
            success: true,
            farmer: users,
            data: users,
        });
    } catch (error) {
        return handleServerError(res, error, 'Server error occurred while fetching Users.');
    }
}
//http://localhost:9001/user/update/680b7ef2d2de61db25949891
const userCreatePut = async (req, res) => {
    try {
        const { id } = req.params;
        const { user, email, password, photo, role, phone } = req.body;
        
        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 'Invalid user ID format', 400);
        }
        
        const allowedFields = ['user', 'email', 'password', 'photo', 'role', 'phone'];
        const updateData = buildUpdateData(req.body, allowedFields);
        
        if (!validateUpdateFields(updateData)) {
            return sendErrorResponse(res, 'At least one field is required to update', 400);
        }

        return await handleUpdateOperation(res, User, id, updateData, { select: '-password' });
    } catch (error) {
        return handleServerError(res, error, 'Server error occurred while updating user.');
    }
}


module.exports = {
    userCreatePost,
    userCreateGet,
    userCreatePut,
    userLoginPost
}