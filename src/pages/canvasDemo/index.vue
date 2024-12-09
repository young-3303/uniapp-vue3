<template>
  <view class="particle-canvas">
    <!-- 使用 canvas 组件，并设置 id 以便后续获取 -->
    <!--<canvas type="2d" id="myCanvas"></canvas>-->
    <web-view src="https://young-3303.github.io/forever_young/"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      settings: {
        particles: {
          length: 500, // 最大粒子数量
          duration: 2, // 粒子持续时间（秒）
          velocity: 100, // 粒子速度（像素/秒）
          effect: -0.75, // 效果参数
          size: 30, // 粒子大小（像素）
        },
      },
      context: null,
      particles: null,
      particleRate: 0,
      time: null,
    };
  },
  methods: {
    async initCanvas() {
      this.context = await this.getCanvasContext('myCanvas');
      this.particles = new ParticlePool(this.settings.particles.length, this.settings);
      this.particleRate = this.settings.particles.length / this.settings.particles.duration;
      this.time = null;

      // 初始化点方法保持不变
      function pointOnHeart(t) {
        return new Point(
            160 * Math.pow(Math.sin(t), 3),
            130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
        );
      }

      // 创建粒子图像的方法调整为使用静态资源
      const image = (function () {
        const img = new Image();
        img.src = '/static/heart.png'; // 使用预准备的静态心形图片资源
        return img;
      })();
      // 渲染函数
      function render(that) {
        if (typeof wx !== 'undefined' && wx.nextTick) {
          wx.nextTick(() => render(that)); // 如果是微信小程序环境，使用 nextTick
        } else {
          requestAnimationFrame(() => render(that)); // 否则使用标准的 requestAnimationFrame
        }

        const newTime = Date.now() / 1000,
            deltaTime = newTime - (that.time || newTime);
        that.time = newTime;

        // 清除画布
        that.context.clearRect(0, 0, that.context.canvas.width, that.context.canvas.height);

        // 创建新粒子
        const amount = that.particleRate * deltaTime;
        for (let i = 0; i < amount; i++) {
          const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
          const dir = pos.clone().length(that.settings.particles.velocity);
          that.particles.add(
              that.context.canvas.width / 2 + pos.x,
              that.context.canvas.height / 2 - pos.y,
              dir.x,
              -dir.y
          );
        }

        // 更新并绘制粒子
        that.particles.update(deltaTime);
        that.particles.draw(that.context, image);
      }

      // 处理画布大小调整
      function onResize(that) {
        uni.createSelectorQuery().select('#myCanvas').boundingClientRect(function (rect) {
          if (rect) {
            const dpr = uni.getSystemInfoSync().pixelRatio;
            that.context.canvas.width = rect.width * dpr;
            that.context.canvas.height = rect.height * dpr;
            that.context.scale(dpr, dpr);
          }
        }).exec();
      }

      // 监听窗口大小改变事件
      window.onresize = () => onResize(this);
      uni.onWindowResize(() => onResize(this));

      // 开始渲染
      setTimeout(() => {
        onResize(this);
        render(this);
      }, 10);
    },

    getCanvasContext(canvasId) {
      return new Promise((resolve, reject) => {
        uni.createSelectorQuery().select(`#${canvasId}`).fields({
          node: true,
          size: true
        }).exec((res) => {
          if (!res[0]) return reject('无法获取 canvas');
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          resolve(ctx);
        });
      });
    }
  },
  mounted() {
    // this.initCanvas();
    uni.showModal({
      showCancel: false,
      title: '提示',
      content: 'hala'
    })
  }
};

// Point, Particle, ParticlePool 类定义和原始代码相同，直接复制过来即可
// 注意：这些类需要在 export default {} 之前定义，或者可以放在单独的文件中导入

class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  length(length) {
    if (typeof length == 'undefined') {
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

class Particle {
  constructor(settings) {
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

    const size = image.width * ease(this.age / this.$parent.settings.particles.duration);
    context.globalAlpha = 1 - this.age / this.$parent.settings.particles.duration;
    context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
  }
}

class ParticlePool {
  constructor(length, settings) {
    this.particles = new Array(length).fill(null).map(() => new Particle(settings));
    this.firstActive = 0;
    this.firstFree = 0;
    this.duration = settings.particles.duration;
  }

  add(x, y, dx, dy) {
    this.particles[this.firstFree].initialize(x, y, dx, dy);

    // 处理循环队列
    this.firstFree++;
    if (this.firstFree === this.particles.length) this.firstFree = 0;
    if (this.firstActive === this.firstFree) this.firstActive++;
    if (this.firstActive === this.particles.length) this.firstActive = 0;
  }

  update(deltaTime) {
    // 更新活动粒子
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].update(deltaTime);
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) this.particles[i].update(deltaTime);
      for (let i = 0; i < this.firstFree; i++) this.particles[i].update(deltaTime);
    }

    // 移除不活跃的粒子
    while (this.particles[this.firstActive]?.age >= this.duration && this.firstActive !== this.firstFree) {
      this.firstActive++;
      if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
  }

  draw(context, image) {
    // 绘制活动粒子
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) this.particles[i].draw(context, image);
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) this.particles[i].draw(context, image);
      for (let i = 0; i < this.firstFree; i++) this.particles[i].draw(context, image);
    }
  }
}
</script>

<style scoped>
.particle-canvas {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
