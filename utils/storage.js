/**
 * Storage Manager for Chrome Storage API
 * Handles persistence of user preferences and settings
 */

class StorageManager {
  /**
   * Default settings
   */
  static DEFAULT_SETTINGS = {
    fontSize: 'medium',        // 'small', 'medium', 'large', 'x-large'
    fontColor: '#FFFFFF',      // White
    backgroundColor: '#000000', // Black
    backgroundOpacity: 0.7,    // 0-1
    position: 'bottom',        // 'bottom', 'middle', 'top'
    alignment: 'center',       // 'left', 'center', 'right'
    timingOffset: 0,           // seconds (can be positive or negative)
    isVisible: true            // subtitle visibility state
  };

  /**
   * Save settings to Chrome storage
   * @param {Object} settings - Settings object
   * @returns {Promise<void>}
   */
  static async saveSettings(settings) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ settings }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Load settings from Chrome storage
   * @returns {Promise<Object>} - Settings object
   */
  static async loadSettings() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(['settings'], (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          // Merge with defaults in case some settings are missing
          const settings = { ...this.DEFAULT_SETTINGS, ...result.settings };
          resolve(settings);
        }
      });
    });
  }

  /**
   * Save timing offset
   * @param {number} offset - Offset in seconds
   * @returns {Promise<void>}
   */
  static async saveOffset(offset) {
    const settings = await this.loadSettings();
    settings.timingOffset = offset;
    return this.saveSettings(settings);
  }

  /**
   * Get timing offset
   * @returns {Promise<number>} - Offset in seconds
   */
  static async getOffset() {
    const settings = await this.loadSettings();
    return settings.timingOffset || 0;
  }

  /**
   * Save visibility state
   * @param {boolean} isVisible
   * @returns {Promise<void>}
   */
  static async saveVisibility(isVisible) {
    const settings = await this.loadSettings();
    settings.isVisible = isVisible;
    return this.saveSettings(settings);
  }

  /**
   * Get visibility state
   * @returns {Promise<boolean>}
   */
  static async getVisibility() {
    const settings = await this.loadSettings();
    return settings.isVisible !== undefined ? settings.isVisible : true;
  }

  /**
   * Reset settings to defaults
   * @returns {Promise<void>}
   */
  static async resetSettings() {
    return this.saveSettings(this.DEFAULT_SETTINGS);
  }

  /**
   * Update specific setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Promise<void>}
   */
  static async updateSetting(key, value) {
    const settings = await this.loadSettings();
    settings[key] = value;
    return this.saveSettings(settings);
  }
}

// Make available globally for content script and popup
if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}
