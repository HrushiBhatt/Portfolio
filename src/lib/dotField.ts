import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LinearSRGBColorSpace,
  NormalBlending,
  PerspectiveCamera,
  Plane,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';

const WIDTH = 110;
const DEPTH = 52;
const COLUMNS = 340;
const ROWS = 170;

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uScroll;
  uniform float uSize;
  uniform vec3 uPointer;
  uniform float uPointerOn;

  varying float vHeat;
  varying float vFade;

  // 2D simplex noise (Ashima Arts / Stefan Gustavson, MIT)
  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec3 p = position;

    float wave = 1.25 * snoise(p.xz * 0.05 + vec2(uTime * 0.05, uTime * 0.03));
    wave += 0.3 * snoise(p.xz * 0.13 - vec2(uTime * 0.08, 0.0));

    // The surface swells up under the pointer
    float d = distance(p.xz, uPointer.xz);
    float swell = uPointerOn * exp(-d * d * 0.028);
    float height = wave + swell * 1.5;

    // On load a front rolls in from the horizon, lifting the flat sheet into waves
    float front = smoothstep(0.0, 0.45, uReveal * 1.45 - (1.0 - (p.z + ${(DEPTH / 2).toFixed(1)}) / ${DEPTH.toFixed(1)}));
    p.y = height * front - (1.0 - front) * 5.0;

    // Sinks away as the hero scrolls off
    p.y -= uScroll * 7.0;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (1.0 + max(height, 0.0) * 0.22) / -mv.z;

    vHeat = max(smoothstep(0.6, 1.45, height), swell * 0.9) * front;
    // Dissolves towards the horizon and the near edge, so the sheet has no hard border
    vFade = front * smoothstep(-${(DEPTH / 2).toFixed(1)}, -8.0, p.z) * (0.55 + 0.45 * smoothstep(0.0, 2.0, height + 1.5));
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uCold;
  uniform vec3 uHot;

  varying float vHeat;
  varying float vFade;

  void main() {
    // A crisp disc, with a one-pixel soft edge only
    float r = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(0.4, 0.5, r);
    if (alpha <= 0.0) discard;
    gl_FragColor = vec4(mix(uCold, uHot, vHeat), alpha * vFade);
  }
`;

// The palette's own hex values, written straight to the screen with no colour conversion
const raw = (hex: string) => new Color().setStyle(hex, LinearSRGBColorSpace);

/**
 * A rolling sheet of dots behind the hero: green at rest, solid orange on the crests and under
 * the pointer. Pauses while off screen. With `animate` off it draws one still frame.
 */
export function createDotField(host: HTMLElement, { animate }: { animate: boolean }) {
  const renderer = new WebGLRenderer({ alpha: true, antialias: false });
  renderer.setClearColor(0x000000, 0);
  host.append(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(36, 1, 0.1, 120);
  // High enough to look down on the waves: at a grazing angle their far slopes fold into squiggles
  camera.position.set(0, 14, 25);
  camera.lookAt(0, 6.5, -6);

  const positions = new Float32Array(COLUMNS * ROWS * 3);
  for (let row = 0; row < ROWS; row++) {
    for (let column = 0; column < COLUMNS; column++) {
      const i = (row * COLUMNS + column) * 3;
      positions[i] = (column / (COLUMNS - 1) - 0.5) * WIDTH;
      positions[i + 2] = (row / (ROWS - 1) - 0.5) * DEPTH;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const uniforms = {
    uTime: { value: 0 },
    uReveal: { value: animate ? 0 : 1 },
    uScroll: { value: 0 },
    uSize: { value: 1 },
    uPointer: { value: new Vector3() },
    uPointerOn: { value: 0 },
    uCold: { value: raw('#2e8259') },
    uHot: { value: raw('#ff7f1f') },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: NormalBlending,
  });
  scene.add(new Points(geometry, material));

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = host;
    if (!width || !height) return;
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    uniforms.uSize.value = 58 * pixelRatio;
    renderer.render(scene, camera);
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  resize();

  const release = () => {
    resizeObserver.disconnect();
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  if (!animate) return { uniforms, dispose: release };

  // Where the pointer's ray meets the sheet; the swell eases after it
  const ground = new Plane(new Vector3(0, 1, 0), 0);
  const ray = new Raycaster();
  const ndc = new Vector2();
  const target = new Vector3();
  let pointerSeen = false;

  const onPointer = (event: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    ndc.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (!ray.ray.intersectPlane(ground, target)) return;
    if (!pointerSeen) uniforms.uPointer.value.copy(target);
    pointerSeen = true;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  let frame = 0;
  let last = performance.now();

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    const delta = Math.min((now - last) / 1000, 0.1);
    last = now;
    const ease = 1 - Math.exp(-delta * 5);

    uniforms.uTime.value += delta;
    uniforms.uPointer.value.lerp(target, ease);
    uniforms.uPointerOn.value += ((pointerSeen ? 1 : 0) - uniforms.uPointerOn.value) * ease;
    uniforms.uScroll.value = Math.min(window.scrollY / Math.max(host.clientHeight, 1), 1);
    renderer.render(scene, camera);
  };

  const visibility = new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(frame);
    if (entry.isIntersecting) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  });
  visibility.observe(host);

  return {
    uniforms,
    dispose() {
      cancelAnimationFrame(frame);
      visibility.disconnect();
      window.removeEventListener('pointermove', onPointer);
      release();
    },
  };
}
