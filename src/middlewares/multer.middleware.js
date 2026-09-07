import multer from "multer"
//documentation on github

//this file take the file from user and store it locally

const storage = multer.diskStorage({
    //where the file gets uploaded
    destination: function (req,file,cb) {
        cb(null,"./public/temp")
    },
    //how the file gets uploaded
    filename: function (req,file,cb) { 
        cb(null,Date.now()+'-'+file.originalname)
    }
})

//here upload will act as middleware
const upload = multer({storage:storage})
export {upload}


// const memoryStorage = multer.memoryStorage()

// //we are creating the middleware

// const send = multer({

//     //storage tell multer how the files should be stored
//     storage:memoryStorage
// })