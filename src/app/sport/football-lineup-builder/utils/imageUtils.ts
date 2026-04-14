/**
 * Image upload and validation utilities
 */

/**
 * Validates if a file is a valid image and within size limits
 * @param file - The file to validate
 * @returns true if valid image file under 2MB, false otherwise
 */
export function validateImageFile(file: File): boolean {
    // Check if file type is an image
    if (!file.type.startsWith("image/")) {
        return false
    }

    // Check if file size is under 2MB
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
        return false
    }

    return true
}

/**
 * Resizes an image to a maximum of 200x200 pixels while maintaining aspect ratio
 * @param file - The image file to resize
 * @returns Promise resolving to data URL of resized image, or null on error
 */
export function resizeImage(file: File): Promise<string | null> {
    return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()

            img.onload = () => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d")

                if (!ctx) {
                    resolve(null)
                    return
                }

                // Calculate new dimensions maintaining aspect ratio
                let width = img.width
                let height = img.height
                const maxDimension = 200

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension
                        width = maxDimension
                    } else {
                        width = (width / height) * maxDimension
                        height = maxDimension
                    }
                }

                canvas.width = width
                canvas.height = height

                // Draw resized image
                ctx.drawImage(img, 0, 0, width, height)

                // Convert to data URL
                const dataUrl = canvas.toDataURL(file.type)
                resolve(dataUrl)
            }

            img.onerror = () => {
                resolve(null)
            }

            img.src = e.target?.result as string
        }

        reader.onerror = () => {
            resolve(null)
        }

        reader.readAsDataURL(file)
    })
}

/**
 * Reads a file and converts it to a data URL
 * @param file - The file to read
 * @returns Promise resolving to data URL string
 */
export function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const result = e.target?.result
            if (typeof result === "string") {
                resolve(result)
            } else {
                reject(new Error("Failed to read file as data URL"))
            }
        }

        reader.onerror = () => {
            reject(new Error("File reading error"))
        }

        reader.readAsDataURL(file)
    })
}
