/**
 * CinematicHeroService
 * Manages the Three.js scene for the hero section.
 * Uses pure Three.js (no React Three Fiber) for Angular 16 compatibility.
 * Falls back gracefully when WebGL is unavailable.
 */
import { Injectable, NgZone, OnDestroy } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CinematicHeroService implements OnDestroy {
  private THREE: any;
  private gsap: any;

  private renderer: any;
  private scene: any;
  private camera: any;
  private animFrameId: number | null = null;
  private scrollProgress = 0;
  private mouseX = 0;
  private mouseY = 0;
  private isInit = false;
  private canvas: HTMLCanvasElement | null = null;

  // Food objects
  private heroGroup: any;
  private ingredients: any[] = [];
  private clock: any;

  private onScrollBound = this.onScroll.bind(this);
  private onMouseBound = this.onMouse.bind(this);
  private onResizeBound = this.onResize.bind(this);

  constructor(private ngZone: NgZone) {}

  async init(canvas: HTMLCanvasElement): Promise<boolean> {
    if (!canvas || this.isInit) return false;
    this.canvas = canvas;

    // Check WebGL support
    try {
      const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!ctx) return false;
    } catch {
      return false;
    }

    try {
      // Dynamic import — only loaded when WebGL is supported
      const [threeModule, gsapModule] = await Promise.all([
        import('three'),
        import('gsap')
      ]);
      this.THREE = threeModule;
      this.gsap = gsapModule.gsap;
    } catch {
      return false;
    }

    this.isInit = true;
    this.ngZone.runOutsideAngular(() => this.setup());
    return true;
  }

  private setup(): void {
    const T = this.THREE;
    const W = this.canvas!.clientWidth;
    const H = this.canvas!.clientHeight;

    // Renderer
    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas!,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(W, H, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = T.PCFSoftShadowMap;
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;

    // Scene + Camera
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(45, W / H, 0.1, 100);
    this.camera.position.set(0, 0, 6);
    this.clock = new T.Clock();

    this.buildLights();
    this.buildBurger();
    this.buildIngredients();
    this.buildParticles();

    // Animate in with GSAP
    this.gsap.from(this.heroGroup.position, { y: -3, duration: 1.4, ease: 'power3.out', delay: 0.3 });
    this.gsap.from(this.heroGroup.scale, { x: 0.4, y: 0.4, z: 0.4, duration: 1.4, ease: 'back.out(1.5)', delay: 0.3 });
    this.ingredients.forEach((m, i) => {
      this.gsap.from(m.position, { y: m.position.y - 2, duration: 1.2, ease: 'power3.out', delay: 0.5 + i * 0.08 });
      this.gsap.from(m, { opacity: 0, duration: 0.8, delay: 0.5 + i * 0.08 });
    });

    // Event listeners
    window.addEventListener('scroll', this.onScrollBound, { passive: true });
    window.addEventListener('mousemove', this.onMouseBound, { passive: true });
    window.addEventListener('resize', this.onResizeBound, { passive: true });

    this.animate();
  }

  private buildLights(): void {
    const T = this.THREE;

    // Warm key light (food photography style)
    const key = new T.DirectionalLight(0xfff4e0, 3.5);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 20;
    this.scene.add(key);

    // Cool fill light
    const fill = new T.DirectionalLight(0xddeeff, 1.2);
    fill.position.set(-3, 2, 2);
    this.scene.add(fill);

    // Rim light from behind
    const rim = new T.DirectionalLight(0xff8a3d, 1.8);
    rim.position.set(-2, -1, -4);
    this.scene.add(rim);

    // Ambient
    const ambient = new T.AmbientLight(0xfff8f0, 0.8);
    this.scene.add(ambient);

    // Point glow under burger
    const glow = new T.PointLight(0xff4d4d, 1.5, 6);
    glow.position.set(0, -1.5, 1);
    this.scene.add(glow);
  }

  private buildBurger(): void {
    const T = this.THREE;
    this.heroGroup = new T.Group();

    // --- Burger components (stylized geometry) ---

    // Shadow disk
    const shadowGeo = new T.CircleGeometry(1.3, 48);
    const shadowMat = new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 });
    const shadowMesh = new T.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.65;
    this.heroGroup.add(shadowMesh);

    // Bottom bun
    const bbGeo = new T.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const bunMat = new T.MeshStandardMaterial({ color: 0xe8903a, roughness: 0.7, metalness: 0.0 });
    const bottomBun = new T.Mesh(bbGeo, bunMat);
    bottomBun.position.y = -1.5;
    bottomBun.scale.set(1, 0.55, 1);
    bottomBun.castShadow = true;
    this.heroGroup.add(bottomBun);

    // Sesame seeds (small spheres on top bun)
    const seedMat = new T.MeshStandardMaterial({ color: 0xd4a84b, roughness: 0.8 });
    const seedPositions = [
      [0, 0.08, 0.6], [0.4, 0.15, 0.4], [-0.4, 0.15, 0.4],
      [0.5, 0.05, 0], [-0.5, 0.05, 0], [0.3, 0.1, -0.4],
    ];

    // Patty
    const pattyGeo = new T.CylinderGeometry(0.98, 1.02, 0.28, 32);
    const pattyMat = new T.MeshStandardMaterial({ color: 0x5c2f0a, roughness: 0.9, metalness: 0.05 });
    const patty = new T.Mesh(pattyGeo, pattyMat);
    patty.position.y = -1.0;
    patty.castShadow = true;
    this.heroGroup.add(patty);

    // Cheese slice
    const cheeseGeo = new T.BoxGeometry(2.2, 0.08, 2.2);
    const cheeseMat = new T.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.6, metalness: 0.0, transparent: true, opacity: 0.95 });
    const cheese = new T.Mesh(cheeseGeo, cheeseMat);
    cheese.position.y = -0.7;
    cheese.rotation.y = Math.PI / 8;
    cheese.castShadow = true;
    this.heroGroup.add(cheese);

    // Lettuce layer
    const lettuceGeo = new T.TorusGeometry(1.0, 0.18, 8, 24);
    const lettuceMat = new T.MeshStandardMaterial({ color: 0x3c8c40, roughness: 0.95 });
    const lettuce = new T.Mesh(lettuceGeo, lettuceMat);
    lettuce.position.y = -0.4;
    lettuce.scale.set(1, 0.3, 1);
    lettuce.castShadow = true;
    this.heroGroup.add(lettuce);

    // Tomato slice
    const tomatoGeo = new T.CylinderGeometry(0.9, 0.9, 0.12, 32);
    const tomatoMat = new T.MeshStandardMaterial({ color: 0xe8352e, roughness: 0.75, transparent: true, opacity: 0.90 });
    const tomato = new T.Mesh(tomatoGeo, tomatoMat);
    tomato.position.y = -0.1;
    tomato.castShadow = true;
    this.heroGroup.add(tomato);

    // Top bun
    const topBunGeo = new T.SphereGeometry(1.05, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const topBun = new T.Mesh(topBunGeo, bunMat);
    topBun.position.y = 0.3;
    topBun.castShadow = true;
    this.heroGroup.add(topBun);

    // Sesame seeds on top bun
    seedPositions.forEach(([x, dy, z]) => {
      const seed = new T.Mesh(new T.SphereGeometry(0.055, 8, 8), seedMat);
      seed.position.set(x, 1.2 + dy, z);
      this.heroGroup.add(seed);
    });

    this.scene.add(this.heroGroup);
  }

  private buildIngredients(): void {
    const T = this.THREE;

    const defs = [
      // Floating tomato
      { geo: new T.SphereGeometry(0.22, 24, 24), mat: { color: 0xe03030, roughness: 0.5 }, pos: [-2.2, 0.8, -0.5], speed: 1.2 },
      // Cheese wedge
      { geo: new T.BoxGeometry(0.3, 0.3, 0.06), mat: { color: 0xfac800, roughness: 0.5 }, pos: [2.3, 0.5, 0.2], speed: 0.9 },
      // Lettuce leaf
      { geo: new T.TorusGeometry(0.2, 0.08, 6, 16), mat: { color: 0x2d8c35, roughness: 0.9 }, pos: [-2.0, -0.4, 0.8], speed: 1.4 },
      // Spice sphere
      { geo: new T.SphereGeometry(0.14, 16, 16), mat: { color: 0xd45f00, roughness: 0.8 }, pos: [2.0, -0.8, -0.3], speed: 1.1 },
      // Onion ring
      { geo: new T.TorusGeometry(0.18, 0.06, 8, 24), mat: { color: 0xffd5a0, roughness: 0.7, transparent: true, opacity: 0.85 }, pos: [1.5, 1.2, 1.0], speed: 0.8 },
      // Pepper
      { geo: new T.ConeGeometry(0.1, 0.25, 12), mat: { color: 0xc0392b, roughness: 0.7 }, pos: [-1.6, 1.1, 0.4], speed: 1.3 },
      // Sesame seed cluster
      { geo: new T.SphereGeometry(0.09, 10, 10), mat: { color: 0xd4a84b, roughness: 0.8 }, pos: [-1.3, -1.2, 1.2], speed: 1.0 },
      // Salt crystal
      { geo: new T.BoxGeometry(0.1, 0.1, 0.1), mat: { color: 0xffffff, roughness: 0.1, metalness: 0.3 }, pos: [2.5, -0.2, 0.8], speed: 0.7 },
    ];

    defs.forEach((d) => {
      const mat = new T.MeshStandardMaterial(d.mat);
      const mesh = new T.Mesh(d.geo, mat);
      mesh.position.set(...(d.pos as [number, number, number]));
      mesh.castShadow = true;
      (mesh as any)._speed = d.speed;
      (mesh as any)._originY = d.pos[1];
      (mesh as any)._originX = d.pos[0];
      this.ingredients.push(mesh);
      this.scene.add(mesh);
    });
  }

  private buildParticles(): void {
    const T = this.THREE;
    const count = 80;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(positions, 3));
    const mat = new T.PointsMaterial({ color: 0xff8a3d, size: 0.045, transparent: true, opacity: 0.5 });
    this.scene.add(new T.Points(geo, mat));
  }

  private animate(): void {
    this.animFrameId = requestAnimationFrame(() => this.animate());

    const t = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Hero burger: gentle float + slow rotation
    if (this.heroGroup) {
      this.heroGroup.rotation.y += 0.004;
      this.heroGroup.position.y = Math.sin(elapsed * 0.7) * 0.12;
      // Camera parallax from mouse
      this.camera.position.x += (this.mouseX * 0.8 - this.camera.position.x) * 0.04;
      this.camera.position.y += (-this.mouseY * 0.5 + 0.3 - this.camera.position.y) * 0.04;
      this.camera.lookAt(0, 0, 0);
      // Scroll: push burger back and tilt
      this.heroGroup.position.z = -this.scrollProgress * 2;
      this.heroGroup.rotation.x = this.scrollProgress * 0.4;
      this.heroGroup.scale.setScalar(1 - this.scrollProgress * 0.3);
    }

    // Floating ingredients
    this.ingredients.forEach((m, i) => {
      const spd = m._speed;
      m.position.y = m._originY + Math.sin(elapsed * spd + i * 0.9) * 0.18;
      m.position.x = m._originX + Math.cos(elapsed * spd * 0.5 + i * 1.1) * 0.08;
      m.rotation.x += 0.008 * spd;
      m.rotation.z += 0.006 * spd;
    });

    this.renderer.render(this.scene, this.camera);
  }

  private onScroll(): void {
    const heroHeight = window.innerHeight;
    this.scrollProgress = Math.min(window.scrollY / heroHeight, 1);
  }

  private onMouse(e: MouseEvent): void {
    this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  private onResize(): void {
    if (!this.canvas || !this.camera || !this.renderer) return;
    const W = this.canvas.clientWidth;
    const H = this.canvas.clientHeight;
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(W, H, false);
  }

  destroy(): void {
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('scroll', this.onScrollBound);
    window.removeEventListener('mousemove', this.onMouseBound);
    window.removeEventListener('resize', this.onResizeBound);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss?.();
    }
    if (this.scene) {
      this.scene.traverse((obj: any) => {
        obj.geometry?.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
          else obj.material.dispose();
        }
      });
    }
    this.isInit = false;
  }

  ngOnDestroy(): void { this.destroy(); }
}
