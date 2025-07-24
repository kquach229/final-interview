'use client';
import GridDistortion from '@/blocks/Backgrounds/GridDistortion/GridDistortion';
import React from 'react';

const DistortionComponent = ({ src }) => {
  return (
    <div className='w-full h-[500px] relative'>
      <GridDistortion imageSrc={src} />
    </div>
  );
};

export default DistortionComponent;
