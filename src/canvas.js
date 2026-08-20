function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export class InkPad {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.strokes = [];
    this.current = null;
    this.pointerId = null;
    this.listeners = { strokeEnd: [], change: [] };
    this.dpr = 1;

    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.resize = this.resize.bind(this);

    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('pointercancel', this.onPointerUp);
    canvas.addEventListener('lostpointercapture', this.onPointerUp);
    window.addEventListener('resize', this.resize);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas.parentElement || canvas);
    this.resize();
  }

  on(event, fn) {
    this.listeners[event].push(fn);
  }

  emit(event, payload) {
    for (const fn of this.listeners[event]) fn(payload);
  }

  cssSize() {
    const el = this.canvas.parentElement || this.canvas;
    return { width: el.clientWidth, height: el.clientHeight };
  }

  pointFromEvent(event) {
    const el = this.canvas.parentElement || this.canvas;
    const rect = el.getBoundingClientRect();
    const { width, height } = this.cssSize();
    const scaleX = rect.width ? width / rect.width : 1;
    const scaleY = rect.height ? height / rect.height : 1;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
      t: Date.now(),
    };
  }

  resize() {
    const { width, height } = this.cssSize();
    if (!width || !height) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.redraw();
  }

  onPointerDown(event) {
    if (this.pointerId !== null) return;
    event.preventDefault();
    this.canvas.setPointerCapture(event.pointerId);
    this.pointerId = event.pointerId;
    this.current = [this.pointFromEvent(event)];
    this.redraw();
    this.emit('change');
  }

  onPointerMove(event) {
    if (event.pointerId !== this.pointerId || !this.current) return;
    event.preventDefault();
    const point = this.pointFromEvent(event);
    const last = this.current[this.current.length - 1];
    if (Math.hypot(point.x - last.x, point.y - last.y) < 0.8) return;
    this.current.push(point);
    this.redraw();
  }

  onPointerUp(event) {
    if (this.pointerId !== null && event.pointerId !== this.pointerId) return;
    if (this.current && this.current.length) {
      this.strokes.push(this.current);
      this.current = null;
      this.pointerId = null;
      this.redraw();
      this.emit('strokeEnd');
      this.emit('change');
      return;
    }
    this.current = null;
    this.pointerId = null;
  }

  drawGuides() {
    const { width, height } = this.cssSize();
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = 'rgba(243, 235, 225, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 7]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 10);
    ctx.lineTo(width / 2, height - 10);
    ctx.moveTo(10, height / 2);
    ctx.lineTo(width - 10, height / 2);
    ctx.stroke();
    ctx.restore();
  }

  drawStroke(points) {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#f4f0ea';
    ctx.fillStyle = '#f4f0ea';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4.2;

    if (points.length === 1) {
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length - 1; i += 1) {
      const mid = midpoint(points[i], points[i + 1]);
      ctx.quadraticCurveTo(points[i].x, points[i].y, mid.x, mid.y);
    }
    const last = points[points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.restore();
  }

  redraw() {
    const { width, height } = this.cssSize();
    this.ctx.clearRect(0, 0, width, height);
    this.drawGuides();
    for (const stroke of this.strokes) this.drawStroke(stroke);
    if (this.current) this.drawStroke(this.current);
  }

  undo() {
    if (this.current) {
      this.current = null;
      this.pointerId = null;
    } else {
      this.strokes.pop();
    }
    this.redraw();
    this.emit('change');
  }

  clear() {
    this.strokes = [];
    this.current = null;
    this.pointerId = null;
    this.redraw();
    this.emit('change');
  }

  hasInk() {
    return this.strokes.length > 0 || (this.current && this.current.length > 1);
  }

  toInk() {
    const all = this.current ? [...this.strokes, this.current] : this.strokes;
    return all
      .filter((stroke) => stroke.length >= 2)
      .map((stroke) => {
        const start = stroke[0].t;
        return [
          stroke.map((p) => Math.round(p.x)),
          stroke.map((p) => Math.round(p.y)),
          stroke.map((p) => Math.max(0, p.t - start)),
        ];
      });
  }
}
