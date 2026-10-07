import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ============================================================
//  순천시 미니어처 도시 플라이오버 — 30초, 1920x1080
//  모든 움직임은 시간 t(초)만으로 결정되므로 같은 t는 늘 같은 화면,
//  t=30은 t=0과 같은 화면(이어 붙이면 끊김 없는 한 바퀴)입니다.
// ============================================================

const W = 1920;
const H = 1080;
const DURATION = 30;
const TAU = Math.PI * 2;

const SKY = 0xcfe7f3;
const PASTELS = [0xf6ead2, 0xf8c9a8, 0xa9d4ef, 0xcdbbea, 0xb6e6cf]; // 크림·복숭아·하늘·연보라·민트
const ROOFS = [0xe8957c, 0x8fa6c0, 0xd9a35e, 0x9b8cc4, 0x6fb79a];

// ---------- 유틸 ----------
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20261007);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, k) => a + (b - a) * k;
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x) => x * x * x;
const easeInOutSine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
function easeOutBack(x) {
  const c1 = 1.9, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// ---------- 렌더러 ----------
const stage = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.prepend(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 230, 620);

const camera = new THREE.PerspectiveCamera(34, W / H, 1, 1500);

// ---------- 빛 ----------
scene.add(new THREE.HemisphereLight(0xf2fbff, 0x9cc48a, 1.55));
const sun = new THREE.DirectionalLight(0xfff4e6, 2.1);
sun.position.set(-90, 160, 110);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
Object.assign(sun.shadow.camera, { left: -150, right: 150, top: 150, bottom: -150, near: 20, far: 500 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.6;
scene.add(sun);

// 마지막에 도시 위를 훑는 따뜻한 햇빛
const sweep = new THREE.SpotLight(0xffb866, 0, 0, 0.32, 1, 0);
sweep.position.set(0, 260, 40);
scene.add(sweep, sweep.target);

// ---------- 정적 지오메트리 병합 도우미 ----------
const parts = [];
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
function add(geo, color, x, y, z, ry = 0, rx = 0, rz = 0) {
  _e.set(rx, ry, rz);
  _q.setFromEuler(_e);
  _m.compose(new THREE.Vector3(x, y, z), _q, new THREE.Vector3(1, 1, 1));
  const c = geo.clone().applyMatrix4(_m);
  const col = new THREE.Color(color);
  const n = c.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) col.toArray(arr, i * 3);
  c.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  if (c.index) parts.push(c.toNonIndexed());
  else parts.push(c);
}
const box = (w, h, d, color, x, y, z, ry = 0) => add(new THREE.BoxGeometry(w, h, d), color, x, y + h / 2, z, ry);
const slab = (w, d, color, x, z, y = 0, h = 0.2) => add(new THREE.BoxGeometry(w, h, d), color, x, y + h / 2, z);

// ============================================================
//  땅·들판
// ============================================================
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(1600, 1600),
  new THREE.MeshLambertMaterial({ color: 0xa6d495 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// 들판 무늬(밭 조각)
const FIELD_GREENS = [0x9acb88, 0xb3dc9f, 0x8fc27e, 0xc2e2a8, 0xa9d68f];
for (let i = 0; i < 70; i++) {
  const x = (rand() - 0.5) * 520;
  const z = (rand() - 0.5) * 420;
  if (Math.abs(x) < 90 && z > -62 && z < 60) continue; // 도시 안은 건너뜀
  if (z > -92 && z < -60) continue; // 강
  const w = 20 + rand() * 40, d = 14 + rand() * 30;
  slab(w, d, pick(FIELD_GREENS), x, z, 0, 0.12);
}

// ============================================================
//  도시 격자: 길과 블록
// ============================================================
const XS = [-75, -45, -15, 15, 45, 75]; // 남북 방향 길의 x
const ZS = [-51, -17, 17, 51]; // 동서 방향 길의 z
const ROAD = 5;
const ROAD_C = 0xb9c0c4;
const WALK_C = 0xeee8da;
const LAWN_C = 0xb9e0a4;

slab(150 + ROAD + 14, 102 + ROAD + 14, WALK_C, 0, 0, 0, 0.16); // 도시 바닥판
for (const x of XS) slab(ROAD, 102 + ROAD, ROAD_C, x, 0, 0, 0.24);
for (const z of ZS) slab(150 + ROAD, ROAD, ROAD_C, 0, z, 0, 0.24);
// 차선 점선
for (const z of ZS) for (let x = -72; x < 72; x += 6) slab(2.6, 0.35, 0xffffff, x + 1.5, z, 0.24, 0.04);
for (const x of XS) for (let z = -48; z < 48; z += 6) slab(0.35, 2.6, 0xffffff, x, z + 1.5, 0.24, 0.04);

// 명소 위치(블록 중심)
const LANDMARKS = [
  { name: '순천오천그린광장', color: '#2F7BFF', pos: new THREE.Vector3(-30, 0, 34), top: 25 },
  { name: '순천만국가정원', color: '#8B5CF6', pos: new THREE.Vector3(0, 0, 0), top: 23 },
  { name: '순천만습지', color: '#FF8A1F', pos: new THREE.Vector3(30, 0, -34), top: 28 },
];
const isLandmarkBlock = (cx, cz) => LANDMARKS.some((l) => l.pos.x === cx && l.pos.z === cz);

// 나무 목록(나중에 인스턴스로 한꺼번에)
const trees = [];
const addTree = (x, z, s = 1, kind = rand() < 0.65 ? 'round' : 'pine') => trees.push({ x, z, s, kind });

for (let i = 0; i < XS.length - 1; i++) {
  for (let j = 0; j < ZS.length - 1; j++) {
    const cx = (XS[i] + XS[i + 1]) / 2;
    const cz = (ZS[j] + ZS[j + 1]) / 2;
    const bw = XS[i + 1] - XS[i] - ROAD - 2;
    const bd = ZS[j + 1] - ZS[j] - ROAD - 2;
    if (isLandmarkBlock(cx, cz)) {
      slab(bw, bd, LAWN_C, cx, cz, 0.16, 0.2);
      continue;
    }
    slab(bw, bd, 0xf3eee3, cx, cz, 0.16, 0.25);

    // 블록을 필지로 나눠 건물 세우기
    const nx = 2 + Math.floor(rand() * 2);
    const nz = 2 + Math.floor(rand() * 2);
    const lw = (bw - 3) / nx, ld = (bd - 3) / nz;
    const centerBoost = 1 - Math.min(1, Math.hypot(cx, cz) / 90);
    for (let a = 0; a < nx; a++) {
      for (let b = 0; b < nz; b++) {
        const x = cx - bw / 2 + 1.5 + lw * (a + 0.5);
        const z = cz - bd / 2 + 1.5 + ld * (b + 0.5);
        if (rand() < 0.14) {
          // 작은 공원
          slab(lw - 1.6, ld - 1.6, LAWN_C, x, z, 0.41, 0.15);
          addTree(x - lw * 0.2, z, 0.9);
          addTree(x + lw * 0.2, z + ld * 0.15, 0.8);
          continue;
        }
        const w = lw * (0.62 + rand() * 0.22);
        const d = ld * (0.62 + rand() * 0.22);
        const h = 3.5 + rand() * 6 + centerBoost * rand() * 7;
        const col = pick(PASTELS);
        const y0 = 0.41;
        box(w, h, d, col, x, y0, z);
        // 창문 띠
        const darker = new THREE.Color(col).multiplyScalar(0.86).getHex();
        for (let f = 1.6; f < h - 0.8; f += 2.1) box(w + 0.08, 0.45, d + 0.08, darker, x, y0 + f, z);
        if (rand() < 0.42 && h < 9) {
          // 박공 지붕
          const roof = new THREE.CylinderGeometry(d * 0.62, d * 0.62, w + 0.3, 3, 1);
          add(roof, pick(ROOFS), x, y0 + h + d * 0.3, z, 0, 0, Math.PI / 2);
        } else {
          box(w * 0.4, 1.2, d * 0.4, 0xffffff, x + w * 0.15, y0 + h, z - d * 0.1);
        }
      }
    }
    // 블록 가장자리 가로수
    for (let k = -1; k <= 1; k += 2) {
      for (let t = -0.4; t <= 0.41; t += 0.4) {
        addTree(cx + t * bw, cz + k * (bd / 2 + 0.6), 0.55, 'round');
      }
    }
  }
}

// ============================================================
//  뒤쪽 강·다리·언덕 (뒷겹)
// ============================================================
const RIVER_Z = -78;
slab(1600, 26, 0xe9dfc4, 0, RIVER_Z, 0, 0.1); // 강변 모래
const river = new THREE.Mesh(
  new THREE.BoxGeometry(1600, 0.3, 18),
  new THREE.MeshLambertMaterial({ color: 0x7cc2e4 })
);
river.position.set(0, 0.15, RIVER_Z);
river.receiveShadow = true;
scene.add(river);

for (const bx of [-15, 45]) {
  slab(ROAD, 30, ROAD_C, bx, -62, 0, 0.24); // 도시에서 다리로 가는 길
  box(7, 0.9, 30, 0xf1ece2, bx, 1.6, RIVER_Z); // 상판
  for (const s of [-1, 1]) {
    // 붉은 아치
    const arch = new THREE.TorusGeometry(10, 0.45, 8, 32, Math.PI);
    add(arch, 0xe2685a, bx + s * 3.2, 2.4, RIVER_Z, Math.PI / 2);
    for (let k = -8; k <= 8; k += 4) {
      const hh = Math.sqrt(Math.max(0, 100 - k * k));
      box(0.18, hh, 0.18, 0xffffff, bx + s * 3.2, 2.4, RIVER_Z + k);
    }
  }
  for (const k of [-6, 6]) box(2.2, 1.8, 2.2, 0xd8d0c0, bx, 0, RIVER_Z + k); // 교각
}
// 강 건너 언덕
for (let i = 0; i < 14; i++) {
  const x = -260 + i * 40 + rand() * 18;
  const r = 22 + rand() * 20;
  const hill = new THREE.SphereGeometry(r, 18, 10, 0, TAU, 0, Math.PI / 2);
  hill.scale(1.3, 0.38 + rand() * 0.2, 0.8);
  add(hill, pick([0x93c584, 0x86bb78, 0xa1cf8f]), x, 0, -128 - rand() * 30);
}
for (let i = 0; i < 70; i++) addTree(-200 + rand() * 400, -96 - rand() * 18, 0.9 + rand() * 0.5);

// ============================================================
//  앞쪽 철길 (앞겹)
// ============================================================
const RAIL_Z = 70;
slab(1600, 7, 0xcfc4b2, 0, RAIL_Z, 0, 0.35); // 자갈
for (let x = -400; x <= 400; x += 2.2) box(0.7, 0.25, 5, 0x8a6a52, x, 0.35, RAIL_Z);
for (const s of [-1.5, 1.5]) box(800, 0.35, 0.35, 0x8d959c, 0, 0.6, RAIL_Z + s);
// 철길과 도시 사이 나무 띠
for (let i = 0; i < 60; i++) addTree(-170 + rand() * 340, 60 + rand() * 4, 0.8 + rand() * 0.5);
for (let i = 0; i < 70; i++) addTree(-220 + rand() * 440, 80 + rand() * 60, 0.9 + rand() * 0.6);
// 도시 양옆 숲
for (let i = 0; i < 80; i++) {
  const side = rand() < 0.5 ? -1 : 1;
  addTree(side * (88 + rand() * 80), -60 + rand() * 120, 0.9 + rand() * 0.6);
}

// ============================================================
//  명소 1: 순천오천그린광장 — 둥근 잔디 광장 + 흰 고리 지붕 + 파란 첨탑
// ============================================================
{
  const { x, z } = LANDMARKS[0].pos;
  add(new THREE.CylinderGeometry(13, 13.6, 0.8, 48), 0x8fd27a, x, 0.75, z);
  add(new THREE.CylinderGeometry(5, 5, 0.3, 40), 0x8fd0f2, x, 1.3, z); // 분수 연못
  add(new THREE.CylinderGeometry(0.6, 0.9, 3.2, 12), 0xffffff, x, 2.6, z);
  const ring = new THREE.TorusGeometry(10, 1.1, 12, 64);
  ring.scale(1, 1, 0.5);
  add(ring, 0xffffff, x, 11, z, 0, Math.PI / 2);
  for (let k = 0; k < 10; k++) {
    const a = (k / 10) * TAU;
    add(new THREE.CylinderGeometry(0.35, 0.35, 10, 8), 0xf4f4f4, x + Math.cos(a) * 10, 6, z + Math.sin(a) * 10);
  }
  add(new THREE.CylinderGeometry(1.2, 2, 14, 16), 0x2f7bff, x, 8, z);
  add(new THREE.ConeGeometry(1.9, 6, 16), 0xffffff, x, 18, z);
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU + 0.2;
    addTree(x + Math.cos(a) * 15.5, z + Math.sin(a) * 15.5, 0.75, 'round');
  }
}

// ============================================================
//  명소 2: 순천만국가정원 — 계단식 둥근 정원 언덕 + 보라 돔 정자
// ============================================================
const flowers = [];
{
  const { x, z } = LANDMARKS[1].pos;
  add(new THREE.CylinderGeometry(14.5, 14.5, 0.4, 56), 0x84c9e6, x, 0.6, z); // 둘레 연못
  const tiers = [[13, 2.2], [10, 2.2], [7, 2.2], [4.2, 2.2]];
  let y = 0.8;
  tiers.forEach(([r, h], i) => {
    add(new THREE.CylinderGeometry(r, r + 0.4, h, 48), i % 2 ? 0x7fc46c : 0x95d27f, x, y + h / 2, z);
    y += h;
    const n = Math.round(r * 4.2);
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU;
      flowers.push({ x: x + Math.cos(a) * (r - 0.7), y, z: z + Math.sin(a) * (r - 0.7), c: [0xb689ff, 0xff8fc2, 0xffd25a][k % 3] });
    }
  });
  add(new THREE.CylinderGeometry(2.8, 2.8, 3.2, 24), 0xffffff, x, y + 1.6, z);
  add(new THREE.SphereGeometry(3.4, 32, 16, 0, TAU, 0, Math.PI / 2), 0x8b5cf6, x, y + 3.2, z);
  add(new THREE.ConeGeometry(0.5, 2.6, 12), 0xffd25a, x, y + 7.6, z);
}

// ============================================================
//  명소 3: 순천만습지 — 갈대밭 + 나무 데크길 + 주황 지붕 전망대
// ============================================================
const reeds = [];
{
  const { x, z } = LANDMARKS[2].pos;
  add(new THREE.CylinderGeometry(13.5, 13.5, 0.35, 48), 0x86c3c0, x, 0.55, z); // 갯벌 물
  for (let k = 0; k < 260; k++) {
    const a = rand() * TAU, r = Math.sqrt(rand()) * 12.5;
    const rx = x + Math.cos(a) * r, rz = z + Math.sin(a) * r;
    if (Math.abs(rz - z - (rx - x) * 0.35) < 1.6) continue; // 데크길 자리
    reeds.push({ x: rx, z: rz, h: 1.6 + rand() * 1.6 });
  }
  // 데크길(대각선)
  for (let k = -12; k <= 12; k += 1.2) box(1.1, 0.25, 2.4, 0xb98b5e, x + k, 1.0, z + k * 0.35, -Math.atan(0.35));
  // 전망대
  const tx = x + 4, tz = z - 2;
  for (const [dx, dz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) {
    add(new THREE.CylinderGeometry(0.3, 0.45, 17, 8), 0x8a6a52, tx + dx * 0.8, 9, tz + dz * 0.8);
  }
  for (const hy of [5, 10, 15]) box(4.4, 0.35, 4.4, 0x9c7a5e, tx, hy, tz);
  box(5.6, 2.4, 5.6, 0xfff3e2, tx, 17, tz);
  add(new THREE.ConeGeometry(5.2, 4, 8), 0xff8a1f, tx, 21.4, tz, Math.PI / 8);
}

// ---------- 병합 메시 ----------
const city = new THREE.Mesh(
  mergeGeometries(parts),
  new THREE.MeshLambertMaterial({ vertexColors: true })
);
city.castShadow = true;
city.receiveShadow = true;
scene.add(city);

// ---------- 인스턴스: 나무 ----------
const TREE_GREENS = [0x5fae5a, 0x6dbb63, 0x4f9e55, 0x7cc46a, 0x5aa86f];
function instanced(geo, mat, list, setup) {
  const mesh = new THREE.InstancedMesh(geo, mat, list.length);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
  list.forEach((it, i) => {
    const c = setup(it, p, s);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
    if (c !== undefined) mesh.setColorAt(i, new THREE.Color(c));
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}
const roundT = trees.filter((t) => t.kind === 'round');
const pineT = trees.filter((t) => t.kind === 'pine');
const lam = (c) => new THREE.MeshLambertMaterial({ color: c });
instanced(new THREE.CylinderGeometry(0.25, 0.35, 1.6, 6), lam(0x8a6a52), trees, (t, p, s) => {
  p.set(t.x, 0.8 * t.s + 0.3, t.z);
  s.setScalar(t.s * 1.4);
});
instanced(new THREE.IcosahedronGeometry(1.7, 1), lam(0xffffff), roundT, (t, p, s) => {
  p.set(t.x, 3.4 * t.s + 0.3, t.z);
  s.setScalar(t.s * 1.3);
  return pick(TREE_GREENS);
});
instanced(new THREE.ConeGeometry(1.6, 4.4, 7), lam(0xffffff), pineT, (t, p, s) => {
  p.set(t.x, 4.2 * t.s + 0.3, t.z);
  s.setScalar(t.s * 1.3);
  return pick([0x3f8f57, 0x4b9a5e, 0x5aa86a]);
});
instanced(new THREE.SphereGeometry(0.42, 8, 6), lam(0xffffff), flowers, (f, p, s) => {
  p.set(f.x, f.y + 0.3, f.z);
  s.setScalar(1);
  return f.c;
});
instanced(new THREE.ConeGeometry(0.22, 1, 5), lam(0xd8b95e), reeds, (r, p, s) => {
  p.set(r.x, 0.7 + r.h / 2, r.z);
  s.set(1, r.h, 1);
  return pick([0xd8b95e, 0xc9a94e, 0xe3c77a]);
});

// ---------- 움직이는 것: 기차·자동차·구름 ----------
const train = new THREE.Group();
for (let k = 0; k < 5; k++) {
  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(9, 3.2, 3.4), lam(0xfafafa));
  body.position.y = 2.4;
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(9.05, 0.6, 3.45), lam(0x2f7bff));
  stripe.position.y = 2.1;
  const roof = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.5, 3), lam(0xd7dde2));
  roof.position.y = 4.2;
  car.add(body, stripe, roof);
  car.position.x = -k * 9.8;
  car.traverse((o) => (o.castShadow = true));
  train.add(car);
}
train.position.set(0, 0.4, RAIL_Z);
scene.add(train);

const CAR_COLORS = [0xff7a6b, 0xffc94d, 0x5aa9ff, 0xffffff, 0x8be0b8, 0xb79cff];
const cars = [];
const roadLanes = [
  ...ZS.map((z) => ({ axis: 'x', fixed: z, len: 150 })),
  ...XS.map((x) => ({ axis: 'z', fixed: x, len: 102 })),
];
roadLanes.forEach((lane, li) => {
  for (let k = 0; k < 2; k++) {
    const dir = (li + k) % 2 ? 1 : -1;
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 1.4), lam(pick(CAR_COLORS)));
    b.position.y = 0.85;
    const t = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 1.2), lam(0xeef6fb));
    t.position.y = 1.65;
    g.add(b, t);
    g.traverse((o) => (o.castShadow = true));
    if (lane.axis === 'z') g.rotation.y = Math.PI / 2;
    scene.add(g);
    cars.push({ g, lane, dir, off: rand(), laps: 1 + Math.floor(rand() * 2), side: dir * 1.2 });
  }
});

