const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

/**
 * Extracts frames from a video file using FFmpeg
 * @param {string} videoPath - Path to the input video file
 * @param {string} outputDir - Directory where frames will be saved
 * @param {number} fps - Frames per second to extract (default: 30)
 */
function extractFrames(videoPath, outputDir, fps = 30) {
  try {
    // Get FFmpeg path from the installer package
    const ffmpegPath = ffmpegInstaller.path;
    console.log(`Using FFmpeg from: ${ffmpegPath}`);

    // Check if video file exists
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created output directory: ${outputDir}`);
    }

    // Get absolute paths
    const absoluteVideoPath = path.resolve(videoPath);
    const absoluteOutputDir = path.resolve(outputDir);
    const outputPattern = path.join(absoluteOutputDir, 'frame_%04d.png');

    console.log('Starting frame extraction...');
    console.log(`Video: ${absoluteVideoPath}`);
    console.log(`Output: ${absoluteOutputDir}`);
    console.log(`FPS: ${fps}`);

    // FFmpeg command to extract frames
    // -i: input file
    // -vf fps=30: video filter to extract at 30 frames per second
    // -y: overwrite output files without asking
    const ffmpegCommand = `"${ffmpegPath}" -i "${absoluteVideoPath}" -vf fps=${fps} -y "${outputPattern}"`;

    console.log('\nExecuting FFmpeg command...');
    execSync(ffmpegCommand, { stdio: 'inherit' });

    // Count extracted frames
    const files = fs.readdirSync(absoluteOutputDir).filter(file => file.startsWith('frame_') && file.endsWith('.png'));
    console.log(`\n✅ Successfully extracted ${files.length} frames to ${absoluteOutputDir}`);
    
    return files.length;
  } catch (error) {
    console.error('\n❌ Error extracting frames:', error.message);
    if (error.message.includes('Cannot find module')) {
      console.error('Please make sure @ffmpeg-installer/ffmpeg is installed: npm install --save-dev @ffmpeg-installer/ffmpeg');
    }
    process.exit(1);
  }
}

// Main execution
if (require.main === module) {
  // Default paths - adjust these to match your video location
  const videoPath = path.join(__dirname, '../public/media/burgers/animated/classic.mp4');
  const outputDir = path.join(__dirname, '../public/media/burgers/animated/classic/frames');
  const fps = 30; // Frames per second to extract

  console.log('=== Video Frame Extractor ===\n');
  extractFrames(videoPath, outputDir, fps);
}

module.exports = { extractFrames };
