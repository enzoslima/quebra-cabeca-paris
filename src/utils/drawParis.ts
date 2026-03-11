/**
 * Draws a complete Paris scene on an offscreen canvas.
 * Returns the canvas element for use as puzzle image source.
 */
export function buildParis(W: number, H: number): HTMLCanvasElement {
  const oc = document.createElement('canvas');
  oc.width = W;
  oc.height = H;
  const c = oc.getContext('2d')!;

  // ── SKY ──
  const sky = c.createLinearGradient(0, 0, 0, H * 0.55);
  sky.addColorStop(0, '#4AABDF');
  sky.addColorStop(0.4, '#6EC6F0');
  sky.addColorStop(1, '#B8E4F8');
  c.fillStyle = sky;
  c.fillRect(0, 0, W, H * 0.60);

  // ── CLOUDS ──
  function cloud(cx: number, cy: number, scale: number) {
    c.fillStyle = 'rgba(255,255,255,0.92)';
    (
      [
        [0, 0, 50, 28],
        [35, -12, 40, 24],
        [-30, -8, 36, 20],
        [20, 14, 30, 18],
        [-15, 14, 28, 17],
      ] as [number, number, number, number][]
    ).forEach(([x, y, rw, rh]) => {
      c.beginPath();
      c.ellipse(cx + x * scale, cy + y * scale, rw * scale, rh * scale, 0, 0, Math.PI * 2);
      c.fill();
    });
  }
  cloud(W * 0.18, H * 0.1, W * 0.0022);
  cloud(W * 0.45, H * 0.07, W * 0.0018);
  cloud(W * 0.72, H * 0.09, W * 0.002);
  cloud(W * 0.6, H * 0.17, W * 0.0014);
  cloud(W * 0.3, H * 0.15, W * 0.0012);
  cloud(W * 0.85, H * 0.14, W * 0.0013);

  // ── BIRDS ──
  (
    [
      [W * 0.48, H * 0.05],
      [W * 0.55, H * 0.06],
      [W * 0.62, H * 0.08],
      [W * 0.76, H * 0.1],
      [W * 0.7, H * 0.12],
    ] as [number, number][]
  ).forEach(([bx, by]) => {
    c.strokeStyle = '#555';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(bx - 6, by);
    c.quadraticCurveTo(bx - 3, by - 4, bx, by);
    c.moveTo(bx, by);
    c.quadraticCurveTo(bx + 3, by - 4, bx + 6, by);
    c.stroke();
  });

  // ── BACKGROUND BUILDINGS ──
  c.fillStyle = '#C8B89A';
  c.fillRect(W * 0.3, H * 0.38, W * 0.4, H * 0.2);
  c.fillStyle = '#B8A88A';
  c.fillRect(W * 0.32, H * 0.35, W * 0.1, H * 0.23);
  c.fillRect(W * 0.55, H * 0.36, W * 0.12, H * 0.22);

  // ── EIFFEL TOWER ──
  const tx = W * 0.5;
  const tb = H * 0.56;
  const tt = H * 0.04;

  c.fillStyle = '#8B5E3C';
  // Base (legs)
  c.beginPath();
  c.moveTo(tx - W * 0.14, tb);
  c.lineTo(tx - W * 0.05, tb - H * 0.22);
  c.lineTo(tx, tb - H * 0.22);
  c.lineTo(tx + W * 0.05, tb - H * 0.22);
  c.lineTo(tx + W * 0.14, tb);
  c.closePath();
  c.fill();

  // Arch
  c.fillStyle = '#9B6E4C';
  c.beginPath();
  c.moveTo(tx - W * 0.14, tb);
  c.quadraticCurveTo(tx, tb - H * 0.07, tx + W * 0.14, tb);
  c.lineTo(tx + W * 0.12, tb);
  c.quadraticCurveTo(tx, tb - H * 0.05, tx - W * 0.12, tb);
  c.closePath();
  c.fill();

  // Lower body
  c.fillStyle = '#8B5E3C';
  c.beginPath();
  c.moveTo(tx - W * 0.05, tb - H * 0.22);
  c.lineTo(tx - W * 0.035, tb - H * 0.38);
  c.lineTo(tx + W * 0.035, tb - H * 0.38);
  c.lineTo(tx + W * 0.05, tb - H * 0.22);
  c.closePath();
  c.fill();

  // First floor platform
  c.fillStyle = '#7A5030';
  c.fillRect(tx - W * 0.06, tb - H * 0.24, W * 0.12, H * 0.025);

  // Upper body
  c.beginPath();
  c.moveTo(tx - W * 0.035, tb - H * 0.38);
  c.lineTo(tx - W * 0.018, tb - H * 0.52);
  c.lineTo(tx + W * 0.018, tb - H * 0.52);
  c.lineTo(tx + W * 0.035, tb - H * 0.38);
  c.closePath();
  c.fill();

  // Second floor platform
  c.fillStyle = '#7A5030';
  c.fillRect(tx - W * 0.04, tb - H * 0.395, W * 0.08, H * 0.02);

  // Top
  c.beginPath();
  c.moveTo(tx - W * 0.018, tb - H * 0.52);
  c.lineTo(tx - W * 0.006, tb - H * 0.62);
  c.lineTo(tx + W * 0.006, tb - H * 0.62);
  c.lineTo(tx + W * 0.018, tb - H * 0.52);
  c.closePath();
  c.fill();

  // Antenna
  c.strokeStyle = '#6B4020';
  c.lineWidth = W * 0.006;
  c.beginPath();
  c.moveTo(tx, tb - H * 0.62);
  c.lineTo(tx, tt);
  c.stroke();

  // Lattice lines
  c.strokeStyle = 'rgba(100,60,20,0.5)';
  c.lineWidth = 1;
  for (let i = 1; i < 6; i++) {
    const ty = tb - H * 0.22 * (i / 6);
    const ww = W * 0.14 * (1 - i / 6) + W * 0.05 * (i / 6);
    c.beginPath();
    c.moveTo(tx - ww, ty);
    c.lineTo(tx + ww, ty);
    c.stroke();
  }

  // ── RIVER SEINE ──
  const riverTop = H * 0.54;
  const riverBot = H * 0.72;
  const river = c.createLinearGradient(0, riverTop, 0, riverBot);
  river.addColorStop(0, '#5BACD4');
  river.addColorStop(0.5, '#4A9EC8');
  river.addColorStop(1, '#3A8EB8');
  c.fillStyle = river;
  c.beginPath();
  c.moveTo(0, riverTop);
  c.quadraticCurveTo(W * 0.25, riverTop - H * 0.02, W * 0.5, riverTop + H * 0.01);
  c.quadraticCurveTo(W * 0.75, riverTop + H * 0.03, W, riverTop);
  c.lineTo(W, riverBot);
  c.lineTo(0, riverBot);
  c.closePath();
  c.fill();

  // Water reflections
  c.fillStyle = 'rgba(255,255,255,0.12)';
  for (let i = 0; i < 8; i++) {
    c.fillRect(W * 0.1 + i * (W * 0.1), riverTop + H * 0.02, W * 0.06, H * 0.008);
  }

  // Tower reflection
  const rg = c.createLinearGradient(tx - W * 0.04, riverTop, tx + W * 0.04, riverTop + H * 0.1);
  rg.addColorStop(0, 'rgba(139,94,60,0.3)');
  rg.addColorStop(1, 'rgba(139,94,60,0)');
  c.fillStyle = rg;
  c.fillRect(tx - W * 0.04, riverTop, W * 0.08, H * 0.12);

  // ── BRIDGE ──
  const bridgeY = riverTop + H * 0.05;
  c.fillStyle = '#C8B090';
  c.fillRect(W * 0.25, bridgeY, W * 0.5, H * 0.025);
  c.fillStyle = '#B8A080';
  for (let i = 0; i < 3; i++) {
    c.beginPath();
    c.ellipse(W * (0.33 + i * 0.17), bridgeY + H * 0.025, W * 0.07, H * 0.02, 0, Math.PI, 0);
    c.fill();
  }
  c.fillStyle = '#A89070';
  c.fillRect(W * 0.25, bridgeY - H * 0.012, W * 0.5, H * 0.012);

  // ── BOAT ──
  const boatX = W * 0.48;
  const boatY = riverTop + H * 0.06;
  c.fillStyle = '#8B5E3C';
  c.beginPath();
  c.ellipse(boatX, boatY + H * 0.018, W * 0.06, H * 0.015, 0, 0, Math.PI);
  c.fill();
  c.fillStyle = '#A07040';
  c.fillRect(boatX - W * 0.05, boatY + H * 0.003, W * 0.1, H * 0.016);
  c.strokeStyle = '#6B4020';
  c.lineWidth = 2;
  c.beginPath();
  c.moveTo(boatX + W * 0.01, boatY + H * 0.003);
  c.lineTo(boatX + W * 0.01, boatY - H * 0.03);
  c.stroke();
  c.fillStyle = '#F5C5A3';
  c.beginPath();
  c.arc(boatX - W * 0.015, boatY + H * 0.006, W * 0.008, 0, Math.PI * 2);
  c.fill();
  c.beginPath();
  c.arc(boatX + W * 0.012, boatY + H * 0.006, W * 0.008, 0, Math.PI * 2);
  c.fill();

  // ── BACKGROUND TREES ──
  function tree(x: number, y: number, r: number, h: number) {
    c.fillStyle = '#5C3A1A';
    c.fillRect(x - W * 0.008, y, W * 0.016, h * 0.3);
    const tg = c.createRadialGradient(x, y - r * 0.2, r * 0.1, x, y, r);
    tg.addColorStop(0, '#6EC44A');
    tg.addColorStop(0.6, '#4EA830');
    tg.addColorStop(1, '#3A8A20');
    c.fillStyle = tg;
    c.beginPath();
    c.ellipse(x, y, r, r * 0.8, 0, 0, Math.PI * 2);
    c.fill();
  }
  for (let i = 0; i < 10; i++) {
    tree(W * (0.1 + i * 0.09), H * 0.52, W * 0.04, H * 0.06);
  }
  tree(W * 0.08, H * 0.42, W * 0.07, H * 0.1);
  tree(W * 0.16, H * 0.44, W * 0.05, H * 0.08);
  tree(W * 0.88, H * 0.42, W * 0.07, H * 0.1);
  tree(W * 0.8, H * 0.44, W * 0.05, H * 0.08);

  // ── FOREGROUND TREES ──
  const treeL = c.createRadialGradient(W * 0.02, H * 0.12, W * 0.01, W * 0.02, H * 0.08, W * 0.2);
  treeL.addColorStop(0, '#7AD450');
  treeL.addColorStop(0.5, '#55B030');
  treeL.addColorStop(1, '#3A8820');
  c.fillStyle = treeL;
  c.beginPath();
  c.ellipse(W * 0.02, H * 0.08, W * 0.2, H * 0.18, 0.3, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#4A7A20';
  c.fillRect(0, H * 0.08, W * 0.03, H * 0.28);

  const treeR = c.createRadialGradient(W * 0.98, H * 0.12, W * 0.01, W * 0.98, H * 0.08, W * 0.2);
  treeR.addColorStop(0, '#7AD450');
  treeR.addColorStop(0.5, '#55B030');
  treeR.addColorStop(1, '#3A8820');
  c.fillStyle = treeR;
  c.beginPath();
  c.ellipse(W * 0.98, H * 0.08, W * 0.2, H * 0.18, -0.3, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = '#4A7A20';
  c.fillRect(W * 0.97, H * 0.08, W * 0.03, H * 0.28);

  // ── COBBLESTONE SIDEWALK ──
  const pavement = c.createLinearGradient(0, H * 0.7, 0, H);
  pavement.addColorStop(0, '#D4A870');
  pavement.addColorStop(0.5, '#C49860');
  pavement.addColorStop(1, '#A07840');
  c.fillStyle = pavement;
  c.beginPath();
  c.moveTo(0, H * 0.7);
  c.lineTo(W * 0.55, H * 0.7);
  c.lineTo(W * 0.35, H);
  c.lineTo(0, H);
  c.closePath();
  c.fill();

  c.strokeStyle = 'rgba(0,0,0,0.12)';
  c.lineWidth = 1;
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 10; col++) {
      const bx = col * W * 0.065 + (row % 2) * W * 0.033 - W * 0.05;
      const by = H * 0.7 + row * H * 0.033;
      c.beginPath();
      c.ellipse(bx + W * 0.03, by + H * 0.015, W * 0.028, H * 0.013, 0, 0, Math.PI * 2);
      c.stroke();
      c.fillStyle = `rgba(${180 + ((row + col) % 3) * 8},${140 + ((row + col) % 4) * 5},100,0.4)`;
      c.fill();
    }
  }

  // ── RIVER WALL ──
  const wallGrad = c.createLinearGradient(0, H * 0.6, 0, H * 0.72);
  wallGrad.addColorStop(0, '#B8A890');
  wallGrad.addColorStop(1, '#987860');
  c.fillStyle = wallGrad;
  c.beginPath();
  c.moveTo(W * 0.4, H * 0.6);
  c.lineTo(W, H * 0.64);
  c.lineTo(W, H * 0.72);
  c.lineTo(W * 0.4, H * 0.72);
  c.closePath();
  c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.2)';
  c.lineWidth = 1;
  for (let i = 0; i < 12; i++) {
    c.beginPath();
    c.rect(W * (0.42 + i * 0.05), H * 0.61, W * 0.04, H * 0.035);
    c.stroke();
    c.beginPath();
    c.rect(W * (0.44 + i * 0.05), H * 0.645, W * 0.04, H * 0.035);
    c.stroke();
  }

  // ── FLOWERS ON WALL ──
  const flowerColors = ['#FF6B6B', '#FFD700', '#FF9ECD', '#FF8C00', '#7BC8F6', '#FF6ECC'];
  for (let i = 0; i < 20; i++) {
    const fx = W * (0.42 + i * 0.029);
    const fy = H * 0.6 - H * 0.025 + (i % 3) * H * 0.005;
    c.fillStyle = '#3A8A20';
    c.fillRect(fx, fy, 2, H * 0.03);
    c.fillStyle = flowerColors[i % flowerColors.length];
    c.beginPath();
    c.arc(fx + 1, fy - H * 0.01, W * 0.012, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#FFD700';
    c.beginPath();
    c.arc(fx + 1, fy - H * 0.01, W * 0.005, 0, Math.PI * 2);
    c.fill();
  }

  // Flower pots on wall
  for (let i = 0; i < 5; i++) {
    const vx = W * (0.5 + i * 0.105);
    const vy = H * 0.62;
    c.fillStyle = '#8B4A20';
    c.fillRect(vx - W * 0.018, vy, W * 0.036, H * 0.025);
    c.fillStyle = '#A05A30';
    c.fillRect(vx - W * 0.02, vy + H * 0.018, W * 0.04, H * 0.008);
    for (let j = 0; j < 4; j++) {
      c.fillStyle = flowerColors[(i + j) % flowerColors.length];
      c.beginPath();
      c.arc(vx + (j - 1.5) * W * 0.008, vy - H * 0.018 + (j % 2) * H * 0.008, W * 0.01, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#3A8A20';
    c.fillRect(vx - 1, vy - H * 0.025, 2, H * 0.025);
  }

  // ── LEFT BUILDING (CAFÉ) ──
  const bldL = c.createLinearGradient(0, 0, W * 0.28, 0);
  bldL.addColorStop(0, '#D4C4A0');
  bldL.addColorStop(1, '#C4B490');
  c.fillStyle = bldL;
  c.fillRect(0, H * 0.1, W * 0.32, H * 0.75);

  // Left roof
  c.fillStyle = '#2A3A5A';
  c.beginPath();
  c.moveTo(0, H * 0.1);
  c.lineTo(W * 0.32, H * 0.1);
  c.lineTo(W * 0.32, H * 0.06);
  c.lineTo(W * 0.25, H * 0.04);
  c.lineTo(W * 0.1, H * 0.04);
  c.lineTo(0, H * 0.06);
  c.closePath();
  c.fill();

  // Chimneys
  (
    [
      [W * 0.05, H * 0.04],
      [W * 0.12, H * 0.03],
      [W * 0.2, H * 0.04],
    ] as [number, number][]
  ).forEach(([cx, cy]) => {
    c.fillStyle = '#3A4A6A';
    c.fillRect(cx, cy - H * 0.04, W * 0.025, H * 0.05);
    c.fillStyle = '#2A3A5A';
    c.fillRect(cx - W * 0.005, cy - H * 0.045, W * 0.035, H * 0.012);
  });

  // Left building windows
  (
    [
      [0.04, 0.13], [0.13, 0.13], [0.21, 0.13],
      [0.04, 0.22], [0.13, 0.22], [0.21, 0.22],
      [0.04, 0.31], [0.13, 0.31], [0.21, 0.31],
    ] as [number, number][]
  ).forEach(([wx, wy]) => {
    c.fillStyle = '#1A2A4A';
    c.fillRect(W * wx, H * wy, W * 0.07, H * 0.07);
    c.fillStyle = 'rgba(255,210,120,0.3)';
    c.fillRect(W * wx + 2, H * wy + 2, W * 0.07 - 4, H * 0.07 - 4);
    c.fillStyle = '#1A2A4A';
    c.strokeStyle = '#3A4A6A';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(W * (wx + 0.035), H * wy);
    c.lineTo(W * (wx + 0.035), H * (wy + 0.07));
    c.moveTo(W * wx, H * (wy + 0.035));
    c.lineTo(W * (wx + 0.07), H * (wy + 0.035));
    c.stroke();
  });

  // Balcony
  c.fillStyle = '#8A7050';
  c.fillRect(W * 0.02, H * 0.255, W * 0.26, H * 0.01);
  c.strokeStyle = '#6A5040';
  c.lineWidth = 1.5;
  for (let i = 0; i < 14; i++) {
    c.beginPath();
    c.moveTo(W * (0.025 + i * 0.018), H * 0.255);
    c.lineTo(W * (0.025 + i * 0.018), H * 0.28);
    c.stroke();
  }

  // ── LEFT CAFÉ AWNING ──
  c.fillStyle = '#CC3333';
  c.beginPath();
  c.moveTo(W * 0.02, H * 0.49);
  c.lineTo(W * 0.28, H * 0.49);
  c.lineTo(W * 0.3, H * 0.54);
  c.lineTo(0, H * 0.54);
  c.closePath();
  c.fill();
  for (let i = 0; i < 6; i++) {
    c.fillStyle = 'rgba(255,255,255,0.5)';
    const x1 = W * (0.02 + i * 0.044);
    c.beginPath();
    c.moveTo(x1, H * 0.49);
    c.lineTo(x1 + W * 0.022, H * 0.49);
    c.lineTo(x1 + W * 0.027, H * 0.54);
    c.lineTo(x1 + W * 0.005, H * 0.54);
    c.closePath();
    c.fill();
  }
  for (let i = 0; i < 12; i++) {
    c.fillStyle = i % 2 === 0 ? '#CC3333' : '#FFFFFF';
    c.beginPath();
    c.arc(W * (0.014 + i * 0.022), H * 0.543, W * 0.01, 0, Math.PI);
    c.fill();
  }

  // Café interior light
  c.fillStyle = 'rgba(255,180,60,0.25)';
  c.fillRect(0, H * 0.49, W * 0.28, H * 0.16);

  // Café windows
  c.fillStyle = 'rgba(255,200,100,0.15)';
  c.fillRect(W * 0.02, H * 0.54, W * 0.1, H * 0.15);
  c.fillRect(W * 0.14, H * 0.54, W * 0.12, H * 0.15);
  c.strokeStyle = '#8B6040';
  c.lineWidth = 3;
  c.strokeRect(W * 0.02, H * 0.54, W * 0.1, H * 0.15);
  c.strokeRect(W * 0.14, H * 0.54, W * 0.12, H * 0.15);

  // ── TABLE AND CHAIRS ──
  c.fillStyle = '#8B4A2A';
  c.fillRect(W * 0.065, H * 0.75, W * 0.09, H * 0.008);
  c.fillRect(W * 0.095, H * 0.758, W * 0.008, H * 0.05);
  c.fillRect(W * 0.07, H * 0.81, W * 0.065, H * 0.006);
  c.fillStyle = '#EE4444';
  c.fillRect(W * 0.06, H * 0.742, W * 0.1, H * 0.012);
  c.fillStyle = '#FFFFFF';
  c.fillRect(W * 0.068, H * 0.744, W * 0.084, H * 0.008);

  (
    [
      [W * 0.038, H * 0.762],
      [W * 0.155, H * 0.762],
    ] as [number, number][]
  ).forEach(([cx, cy]) => {
    c.fillStyle = '#CC3333';
    c.fillRect(cx, cy, W * 0.04, H * 0.045);
    c.fillStyle = '#AA2222';
    c.fillRect(cx, cy + H * 0.045, W * 0.012, H * 0.03);
    c.fillRect(cx + W * 0.028, cy + H * 0.045, W * 0.012, H * 0.03);
    c.fillStyle = '#CC3333';
    c.fillRect(cx, cy - H * 0.03, W * 0.04, H * 0.032);
  });

  // ── LAMP POSTS ──
  function lampPost(x: number, y: number, scale: number) {
    const s = scale;
    const pg = c.createLinearGradient(x - 8 * s, 0, x + 8 * s, 0);
    pg.addColorStop(0, '#2A2A2A');
    pg.addColorStop(0.4, '#4A4A4A');
    pg.addColorStop(1, '#2A2A2A');
    c.fillStyle = pg;
    c.fillRect(x - 7 * s, y, 14 * s, H * 0.5);
    c.fillStyle = '#1A1A1A';
    c.fillRect(x - 14 * s, y + H * 0.48, 28 * s, H * 0.025);
    c.fillRect(x - 20 * s, y + H * 0.5, 40 * s, H * 0.015);
    c.fillStyle = '#2A2A2A';
    c.fillRect(x - 5 * s, y - H * 0.02, 45 * s, 8 * s);
    c.fillRect(x + 38 * s, y - H * 0.08, 8 * s, H * 0.06);
    c.fillStyle = '#AA8844';
    c.beginPath();
    c.arc(x + 42 * s, y - H * 0.1, 18 * s, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,220,120,0.9)';
    c.beginPath();
    c.arc(x + 42 * s, y - H * 0.1, 13 * s, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = 'rgba(255,220,80,0.12)';
    c.beginPath();
    c.arc(x + 42 * s, y - H * 0.1, 38 * s, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#1A1A1A';
    c.beginPath();
    c.ellipse(x + 42 * s, y - H * 0.12, 20 * s, 8 * s, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = '#333';
    c.lineWidth = 2 * s;
    c.beginPath();
    c.arc(x + 42 * s, y - H * 0.1, 16 * s, 0, Math.PI * 2);
    c.stroke();
  }
  lampPost(W * 0.08, H * 0.35, W * 0.0008);
  lampPost(W * 0.62, H * 0.53, W * 0.00055);

  // ── RIGHT BUILDING ──
  const bldR = c.createLinearGradient(W * 0.7, 0, W, 0);
  bldR.addColorStop(0, '#C4B490');
  bldR.addColorStop(1, '#D4C4A0');
  c.fillStyle = bldR;
  c.fillRect(W * 0.68, H * 0.12, W * 0.32, H * 0.73);

  c.fillStyle = '#2A3A5A';
  c.beginPath();
  c.moveTo(W * 0.68, H * 0.12);
  c.lineTo(W, H * 0.12);
  c.lineTo(W, H * 0.06);
  c.lineTo(W * 0.9, H * 0.04);
  c.lineTo(W * 0.75, H * 0.04);
  c.lineTo(W * 0.68, H * 0.06);
  c.closePath();
  c.fill();

  (
    [
      [W * 0.74, H * 0.04],
      [W * 0.82, H * 0.03],
      [W * 0.91, H * 0.04],
    ] as [number, number][]
  ).forEach(([cx, cy]) => {
    c.fillStyle = '#3A4A6A';
    c.fillRect(cx, cy - H * 0.04, W * 0.025, H * 0.05);
    c.fillStyle = '#2A3A5A';
    c.fillRect(cx - W * 0.005, cy - H * 0.045, W * 0.035, H * 0.012);
  });

  (
    [
      [0.71, 0.15], [0.8, 0.15], [0.88, 0.15],
      [0.71, 0.24], [0.8, 0.24], [0.88, 0.24],
      [0.71, 0.33], [0.8, 0.33], [0.88, 0.33],
    ] as [number, number][]
  ).forEach(([wx, wy]) => {
    c.fillStyle = '#1A2A4A';
    c.fillRect(W * wx, H * wy, W * 0.07, H * 0.07);
    c.fillStyle = 'rgba(255,210,120,0.25)';
    c.fillRect(W * wx + 2, H * wy + 2, W * 0.07 - 4, H * 0.07 - 4);
    c.strokeStyle = '#3A4A6A';
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(W * (wx + 0.035), H * wy);
    c.lineTo(W * (wx + 0.035), H * (wy + 0.07));
    c.moveTo(W * wx, H * (wy + 0.035));
    c.lineTo(W * (wx + 0.07), H * (wy + 0.035));
    c.stroke();
  });

  c.fillStyle = '#8A7050';
  c.fillRect(W * 0.7, H * 0.265, W * 0.26, H * 0.01);
  c.strokeStyle = '#6A5040';
  c.lineWidth = 1.5;
  for (let i = 0; i < 14; i++) {
    c.beginPath();
    c.moveTo(W * (0.705 + i * 0.018), H * 0.265);
    c.lineTo(W * (0.705 + i * 0.018), H * 0.29);
    c.stroke();
  }

  // Right awning (yellow-orange)
  c.fillStyle = '#DD9922';
  c.beginPath();
  c.moveTo(W * 0.7, H * 0.49);
  c.lineTo(W * 0.98, H * 0.49);
  c.lineTo(W, H * 0.54);
  c.lineTo(W * 0.68, H * 0.54);
  c.closePath();
  c.fill();
  for (let i = 0; i < 6; i++) {
    c.fillStyle = 'rgba(255,255,255,0.4)';
    const x1 = W * (0.7 + i * 0.05);
    c.beginPath();
    c.moveTo(x1, H * 0.49);
    c.lineTo(x1 + W * 0.025, H * 0.49);
    c.lineTo(x1 + W * 0.03, H * 0.54);
    c.lineTo(x1 + W * 0.005, H * 0.54);
    c.closePath();
    c.fill();
  }
  for (let i = 0; i < 12; i++) {
    c.fillStyle = i % 2 === 0 ? '#DD9922' : '#FFFFFF';
    c.beginPath();
    c.arc(W * (0.705 + i * 0.025), H * 0.543, W * 0.01, 0, Math.PI);
    c.fill();
  }

  c.fillStyle = 'rgba(255,180,60,0.18)';
  c.fillRect(W * 0.72, H * 0.49, W * 0.26, H * 0.16);
  c.fillStyle = 'rgba(255,200,100,0.15)';
  c.fillRect(W * 0.72, H * 0.54, W * 0.1, H * 0.14);
  c.fillRect(W * 0.84, H * 0.54, W * 0.12, H * 0.14);
  c.strokeStyle = '#8B6040';
  c.lineWidth = 3;
  c.strokeRect(W * 0.72, H * 0.54, W * 0.1, H * 0.14);
  c.strokeRect(W * 0.84, H * 0.54, W * 0.12, H * 0.14);

  // ── SIDEWALK FLOWER POTS ──
  (
    [
      [W * 0.02, H * 0.7],
      [W * 0.1, H * 0.73],
      [W * 0.19, H * 0.69],
    ] as [number, number][]
  ).forEach(([vx, vy]) => {
    c.fillStyle = '#AA5522';
    c.beginPath();
    c.ellipse(vx, vy + H * 0.04, W * 0.035, H * 0.025, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = '#883311';
    c.fillRect(vx - W * 0.03, vy + H * 0.03, W * 0.06, H * 0.02);
    for (let j = 0; j < 6; j++) {
      c.fillStyle = ['#FF6B6B', '#FF9ECD', '#FFD700', '#FF8C00', '#CC44CC'][j % 5];
      c.beginPath();
      c.arc(vx + (j - 2.5) * W * 0.012, vy + (j % 2) * H * 0.018, W * 0.011, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#2D8010';
    c.fillRect(vx - 1, vy, 2, H * 0.035);
  });

  // ── HOT AIR BALLOONS ──
  function balloon(bx: number, by: number, c1: string, c2: string, c3: string, c4: string, scale: number) {
    const s = scale;
    c.fillStyle = '#8B5E3C';
    c.fillRect(bx - 12 * s, by + 55 * s, 24 * s, 12 * s);
    c.strokeStyle = '#6B4020';
    c.lineWidth = 1.5 * s;
    (
      [
        [-10, -8],
        [10, -8],
        [-10, 0],
        [10, 0],
      ] as [number, number][]
    ).forEach(([rx]) => {
      c.beginPath();
      c.moveTo(bx + rx * s, by + 55 * s);
      c.lineTo(bx + rx * 0.3 * s, by + 42 * s);
      c.stroke();
    });
    const ballGrad = c.createRadialGradient(bx - 8 * s, by + 10 * s, 5 * s, bx, by + 25 * s, 40 * s);
    ballGrad.addColorStop(0, c1);
    ballGrad.addColorStop(0.4, c2);
    ballGrad.addColorStop(0.7, c3);
    ballGrad.addColorStop(1, c4);
    c.fillStyle = ballGrad;
    c.beginPath();
    c.ellipse(bx, by + 25 * s, 38 * s, 42 * s, 0, 0, Math.PI * 2);
    c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.15)';
    c.lineWidth = 2 * s;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      c.beginPath();
      c.moveTo(bx, by + 25 * s);
      c.lineTo(bx + Math.cos(angle) * 38 * s, by + 25 * s + Math.sin(angle) * 42 * s);
      c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,0.25)';
    c.beginPath();
    c.ellipse(bx - 12 * s, by + 14 * s, 12 * s, 16 * s, -0.5, 0, Math.PI * 2);
    c.fill();
  }

  balloon(W * 0.24, H * 0.2, '#EE44AA', '#CC33CC', '#FFD700', '#FF8800', W * 0.0012);
  balloon(W * 0.31, H * 0.27, '#88AAEE', '#6688CC', '#CC4444', '#882222', W * 0.00075);
  balloon(W * 0.68, H * 0.16, '#FFD700', '#FF8800', '#FF4444', '#CC2222', W * 0.0013);
  balloon(W * 0.8, H * 0.22, '#44CCAA', '#22AA88', '#FFD700', '#CC8800', W * 0.001);

  // ── GOLDEN SUNSET LIGHT ──
  const sunset = c.createRadialGradient(W * 0.8, H * 0.6, 0, W * 0.8, H * 0.6, W * 0.8);
  sunset.addColorStop(0, 'rgba(255,200,80,0.20)');
  sunset.addColorStop(0.5, 'rgba(255,160,40,0.08)');
  sunset.addColorStop(1, 'rgba(255,100,0,0)');
  c.fillStyle = sunset;
  c.fillRect(0, 0, W, H);

  // River light reflection
  c.fillStyle = 'rgba(255,200,80,0.15)';
  c.beginPath();
  c.ellipse(W * 0.5, riverTop + H * 0.04, W * 0.2, H * 0.03, 0, 0, Math.PI * 2);
  c.fill();

  return oc;
}