const clouds = [];
const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
for (let i = 0; i < 9; i++) {
  const c = new THREE.Group();
  for (let k = 0; k < 4; k++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(5 + rand() * 4, 14, 10), cloudMat);
    s.position.set(k * 6 - 9, rand() * 2, rand() * 4);
    s.scale.y = 0.6;
    c.add(s);
  }
  // 카메라 앞을 가리지 않게 뒤쪽·양옆에만 둔다
  const angle = Math.PI * (1.05 + (i / 8) * 0.9) + (rand() - 0.5) * 0.15;
  const r = 190 + rand() * 80;
  c.position.set(Math.cos(angle) * r, 40 + rand() * 22, Math.sin(angle) * r * 0.7 - 30);
  c.userData = { base: c.position.clone(), phase: rand() * TAU };
  scene.add(c);
  clouds.push(c);
}

// ============================================================
//  카메라 경로 — 시간 키프레임 + 닫힌 Catmull-Rom (t=0 ≡ t=30)
// ============================================================
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const CAM_KEYS = [
  { t: 0.0, p: V(0, 118, 168), l: V(0, 0, 2) },
  { t: 1.5, p: V(-10, 114, 164), l: V(-3, 0, 3) },
  { t: 5.2, p: V(-66, 56, 110), l: V(-30, 6, 30) },
  { t: 8.0, p: V(-82, 29, 64), l: V(-30, 12, 32) }, // 첫째 명소 곁
  { t: 11.4, p: V(-58, 23, 14), l: V(-6, 7, 0) },
  { t: 14.4, p: V(-28, 21, -32), l: V(0, 9, 0) }, // 둘째 명소 곁
  { t: 17.8, p: V(14, 24, -4), l: V(30, 12, -34) },
  { t: 20.8, p: V(62, 27, 0), l: V(32, 14, -36) }, // 셋째 명소 곁
  { t: 24.0, p: V(86, 44, 26), l: V(14, 4, -12) }, // 다시 솟기 시작
  { t: 27.4, p: V(26, 108, 160), l: V(1, 0, 1) }, // 처음 높이로
];

