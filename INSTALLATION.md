# Installation Guide

## Quick Start (5 minutes)

### Step 1: Generate Icons

Before loading the extension, you need to create the icon files:

1. Open `icons/create_icons.html` in your Chrome browser
2. Three PNG files will automatically download:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. Move these files to the `icons/` folder in the project

**Note**: The extension won't load without these icons!

### Step 2: Load Extension

1. Open Chrome and go to: `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked** button
4. Navigate to and select the `shurawatchzz` folder (the one containing `manifest.json`)
5. Click **Select Folder**

### Step 3: Verify Installation

You should see:
- Extension card showing "Sinhala Subtitles for HuraWatch"
- Version: 1.0.0
- Status: Enabled
- Extension icon in your toolbar (if pinned)

### Step 4: Test the Extension

1. Navigate to [hurawatchzz.tv](https://hurawatchzz.tv)
2. Start playing any video
3. Click the extension icon in your toolbar
4. Click "Upload Subtitle File"
5. Select the `sample-subtitle.srt` file from the project folder
6. Subtitles should appear on the video!

## Troubleshooting Installation

### Error: "Manifest file is missing or unreadable"
- Make sure you selected the correct folder (should contain `manifest.json`)
- Check that `manifest.json` exists and is valid JSON

### Error: "Could not load icon"
- You need to generate the icon files first (see Step 1)
- Make sure all three PNG files are in the `icons/` folder

### Extension Loads but Doesn't Work
1. Check Chrome version (requires v100+)
2. Make sure you're on hurawatchzz.tv
3. Refresh the HuraWatch page after installing extension
4. Open browser console (F12) to check for errors

### Icons Won't Generate
If the HTML file doesn't work:
1. Try using an online SVG to PNG converter:
   - Upload `icons/icon.svg`
   - Convert to PNG at sizes 16, 48, and 128
2. Or create simple placeholder icons manually

## Updating the Extension

When you make changes to the code:

1. Go to `chrome://extensions/`
2. Find "Sinhala Subtitles for HuraWatch"
3. Click the refresh/reload icon (circular arrow)
4. Reload any HuraWatch tabs

## Uninstalling

1. Go to `chrome://extensions/`
2. Find "Sinhala Subtitles for HuraWatch"
3. Click **Remove**
4. Confirm removal

Your subtitle files and downloaded content are not affected.

## Testing with Sample File

The project includes `sample-subtitle.srt` with Sinhala text for testing:

1. Open any video on HuraWatch
2. Upload `sample-subtitle.srt`
3. The video should show Sinhala subtitles
4. Test the controls:
   - Toggle visibility
   - Adjust timing
   - Change appearance settings

## Getting Real Subtitle Files

For actual movies/TV shows:

1. Find the exact title and release/version of the video
2. Download matching SRT file from:
   - [OpenSubtitles.org](https://www.opensubtitles.org)
   - [Subscene.com](https://subscene.com)
   - Other subtitle sites
3. Upload to the extension

**Important**: Subtitle file must match the video version exactly for proper sync!

## Chrome Extension Permissions

The extension requests:
- **activeTab**: To detect video player on current tab
- **storage**: To save your preferences
- **hurawatchzz.tv**: To inject subtitle overlay

All processing is local - no data is sent to external servers.
