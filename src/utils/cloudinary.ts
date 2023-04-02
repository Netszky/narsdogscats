import cloudinary from 'cloudinary';
export const getPublicIdFromUrl = (url: string): string | null => {
    const cloudname = process.env.CLOUDNAME
    const regex = new RegExp(`https?:\\/\\/res\\.cloudinary\\.com\\/${cloudname}\\/image\\/upload\\/.+\\/animaux\\/(.+?)(\\.webp)?$`);
    const match = url.match(regex);
    return match ? match[1] : null;
}
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        const response = await cloudinary.v2.uploader.destroy(`animaux/${publicId}`);
    } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
        throw error;
    }
}