function sampleKeys(keys, t, prop) {
  const n = keys.length;
  const tt = ((t % DURATION) + DURATION) % DURATION;
  let i = n - 1;
  for (let k = 0; k < n; k++) if (keys[k].t <= tt) i = k;
  const k0 = keys[(i - 1 + n) % n], k1 = keys[i], k2 = keys[(i + 1) % n], k3 = keys[(i + 2) % n];
  const T = (a, b) => ((b.t - a.t + DURATION) % DURATION) || DURATION;
  const d01 = T(k0, k1), d12 = T(k1, k2), d23 = T(k2, k3);
  const u = ((tt - k1.t + DURATION) % DURATION) / d12;
  // 시간 간격을 고려한 접선(비균일 Catmull-Rom)
  const m1 = k2[prop].clone().sub(k0[prop]).multiplyScalar(d12 / (d01 + d12));
  const m2 = k3[prop].clone().sub(k1[prop]).multiplyScalar(d12 / (d12 + d23));
  const u2 = u * u, u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
  return k1[prop].clone().multiplyScalar(h00)
    .add(m1.multiplyScalar(h10))
    .add(k2[prop].clone().multiplyScalar(h01))
    .add(m2.multiplyScalar(h11));
}

// ============================================================
//  이름표
// ============================================================
const TAG_TIMES = [
  { in: 2.7, out: 11.2 },
  { in: 8.9, out: 19.1 }, // 첫째와 잠깐 엇갈림
  { in: 15.8, out: 26.8 }, // 둘째와 잠깐 엇갈림
];
const POP = 0.6, EXIT = 0.5, MARGIN = 48;
const tags = LANDMARKS.map((lm) => {
  const el = document.createElement('div');
  el.className = 'tag';
  el.innerHTML = `<div class="pill"><span class="dot"></span><span class="txt"></span></div><div class="tail"></div>`;
  el.querySelector('.dot').style.background = lm.color;
  el.querySelector('.txt').textContent = lm.name;
  stage.appendChild(el);
  return {
    el,
    pill: el.querySelector('.pill'),
    dot: el.querySelector('.dot'),
    txt: el.querySelector('.txt'),
    tail: el.querySelector('.tail'),
    anchor: lm.pos.clone().setY(lm.top),
  };
});

