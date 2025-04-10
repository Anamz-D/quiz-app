 // Cloudinary configuration and helper functions
const CLOUDINARY_CLOUD_NAME = "dkf6wuffq"
const CLOUDINARY_UPLOAD_PRESET = "encore" // Create this in your Cloudinary dashboard

/**
 * Uploads an image to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - The folder to upload to (e.g., 'profile_pictures', 'assessments')
 * @returns {Promise<string>} - The URL of the uploaded image
 */
async function uploadToCloudinary(file, folder) {
  if (!file) return null

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
  formData.append("folder", folder)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${dkf6wuffq}/auto/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Upload failed")
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}

/**
 * Deletes an image from Cloudinary
 * @param {string} url - The URL of the image to delete
 * @returns {Promise<boolean>} - Whether the deletion was successful
 */
async function deleteFromCloudinary(url) {
  if (!url) return true

  // Extract the public_id from the URL
  // Cloudinary URLs look like: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/filename.jpg
  const urlParts = url.split("/")
  const filenameWithExtension = urlParts[urlParts.length - 1]
  const publicIdParts = urlParts.slice(urlParts.indexOf("upload") + 1)
  const publicId = publicIdParts.join("/").split(".")[0] // Remove file extension

  try {
    // Note: For security reasons, you should implement this deletion on your server
    // This is a simplified example that would require a server-side implementation
    console.log(`To delete this image, you would need to call the Cloudinary API with public_id: ${publicId}`)

    // In a real implementation, you would make a server-side API call:
    // const response = await fetch('/api/delete-image', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ public_id: publicId })
    // });

    return true
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return false
  }
}

export { uploadToCloudinary, deleteFromCloudinary }

