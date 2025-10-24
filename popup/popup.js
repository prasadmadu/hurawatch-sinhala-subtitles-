/**
 * Popup UI Controller
 * Handles user interactions and communication with content script
 */

class PopupController {
  constructor() {
    this.currentTab = null;
    this.settings = null;
    this.status = null;

    this.init();
  }

  /**
   * Initialize popup
   */
  async init() {
    // Get current tab
    await this.getCurrentTab();

    // Load settings
    await this.loadSettings();

    // Setup event listeners
    this.setupEventListeners();

    // Update status
    await this.updateStatus();

    // Populate UI with saved settings
    this.populateSettings();
  }

  /**
   * Get current active tab
   */
  async getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tab;
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      this.settings = await StorageManager.loadSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.settings = StorageManager.DEFAULT_SETTINGS;
    }
  }

  /**
   * Setup event listeners for all UI elements
   */
  setupEventListeners() {
    // Upload button
    document.getElementById('upload-btn').addEventListener('click', () => {
      document.getElementById('file-input').click();
    });

    // File input
    document.getElementById('file-input').addEventListener('change', (e) => {
      this.handleFileUpload(e);
    });

    // Toggle visibility
    document.getElementById('toggle-visibility-btn').addEventListener('click', () => {
      this.toggleVisibility();
    });

    // Timing adjustment
    document.getElementById('timing-minus-btn').addEventListener('click', () => {
      this.adjustTiming(-0.5);
    });

    document.getElementById('timing-plus-btn').addEventListener('click', () => {
      this.adjustTiming(0.5);
    });

    document.getElementById('timing-reset-btn').addEventListener('click', () => {
      this.resetTiming();
    });

    // Settings toggle
    document.getElementById('settings-toggle').addEventListener('click', () => {
      this.toggleSettings();
    });

    // Opacity slider
    document.getElementById('opacity-slider').addEventListener('input', (e) => {
      document.getElementById('opacity-value').textContent = e.target.value + '%';
    });

    // Apply settings
    document.getElementById('apply-settings-btn').addEventListener('click', () => {
      this.applySettings();
    });
  }

  /**
   * Handle subtitle file upload
   */
  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show loading state
    this.setStatus('subtitle-status', 'Loading...', 'warning');

    try {
      // Read file as text with UTF-8 encoding (critical for Sinhala)
      const content = await this.readFileAsText(file);

      // Validate file
      const validation = SubtitleParser.validate(content);
      if (!validation.valid) {
        this.setStatus('subtitle-status', 'Invalid file', 'error');
        alert('Error: ' + validation.error);
        return;
      }

      // Parse subtitles
      const subtitles = SubtitleParser.parse(content, file.name);

      // Send to content script
      const response = await this.sendMessage({
        type: 'LOAD_SUBTITLE',
        subtitles: subtitles
      });

      if (response && response.success) {
        this.setStatus('subtitle-status', `Loaded (${response.count} entries)`, 'success');
      } else {
        this.setStatus('subtitle-status', 'Failed to load', 'error');
        alert('Error: ' + (response?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('File upload error:', error);
      this.setStatus('subtitle-status', 'Error', 'error');
      alert('Error reading file: ' + error.message);
    }

    // Reset file input
    event.target.value = '';
  }

  /**
   * Read file as UTF-8 text
   */
  readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read file'));

      // CRITICAL: Use UTF-8 encoding for Sinhala text
      reader.readAsText(file, 'UTF-8');
    });
  }

  /**
   * Toggle subtitle visibility
   */
  async toggleVisibility() {
    const response = await this.sendMessage({ type: 'TOGGLE_VISIBILITY' });

    if (response && response.success) {
      this.updateVisibilityButton(response.isVisible);
    }
  }

  /**
   * Update visibility button state
   */
  updateVisibilityButton(isVisible) {
    const icon = document.getElementById('visibility-icon');
    const text = document.getElementById('visibility-text');

    if (isVisible) {
      icon.textContent = '👁️';
      text.textContent = 'Hide';
    } else {
      icon.textContent = '🚫';
      text.textContent = 'Show';
    }
  }

  /**
   * Adjust timing
   */
  async adjustTiming(delta) {
    const response = await this.sendMessage({
      type: 'ADJUST_TIMING',
      delta: delta
    });

    if (response && response.success) {
      this.updateTimingDisplay(response.offset);
    }
  }

  /**
   * Reset timing
   */
  async resetTiming() {
    const response = await this.sendMessage({ type: 'RESET_TIMING' });

    if (response && response.success) {
      this.updateTimingDisplay(response.offset);
    }
  }

  /**
   * Update timing display
   */
  updateTimingDisplay(offset) {
    const display = document.getElementById('timing-display');
    const sign = offset >= 0 ? '+' : '';
    display.textContent = sign + offset.toFixed(1) + 's';
  }

  /**
   * Toggle settings panel
   */
  toggleSettings() {
    const panel = document.getElementById('settings-panel');
    const toggle = document.getElementById('settings-toggle');
    const isVisible = panel.style.display !== 'none';

    if (isVisible) {
      panel.style.display = 'none';
      toggle.classList.remove('active');
    } else {
      panel.style.display = 'block';
      toggle.classList.add('active');
    }
  }

  /**
   * Populate settings UI with current values
   */
  populateSettings() {
    if (!this.settings) return;

    document.getElementById('font-size-select').value = this.settings.fontSize || 'medium';
    document.getElementById('font-color-input').value = this.settings.fontColor || '#FFFFFF';
    document.getElementById('bg-color-input').value = this.settings.backgroundColor || '#000000';

    const opacity = Math.round((this.settings.backgroundOpacity || 0.7) * 100);
    document.getElementById('opacity-slider').value = opacity;
    document.getElementById('opacity-value').textContent = opacity + '%';

    document.getElementById('position-select').value = this.settings.position || 'bottom';

    // Update timing display
    this.updateTimingDisplay(this.settings.timingOffset || 0);

    // Update visibility button
    this.updateVisibilityButton(this.settings.isVisible !== false);
  }

  /**
   * Apply settings
   */
  async applySettings() {
    const newSettings = {
      fontSize: document.getElementById('font-size-select').value,
      fontColor: document.getElementById('font-color-input').value,
      backgroundColor: document.getElementById('bg-color-input').value,
      backgroundOpacity: parseInt(document.getElementById('opacity-slider').value) / 100,
      position: document.getElementById('position-select').value,
      alignment: this.settings.alignment || 'center' // Keep existing alignment
    };

    // Save to storage
    this.settings = { ...this.settings, ...newSettings };
    await StorageManager.saveSettings(this.settings);

    // Send to content script
    const response = await this.sendMessage({
      type: 'UPDATE_SETTINGS',
      settings: newSettings
    });

    if (response && response.success) {
      // Show feedback
      const btn = document.getElementById('apply-settings-btn');
      const originalText = btn.textContent;
      btn.textContent = '✓ Applied';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1500);
    }
  }

  /**
   * Update status display
   */
  async updateStatus() {
    const response = await this.sendMessage({ type: 'GET_STATUS' });

    if (response && response.success) {
      this.status = response;

      // Update video status
      if (response.hasVideo) {
        this.setStatus('video-status', 'Detected', 'success');
      } else {
        this.setStatus('video-status', 'Not found', 'warning');
      }

      // Update subtitle status
      if (response.hasSubtitles) {
        this.setStatus('subtitle-status', `Loaded (${response.subtitleCount} entries)`, 'success');
      } else {
        this.setStatus('subtitle-status', 'Not loaded', 'warning');
      }

      // Update controls
      this.updateTimingDisplay(response.offset || 0);
      this.updateVisibilityButton(response.isVisible !== false);
    } else {
      this.setStatus('video-status', 'Not on HuraWatch', 'error');
      this.setStatus('subtitle-status', 'N/A', 'error');
    }
  }

  /**
   * Set status display
   */
  setStatus(elementId, text, className) {
    const element = document.getElementById(elementId);
    element.textContent = text;
    element.className = 'status-value ' + (className || '');
  }

  /**
   * Send message to content script (both main page and iframes)
   */
  async sendMessage(message) {
    if (!this.currentTab || !this.currentTab.id) {
      console.error('No active tab');
      return null;
    }

    try {
      // Try sending to main frame first
      const response = await chrome.tabs.sendMessage(this.currentTab.id, message);

      // If we got a response with hasVideo, we found it
      if (response && response.hasVideo) {
        return response;
      }

      // If no video in main frame, try sending to all frames
      // The content script in the iframe will handle it
      return response;
    } catch (error) {
      console.error('Message send error:', error);
      return null;
    }
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.popupController = new PopupController();
  });
} else {
  window.popupController = new PopupController();
}

