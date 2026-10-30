import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ShaderMaterial } from "three";
const vertex = `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
const fragment = `
varying vec2 vUv; uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float n=0., a=.5;for(int i=0;i<5;i++){n+=noise(p)*a;p=p*2.03+vec2(17.1,9.2);a*=.5;}return n;}
void main(){vec2 p=vUv*vec2(5.,3.); p.x-=time*.055;float n=fbm(p+fbm(p+time*.035));float edge=smoothstep(0.,.22,vUv.x)*smoothstep(0.,.22,1.-vUv.x)*smoothstep(0.,.3,vUv.y)*smoothstep(0.,.3,1.-vUv.y);float density=smoothstep(.32,.75,n)*edge*.2;gl_FragColor=vec4(vec3(.85),density);}`;
export default function Smoke() {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ time: { value: 0 } }), []);
  useFrame((_, d) => {
    if (material.current) material.current.uniforms.time.value += d;
  });
  return (
    <mesh position={[0, -0.7, -1]}>
      <planeGeometry args={[8, 4]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