const _v = new THREE.Vector3();
function updateTags(t) {
  tags.forEach((tag, i) => {
    const { in: tIn, out: tOut } = TAG_TIMES[i];
    const uIn = clamp01((t - tIn) / POP);
    const uOut = clamp01((t - tOut) / EXIT);
    if (t < tIn || uOut >= 1) {
      tag.el.style.opacity = 0;
      return;
    }
    _v.copy(tag.anchor).project(camera);
    if (_v.z > 1) {
      tag.el.style.opacity = 0;
      return;
    }
    const sx = (_v.x * 0.5 + 0.5) * W;
    const sy = (-_v.y * 0.5 + 0.5) * H;
    const w = tag.el.offsetWidth, h = tag.el.offsetHeight;
    // 화면 밖으로 잘리지 않게 가두기
    const x = Math.min(W - MARGIN - w / 2, Math.max(MARGIN + w / 2, sx));
    const y = Math.min(H - MARGIN, Math.max(MARGIN + h, sy - 10));
    const float = Math.sin(t * 2.1 + i) * 4;

    // 들어올 때: 알약은 반동 있게 톡, 점·글자는 조금씩 늦게
    const sPill = uIn < 1 ? easeOutBack(uIn) : 1;
    const sOut = 1 - 0.35 * easeInCubic(uOut);
    const dotU = clamp01((t - tIn - 0.12) / 0.45);
    const txtU = clamp01((t - tIn - 0.22) / 0.5);

    tag.el.style.opacity = clamp01(uIn * 3) * (1 - easeOutCubic(uOut));
    tag.el.style.transform = `translate(${x - w / 2}px, ${y - h + float}px)`;
    tag.pill.style.transform = `scale(${Math.max(0.001, sPill * sOut)})`;
    tag.tail.style.transform = `scaleY(${clamp01(uIn * 1.5) * sOut})`;
    tag.dot.style.transform = `scale(${dotU < 1 ? easeOutBack(dotU) : 1})`;
    tag.txt.style.opacity = easeOutCubic(txtU);
    tag.txt.style.transform = `translateX(${(1 - easeOutCubic(txtU)) * 14}px)`;
  });
}

