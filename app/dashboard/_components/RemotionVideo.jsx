import React, { useEffect, useCallback } from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionVideo({ script, imageList, audioFileUrl, captions, setDurationInFrames, isPreview, durationInFrames: forcedDuration }) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const calculateDuration = useCallback(() => {
    if (forcedDuration) return forcedDuration;
    if (!captions?.length) return 0;

    const lastCaption = captions[captions.length - 1];
    const durationInSeconds = lastCaption.end / 1000;
    const durationInFrames = Math.ceil(durationInSeconds * fps);
    return durationInFrames;
  }, [captions, fps, forcedDuration]);

  const formatDuration = useCallback((frames) => {
    const totalSeconds = Math.ceil(frames / fps);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [fps]);

  // Calculate duration once and store it
  useEffect(() => {
    if (!isPreview && captions?.length && setDurationInFrames) {
      const frames = calculateDuration();
      const formatted = formatDuration(frames);
      setDurationInFrames(formatted);
    }
  }, [captions, calculateDuration, formatDuration, setDurationInFrames, isPreview]);

  const duration = calculateDuration();
  const getCurrentCaptions = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption.text : '';
  };

  return (
    script && (
      <AbsoluteFill className="bg-background">
        {imageList?.map((item, index) => {
          const totalDuration = duration;
          const segmentDuration = totalDuration / (imageList?.length || 1);
          const startTime = index * segmentDuration;

          const scale = (index) => interpolate(
            frame,
            [startTime, startTime + segmentDuration / 2, startTime + segmentDuration],
            index % 2 === 0 ? [1, 1.8, 1] : [1.8, 1, 1.8],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <Sequence key={index} from={startTime} durationInFrames={segmentDuration}>
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
        {audioFileUrl && <Audio src={audioFileUrl} />}
      </AbsoluteFill>
    )
  );
}

export default React.memo(RemotionVideo);