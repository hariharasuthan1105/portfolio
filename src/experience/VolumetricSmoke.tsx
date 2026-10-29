import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ShaderMaterial, Vector2 } from 'three';

// A transparent, layered volumetric approximation; no opaque particle cards.
// Character silhouettes remain the supplied artwork, not rigged 3D models.
const fragmentShader = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uPointer;
uniform float uAspect;
float hash(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p) {
 vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
 return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float fbm(vec2 p) {
 float sum=0.0, a=0.5;
 mat2 turn=mat2(0.8,-0.6,0.6,0.8);
 for(int i=0;i<4;i++){sum+=a*noise(p);p=turn*p*2.03+7.1;a*=0.5;}
 return sum;
}
float plume(vec2 uv, vec2 origin, vec2 scale, float seed, float speed) {
 vec2 p=(uv-origin)/scale;
 float t=uTime*speed;
 // Rise, wind, and counter-rotating domain warps create evolving curls.
 p.x+=sin(p.y*3.1-t+seed)*0.15+uPointer.x*0.14;
 vec2 q=vec2(fbm(p*2.0+vec2(seed,-t)),fbm(p*2.0+vec2(4.2+seed,-t*0.8)));
 float d=fbm(p*3.6+q*3.5+vec2(t*0.24,-t*1.7));
 float edge=exp(-dot(p,p)*1.6);
 float filaments=smoothstep(0.28,0.73,d);
 return edge*filaments;
}
void main(){
 vec2 uv=vUv;
 float t=uTime;
 float left=plume(uv,vec2(0.13,0.53),vec2(0.25,0.52),1.0,0.30);
 left+=plume(uv,vec2(0.29,0.64),vec2(0.14,0.27),8.0,0.39)*0.65;
 float right=plume(uv,vec2(0.85,0.44),vec2(0.23,0.52),12.0,0.23);
 right+=plume(uv,vec2(0.92,0.65),vec2(0.19,0.29),4.0,0.34)*0.7;
 vec2 groundUV=vec2(uv.x*4.0+sin(uv.y*9.0+t*0.16)*0.25-t*0.09,uv.y*9.0+t*0.11);
 float ground=fbm(groundUV+fbm(groundUV*1.7)*2.0);
 ground=smoothstep(0.25,0.75,ground)*exp(-pow((uv.y-0.17)/0.15,2.0));
 float clouds=fbm(vec2(uv.x*6.0+t*0.035,uv.y*10.0)+fbm(uv*5.0-t*0.04));
 clouds=smoothstep(0.38,0.75,clouds)*smoothstep(0.76,1.0,uv.y)*0.3;
 float density=left*0.65+right*0.85+ground*0.45+clouds;
 // Keep the central castle and eclipse legible; soften canvas boundaries.
 float edge=smoothstep(0.0,0.06,uv.x)*smoothstep(0.0,0.06,1.0-uv.x);
 float alpha=clamp(density*0.74,0.0,0.58)*edge;
 float silver=mix(0.32,0.93,smoothstep(0.04,0.55,density));
 gl_FragColor=vec4(vec3(silver),alpha);
}`;

function SmokePlane(){
 const material=useRef<ShaderMaterial>(null);
 const target=useRef(new Vector2());
 const elapsed=useRef(0);
 const uniforms=useMemo(()=>({uTime:{value:0},uPointer:{value:new Vector2()},uAspect:{value:1}}),[]);
 useEffect(()=>{
  const move=(e:PointerEvent)=>target.current.set(e.clientX/window.innerWidth-.5,.5-e.clientY/window.innerHeight);
  const reset=()=>target.current.set(0,0);
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',reset);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset)};
 },[]);
 useFrame((state,delta)=>{
  if(!material.current)return;
  elapsed.current+=Math.min(delta,.05);
  material.current.uniforms.uTime.value=elapsed.current;
  material.current.uniforms.uPointer.value.lerp(target.current,1-Math.exp(-delta*2));
  material.current.uniforms.uAspect.value=state.size.width/state.size.height;
 });
 return <mesh frustumCulled={false}><planeGeometry args={[2,2]}/><shaderMaterial ref={material} uniforms={uniforms} vertexShader={`varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}`} fragmentShader={fragmentShader} transparent depthWrite={false} depthTest={false}/></mesh>;
}

export default function VolumetricSmoke(){
 const [active,setActive]=usePageVisibility();
 return <div className="smoke-layer" aria-hidden="true"><Canvas dpr={[.65,1]} frameloop={active?'always':'never'} gl={{alpha:true,antialias:false,powerPreference:'low-power'}} onCreated={({gl})=>gl.setClearColor(0x000000,0)}><SmokePlane/></Canvas></div>;
}

import { useState } from 'react';
function usePageVisibility(){
 const [active,setActive]=useState(!document.hidden);
 useEffect(()=>{const change=()=>setActive(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change)},[]);
 return [active,setActive] as const;
}
