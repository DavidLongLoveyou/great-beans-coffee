'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import { Button } from '@/presentation/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Progress } from '@/presentation/components/ui/progress';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentAvatar?: string;
  fallbackText: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function AvatarUpload({
  currentAvatar,
  fallbackText,
  onAvatarChange,
  size = 'md',
  disabled = false,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-12 w-12',
    md: 'h-20 w-20',
    lg: 'h-32 w-32',
  };

  const buttonSizeClasses = {
    sm: 'h-6 w-6 -bottom-1 -right-1',
    md: 'h-8 w-8 -bottom-2 -right-2',
    lg: 'h-10 w-10 -bottom-3 -right-3',
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowUploadDialog(true);
  };

  const handleUpload = async () => {
    if (!previewUrl || !fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload to API
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();

      if (result.success) {
        onAvatarChange(result.data.avatarUrl);
        setUploadProgress(100);
        toast.success('Avatar updated successfully');

        setTimeout(() => {
          setShowUploadDialog(false);
          setPreviewUrl(null);
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload avatar'
      );
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setShowUploadDialog(false);
    setUploadProgress(0);
    setIsUploading(false);
  };

  return (
    <>
      <div className="relative">
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={currentAvatar} alt="Avatar" />
          <AvatarFallback
            className={
              size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'
            }
          >
            {fallbackText}
          </AvatarFallback>
        </Avatar>

        {!disabled && (
          <Button
            size="sm"
            variant="outline"
            className={`absolute rounded-full p-0 ${buttonSizeClasses[size]}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
          </Button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Avatar</DialogTitle>
            <DialogDescription>
              Preview your new avatar and confirm the upload.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4">
            {previewUrl && (
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewUrl} alt="Preview" />
                <AvatarFallback className="text-2xl">
                  {fallbackText}
                </AvatarFallback>
              </Avatar>
            )}

            {isUploading && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || !previewUrl}
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
