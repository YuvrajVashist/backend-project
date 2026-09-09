import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { default: connecDB } = await import("./db/index.js");

connecDB()
    .then(() => {
        const server = app.listen(process.env.PORT || 8000, () => {
            console.log(
                `Server is running on port, ${process.env.PORT || 8000}`
            );
        });

        server.on("error", (err) => {
            console.log("The error is:", err);
        });
    })
    .catch((err) => {
        console.log("Error:", err);
    });