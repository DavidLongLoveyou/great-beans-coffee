/**
 * Image utilities for handling product image URLs
 */

/**
 * Converts a product image filename or URL to a full static image path
 * @param imageUrl - The image URL or filename from the API
 * @returns Full path to the image in the public directory
 */
export function getProductImageUrl(imageUrl: string): string {
  // Type guard: ensure imageUrl is a string
  if (typeof imageUrl !== 'string' || !imageUrl) {
    return '/images/placeholder/coffee-placeholder.svg';
  }

  // If it's already a full URL (starts with http/https), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it already starts with /images/, return as is
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }

  // If it's just a filename, prepend the products directory path
  return `/images/products/${imageUrl}`;
}

/**
 * Converts an array of image filenames to full URLs
 * @param images - Array of image filenames or URLs
 * @returns Array of full image URLs
 */
export function getProductImageUrls(images: string[]): string[] {
  return images.map(getProductImageUrl);
}

/**
 * Gets the primary image URL from an array of images
 * @param images - Array of image filenames/URLs or image objects with url property
 * @returns The first image URL or a default placeholder
 */
export function getPrimaryImageUrl(
  images: string[] | Array<{ url: string; alt: string; isPrimary?: boolean }>
): string {
  if (!images || images.length === 0) {
    return '/images/placeholder/coffee-placeholder.svg';
  }

  // Handle array of image objects
  if (
    typeof images[0] === 'object' &&
    images[0] !== null &&
    'url' in images[0]
  ) {
    const imageObjects = images as Array<{
      url: string;
      alt: string;
      isPrimary?: boolean;
    }>;

    // Try to find the primary image first
    const primaryImage = imageObjects.find(img => img.isPrimary);
    if (primaryImage) {
      return getProductImageUrl(primaryImage.url);
    }

    // If no primary image, use the first one (with safety check)
    const firstImage = imageObjects[0];
    if (firstImage && firstImage.url) {
      return getProductImageUrl(firstImage.url);
    }

    // Fallback to placeholder if no valid image found
    return '/images/placeholder/coffee-placeholder.svg';
  }

  // Handle array of strings
  return getProductImageUrl(images[0] as string);
}

/**
 * Creates a placeholder SVG for missing product images
 * @param width - Width of the placeholder
 * @param height - Height of the placeholder
 * @returns Data URL for an SVG placeholder
 */
export function createImagePlaceholder(
  width: number = 400,
  height: number = 300
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <g transform="translate(${width / 2}, ${height / 2})">
        <circle r="30" fill="#d1d5db"/>
        <path d="M-15,-10 L15,-10 L15,10 L-15,10 Z" fill="#9ca3af"/>
        <circle cx="0" cy="-5" r="3" fill="#6b7280"/>
      </g>
      <text x="50%" y="80%" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="14">
        Coffee Image
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
