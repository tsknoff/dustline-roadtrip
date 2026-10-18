import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {randomBytes} from 'node:crypto';
import {WebSocketServer,WebSocket} from 'ws';
export function createServer(){
 const root=path.dirname(fileURLToPath(import.meta.url)),rooms=new Map();
 const files=new Set(['index.html','style.css','game.js','world.js','direct.js','relay.js','vehicle.js','motion.js','terrain.js','vendor/peerjs.min.js','vendor/three.module.js']);
 const server=http.createServer(async(req,res)=>{let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html'}catch{res.writeHead(400).end();return}if(name==='health'){res.writeHead(200,{'Content-Type':'application/json'}).end('{"ok":true}');return}if(!files.has(name)){res.writeHead(404).end('Not found');return}try{const bytes=await readFile(path.join(root,name));res.writeHead(200,{'Content-Type':name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'}).end(bytes)}catch{res.writeHead(500).end('Unable to load game')}});
 const wss=new WebSocketServer({server,path:'/ws',maxPayload:16384});
 const send=(s,d)=>{if(s?.readyState===WebSocket.OPEN){if(s.bufferedAmount>262144){s.terminate();return}s.send(JSON.stringify(d))}};
 function leave(s){const r=rooms.get(s.code);if(!r)return;if(r.host===s){rooms.delete(s.code);if(r.guest){send(r.guest,{type:'ended'});r.guest.code=null;r.guest.close(1000,'Host left')}}else if(r.guest===s){r.guest=null;send(r.host,{type:'left'})}s.code=null}
 wss.on('connection',s=>{s.alive=true;s.code=null;s.count=0;s.window=Date.now();s.on('pong',()=>s.alive=true);const setup=setTimeout(()=>{if(!s.code)s.close(1008,'Join a room first')},15000);s.on('error',()=>{});s.on('close',()=>{clearTimeout(setup);leave(s)});s.on('message',(raw,binary)=>{if(binary){s.close(1003);return}if(Date.now()-s.window>1000){s.window=Date.now();s.count=0}if(++s.count>120){s.close(1008,'Rate limit');return}let m;try{m=JSON.parse(raw)}catch{send(s,{type:'error',code:'invalid'});return}if(!m||typeof m!=='object')return;
 if(m.type==='create'&&!s.code){if(rooms.size>=500){send(s,{type:'error',code:'capacity'});return}let code;do{code=Array.from(randomBytes(6),v=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[v%32]).join('')}while(rooms.has(code));rooms.set(code,{host:s,guest:null});s.code=code;send(s,{type:'ready',code});return}
 if(m.type==='join'&&!s.code){const code=String(m.code||'').trim().toUpperCase();const r=rooms.get(code);if(!r){send(s,{type:'error',code:'not-found'});return}if(r.guest){send(s,{type:'error',code:'full'});return}r.guest=s;s.code=code;send(s,{type:'joined',code});send(r.host,{type:'joined',code});return}
 const r=rooms.get(s.code);if(m.type==='data'&&r&&m.data&&typeof m.data==='object'){const host=r.host===s,allowed=host?['state','toast','horn']:['input','action'];if(allowed.includes(m.data.type))send(host?r.guest:r.host,{type:'data',data:m.data})}
 })});
 const heartbeat=setInterval(()=>{for(const s of wss.clients){if(!s.alive){s.terminate();continue}s.alive=false;s.ping()}},25000);heartbeat.unref();
 return{server,rooms,close:async()=>{clearInterval(heartbeat);for(const s of wss.clients)s.terminate();await new Promise(r=>wss.close(r));await new Promise(r=>server.close(r))}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const app=createServer();app.server.listen(Number(process.env.PORT)||4174,'0.0.0.0',()=>console.log('DUSTLINE listening on '+app.server.address().port));process.on('SIGTERM',async()=>{await app.close();process.exit(0)})}
