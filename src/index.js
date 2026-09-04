import dotenv from "dotenv";
import app from "./app.js";
import connecDB from "./db/index.js";

dotenv.config();

connecDB()
    .then(() => {
        const server = app.listen(
            process.env.PORT || 8000,
            () => {
                console.log(
                    `Server is running on port ${process.env.PORT || 8000}`
                );
            }
        );

        server.on("error", (err) => {
            console.log("The error is:", err);
        });
    })
    .catch((err) => {
        console.log("Error:", err);
    });