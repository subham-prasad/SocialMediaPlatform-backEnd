const asyncHandler = (requestHandler) => {

    (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next)).catch((err) =>next(err))
    }

return asyncHandler
}

export { asyncHandler };

// const asyncHandler = (fn) => aysnc (req,res,next) => {

//     try {
//             await fn(req,res,next)
//     } catch (error) {

//         res.staus(res.code ||500).json({
//             success: false,
//             message: error.message
//         })
        
//     }
// }