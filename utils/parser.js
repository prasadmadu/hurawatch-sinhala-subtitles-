/**
 * Subtitle Parser for SRT and VTT formats
 * Handles Sinhala Unicode text with UTF-8 encoding
 */

class SubtitleParser {
  /**
   * Parse SRT format subtitle file
   * @param {string} content - Raw SRT file content
   * @returns {Array<{startTime: number, endTime: number, text: string}>}
   */
  static parseSRT(content) {
    const subtitles = [];

    // Split by double newlines to get individual subtitle blocks
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');

      if (lines.length < 3) continue; // Invalid block

      // Line 0: Index (skip)
      // Line 1: Timecode
      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);

      if (!timeMatch) continue;

      // Parse start time
      const startTime =
        parseInt(timeMatch[1]) * 3600 + // hours
        parseInt(timeMatch[2]) * 60 +   // minutes
        parseInt(timeMatch[3]) +         // seconds
        parseInt(timeMatch[4]) / 1000;   // milliseconds

      // Parse end time
      const endTime =
        parseInt(timeMatch[5]) * 3600 + // hours
        parseInt(timeMatch[6]) * 60 +   // minutes
        parseInt(timeMatch[7]) +         // seconds
        parseInt(timeMatch[8]) / 1000;   // milliseconds

      // Lines 2+: Subtitle text (may be multi-line)
      const text = lines.slice(2).join('\n').trim();

      if (text) {
        subtitles.push({ startTime, endTime, text });
      }
    }

    return subtitles;
  }

  /**
   * Parse VTT format subtitle file
   * @param {string} content - Raw VTT file content
   * @returns {Array<{startTime: number, endTime: number, text: string}>}
   */
  static parseVTT(content) {
    const subtitles = [];

    // Remove WEBVTT header
    content = content.replace(/^WEBVTT[^\n]*\n/, '');

    // Split by double newlines to get individual cue blocks
    const blocks = content.trim().split(/\n\s*\n/);

    for (const block of blocks) {
      const lines = block.trim().split('\n');

      if (lines.length < 2) continue;

      // Find the line with timing (may have optional cue identifier before it)
      let timeLineIndex = 0;
      let timeLine = lines[0];

      // Check if first line is a cue identifier (doesn't contain -->)
      if (!timeLine.includes('-->') && lines.length > 1) {
        timeLineIndex = 1;
        timeLine = lines[1];
      }

      // Parse VTT timecode: 00:00:00.000 --> 00:00:05.000
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);

      if (!timeMatch) continue;

      // Parse start time
      const startTime =
        parseInt(timeMatch[1]) * 3600 + // hours
        parseInt(timeMatch[2]) * 60 +   // minutes
        parseInt(timeMatch[3]) +         // seconds
        parseInt(timeMatch[4]) / 1000;   // milliseconds

      // Parse end time
      const endTime =
        parseInt(timeMatch[5]) * 3600 + // hours
        parseInt(timeMatch[6]) * 60 +   // minutes
        parseInt(timeMatch[7]) +         // seconds
        parseInt(timeMatch[8]) / 1000;   // milliseconds

      // Remaining lines: Subtitle text
      const text = lines.slice(timeLineIndex + 1).join('\n').trim();

      if (text) {
        subtitles.push({ startTime, endTime, text });
      }
    }

    return subtitles;
  }

  /**
   * Auto-detect format and parse subtitle file
   * @param {string} content - Raw subtitle file content
   * @param {string} filename - Optional filename for format detection
   * @returns {Array<{startTime: number, endTime: number, text: string}>}
   */
  static parse(content, filename = '') {
    // Detect format
    const isVTT = content.trim().startsWith('WEBVTT') ||
                  filename.toLowerCase().endsWith('.vtt');

    if (isVTT) {
      return this.parseVTT(content);
    } else {
      return this.parseSRT(content);
    }
  }

  /**
   * Binary search to find subtitle for given time
   * @param {Array} subtitles - Sorted array of subtitle objects
   * @param {number} currentTime - Current video time in seconds
   * @param {number} offset - Timing offset in seconds (default 0)
   * @returns {string|null} - Subtitle text or null if no subtitle at this time
   */
  static getCurrentSubtitle(subtitles, currentTime, offset = 0) {
    const adjustedTime = currentTime + offset;

    // Find subtitle where startTime <= adjustedTime < endTime
    for (const subtitle of subtitles) {
      if (adjustedTime >= subtitle.startTime && adjustedTime < subtitle.endTime) {
        return subtitle.text;
      }
      // Subtitles are usually in order, so we can optimize
      if (adjustedTime < subtitle.startTime) {
        break; // No point checking further
      }
    }

    return null;
  }

  /**
   * Validate subtitle file content
   * @param {string} content - Raw file content
   * @returns {{valid: boolean, error: string|null}}
   */
  static validate(content) {
    if (!content || content.trim().length === 0) {
      return { valid: false, error: 'File is empty' };
    }

    // Try to parse
    try {
      const subtitles = this.parse(content);

      if (subtitles.length === 0) {
        return { valid: false, error: 'No valid subtitles found in file' };
      }

      return { valid: true, error: null };
    } catch (e) {
      return { valid: false, error: 'Failed to parse subtitle file: ' + e.message };
    }
  }
}

// Make available globally for content script
if (typeof window !== 'undefined') {
  window.SubtitleParser = SubtitleParser;
}
