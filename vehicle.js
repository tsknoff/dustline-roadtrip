export const MAX_SPEED=300/3.6;
export function driveSpeed(speed,{throttle=0,brake=false,offRoad=false,fuel=100,driver=true},dt){
 if(fuel>0&&driver)speed+=throttle*dt*(speed*throttle<0?25:18);
 speed*=Math.exp(-dt*(brake?3.5:offRoad?.55:.1));
 if(!driver)speed*=Math.exp(-dt*1.7);
 speed=Math.max(-8,Math.min(offRoad?32:MAX_SPEED,speed));
 return Math.abs(speed)<.03?0:speed;
}
