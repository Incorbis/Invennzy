import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import React from "react";

export function Hero3DModel() {
  const group = useRef();
  const { scene } = useGLTF("logoinvennzy.glb");

  const monitorRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (
        child.name.toLowerCase().includes("screen") ||
        child.name.toLowerCase().includes("monitor")
      ) {
        monitorRef.current = child;
      }
    });
  }, [scene]);

  useFrame(({ mouse }) => {
    if (monitorRef.current) {
      // Invert mouse.y to correct up-down direction
      const x = THREE.MathUtils.lerp(
        monitorRef.current.rotation.x,
        -mouse.y * 0.5,
        0.1
      );
      const y = THREE.MathUtils.lerp(
        monitorRef.current.rotation.y,
        mouse.x * 0.5,
        0.1
      );
      monitorRef.current.rotation.x = x;
      monitorRef.current.rotation.y = y;
    }
  });

  return (
    <primitive ref={group} object={scene} scale={2.5} position={[0, -1, 0]} />
  );
}
