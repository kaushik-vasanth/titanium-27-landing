// Procedural orbital backdrop: starfield, nebula, and night-side Earth
// with procedural clouds, city lights, atmosphere and scroll dive.
import * as THREE from 'three';

const NOISE = /* glsl */`
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float f=0.,a=.5;for(int i=0;i<5;i++){f+=a*snoise(p);p*=2.03;a*=.5;}return f;}
`;

const earthVertex = /* glsl */`
varying vec3 vObj; varying vec3 vNormalW; varying vec3 vViewDir;
void main(){
  vObj = normalize(position);
  vec4 world = modelMatrix * vec4(position,1.);
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}`;

const earthFragment = /* glsl */`
uniform float uTime; uniform vec3 uSun;
varying vec3 vObj; varying vec3 vNormalW; varying vec3 vViewDir;
${NOISE}
void main(){
  vec3 p = vObj;
  float continents = fbm(p*1.55) + .35*fbm(p*4.7+3.1);
  float land = smoothstep(.04,.11,continents);
  float coast = smoothstep(.0,.07,continents)*(1.-land);
  float ndl = dot(vNormalW, uSun);
  float day = smoothstep(-.18,.32,ndl);

  vec3 ocean = mix(vec3(.004,.02,.055), vec3(.012,.06,.14), .5+.5*fbm(p*3.));
  vec3 ground = mix(vec3(.13,.10,.07), vec3(.05,.09,.05), .5+.5*fbm(p*6.2));
  vec3 surface = mix(ocean, ground, land) + coast*vec3(.02,.07,.1);

  vec3 cp = p*2.4 + vec3(uTime*.006, 0., uTime*.003);
  float clouds = smoothstep(.02,.55, fbm(cp) + .45*fbm(cp*3.3));
  vec3 lit = surface * (.025 + 1.05*day);
  lit = mix(lit, vec3(.62,.70,.82)*(.018+day*.95), clouds*.8);

  // Ocean glint
  vec3 h = normalize(uSun + vViewDir);
  lit += (1.-land)*(1.-clouds)*pow(max(dot(vNormalW,h),0.),70.)*vec3(.55,.62,.7)*day;

  // Night-side city lights
  float city = pow(.5+.5*snoise(p*90.),8.) * 4. + pow(.5+.5*snoise(p*260.),12.) * 6.;
  float cluster = smoothstep(-.1,.35, fbm(p*7.+11.));
  vec3 lights = vec3(1.,.48,.16) * city * cluster * land * (1.-day) * (1.-clouds*.75);
  lights += vec3(.9,.38,.12) * clouds * cluster * land * (1.-day) * .05;

  float fres = pow(1.-max(dot(vNormalW,vViewDir),0.), 3.2);
  vec3 atmo = mix(vec3(.05,.16,.45), vec3(.35,.7,1.), day) * fres * (.25 + .9*smoothstep(-.5,.4,ndl));
  gl_FragColor = vec4(lit + lights + atmo, 1.);
}`;

const atmoFragment = /* glsl */`
uniform vec3 uSun; uniform float uLimb; varying vec3 vNormalW; varying vec3 vViewDir; varying vec3 vObj;
void main(){
  float d = dot(vNormalW, vViewDir);
  float glow = pow(clamp(-d / uLimb, 0., 1.), 1.8);
  float lit = smoothstep(-.6,.5, dot(vNormalW,uSun));
  vec3 col = mix(vec3(.04,.16,.5), vec3(.35,.75,1.), lit);
  gl_FragColor = vec4(col * glow * (.35 + 1.4*lit), glow);
}`;

const skyFragment = /* glsl */`
varying vec3 vObj; uniform float uTime;
${NOISE}
void main(){
  vec3 d = normalize(vObj);
  float n = fbm(d*2.2 + vec3(0.,0.,uTime*.002));
  float m = fbm(d*4.5 + 7.);
  vec3 col = vec3(.003,.006,.016);
  col += vec3(.04,.09,.2) * smoothstep(.0,.7,n) * .55;
  col += vec3(.16,.05,.18) * smoothstep(.25,.85,m) * .22;
  col += vec3(.0,.15,.2) * smoothstep(.45,.9,n*m+.4) * .12;
  gl_FragColor = vec4(col,1.);
}`;

