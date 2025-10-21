import { User } from '@/domain/entities/user.entity';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  company?: string;
  phoneNumber?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  phoneNumber?: string;
  bio?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get user profile data
 */
export async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch user profile',
    };
  }
}

/**
 * Update user profile data
 */
export async function updateUserProfile(
  profileData: UpdateUserProfileData
): Promise<ApiResponse<UserProfile>> {
  try {
    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update user profile',
    };
  }
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(
  file: File
): Promise<ApiResponse<{ avatarUrl: string }>> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    };
  }
}

/**
 * Delete user avatar
 */
export async function deleteAvatar(): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/user/avatar', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting avatar:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete avatar',
    };
  }
}

/**
 * Get user preferences
 */
export async function getUserPreferences(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch user preferences',
    };
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  preferences: any
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch('/api/user/preferences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update user preferences',
    };
  }
}
