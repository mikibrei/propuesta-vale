const y=[{n:"Billete",d:"S\xF3lo las l\xEDneas del billete: se engruesan en la sombra, sin borde."},{n:"Grano",d:"Tramado de grano; un borde n\xEDtido y el otro hecho polvo."},{n:"N\xFAmeros",d:"La forma hecha de d\xEDgitos que cambian."},{n:"Manitos",d:"La forma llena, con dos manos de verdad."}],R=[["Reposo","un c\xEDrculo que respira"],["Escuchando","una p\xEDldora que se ensancha con tu voz"],["Pensando","una gota que gira despacio"],["Buscando","sale un pedacito, da la vuelta y vuelve"],["Hablando","un globo que late con las s\xEDlabas"],["Confirm\xE1","medio c\xEDrculo que asiente"],["Subi\xF3","un tri\xE1ngulo que sube"],["Baj\xF3","un tri\xE1ngulo que se hunde"],["No puedo","se desinfla y se aplasta"],["Leyendo tu cartera","una tarjeta que se lee"],["Vigilando","una lente que mira de lado a lado"],["Te avisa","salta, y le aparece un aviso"]],w="attribute vec2 aP; varying vec2 vP; void main(){ vP = aP; gl_Position = vec4(aP, 0.0, 1.0); }",D=`precision highp float;
varying vec2 vP; uniform float uT, uTex, uEst, uPx, uVoz, uDeA, uDeB, uDeQ, uMez; uniform vec3 uTinta; uniform sampler2D uDig;

float h21(vec2 q){ vec3 q3 = fract(vec3(q.xyx)*0.1031); q3 += dot(q3, q3.yzx + 33.33); return fract((q3.x + q3.y)*q3.z); }
float smin(float a, float b, float k){ float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0); return mix(b, a, h) - k*h*(1.0 - h); }
float cap(vec2 p, vec2 a, vec2 b, float r){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0); return length(pa - ba*h) - r; }
float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
float tri(vec2 p, float r){ const float k = 1.7320508; p.x = abs(p.x) - r; p.y = p.y + r/k;
  if (p.x + k*p.y > 0.0) p = vec2(p.x - k*p.y, -k*p.x - p.y)/2.0; p.x -= clamp(p.x, -2.0*r, 0.0); return -length(p)*sign(p.y); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float onda(float t, float T, float a, float b){ float u = mod(t, T)/T; return (u < a || u > b) ? 0.0 : sin((u - a)/(b - a)*3.14159); }

float mano(vec2 p, vec2 c, float a, float s){
  vec2 q = rot(a)*(p - c)/s;
  float d = rbox(q - vec2(0.0, -0.02), vec2(0.20, 0.19), 0.12);
  d = smin(d, cap(q, vec2(-0.12, 0.10), vec2(-0.14, 0.34), 0.068), 0.03);
  d = smin(d, cap(q, vec2( 0.00, 0.12), vec2( 0.00, 0.40), 0.070), 0.03);
  d = smin(d, cap(q, vec2( 0.12, 0.10), vec2( 0.14, 0.33), 0.066), 0.03);
  d = smin(d, cap(q, vec2(-0.16, -0.06), vec2(-0.34, 0.08), 0.070), 0.04);
  return d*s;
}

float manoI(vec2 p, vec2 c, float a, float s){ return mano(vec2(-p.x, p.y), c, a, s); }

float cuerpoE(vec2 p, float e){
  float t = uT;
  if (e < 0.5){ float r = 0.50*(1.0 + 0.025*sin(t*1.2)); return length(p*vec2(1.0, 1.0 + 0.03*sin(t*1.2))) - r; }
  if (e < 1.5){ float asiente = 0.06*pow(max(0.0, sin(t*2.4)), 6.0); vec2 q = rot(-0.10 - asiente)*p;
    float w = 0.14 + 0.08*uVoz; return cap(q, vec2(-w, 0.0), vec2(w, 0.0), 0.38); }
  if (e < 2.5){ vec2 q = rot(t*0.5)*p; return smin(length(q - vec2(0.0, -0.08)) - 0.40, length(q - vec2(0.0, 0.42)) - 0.10, 0.32); }
  if (e < 3.5){ float a = t*1.1; vec2 s = 0.64*vec2(cos(a), sin(a)); return smin(length(p) - 0.40, length(p - s) - 0.12, 0.22); }
  if (e < 4.5){ float v = uVoz; return rbox(p, vec2(0.46 + 0.05*v, 0.32 + 0.06*v), 0.30); }
  if (e < 5.5){ vec2 q = rot(0.18*onda(t, 2.6, 0.25, 0.55))*(p - vec2(0.0, -0.14)); return max(length(q) - 0.54, -q.y); }
  if (e < 6.5){ float b = abs(sin(mod(t, 1.8)/1.8*3.14159)); return tri(p - vec2(0.0, 0.02 + 0.10*b), 0.40) - 0.10; }
  if (e < 7.5){ float b = 0.5 + 0.5*sin(t*1.1); vec2 q = p - vec2(0.0, -0.04 - 0.06*b); return tri(vec2(q.x, -q.y), 0.40) - 0.10; }
  if (e < 8.5){ float u = mod(t, 4.0)/4.0, s = u < 0.15 ? 0.0 : u < 0.40 ? smoothstep(0.15, 0.40, u) : u < 0.75 ? 1.0 : 1.0 - smoothstep(0.75, 1.0, u);
    float tiembla = u < 0.15 ? 0.02*sin(t*60.0)*sin(u/0.15*3.14159) : 0.0; vec2 q = (p - vec2(tiembla, -0.20*s))/vec2(1.0 + 0.22*s, 1.0 - 0.38*s);
    return (length(q) - 0.48)*min(1.0 + 0.22*s, 1.0 - 0.38*s); }
  if (e < 9.5){ vec2 q = rot(0.06*sin(t*0.9))*p; return rbox(q, vec2(0.32, 0.44), 0.10); }
  if (e < 10.5){ float x = 0.10*sin(t*0.8); vec2 q = p - vec2(x, 0.0);
    return max(length(q - vec2(0.0, -0.30)) - 0.58, length(q - vec2(0.0, 0.30)) - 0.58); }
  float b = onda(t, 2.6, 0.0, 0.3); vec2 q = p - vec2(0.0, 0.10*b);
  float ua = mod(t, 2.6)/2.6, aviso = length(p - vec2(0.40, 0.44)) - 0.13*smoothstep(0.0, 0.25, ua)*(1.0 - smoothstep(0.85, 1.0, ua));
  return min(length(q*vec2(1.0, 1.0 + 0.06*b)) - 0.44, aviso);
}


float cuerpo(vec2 p){
  float B = cuerpoE(p, floor(uEst + 0.5)); if (uMez >= 1.0) return B;
  float A = cuerpoE(p, floor(uDeA + 0.5)); if (uDeQ > 0.0) A = mix(A, cuerpoE(p, floor(uDeB + 0.5)), uDeQ);
  return mix(A, B, uMez);
}

float manos(vec2 p){
  float t = uT, e = floor(uEst + 0.5), s = 0.50;
  if (e < 0.5) return min(mano(p, vec2(0.62, -0.46), 2.6, s), manoI(p, vec2(0.62, -0.46), 2.6, s));
  if (e < 1.5) return mano(p, vec2(0.62, 0.30 + 0.015*sin(t*1.7)), 0.35, s);
  if (e < 2.5) return mano(p, vec2(0.22, -0.66 + 0.02*max(0.0, sin(t*3.2))), -0.25, s);
  if (e < 3.5) return mano(p, vec2(0.10, 0.62), -1.45, s);
  if (e < 4.5) return mano(p, vec2(0.74, -0.10 + 0.10*sin(t*2.1)), 0.30*sin(t*2.1), s);
  if (e < 5.5) return mano(p, vec2(0.70, 0.18 + 0.06*onda(t, 2.6, 0.0, 0.5)), 0.10, s);
  if (e < 6.5){ float b = abs(sin(mod(t, 1.8)/1.8*3.14159)); return min(mano(p, vec2(0.56, 0.62 + 0.06*b), -0.30, s), manoI(p, vec2(0.56, 0.62 + 0.06*b), -0.30, s)); }
  if (e < 7.5) return min(mano(p, vec2(0.60, -0.56), 2.8, s), manoI(p, vec2(0.60, -0.56), 2.8, s));
  if (e < 8.5){ float u = mod(t, 4.0)/4.0, h = smoothstep(0.15, 0.25, u)*(1.0 - smoothstep(0.75, 0.85, u)); return min(mano(p, vec2(0.74 + 0.04*h, -0.10), -1.2, s), manoI(p, vec2(0.74 + 0.04*h, -0.10), -1.2, s)); }
  if (e < 9.5) return min(mano(p, vec2(0.46, -0.12), -1.45, s), manoI(p, vec2(0.46, -0.12), -1.45, s));
  if (e < 10.5) return mano(p, vec2(0.08 + 0.10*sin(t*0.8), 0.44), -1.50, s);
  return mano(p, vec2(0.66, 0.40), 0.45*sin(t*8.0)*onda(t, 2.6, 0.0, 0.7), s);
}
float forma(vec2 p){ float d = cuerpo(p); return uTex > 2.5 ? min(d, manos(p)) : d; }
void main(){
  vec2 p = vP*1.15; float d = forma(p), e = 0.004;
  vec2 g = vec2(forma(p + vec2(e, 0.0)) - forma(p - vec2(e, 0.0)), forma(p + vec2(0.0, e)) - forma(p - vec2(0.0, e)))/(2.0*e);
  vec2 n = normalize(g + 1e-6);
  float px = uPx*1.15, adentro = 1.0 - smoothstep(-px, px, d);
  float h = sqrt(clamp(-d/0.30, 0.0, 1.0));
  vec3 nn = normalize(vec3(n*(1.0 - h)*1.3, 0.35 + h));
  float tono = clamp(1.0 - dot(nn, normalize(vec3(-0.5, 0.6, 0.7))), 0.0, 1.0);
  float a = 0.0;
  if (uTex < 0.5){

    float F = 44.0, y = p.y + 0.05*h, d1 = abs(fract(y*F) - 0.5)*2.0, gr = mix(0.10, 0.95, tono*tono), aa = px*F*1.5;
    a = (1.0 - smoothstep(gr - aa, gr + aa, d1))*adentro;
  } else if (uTex < 1.5){

    vec2 dir = vec2(cos(uT*0.3), sin(uT*0.3));
    float blando = pow(max(0.0, 0.5 + 0.5*dot(n, dir)), 1.5), ancho = mix(0.003, 0.22, blando);
    float cub = clamp((ancho - d)/(ancho + 0.004), 0.0, 1.0); cub = cub*cub*(3.0 - 2.0*cub);
    cub *= mix(0.78, 1.0, tono);
    a = cub > 0.002 ? step(h21(floor(gl_FragCoord.xy) + mod(floor(uT*12.0), 61.0)*vec2(17.0, 31.0)), cub) : 0.0;
  } else if (uTex < 2.5){

    float C = 30.0; vec2 cel = floor((p*0.5 + 0.5)*C), cen = (cel + 0.5)/C*2.0 - 1.0, loc = fract((p*0.5 + 0.5)*C);
    float den = 1.0 - smoothstep(-0.01, 0.02, forma(cen));
    float dig = floor(h21(cel + mod(floor(uT*2.5 + h21(cel)*3.0), 97.0)*vec2(17.0, 31.0))*10.0);
    float gly = texture2D(uDig, vec2((dig + loc.x)/10.0, loc.y)).r*step(0.06, loc.x)*step(loc.x, 0.94)*step(0.06, loc.y)*step(loc.y, 0.94);
    a = gly*den*mix(0.45, 1.0, tono);
  } else {

    a = adentro;
  }
  gl_FragColor = vec4(uTinta*a, a);
}`;function P(){const t=document.createElement("canvas");t.width=640,t.height=64;const n=t.getContext("2d");n.fillStyle="#000",n.fillRect(0,0,640,64),n.fillStyle="#fff",n.font="600 50px ui-monospace, Menlo, monospace",n.textAlign="center",n.textBaseline="middle";for(let i=0;i<10;i++)n.fillText(String(i),i*64+32,34);return t}let d=null,e=null,s=null,h=!1;function T(){const t=(c,m)=>{const l=e.createShader(c);if(e.shaderSource(l,m),e.compileShader(l),!e.getShaderParameter(l,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(l));return l},n=e.createProgram();if(e.attachShader(n,t(e.VERTEX_SHADER,w)),e.attachShader(n,t(e.FRAGMENT_SHADER,D)),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(n));e.useProgram(n);const i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const r=e.getAttribLocation(n,"aP");e.enableVertexAttribArray(r),e.vertexAttribPointer(r,2,e.FLOAT,!1,0,0);const a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,P()),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const o=c=>e.getUniformLocation(n,c);s={t:o("uT"),tex:o("uTex"),est:o("uEst"),px:o("uPx"),voz:o("uVoz"),tinta:o("uTinta"),deA:o("uDeA"),deB:o("uDeB"),deQ:o("uDeQ"),mez:o("uMez")},h=!0}let f=[];const g=1.1,x=matchMedia("(prefers-reduced-motion: reduce)"),_=performance.now();let p=x.matches,b=!1,q=null;function B(t){q=t}const S=t=>q??Math.max(0,Math.sin(t*7.3)*Math.sin(t*1.9+1)*.8+.2*Math.sin(t*13));function L(){if(!h)return;const t=p?2:(performance.now()-_)/1e3,i=document.documentElement.dataset.tema==="oscuro"?[.93,.94,.95]:[.082,.09,.102],r=Math.min(2,devicePixelRatio||1);e.uniform1f(s.t,t),e.uniform1f(s.voz,p?.4:S(t)),e.uniform3f(s.tinta,...i);for(const a of f){const o=a.cv.getBoundingClientRect();if(o.bottom<-50||o.top>innerHeight+50||!o.width)continue;const c=Math.round(o.width*r);a.cv.width!==c&&(a.cv.width=c,a.cv.height=c),d.width!==c&&(d.width=c,d.height=c),e.viewport(0,0,c,c),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.uniform1f(s.tex,a.tex),e.uniform1f(s.est,a.est),e.uniform1f(s.px,2/c),a.pend!=null&&a.t0&&(performance.now()-a.t0)/1e3>=g&&a.poner(a.pend);const m=a.t0&&!p?Math.min(1,(performance.now()-a.t0)/1e3/g):1,l=m*m*(3-2*m);e.uniform1f(s.mez,l),e.uniform1f(s.deA,a.de?a.de.a:a.est),e.uniform1f(s.deB,a.de?a.de.b:a.est),e.uniform1f(s.deQ,a.de&&a.de.q<1?a.de.q:0),e.drawArrays(e.TRIANGLE_STRIP,0,4),a.x.clearRect(0,0,c,c),a.x.drawImage(d,0,0)}}function z(){b=!1,L(),!p&&f.some(t=>{const n=t.cv.getBoundingClientRect();return t.cv.isConnected&&n.width&&n.bottom>-50&&n.top<innerHeight+50})&&u()}function u(){b||(b=!0,requestAnimationFrame(z))}x.addEventListener("change",()=>{p=x.matches,u()}),new MutationObserver(u).observe(document.documentElement,{attributes:!0,attributeFilter:["data-tema"]}),addEventListener("resize",u),addEventListener("scroll",u,{passive:!0});function M(t,{solo:n=null,desde:i=1,rotulos:r=null}={}){const a=y.map((o,c)=>[o,c]).filter(([,o])=>!n||n.includes(o));t.innerHTML=a.map(([o,c],m)=>`
<section class="sec">
  <div class="cab"><span class="n">${String(i+m).padStart(2,"0")}</span><h2>${o.n}.</h2><p>${o.d}</p></div>
  <div class="grilla g4">${R.map(([l,A],v)=>`<div class="celda"><div class="lienzo"><canvas data-tex="${c}" data-est="${v}" aria-hidden="true"></canvas></div><b>${r?r[v][0]:l}</b><span>${r?r[v][1]:A}</span></div>`).join("")}</div>
</section>`).join(""),E(),f=[...t.querySelectorAll("canvas[data-tex]")].map(o=>({cv:o,x:o.getContext("2d"),tex:+o.dataset.tex,est:+o.dataset.est})),u()}function E(){if(!e&&(d=document.createElement("canvas"),e=d.getContext("webgl",{premultipliedAlpha:!0,antialias:!1,preserveDrawingBuffer:!0}),e)){try{T()}catch(t){console.warn("El dibujo no compil\xF3:",t)}d.addEventListener("webglcontextlost",t=>{t.preventDefault(),h=!1}),d.addEventListener("webglcontextrestored",()=>{try{T(),u()}catch(t){console.warn(t)}})}}function I(t,n=2,i=0){E();const r={cv:t,x:t.getContext("2d"),tex:n,est:i,t0:0,de:{a:i,b:i,q:1},pend:null};return r.poner=a=>{const o=performance.now();if((r.t0&&!p?Math.min(1,(o-r.t0)/1e3/g):1)<1){r.pend=a;return}r.pend=null,a!==r.est&&(r.de={a:r.est,b:r.est,q:1},r.est=a,r.t0=o,u())},f=f.filter(a=>a.cv.isConnected),f.push(r),u(),{poner:r.poner,parar(){f=f.filter(a=>a!==r)}}}export{B as fijarVoz,M as montar,I as montarVivo};
