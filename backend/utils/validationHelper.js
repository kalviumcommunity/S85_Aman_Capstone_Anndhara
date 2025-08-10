// Common validation functions
const validateRequiredFields = (body, requiredFields) => {
  const missingFields = {};
  const missingFieldNames = [];
  
  requiredFields.forEach(field => {
    if (!body[field]) {
      missingFields[field] = `${field} is required`;
      missingFieldNames.push(field);
    }
  });
  
  return {
    isValid: missingFieldNames.length === 0,
    missingFields,
    missingFieldNames
  };
};

const validateObjectId = (id) => {
  const mongoose = require('mongoose');
  return mongoose.Types.ObjectId.isValid(id);
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

const validateRating = (rating) => {
  const numRating = Number(rating);
  return !isNaN(numRating) && numRating >= 1 && numRating <= 5;
};

const validateQuantity = (quantity) => {
  const numQuantity = Number(quantity);
  return !isNaN(numQuantity) && numQuantity > 0;
};

const validatePrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice >= 0;
};

const validateOrderStatus = (status) => {
  const validStatuses = ['pending', 'accepted', 'shipped', 'completed', 'cancelled', 'rejected'];
  return validStatuses.includes(status);
};

const validateUserRole = (role) => {
  const validRoles = ['farmer', 'buyer'];
  return validRoles.includes(role);
};

// Build update data object from request body
const buildUpdateData = (body, allowedFields) => {
  const updateData = {};
  
  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });
  
  return updateData;
};

// Validate at least one field is provided for updates
const validateUpdateFields = (updateData) => {
  return Object.keys(updateData).length > 0;
};

module.exports = {
  validateRequiredFields,
  validateObjectId,
  validateEmail,
  validatePhone,
  validateRating,
  validateQuantity,
  validatePrice,
  validateOrderStatus,
  validateUserRole,
  buildUpdateData,
  validateUpdateFields
}; 