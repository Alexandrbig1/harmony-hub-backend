// // controllers/ringtone-controller.js
// import { ElevenLabsClient } from "elevenlabs";
// import { ctrlWrapper } from "../decorators/index.js";
// import HttpError from "../helpers/HttpError.js";
// import fs from 'fs/promises';
// import path from 'path';
// import { v4 as uuidv4 } from 'uuid';

// const generate = async (req, res) => {
//     try {
//         const { caller, instrument, genre, popStar, vibe } = req.body;
//         const { _id: userId } = req.user;

//         if (!process.env.ELEVENLABS_API_KEY) {
//             throw HttpError(500, "ElevenLabs API key not configured");
//         }

//         const client = new ElevenLabsClient({
//             apiKey: process.env.ELEVENLABS_API_KEY
//         });

//         const prompt = `Create a ${genre} style ringtone featuring a prominent ${instrument}. The sound should capture the essence of ${popStar}'s musical style with a ${vibe} feel, perfect for when ${caller} calls.`;

//         console.log('Attempting ElevenLabs request with:', {
//             apiKey: `${process.env.ELEVENLABS_API_KEY.substring(0, 5)}...`,
//             text: prompt,
//             duration_seconds: 20
//         });

//         try {
//             // Generate a unique filename
//             const fileName = `${uuidv4()}.mp3`;
//             const uploadDir = path.join(process.cwd(), 'public', 'uploads');
//             const filePath = path.join(uploadDir, fileName);

//             // Ensure uploads directory exists
//             await fs.mkdir(uploadDir, { recursive: true });

//             // Generate sound effect and get the stream
//             const soundEffect = await client.textToSoundEffects.convert({
//                 text: prompt,
//                 model_id: "eleven_multilingual_v2",
//                 duration_seconds: 20,
//                 output_format: "mp3"
//             });

//             if (!soundEffect) {
//                 throw HttpError(500, "No response from ElevenLabs");
//             }

//             // Convert the stream to a buffer
//             const chunks = [];
//             for await (const chunk of soundEffect) {
//                 chunks.push(chunk);
//             }
//             const buffer = Buffer.concat(chunks);

//             // Save the buffer to a file
//             await fs.writeFile(filePath, buffer);

//             // Generate the public URL
//             const publicUrl = `/uploads/${fileName}`;

//             console.log('Audio file saved:', {
//                 path: filePath,
//                 url: publicUrl
//             });

//             res.json({
//                 url: publicUrl,
//                 message: "Ringtone generated successfully"
//             });

//         } catch (apiError) {
//             console.error('ElevenLabs API Error Details:', {
//                 error: apiError,
//                 message: apiError.message,
//                 response: apiError.response?.data,
//                 status: apiError.response?.status
//             });

//             if (apiError.message?.includes('401') || apiError.response?.status === 401) {
//                 throw HttpError(500, "Invalid ElevenLabs API key");
//             }

//             if (apiError.message?.includes('400') || apiError.response?.status === 400) {
//                 throw HttpError(400, "Invalid request parameters for sound generation");
//             }

//             throw HttpError(500, `ElevenLabs API error: ${apiError.message}`);
//         }
//     } catch (error) {
//         console.error('Generate error:', {
//             message: error.message,
//             status: error.status,
//             stack: error.stack
//         });
//         throw error.status ? error : HttpError(500, error.message);
//     }
// };

// export default {
//     generate: ctrlWrapper(generate)
// };

// controllers/ringtone-controller.js
// import { ElevenLabsClient } from "elevenlabs";
// import { ctrlWrapper } from "../decorators/index.js";
// import HttpError from "../helpers/HttpError.js";
// import User from "../models/Users.js";

// const generate = async (req, res) => {
//     try {
//         const { caller, instrument, genre, popStar, vibe } = req.body;
//         const { _id: userId } = req.user;

//         if (!process.env.ELEVENLABS_API_KEY) {
//             throw HttpError(500, "ElevenLabs API key not configured");
//         }

//         const client = new ElevenLabsClient({
//             apiKey: process.env.ELEVENLABS_API_KEY
//         });

//         const prompt = `Create a ${genre} style ringtone featuring a prominent ${instrument}. The sound should capture the essence of ${popStar}'s musical style with a ${vibe} feel, perfect for when ${caller} calls.`;

//         console.log('Attempting ElevenLabs request...');

//         try {
//             // Get the stream from ElevenLabs
//             const soundEffectStream = await client.textToSoundEffects.convert({
//                 text: prompt,
//                 model_id: "eleven_multilingual_v2",
//                 duration_seconds: 20,
//                 output_format: "mp3"
//             });

//             // Convert stream to buffer
//             const chunks = [];
//             for await (const chunk of soundEffectStream) {
//                 chunks.push(chunk);
//             }
//             const audioBuffer = Buffer.concat(chunks);

//             // Convert buffer to base64
//             const base64Audio = audioBuffer.toString('base64');
//             const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

