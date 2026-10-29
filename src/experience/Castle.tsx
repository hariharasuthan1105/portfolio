import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Tower({x,z,h,r=0.65}:{x:number;z:number;h:number;r?:number}){
 return <group position={[x,0,z]}><mesh position={[0,h/2,0]}><cylinderGeometry args={[r,r*1.18,h,8]}/><meshStandardMaterial color="#444448" roughness={.92}/></mesh><mesh position={[0,h+.85,0]}><coneGeometry args={[r*1.45,1.9,8]}/><meshStandardMaterial color="#161619" metalness={.35} roughness={.6}/></mesh><mesh position={[0,h+1.94,0]}><coneGeometry args={[.055,.65,4]}/><meshStandardMaterial color="#a1a1a1"/></mesh>{[.38,.65,.86].map((p,i)=><mesh key={i} position={[0,h*p,r*.96]}><boxGeometry args={[.13,.46,.035]}/><meshBasicMaterial color="#dedee3"/></mesh>)}<mesh position={[0,h-.12,0]}><cylinderGeometry args={[r*1.19,r*1.19,.2,8]}/><meshStandardMaterial color="#66666a"/></mesh></group>
}
function World({entered,reduced,onGate}:{entered:boolean;reduced:boolean;onGate:()=>void}){
 const world=useRef<THREE.Group>(null); const gate=useRef<THREE.Group>(null);
 const blocks=useMemo(()=>Array.from({length:96},(_,i)=>({x:Math.sin(i*7.8)*5.4,y:-1.1-Math.abs(Math.cos(i*3.3))*1.6,z:Math.cos(i*5.1)*3.7,s:.4+(i%7)*.19})),[]);
 useFrame(({camera,pointer,clock},delta)=>{if(!world.current)return;world.current.rotation.y=THREE.MathUtils.damp(world.current.rotation.y,reduced?-.18:pointer.x*.12-.18,2,delta);camera.position.z=THREE.MathUtils.damp(camera.position.z,entered?12:17,1.4,delta);camera.lookAt(0,2.7,0);if(gate.current)gate.current.rotation.y=THREE.MathUtils.damp(gate.current.rotation.y,entered?-1.6:0,3,delta);if(!reduced)world.current.position.y=Math.sin(clock.elapsedTime*.3)*.035;});
 return <><color attach="background" args={['#08080a']}/><fog attach="fog" args={['#08080a',16,35]}/><ambientLight intensity={.7}/><directionalLight position={[-5,9,4]} intensity={3} color="#e8e8ef"/><pointLight position={[0,3,5]} intensity={15} color="white"/><mesh position={[0,6,-6]}><circleGeometry args={[3.1,96]}/><meshBasicMaterial color="#111114"/></mesh><mesh position={[0,6,-5.95]}><ringGeometry args={[3.12,3.18,96]}/><meshBasicMaterial color="#dedee5" toneMapped={false}/></mesh><group ref={world} rotation={[0,-.18,0]}>
 <Instances limit={96}><dodecahedronGeometry args={[1,0]}/><meshStandardMaterial color="#252528" roughness={1}/>{blocks.map((b,i)=><Instance key={i} position={[b.x,b.y,b.z]} scale={[b.s,b.s*2,b.s]} rotation={[i,i*.4,0]}/>)}</Instances>
 <mesh position={[0,-.35,0]}><cylinderGeometry args={[5.1,3.7,1.1,12]}/><meshStandardMaterial color="#343438"/></mesh>
 <mesh position={[0,1.5,0]}><boxGeometry args={[6.5,3,3]}/><meshStandardMaterial color="#333337" roughness={.9}/></mesh>
 <mesh position={[0,3,-.6]}><boxGeometry args={[2.8,5.5,2.2]}/><meshStandardMaterial color="#4b4b50"/></mesh>
 <Tower x={0} z={-.7} h={7.3} r={.8}/><Tower x={-1.65} z={-1} h={5.8} r={.55}/><Tower x={1.65} z={-1} h={5.8} r={.55}/>
 {[-3.1,3.1].flatMap(x=>[-1.3,1.5].map(z=><Tower key={`${x}-${z}`} x={x} z={z} h={z>0?3.7:4.6}/>))}
 <Instances limit={40}><boxGeometry args={[.3,.5,.35]}/><meshStandardMaterial color="#55555a"/>{Array.from({length:20},(_,i)=><Instance key={i} position={[-3+i*.32,3.2,1.55]}/>)}{Array.from({length:20},(_,i)=><Instance key={i+20} position={[-3+i*.32,3.2,-1.55]}/>)}</Instances>
 <mesh position={[0,1.1,1.54]}><boxGeometry args={[1.35,2.2,.15]}/><meshBasicMaterial color="#09090b"/></mesh>
 <group ref={gate} position={[-.63,0,1.7]}><mesh position={[.63,1,0]} onClick={onGate} onPointerOver={()=>{document.body.style.cursor='pointer'}} onPointerOut={()=>{document.body.style.cursor=''}}><boxGeometry args={[1.25,2,.14]}/><meshStandardMaterial color="#55555c" metalness={.7} roughness={.35}/></mesh>{Array.from({length:6},(_,i)=><mesh key={i} position={[.12+i*.2,1,.1]}><boxGeometry args={[.035,2,.04]}/><meshBasicMaterial color="#b7b7bc"/></mesh>)}</group>
 {Array.from({length:11},(_,i)=><mesh key={i} position={[0,-.05-i*.11,2+i*.28]}><boxGeometry args={[1.8+i*.06,.18,.3]}/><meshStandardMaterial color="#48484d"/></mesh>)}
 <Instances limit={28}><boxGeometry args={[.12,.48,.04]}/><meshBasicMaterial color="#ccc"/>{Array.from({length:28},(_,i)=><Instance key={i} position={[-2.7+(i%7)*.9,.8+Math.floor(i/7)*.62,1.53]}/>)}</Instances>
 </group>{!reduced&&<Sparkles count={65} scale={[20,12,12]} size={1.4} speed={.16} color="#eee"/>}<mesh rotation={[-Math.PI/2,0,0]} position={[0,-3,0]}><planeGeometry args={[150,150]}/><meshStandardMaterial color="#08080a" roughness={.8}/></mesh></>;
}
export default function Castle(props:{entered:boolean;reduced:boolean;onGate:()=>void}){
 useEffect(()=>()=>{document.body.style.cursor=''},[]);
 return <Canvas dpr={[1,1.5]} camera={{position:[9,6,17],fov:42}} gl={{antialias:true,powerPreference:'low-power'}} frameloop={props.reduced?'demand':'always'}><World {...props}/></Canvas>;
}