// Also make SubtitleParser available in popup context
class SubtitleParser {
  static validate(content) {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'File is empty' };
    }
    return { valid: true, error: null };
  }

  static parse(content, filename = '') {
    // Simple parse for validation - actual parsing happens in content script
    // This is just to check if file has subtitle-like content
    const isVTT = content.trim().startsWith('WEBVTT') || filename.toLowerCase().endsWith('.vtt');

    if (isVTT) {
      return this.parseVTT(content);
    } else {
      return this.parseSRT(content);
    }
  }

  static parseSRT(content) {
    const subtitles = [];
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 3) continue;

      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);

      if (!timeMatch) continue;

      const startTime =
        parseInt(timeMatch[1]) * 3600 +
        parseInt(timeMatch[2]) * 60 +
        parseInt(timeMatch[3]) +
        parseInt(timeMatch[4]) / 1000;

      const endTime =
        parseInt(timeMatch[5]) * 3600 +
        parseInt(timeMatch[6]) * 60 +
        parseInt(timeMatch[7]) +
        parseInt(timeMatch[8]) / 1000;

      const text = lines.slice(2).join('\n').trim();

      if (text) {
        subtitles.push({ startTime, endTime, text });
      }
    }

    return subtitles;
  }

  static parseVTT(content) {
    const subtitles = [];
    content = content.replace(/^WEBVTT[^\n]*\n/, '');
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 2) continue;

      let timeLineIndex = 0;
      let timeLine = lines[0];

      if (!timeLine.includes('-->') && lines.length > 1) {
        timeLineIndex = 1;
        timeLine = lines[1];
      }

      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);

      if (!timeMatch) continue;

      const startTime =
        parseInt(timeMatch[1]) * 3600 +
        parseInt(timeMatch[2]) * 60 +
        parseInt(timeMatch[3]) +
        parseInt(timeMatch[4]) / 1000;

      const endTime =
        parseInt(timeMatch[5]) * 3600 +
        parseInt(timeMatch[6]) * 60 +
        parseInt(timeMatch[7]) +
        parseInt(timeMatch[8]) / 1000;

      const text = lines.slice(timeLineIndex + 1).join('\n').trim();

      if (text) {
        subtitles.push({ startTime, endTime, text });
      }
    }

    return subtitles;
  }
}
