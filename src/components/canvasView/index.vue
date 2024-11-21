<template>
  <view>
    <web-view src="/static/canvas-test/index.html">
    </web-view>
    <!-- 定义一个 canvas 元素 -->
    <!--<canvas id="particleCanvas" style="width: 100%; height: 100vh;"></canvas>-->
  </view>
</template>
<script>
export default {
  data() {
    return {
      canvas: null,
      context: null,
      settings: {
        particles: {
          length: 500, // maximum amount of particles
          duration: 2, // particle duration in sec
          velocity: 100, // particle velocity in pixels/sec
          effect: -0.75, // play with this for a nice effect
          size: 30, // particle size in pixels
        },
      },
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      const canvasId = 'particleCanvas';
      const query = uni.createSelectorQuery().in(this);
      query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
        const canvas = res[0].node;
        const canvasContext = canvas.getContext('2d');

        this.canvas = canvas;
        this.context = canvasContext;

        const settings = this.settings;
        const particles = new ParticlePool(settings.particles.length);
        let time;

        // get point on heart with -PI <= t <= PI
        function pointOnHeart(t) {
          return new Point(
              160 * Math.pow(Math.sin(t), 3),
              130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
          );
        }

        // creating the particle image using a dummy canvas
        const image = (function () {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = settings.particles.size;
          canvas.height = settings.particles.size;

          // helper function to create the path
          function to(t) {
            const point = pointOnHeart(t);
            point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
            point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
            return point;
          }

          // create the path
          context.beginPath();
          let t = -Math.PI;
          const point = to(t);
          context.moveTo(point.x, point.y);
          while (t < Math.PI) {
            t += 0.01; // baby steps!
            const point = to(t);
            context.lineTo(point.x, point.y);
          }
          context.closePath();
          // create the fill
          context.fillStyle = '#ea80b0';
          context.fill();
          // create the image
          const image = new Image();
          image.src = canvas.toDataURL();
          return image;
        })();

        // render that thing!
        function render() {
          // next animation frame
          requestAnimationFrame(render);

          // update time
          const newTime = new Date().getTime() / 1000;
          const deltaTime = newTime - (time || newTime);
          time = newTime;

          // clear canvas
          canvasContext.clearRect(0, 0, canvas.width, canvas.height);

          // create new particles
          const amount = (settings.particles.length / settings.particles.duration) * deltaTime;
          for (let i = 0; i < amount; i++) {
            const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
            const dir = pos.clone().length(settings.particles.velocity);
            particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
          }

          // update and draw particles
          particles.update(deltaTime);
          particles.draw(canvasContext, image);
        }

        // handle (re-)sizing of the canvas
        function onResize() {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }

        window.onresize = onResize;
        setInterval(onResize, 1500);

        // delay rendering bootstrap
        setTimeout(() => {
          onResize();
          render();
        }, 10);
      });
    },
  },
};

// Point class
class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  length(length) {
    if (typeof length === 'undefined') {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  }

  normalize() {
    const length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }
}

// Particle class
class Particle {
  constructor() {
    this.position = new Point();
    this.velocity = new Point();
    this.acceleration = new Point();
    this.age = 0;
  }

  initialize(x, y, dx, dy) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * settings.particles.effect;
    this.acceleration.y = dy * settings.particles.effect;
    this.age = 0;
  }

  update(deltaTime) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  }

  draw(context, image) {
    function ease(t) {
      return (--t) * t * t + 1;
    }

    const size = image.width * ease(this.age / settings.particles.duration);
    context.globalAlpha = 1 - this.age / settings.particles.duration;
    context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
  }
}

// ParticlePool class
class ParticlePool {
  constructor(length) {
    this.particles = new Array(length);
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i] = new Particle();
    }
    this.firstActive = 0;
    this.firstFree = 0;
    this.duration = settings.particles.duration;
  }

  add(x, y, dx, dy) {
    this.particles[this.firstFree].initialize(x, y, dx, dy);

    // handle circular queue
    this.firstFree++;
    if (this.firstFree === this.particles.length) this.firstFree = 0;
    if (this.firstActive === this.firstFree) this.firstActive++;
    if (this.firstActive === this.particles.length) this.firstActive = 0;
  }

  update(deltaTime) {
    // update active particles
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime);
      }
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].update(deltaTime);
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime);
      }
    }

    // remove inactive particles
    while (this.particles[this.firstActive].age >= this.duration && this.firstActive !== this.firstFree) {
      this.firstActive++;
      if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
  }

  draw(context, image) {
    // draw active particles
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].draw(context, image);
      }
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].draw(context, image);
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].draw(context, image);
      }
    }
  }
}
</script>
<style scoped>
#particleCanvas {
  width: 100%;
  height: 100vh;
  //background-color: #000; /* 可选：给画布设置背景色 */
}
</style>
