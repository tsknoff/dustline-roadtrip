export const MAX_SPEED=300/3.6;
export function driveSpeed(speed,{throttle=0,brake=false,offRoad=false,fuel=100,driver=true},dt){
 const before=speed;
 if(fuel>0&&driver)speed+=throttle*dt*(speed*throttle<0?25:18);
 speed*=Math.exp(-dt*(brake?3.5:offRoad?.24:.1));
 if(!driver)speed*=Math.exp(-dt*1.7);
 speed=Math.max(-8,Math.min(offRoad?Math.max(32,before-20*dt):MAX_SPEED,speed));
 return Math.abs(speed)<.03?0:speed;
}
export function steerVehicle(car,input,dt){
 const speed=Math.abs(car.speed),target=((input.KeyA?1:0)-(input.KeyD?1:0))*(.48/(1+(speed/18)**1.65));
 car.steer=(car.steer||0)+(target-(car.steer||0))*(1-Math.exp(-dt*8));
 const rate=car.speed/2.15*Math.tan(car.steer);
 car.yaw+=Math.max(-Math.min(1.15,18/(8+speed)),Math.min(Math.min(1.15,18/(8+speed)),rate))*dt;
}
