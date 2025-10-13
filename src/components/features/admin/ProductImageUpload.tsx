'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  Coffee,
  AlertCircle,
  Check,
} from 'lucide-react';

import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Switch } from '@/presentation/components/ui/switch';
import { Progress } from '@/presentation/components/ui/progress';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { EnhancedProductImage } from '@/shared/components/performance/EnhancedOptimizedImage';
import { cn } from '@/lib/utils';

export interface UploadedImage {
  id: string;
  file?: File; // Optional for existing images
  cloudinaryId?: string;
  url?: string;
  alt: string;
  caption?: string;
  category: 'product' | 'packaging' | 'origin' | 'process' | 'quality';
  isPrimary: boolean;
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

// Type for existing images from database
export interface ExistingImage {
  id: string;
  url: string;
  alt: string;
  category: string;
  isPrimary: boolean;
}

interface ProductImageUploadProps {
  productId?: string;
  existingImages?: ExistingImage[];
  onImagesChange?: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

const imageCategoryOptions = [
  {
    value: 'product',
    label: 'Product Photo',
    description: 'Main product shots',
  },
  {
    value: 'packaging',
    label: 'Packaging',
    description: 'Bags, boxes, labels',
  },
  { value: 'origin', label: 'Origin', description: 'Farm, plantation, region' },
  {
    value: 'process',
    label: 'Processing',
    description: 'Roasting, grinding, preparation',
  },
  {
    value: 'quality',
    label: 'Quality Control',
    description: 'Grading, testing, certification',
  },
];

// Convert existing images to UploadedImage format
const convertExistingImages = (
  existingImages: ExistingImage[]
): UploadedImage[] => {
  return existingImages.map(img => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    category: img.category as
      | 'product'
      | 'packaging'
      | 'origin'
      | 'process'
      | 'quality',
    isPrimary: img.isPrimary,
    uploadProgress: 100,
    uploadStatus: 'success' as const,
  }));
};

