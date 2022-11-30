import { Card, Typography } from '@mui/material';
import React, { FC, useState, useMemo, useEffect } from 'react';

type ImageProps = {
  src: string;
  alt?: string;
  maxWidth?: string;
  maxHeight?: string;
};

const Image: FC<ImageProps> = ({ src, alt, maxWidth, maxHeight = '350px' }) => {
  const [imgSize, setImgSize] = useState<[number, number]>([999, 999]);

  const height = parseFloat(maxHeight);

  useEffect(() => {
    if (src) {
      setImgSize([999, 999]);
    }
  }, [src]);

  const sizeConfig = useMemo(() => {
    if (imgSize[1] > height) {
      return {
        height: maxHeight,
      };
    } else {
      return {
        width: `min(90%, ${imgSize[0]}px)`,
      };
    }
  }, [imgSize, height, maxHeight]);

  return (
    <>
      <Card
        component='img'
        sx={{ objectFit: 'cover', ...sizeConfig }}
        src={src}
        alt={alt || 'image'}
        onLoad={e => {
          const target = e.target as HTMLImageElement;
          setImgSize([target.offsetWidth, target.offsetHeight]);
        }}
      />
      <Typography textAlign='center'>{alt}</Typography>
    </>
  );
};

export default Image;
