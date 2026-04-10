export const errorHandler = (err, _, res, __) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        success: false,
        message: err.message,
    });
};