//             // Save ringtone data to user's document
//             const user = await User.findByIdAndUpdate(
//                 userId,
//                 {
//                     $push: {
//                         ringtones: {
//                             caller,
//                             instrument,
//                             genre,
//                             popStar,
//                             vibe,
//                             audioUrl
//                         }
//                     }
//                 },
//                 { new: true }
//             );

//             if (!user) {
//                 throw HttpError(404, "User not found");
//             }

//             // Get the newly added ringtone
//             const newRingtone = user.ringtones[user.ringtones.length - 1];

//             console.log('Successfully generated and saved ringtone');

//             res.json({
//                 url: audioUrl,
//                 ringtoneId: newRingtone._id,
//                 message: "Ringtone generated and saved successfully"
//             });

//         } catch (apiError) {
//             console.error('ElevenLabs API Error Details:', {
//                 error: apiError,
//                 message: apiError.message,
//                 stack: apiError.stack
//             });

//             if (apiError.message?.includes('401')) {
//                 throw HttpError(500, "Invalid ElevenLabs API key");
//             }

//             if (apiError.message?.includes('400')) {
//                 throw HttpError(400, "Invalid request parameters for sound generation");
//             }

//             throw HttpError(500, `ElevenLabs API error: ${apiError.message}`);
//         }
//     } catch (error) {
//         console.error('Generate error:', {
//             message: error.message,
//             status: error.status,
//             stack: error.stack
//         });
//         throw error.status ? error : HttpError(500, error.message);
//     }
// };

// const getUserRingtones = async (req, res) => {
//     const { _id: userId } = req.user;

//     const user = await User.findById(userId);
//     if (!user) {
//         throw HttpError(404, "User not found");
//     }

//     res.json({
//         ringtones: user.ringtones,
//         message: "Ringtones retrieved successfully"
//     });
// };

// export default {
//     generate: ctrlWrapper(generate),
//     getUserRingtones: ctrlWrapper(getUserRingtones)
// };

// controllers/ringtone-controller.js
import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import User from "../models/Users.js";
import axios from "axios";

const generate = async (req, res) => {
    try {
        const { caller, instrument, genre, popStar, vibe } = req.body;
        const { _id: userId } = req.user;

        if (!process.env.ELEVENLABS_API_KEY) {
            throw HttpError(500, "ElevenLabs API key not configured");
        }

        const prompt = `Create a ${genre} style ringtone featuring a prominent ${instrument}. The sound should capture the essence of ${popStar}'s musical style with a ${vibe} feel, perfect for when ${caller} calls.`;

        console.log('Starting ringtone generation with prompt:', prompt);

        try {
            const response = await axios.post(
                'https://api.elevenlabs.io/v1/sound-generation',
                {
                    text: prompt,
                    duration_seconds: 20,
                    prompt_influence: 0.7
                },
                {
                    headers: {
                        'xi-api-key': process.env.ELEVENLABS_API_KEY,
                        'Accept': 'audio/mpeg',
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            if (!response.data) {
                throw HttpError(500, "No audio data received");
            }

            // Convert the audio buffer to base64
            const base64Audio = Buffer.from(response.data).toString('base64');
            const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

            // Save to user's document
            const user = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        ringtones: {
                            caller,
                            instrument,
                            genre,
                            popStar,
                            vibe,
                            audioUrl
                        }
                    }
                },
                { new: true }
            );

            if (!user) {
                throw HttpError(404, "User not found");
            }

            // Get the newly added ringtone
            const newRingtone = user.ringtones[user.ringtones.length - 1];

            console.log('Successfully saved ringtone to database');

            // Return the audio data URL to the frontend
            res.json({
                url: audioUrl,
                ringtoneId: newRingtone._id,
                message: "Ringtone generated successfully"
            });

        } catch (apiError) {
            console.error('ElevenLabs API Error:', {
                status: apiError.response?.status,
                message: apiError.message
            });

            // Try to parse error response if it exists
            if (apiError.response?.data) {
                const errorText = Buffer.from(apiError.response.data).toString();
                console.error('API Error Details:', errorText);
            }

            if (apiError.response?.status === 401) {
                throw HttpError(500, "Invalid ElevenLabs API key");
            }

            if (apiError.response?.status === 400) {
                throw HttpError(400, "Invalid request parameters for sound generation");
            }

            throw HttpError(500, `Sound effect generation failed: ${apiError.message}`);
        }
    } catch (error) {
        console.error('Generate error:', {
            message: error.message,
            status: error.status,
            stack: error.stack
        });
        throw error.status ? error : HttpError(500, error.message);
    }
};

const getUserRingtones = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const user = await User.findById(userId);

        if (!user) {
            throw HttpError(404, "User not found");
        }

        res.json({
            ringtones: user.ringtones,
            message: "Ringtones retrieved successfully"
        });
    } catch (error) {
        console.error('Get ringtones error:', error);
        throw error.status ? error : HttpError(500, error.message);
    }
};

export default {
    generate: ctrlWrapper(generate),
    getUserRingtones: ctrlWrapper(getUserRingtones)
};