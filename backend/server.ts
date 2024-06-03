import { v2 as cloudinary } from 'cloudinary';
import cluster from 'cluster';
import { app, PORT } from './app';
import { DBConnection } from './utils/db/database';


const totalCPUs = require("os").availableParallelism();

//cloudianry configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (cluster.isPrimary) {
    console.log(`Number of cpu is ${totalCPUs}`);
    // Fork workers.
    for (let i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker: { process: { pid: any; }; }, code: any, signal: any) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`)
        DBConnection()
    })
}