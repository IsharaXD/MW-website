import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const VERTEX_SHADER = `#version 300 es
precision highp float;
in vec4 position;
void main() {
  gl_Position = position;
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 u_resolution;
uniform float u_time;

#define R u_resolution
#define T u_time

void mainImage0(out vec4 O, in vec2 I) {
  vec2 p = (I + I - R) / R.y * 8.0;
  O = tanh(vec4(1.0, 2.0, 3.0, 1.0) / length(tan(abs(p - T)) + 8.0 * sin(p.x + T) + p));
}

void mainImage(out vec4 o, in vec2 u) {
  float s = 16.0;
  float k;
  vec2 j = vec2(0.5);
  o = vec4(0.0);
  vec4 c;
  mainImage0(c, u);
  for (k = s; k-- > 0.5; ) {
    mainImage0(c, u + j - 0.5);
    o += c;
    j = fract(j + vec2(0.755, 0.57).yx);
  }
  o /= s;
  o.a = 1.0;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  fragColor = color;
}
`;

@Component({
  selector: 'app-hero-background',
  standalone: true,
  imports: [],
  templateUrl: './hero-background.html',
  styleUrl: './hero-background.scss',
})
export class HeroBackground implements AfterViewInit, OnDestroy {
  @ViewChild('glcanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private rafId = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async ngAfterViewInit(): Promise<void> {
    // WebGL and twgl are browser-only — skip entirely during SSR
    if (!isPlatformBrowser(this.platformId)) return;

    // Lazy-import twgl so the SSR bundle never touches this browser-only library
    const twgl = await import('twgl.js');

    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl2');

    if (!gl) {
      console.warn('WebGL2 not supported — hero background skipped.');
      return;
    }

    const programInfo = twgl.createProgramInfo(gl, [VERTEX_SHADER, FRAGMENT_SHADER]);
    const arrays = {
      position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

    const render = (time: number) => {
      twgl.resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      const uniforms = {
        u_time: time * 0.001,
        u_resolution: [gl.canvas.width, gl.canvas.height],
      };

      gl.useProgram(programInfo.program);
      twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
      twgl.setUniforms(programInfo, uniforms);
      twgl.drawBufferInfo(gl, bufferInfo);

      this.rafId = requestAnimationFrame(render);
    };

    this.rafId = requestAnimationFrame(render);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
