// import express from "express";
// import logger from "morgan";
// import cors from "cors";
// import "dotenv/config";
// import authRouter from "./routes/api/auth-router.js";
// import userRouter from "./routes/api/user-router.js";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import swaggerOptions from "./config/swaggerOptions.js";
// import rateLimit from "express-rate-limit";
// import ringtoneRouter from "./routes/api/ringtone-router.js";

// const swaggerDocument = swaggerJsdoc(swaggerOptions);

// const app = express();

// const allowedOrigins = process.env.ALLOWED_ORIGINS
//     ? process.env.ALLOWED_ORIGINS.split(',')
//     : ['https://stately-truffle-e88eb1.netlify.app', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:27017'];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     exposedHeaders: ['Authorization'],
// };

// app.use(cors(corsOptions));

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
// });

// app.use(limiter);

// const formatsLogger = app.get("env") === "development" ? "dev" : "short";

// app.use(logger(formatsLogger));

// // Log all incoming requests
// app.use((req, res, next) => {
//     console.log('Incoming request:', {
//         method: req.method,
//         path: req.path,
//         body: req.body,
//         headers: req.headers
//     });
//     next();
// });

// app.use(cors());
// app.use(express.json());
// app.use(express.static("public"));

// app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
// app.use("/api/ringtone", ringtoneRouter);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use((req, res) => {
//     res.status(404).json({ message: "Page not found" });
// });

// app.use((err, req, res, next) => {
//     if (err.status) {
//         res.status(err.status).json({ error: err.message });
//     } else {
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// export default app;


import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import authRouter from "./routes/api/auth-router.js";
import userRouter from "./routes/api/user-router.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swaggerOptions.js";
import rateLimit from "express-rate-limit";
import ringtoneRouter from "./routes/api/ringtone-router.js";
import path from 'path';

const swaggerDocument = swaggerJsdoc(swaggerOptions);

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['https://stately-truffle-e88eb1.netlify.app', 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:27017'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
};

app.use(cors(corsOptions));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(limiter);

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());
app.use(express.static("public"));

// Log all incoming requests
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        path: req.path,
        body: req.body,
        headers: req.headers
    });
    next();
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/ringtone", ringtoneRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.use((req, res) => {
    res.status(404).json({ message: "Page not found" });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.status ? err.message : "Internal Server Error";

    console.error('Error:', {
        status,
        message,
        stack: err.stack
    });

    res.status(status).json({
        error: message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;