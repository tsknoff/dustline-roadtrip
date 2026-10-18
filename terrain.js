export const roadX=z=>Math.sin(z*.0018)*85+Math.sin(z*.0047)*20+(1-Math.cos(z*.0012))*.5*Math.sin(z*.009)*42;
export const roadYaw=z=>Math.atan((roadX(z+.1)-roadX(z-.1))/.2);
export const roadHeight=z=>5*Math.sin(z*.002)+2.5*Math.sin(z*.005)-.5;
export function terrainHeight(x,z){const d=Math.abs(x-roadX(z)),t=Math.max(0,Math.min(1,(d-32)/100)),blend=t*t*(3-2*t);return roadHeight(z)+blend*(10+10*Math.sin(x*.016+z*.008)+7*Math.sin(z*.018-x*.009));}