// ============================================================
//  한 프레임 그리기
// ============================================================
const titleEl = document.getElementById('title');
const sunband = document.getElementById('sunband');
const SWEEP_START = 27.5, SWEEP_END = 29.7;

function renderAt(tRaw) {
  const t = ((tRaw % DURATION) + DURATION) % DURATION;

  // 카메라
  camera.position.copy(sampleKeys(CAM_KEYS, t, 'p'));
  // 숨 쉬듯 아주 작은 흔들림(30초 주기로 맞춤)
  camera.position.y += Math.sin((t / DURATION) * TAU * 3) * 0.6;
  camera.lookAt(sampleKeys(CAM_KEYS, t, 'l'));
  camera.updateMatrixWorld();

  // 기차: 30초에 한 번 지나감(처음·끝은 화면 밖)
  train.position.x = lerp(-300, 330, t / DURATION);

  // 자동차: 30초에 정수 바퀴 → 끊김 없음
  for (const c of cars) {
    const k = (((c.off + c.dir * c.laps * (t / DURATION)) % 1) + 1) % 1;
    const s = (k - 0.5) * c.lane.len;
    if (c.lane.axis === 'x') c.g.position.set(s, 0.25, c.lane.fixed + c.side);
    else c.g.position.set(c.lane.fixed + c.side, 0.25, s);
    c.g.rotation.y = (c.lane.axis === 'x' ? 0 : Math.PI / 2) + (c.dir < 0 ? Math.PI : 0);
    const edge = Math.min(k, 1 - k);
    c.g.scale.setScalar(clamp01(edge * 30)); // 길 끝에서 살짝 사라졌다 나타남
  }

  // 구름: 천천히 일렁임
  for (const c of clouds) {
    const { base, phase } = c.userData;
    c.position.x = base.x + Math.sin((t / DURATION) * TAU + phase) * 6;
    c.position.y = base.y + Math.sin((t / DURATION) * TAU * 2 + phase) * 0.8;
  }

  // 따뜻한 햇빛 쓸고 지나가기
  const su = clamp01((t - SWEEP_START) / (SWEEP_END - SWEEP_START));
  const bell = Math.sin(Math.PI * su);
  sweep.intensity = 2.4 * bell * bell;
  sweep.target.position.set(lerp(-130, 130, easeInOutSine(su)), 0, lerp(30, -30, su));
  sweep.target.updateMatrixWorld();
  sunband.style.opacity = (0.9 * bell).toFixed(3);
  sunband.style.transform = `translateX(${lerp(-55, 55, easeInOutSine(su))}%)`;

  // 제목: 숨 쉬듯 은은하게
  titleEl.style.transform = `scale(${1 + Math.sin((t / DURATION) * TAU * 5) * 0.006})`;

  updateTags(t);
  renderer.render(scene, camera);
}

window.renderAt = renderAt;
window.DURATION = DURATION;

// ---------- 미리보기 모드 ----------
const params = new URLSearchParams(location.search);
function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  stage.style.transform = `scale(${s})`;
}
if (!params.has('render')) {
  fit();
  addEventListener('resize', fit);
  const t0 = performance.now();
  const loop = () => {
    renderAt(((performance.now() - t0) / 1000) % DURATION);
    requestAnimationFrame(loop);
  };
  document.fonts.ready.then(loop);
} else {
  document.fonts.ready.then(() => {
    renderAt(0);
    window.READY = true;
  });
}
