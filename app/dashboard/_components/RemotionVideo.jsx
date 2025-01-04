// RemotionVideo.jsx
import React, { useEffect, useCallback } from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionVideo({ script, imageList, audioFileUrl, captions, setDurationInFrames, isPreview, durationInFrames: forcedDuration }) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const calculateDuration = useCallback(() => {
    if (forcedDuration) return forcedDuration;
    // Return default duration if no captions or invalid captions
    if (!captions || !Array.isArray(captions) || !captions.length) return 120;

    try {
      const lastCaption = captions[captions.length - 1];
      if (!lastCaption || typeof lastCaption.end !== 'number') return 120;

      // Increase buffer to 850ms and ensure precise calculation
      const durationInSeconds = (lastCaption.end + 850) / 1000;
      // Use Math.ceil to ensure we always round up
      const durationInFrames = Math.ceil(durationInSeconds * fps);
      // Add slightly more buffer frames
      return durationInFrames + Math.ceil(fps * 2.1);
    } catch (error) {
      console.error('Error calculating duration:', error);
      return 120; // Default duration on error
    }
  }, [captions, fps, forcedDuration]);

  const formatDuration = useCallback((frames) => {
    const totalSeconds = Math.ceil(frames / fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [fps]);

  useEffect(() => {
    if (!isPreview && setDurationInFrames) {
      const frames = calculateDuration();
      const formatted = formatDuration(frames);
      setDurationInFrames(formatted);
    }
  }, [captions, calculateDuration, formatDuration, setDurationInFrames, isPreview]);

  const duration = calculateDuration();
  
  const getCurrentCaptions = () => {
    if (!captions || !Array.isArray(captions)) return '';
    
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions.find(
      (word) => word && typeof word.start === 'number' && typeof word.end === 'number' &&
        currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption?.text || '';
  };

  return (
    script && (
      <AbsoluteFill className="bg-background">
        {imageList?.map((item, index) => {
          const startTime = (index * duration) / (imageList.length || 1);

          const scale = (index) => interpolate(
            frame,
            [startTime, startTime + duration / 2, startTime + duration],
            index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <Sequence key={index} from={startTime} durationInFrames={duration}>
              <AbsoluteFill className="justify-center items-center">
                <Img
                  src={item}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    transform: `scale(${scale(index)})`,
                  }}
                />
                <AbsoluteFill
                  style={{
                    color: 'white',
                    justifyContent: 'center',
                    top: undefined,
                    bottom: 50,
                    height: 150,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  <h2 className="text-2xl">{getCurrentCaptions()}</h2>
                </AbsoluteFill>
              </AbsoluteFill>
            </Sequence>
          );
        })}
        {audioFileUrl && (
          <Audio
            src={audioFileUrl}
            volume={interpolate(
              frame,
              [duration - Math.ceil(fps * 0.75), duration - 1],
              [1, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            )}
          />
        )}
      </AbsoluteFill>
    )
  );
}

export default React.memo(RemotionVideo);