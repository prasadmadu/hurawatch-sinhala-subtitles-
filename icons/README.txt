Icon Placeholder Files

The icon.svg file contains the design for the extension icon.

To generate PNG files from the SVG:
1. Open icon.svg in a browser or image editor (like Inkscape, GIMP, or online tools)
2. Export/Save as PNG at these sizes:
   - icon16.png (16x16 pixels)
   - icon48.png (48x48 pixels)
   - icon128.png (128x128 pixels)

For quick testing, you can use online tools like:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

Or use ImageMagick command line:
  convert -background none -density 1000 -resize 16x16 icon.svg icon16.png
  convert -background none -density 1000 -resize 48x48 icon.svg icon48.png
  convert -background none -density 1000 -resize 128x128 icon.svg icon128.png

The icon design features:
- Blue background (#4A90E2)
- Sinhala letters "සි" (si) representing Sinhala
- Subtitle lines at the bottom