export function ProductImageUpload({
  productId,
  existingImages = [],
  onImagesChange,
  maxImages = 10,
  maxFileSize = 5, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className,
}: ProductImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(
    convertExistingImages(existingImages)
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update images when existingImages prop changes
  useEffect(() => {
    setImages(convertExistingImages(existingImages));
  }, [existingImages]);

  const updateImages = useCallback(
    (newImages: UploadedImage[]) => {
      setImages(newImages);
      onImagesChange?.(newImages);
    },
    [onImagesChange]
  );

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!allowedTypes.includes(file.type)) {
        return `File type ${file.type} is not allowed. Please use: ${allowedTypes.join(', ')}`;
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        return `File size must be less than ${maxFileSize}MB`;
      }

      return null;
    },
    [allowedTypes, maxFileSize]
  );

  const generateImageId = () =>
    `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: UploadedImage[] = [];
      const currentImageCount = images.length;

      for (
        let i = 0;
        i < files.length && currentImageCount + newImages.length < maxImages;
        i++
      ) {
        const file = files[i];
        if (!file) continue;

        const validationError = validateFile(file);

        if (validationError) {
          // You could show a toast notification here
          // File validation error logging removed for production
          continue;
        }

        const imageId = generateImageId();
        const newImage: UploadedImage = {
          id: imageId,
          file,
          alt: `${file.name.split('.')[0]} - Coffee product image`,
          category: 'product',
          isPrimary: images.length === 0 && newImages.length === 0, // First image is primary
          uploadProgress: 0,
          uploadStatus: 'pending',
        };

        newImages.push(newImage);
      }

      if (newImages.length > 0) {
        updateImages([...images, ...newImages]);
        // Start upload process
        uploadImages(newImages);
      }
    },
    [images, maxImages, validateFile, updateImages]
  );

  const uploadImages = async (imagesToUpload: UploadedImage[]) => {
    setIsUploading(true);

    for (const image of imagesToUpload) {
      // Skip images that don't have files (existing images)
      if (!image.file) continue;

      try {
        // Update status to uploading
        updateImageStatus(image.id, 'uploading', 0);

        // Create FormData for Cloudinary upload
        const formData = new FormData();
        formData.append('file', image.file);
        formData.append(
          'upload_preset',
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
        );
        formData.append('folder', `products/${productId || 'temp'}`);
        formData.append('public_id', `${productId || 'temp'}_${image.id}`);

        // Simulate upload progress (in real implementation, you'd track actual progress)
        const progressInterval = setInterval(() => {
          updateImageStatus(
            image.id,
            'uploading',
            Math.min(90, image.uploadProgress + 10)
          );
        }, 200);

        // Upload to Cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        clearInterval(progressInterval);

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        // Update image with Cloudinary data
        updateImageWithCloudinaryData(image.id, {
          cloudinaryId: result.public_id,
          url: result.secure_url,
          uploadProgress: 100,
          uploadStatus: 'success',
        });
      } catch (error) {
        // Upload error logging removed for production
        updateImageStatus(
          image.id,
          'error',
          0,
          error instanceof Error ? error.message : 'Upload failed'
        );
      }
    }

    setIsUploading(false);
  };

  const updateImageStatus = (
    imageId: string,
    status: UploadedImage['uploadStatus'],
    progress: number,
    errorMessage?: string
  ) => {
    setImages(prev =>
      prev.map(img =>
        img.id === imageId
          ? {
              ...img,
              uploadStatus: status,
              uploadProgress: progress,
              ...(errorMessage ? { errorMessage } : {}),
            }
          : img
      )
    );
  };

  const updateImageWithCloudinaryData = (
    imageId: string,
    data: Partial<UploadedImage>
  ) => {
    setImages(prev => {
      const updated = prev.map(img =>
        img.id === imageId ? { ...img, ...data } : img
      );
      onImagesChange?.(updated);
      return updated;
    });
  };

  const updateImageMetadata = (
    imageId: string,
    updates: Partial<UploadedImage>
  ) => {
    const updatedImages = images.map(img =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    updateImages(updatedImages);
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);

    // If we removed the primary image, make the first remaining image primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      const firstImage = updatedImages[0];
      if (firstImage) {
        firstImage.isPrimary = true;
      }
    }

    updateImages(updatedImages);
  };

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    updateImages(updatedImages);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  const canAddMoreImages = images.length < maxImages;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Upload Area */}
      {canAddMoreImages && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Upload Product Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                isDragOver
                  ? 'border-coffee-500 bg-coffee-50'
                  : 'border-coffee-300 hover:border-coffee-400 hover:bg-coffee-50/50'
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={allowedTypes.join(',')}
                onChange={handleFileInputChange}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />

              <div className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coffee-100">
                  <Upload className="h-8 w-8 text-coffee-600" />
                </div>

                <div>
                  <p className="text-lg font-medium text-coffee-900">
                    Drop images here or click to browse
                  </p>
                  <p className="text-sm text-coffee-600">
                    Support for {allowedTypes.join(', ')} up to {maxFileSize}MB
                    each
                  </p>
                  <p className="text-xs text-coffee-500">
                    {images.length} / {maxImages} images uploaded
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Images ({images.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {images.map(image => (
              <div
                key={image.id}
                className="grid grid-cols-1 gap-4 rounded-lg border p-4 lg:grid-cols-4"
              >
                {/* Image Preview */}
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-coffee-100">
                    {image.cloudinaryId ? (
                      <EnhancedProductImage
                        publicId={image.cloudinaryId}
                        alt={image.alt}
                        size="thumbnail"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Coffee className="h-12 w-12 text-coffee-400" />
                      </div>
                    )}
                  </div>

                  {/* Upload Status */}
                  {image.uploadStatus === 'uploading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-center text-white">
                        <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <p className="text-xs">{image.uploadProgress}%</p>
                      </div>
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="absolute right-2 top-2 flex flex-col gap-1">
                    {image.isPrimary && (
                      <Badge className="bg-gold-500 text-white">Primary</Badge>
                    )}
                    {image.uploadStatus === 'success' && (
                      <Badge className="bg-green-500 text-white">
                        <Check className="mr-1 h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                    {image.uploadStatus === 'error' && (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Error
                      </Badge>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute left-2 top-2 h-6 w-6"
                    onClick={() => removeImage(image.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Image Metadata */}
                <div className="space-y-4 lg:col-span-3">
                  {/* Upload Progress */}
                  {image.uploadStatus === 'uploading' && (
                    <div>
                      <Label className="text-sm">Upload Progress</Label>
                      <Progress value={image.uploadProgress} className="mt-1" />
                    </div>
                  )}

                  {/* Error Message */}
                  {image.uploadStatus === 'error' && image.errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{image.errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Alt Text */}
                    <div>
                      <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
                      <Input
                        id={`alt-${image.id}`}
                        value={image.alt}
                        onChange={e =>
                          updateImageMetadata(image.id, { alt: e.target.value })
                        }
                        placeholder="Describe the image for accessibility"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <Label htmlFor={`category-${image.id}`}>Category</Label>
                      <Select
                        value={image.category}
                        onValueChange={value =>
                          updateImageMetadata(image.id, {
                            category: value as UploadedImage['category'],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {imageCategoryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div>
                                <div className="font-medium">
                                  {option.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {option.description}
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Caption */}
                  <div>
                    <Label htmlFor={`caption-${image.id}`}>
                      Caption (Optional)
                    </Label>
                    <Textarea
                      id={`caption-${image.id}`}
                      value={image.caption || ''}
                      onChange={e =>
                        updateImageMetadata(image.id, {
                          caption: e.target.value,
                        })
                      }
                      placeholder="Add a caption for this image"
                      rows={2}
                    />
                  </div>

                  {/* Primary Image Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`primary-${image.id}`}
                      checked={image.isPrimary}
                      onCheckedChange={() => setPrimaryImage(image.id)}
                    />
                    <Label htmlFor={`primary-${image.id}`}>
                      Set as primary image
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {images.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm text-coffee-600">
              <span>Total Images: {images.length}</span>
              <span>
                Uploaded:{' '}
                {images.filter(img => img.uploadStatus === 'success').length}
              </span>
              <span>
                Pending:{' '}
                {
                  images.filter(
                    img =>
                      img.uploadStatus === 'pending' ||
                      img.uploadStatus === 'uploading'
                  ).length
                }
              </span>
              <span>
                Errors:{' '}
                {images.filter(img => img.uploadStatus === 'error').length}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
