// 1.5 km straights connected by 900 m smooth bends, including negative coordinates.
export function roadX(z){const segment=Math.floor(z/2400),t=(z-segment*2400-1500)/900;const node=n=>Math.sin(n*1.7)*130+Math.sin(n*.61)*65;const u=Math.max(0,Math.min(1,t)),blend=u*u*u*(u*(u*6-15)+10);return node(segment)+(node(segment+1)-node(segment))*blend}
export const roadYaw=z=>Math.atan((roadX(z+.1)-roadX(z-.1))/.2);
export const roadHeight=z=>5*Math.sin(z*.002)+2.5*Math.sin(z*.005)-.5;
export function terrainHeight(x,z){const d=Math.abs(x-roadX(z)),t=Math.max(0,Math.min(1,(d-32)/100)),blend=t*t*(3-2*t);return roadHeight(z)+blend*(10+10*Math.sin(x*.016+z*.008)+7*Math.sin(z*.018-x*.009));}
