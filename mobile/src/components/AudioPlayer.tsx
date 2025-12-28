import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Video from 'react-native-video';

export interface AudioPlayerRef {
  play: (uri: string) => void;
  stop: () => void;
}

const AudioPlayer = forwardRef<AudioPlayerRef, {}>((props, ref) => {
  const [uri, setUri] = useState<string | null>(null);
  const [paused, setPaused] = useState(true);

  useImperativeHandle(ref, () => ({
    play: (url: string) => {
      setUri(url);
      setPaused(false);
    },
    stop: () => {
      setPaused(true);
    }
  }));

  if (!uri) return null;

  return (
    <Video
      source={{ uri }}
      paused={paused}
      onEnd={() => setPaused(true)}
      onError={(e) => console.error('AudioPlayer Error:', e)}
      playInBackground={true}
      ignoreSilentSwitch="ignore"
    />
  );
});

export default AudioPlayer;
