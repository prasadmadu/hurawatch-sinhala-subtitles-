# Quick Start Guide

Get up and running with the Sinhala Subtitles extension in 5 minutes!

## 🚀 For Users

### 1. Install (2 minutes)

1. **Generate Icons**
   - Open `icons/create_icons.html` in Chrome
   - Download the 3 PNG files that appear
   - Move them to the `icons/` folder

2. **Load Extension**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (top-right)
   - Click "Load unpacked"
   - Select this folder

### 2. Use (1 minute)

1. Visit [hurawatchzz.tv](https://hurawatchzz.tv)
2. Play a video
3. Click extension icon
4. Upload a `.srt` or `.vtt` file
5. Enjoy Sinhala subtitles!

### 3. Customize

- **Toggle**: Show/hide subtitles
- **Timing**: Adjust sync (±0.5s)
- **Appearance**: Font, color, position

---

## 💻 For Developers

### Project Structure

```
shurawatchzz/
├── manifest.json          ← Extension config
├── popup/                 ← User interface
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── content/               ← Runs on HuraWatch
│   ├── content.js         (video detection, overlay)
│   └── content.css
└── utils/                 ← Shared utilities
    ├── parser.js          (SRT/VTT parsing)
    └── storage.js         (Chrome storage)
```

### Key Files

| File | Purpose |
|------|---------|
| `manifest.json` | Chrome extension configuration |
| `content/content.js` | Main logic: video detection, subtitle sync |
| `popup/popup.js` | UI controls and file upload |
| `utils/parser.js` | Parse SRT/VTT subtitle files |
| `utils/storage.js` | Save/load user settings |

### Development Workflow

1. **Make changes** to source files
2. **Reload extension** at `chrome://extensions/`
3. **Refresh page** on HuraWatch
4. **Test** functionality
5. **Debug** via console (F12)

### Testing

```javascript
// Popup console (right-click icon → Inspect)
popupController.handleFileUpload(...)

// Content script console (F12 on HuraWatch)
subtitleOverlay.loadSubtitles(...)
```

### Adding Features

**Example: Add keyboard shortcut**

1. Update `manifest.json`:
   ```json
   "commands": {
     "toggle-subtitles": {
       "suggested_key": { "default": "Ctrl+Shift+S" }
     }
   }
   ```

2. Add listener in `content/content.js`:
   ```javascript
   chrome.commands.onCommand.addListener((command) => {
     if (command === 'toggle-subtitles') {
       this.toggleVisibility();
     }
   });
   ```

### Common Tasks

#### Update Subtitle Parser
→ Edit `utils/parser.js`

#### Change UI Appearance
→ Edit `popup/popup.css` or `content/content.css`

#### Add New Setting
1. Add to `StorageManager.DEFAULT_SETTINGS` in `utils/storage.js`
2. Add UI control in `popup/popup.html`
3. Apply in `content/content.js`

---

## 📚 Documentation

- **[README.md](README.md)** - Full documentation
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed install guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CLAUDE.md](CLAUDE.md)** - Architecture guide
- **[PRD.md](PRD.md)** - Product requirements

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Extension won't load | Generate icons first! |
| Subtitles not showing | Check if video is detected in popup |
| Wrong timing | Use +/- timing adjustment |
| Sinhala text broken | Ensure file is UTF-8 encoded |

---

## 🎯 Next Steps

### For Users
- Download Sinhala subtitles from [OpenSubtitles](https://www.opensubtitles.org)
- Customize appearance settings
- Share with friends!

### For Developers
- Read the [PRD.md](PRD.md) for roadmap
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- Pick an issue and start coding!

---

**Need Help?**

- 📖 Read [README.md](README.md)
- 🐛 Open an issue on GitHub
- 💬 Ask in discussions

Happy coding! 🎉
