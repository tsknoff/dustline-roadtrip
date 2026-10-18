import * as T from './vendor/three.module.js';
import {roadX,roadYaw,roadHeight,terrainHeight} from './terrain.js';
export {roadX,roadYaw} from './terrain.js';
export function random(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)}
export function station(i){if(i<0)return null;const r=random(i+31);if(i!==0&&i%4!==0&&r>.32)return null;const z=i*240+95;return{x:roadX(z)+(i%2?-23:23),z,index:i}}
const materials={};
export function mat(c){return materials[c]??=new T.MeshStandardMaterial({color:c,roughness:.45,metalness:.08})}
export function box(g,x,y,z,w,h,d,c){const o=new T.Mesh(new T.BoxGeometry(w,h,d),typeof c==='string'?mat(c):c);o.position.set(x,y,z);g.add(o);return o}
function orb(g,x,y,z,r,c,sx=1,sy=1,sz=1){const o=new T.Mesh(new T.SphereGeometry(r,16,12),typeof c==='string'?mat(c):c);o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o}
export function label(text,color='#f2ffff',bg='#168cab',w=6,h=1.5){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='bold 62px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,68);const t=new T.CanvasTexture(c);return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,side:T.DoubleSide}))}
function rounded(g,x,y,z,w,h,d,c,r=.07){const shape=new T.Shape();const a=w/2-r,b=h/2-r;shape.moveTo(-a,-h/2);shape.lineTo(a,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,-b);shape.lineTo(w/2,b);shape.quadraticCurveTo(w/2,h/2,a,h/2);shape.lineTo(-a,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,b);shape.lineTo(-w/2,-b);shape.quadraticCurveTo(-w/2,-h/2,-a,-h/2);const geo=new T.ExtrudeGeometry(shape,{depth:Math.max(.01,d-2*r),bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r*.5,bevelThickness:r,curveSegments:5});geo.translate(0,0,-d/2+r);const o=new T.Mesh(geo,typeof c==='string'?mat(c):c);o.position.set(x,y,z);g.add(o);return o}
function pane(g,points,material){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([...points[0],...points[1],...points[2],...points[0],...points[2],...points[3]],3));geo.computeVertexNormals();const m=new T.Mesh(geo,material);g.add(m);return m}
export function createCar(){
 const g=new T.Group();g.name='Subaru Libero E12';const paint='#dce9e4',lower='#4f8e88',trim='#263a40';
 rounded(g,0,.86,-.02,1.69,.77,3.43,paint,.1);rounded(g,0,.57,-.02,1.69,.27,3.45,lower,.06);
 rounded(g,0,2.16,-.13,1.57,.16,3.12,paint,.08);rounded(g,0,2.24,-.23,1.4,.09,2.43,paint,.04);
 const glass=new T.MeshStandardMaterial({color:'#478390',transparent:true,opacity:.28,roughness:.12,metalness:.18,side:T.DoubleSide,depthWrite:false});
 // The E12 windshield leans back into the rounded roof; no bus-like vertical front.
 pane(g,[[-.75,1.26,1.69],[.75,1.26,1.69],[.68,2.08,1.32],[-.68,2.08,1.32]],glass);
 pane(g,[[-.7,1.32,-1.74],[.7,1.32,-1.74],[.7,2.04,-1.64],[-.7,2.04,-1.64]],glass);
 for(const sign of [-1,1]){const x=sign*.805;
  for(const z of [-1.62,-.62,.48]){box(g,x,1.66,z,.075,.87,.075,paint)}
  const pillar=box(g,sign*.73,1.68,1.5,.095,.92,.085,paint);pillar.rotation.x=-.425;
  for(const [lo,hi]of [[-1.58,-.68],[-.57,.42]])pane(g,[[x,1.3,lo],[x,1.3,hi],[x*.94,2.05,hi],[x*.94,2.05,lo]],glass);
  pane(g,[[x,1.3,.53],[x,1.3,1.64],[sign*.69,2.05,1.32],[x*.94,2.05,.53]],glass);
  box(g,x,1.25,-.05,.065,.095,3.3,trim);box(g,x,1.08,-.66,.02,.32,.025,trim);box(g,x,1.08,.47,.02,.32,.025,trim);
  box(g,x,1.16,.28,.05,.045,.23,trim);box(g,x,1.16,-.85,.05,.045,.25,trim);box(g,x,.94,-.85,.035,.025,1.4,trim);
  rounded(g,sign*1.01,1.54,1.14,.2,.24,.12,trim,.035);box(g,sign*.9,1.5,1.13,.19,.035,.045,trim);
  // Black wheel arch lips, with the tire projecting beyond the sill.
  for(const z of [-1.16,1.04]){const arch=new T.Mesh(new T.TorusGeometry(.365,.038,8,24,Math.PI),mat(trim));arch.rotation.y=Math.PI/2;arch.position.set(sign*.86,.38,z);g.add(arch)}
 }
 rounded(g,0,1.03,1.69,1.63,.38,.19,paint,.06);rounded(g,0,.48,1.79,1.79,.28,.25,trim,.07);rounded(g,0,.47,-1.82,1.77,.24,.2,trim,.05);
 rounded(g,0,1.03,1.808,.64,.16,.035,trim,.02);for(const y of [.995,1.04,1.085])box(g,0,y,1.834,.55,.012,.015,'#93a6a8');
 for(const x of [-.58,.58]){rounded(g,x,1.03,1.81,.4,.24,.04,'#f1f7e9',.025);box(g,x,.77,1.811,.34,.12,.03,'#f3a348');rounded(g,x,.62,1.94,.2,.11,.02,'#e5f4ee',.02);rounded(g,x,.87,-1.76,.21,.38,.04,'#af3d45',.03)}
 const badge=label('SUBARU','#edf7f8','#4f8e88',.4,.075);badge.position.set(0,1.185,1.802);g.add(badge);const plate=label('LIBERO','#18383a','#eef7ed',.48,.105);plate.position.set(0,.48,1.923);g.add(plate);
 // Twin roof glass panels and gutters.
 for(const z of [-.72,.55])rounded(g,0,2.255,z,1.05,.025,.72,'#355b66',.02);
 for(const x of [-.76,.76])box(g,x,2.1,-.12,.025,.03,2.9,trim);
 for(const x of [-.4,.4]){rounded(g,x,.98,.65,.58,.16,.58,'#677c7b',.04);rounded(g,x,1.32,.3,.58,.62,.13,'#677c7b',.04);rounded(g,x,1.7,.3,.31,.18,.13,'#677c7b',.04)}
 box(g,0,1.29,1.38,1.46,.18,.37,trim);box(g,-.4,1.41,1.29,.38,.1,.2,'#0e2630');
 const steering=new T.Mesh(new T.TorusGeometry(.2,.025,8,24),mat(trim));steering.position.set(-.4,1.46,1.13);steering.rotation.x=-.6;g.add(steering);
 for(const x of [-.35,.35]){const w=box(g,x,1.29,1.71,.47,.02,.02,trim);w.rotation.z=.12}
 rounded(g,0,.98,-.9,1.33,.19,.6,'#677c7b');rounded(g,0,1.32,-1.2,1.33,.64,.14,'#677c7b');
 const wheels=[],frontPivots=[];for(const x of [-.86,.86])for(const z of [-1.16,1.04]){const turn=new T.Group();turn.position.set(x,.36,z);g.add(turn);if(z>0)frontPivots.push(turn);const spin=new T.Group();turn.add(spin);const tire=new T.Mesh(new T.CylinderGeometry(.355,.355,.21,24),mat('#18272e'));tire.rotation.z=Math.PI/2;spin.add(tire);const hub=new T.Mesh(new T.CylinderGeometry(.215,.215,.22,20),mat('#b6c7c7'));hub.rotation.z=Math.PI/2;spin.add(hub);for(let k=0;k<6;k++){const ang=k*Math.PI/3;const bolt=new T.Mesh(new T.SphereGeometry(.028,6,4),mat(trim));bolt.position.set(x<0?-.12:.12,Math.sin(ang)*.135,Math.cos(ang)*.135);spin.add(bolt)}wheels.push(spin)}
 const lights=[];for(const x of [-.58,.58]){const l=new T.SpotLight('#e2ffff',45,130,.43,.6,1);l.position.set(x,1.03,1.86);l.target.position.set(x,0,40);g.add(l,l.target);lights.push(l)}g.scale.set(.84,.92,1);return{group:g,wheels,frontPivots,lights}
}
export function avatar(color){
 const g=new T.Group();box(g,0,.98,0,.5,.65,.3,color);box(g,0,1.34,0,.24,.13,.2,'#f4caab');
 for(const x of [-.15,.15]){box(g,x,.42,0,.2,.7,.23,'#28486d');box(g,x,.08,.07,.23,.14,.38,'#f0ffff')}
 for(const x of [-.35,.35]){box(g,x,.98,0,.18,.56,.21,color);orb(g,x,.64,.01,.11,'#f4caab')}
 const head=new T.Group();head.position.y=1.65;g.add(head);orb(head,0,0,0,.28,'#f4caab',1,1.13,.9);
 orb(head,0,.2,-.04,.27,'#4c3d35',1,.56,.9);for(const x of [-.285,.285])orb(head,x,-.01,0,.07,'#efb58e',.7,1,.65);
 const eyes=[];for(const x of [-.115,.115]){const eye=new T.Group();eye.position.set(x,.03,.22);head.add(eye);orb(eye,0,0,0,.095,'#ffffff',1,1.05,.7);orb(eye,0,0,.058,.047,'#349db7',1,1,.45);orb(eye,0,0,.08,.024,'#10233d',1,1,.4);orb(eye,-.012,.018,.09,.011,'#ffffff');const brow=box(head,x,.158,.233,.17,.035,.028,'#513e35');brow.rotation.z=x<0?.16:-.16;eyes.push(eye)}
 orb(head,0,-.045,.26,.055,'#e7aa87',.75,.8,1.15);orb(head,0,-.145,.22,.1,'#7f3d48',1,.45,.32);box(head,0,-.127,.255,.13,.025,.016,'#fff8ed');
 g.userData={head,eyes};return g;
}
export function animateAvatar(g,zoom){for(const eye of g.userData.eyes){eye.position.z=.22+zoom*.18;eye.scale.setScalar(1+zoom*.65)}}
let towerMat,bubbleMat,waterMat;
function towerMaterial(){if(towerMat)return towerMat;const c=document.createElement('canvas');c.width=128;c.height=256;const ctx=c.getContext('2d');const grad=ctx.createLinearGradient(0,0,128,256);grad.addColorStop(0,'#c1f7ff');grad.addColorStop(.4,'#379cc8');grad.addColorStop(1,'#166798');ctx.fillStyle=grad;ctx.fillRect(0,0,128,256);ctx.strokeStyle='#b8f7ff';ctx.lineWidth=2;for(let y=0;y<256;y+=16){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(128,y);ctx.stroke()}for(let x=0;x<128;x+=16){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,256);ctx.stroke()}const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;towerMat=new T.MeshStandardMaterial({map,roughness:.18,metalness:.45});towerMat.userData.shared=true;return towerMat}
function bubble(g,x,y,z,r){bubbleMat??=new T.MeshPhysicalMaterial({color:'#a4f2ff',metalness:.25,roughness:.08,transparent:true,opacity:.24,clearcoat:1,iridescence:1,iridescenceIOR:1.3,side:T.FrontSide,depthWrite:false});const b=new T.Group();b.position.set(x,y,z);g.add(b);orb(b,0,0,0,r,bubbleMat);const rim=new T.Mesh(new T.TorusGeometry(r*.88,r*.018,6,32),new T.MeshBasicMaterial({color:'#a5eaff',transparent:true,opacity:.5,depthWrite:false}));rim.rotation.y=.35;rim.rotation.x=.25;b.add(rim);orb(b,-r*.3,r*.45,r*.7,r*.12,'#f4ffff',1,.45,.15);b.userData.baseY=y;b.userData.phase=x;g.userData.bubbles.push(b)}
export function buildChunk(i){const g=new T.Group();g.userData.bubbles=[];const z=i*240,biome=Math.floor(Math.abs(i)/10)%3;const offsets=[-1100,-800,-600,-450,-320,-240,-170,-120,-85,-60,-40,-32,-20,-10,-5,0,5,10,20,32,40,60,85,120,170,240,320,450,600,800,1100],verts=[],indices=[];for(let row=0;row<=48;row++){const zz=z+row*5;for(const dx of offsets){const x=roadX(zz)+dx;verts.push(x,terrainHeight(x,zz)-.03,zz)}}for(let row=0;row<48;row++)for(let col=0;col<offsets.length-1;col++){const a=row*offsets.length+col,b=a+offsets.length;indices.push(a,b,a+1,b,b+1,a+1)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();const land=new T.Mesh(geo,mat(['#79cb43','#69c94d','#94d452'][biome]));land.userData.grounded=true;g.add(land);
 for(let j=0;j<24;j++){const zz=z+j*10+5,x=roadX(zz),yaw=roadYaw(zz),a=zz-5,b=zz+5,xa=roadX(a),xb=roadX(b);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([xa-5,roadHeight(a)+.055,a,xb-5,roadHeight(b)+.055,b,xa+5,roadHeight(a)+.055,a,xb-5,roadHeight(b)+.055,b,xb+5,roadHeight(b)+.055,b,xa+5,roadHeight(a)+.055,a],3));geo.computeVertexNormals();const asphalt=new T.Mesh(geo,mat('#537b8b'));asphalt.userData.grounded=true;g.add(asphalt);for(const side of [-1,1]){const edge=box(g,x+side*4.65,.063,zz,.1,.012,10.3,'#f1ffff');edge.rotation.y=yaw;edge.rotation.x=-Math.atan((roadHeight(zz+1)-roadHeight(zz-1))/2)}if(j%2===0){const line=box(g,x,.065,zz,.12,.014,3.8,'#f1ffff');line.rotation.y=yaw;line.rotation.x=-Math.atan((roadHeight(zz+1)-roadHeight(zz-1))/2)}}
 // Glass towers, park trees, floating bubbles. Station approaches stay clear.
 for(let j=0;j<8;j++){const zz=z+25+j*28,r=random(i*39+j+3),side=j%2?1:-1,x=roadX(zz)+side*(65+r*150),h=25+r*85,w=12+r*13;box(g,x,h/2,zz,w,h,16+r*10,towerMaterial());box(g,x,h+.4,zz,w+1,.8,17+r*10,'#e9ffff');box(g,x,h+5,zz,.22,10,.22,'#d2f8ff');box(g,x,1.3,zz,w+5,2.6,22+r*10,'#d3f3ed')}
 for(let j=0;j<18;j++){const zz=z+random(i*81+j+8)*240,x=roadX(zz)+(j%2?1:-1)*(38+random(i*73+j)*150);box(g,x,1.7,zz,.4,3.4,.4,'#9b8360');orb(g,x,4.2,zz,2.3,j%2?'#49b94f':'#86d548',1,1.3,1);}
 for(let j=0;j<5;j++){const zz=z+random(i*37+j+44)*240,x=roadX(zz)+(j%2?1:-1)*(16+random(i*25+j)*75);bubble(g,x,5+random(i+j+9)*18,zz,1+random(i*11+j)*3)}
 // Layered green foothills and blue mountain silhouettes beyond the city.
 for(let j=0;j<3;j++){const zz=z+j*100,x=roadX(zz)+(j%2?1:-1)*(380+random(i+j)*180),h=100+random(i*7+j+4)*130;const mountain=new T.Mesh(new T.ConeGeometry(125+random(i+j)*70,h,7),mat(j%2?'#578995':'#75a59e'));mountain.position.set(x,h/2-15,zz);g.add(mountain);const cap=new T.Mesh(new T.ConeGeometry(22,h*.2,7),mat('#d5eeee'));cap.position.set(x,h*.9-15,zz);g.add(cap);for(let k=0;k<2;k++)orb(g,x+k*20,160+j*25,zz,20,'#f2ffff',1.5,.5,1)}
 for(let j=0;j<28;j++){const zz=z+random(i*113+j)*240,x=roadX(zz)+(j%2?1:-1)*(10+random(i*31+j+5)*55);if(j%4===0){const rock=new T.Mesh(new T.DodecahedronGeometry(.4+random(j+i)*.6,0),mat('#92b5a0'));rock.position.set(x,.3,zz);g.add(rock)}else{for(let k=0;k<2;k++)orb(g,x+k*.6,.4,zz,.65,j%2?'#46983d':'#65ad3f',1,.7,1)}}
 for(let j=0;j<12;j++){const zz=z+j*20,side=j%2?1:-1,x=roadX(zz)+side*6;box(g,x,.4,zz,.12,.8,.12,'#f2ffff');box(g,x,.62,zz,.13,.15,.13,'#3ba5bd')}
 // Park benches, bins and planters outside the shoulder.
 for(let j=0;j<2;j++){const zz=z+45+j*130,x=roadX(zz)+18;box(g,x,.65,zz,2.1,.14,.65,'#b2c8aa');box(g,x,1,zz+.32,2.1,.6,.1,'#b2c8aa');for(const dx of [-.8,.8])box(g,x+dx,.3,zz,.12,.6,.5,'#446b72');box(g,x+2,.5,zz,.55,1,.55,'#3799aa')}
 waterMat??=new T.MeshStandardMaterial({color:'#34cce4',roughness:.1,metalness:.25});const pond=new T.Mesh(new T.CircleGeometry(20,40),waterMat);pond.rotation.x=-Math.PI/2;pond.position.set(roadX(z+160)+45,.02,z+160);g.add(pond);
 for(let j=0;j<4;j++){const zz=z+j*60,x=roadX(zz)-9;box(g,x,3,zz,.12,6,.12,'#e7ffff');const light=box(g,x+.6,6,zz,1.5,.16,.6,'#e7ffff');orb(g,x+1.1,5.9,zz,.22,'#b5ffff')}
 const s=station(i);if(s){box(g,s.x,.02,s.z,22,.13,24,'#d6eee5');box(g,s.x,1.5,s.z+7,10,3,6,'#e8ffff');box(g,s.x,3.05,s.z+7,10.5,.25,6.5,'#43bac6');box(g,s.x-2,1.6,s.z+3.96,3,1.4,.08,'#3c9fbd');box(g,s.x+2,1.2,s.z+3.95,1.2,2.4,.1,'#6bc5c6');box(g,s.x,3.6,s.z-2,12,.28,8,'#f3ffff');box(g,s.x,3.4,s.z-6,12,.35,.14,'#48c4c4');for(const x of [-5,5])box(g,s.x+x,1.7,s.z-2,.16,3.4,.16,'#cdf7ef');for(const x of [-2,2]){box(g,s.x+x,.6,s.z-2,.8,1.2,.7,'#2db5bf');box(g,s.x+x,1.45,s.z-2,.9,.6,.75,'#f0ffff');box(g,s.x+x,1.5,s.z-2.39,.58,.25,.03,'#234b6a')};box(g,s.x,5.6,s.z+8,.12,4,.15,'#d4f6eb');const sign=label('AERO FUEL');sign.position.set(s.x,7,s.z+8);sign.rotation.y=Math.PI;g.add(sign);const l=new T.PointLight('#c2ffff',12,24,1.5);l.position.set(s.x,3,s.z);g.add(l)}
 const sign=label(`${Math.max(0,i*240/1000).toFixed(1)} KM`,'#ffffff','#249abb',2,.5);sign.position.set(roadX(z+10)+7,1.9,z+10);sign.rotation.y=Math.PI;g.add(sign);box(g,roadX(z+10)+7,.9,z+10,.06,1.8,.06,'#d2eeee');for(const o of g.children){if(o.userData.grounded)continue;const h=terrainHeight(o.position.x,o.position.z);o.position.y+=h;if(o.userData.baseY!==undefined)o.userData.baseY+=h}return g;
}
export function animateChunk(g,time){for(const b of g.userData.bubbles){b.position.y=b.userData.baseY+Math.sin(time*.55+b.userData.phase)*1.5;b.rotation.y=time*.12}}
export function disposeGroup(g){g.traverse(o=>{o.geometry?.dispose();if(o.material?.map&&!o.material.userData.shared){o.material.map.dispose();o.material.dispose()}else if(o.geometry?.type==='TorusGeometry'&&o.material?.isMeshBasicMaterial)o.material.dispose()})}
