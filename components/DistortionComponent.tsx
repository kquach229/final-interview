'use client';
import GridDistortion from '@/blocks/Backgrounds/GridDistortion/GridDistortion';
import React from 'react';

const DistortionComponent = ({ src }) => {
  return (
    <div className='flex items-center justify-center min-w-[50vw] overflow-hidden'>
      <GridDistortion imageSrc={src} />
    </div>
  );
};

export default DistortionComponent;
