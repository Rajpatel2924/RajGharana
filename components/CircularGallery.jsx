'use client';

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';
import './CircularGallery.css';

const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

const lerp = (start, end, amount) => start + (end - start) * amount;

const createTextTexture = (gl, text, font = '600 30px sans-serif', color = '#0f172a') => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const textWidth = Math.ceil(context.measureText(text).width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 32;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
};

class Title {
  constructor({ gl, plane, text, textColor }) {
    const { texture, width, height } = createTextTexture(gl, text, '600 30px sans-serif', textColor);
    const geometry = new Plane(gl);
    const program = new Program(gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });

    this.mesh = new Mesh(gl, { geometry, program });
    const textHeight = plane.scale.y * 0.14;
    this.mesh.scale.set(textHeight * (width / height), textHeight, 1);
    this.mesh.position.y = -plane.scale.y * 0.5 - textHeight * 0.75;
    this.mesh.setParent(plane);
  }
}

class Media {
  constructor({ geometry, gl, image, index, item, length, scene, screen, viewport, bend, textColor, borderRadius }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.item = item;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.createShader();
    this.createMesh();
    this.onResize();
    this.title = new Title({ gl, plane: this.plane, text: item.text, textColor });
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) + cos(p.y * 2.0 + uTime)) * (0.08 + abs(uSpeed) * 0.35);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          float distance = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, distance);
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [1, 1] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });

    const image = new Image();
    image.src = this.image;
    image.onload = () => {
      texture.image = image;
      this.program.uniforms.uImageSizes.value = [image.naturalWidth, image.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const halfWidth = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const absoluteBend = Math.abs(this.bend);
      const radius = (halfWidth * halfWidth + absoluteBend * absoluteBend) / (2 * absoluteBend);
      const effectiveX = Math.min(Math.abs(x), halfWidth);
      const arc = radius - Math.sqrt(radius * radius - effectiveX * effectiveX);
      this.plane.position.y = this.bend > 0 ? -arc : arc;
      this.plane.rotation.z = (this.bend > 0 ? -1 : 1) * Math.sign(x) * Math.asin(effectiveX / radius);
    }

    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current - scroll.last;
    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    const isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    const isAfter = this.plane.position.x - planeOffset > viewportOffset;

    if (direction === 'right' && isBefore) this.extra -= this.widthTotal;
    if (direction === 'left' && isAfter) this.extra += this.widthTotal;
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    const scale = this.screen.height / 980;
    this.plane.scale.y = (this.viewport.height * (650 * scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (500 * scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 1.5;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class GalleryApp {
  constructor(container, { items, bend, textColor, borderRadius, scrollSpeed, scrollEase, onSelect }) {
    this.container = container;
    this.items = items;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onSelect = onSelect;
    this.onCheckDebounce = debounce(() => this.snapToNearest(), 160);
    this.createRenderer();
    this.createCamera();
    this.scene = new Transform();
    this.onResize();
    this.geometry = new Plane(this.gl, { heightSegments: 32, widthSegments: 64 });
    this.createMedias(items, bend, textColor, borderRadius);
    this.addEventListeners();
    this.update();
  }

  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createMedias(items, bend, textColor, borderRadius) {
    const repeatedItems = items.concat(items);
    this.medias = repeatedItems.map((item, index) => new Media({
      geometry: this.geometry,
      gl: this.gl,
      image: item.image,
      index,
      item,
      length: repeatedItems.length,
      scene: this.scene,
      screen: this.screen,
      viewport: this.viewport,
      bend,
      textColor,
      borderRadius,
    }));
  }

  onResize = () => {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    this.viewport = { width: height * this.camera.aspect, height };
    this.medias?.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
  };

  onPointerDown = (event) => {
    this.isDown = true;
    this.hasDragged = false;
    this.scroll.position = this.scroll.current;
    this.start = event.touches ? event.touches[0].clientX : event.clientX;
  };

  onPointerMove = (event) => {
    if (!this.isDown) return;
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    if (Math.abs(distance) > 0.08) this.hasDragged = true;
    this.scroll.target = this.scroll.position + distance;
  };

  onPointerUp = () => {
    if (!this.isDown) return;
    this.isDown = false;
    this.snapToNearest();
    if (!this.hasDragged) this.selectNearest();
  };

  onWheel = (event) => {
    event.preventDefault();
    this.scroll.target += Math.sign(event.deltaY) * this.scrollSpeed * 0.22;
    this.onCheckDebounce();
  };

  snapToNearest() {
    if (!this.medias?.[0]) return;
    const width = this.medias[0].width;
    const item = width * Math.round(Math.abs(this.scroll.target) / width);
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  selectNearest() {
    const nearest = this.medias.reduce((current, media) => (
      Math.abs(media.plane.position.x) < Math.abs(current.plane.position.x) ? media : current
    ));
    this.onSelect?.(nearest.item.category);
  }

  update = () => {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    this.medias?.forEach(media => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update);
  };

  addEventListeners() {
    window.addEventListener('resize', this.onResize);
    this.container.addEventListener('wheel', this.onWheel, { passive: false });
    this.container.addEventListener('mousedown', this.onPointerDown);
    this.container.addEventListener('mousemove', this.onPointerMove);
    this.container.addEventListener('mouseup', this.onPointerUp);
    this.container.addEventListener('mouseleave', this.onPointerUp);
    this.container.addEventListener('touchstart', this.onPointerDown, { passive: true });
    this.container.addEventListener('touchmove', this.onPointerMove, { passive: true });
    this.container.addEventListener('touchend', this.onPointerUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    this.onCheckDebounce.cancel();
    window.removeEventListener('resize', this.onResize);
    this.container.removeEventListener('wheel', this.onWheel);
    this.container.removeEventListener('mousedown', this.onPointerDown);
    this.container.removeEventListener('mousemove', this.onPointerMove);
    this.container.removeEventListener('mouseup', this.onPointerUp);
    this.container.removeEventListener('mouseleave', this.onPointerUp);
    this.container.removeEventListener('touchstart', this.onPointerDown);
    this.container.removeEventListener('touchmove', this.onPointerMove);
    this.container.removeEventListener('touchend', this.onPointerUp);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    this.gl.canvas.remove();
  }
}

export default function CircularGallery({
  items,
  bend = 2.3,
  textColor = '#0f172a',
  borderRadius = 0.07,
  scrollSpeed = 2,
  scrollEase = 0.06,
  onSelect,
}) {
  const containerRef = useRef(null);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    if (!containerRef.current || !items?.length) return undefined;
    const app = new GalleryApp(containerRef.current, {
      items,
      bend,
      textColor,
      borderRadius,
      scrollSpeed,
      scrollEase,
      onSelect: category => onSelectRef.current?.(category),
    });
    return () => app.destroy();
  }, [items, bend, textColor, borderRadius, scrollSpeed, scrollEase]);

  return <div className="circular-gallery" ref={containerRef} aria-hidden="true" />;
}
