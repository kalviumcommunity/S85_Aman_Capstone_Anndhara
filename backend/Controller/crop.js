const Crop = require('../model/crop');
const { handleServerError } = require('../utils/errorHandler');
const { 
  sendSuccessResponse, 
  sendErrorResponse, 
  sendValidationError,
  handleCreateOperation,
  handleUpdateOperation
} = require('../utils/responseHandler');
const { 
  validateRequiredFields, 
  validateObjectId,
  validateQuantity,
  validatePrice,
  buildUpdateData,
  validateUpdateFields
} = require('../utils/validationHelper');
// http://localhost:9001/crop/crop
const createCrop = async (req, res) => {
  try {
    const { name, type, pricePerKg, quantityKg, location } = req.body;
    const seller = req.user.id;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['name', 'type', 'pricePerKg', 'quantityKg', 'location']);
    if (!validation.isValid) {
      return sendValidationError(res, validation.missingFields);
    }

    // Validate numeric fields
    if (!validatePrice(pricePerKg)) {
      return sendErrorResponse(res, 'Invalid price per kg', 400);
    }
    if (!validateQuantity(quantityKg)) {
      return sendErrorResponse(res, 'Invalid quantity', 400);
    }

    // Image handling
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Create new crop
    const cropData = {
      name,
      type,
      pricePerKg,
      quantityKg,
      location,
      seller,
      imageUrl,
    };

    return await handleCreateOperation(res, Crop, cropData, 'Crop created successfully');
  } catch (error) {
    return handleServerError(res, error, 'Server error during crop creation');
  }
};

// http://localhost:9001/crop/AllCrop?cropId=680a726b838f7fd94382044f
const getCrops = async (req, res) => {
    try {
        const cropId = req.query.cropId || req.params.cropId;

        if (cropId) {
            if (!validateObjectId(cropId)) {
                return sendErrorResponse(res, 'Invalid crop ID format', 400);
            }
            
            const crop = await Crop.findById(cropId).populate('seller', 'username email phone role').exec();
            if (!crop) {
                return sendNotFoundResponse(res, 'Crop');
            }
            return res.status(200).json({ message: 'Crop retrieved Successfully', crop });
        }

        // all Crop
        const crops = await Crop.find().populate('seller', 'username email phone role').exec();
        return res.status(200).json({ message: 'Crop retrieved Successfully', crops });
    } catch (error) {
        return handleServerError(res, error, 'Server error during fetching crops');
    }
}
// GET http://localhost:9001/crop/:id
const getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validateObjectId(id)) {
      return sendErrorResponse(res, 'Invalid crop ID format', 400);
    }
    
    const crop = await Crop.findById(id).populate('seller', 'user email phone role');
    if (!crop) {
      return sendNotFoundResponse(res, 'Crop');
    }
    return sendSuccessResponse(res, crop, 'Crop retrieved successfully');
  } catch (error) {
    return handleServerError(res, error, 'Server error during fetching crop by ID');
  }
};

// http://localhost:9001/crop/update/680a726b838f7fd94382044f
const updateCrop = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, pricePerKg, quantityKg, imageUrl, location, available } = req.body;

        if (!validateObjectId(id)) {
            return sendErrorResponse(res, 'Invalid crop ID format', 400);
        }

        const allowedFields = ['name', 'type', 'pricePerKg', 'quantityKg', 'imageUrl', 'location', 'available'];
        const updateData = buildUpdateData(req.body, allowedFields);

        if (!validateUpdateFields(updateData)) {
            return sendErrorResponse(res, 'At least one field is required to update', 400);
        }

        return await handleUpdateOperation(res, Crop, id, updateData);
    } catch (error) {
        return handleServerError(res, error, 'Server error during crop update');
    }
};
module.exports = {
    createCrop,
    getCrops,
    updateCrop,
    getCropById
}