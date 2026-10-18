import * as T from './vendor/three.module.js';
export const roadX=z=>Math.sin(z*.0018)*85+Math.sin(z*.0047)*20;
export const roadYaw=z=>Math.atan(Math.cos(z*.0018)*.153+Math.cos(z*.0047)*.094);
export function random(n){const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)}
export function station(i){if(i<0)return null;const r=random(i+31);if(i!==0&&i%4!==0&&r>.32)return null;const z=i*240+95;return{x:roadX(z)+(i%2?-23:23),z,index:i}}
const materials={};
export function mat(c){return materials[c]??=new T.MeshStandardMaterial({color:c,roughness:.45,metalness:.08})}
export function box(g,x,y,z,w,h,d,c){const o=new T.Mesh(new T.BoxGeometry(w,h,d),typeof c==='string'?mat(c):c);o.position.set(x,y,z);g.add(o);return o}
function orb(g,x,y,z,r,c,sx=1,sy=1,sz=1){const o=new T.Mesh(new T.SphereGeometry(r,16,12),typeof c==='string'?mat(c):c);o.position.set(x,y,z);o.scale.set(sx,sy,sz);g.add(o);return o}
export function label(text,color='#f2ffff',bg='#168cab',w=6,h=1.5){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='bold 62px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,68);const t=new T.CanvasTexture(c);return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,side:T.DoubleSide}))}
export function createCar(){
 const g=new T.Group();g.name='Libero-inspired cab-over microvan';const paint='#e9fff6',lower='#2caaa2',trim='#243e4c';
 // Tall, narrow cab-over body, flat nose, long side windows and sliding door.
 box(g,0,.72,0,1.88,.64,3.8,lower);box(g,0,1.21,0,1.9,.4,3.78,paint);
 box(g,0,2.42,-.02,1.88,.2,3.6,paint);box(g,0,2.55,-.15,1.68,.13,2.9,paint);
 const glass=new T.MeshStandardMaterial({color:'#73d8e5',transparent:true,opacity:.17,roughness:.12,metalness:.25,depthWrite:false});
 box(g,0,1.94,1.79,1.68,.82,.025,glass);box(g,0,1.94,-1.83,1.65,.83,.025,glass);
 for(const x of [-.92,.92]){
   for(const z of [-1.8,-.55,.57,1.77])box(g,x,1.94,z,.095,1,.095,paint);
   box(g,x,1.93,-.02,.025,.78,3.35,glass);box(g,x,1.46,0,.06,.1,3.55,trim);
   box(g,x,1.18,-.56,.035,.46,.022,trim);box(g,x,1.18,.57,.035,.46,.022,trim);
   box(g,x,1.27,.35,.045,.06,.26,trim);box(g,x,1.27,-.75,.045,.06,.28,trim);
   box(g,x,1.02,-.8,.05,.035,1.75,'#5a7985');
   box(g,x*1.18,1.75,1.32,.24,.27,.16,trim);box(g,x*1.06,1.68,1.32,.23,.05,.08,trim);
 }
 box(g,0,.59,1.96,1.95,.19,.18,trim);box(g,0,.59,-1.96,1.95,.19,.18,trim);
 box(g,0,1.13,1.91,.7,.2,.03,trim);for(const x of [-.66,.66]){box(g,x,1.12,1.92,.42,.29,.035,'#efffff');box(g,x,.87,1.92,.42,.13,.04,'#ffb54d');box(g,x,1,-1.92,.22,.48,.04,'#d9526b')}
 const badge=label('LIBERO','#ffffff','#2caaa2',.6,.13);badge.position.set(0,1.4,1.918);g.add(badge);
 box(g,0,.75,1.965,.52,.14,.02,'#f8ffff');box(g,0,1.47,1.8,1.7,.14,.35,trim);
 for(const x of [-.44,.44]){box(g,x,1.16,.72,.64,.22,.68,'#5b9f9a');box(g,x,1.55,.36,.64,.74,.16,'#5b9f9a');box(g,x,1.93,.36,.38,.2,.17,'#5b9f9a')}
 box(g,0,1.1,-.95,1.5,.22,.7,'#5b9f9a');box(g,0,1.5,-1.32,1.5,.8,.16,'#5b9f9a');
 const steering=new T.Mesh(new T.TorusGeometry(.22,.025,8,20),mat(trim));steering.position.set(-.44,1.63,1.3);steering.rotation.x=-.5;g.add(steering);
 // Wipers lie below the field of view.
 for(const x of [-.4,.4]){const w=box(g,x,1.58,1.82,.55,.025,.025,trim);w.rotation.z=.15}
 const wheels=[];for(const x of [-.96,.96])for(const z of [-1.23,1.22]){const pivot=new T.Group();pivot.position.set(x,.4,z);g.add(pivot);const tire=new T.Mesh(new T.CylinderGeometry(.4,.4,.22,20),mat('#243642'));tire.rotation.z=Math.PI/2;pivot.add(tire);const hub=new T.Mesh(new T.CylinderGeometry(.23,.23,.235,16),mat('#d5eeee'));hub.rotation.z=Math.PI/2;pivot.add(hub);wheels.push(pivot)}
 const lights=[];for(const x of [-.66,.66]){const l=new T.SpotLight('#e2ffff',45,130,.43,.6,1);l.position.set(x,1.1,1.98);l.target.position.set(x,0,40);g.add(l,l.target);lights.push(l)}return{group:g,wheels,lights}
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
export function buildChunk(i){const g=new T.Group();g.userData.bubbles=[];const z=i*240,biome=Math.floor(Math.abs(i)/10)%3;box(g,roadX(z+120),-.22,z+120,2200,.4,240,['#79cb43','#69c94d','#94d452'][biome]);
 for(let j=0;j<24;j++){const zz=z+j*10+5,x=roadX(zz),yaw=roadYaw(zz),a=zz-5,b=zz+5,xa=roadX(a),xb=roadX(b);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([xa-5,.055,a,xb-5,.055,b,xa+5,.055,a,xb-5,.055,b,xb+5,.055,b,xa+5,.055,a],3));geo.computeVertexNormals();g.add(new T.Mesh(geo,mat('#537b8b')));for(const side of [-1,1]){const edge=box(g,x+side*4.65,.063,zz,.1,.012,10.3,'#f1ffff');edge.rotation.y=yaw}if(j%2===0){const line=box(g,x,.065,zz,.12,.014,3.8,'#f1ffff');line.rotation.y=yaw}}
 // Glass towers, park trees, floating bubbles. Station approaches stay clear.
 for(let j=0;j<8;j++){const zz=z+25+j*28,r=random(i*39+j+3),side=j%2?1:-1,x=roadX(zz)+side*(65+r*150),h=25+r*85,w=12+r*13;box(g,x,h/2,zz,w,h,16+r*10,towerMaterial());box(g,x,h+.4,zz,w+1,.8,17+r*10,'#e9ffff');box(g,x,h+5,zz,.22,10,.22,'#d2f8ff');box(g,x,1.3,zz,w+5,2.6,22+r*10,'#d3f3ed')}
 for(let j=0;j<18;j++){const zz=z+random(i*81+j+8)*240,x=roadX(zz)+(j%2?1:-1)*(38+random(i*73+j)*150);box(g,x,1.7,zz,.4,3.4,.4,'#9b8360');orb(g,x,4.2,zz,2.3,j%2?'#49b94f':'#86d548',1,1.3,1);}
 for(let j=0;j<5;j++){const zz=z+random(i*37+j+44)*240,x=roadX(zz)+(j%2?1:-1)*(16+random(i*25+j)*75);bubble(g,x,5+random(i+j+9)*18,zz,1+random(i*11+j)*3)}
 // White cloud clusters and landscaped hills replace the desert mountains.
 for(let j=0;j<2;j++){const zz=z+80+j*100,x=roadX(zz)+(j?1:-1)*350;orb(g,x,-12,zz,90,'#78c54f',1,.4,1);for(let k=0;k<3;k++)orb(g,x+k*18,105+j*25,zz,20,'#f2ffff',1.5,.5,1)}
 waterMat??=new T.MeshStandardMaterial({color:'#34cce4',roughness:.1,metalness:.25});const pond=new T.Mesh(new T.CircleGeometry(20,40),waterMat);pond.rotation.x=-Math.PI/2;pond.position.set(roadX(z+160)+45,.02,z+160);g.add(pond);
 for(let j=0;j<4;j++){const zz=z+j*60,x=roadX(zz)-9;box(g,x,3,zz,.12,6,.12,'#e7ffff');const light=box(g,x+.6,6,zz,1.5,.16,.6,'#e7ffff');orb(g,x+1.1,5.9,zz,.22,'#b5ffff')}
 const s=station(i);if(s){box(g,s.x,.02,s.z,22,.13,24,'#d6eee5');box(g,s.x,1.5,s.z+7,10,3,6,'#e8ffff');box(g,s.x,3.05,s.z+7,10.5,.25,6.5,'#43bac6');box(g,s.x-2,1.6,s.z+3.96,3,1.4,.08,'#3c9fbd');box(g,s.x+2,1.2,s.z+3.95,1.2,2.4,.1,'#6bc5c6');box(g,s.x,3.6,s.z-2,12,.28,8,'#f3ffff');box(g,s.x,3.4,s.z-6,12,.35,.14,'#48c4c4');for(const x of [-5,5])box(g,s.x+x,1.7,s.z-2,.16,3.4,.16,'#cdf7ef');for(const x of [-2,2]){box(g,s.x+x,.6,s.z-2,.8,1.2,.7,'#2db5bf');box(g,s.x+x,1.45,s.z-2,.9,.6,.75,'#f0ffff');box(g,s.x+x,1.5,s.z-2.39,.58,.25,.03,'#234b6a')};box(g,s.x,5.6,s.z+8,.12,4,.15,'#d4f6eb');const sign=label('AERO FUEL');sign.position.set(s.x,7,s.z+8);sign.rotation.y=Math.PI;g.add(sign);const l=new T.PointLight('#c2ffff',12,24,1.5);l.position.set(s.x,3,s.z);g.add(l)}
 const sign=label(`${Math.max(0,i*240/1000).toFixed(1)} KM`,'#ffffff','#249abb',2,.5);sign.position.set(roadX(z+10)+7,1.9,z+10);sign.rotation.y=Math.PI;g.add(sign);box(g,roadX(z+10)+7,.9,z+10,.06,1.8,.06,'#d2eeee');return g;
}
export function animateChunk(g,time){for(const b of g.userData.bubbles){b.position.y=b.userData.baseY+Math.sin(time*.55+b.userData.phase)*1.5;b.rotation.y=time*.12}}
export function disposeGroup(g){g.traverse(o=>{o.geometry?.dispose();if(o.material?.map&&!o.material.userData.shared){o.material.map.dispose();o.material.dispose()}else if(o.geometry?.type==='TorusGeometry'&&o.material?.isMeshBasicMaterial)o.material.dispose()})}
