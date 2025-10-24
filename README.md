# Sinhala Subtitles for HuraWatch

A Chrome extension that enables Sinhala subtitle support for videos on HuraWatch (hurawatchzz.tv). Watch your favorite movies and TV shows with custom Sinhala subtitles!

## Features

### Core Features (MVP)
- ✅ Upload SRT and VTT subtitle files
- ✅ Automatic subtitle synchronization with video playback
- ✅ Toggle subtitle visibility on/off
- ✅ Timing adjustment controls (+/- 0.5s increments)
- ✅ Sinhala Unicode text support (UTF-8)

### Customization Features
- ✅ Font size adjustment (Small, Medium, Large, Extra Large)
- ✅ Text color customization
- ✅ Background color and opacity control
- ✅ Subtitle position (Top, Middle, Bottom)
- ✅ Settings persistence across sessions
- ✅ Fullscreen mode support

## Installation

### Option 1: Install from Chrome Web Store (Coming Soon)
*Extension will be available on Chrome Web Store after review*

### Option 2: Install Manually (Developer Mode)

1. **Download or Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/shurawatchzz.git
   cd shurawatchzz
   ```

2. **Generate Icons** (Required for first-time setup)
   - Open `icons/create_icons.html` in your browser
   - Download the generated PNG files (icon16.png, icon48.png, icon128.png)
   - Place them in the `icons/` folder

3. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the project folder (the one containing `manifest.json`)

4. **Verify Installation**
   - You should see the extension icon in your toolbar
   - The extension is now active and ready to use!

## Usage

### Getting Started

1. **Navigate to HuraWatch**
   - Go to [hurawatchzz.tv](https://hurawatchzz.tv)
   - Start playing any video

2. **Upload Subtitle File**
   - Click the extension icon in your toolbar
   - Click **"Upload Subtitle File"**
   - Select a `.srt` or `.vtt` file from your computer
   - Subtitles will appear automatically!

### Controls

#### Visibility Toggle
- Click the **Hide/Show** button to toggle subtitle visibility
- Subtitles remain loaded even when hidden

#### Timing Adjustment
If subtitles are out of sync:
- Click **-0.5s** to delay subtitles (if they appear too early)
- Click **+0.5s** to advance subtitles (if they appear too late)
- Click **Reset** to return to original timing

#### Appearance Settings
Click **⚙️ Appearance Settings** to customize:
- **Font Size**: Choose from Small, Medium, Large, or Extra Large
- **Text Color**: Select your preferred text color
- **Background Color**: Choose background color for subtitle box
- **Opacity**: Adjust background transparency (0-100%)
- **Position**: Place subtitles at Top, Middle, or Bottom

Click **Apply Settings** to save changes.

## File Formats

### Supported Formats

#### SRT (SubRip) Format
```
1
00:00:01,000 --> 00:00:05,000
ආයුබෝවන්! මේ පළමු උපශීර්ෂයයි

2
00:00:05,500 --> 00:00:10,000
සිංහල උපශීර්ෂ සඳහා සහාය
```

#### VTT (WebVTT) Format
```
WEBVTT

00:00:01.000 --> 00:00:05.000
ආයුබෝවන්! මේ පළමු උපශීර්ෂයයි

00:00:05.500 --> 00:00:10.000
සිංහල උපශීර්ෂ සඳහා සහාය
```

### Finding Sinhala Subtitles
- [OpenSubtitles.org](https://www.opensubtitles.org)
- [Subscene.com](https://subscene.com)
- [YIFY Subtitles](https://yifysubtitles.org)
- Local subtitle communities and forums

## Development

### Project Structure
```
shurawatchzz/
├── manifest.json           # Extension configuration
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── content/
│   ├── content.js         # Content script (main logic)
│   └── content.css        # Subtitle overlay styles
├── utils/
│   ├── parser.js          # SRT/VTT parser
│   └── storage.js         # Chrome storage wrapper
├── icons/
│   ├── icon16.png         # Extension icons
│   ├── icon48.png
│   ├── icon128.png
│   └── create_icons.html  # Icon generator
├── PRD.md                 # Product requirements
├── CLAUDE.md              # Development guide
└── README.md              # This file
```

### Development Workflow

1. **Make Changes**
   - Edit source files as needed

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card

3. **Test Changes**
   - Reload the HuraWatch page
   - Test functionality

4. **Debug**
   - **Popup**: Right-click extension icon → Inspect
   - **Content Script**: F12 Developer Tools on HuraWatch page
   - Check console for errors and logs

### Key Technologies
- **Manifest V3**: Latest Chrome extension standard
- **Vanilla JavaScript**: No frameworks required
- **Chrome APIs**: Storage API, Tabs API, Runtime API
- **HTML5 Video API**: For video synchronization

## Troubleshooting

### Subtitles Not Appearing
1. Check if video is detected (extension popup shows "Video: Detected")
2. Verify subtitle file is valid (use online validators)
3. Try reloading the page
4. Check browser console for errors (F12)

### Sync Issues
1. Use timing adjustment controls (-0.5s / +0.5s)
2. Verify video and subtitle file match (same release/version)
3. Try different subtitle file
4. Click Reset to return to original timing

### Sinhala Text Not Rendering
1. Ensure your system has Sinhala fonts installed
2. Try different browser (Chrome, Edge, Brave)
3. Check if file encoding is UTF-8

### Extension Not Loading
1. Verify all files are present (especially manifest.json)
2. Check Chrome version (requires v100+)
3. Disable conflicting extensions
4. Try reinstalling the extension

## Privacy & Security

- ✅ **No data collection**: All processing happens locally
- ✅ **No external servers**: Subtitle files stay on your device
- ✅ **No tracking**: We don't track your viewing habits
- ✅ **Minimal permissions**: Only requires access to HuraWatch site
- ✅ **Open source**: Code is transparent and auditable

## Limitations

- Extension only works on HuraWatch (hurawatchzz.tv)
- Requires manual subtitle file upload (no auto-download)
- Subtitle files must be in SRT or VTT format
- Requires HTML5 video player (standard `<video>` element)

## Future Enhancements

### Planned Features (Phase 2)
- [ ] Drag-and-drop file upload
- [ ] Keyboard shortcuts
- [ ] Multiple subtitle track support

### Potential Features (Phase 3)
- [ ] Online subtitle search integration
- [ ] Subtitle preview before loading
- [ ] Auto-sync subtitle timing
- [ ] Community subtitle repository

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For bug reports and feature requests, please [open an issue](https://github.com/yourusername/shurawatchzz/issues).

## Disclaimer

This extension is an independent project and is not affiliated with, endorsed by, or connected to HuraWatch. Use at your own discretion.

---

**Made with ❤️ for the Sinhala-speaking community**

Version 1.0.0
