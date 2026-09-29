const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

// Uploads a single image file straight from the browser using an
// unsigned upload preset (no API secret needed on the client).
// Resolves to the hosted image URL, which is stored exactly like any
// other image URL already used across the product catalog.
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary is not configured yet.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = await response.json();
  return data.secure_url as string;
};
