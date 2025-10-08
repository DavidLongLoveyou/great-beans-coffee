# Video Assets Directory

This directory contains video assets for The Great Beans website.

## Required Video Files

### coffee-farm-processing.mp4

- **Purpose**: Background video for the hero section
- **Recommended specs**:
  - Resolution: 1920x1080 (Full HD) or higher
  - Format: MP4 (H.264 codec)
  - Duration: 30-60 seconds (looping)
  - File size: < 10MB for optimal loading
  - Content: Coffee farm scenes, processing facilities, quality control

### Poster Image

- **File**: `coffee-farm-processing-poster.svg` (already created)
- **Purpose**: Fallback image shown before video loads
- **Shows**: Professional coffee farm landscape with processing facility

## Content Guidelines

The hero video should showcase:

1. **Coffee Farm Landscapes**: Lush green coffee plantations in Vietnamese highlands
2. **Processing Facilities**: Modern coffee processing and quality control
3. **Quality Assurance**: Workers inspecting beans, certification processes
4. **Export Operations**: Packaging, shipping containers, port activities

## Technical Requirements

- **Autoplay-friendly**: No audio or muted audio for autoplay compliance
- **Mobile-optimized**: Compressed for mobile data usage
- **Accessibility**: Provide captions or descriptive text alternatives
- **Performance**: Optimized for fast loading across all devices

## Placeholder Status

Currently using poster image as fallback. Replace with actual video content when available.

## Usage

The video is referenced in:

- `src/app/[locale]/page.tsx` - Hero section background
- `src/presentation/components/sections/ServerHeroSection.tsx` - Video component
