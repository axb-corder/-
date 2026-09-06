import React, { useState, useEffect } from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  candidates: string[];
}

export const SmartImage: React.FC<SmartImageProps> = ({ candidates, alt, className, ...props }) => {
  const [index, setIndex] = useState(0);

  // Reset index if candidate list changes
  useEffect(() => {
    setIndex(0);
  }, [candidates]);

  const currentSrc = candidates[index] || candidates[candidates.length - 1];

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => {
        if (index < candidates.length - 1) {
          setIndex((prev) => prev + 1);
        }
      }}
      {...props}
    />
  );
};
