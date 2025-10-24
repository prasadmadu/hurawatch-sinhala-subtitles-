# Contributing to Sinhala Subtitles for HuraWatch

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/shurawatchzz.git
   cd shurawatchzz
   ```
3. **Set up the extension** (see INSTALLATION.md)
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Code Style

- **JavaScript**: Use ES6+ features, clear variable names
- **Formatting**: 2-space indentation
- **Comments**: Add JSDoc comments for functions
- **Error Handling**: Always use try-catch for async operations

### File Organization

- **Content scripts**: `content/content.js`
- **Popup UI**: `popup/popup.js`, `popup/popup.html`, `popup/popup.css`
- **Utilities**: `utils/` (parser, storage)
- **Styles**: Keep CSS modular and well-commented

### Testing

Before submitting a PR:

1. **Manual Testing**
   - Test on actual HuraWatch site
   - Upload sample Sinhala SRT file
   - Verify all controls work (toggle, timing, settings)
   - Test fullscreen mode
   - Check console for errors

2. **Edge Cases**
   - Invalid subtitle files
   - Missing video player
   - Timing edge cases
   - Settings persistence

3. **Browser Testing**
   - Test on Chrome (primary)
   - Test on Edge or Brave (Chromium-based)

### Making Changes

1. **Keep changes focused**: One feature/fix per PR
2. **Update documentation**: Update README.md if needed
3. **Test thoroughly**: Follow testing checklist above
4. **Write clear commit messages**:
   ```
   feat: Add keyboard shortcuts for subtitle controls
   fix: Resolve timing sync issue in fullscreen mode
   docs: Update installation instructions
   ```

## Feature Requests

Before implementing a new feature:

1. Check if it aligns with the PRD goals
2. Open an issue to discuss the feature
3. Wait for approval/feedback
4. Implement and submit PR

### Priority Features (from PRD)

**Phase 2 (High Priority)**
- Drag-and-drop file upload
- Keyboard shortcuts
- VTT format enhancements

**Phase 3 (Future)**
- Online subtitle search
- Multiple subtitle tracks
- Auto-sync timing

## Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**:
   - Chrome version
   - Extension version
   - Operating system
6. **Console Logs**: Any relevant error messages
7. **Screenshots**: If applicable

## Pull Request Process

1. **Update your fork** from main branch
2. **Test your changes** thoroughly
3. **Update documentation** if needed
4. **Create pull request** with clear description:
   - What does this PR do?
   - Why is this change needed?
   - How was it tested?
   - Any breaking changes?

5. **Wait for review**
6. **Address feedback** if requested
7. **Merge** once approved

## Code Review Checklist

Reviewers will check:

- [ ] Code follows project style
- [ ] Changes are well-tested
- [ ] Documentation is updated
- [ ] No breaking changes (or clearly documented)
- [ ] Console logs removed (or converted to debug mode)
- [ ] Performance impact considered
- [ ] Sinhala Unicode handling preserved

## Architecture Notes

### Key Components

1. **SubtitleParser** (`utils/parser.js`)
   - Handles SRT/VTT parsing
   - Critical: UTF-8 encoding for Sinhala

2. **StorageManager** (`utils/storage.js`)
   - Chrome Storage API wrapper
   - Settings persistence

3. **SubtitleOverlay** (`content/content.js`)
   - Video detection
   - Subtitle synchronization
   - Overlay rendering

4. **PopupController** (`popup/popup.js`)
   - UI interactions
   - Message passing to content script

### Message Passing

Content script ↔ Popup communication:

```javascript
// From popup to content
chrome.tabs.sendMessage(tabId, {
  type: 'LOAD_SUBTITLE',
  subtitles: [...]
});

// Response from content
{ success: true, count: 100 }
```

### Critical Considerations

1. **Sinhala Unicode**: Always use UTF-8 encoding
2. **Timing Precision**: Video time is in seconds (float)
3. **Fullscreen Mode**: Overlay must work in fullscreen
4. **Performance**: Use binary search for subtitle lookup

## Community

- Be respectful and constructive
- Help others learn and grow
- Focus on code quality
- Celebrate contributions

## Questions?

- Open an issue for questions
- Check existing issues first
- Be patient - this is a community project

---

Thank you for contributing to making content accessible to Sinhala-speaking audiences!
