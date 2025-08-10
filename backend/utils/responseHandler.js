const { handleServerError } = require('./errorHandler');

// Standard success response handler
const sendSuccessResponse = (res, data, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Standard error response handler
const sendErrorResponse = (res, message = 'Operation failed', statusCode = 400, details = null) => {
  const response = {
    success: false,
    message
  };
  
  if (details) {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

// Validation response handler
const sendValidationError = (res, missingFields) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    missingFields
  });
};

// Not found response handler
const sendNotFoundResponse = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`
  });
};

// Update operation handler
const handleUpdateOperation = async (res, model, id, updateData, options = {}) => {
  try {
    const updatedDoc = await model.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true, ...options }
    );
    
    if (!updatedDoc) {
      return sendNotFoundResponse(res);
    }
    
    return sendSuccessResponse(res, updatedDoc, 'Updated successfully');
  } catch (error) {
    return handleServerError(res, error, 'Server error during update operation');
  }
};

// Create operation handler
const handleCreateOperation = async (res, model, data, successMessage = 'Created successfully') => {
  try {
    const newDoc = new model(data);
    await newDoc.save();
    return sendSuccessResponse(res, newDoc, successMessage, 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendErrorResponse(res, 'Duplicate entry found', 400);
    }
    return handleServerError(res, error, 'Server error during creation');
  }
};

// Get operation handler
const handleGetOperation = async (res, model, filter = {}, populateOptions = null, options = {}) => {
  try {
    let query = model.find(filter);
    
    if (populateOptions) {
      if (Array.isArray(populateOptions)) {
        populateOptions.forEach(option => {
          query = query.populate(option);
        });
      } else {
        query = query.populate(populateOptions);
      }
    }
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    const docs = await query.exec();
    return sendSuccessResponse(res, docs, 'Retrieved successfully');
  } catch (error) {
    return handleServerError(res, error, 'Server error during retrieval');
  }
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  sendValidationError,
  sendNotFoundResponse,
  handleUpdateOperation,
  handleCreateOperation,
  handleGetOperation
}; 