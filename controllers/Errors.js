module.exports = {
    get404: (request, response, next) => {
        const error = new Error("Oops! Page not found!");
        error.status = 404;
        next(error);
    },
    get500: (error, request, response, next) => {
        response.status(error.status || 500);
        response.json({
            error: {
                message: error.message
            }
        });
    }
}