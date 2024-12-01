// // // routes/api/ringtone-router.js
// // import express from "express";
// // import { authenticate, isEmptyBody } from "../../middleware/index.js";
// // import { validateBody } from "../../decorators/index.js";
// // import ringtoneController from "../../controllers/ringtone-controller.js";
// // import { ringtoneGenerationSchema } from "../../schemas/ringtone-schema.js";

// // const ringtoneRouter = express.Router();

// // // Apply authentication middleware to all routes
// // ringtoneRouter.use(authenticate);

// // // POST endpoint for generating ringtone
// // ringtoneRouter.post(
// //     "/generate",
// //     isEmptyBody,
// //     validateBody(ringtoneGenerationSchema),
// //     ringtoneController.generate
// // );

// // export default ringtoneRouter;

// // routes/api/ringtone-router.js
// import express from "express";
// import { authenticate, isEmptyBody } from "../../middleware/index.js";
// import { validateBody } from "../../decorators/index.js";
// import ringtoneController from "../../controllers/ringtone-controller.js";
// import { ringtoneGenerationSchema } from "../../schemas/ringtone-schema.js";

// const ringtoneRouter = express.Router();

// // Debug middleware for ringtone routes
// ringtoneRouter.use((req, res, next) => {
//     console.log('Ringtone Router - Incoming request:', {
//         method: req.method,
//         path: req.path,
//         body: req.body,
//         headers: req.headers
//     });
//     next();
// });

// // Apply authentication middleware
// ringtoneRouter.use(authenticate);

// ringtoneRouter.post(
//     "/generate",
//     isEmptyBody,
//     validateBody(ringtoneGenerationSchema),
//     (req, res, next) => {
//         console.log('Generate endpoint hit with data:', req.body);
//         next();
//     },
//     ringtoneController.generate
// );

// // Log when no route matches
// ringtoneRouter.use((req, res, next) => {
//     console.log('No matching ringtone route for:', req.path);
//     next();
// });

// export default ringtoneRouter;

// routes/api/ringtone-router.js
import express from "express";
import { authenticate, isEmptyBody } from "../../middleware/index.js";
import { validateBody } from "../../decorators/index.js";
import { ringtoneGenerationSchema } from "../../schemas/ringtone-schema.js";
import ringtoneController from "../../controllers/ringtone-controller.js";

const ringtoneRouter = express.Router();

ringtoneRouter.use(authenticate);

ringtoneRouter.post(
    "/generate",
    isEmptyBody,
    validateBody(ringtoneGenerationSchema),
    ringtoneController.generate
);

ringtoneRouter.get(
    "/",
    ringtoneController.getUserRingtones
);

export default ringtoneRouter;