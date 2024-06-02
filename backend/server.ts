import express from 'express'
import { app, PORT } from './app'
import cluster from 'cluster';
import { DBConnection } from './utils/db/database';
import { v2 as cloudinary } from 'cloudinary';


const totalCPUs = require("os").availableParallelism();

//cloudianry configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (cluster.isPrimary) {
    console.log(`Number of CPUs is ${totalCPUs}`);
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker: { process: { pid: any; }; }, code: any, signal: any) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });
} else {

    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`)
        DBConnection()
    })
}