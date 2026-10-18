export function connectRelay(host,code,{ready,error}){
 const events={},socket=new WebSocket(`${location.protocol==='https:'?'wss:':'ws:'}//${location.host}/ws`);let paired=false,closed=false,reported=false;
 const emit=(name,value)=>(events[name]||[]).forEach(f=>f(value));
 const fail=text=>{if(reported||closed)return;reported=true;error(text)};
 const timer=setTimeout(()=>{fail('Сервер не ответил. На бесплатном Render первый запуск может занять минуту. Обнови страницу и попробуй снова.');socket.close()},70000);
 const conn={get open(){return paired&&socket.readyState===WebSocket.OPEN},on(name,f){(events[name]??=[]).push(f);return conn},send(data){if(conn.open&&socket.bufferedAmount<131072)socket.send(JSON.stringify({type:'data',data}))},close(){closed=true;clearTimeout(timer);socket.close()}};
 socket.onopen=()=>socket.send(JSON.stringify(host?{type:'create'}:{type:'join',code}));
 socket.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}if(m.type==='ready'){clearTimeout(timer);ready(m.code)}if(m.type==='joined'){clearTimeout(timer);if(!host)ready(m.code);paired=true;emit('open')}if(m.type==='data')emit('data',m.data);if(m.type==='left'){paired=false;emit('close')}if(m.type==='ended'){paired=false;emit('close')}if(m.type==='error'){clearTimeout(timer);fail({'not-found':'Комната не найдена. Проверь код и вкладку хозяина.','full':'В комнате уже два игрока.','capacity':'Сервер заполнен. Попробуй позже.'}[m.code]||'Сервер отклонил запрос. Попробуй снова.');socket.close()}};
 socket.onerror=()=>fail('Не удалось связаться с сервером Render по WebSocket. Проверь доступ к сайту и попробуй снова.');
 socket.onclose=()=>{clearTimeout(timer);if(closed)return;if(paired){paired=false;emit('close')}else if(host)fail('Связь с сервером комнат прервана. Обнови страницу, чтобы создать новую комнату.')};
 return conn;
}
