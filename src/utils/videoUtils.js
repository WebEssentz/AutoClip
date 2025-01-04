// src/utils/videoUtils.ts
export const calculateDurationFrames = (data) => {
  if (!data?.captions || !Array.isArray(data.captions) || !data.captions.length) {
    return 120; // Default 4 seconds at 30fps
  }
  
  try {
    const lastCaption = data.captions[data.captions.length - 1];
    if (!lastCaption || typeof lastCaption.end !== 'number') {
      return 120;
    }
    return Math.ceil((lastCaption.end / 1000) * 30) + 60; // Add 2 seconds buffer
  } catch (error) {
    console.error('Error calculating duration:', error);
    return 120;
  }
};