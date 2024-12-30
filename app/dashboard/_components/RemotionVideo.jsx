import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';

function RemotionVideo({ script, imageList, audioFileUrl, captions, setDurationInFrames }) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const calculateDuration = () => {
    const duration = captions[captions?.length - 1]?.end / 1000 * fps;
    setDurationInFrames(duration);
    return duration;
  };

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
          const startTime = (index * calculateDuration()) / imageList?.length;
          const duration = calculateDuration();

          const scale = (index) => interpolate(
            frame,
            [startTime, startTime+duration/2, startTime+duration],
            index%2==0 ? [1, 1.8, 1]: [1.8, 1, 1.8],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
          )
          return (
            <Sequence key={index} from={startTime} durationInFrames={calculateDuration()}>
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

export default RemotionVideo;
