'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface GridDistortionProps {
  grid?: number;
  mouse?: number;
  strength?: number;
  relaxation?: number;
  imageSrc: string;
  className?: string;
}

const vertexShader = `
  uniform float time;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uDataTexture;
  uniform float time;
  uniform float aspect;
  uniform float imageAspect;
  varying vec2 vUv;

  void main() {
    vec2 newUv = vUv;
    vec4 data = texture2D(uDataTexture, newUv);
    newUv.y += data.r * 0.1;
    newUv.x += data.g * 0.1;
    vec2 correctedUv = vec2(
      (newUv.x - 0.5) * aspect / imageAspect + 0.5,
      newUv.y
    );
    gl_FragColor = texture2D(uTexture, correctedUv);
  }
`;

const GridDistortion: React.FC<GridDistortionProps> = ({
  grid = 32,
  mouse = 0.2,
  strength = 0.3,
  relaxation = 0.96,
  imageSrc,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageAspectRef = useRef(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const size = grid;
    const data = new Float32Array(size * size * 4);
    const dataTexture = new THREE.DataTexture(
      data,
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dataTexture.needsUpdate = true;

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uDataTexture: { value: dataTexture },
      time: { value: 0 },
      aspect: {
        value: container.clientWidth / container.clientHeight,
      },
      imageAspect: { value: imageAspectRef.current },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture: any) => {
      texture.minFilter = THREE.LinearFilter;
      if (
        texture.image &&
        'width' in texture.image &&
        'height' in texture.image
      ) {
        imageAspectRef.current =
          (texture.image as HTMLImageElement).width /
          (texture.image as HTMLImageElement).height;
      }
      uniforms.uTexture.value = texture;
      handleResize();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      uniforms.time.value += 0.05;

      const data = dataTexture.image.data as Float32Array;
      for (let i = 0; i < size * size; i++) {
        data[i * 4] *= relaxation;
        data[i * 4 + 1] *= relaxation;
      }

      dataTexture.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const aspect = container.clientWidth / container.clientHeight;
      uniforms.aspect.value = aspect;
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const gridX = Math.floor((x / rect.width) * size);
      const gridY = Math.floor((1 - y / rect.height) * size);
      const index = (gridY * size + gridX) * 4;

      const data = dataTexture.image.data as Float32Array;
      data[index] = (mouse * 2 - 1) * strength;
      data[index + 1] = (mouse * 2 - 1) * strength;
      dataTexture.needsUpdate = true;
    };

    const handleMouseLeave = () => {
      const data = dataTexture.image.data as Float32Array;
      for (let i = 0; i < size * size; i++) {
        data[i * 4] = 0;
        data[i * 4 + 1] = 0;
      }
      dataTexture.needsUpdate = true;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dataTexture.dispose();
      if (uniforms.uTexture.value instanceof THREE.Texture) {
        uniforms.uTexture.value.dispose();
      }
    };
  }, [grid, imageSrc, mouse, relaxation, strength]);

  return <div className={className} ref={containerRef} />;
};

export default GridDistortion;
