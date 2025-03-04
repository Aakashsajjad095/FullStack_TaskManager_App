// src/utils/response.js
const successResponse = (res, data, message = 'Request was successful') => {
    res.status(200).json({ status: 'success', message, data });
  };
  
  const errorResponse = (res, message, statusCode = 500) => {
    res.status(statusCode).json({ status: 'error', message });
  };
  
  export { successResponse, errorResponse };
  