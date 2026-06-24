import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import { Physics, RigidBody, useSphericalJoint } from '@react-three/rapier';
import * as THREE from 'three';

// --- Lanyard Rope & Physics Simulation Component ---
function LanyardController({ cardFrontHTML, cardBackHTML }) {
  const { camera } = useThree();
  const lineRef = useRef(null);

  // References for all joints in the chain
  const fixedRef = useRef(null);
  const r1Ref = useRef(null);
  const r2Ref = useRef(null);
  const r3Ref = useRef(null);
  const r4Ref = useRef(null);
  const r5Ref = useRef(null);
  const r6Ref = useRef(null);
  const r7Ref = useRef(null);
  const cardRef = useRef(null);

  // Joints link setup: connects each segment to the next in series
  useSphericalJoint(fixedRef, r1Ref, [[0, 0, 0], [0, 0.45, 0]]);
  useSphericalJoint(r1Ref, r2Ref, [[0, -0.45, 0], [0, 0.45, 0]]);
  useSphericalJoint(r2Ref, r3Ref, [[0, -0.45, 0], [0, 0.45, 0]]);
  useSphericalJoint(r3Ref, r4Ref, [[0, -0.45, 0], [0, 0.45, 0]]);
  useSphericalJoint(r4Ref, r5Ref, [[0, -0.45, 0], [0, 0.45, 0]]);
  useSphericalJoint(r5Ref, r6Ref, [[0, -0.45, 0], [0, 0.45, 0]]);
  useSphericalJoint(r6Ref, r7Ref, [[0, -0.45, 0], [0, 0.45, 0]]);
  useSphericalJoint(r7Ref, cardRef, [[0, -0.45, 0], [0, 1.8, 0]]);

  // Drag state trackers
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Create customized woven strap texture in canvas memory
  const strapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#080c17'; // deep navy
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Stripes
    ctx.fillStyle = '#ff2a75'; // hot pink border lines
    ctx.fillRect(0, 0, canvas.width, 6);
    ctx.fillRect(0, canvas.height - 6, canvas.width, 6);
    
    // Branding repeating text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < 4; i++) {
      const x = (i * 128) + 64;
      ctx.fillText('RAUT • TECH', x, canvas.height / 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(8, 1);
    return texture;
  }, []);

  // Set initial coordinates for line rendering
  const initialPoints = useMemo(() => {
    return Array.from({ length: 30 }, () => new THREE.Vector3(0, 5, 0));
  }, []);

  // Update physical loop calculations
  useFrame((state) => {
    // Read translations of each node
    const p0 = new THREE.Vector3(0, 5, 0); // Fixed anchor
    const p1 = r1Ref.current ? r1Ref.current.translation() : new THREE.Vector3(0, 4.2, 0);
    const p2 = r2Ref.current ? r2Ref.current.translation() : new THREE.Vector3(0, 3.4, 0);
    const p3 = r3Ref.current ? r3Ref.current.translation() : new THREE.Vector3(0, 2.6, 0);
    const p4 = r4Ref.current ? r4Ref.current.translation() : new THREE.Vector3(0, 1.8, 0);
    const p5 = r5Ref.current ? r5Ref.current.translation() : new THREE.Vector3(0, 1.0, 0);
    const p6 = r6Ref.current ? r6Ref.current.translation() : new THREE.Vector3(0, 0.2, 0);
    const p7 = r7Ref.current ? r7Ref.current.translation() : new THREE.Vector3(0, -0.6, 0);
    
    const pCard = cardRef.current ? cardRef.current.translation() : new THREE.Vector3(0, -2.4, 0);
    const cardRot = cardRef.current ? cardRef.current.rotation() : new THREE.Quaternion();
    
    // Offset the curve attachment slightly above the card center (at y = 1.8 in card coordinates)
    const attachOffset = new THREE.Vector3(0, 1.8, 0).applyQuaternion(cardRot);
    const pCardAttach = new THREE.Vector3().addVectors(pCard, attachOffset);

    // Generate smooth CatmullRom curve
    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4, p5, p6, p7, pCardAttach]);
    const curvePoints = curve.getPoints(29); // returns 30 Vector3 coordinates

    // Flatten points array for three.js Line2 geometry
    const flatPoints = [];
    curvePoints.forEach(p => {
      flatPoints.push(p.x, p.y, p.z);
    });

    if (lineRef.current && lineRef.current.geometry) {
      lineRef.current.geometry.setPositions(flatPoints);
      lineRef.current.geometry.attributes.instanceStart.needsUpdate = true;
      lineRef.current.geometry.attributes.instanceEnd.needsUpdate = true;
    }

    // Drag calculations: unproject 2D screen cursor coordinates to Z = 0 plane
    if (isDragging && cardRef.current) {
      const vec = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const distance = (0 - camera.position.z) / dir.z;
      const targetPos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      cardRef.current.setNextKinematicTranslation(targetPos);
    }
  });

  // Toggle dragging modes on pointer actions
  const handlePointerDown = () => {
    if (cardRef.current) {
      setIsDragging(true);
      cardRef.current.setBodyType(2); // set body type to kinematicPosition
    }
  };

  const handlePointerUp = () => {
    if (cardRef.current) {
      setIsDragging(false);
      cardRef.current.setBodyType(0); // return body type to dynamic
    }
  };

  return (
    <group>
      {/* 1. Fixed Anchor Point at top */}
      <RigidBody ref={fixedRef} type="fixed" position={[0, 5, 0]} colliders={false} />

      {/* 2. Rope Segment Rigid Bodies (small masses, high dampings for clean drag swing) */}
      <RigidBody ref={r1Ref} type="dynamic" position={[0, 4.2, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />
      <RigidBody ref={r2Ref} type="dynamic" position={[0, 3.4, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />
      <RigidBody ref={r3Ref} type="dynamic" position={[0, 2.6, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />
      <RigidBody ref={r4Ref} type="dynamic" position={[0, 1.8, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />
      <RigidBody ref={r5Ref} type="dynamic" position={[0, 1.0, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />
      <RigidBody ref={r6Ref} type="dynamic" position={[0, 0.2, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />
      <RigidBody ref={r7Ref} type="dynamic" position={[0, -0.6, 0]} linearDamping={2.5} angularDamping={2.5} mass={0.06} colliders={false} />

      {/* 3. The 3D ID Card Rigid Body (has colliders so it reacts physically) */}
      <RigidBody 
        ref={cardRef} 
        type="dynamic" 
        position={[0, -2.4, 0]} 
        linearDamping={1.5} 
        angularDamping={1.5} 
        mass={0.65}
        colliders="cuboid"
        colliderArgs={[1.1, 1.75, 0.04]} // cuboid half-extents (card size: 2.2 x 3.5 x 0.08)
      >
        <group 
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          {/* Card Body mesh - Frosted Glass panel */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.2, 3.5, 0.08]} />
            <meshPhysicalMaterial 
              roughness={0.15} 
              transparent 
              opacity={0.35} 
              transmission={0.6}
              thickness={0.8}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              color="#080c17"
            />
          </mesh>

          {/* Glowing brand light behind/inside the card */}
          <pointLight 
            position={[0, 0, 0.15]} 
            intensity={isHovered ? 4.5 : 1.8} 
            distance={2.5} 
            color="#ff2a75" 
          />

          {/* Card Edges Border Glow mesh */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.22, 3.52, 0.082]} />
            <meshBasicMaterial color={isHovered ? "#ff2a75" : "#38bdf8"} wireframe opacity={0.65} transparent />
          </mesh>

          {/* Metallic clip loop at the top of the card */}
          <mesh position={[0, 1.82, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.16, 16]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <torusGeometry args={[0.08, 0.02, 8, 24]} />
            <meshStandardMaterial color="#d1d5db" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* --- Front Side Card Details HTML --- */}
          <Html
            position={[0, 0, 0.041]}
            transform
            occlude
            pointerEvents="none"
            distanceFactor={3.2}
          >
            <div dangerouslySetInnerHTML={{ __html: cardFrontHTML }} />
          </Html>

          {/* --- Back Side Card Details HTML --- */}
          <Html
            position={[0, 0, -0.041]}
            rotation={[0, Math.PI, 0]}
            transform
            occlude
            pointerEvents="none"
            distanceFactor={3.2}
          >
            <div dangerouslySetInnerHTML={{ __html: cardBackHTML }} />
          </Html>
        </group>
      </RigidBody>

      {/* 4. Smooth Branded Strap Render line (Line2 geometry updated in useFrame) */}
      <Line
        ref={lineRef}
        points={initialPoints}
        lineWidth={3.8}
        color="#ffffff"
      >
        <meshStandardMaterial 
          map={strapTexture} 
          transparent 
          roughness={0.6}
          alphaTest={0.1}
        />
      </Line>
    </group>
  );
}

// --- Main 3D Lanyard Canvas Wrapper ---
export default function Lanyard() {
  // HTML Markup for Front Side of the Lanyard Card
  const cardFrontHTML = `
    <div style="
      width: 220px;
      height: 350px;
      padding: 1.5rem;
      border-radius: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      user-select: none;
    ">
      <!-- Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.75rem;">
        <div style="font-weight: 800; font-size: 1.25rem; letter-spacing: 0.05em; color: #f8fafc;">
          RA<span style="color: #ff2a75;">UT</span>
        </div>
        <div style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #ff2a75; letter-spacing: 0.1em; background: rgba(255, 42, 117, 0.15); padding: 0.25rem 0.5rem; border-radius: 4px;">
          Core IT
        </div>
      </div>

      <!-- Profile -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin: 1rem 0;">
        <div style="width: 70px; height: 70px; border-radius: 50%; border: 2px solid #ff2a75; overflow: hidden; background: #0f172a; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(255, 42, 117, 0.3);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 21a6 6 0 0 0-12 0"/>
            <circle cx="12" cy="10" r="4"/>
          </svg>
        </div>
        <div style="text-align: center;">
          <h4 style="font-size: 1.05rem; font-weight: 700; margin: 0; letter-spacing: -0.01em;">RAUT PARTNER</h4>
          <span style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em;">Digital Identity</span>
        </div>
      </div>

      <!-- Footer / QR Code details -->
      <div style="display: flex; align-items: flex-end; justify-content: space-between;">
        <div style="max-width: 110px;">
          <p style="font-size: 0.55rem; color: #94a3b8; line-height: 1.3; margin: 0;">"Transforming Ideas Into Digital Excellence"</p>
        </div>
        <!-- Mock techy QR Code -->
        <div style="
          width: 46px; 
          height: 46px; 
          background: #ffffff; 
          border-radius: 4px; 
          padding: 3px; 
          box-sizing: border-box;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
        ">
          <!-- QR pattern squares -->
          <div style="width: 12px; height: 12px; background: #030712; border: 2px solid #030712; box-sizing: border-box;"></div>
          <div style="width: 12px; height: 12px; background: #ffffff;"></div>
          <div style="width: 12px; height: 12px; background: #030712; border: 2px solid #030712; box-sizing: border-box;"></div>
          
          <div style="width: 12px; height: 12px; background: #ffffff;"></div>
          <div style="width: 12px; height: 12px; background: #030712;"></div>
          <div style="width: 12px; height: 12px; background: #ffffff;"></div>
          
          <div style="width: 12px; height: 12px; background: #030712; border: 2px solid #030712; box-sizing: border-box;"></div>
          <div style="width: 12px; height: 12px; background: #ffffff;"></div>
          <div style="width: 12px; height: 12px; background: #030712;"></div>
        </div>
      </div>
    </div>
  `;

  // HTML Markup for Back Side of the Lanyard Card
  const cardBackHTML = `
    <div style="
      width: 220px;
      height: 350px;
      padding: 1.5rem;
      border-radius: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', sans-serif;
      user-select: none;
    ">
      <!-- Top header -->
      <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem;">
        <h4 style="font-size: 0.8rem; font-weight: 700; color: #ff2a75; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">Company Vision</h4>
      </div>

      <!-- Core Message -->
      <div style="margin: 1rem 0;">
        <p style="font-size: 0.8rem; color: #e2e8f0; line-height: 1.5; margin: 0;">
          To be the global benchmark for enterprise cloud architecture, robust systems engineering, and innovative IT orchestration.
        </p>
      </div>

      <!-- Contact Info -->
      <div style="display: flex; flex-direction: column; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: #94a3b8;">
          <span style="color: #ff2a75;">Email:</span> inquiries@raut-tech.com
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: #94a3b8;">
          <span style="color: #ff2a75;">Web:</span> www.raut-tech.com
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; color: #94a3b8;">
          <span style="color: #ff2a75;">Support:</span> 24/7 Response Active
        </div>
      </div>
    </div>
  `;

  return (
    <div style={{ width: '100%', height: '520px', position: 'relative', zIndex: 5, overflow: 'visible' }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 32 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.8} />
        <pointLight position={[10, 10, 10]} intensity={2.5} castShadow />
        <directionalLight 
          position={[-5, 8, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        {/* Physics Simulator World */}
        <Physics gravity={[0, -35, 0]} interpolate={false}>
          <LanyardController 
            cardFrontHTML={cardFrontHTML} 
            cardBackHTML={cardBackHTML} 
          />
        </Physics>
      </Canvas>
    </div>
  );
}
