// No forward speed limiter: acceleration remains available above 300 km/h.
export const MAX_SPEED=Infinity;
export function driveSpeed(speed,{throttle=0,brake=false,offRoad=false,fuel=100,driver=true,drift=false},dt){
 if(fuel>0&&driver)speed+=throttle*dt*(speed*throttle<0?25:18);
 if(brake)speed*=Math.exp(-dt*3.5);
 else if(offRoad)speed*=Math.exp(-dt*.24);
 else if(!throttle||!fuel)speed*=Math.exp(-dt*.1);
 if(drift)speed*=Math.exp(-dt*.08);
 if(!driver)speed*=Math.exp(-dt*1.7);
 speed=Math.max(-8,speed);return Math.abs(speed)<.03?0:speed;
}
export function steerVehicle(car,input,dt){
 const speed=Math.abs(car.speed),drift=!!input.ShiftLeft&&speed>7;
 const target=((input.KeyA?1:0)-(input.KeyD?1:0))*(.48/(1+(speed/18)**1.65))*(drift?2.4:1);
 car.steer=(car.steer||0)+(target-(car.steer||0))*(1-Math.exp(-dt*8));
 const limit=drift?Math.min(1.5,40/(12+speed)):Math.min(1.15,18/(8+speed));
 const oldYaw=car.yaw;car.yaw+=Math.max(-limit,Math.min(limit,car.speed/2.15*Math.tan(car.steer)))*dt;
 // Momentum follows the nose slowly during a slide, then regains grip smoothly.
 const heading=car.heading??oldYaw,angle=Math.atan2(Math.sin(car.yaw-heading),Math.cos(car.yaw-heading));
 car.heading=heading+angle*(1-Math.exp(-dt*(drift?1.15:10)));
 car.slip=Math.atan2(Math.sin(car.yaw-car.heading),Math.cos(car.yaw-car.heading));
 car.drifting=drift;
}
