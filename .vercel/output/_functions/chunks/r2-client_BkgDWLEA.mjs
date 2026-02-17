import { S3Client } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
function isR2Configured() {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);
}
if (!isR2Configured()) {
  const missingVars = [];
  if (!R2_ACCOUNT_ID) missingVars.push("R2_ACCOUNT_ID");
  if (!R2_ACCESS_KEY_ID) missingVars.push("R2_ACCESS_KEY_ID");
  if (!R2_SECRET_ACCESS_KEY) missingVars.push("R2_SECRET_ACCESS_KEY");
  if (!R2_BUCKET_NAME) missingVars.push("R2_BUCKET_NAME");
  console.error(
    `⚠️  Cloudflare R2 no está configurado correctamente. Faltan variables: ${missingVars.join(", ")}`
  );
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `R2 Configuration Error: Faltan variables de entorno requeridas para R2: ${missingVars.join(", ")}`
    );
  }
}
const r2Client = isR2Configured() ? new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
}) : null;
const bucketName = R2_BUCKET_NAME || "";
function extractFilenameFromUrl(imageUrl) {
  try {
    if (!imageUrl || typeof imageUrl !== "string") {
      return null;
    }
    const filename = imageUrl.split("/").pop();
    if (!filename || filename.trim() === "") {
      console.warn(`Invalid filename extracted from URL: ${imageUrl}`);
      return null;
    }
    return filename;
  } catch (error) {
    console.error("Error extracting filename from URL:", error);
    return null;
  }
}

export { bucketName as b, extractFilenameFromUrl as e, r2Client as r };
