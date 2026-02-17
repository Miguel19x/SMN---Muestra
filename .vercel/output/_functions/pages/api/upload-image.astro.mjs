import { PutObjectCommand } from '@aws-sdk/client-s3';
import redis from '../../chunks/redis_DF8_68s9.mjs';
import { C as CustomError } from '../../chunks/CustomError_HYyoUHTY.mjs';
import { b as bucketName, r as r2Client } from '../../chunks/r2-client_BkgDWLEA.mjs';
export { renderers } from '../../renderers.mjs';

async function POST({ request }) {
    try {
        const { key } = await request.json();

        // Fetch image data and metadata from Redis
        const [imageData, metadataString] = await Promise.all([
            redis.get(`${key}:data`),
            redis.get(`${key}:metadata`)
        ]);

        if (!imageData || !metadataString) {
            throw new CustomError('Image not found in cache', 404);
        }

        // Log the retrieved metadata for debugging
        console.log('Retrieved metadata:', metadataString);

        // Check if metadataString is a string and parse it
        let metadata;
        if (typeof metadataString === 'string') {
            try {
                metadata = JSON.parse(metadataString);
            } catch (error) {
                console.error("Failed to parse metadata:", error);
                return new Response(JSON.stringify({ error: "Invalid metadata format" }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            // If it's already an object, use it directly
            metadata = metadataString;
        }

        // Remove the data URL prefix if it exists
        const base64Data = imageData.includes('base64,') ? imageData.split('base64,')[1] : imageData;

        // Convert base64 string back to a Buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Create the S3 upload command
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key, // Ensure this key is unique for each image
            Body: buffer,
            ContentType: metadata.type,
            ContentLength: buffer.length,
        });

        // Upload the image to R2
        await r2Client.send(command);

        // Construct the image URL
        const imageUrl = `https://images.nomassecuestros.com/${key}`;

        return new Response(JSON.stringify({ url: imageUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error al subir a R2:", error);
        if (error instanceof CustomError) {
            return new Response(JSON.stringify({ error: 'Error al intentar subir a R2' }), {
                status: error.statusCode,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        throw new CustomError("Error al subir archivo", 500, error.message);
    }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
