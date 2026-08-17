import {Composition} from 'remotion';
import {Template} from './template';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Beliv8Recreation"
      component={Template}
      durationInFrames={450}
      fps={30}
      width={736}
      height={414}
    />
  );
};