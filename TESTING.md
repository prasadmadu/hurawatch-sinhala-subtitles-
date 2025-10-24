# Testing Guide

## Quick Test Checklist

### 1. Generate Icons First! (REQUIRED)
Before loading the extension, you MUST create the icon files:

1. Open `icons/create_icons.html` in Chrome
2. Wait for 3 PNG files to download automatically
3. Move them to the `icons/` folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

**Extension will NOT load without these icons!**

### 2. Load Extension in Chrome

1. Open Chrome: `chrome://extensions/`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select the `shurawatchzz` folder
5. Verify extension appears in list

### 3. Test on HuraWatch

#### Test URL
Use this movie page: `https://hurawatchzz.tv/watch-movie/watch-the-foreigner-movies-free-hd-on-hurawatch-18721.5349772`

#### Important: Iframe Video Detection
**HuraWatch embeds videos in iframes** (e.g., from videostr.net). The extension automatically handles this:
- Content script runs in BOTH main page AND iframe
- Video detection happens in the iframe (where the actual `<video>` element is)
- You may see console logs from both contexts

#### Testing Steps

**Step 1: Check Extension Popup**
1. Navigate to the test URL and **wait for video to load**
2. Click extension icon
3. Verify popup opens
4. Check status:
   - Video: Should show "Detecting..." then "Detected" when video iframe loads
   - Subtitles: Should show "Not loaded"
5. **Note**: Video detection may take a few seconds while iframe loads

**Step 2: Upload Sample Subtitle**
1. Click "Upload Subtitle File"
2. Select `sample-subtitle.srt` from project folder
3. Check for success message: "Loaded (10 entries)"
4. **Subtitles should appear on video**

**Step 3: Test Controls**

- **Toggle Visibility**: Click Hide/Show button
  - Subtitles should disappear/appear

- **Timing Adjustment**:
  - Click `+0.5s` - subtitles should advance
  - Click `-0.5s` - subtitles should delay
  - Click `Reset` - return to 0.0s

**Step 4: Test Appearance Settings**
1. Click "⚙️ Appearance Settings"
2. Change font size to "Large"
3. Change text color (try yellow: #FFFF00)
4. Change position to "Top"
5. Click "Apply Settings"
6. **Verify changes appear on video**

### 4. Console Debugging

#### Check for Errors

**Content Script Console** (F12 on HuraWatch page):
```
[Sinhala Subtitles] Initializing... https://hurawatchzz.tv/...
[Sinhala Subtitles] Initializing... https://videostr.net/...  ← iframe
[Sinhala Subtitles] Video player found  ← from iframe
[Sinhala Subtitles] Video setup complete
[Sinhala Subtitles] Overlay created
[Sinhala Subtitles] Loaded 10 subtitle entries
```
**Note**: You'll see TWO "Initializing" messages - one from main page, one from iframe. This is normal!

**Popup Console** (Right-click extension icon → Inspect):
```
Should show no errors
Messages sent/received successfully
```

#### Common Console Errors and Fixes

**Error: "Cannot read property of undefined"**
- Check if video element exists
- Verify content script injected properly

**Error: "Failed to execute sendMessage"**
- Content script may not be running
- Reload the page

**Error: "Uncaught TypeError"**
- Check file paths in manifest.json
- Verify all JS files exist

### 5. Edge Cases to Test

#### Video Not Detected
- **Cause**: Video loads after content script
- **Test**: Refresh page and check again
- **Expected**: Should detect within 30 seconds

#### Fullscreen Mode
1. Enter fullscreen on video
2. **Expected**: Subtitles still visible
3. **Expected**: Positioned correctly

#### Seeking/Skipping
1. Skip to different timestamp
2. **Expected**: Subtitle updates immediately

#### Multiple Videos on Page
1. If page has multiple videos
2. **Expected**: Works with first `<video>` element

### 6. Settings Persistence Test

1. Change settings (font size, color, position)
2. Apply settings
3. **Close popup**
4. **Reload page**
5. Open popup again
6. **Expected**: Settings remembered
7. **Expected**: Subtitles use saved settings

### 7. Performance Test

1. Upload subtitle with 100+ entries
2. Play video and scrub timeline
3. **Expected**: No lag or stuttering
4. **Expected**: Smooth subtitle transitions

### 8. Error Handling Tests

#### Invalid File Upload
1. Try uploading a .txt file
2. **Expected**: Error message displayed
3. **Expected**: No crash

#### Empty File
1. Upload empty .srt file
2. **Expected**: "No valid subtitles found" error

#### Corrupted SRT
1. Upload malformed SRT file
2. **Expected**: Validation error
3. **Expected**: Graceful failure

## Known Issues to Check

### Issue 1: Icons Not Loading
**Symptom**: Extension card shows broken image icons
**Fix**: Generate PNG icons from `create_icons.html`

### Issue 2: Subtitles Not Appearing
**Check**:
- Is video detected? (Check popup status)
- Is file uploaded successfully?
- Are subtitles visible? (Not toggled off)
- Console errors?

### Issue 3: Wrong Timing
**Check**:
- Do subtitle timestamps match video version?
- Try timing adjustment controls
- Verify SRT format is correct

### Issue 4: Sinhala Text Shows as Boxes
**Check**:
- File encoding is UTF-8
- System has Sinhala fonts
- Browser supports Unicode

### Issue 5: Settings Not Saving
**Check**:
- Chrome Storage permission granted
- No console errors
- Try resetting settings

## Debugging Tools

### Chrome DevTools

**Content Script**:
1. F12 on HuraWatch page
2. Console tab
3. Look for `[Sinhala Subtitles]` logs

**Popup**:
1. Right-click extension icon
2. "Inspect"
3. Console tab

**Background** (if needed):
1. Go to `chrome://extensions/`
2. Find extension
3. Click "Inspect views: background page"

### Manual Testing Commands

In **popup console**:
```javascript
// Check if controller exists
window.popupController

// Get current settings
StorageManager.loadSettings().then(console.log)

// Get status
// (sent to content script)
```

In **content script console**:
```javascript
// Check if overlay exists
window.subtitleOverlay

// Get current subtitle count
window.subtitleOverlay.subtitles.length

// Get current time offset
window.subtitleOverlay.timingOffset

// Manually load test subtitles
window.subtitleOverlay.loadSubtitles([
  {startTime: 1, endTime: 5, text: "Test subtitle"}
])
```

## Success Criteria

✅ Extension loads without errors
✅ Video detected on HuraWatch
✅ Subtitle file uploads successfully
✅ Subtitles appear synchronized with video
✅ All controls work (toggle, timing, settings)
✅ Settings persist after reload
✅ No console errors
✅ Fullscreen mode works
✅ Sinhala text renders correctly

## Next Steps After Testing

1. **Found bugs?** - Document and fix them
2. **Works perfectly?** - Test with real Sinhala subtitle files
3. **Ready for production?** - Create icons with Sinhala text
4. **Want to share?** - Prepare for Chrome Web Store submission

## Getting Real Subtitle Files

For testing with actual content:

1. Find subtitle on [OpenSubtitles](https://www.opensubtitles.org)
2. Search for movie name + "Sinhala"
3. Download .srt file
4. Upload to extension

**Important**: Match subtitle version with video version!

## Reporting Issues

When reporting bugs, include:

1. Chrome version
2. Operating system
3. Steps to reproduce
4. Console errors (screenshot)
5. Expected vs actual behavior

Good luck testing! 🎉
