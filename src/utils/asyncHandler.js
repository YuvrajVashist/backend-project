//USING PROMISES

//   (fn)=>{()=>{}}
const asyncHandler = (requestHandler)=>{
    return(req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err))
    }
}

export  {asyncHandler};



//USING TRY CATCH METHOD

// const asyncHandler = (fn) => async(req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }
//     catch(err){
//         res.status(err.code||500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }


//next is used for middlewares



//higher order functions are those type of fucntion
//  that can be use to return the value 
// or can use as a parameter 

// const asyncHandler = ()=>{}
// const asyncHandler = (fn)=>{()=>{}}
// const asyncHandler = (fn)=>()=>{}

