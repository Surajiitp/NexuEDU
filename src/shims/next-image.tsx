import React from 'react';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  quality?: number;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  className?: string;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  onLoad,
  priority,
  loading = priority ? 'eager' : 'lazy',
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onLoad={onLoad}
      className={className}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};

export default Image;
