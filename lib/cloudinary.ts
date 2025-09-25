import { v2 as cloudinary } from "cloudinary"

if (typeof window === "undefined") {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

// Upload image to Cloudinary - client-safe version using public API
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "ml_default") // You may need to create an upload preset in Cloudinary

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error("Failed to upload image")
  }
}

export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string
    format?: string
  } = {},
): string => {
  const { width = 800, height = 600, quality = "auto", format = "auto" } = options
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},q_${quality},f_${format},c_fill/${publicId}`
}

export const deleteImage = async (publicId: string): Promise<boolean> => {
  // This should only be called from server-side code (API routes or server actions)
  if (typeof window !== "undefined") {
    console.error("deleteImage should only be called from server-side code")
    return false
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

export default cloudinary
