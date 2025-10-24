/**
 * Content Script for HuraWatch Sinhala Subtitles
 * Handles video detection, subtitle overlay, and synchronization
 */

class SubtitleOverlay {
  constructor() {
    this.video = null;
    this.subtitles = [];
    this.currentSubtitle = null;
    this.overlay = null;
    this.timingOffset = 0;
    this.isVisible = true;
    this.settings = null;

    this.init();
  }

  /**
   * Initialize the subtitle overlay system
   */
  async init() {
    console.log('[Sinhala Subtitles] Initializing...', window.location.href);

    // Load settings
    await this.loadSettings();

    // Wait for video player to be available
    this.detectVideo();

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sendResponse);
      return true; // Keep channel open for async response
    });

    // Listen for messages from parent window (if in iframe)
    window.addEventListener('message', (event) => {
      this.handleWindowMessage(event);
    });
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      this.settings = await StorageManager.loadSettings();
      this.timingOffset = this.settings.timingOffset || 0;
      this.isVisible = this.settings.isVisible !== undefined ? this.settings.isVisible : true;
    } catch (error) {
      console.error('[Sinhala Subtitles] Failed to load settings:', error);
      this.settings = StorageManager.DEFAULT_SETTINGS;
    }
  }

  /**
   * Detect video player on the page
   */
  detectVideo() {
    const isInIframe = window.self !== window.top;
    const url = window.location.href;

    console.log('[Sinhala Subtitles] Detecting video...', {
      isInIframe,
      url,
      hasBody: !!document.body
    });

    // Try to find video immediately
    this.video = document.querySelector('video');

    if (this.video) {
      console.log('[Sinhala Subtitles] Video player found immediately!', {
        videoSrc: this.video.src || this.video.currentSrc,
        videoElement: this.video
      });
      this.setupVideo();
    } else {
      // Use MutationObserver to wait for dynamically loaded video
      console.log('[Sinhala Subtitles] Waiting for video player to load...');

      const checkInterval = setInterval(() => {
        this.video = document.querySelector('video');
        if (this.video) {
          console.log('[Sinhala Subtitles] Video player detected via polling!', {
            videoSrc: this.video.src || this.video.currentSrc
          });
          clearInterval(checkInterval);
          this.setupVideo();
        }
      }, 500); // Check every 500ms

      const observer = new MutationObserver(() => {
        if (!this.video) {
          this.video = document.querySelector('video');
          if (this.video) {
            console.log('[Sinhala Subtitles] Video player detected via MutationObserver!');
            observer.disconnect();
            clearInterval(checkInterval);
            this.setupVideo();
          }
        }
      });

      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        // Wait for body to be ready
        document.addEventListener('DOMContentLoaded', () => {
          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      }

      // Stop observing after 30 seconds
      setTimeout(() => {
        observer.disconnect();
        clearInterval(checkInterval);
        if (!this.video) {
          console.warn('[Sinhala Subtitles] Video player not found after 30 seconds');
        }
      }, 30000);
    }
  }

  /**
   * Setup video event listeners and create overlay
   */
  setupVideo() {
    // Create subtitle overlay
    this.createOverlay();

    // Listen to video events
    this.video.addEventListener('timeupdate', () => this.updateSubtitle());
    this.video.addEventListener('seeking', () => this.updateSubtitle());
    this.video.addEventListener('seeked', () => this.updateSubtitle());
    this.video.addEventListener('play', () => this.updateSubtitle());
    this.video.addEventListener('loadedmetadata', () => this.updateSubtitle());

    console.log('[Sinhala Subtitles] Video setup complete');
  }

  /**
   * Create subtitle overlay container
   */
  createOverlay() {
    if (this.overlay) return; // Already created

    // Create overlay container
    this.overlay = document.createElement('div');
    this.overlay.id = 'sinhala-subtitle-overlay';
    this.overlay.className = 'sinhala-subtitle-container';

    // Apply initial settings
    this.applySettings();

    // Insert overlay into page
    // Try to insert relative to video player for better positioning
    const videoContainer = this.video.parentElement;
    if (videoContainer) {
      videoContainer.style.position = 'relative';
      videoContainer.appendChild(this.overlay);
    } else {
      document.body.appendChild(this.overlay);
    }

    console.log('[Sinhala Subtitles] Overlay created');
  }

  /**
   * Apply settings to overlay
   */
  applySettings() {
    if (!this.overlay || !this.settings) return;

    const { fontSize, fontColor, backgroundColor, backgroundOpacity, position, alignment } = this.settings;

    // Font size mapping
    const fontSizeMap = {
      'small': '16px',
      'medium': '20px',
      'large': '28px',
      'x-large': '36px'
    };

    // Position mapping - using bottom positioning for better overflow handling
    const positionMap = {
      'bottom': '60px',  // 60px from bottom
      'middle': '50%',   // Center (need transform)
      'top': 'auto'      // Will use top property
    };

    this.overlay.style.fontSize = fontSizeMap[fontSize] || fontSizeMap['medium'];
    this.overlay.style.color = fontColor || '#FFFFFF';
    this.overlay.style.textAlign = alignment || 'center';

    // Handle positioning based on selection
    if (position === 'top') {
      this.overlay.style.bottom = 'auto';
      this.overlay.style.top = '60px';
      this.overlay.style.transform = 'translateX(-50%)';
    } else if (position === 'middle') {
      this.overlay.style.bottom = 'auto';
      this.overlay.style.top = '50%';
      this.overlay.style.transform = 'translate(-50%, -50%)';
    } else { // bottom (default)
      this.overlay.style.top = 'auto';
      this.overlay.style.bottom = positionMap['bottom'];
      this.overlay.style.transform = 'translateX(-50%)';
    }

    // Background with opacity
    const bgColor = backgroundColor || '#000000';
    const opacity = backgroundOpacity !== undefined ? backgroundOpacity : 0.7;
    this.overlay.style.backgroundColor = this.hexToRGBA(bgColor, opacity);

    // Visibility
    this.overlay.style.display = this.isVisible ? 'block' : 'none';
  }

  /**
   * Convert hex color to RGBA
   */
  hexToRGBA(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Update subtitle based on current video time
   */
  updateSubtitle() {
    if (!this.video || !this.overlay || this.subtitles.length === 0) return;

    const currentTime = this.video.currentTime;
    const subtitle = SubtitleParser.getCurrentSubtitle(this.subtitles, currentTime, this.timingOffset);

    if (subtitle !== this.currentSubtitle) {
      this.currentSubtitle = subtitle;
      this.overlay.textContent = subtitle || '';
    }
  }

  /**
   * Load subtitles from parsed data
   */
  loadSubtitles(subtitles) {
    this.subtitles = subtitles;
    this.currentSubtitle = null;
    console.log(`[Sinhala Subtitles] Loaded ${subtitles.length} subtitle entries`);

    // Update immediately
    this.updateSubtitle();
  }

  /**
   * Toggle subtitle visibility
   */
  toggleVisibility() {
    this.isVisible = !this.isVisible;
    if (this.overlay) {
      this.overlay.style.display = this.isVisible ? 'block' : 'none';
    }
    StorageManager.saveVisibility(this.isVisible);
    return this.isVisible;
  }

  /**
   * Adjust timing offset
   */
  adjustTiming(delta) {
    this.timingOffset += delta;
    console.log(`[Sinhala Subtitles] Timing offset: ${this.timingOffset}s`);
    StorageManager.saveOffset(this.timingOffset);
    this.updateSubtitle();
    return this.timingOffset;
  }

  /**
   * Reset timing offset
   */
  resetTiming() {
    this.timingOffset = 0;
    StorageManager.saveOffset(0);
    this.updateSubtitle();
    return this.timingOffset;
  }

  /**
   * Update settings and apply
   */
  async updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    await StorageManager.saveSettings(this.settings);
    this.applySettings();
  }

  /**
   * Handle window messages (for iframe communication)
   */
  handleWindowMessage(event) {
    // Only accept messages from same origin or trusted sources
    if (!event.data || !event.data.type || !event.data.type.startsWith('SINHALA_SUB_')) {
      return;
    }

    const message = {
      type: event.data.type.replace('SINHALA_SUB_', ''),
      ...event.data
    };

    console.log('[Sinhala Subtitles] Received window message:', message.type);

    // Forward to handleMessage
    this.handleMessage(message, (response) => {
      // Send response back through window.postMessage
      event.source.postMessage({
        type: 'SINHALA_SUB_RESPONSE',
        originalType: event.data.type,
        ...response
      }, '*');
    });
  }

  /**
   * Handle messages from popup
   */
  async handleMessage(message, sendResponse) {
    console.log('[Sinhala Subtitles] Received message:', message.type);

    switch (message.type) {
      case 'LOAD_SUBTITLE':
        if (message.subtitles && Array.isArray(message.subtitles)) {
          this.loadSubtitles(message.subtitles);
          sendResponse({ success: true, count: message.subtitles.length });
        } else {
          sendResponse({ success: false, error: 'Invalid subtitle data' });
        }
        break;

      case 'TOGGLE_VISIBILITY':
        const isVisible = this.toggleVisibility();
        sendResponse({ success: true, isVisible });
        break;

      case 'ADJUST_TIMING':
        const delta = parseFloat(message.delta) || 0;
        const offset = this.adjustTiming(delta);
        sendResponse({ success: true, offset });
        break;

      case 'RESET_TIMING':
        const resetOffset = this.resetTiming();
        sendResponse({ success: true, offset: resetOffset });
        break;

      case 'UPDATE_SETTINGS':
        await this.updateSettings(message.settings);
        sendResponse({ success: true });
        break;

      case 'GET_STATUS':
        sendResponse({
          success: true,
          hasVideo: !!this.video,
          hasSubtitles: this.subtitles.length > 0,
          isVisible: this.isVisible,
          offset: this.timingOffset,
          subtitleCount: this.subtitles.length
        });
        break;

      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.subtitleOverlay = new SubtitleOverlay();
  });
} else {
  window.subtitleOverlay = new SubtitleOverlay();
}