const starVertex = /* glsl */`
attribute float aSize; attribute float aSeed; uniform float uTime; uniform float uPixel;
varying float vAlpha; varying vec3 vColor; attribute vec3 aColor;
void main(){
  vec4 mv = modelViewMatrix * vec4(position,1.);
  float tw = .65 + .35*sin(uTime*(1.2+aSeed*2.5) + aSeed*40.);
  vAlpha = tw; vColor = aColor;
  gl_PointSize = aSize * uPixel;
  gl_Position = projectionMatrix * mv;
}`;

const starFragment = /* glsl */`
varying float vAlpha; varying vec3 vColor;
void main(){
  vec2 c = gl_PointCoord - .5; float d = length(c);
  float a = smoothstep(.5,.0,d); a = a*a;
  gl_FragColor = vec4(vColor, a*vAlpha);
}`;

export function createSpace(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  const pixel = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(pixel);
  renderer.setClearColor(0x01030a, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 600);
  const sun = new THREE.Vector3(-0.85, 0.18, -0.95).normalize();

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(400, 48, 32),
    new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: earthVertex, fragmentShader: skyFragment, side: THREE.BackSide, depthWrite: false }),
  );
  scene.add(sky);

  // Stars
  const starCount = 5200;
  const pos = new Float32Array(starCount * 3), size = new Float32Array(starCount), seed = new Float32Array(starCount), color = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 150 + Math.random() * 200;
    const s = Math.sqrt(1 - u * u);
    pos.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
    const big = Math.random() < .04;
    size[i] = big ? 3 + Math.random() * 3 : 0.8 + Math.random() * 1.8;
    seed[i] = Math.random();
    const tint = Math.random();
    color.set(tint < .15 ? [1, .78, .6] : tint < .4 ? [.7, .85, 1] : [1, 1, 1], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
  starGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  starGeo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
  const starMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixel: { value: pixel } },
    vertexShader: starVertex, fragmentShader: starFragment,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  // Earth
  const R = 10;
  const earth = new THREE.Group();
  earth.position.set(0, -10.85, -7.5);
  earth.rotation.set(0.35, 0.6, 0.12);
  scene.add(earth);
  const earthUniforms = { uTime: { value: 0 }, uSun: { value: sun } };
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(R, 160, 120),
    new THREE.ShaderMaterial({ uniforms: earthUniforms, vertexShader: earthVertex, fragmentShader: earthFragment }),
  );
  earth.add(planet);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.045, 96, 64),
    new THREE.ShaderMaterial({ uniforms: { uSun: { value: sun }, uLimb: { value: Math.sqrt(1 - 1 / (1.045 * 1.045)) } }, vertexShader: earthVertex, fragmentShader: atmoFragment, side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  scene.add(atmosphere);
  atmosphere.position.copy(earth.position);

  // Camera & parallax movement
  const cameraPos = new THREE.Vector3(0, 0, 0);
  const cameraLook = new THREE.Vector3(0, -0.24, -1);
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  let scrollRatio = 0;
  let scrollTarget = 0;

  const onMove = e => {
    pointer.x = e.clientX / innerWidth - .5;
    pointer.y = e.clientY / innerHeight - .5;
  };
  addEventListener('pointermove', onMove, { passive: true });

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.userData.portrait = w / h < 1 ? (1 - w / h) * 22 : 0;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  let last = performance.now(), time = 0, raf = 0, running = true;
  const look = new THREE.Vector3();

  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (!running || document.hidden) { last = t; return; }
    const dt = Math.min(.05, (t - last) / 1000); last = t; time += dt;

    scrollRatio += (scrollTarget - scrollRatio) * 0.08;

    pointer.sx += (pointer.x - pointer.sx) * .04;
    pointer.sy += (pointer.y - pointer.sy) * .04;

    camera.position.copy(cameraPos);
    camera.position.x += pointer.sx * .35;
    camera.position.y -= pointer.sy * .18;
    camera.position.y += scrollRatio * 3.4; // smooth descent dive

    look.copy(cameraLook);
    look.x += pointer.sx * .12;
    look.y -= scrollRatio * 4.8; // tilts horizon downward smoothly
    camera.lookAt(look);

    camera.fov = 48 + (camera.userData.portrait || 0);
    camera.updateProjectionMatrix();

    earthUniforms.uTime.value = time;
    starMat.uniforms.uTime.value = time;
    sky.material.uniforms.uTime.value = time;
    planet.rotation.y += dt * .006;

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  return {
    setScrollProgress(ratio) {
      scrollTarget = Math.max(0, Math.min(1, Number(ratio) || 0));
    },
    pause(v) { running = !v; },
    dispose() {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
      renderer.dispose();
    },
  };
}
