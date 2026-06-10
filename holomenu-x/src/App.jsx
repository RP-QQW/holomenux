import { useState, useEffect, useRef, useReducer } from 'react'
import * as THREE from 'three'
import './index.css'

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

:root {
  --gold: #B8963E;
  --gl:   #D4B060;
  --gd:   rgba(184,150,62,.14);
  --bg:   #080806;
  --s1:   #100F0A;
  --s2:   #1C1A12;
  --gb:   rgba(255,255,255,.08);
  --gls:  rgba(255,255,255,.035);
  --w:    #F2EDDE;
  --mt:   rgba(242,237,222,.42);
  --red:  #C45050;
  --grn:  #4A9B6F;
  --fd:   'Playfair Display', Georgia, serif;
  --fb:   'Jost', sans-serif;
  --fm:   'DM Mono', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: var(--bg); overflow-x: hidden; font-family: var(--fb); color: var(--w); }
input, button { font-family: inherit; }
::-webkit-scrollbar { width: 2px; }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

@keyframes fadeUp   { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
@keyframes shimmer  { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
@keyframes floatY   { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-9px); } }
@keyframes marquee  { from { transform:translateX(0); } to { transform:translateX(-50%); } }
@keyframes slideIn  { from { transform:translateX(100%); } to { transform:translateX(0); } }
@keyframes checkDraw { 0% { stroke-dashoffset:60; } 100% { stroke-dashoffset:0; } }
@keyframes pulse    { 0%,100% { box-shadow:0 0 0 0 rgba(184,150,62,.4); } 50% { box-shadow:0 0 0 8px rgba(184,150,62,0); } }

.gold-text {
  background: linear-gradient(135deg, #B8963E 0%, #D4B060 40%, #B8963E 70%, #8A6A20 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3.5s linear infinite;
}

.glass {
  background: var(--gls);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--gb);
  border-radius: 16px;
}

.btn-gold {
  background: linear-gradient(135deg, #B8963E, #D4B060);
  color: #080806;
  border: none;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: .1em;
  text-transform: uppercase;
  border-radius: 100px;
  transition: all .3s cubic-bezier(.16,1,.3,1);
}
.btn-gold:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 10px 35px rgba(184,150,62,.4); }
.btn-gold:active { transform: scale(.98); }

.btn-outline {
  background: transparent;
  color: var(--w);
  border: 1px solid var(--gb);
  cursor: pointer;
  letter-spacing: .07em;
  border-radius: 100px;
  transition: all .25s;
}
.btn-outline:hover { border-color: var(--gold); color: var(--gold); background: var(--gd); }

.dish-card {
  transition: transform .45s cubic-bezier(.16,1,.3,1), box-shadow .45s;
  cursor: pointer;
  border-radius: 18px;
  overflow: hidden;
  background: var(--s1);
  border: 1px solid var(--gb);
  position: relative;
}
.dish-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 40px 90px rgba(0,0,0,.6), 0 0 50px rgba(184,150,62,.07);
}
.dish-card:hover .reveal { opacity:1; transform:translateY(0); }

.reveal {
  opacity: 0;
  transform: translateY(8px);
  transition: all .35s cubic-bezier(.16,1,.3,1);
}

.cat-pill {
  padding: 7px 20px;
  border-radius: 100px;
  border: 1px solid var(--gb);
  background: var(--gls);
  cursor: pointer;
  font-size: .65rem;
  letter-spacing: .08em;
  transition: all .22s;
  color: var(--mt);
  backdrop-filter: blur(8px);
}
.cat-pill:hover, .cat-pill.active { border-color: var(--gold); color: var(--gold); background: var(--gd); }

.qty-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid var(--gb);
  background: var(--gls);
  color: var(--w);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  transition: all .2s;
}
.qty-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gd); }

.mbar { height:3px; border-radius:3px; background:rgba(255,255,255,.07); overflow:hidden; margin-top:5px; }
.mfill { height:100%; border-radius:3px; transition:width 1.4s cubic-bezier(.16,1,.3,1); }

.overlay {
  position: fixed; inset: 0;
  background: rgba(8,8,6,.9);
  backdrop-filter: blur(18px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  animation: fadeIn .25s ease;
}

.modal {
  width: min(700px, 100%);
  max-height: 95vh;
  overflow-y: auto;
  border-radius: 20px;
  background: var(--s1);
  border: 1px solid var(--gb);
  animation: fadeUp .4s cubic-bezier(.16,1,.3,1);
}
.modal::-webkit-scrollbar { width: 2px; }

.cart-drawer {
  position: fixed; top:0; right:0; bottom:0;
  width: min(420px,100vw);
  background: var(--s1);
  border-left: 1px solid var(--gb);
  z-index: 500;
  display: flex; flex-direction: column;
  animation: slideIn .35s cubic-bezier(.16,1,.3,1);
}
.cart-backdrop {
  position: fixed; inset: 0;
  background: rgba(8,8,6,.6);
  z-index: 499;
  animation: fadeIn .25s ease;
}

.nav-item {
  padding: 8px 16px;
  border-radius: 100px;
  cursor: pointer;
  font-size: .65rem;
  letter-spacing: .07em;
  transition: all .2s;
  color: var(--mt);
  border: 1px solid transparent;
  white-space: nowrap;
}
.nav-item:hover { color: var(--w); border-color: var(--gb); background: var(--gls); }
.nav-item.active { color: var(--gold); border-color: rgba(184,150,62,.3); background: var(--gd); }
`

function InjectStyles() {
  useEffect(() => {
    if (document.getElementById('holomenu-styles')) return
    const el = document.createElement('style')
    el.id = 'holomenu-styles'
    el.textContent = STYLES
    document.head.appendChild(el)
    return () => { const s = document.getElementById('holomenu-styles'); if(s) s.remove() }
  }, [])
  return null
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS2D FOOD PAINTING — Professional food illustration per dish
═══════════════════════════════════════════════════════════════════════════ */

const rgba = (r,g,b,a=1) => `rgba(${r},${g},${b},${a})`

function radGrad(ctx, x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x,y,r0,x,y,r1)
  stops.forEach(([t,c]) => g.addColorStop(t,c))
  return g
}

function linGrad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0,y0,x1,y1)
  stops.forEach(([t,c]) => g.addColorStop(t,c))
  return g
}

// Rounded rectangle helper (compatible with all browsers)
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function paintWagyu(ctx, W, H) {
  const cx = W/2, cy = H/2
  // Sauce pool
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx+10, cy+30, 170, 80, 0, 0, Math.PI*2)
  ctx.fillStyle = radGrad(ctx, cx+10, cy+30, 0, 170, [[0,rgba(90,20,5)],[0.6,rgba(50,10,2)],[1,rgba(20,4,1,0)]])
  ctx.fill()
  // Gloss dots on sauce
  [[cx-40,cy+20,8],[cx+60,cy+35,5],[cx-10,cy+45,4]].forEach(([x,y,r]) => {
    ctx.beginPath(); ctx.ellipse(x,y,r,r*0.5,0,0,Math.PI*2)
    ctx.fillStyle = rgba(255,240,200,0.55); ctx.fill()
  })
  // Michelin sauce dots
  for (let i=0; i<5; i++) {
    const a = -0.4 + i*0.18
    ctx.beginPath(); ctx.arc(cx + Math.cos(a)*155, cy+30 + Math.sin(a)*70, 5, 0, Math.PI*2)
    ctx.fillStyle = rgba(40,8,2,0.9); ctx.fill()
  }
  ctx.restore()
  // Celery purée mound
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx+90, cy+5, 68, 38, -0.3, 0, Math.PI*2)
  ctx.fillStyle = radGrad(ctx, cx+90, cy-20, 0, 70, [[0,rgba(225,218,185)],[0.5,rgba(190,178,140)],[1,rgba(150,138,100,0)]])
  ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx+82, cy-12, 20, 10, -0.3, 0, Math.PI*2)
  ctx.fillStyle = rgba(240,232,200,0.7); ctx.fill()
  ctx.restore()
  // Steak body
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cx-100, cy+10)
  ctx.bezierCurveTo(cx-110, cy-60, cx-30, cy-90, cx+40, cy-80)
  ctx.bezierCurveTo(cx+120, cy-65, cx+130, cy-10, cx+110, cy+40)
  ctx.bezierCurveTo(cx+80, cy+75, cx-20, cy+80, cx-70, cy+60)
  ctx.bezierCurveTo(cx-110, cy+45, cx-95, cy+20, cx-100, cy+10)
  ctx.fillStyle = radGrad(ctx, cx-20, cy-30, 0, 160, [[0,rgba(155,55,18)],[0.35,rgba(110,32,10)],[0.7,rgba(65,16,5)],[1,rgba(30,6,2)]])
  ctx.fill()
  ctx.clip()
  // Sear marks
  ctx.strokeStyle = rgba(18,4,1,0.85); ctx.lineWidth = 14
  for (let i=0; i<4; i++) {
    ctx.beginPath(); ctx.moveTo(cx-130+i*55, cy-100); ctx.lineTo(cx-80+i*55, cy+90); ctx.stroke()
  }
  // Fat marbling
  ctx.strokeStyle = rgba(230,210,175,0.45); ctx.lineWidth = 3
  [[cx-60,cy-30,cx-20,cy-50,cx+30,cy-20],[cx+20,cy+10,cx+60,cy-10,cx+90,cy+20]].forEach(([x1,y1,cpx,cpy,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(cpx,cpy,x2,y2); ctx.stroke()
  })
  // Top specular
  ctx.fillStyle = radGrad(ctx, cx-40, cy-55, 0, 90, [[0,rgba(255,220,160,0.55)],[0.5,rgba(200,140,60,0.2)],[1,rgba(0,0,0,0)]])
  ctx.fillRect(cx-150, cy-100, 300, 200)
  ctx.restore()
  // Truffle shavings
  [[cx-50,cy-65,28,8,0.3],[cx+15,cy-72,22,7,-0.2],[cx+65,cy-58,24,8,0.5],[cx-20,cy-50,18,6,0.1]].forEach(([x,y,rx,ry,rot]) => {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot)
    ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2)
    ctx.fillStyle = radGrad(ctx, 0,-3, 0, rx, [[0,rgba(28,12,4,0.95)],[1,rgba(10,4,1,0.6)]]); ctx.fill()
    ctx.beginPath(); ctx.ellipse(rx*0.2, ry*-0.3, rx*0.25, ry*0.25, 0, 0, Math.PI*2)
    ctx.fillStyle = rgba(80,40,15,0.3); ctx.fill(); ctx.restore()
  })
  // Herb cluster
  const hx = cx-80, hy = cy-55
  const hCols = [rgba(20,80,15), rgba(30,100,20), rgba(15,65,12), rgba(40,110,25)]
  for (let i=0; i<16; i++) {
    const a = Math.random()*Math.PI*2, r = Math.random()*28
    const lx = hx+Math.cos(a)*r, ly = hy+Math.sin(a)*r
    ctx.save(); ctx.translate(lx,ly); ctx.rotate(a+Math.PI)
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(-4,-8,-4,-16,0,-20); ctx.bezierCurveTo(4,-16,4,-8,0,0)
    ctx.fillStyle = hCols[i%4]; ctx.fill(); ctx.restore()
  }
}

function paintBisque(ctx, W, H) {
  const cx = W/2, cy = H/2
  // Shadow under bowl
  ctx.beginPath(); ctx.ellipse(cx, cy+20, 190, 100, 0, 0, Math.PI*2)
  ctx.fillStyle = radGrad(ctx, cx, cy+20, 80, 190, [[0,rgba(0,0,0,0)],[1,rgba(0,0,0,0.5)]]); ctx.fill()
  // Bisque surface
  ctx.beginPath(); ctx.ellipse(cx, cy+10, 155, 78, 0, 0, Math.PI*2)
  ctx.fillStyle = radGrad(ctx, cx-40, cy-10, 0, 180, [[0,rgba(230,140,60)],[0.4,rgba(195,95,35)],[0.7,rgba(160,65,20)],[1,rgba(100,35,8)]])
  ctx.fill()
  // Reflection pool
  ctx.beginPath(); ctx.ellipse(cx-30, cy-15, 60, 30, -0.2, 0, Math.PI*2)
  ctx.fillStyle = rgba(255,190,100,0.25); ctx.fill()
  // Ripple lines
  ctx.save(); ctx.beginPath(); ctx.ellipse(cx, cy+10, 155, 78, 0, 0, Math.PI*2); ctx.clip()
  ctx.strokeStyle = rgba(220,130,50,0.2); ctx.lineWidth = 1.5
  for (let i=0; i<5; i++) { ctx.beginPath(); ctx.ellipse(cx+10, cy+8, 40+i*22, 18+i*10, 0, 0, Math.PI*2); ctx.stroke() }
  ctx.restore()
  // Cream swirl
  ctx.save(); ctx.strokeStyle = rgba(252,245,232,0.92); ctx.lineWidth = 4; ctx.lineCap = 'round'
  ctx.beginPath(); ctx.moveTo(cx, cy+10)
  for (let i=0; i<60; i++) { const t=i/60, a=t*Math.PI*4, r=t*80; ctx.lineTo(cx+Math.cos(a)*r, cy+10+Math.sin(a)*r*0.5) }
  ctx.stroke(); ctx.restore()
  // Micro herbs
  [[cx,cy-30],[cx-12,cy-15],[cx+12,cy-15],[cx-6,cy-42],[cx+6,cy-42]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x,y,6,0,Math.PI*2)
    ctx.fillStyle = radGrad(ctx,x-2,y-2,0,6,[[0,rgba(60,140,40)],[1,rgba(25,85,15)]]); ctx.fill()
    ctx.beginPath(); ctx.ellipse(x-1,y-2,2,1,0,0,Math.PI*2); ctx.fillStyle = rgba(150,220,100,0.5); ctx.fill()
  })
  // Saffron threads
  ctx.save(); ctx.strokeStyle = rgba(220,150,20,0.9); ctx.lineWidth = 1.5; ctx.lineCap = 'round'
  [[cx+30,cy-10,cx+55,cy-5],[cx-20,cy+5,cx+10,cy-8],[cx+15,cy+15,cx+35,cy+8]].forEach(([x1,y1,x2,y2]) => {
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo((x1+x2)/2+8,(y1+y2)/2-10,x2,y2); ctx.stroke()
  }); ctx.restore()
  // Bowl rim
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx, cy-62, 175, 40, 0, Math.PI*1.1, Math.PI*1.9)
  ctx.strokeStyle = rgba(255,255,255,0.9); ctx.lineWidth = 12; ctx.stroke()
  ctx.restore()
}

function paintTiramisu(ctx, W, H) {
  const cx = W/2, cy = H/2
  // Mascarpone cloud
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cx-110,cy+40); ctx.bezierCurveTo(cx-120,cy-20,cx-80,cy-80,cx-10,cy-85)
  ctx.bezierCurveTo(cx+70,cy-90,cx+120,cy-50,cx+115,cy+10)
  ctx.bezierCurveTo(cx+110,cy+55,cx+60,cy+70,cx-30,cy+65)
  ctx.bezierCurveTo(cx-90,cy+60,cx-105,cy+50,cx-110,cy+40)
  ctx.fillStyle = radGrad(ctx, cx-20, cy-20, 0, 140, [[0,rgba(252,248,238)],[0.4,rgba(235,225,205)],[0.8,rgba(205,190,160)],[1,rgba(170,150,115,0.8)]])
  ctx.fill()
  // Specular
  ctx.beginPath(); ctx.ellipse(cx-35, cy-35, 55, 28, -0.3, 0, Math.PI*2)
  ctx.fillStyle = rgba(255,252,245,0.5); ctx.fill(); ctx.restore()
  // Cocoa dust
  ctx.save(); ctx.globalAlpha = 0.82
  ctx.beginPath()
  ctx.moveTo(cx-105,cy+38); ctx.bezierCurveTo(cx-115,cy-18,cx-75,cy-78,cx-8,cy-83)
  ctx.bezierCurveTo(cx+68,cy-88,cx+118,cy-48,cx+112,cy+8)
  ctx.bezierCurveTo(cx+108,cy+52,cx+58,cy+68,cx-28,cy+63)
  ctx.bezierCurveTo(cx-88,cy+58,cx-102,cy+48,cx-105,cy+38)
  ctx.fillStyle = rgba(28,12,5,0.78); ctx.fill(); ctx.globalAlpha = 1; ctx.restore()
  // Savoiardi shard — using custom roundRect helper
  ctx.save(); ctx.translate(cx+30, cy+10); ctx.rotate(-0.22)
  roundRect(ctx, -65, -14, 130, 28, 8)
  ctx.fillStyle = linGrad(ctx, -60,-15, 60,15, [[0,rgba(185,145,85)],[0.5,rgba(210,175,115)],[1,rgba(165,125,70)]]); ctx.fill()
  ctx.restore()
  // Gold flakes
  [[cx-60,cy-50,12,6,0.4],[cx+50,cy-60,10,5,-0.3],[cx-30,cy-70,14,5,0.8],
   [cx+20,cy-45,9,4,0.1],[cx-80,cy-20,11,5,0.6],[cx+75,cy-30,8,4,-0.5]].forEach(([x,y,w,h,a]) => {
    ctx.save(); ctx.translate(x,y); ctx.rotate(a)
    ctx.beginPath(); ctx.rect(-w/2,-h/2,w,h)
    ctx.fillStyle = rgba(212,175,55); ctx.fill()
    ctx.fillStyle = rgba(255,240,160,0.6); ctx.fillRect(-w/4,-h/2,w/3,h/2)
    ctx.restore()
  })
  // Kahlúa sphere
  ctx.save(); ctx.translate(cx+80, cy-40)
  ctx.beginPath(); ctx.arc(0,0,26,0,Math.PI*2)
  ctx.fillStyle = radGrad(ctx,-6,-8,0,26,[[0,rgba(40,15,5,0.92)],[1,rgba(10,3,1,0.88)]]); ctx.fill()
  ctx.beginPath(); ctx.ellipse(-6,-8,8,5,0,0,Math.PI*2); ctx.fillStyle = rgba(255,220,150,0.5); ctx.fill()
  ctx.restore()
}

function paintMatcha(ctx, W, H) {
  const cx = W/2, cy = H/2 + 20
  // Glass body
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cx-70,cy+100); ctx.lineTo(cx-85,cy-130)
  ctx.lineTo(cx+85,cy-130); ctx.lineTo(cx+70,cy+100); ctx.closePath()
  ctx.fillStyle = linGrad(ctx, cx-90,0, cx+90,0, [[0,rgba(180,220,200,0.12)],[0.15,rgba(200,240,220,0.25)],[0.85,rgba(180,220,200,0.12)],[1,rgba(160,200,180,0.18)]])
  ctx.fill()
  ctx.strokeStyle = rgba(220,250,235,0.4); ctx.lineWidth = 3
  ctx.beginPath(); ctx.moveTo(cx-85,cy-130); ctx.lineTo(cx-70,cy+100); ctx.stroke()
  ctx.restore()
  // Liquid
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(cx-68,cy+98); ctx.lineTo(cx-82,cy-50); ctx.lineTo(cx+82,cy-50); ctx.lineTo(cx+68,cy+98); ctx.closePath()
  ctx.fillStyle = radGrad(ctx, cx, cy+20, 0, 110, [[0,rgba(60,160,100,0.85)],[0.5,rgba(30,120,70,0.8)],[1,rgba(15,80,45,0.75)]]); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx-20, cy-20, 25, 60, 0.1, 0, Math.PI*2)
  ctx.fillStyle = rgba(120,220,160,0.18); ctx.fill(); ctx.restore()
  // Froth
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx, cy-52, 80, 22, 0, 0, Math.PI*2)
  ctx.fillStyle = radGrad(ctx, cx-15, cy-60, 0, 80, [[0,rgba(245,250,240)],[0.5,rgba(210,235,215)],[1,rgba(160,210,175,0.7)]]); ctx.fill()
  ctx.globalAlpha = 0.55
  ctx.beginPath(); ctx.ellipse(cx, cy-52, 70, 18, 0, 0, Math.PI*2)
  ctx.fillStyle = rgba(80,140,60,0.4); ctx.fill(); ctx.globalAlpha = 1; ctx.restore()
  // Froth bubbles
  for (let i=0; i<18; i++) {
    const a = i/18*Math.PI*2, r = Math.random()*55
    ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r*0.95, cy-52+Math.sin(a)*r*0.22, 2+Math.random()*3, 0, Math.PI*2)
    ctx.fillStyle = rgba(230,245,230,0.5+Math.random()*0.3); ctx.fill()
  }
  // Condensation drops
  [[cx-72,cy-40,4,7],[cx-75,cy+10,3,5],[cx-69,cy+50,4,6],[cx+72,cy-20,3,5],[cx+74,cy+30,4,7]].forEach(([x,y,rx,ry]) => {
    ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.fillStyle = rgba(200,235,220,0.35); ctx.fill()
    ctx.beginPath(); ctx.ellipse(x-1,y-2,rx*0.4,ry*0.3,0,0,Math.PI*2); ctx.fillStyle = rgba(255,255,255,0.6); ctx.fill()
  })
  // Glass rim
  ctx.beginPath(); ctx.ellipse(cx, cy-130, 85, 18, 0, 0, Math.PI*2)
  ctx.strokeStyle = rgba(200,240,220,0.5); ctx.lineWidth = 3; ctx.stroke()
}

function paintDuck(ctx, W, H) {
  const cx = W/2, cy = H/2
  // Cherry gastrique
  ctx.beginPath(); ctx.ellipse(cx, cy+25, 165, 75, 0, 0, Math.PI*2)
  ctx.fillStyle = radGrad(ctx, cx, cy+25, 0, 165, [[0,rgba(100,12,20)],[0.5,rgba(70,8,12)],[1,rgba(30,3,5,0)]]); ctx.fill()
  [[cx-50,cy+10,6],[cx+40,cy+30,4]].forEach(([x,y,r]) => {
    ctx.beginPath(); ctx.ellipse(x,y,r,r*0.5,0,0,Math.PI*2); ctx.fillStyle = rgba(200,100,120,0.4); ctx.fill()
  })
  // Fingerling potatoes
  [[cx+50,cy+25,0.3],[cx+80,cy+10,-0.1],[cx+65,cy+45,0.5]].forEach(([x,y,rot]) => {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot)
    ctx.beginPath(); ctx.ellipse(0,0,18,28,0,0,Math.PI*2)
    ctx.fillStyle = radGrad(ctx, 0,-18, 0, 18, [[0,rgba(220,175,60)],[0.4,rgba(185,135,40)],[1,rgba(120,80,20)]]); ctx.fill()
    ctx.beginPath(); ctx.ellipse(3,-12,5,3,0,0,Math.PI*2); ctx.fillStyle = rgba(240,210,130,0.6); ctx.fill()
    ctx.beginPath(); ctx.ellipse(0,0,18,28,0,0,Math.PI*2)
    ctx.strokeStyle = rgba(60,30,5,0.6); ctx.lineWidth = 3; ctx.stroke(); ctx.restore()
  })
  // Duck leg
  ctx.save(); ctx.translate(cx-30, cy-10)
  ctx.beginPath()
  ctx.moveTo(-80,60); ctx.bezierCurveTo(-90,-20,-50,-80,0,-80)
  ctx.bezierCurveTo(60,-80,90,-30,85,30); ctx.bezierCurveTo(75,80,20,90,-20,80)
  ctx.bezierCurveTo(-55,70,-75,55,-80,60)
  ctx.fillStyle = radGrad(ctx, 10,-20, 0, 110, [[0,rgba(180,100,30)],[0.3,rgba(130,65,15)],[0.65,rgba(75,30,5)],[1,rgba(35,10,2)]]); ctx.fill()
  ctx.clip()
  ctx.strokeStyle = rgba(55,20,3,0.5); ctx.lineWidth = 1.5
  for (let i=0; i<25; i++) {
    const tx = (Math.random()-0.5)*120, ty = (Math.random()-0.5)*90
    ctx.beginPath(); ctx.moveTo(tx,ty); ctx.quadraticCurveTo(tx+8,ty-5,tx+15,ty+2); ctx.stroke()
  }
  ctx.fillStyle = radGrad(ctx, -20,-30, 0, 70, [[0,rgba(240,170,80,0.55)],[1,rgba(0,0,0,0)]]); ctx.fillRect(-100,-90,200,180)
  ctx.restore()
  // Watercress
  const wcx = cx-90, wcy = cy-50
  const leafC = [rgba(25,90,18), rgba(35,110,25), rgba(20,75,14)]
  for (let i=0; i<20; i++) {
    const a = Math.random()*Math.PI*2, r = Math.random()*35
    ctx.save(); ctx.translate(wcx+Math.cos(a)*r, wcy+Math.sin(a)*r); ctx.rotate(a)
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(-5,-7,-4,-14,0,-18); ctx.bezierCurveTo(4,-14,5,-7,0,0)
    ctx.fillStyle = leafC[i%3]; ctx.fill(); ctx.restore()
  }
}

function paintCaviar(ctx, W, H) {
  const cx = W/2, cy = H/2
  // Mother-of-pearl spoon
  ctx.save(); ctx.translate(cx, cy)
  ctx.beginPath()
  ctx.moveTo(-140,40); ctx.bezierCurveTo(-160,-20,-80,-60,0,-60)
  ctx.bezierCurveTo(80,-60,120,-20,100,30); ctx.bezierCurveTo(80,70,0,80,-40,70)
  ctx.bezierCurveTo(-100,60,-130,55,-140,40)
  ctx.fillStyle = radGrad(ctx, 0,-20, 0, 120, [[0,rgba(245,242,238)],[0.3,rgba(228,220,210)],[0.7,rgba(200,188,175)],[1,rgba(170,155,140)]]); ctx.fill()
  // Iridescent
  ctx.fillStyle = linGrad(ctx, -140,-10, 100,60, [[0,rgba(200,220,240,0.3)],[0.3,rgba(220,200,240,0.2)],[0.6,rgba(200,240,220,0.25)],[1,rgba(240,220,200,0.2)]]); ctx.fill()
  ctx.restore()
  // Caviar pearls
  const pearls = []
  for (let i=0; i<24; i++) {
    const a = i/24*Math.PI*2, r = 18 + Math.random()*30
    pearls.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r*0.38-5])
  }
  pearls.forEach(([x,y]) => {
    const pr = 8 + Math.random()*4
    ctx.beginPath(); ctx.arc(x,y,pr,0,Math.PI*2)
    ctx.fillStyle = radGrad(ctx, x-pr*0.3,y-pr*0.3, 0, pr, [[0,rgba(40,35,28)],[0.5,rgba(18,15,10)],[1,rgba(5,4,3)]]); ctx.fill()
    ctx.beginPath(); ctx.arc(x-pr*0.3, y-pr*0.35, pr*0.28, 0, Math.PI*2)
    ctx.fillStyle = rgba(255,245,220,0.7); ctx.fill()
  })
  // Blini
  ctx.save(); ctx.translate(cx-110, cy+30)
  ctx.beginPath(); ctx.ellipse(0,0,38,28,-0.1,0,Math.PI*2)
  ctx.fillStyle = radGrad(ctx, 0,-5, 0, 38, [[0,rgba(220,185,110)],[0.6,rgba(185,145,75)],[1,rgba(145,105,50)]]); ctx.fill()
  ctx.restore()
  // Crème fraîche
  ctx.save(); ctx.translate(cx+105, cy+20)
  ctx.beginPath(); ctx.ellipse(0,0,28,18,0.2,0,Math.PI*2)
  ctx.fillStyle = radGrad(ctx, -5,-5, 0, 28, [[0,rgba(252,250,246)],[0.7,rgba(232,225,210)],[1,rgba(210,200,185,0.8)]]); ctx.fill()
  ctx.beginPath(); ctx.ellipse(-5,-4,10,6,0,0,Math.PI*2); ctx.fillStyle = rgba(255,255,255,0.7); ctx.fill()
  ctx.restore()
}

function createFoodTexture(paintType) {
  const S = 512
  const canvas = document.createElement('canvas')
  canvas.width = S; canvas.height = S
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0,0,S,S)
  switch(paintType) {
    case 'bisque':   paintBisque(ctx,S,S);   break
    case 'dessert':  paintTiramisu(ctx,S,S); break
    case 'drink':    paintMatcha(ctx,S,S);   break
    case 'duck':     paintDuck(ctx,S,S);     break
    case 'caviar':   paintCaviar(ctx,S,S);   break
    default:         paintWagyu(ctx,S,S);    break
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.anisotropy = 8
  return tex
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROCEDURAL ENV TEXTURES
═══════════════════════════════════════════════════════════════════════════ */

function noiseHash(n) { return ((Math.sin(n)*43758.5453)%1+1)%1 }
function noise2D(x,y) {
  const ix=Math.floor(x), iy=Math.floor(y), fx=x-ix, fy=y-iy
  const ux=fx*fx*(3-2*fx), uy=fy*fy*(3-2*fy)
  const a=noiseHash(ix+iy*57), b=noiseHash(ix+1+iy*57)
  const c=noiseHash(ix+(iy+1)*57), d=noiseHash(ix+1+(iy+1)*57)
  return a+(b-a)*ux+(c-a)*uy+(d-a+a-b-c+b+c-d)*ux*uy
}
function fbm(x,y,oct=5) {
  let v=0, a=0.5
  for(let i=0;i<oct;i++){v+=a*noise2D(x,y);a*=0.5;x*=2.1;y*=2.1}
  return v
}

function createWoodTexture() {
  const S=512, canvas=document.createElement('canvas')
  canvas.width=canvas.height=S
  const ctx=canvas.getContext('2d'), d=ctx.createImageData(S,S)
  for(let y=0;y<S;y++) for(let x=0;x<S;x++) {
    const fx=x/S, fy=y/S
    const grain=fbm(fx*1.2, fy*32, 4)
    const knot=1-Math.min(1,Math.abs(noise2D(fx*2.5,fy*2.5+1.2)-0.5)*5)
    const v=0.06+grain*0.10+knot*0.06
    const lac=noise2D(fx*10,fy*10)*0.015
    const i=(y*S+x)*4
    d.data[i]=Math.min(255,Math.max(14,Math.round((v*1.8+lac)*255)))
    d.data[i+1]=Math.min(255,Math.max(8,Math.round((v*0.95+lac)*255)))
    d.data[i+2]=Math.min(255,Math.max(3,Math.round((v*0.45+lac)*255)))
    d.data[i+3]=255
  }
  ctx.putImageData(d,0,0)
  const t=new THREE.CanvasTexture(canvas)
  t.wrapS=t.wrapT=THREE.RepeatWrapping; t.repeat.set(4,4); t.anisotropy=8
  return t
}

function createPlateTexture() {
  const S=256, canvas=document.createElement('canvas')
  canvas.width=canvas.height=S
  const ctx=canvas.getContext('2d'), d=ctx.createImageData(S,S)
  for(let y=0;y<S;y++) for(let x=0;x<S;x++) {
    const fx=x/S, fy=y/S
    const m=fbm(fx*18,fy*18,3)*0.035
    const v=Math.min(255,Math.round((0.965+m)*255))
    const i=(y*S+x)*4
    d.data[i]=v; d.data[i+1]=v-2; d.data[i+2]=v-4; d.data[i+3]=255
  }
  ctx.putImageData(d,0,0)
  const t=new THREE.CanvasTexture(canvas); t.anisotropy=4; return t
}

/* ═══════════════════════════════════════════════════════════════════════════
   PARTICLE SYSTEMS
═══════════════════════════════════════════════════════════════════════════ */

class SteamSystem {
  constructor(scene, emitters) {
    const N = 45
    this.N = N; this.ems = emitters
    this.ps = Array.from({length:N}, (_,i) => ({
      x:0,y:0,z:0, vx:0,vy:0,vz:0,
      life:Math.random()*60, max:60+Math.random()*60,
      s:0.04+Math.random()*0.05, em:i%emitters.length
    }))
    this.ps.forEach(p => this._reset(p))
    const geo = new THREE.BufferGeometry()
    this.buf = new Float32Array(N*3)
    geo.setAttribute('position', new THREE.BufferAttribute(this.buf,3))
    this.mat = new THREE.PointsMaterial({
      color:0xCCCCCC, size:0.09, sizeAttenuation:true,
      transparent:true, opacity:0.38, depthWrite:false
    })
    this.mesh = new THREE.Points(geo, this.mat)
    scene.add(this.mesh)
  }
  _reset(p) {
    const e = this.ems[p.em]
    p.x=e.x+(Math.random()-.5)*.2; p.y=e.y; p.z=e.z+(Math.random()-.5)*.2
    p.vx=(Math.random()-.5)*.006; p.vy=.007+Math.random()*.007; p.vz=(Math.random()-.5)*.006
    p.life=0; p.max=60+Math.random()*60; p.s=0.04+Math.random()*0.06
  }
  tick(t) {
    this.ps.forEach((p,i) => {
      p.life++
      if(p.life>p.max){this._reset(p);return}
      p.vx+=Math.sin(t*.8+i*.6)*.0007; p.vz+=Math.cos(t*.65+i*.5)*.0007
      p.x+=p.vx; p.y+=p.vy; p.z+=p.vz
      this.buf[i*3]=p.x; this.buf[i*3+1]=p.y; this.buf[i*3+2]=p.z
    })
    this.mesh.geometry.attributes.position.needsUpdate=true
    this.mat.opacity=0.3+Math.sin(t*.4)*.08
  }
  dispose(scene) {
    scene.remove(this.mesh)
    this.mesh.geometry.dispose(); this.mat.dispose()
  }
}

class SparkleSystem {
  constructor(scene) {
    const N=55, pos=new Float32Array(N*3)
    for(let i=0;i<N;i++){
      const th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI
      const r=0.7+Math.random()*.9
      pos[i*3]=r*Math.sin(ph)*Math.cos(th)
      pos[i*3+1]=Math.abs(r*Math.cos(ph))*.8+.15
      pos[i*3+2]=r*Math.sin(ph)*Math.sin(th)
    }
    const geo=new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3))
    this.mat=new THREE.PointsMaterial({color:0xDDBB50,size:0.03,sizeAttenuation:true,transparent:true,opacity:.8,depthWrite:false})
    this.mesh=new THREE.Points(geo,this.mat)
    scene.add(this.mesh)
  }
  tick(t) { this.mesh.rotation.y+=.01; this.mat.opacity=.55+Math.sin(t*2.5)*.28 }
  dispose(scene) { scene.remove(this.mesh); this.mesh.geometry.dispose(); this.mat.dispose() }
}

class DustMotes {
  constructor(scene) {
    const N=30
    this.ms=Array.from({length:N},()=>({
      x:(Math.random()-.5)*6, y:.5+Math.random()*3.5, z:(Math.random()-.5)*5,
      vx:(Math.random()-.5)*.003, vy:(Math.random()-.5)*.002, vz:(Math.random()-.5)*.003
    }))
    this.buf=new Float32Array(N*3)
    const geo=new THREE.BufferGeometry()
    geo.setAttribute('position',new THREE.BufferAttribute(this.buf,3))
    this.mat=new THREE.PointsMaterial({color:0xFFE8C0,size:.016,sizeAttenuation:true,transparent:true,opacity:.18,depthWrite:false})
    this.mesh=new THREE.Points(geo,this.mat)
    scene.add(this.mesh)
  }
  tick(t) {
    this.ms.forEach((m,i)=>{
      m.x+=m.vx; m.y+=m.vy; m.z+=m.vz
      if(Math.abs(m.x)>4)m.vx*=-1
      if(m.y<.2||m.y>4.5)m.vy*=-1
      if(Math.abs(m.z)>4)m.vz*=-1
      this.buf[i*3]=m.x; this.buf[i*3+1]=m.y; this.buf[i*3+2]=m.z
    })
    this.mesh.geometry.attributes.position.needsUpdate=true
    this.mat.opacity=.12+Math.sin(t*.35)*.06
  }
  dispose(scene) { scene.remove(this.mesh); this.mesh.geometry.dispose(); this.mat.dispose() }
}

/* ═══════════════════════════════════════════════════════════════════════════
   THREE.JS SCENE
═══════════════════════════════════════════════════════════════════════════ */

function buildScene(renderer, dish) {
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x0A0906, .038)

  // Env cube camera
  const cubeRT = new THREE.WebGLCubeRenderTarget(128,{
    format:THREE.RGBFormat, generateMipmaps:true, minFilter:THREE.LinearMipmapLinearFilter
  })
  const cubeCamera = new THREE.CubeCamera(.1,50,cubeRT)
  cubeCamera.position.set(0,.5,0); scene.add(cubeCamera)

  // Table
  const woodTex = createWoodTexture()
  const tableM = new THREE.Mesh(
    new THREE.PlaneGeometry(18,18),
    new THREE.MeshStandardMaterial({map:woodTex, roughness:.52, metalness:.05})
  )
  tableM.rotation.x=-Math.PI/2; tableM.receiveShadow=true; scene.add(tableM)

  // Contact shadow
  const shadowM = new THREE.Mesh(
    new THREE.CircleGeometry(1.7,64),
    new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.45,depthWrite:false})
  )
  shadowM.rotation.x=-Math.PI/2; shadowM.position.y=.001; scene.add(shadowM)

  // Plate (LatheGeometry profile)
  const platePts = [
    new THREE.Vector2(0,.0),    new THREE.Vector2(.24,.0),
    new THREE.Vector2(.26,-.018),new THREE.Vector2(.30,-.020), new THREE.Vector2(.33,-.018),
    new THREE.Vector2(.37,.0),  new THREE.Vector2(.52,.024),   new THREE.Vector2(.74,.048),
    new THREE.Vector2(.98,.064),new THREE.Vector2(1.20,.078),  new THREE.Vector2(1.34,.086),
    new THREE.Vector2(1.40,.092),new THREE.Vector2(1.42,.110), new THREE.Vector2(1.43,.128),
    new THREE.Vector2(1.41,.124)
  ]
  const plate = new THREE.Mesh(
    new THREE.LatheGeometry(platePts,80),
    new THREE.MeshStandardMaterial({map:createPlateTexture(), color:0xF6F3EE, roughness:.10, metalness:.06})
  )
  plate.receiveShadow=true; plate.castShadow=true; scene.add(plate)

  // Plate rim highlight
  const plateRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.425,.014,10,80),
    new THREE.MeshStandardMaterial({color:0xFFFFFF,roughness:.04,metalness:.2})
  )
  plateRim.rotation.x=Math.PI/2; plateRim.position.y=.128; scene.add(plateRim)

  // Food painting on plate
  const foodTex = createFoodTexture(dish.paintType || dish.type)
  const foodPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1,2.1),
    new THREE.MeshStandardMaterial({map:foodTex, transparent:true, roughness:.65, metalness:.04, alphaTest:.02})
  )
  foodPlane.rotation.x=-Math.PI/2; foodPlane.position.y=.076; scene.add(foodPlane)

  // Napkin
  const napkin = new THREE.Mesh(
    new THREE.BoxGeometry(.85,.008,.6),
    new THREE.MeshStandardMaterial({color:0xF8F4EC, roughness:.9, metalness:0})
  )
  napkin.position.set(-2.2,.004,.0); napkin.receiveShadow=true; scene.add(napkin)

  // Cutlery materials
  const bladeMat   = new THREE.MeshStandardMaterial({color:0xDDDDDD,roughness:.04,metalness:.96})
  const handleMat  = new THREE.MeshStandardMaterial({color:0x1A1208,roughness:.65,metalness:.05})
  const bolsterMat = new THREE.MeshStandardMaterial({color:0xCCCCCC,roughness:.06,metalness:.94})

  // Knife
  const knifeGrp = new THREE.Group()
  knifeGrp.add(new THREE.Mesh(new THREE.CylinderGeometry(.023,.023,.52,10), handleMat))
  const kb = new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,.026,10), bolsterMat)
  kb.position.z=.28; knifeGrp.add(kb)
  const blade = new THREE.Mesh(new THREE.BoxGeometry(.014,.005,.44), bladeMat)
  blade.position.z=.52; knifeGrp.add(blade)
  knifeGrp.rotation.x=Math.PI/2; knifeGrp.position.set(1.88,.06,.0); knifeGrp.rotation.z=.04
  scene.add(knifeGrp)

  // Fork
  const forkGrp = new THREE.Group()
  forkGrp.add(new THREE.Mesh(new THREE.CylinderGeometry(.020,.020,.50,10), handleMat))
  const fn = new THREE.Mesh(new THREE.BoxGeometry(.015,.008,.16), bolsterMat)
  fn.position.z=.33; forkGrp.add(fn)
  for(let i=0;i<4;i++){
    const tine = new THREE.Mesh(new THREE.CylinderGeometry(.006,.004,.15,6), bladeMat)
    tine.position.set((i-1.5)*.026,0,.50); forkGrp.add(tine)
  }
  forkGrp.rotation.x=Math.PI/2; forkGrp.position.set(-1.88,.06,.0); forkGrp.rotation.z=-.04
  scene.add(forkGrp)

  // Lighting
  scene.add(new THREE.AmbientLight(0xFFF5E8,.28))
  const keyLight = new THREE.DirectionalLight(0xFFEDD0,2.0)
  keyLight.position.set(1,5.5,2); keyLight.castShadow=true
  keyLight.shadow.mapSize.width=keyLight.shadow.mapSize.height=2048
  keyLight.shadow.camera.left=-5; keyLight.shadow.camera.right=5
  keyLight.shadow.camera.top=5; keyLight.shadow.camera.bottom=-5
  keyLight.shadow.radius=5; keyLight.shadow.bias=-.0004; scene.add(keyLight)
  const fillLight = new THREE.PointLight(0xC8DFFF,.55,14)
  fillLight.position.set(-3.5,2.8,1.5); scene.add(fillLight)
  const rimLight = new THREE.PointLight(0xFFFFFF,.85,12)
  rimLight.position.set(.5,2.5,-3.8); scene.add(rimLight)
  scene.add(new THREE.PointLight(0xFFE8B0,.18,7)) // bounce
  const heroSpot = new THREE.SpotLight(0xFFF8EE,1.6,12,.3,.5,1.5)
  heroSpot.position.set(.8,4.5,2.2); heroSpot.target.position.set(0,.3,0)
  scene.add(heroSpot); scene.add(heroSpot.target)

  // Particles
  const hasSteam = ['steak','bisque','duck'].includes(dish.type)
  const steam = hasSteam ? new SteamSystem(scene,[{x:0,y:.4,z:0},{x:.15,y:.38,z:.1},{x:-.12,y:.36,z:-.08}]) : null
  const sparks = ['dessert','caviar'].includes(dish.type) ? new SparkleSystem(scene) : null
  const dust = new DustMotes(scene)

  // Env update
  function updateEnv() {
    foodPlane.visible = false
    cubeCamera.update(renderer, scene)
    foodPlane.visible = true
    scene.traverse(obj => {
      if(obj.isMesh && obj.material?.metalness > .5) {
        obj.material.envMap = cubeRT.texture
        obj.material.envMapIntensity = .85
        obj.material.needsUpdate = true
      }
    })
  }

  return { scene, steam, sparks, dust, updateEnv, rimLight, heroSpot }
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D VIEWER COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

function Viewer3D({ dish, height = 430 }) {
  const mountRef = useRef(null)
  const rafRef   = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let W = el.clientWidth, H = height

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false, powerPreference:'high-performance' })
    renderer.setSize(W,H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    renderer.physicallyCorrectLights = true
    renderer.setClearColor(0x09080B,1)
    el.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(40, W/H, .05, 60)
    camera.position.set(0,3.0,4.6)
    camera.lookAt(0,.4,0)

    const { scene, steam, sparks, dust, updateEnv, rimLight, heroSpot } = buildScene(renderer, dish)
    setTimeout(updateEnv, 150)

    // Orbit state
    const orb = { th:.22,ph:1.05,r:4.6, tTh:.22,tPh:1.05,tR:4.6, drag:false, lx:0,ly:0, thV:0 }

    const onDown = e => {
      orb.drag=true; orb.thV=0
      orb.lx = e.touches ? e.touches[0].clientX : e.clientX
      orb.ly = e.touches ? e.touches[0].clientY : e.clientY
    }
    const onMove = e => {
      if (!orb.drag) return
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      const dx=cx-orb.lx, dy=cy-orb.ly
      orb.thV=-dx*.011; orb.tTh+=orb.thV
      orb.tPh=Math.max(.25,Math.min(1.50,orb.tPh+dy*.008))
      orb.lx=cx; orb.ly=cy
    }
    const onUp   = () => { orb.drag=false }
    const onWheel = e => {
      e.preventDefault()
      orb.tR = Math.max(2.0, Math.min(9.0, orb.tR + e.deltaY*.004))
    }

    renderer.domElement.addEventListener('mousedown',  onDown)
    renderer.domElement.addEventListener('mousemove',  onMove)
    renderer.domElement.addEventListener('mouseup',    onUp)
    renderer.domElement.addEventListener('mouseleave', onUp)
    renderer.domElement.addEventListener('touchstart', onDown, {passive:true})
    renderer.domElement.addEventListener('touchmove',  onMove, {passive:true})
    renderer.domElement.addEventListener('touchend',   onUp)
    renderer.domElement.addEventListener('wheel',      onWheel, {passive:false})

    let t=0, fr=0
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      t+=.016; fr++

      if (!orb.drag) { orb.tTh+=.005; orb.thV*=.92 }
      else { orb.tTh+=orb.thV*.08; orb.thV*=.86 }

      orb.th+=(orb.tTh-orb.th)*.07
      orb.ph+=(orb.tPh-orb.ph)*.07
      orb.r +=(orb.tR -orb.r )*.07

      const sp=Math.sin(orb.ph), cp=Math.cos(orb.ph)
      const bY=Math.sin(t*.38)*.018, bX=Math.sin(t*.27)*.012
      camera.position.set(
        orb.r*sp*Math.sin(orb.th)+bX,
        orb.r*cp+.4+bY,
        orb.r*sp*Math.cos(orb.th)
      )
      camera.lookAt(0,.35,0)

      rimLight.intensity = .75+Math.sin(t*.7)*.12
      if (heroSpot) heroSpot.intensity = 1.5+Math.sin(t*.43)*.18

      if (steam)  steam.tick(t)
      if (sparks) sparks.tick(t)
      dust.tick(t)

      if (fr%95===0) updateEnv()
      renderer.render(scene, camera)
    }
    loop()

    const ro = new ResizeObserver(() => {
      W = el.clientWidth
      renderer.setSize(W,height)
      camera.aspect = W/height
      camera.updateProjectionMatrix()
    })
    ro.observe(el)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      if (steam)  steam.dispose(scene)
      if (sparks) sparks.dispose(scene)
      dust.dispose(scene)
      renderer.domElement.removeEventListener('mousedown',  onDown)
      renderer.domElement.removeEventListener('mousemove',  onMove)
      renderer.domElement.removeEventListener('mouseup',    onUp)
      renderer.domElement.removeEventListener('mouseleave', onUp)
      renderer.domElement.removeEventListener('touchstart', onDown)
      renderer.domElement.removeEventListener('touchmove',  onMove)
      renderer.domElement.removeEventListener('touchend',   onUp)
      renderer.domElement.removeEventListener('wheel',      onWheel)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [dish.id])

  return (
    <div style={{position:'relative',background:'#09080B',borderRadius:'20px 20px 0 0',overflow:'hidden'}}>
      <div ref={mountRef} style={{width:'100%',height,cursor:'grab',display:'block'}}/>
      {/* DoF vignette */}
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 62% 58% at 50% 54%,transparent 32%,rgba(9,8,11,.58) 100%)',pointerEvents:'none'}}/>
      {/* Bottom gradient */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:90,background:'linear-gradient(to top,rgba(9,8,11,.65),transparent)',pointerEvents:'none'}}/>
      {/* Grain */}
      <div style={{position:'absolute',inset:0,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`,pointerEvents:'none',opacity:.45,borderRadius:'inherit'}}/>
      <div style={{position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',background:'rgba(9,8,11,.7)',border:'1px solid rgba(255,255,255,.08)',borderRadius:100,padding:'5px 16px',fontSize:'.56rem',color:'rgba(242,237,222,.4)',letterSpacing:'.1em',backdropFilter:'blur(8px)',whiteSpace:'nowrap',pointerEvents:'none',fontFamily:'var(--fm)'}}>
        DRAG · SCROLL TO ZOOM · TOUCH READY
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DISH DATA
═══════════════════════════════════════════════════════════════════════════ */

const DISHES = [
  { id:1, name:'Truffle A5 Wagyu Tenderloin', cat:'mains',    price:4800, rating:4.9, tag:"Chef's Signature",
    type:'steak',   paintType:'steak',   accent:'#B8963E',
    calories:620, protein:48, carbs:12, fat:38, allergens:['Gluten','Dairy'], orders:847, prep:'22 min',
    chef:'A5 Wagyu from Kagoshima Prefecture, dry-aged 45 days. Finished with shaved Périgord black truffle, Madeira reduction and celery root purée. Grilled over binchōtan charcoal.',
    ingredients:['A5 Kagoshima Wagyu','Périgord Black Truffle','Madeira Wine','Celery Root','Normandy Butter','Micro Herbs','Fleur de Sel'] },
  { id:2, name:'Champagne Lobster Bisque', cat:'starters', price:1800, rating:4.8, tag:'Most Loved',
    type:'bisque',  paintType:'bisque',  accent:'#8BA8BC',
    calories:340, protein:22, carbs:18, fat:20, allergens:['Shellfish','Dairy'], orders:612, prep:'8 min',
    chef:'Shells of Maine lobster slow-roasted before simmering four hours in a Moët & Chandon reduction. Finished à la minute with crème fraîche, saffron and hand-picked micro herbs.',
    ingredients:['Maine Lobster','Moët & Chandon','Crème Fraîche','Spanish Saffron','Tarragon','Chervil'] },
  { id:3, name:'Deconstructed Tiramisu', cat:'desserts', price:1200, rating:4.9, tag:'Award Winner',
    type:'dessert', paintType:'dessert', accent:'#C9A84C',
    calories:480, protein:8, carbs:62, fat:22, allergens:['Gluten','Dairy','Eggs'], orders:934, prep:'5 min',
    chef:'Mascarpone aerated to a cloud, espresso soil from single-origin Ethiopian beans. Kahlúa gel spheres, Valrhona cocoa, 24K gold leaf and caramelised hazelnut praline dust.',
    ingredients:['Buffalo Mascarpone','Ethiopian Espresso','Kahlúa','Valrhona Cocoa','24K Gold Leaf','Savoiardi','Praline'] },
  { id:4, name:'Ceremonial Matcha Flight', cat:'drinks',   price:980,  rating:4.7, tag:'Trending',
    type:'drink',   paintType:'drink',   accent:'#4A9B6F',
    calories:95, protein:4, carbs:14, fat:3, allergens:['Dairy'], orders:521, prep:'4 min',
    chef:'First-harvest ceremonial-grade Uji matcha, stone-ground daily. Prepared with micro-filtered spring water at 72°C. Crowned with oat milk microfoam and yuzu salt rim.',
    ingredients:['Uji Ceremonial Matcha','Spring Water','Oat Milk Microfoam','Yuzu Salt','Bamboo Whisk','Ice'] },
  { id:5, name:'Smoked Duck Confit', cat:'mains',    price:3200, rating:4.8, tag:'New',
    type:'duck',    paintType:'duck',    accent:'#B8963E',
    calories:540, protein:42, carbs:8, fat:34, allergens:['Gluten'], orders:389, prep:'18 min',
    chef:'Duck leg slow-confited 48 hours at 68°C, then applewood-smoked tableside. Cherry gastrique, Périgord duck fat–roasted fingerlings and wild watercress.',
    ingredients:['Barbary Duck','Applewood','Cherry Gastrique','Fingerling Potato','Watercress','Demi-Glace'] },
  { id:6, name:'Beluga Caviar Selection', cat:'starters', price:5600, rating:5.0, tag:'Ultra Premium',
    type:'caviar',  paintType:'caviar',  accent:'#C9A84C',
    calories:120, protein:18, carbs:4, fat:6, allergens:['Fish'], orders:142, prep:'2 min',
    chef:'30g of Beluga, Oscietra and Sevruga caviar on chilled mother-of-pearl. Hand-made blinis, Devonshire crème fraîche and shaved tonka bean. Paired with iced Krug.',
    ingredients:['Beluga Caviar','Oscietra Caviar','Sevruga Caviar','Blinis','Devonshire Crème Fraîche','Tonka Bean','Krug Champagne'] },
]

const CATS = ['all','starters','mains','desserts','drinks']

/* ═══════════════════════════════════════════════════════════════════════════
   CART REDUCER
═══════════════════════════════════════════════════════════════════════════ */

function cartReducer(state, action) {
  switch(action.type) {
    case 'ADD': {
      const ex = state.find(i => i.dish.id === action.dish.id)
      return ex
        ? state.map(i => i.dish.id === action.dish.id ? {...i, qty: i.qty + action.qty} : i)
        : [...state, {dish: action.dish, qty: action.qty}]
    }
    case 'SET':
      return state.map(i => i.dish.id === action.id ? {...i, qty: action.qty} : i).filter(i => i.qty > 0)
    case 'REMOVE':
      return state.filter(i => i.dish.id !== action.id)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CART DRAWER
═══════════════════════════════════════════════════════════════════════════ */

function CartDrawer({ cart, dispatch, onClose, onOrder }) {
  const total = cart.reduce((s,i) => s + i.dish.price * i.qty, 0)
  const count = cart.reduce((s,i) => s + i.qty, 0)

  return (
    <>
      <div className="cart-backdrop" onClick={onClose}/>
      <div className="cart-drawer">
        <div style={{padding:'24px 24px 16px',borderBottom:'1px solid var(--gb)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'var(--fd)',fontSize:'1.5rem',fontWeight:400}}>Your Order</div>
            <div style={{fontSize:'.6rem',color:'var(--mt)',letterSpacing:'.1em',marginTop:3,fontFamily:'var(--fm)'}}>{count} ITEM{count!==1?'S':''} · TABLE 12</div>
          </div>
          <button className="qty-btn" onClick={onClose} style={{fontSize:'.85rem'}}>✕</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'16px 24px'}}>
          {cart.length === 0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',color:'var(--mt)'}}>
              <div style={{fontFamily:'var(--fd)',fontSize:'1.3rem',fontStyle:'italic',marginBottom:8}}>Your table is bare</div>
              <div style={{fontSize:'.7rem',letterSpacing:'.06em'}}>Browse the menu to begin your experience</div>
            </div>
          ) : cart.map(({dish,qty}) => (
            <div key={dish.id} style={{display:'flex',gap:14,alignItems:'center',padding:'16px 0',borderBottom:'1px solid var(--gb)'}}>
              <div style={{width:56,height:56,borderRadius:10,background:'var(--s2)',border:'1px solid var(--gb)',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',padding:4}}>
                <div style={{fontSize:'.55rem',color:'var(--mt)',textAlign:'center',fontFamily:'var(--fd)',fontStyle:'italic',lineHeight:1.2}}>{dish.name.split(' ').slice(0,2).join(' ')}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'.78rem',fontWeight:500,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{dish.name}</div>
                <div style={{fontSize:'.65rem',color:'var(--gold)',fontFamily:'var(--fm)'}}>₹{dish.price.toLocaleString()} × {qty}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                <button className="qty-btn" onClick={()=>dispatch({type:'SET',id:dish.id,qty:qty-1})}>−</button>
                <span style={{fontSize:'.8rem',minWidth:20,textAlign:'center',fontFamily:'var(--fm)'}}>{qty}</span>
                <button className="qty-btn" onClick={()=>dispatch({type:'SET',id:dish.id,qty:qty+1})}>+</button>
                <button className="qty-btn" style={{marginLeft:2,color:'var(--red)',borderColor:'rgba(196,80,80,.3)'}}
                  onClick={()=>dispatch({type:'REMOVE',id:dish.id})}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{padding:'20px 24px 28px',borderTop:'1px solid var(--gb)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:20}}>
              <span style={{color:'var(--mt)',fontSize:'.72rem',letterSpacing:'.05em',fontFamily:'var(--fm)'}}>TOTAL</span>
              <span style={{fontFamily:'var(--fd)',fontSize:'1.8rem',color:'var(--gold)'}}>₹{total.toLocaleString()}</span>
            </div>
            <button className="btn-gold" style={{width:'100%',padding:'16px',fontSize:'.72rem'}} onClick={onOrder}>
              Place Order
            </button>
            <div style={{textAlign:'center',marginTop:12,fontSize:'.6rem',color:'var(--mt)',fontFamily:'var(--fm)'}}>
              Estimated wait: 25–35 min · Table 12
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ORDER CONFIRMATION
═══════════════════════════════════════════════════════════════════════════ */

function OrderConfirm({ total, onClose }) {
  const time = new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
  return (
    <div className="overlay">
      <div style={{textAlign:'center',maxWidth:380,animation:'fadeUp .5s ease',padding:'0 16px'}}>
        <div style={{width:72,height:72,borderRadius:'50%',background:'var(--gd)',border:'1px solid var(--gold)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px'}}>
          <svg viewBox="0 0 40 40" width="32" height="32">
            <circle cx="20" cy="20" r="18" fill="none" stroke="var(--gold)" strokeWidth="2"/>
            <path d="M10 20 l7 7 l13-13" fill="none" stroke="var(--gold)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60"
              style={{strokeDashoffset:0, animation:'checkDraw .6s .2s cubic-bezier(.16,1,.3,1) both'}}/>
          </svg>
        </div>
        <div style={{fontFamily:'var(--fd)',fontSize:'2rem',fontWeight:400,marginBottom:8}}>Order Received</div>
        <div style={{color:'var(--mt)',fontSize:'.72rem',lineHeight:1.8,marginBottom:6,fontFamily:'var(--fm)'}}>TABLE 12 · {time}</div>
        <div style={{fontFamily:'var(--fd)',fontSize:'1.5rem',color:'var(--gold)',marginBottom:24}}>₹{total.toLocaleString()}</div>
        <p style={{color:'var(--mt)',fontSize:'.74rem',lineHeight:1.85,marginBottom:28}}>
          Your dishes are being prepared with care. Our kitchen team will bring each course to your table at the perfect moment.
        </p>
        <button className="btn-gold" style={{padding:'14px 40px',fontSize:'.68rem'}} onClick={onClose}>
          Continue Browsing
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DISH MODAL
═══════════════════════════════════════════════════════════════════════════ */

function DishModal({ dish, cart, dispatch, onClose }) {
  const [qty, setQty] = useState(1)
  const [show3D, setShow3D] = useState(false)
  const inCart = cart.find(i => i.dish.id === dish.id)?.qty || 0

  useEffect(() => {
    const t = setTimeout(() => setShow3D(true), 80)
    return () => clearTimeout(t)
  }, [])

  const macros = [
    {l:'Calories', v:dish.calories, u:'kcal', c:'#C45050',  pct:62},
    {l:'Protein',  v:dish.protein,  u:'g',    c:'#4A9B6F',  pct:75},
    {l:'Carbs',    v:dish.carbs,    u:'g',    c:'#7EB8D4',  pct:40},
    {l:'Fat',      v:dish.fat,      u:'g',    c:'var(--gold)',pct:55},
  ]

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* 3D Viewer */}
        <div style={{position:'relative'}}>
          {show3D
            ? <Viewer3D dish={dish} height={430}/>
            : <div style={{height:430,background:'#09080B',borderRadius:'20px 20px 0 0',display:'flex',alignItems:'center',justifyContent:'center'}}>
                <div style={{color:'var(--mt)',fontSize:'.65rem',letterSpacing:'.2em',fontFamily:'var(--fm)'}}>LOADING SCENE…</div>
              </div>
          }
          <button onClick={onClose} style={{position:'absolute',top:14,right:14,zIndex:20,background:'rgba(8,7,5,.7)',border:'1px solid var(--gb)',color:'var(--w)',borderRadius:'50%',width:32,height:32,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',backdropFilter:'blur(8px)'}}>✕</button>
          {inCart > 0 && (
            <div style={{position:'absolute',top:14,left:14,zIndex:20,background:'var(--gd)',border:'1px solid var(--gold)',borderRadius:100,padding:'4px 12px',fontSize:'.58rem',color:'var(--gold)',backdropFilter:'blur(8px)',fontFamily:'var(--fm)'}}>
              {inCart} in order
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{padding:'24px 28px 30px'}}>
          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div style={{flex:1,paddingRight:16}}>
              <div style={{fontSize:'.58rem',color:dish.accent,letterSpacing:'.2em',marginBottom:5,textTransform:'uppercase',fontFamily:'var(--fm)'}}>{dish.tag}</div>
              <div style={{fontFamily:'var(--fd)',fontSize:'1.85rem',fontWeight:400,lineHeight:1.1,marginBottom:5}}>{dish.name}</div>
              <div style={{color:'var(--mt)',fontSize:'.65rem',letterSpacing:'.05em',fontFamily:'var(--fm)'}}>
                <span style={{color:'var(--gold)'}}>{'★'.repeat(Math.floor(dish.rating))}</span> {dish.rating} · {dish.orders.toLocaleString()} orders · {dish.prep}
              </div>
            </div>
            <div style={{fontFamily:'var(--fd)',fontSize:'1.9rem',color:'var(--gold)',flexShrink:0,paddingTop:6}}>₹{dish.price.toLocaleString()}</div>
          </div>

          {/* Chef's note */}
          <div style={{background:'var(--s2)',border:'1px solid var(--gb)',borderRadius:12,padding:'14px 16px',marginBottom:20}}>
            <div style={{fontSize:'.55rem',color:'var(--gold)',letterSpacing:'.18em',marginBottom:6,fontFamily:'var(--fm)'}}>CHEF'S NOTE</div>
            <p style={{color:'rgba(242,237,222,.7)',fontSize:'.74rem',lineHeight:1.78,fontFamily:'var(--fd)',fontStyle:'italic'}}>{dish.chef}</p>
          </div>

          {/* Macros */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:18}}>
            {macros.map(m => (
              <div key={m.l} style={{background:'var(--s2)',border:'1px solid var(--gb)',borderRadius:12,padding:'10px 8px',textAlign:'center'}}>
                <div style={{fontSize:'1.05rem',fontWeight:600,color:m.c,fontFamily:'var(--fm)'}}>{m.v}</div>
                <div style={{fontSize:'.52rem',color:'var(--mt)',marginTop:1,fontFamily:'var(--fm)'}}>{m.u}</div>
                <div style={{fontSize:'.55rem',color:'var(--mt)',marginTop:2}}>{m.l}</div>
                <div className="mbar"><div className="mfill" style={{width:`${m.pct}%`,background:m.c}}/></div>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:'.55rem',color:'var(--mt)',letterSpacing:'.18em',marginBottom:8,fontFamily:'var(--fm)'}}>KEY INGREDIENTS</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {dish.ingredients.map(ing => (
                <span key={ing} style={{background:'var(--s2)',border:'1px solid var(--gb)',borderRadius:8,padding:'5px 12px',fontSize:'.62rem'}}>{ing}</span>
              ))}
            </div>
          </div>

          {/* Allergens */}
          {dish.allergens.length > 0 && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:'.55rem',color:'var(--mt)',letterSpacing:'.18em',marginBottom:8,fontFamily:'var(--fm)'}}>ALLERGENS</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {dish.allergens.map(a => (
                  <span key={a} style={{background:'rgba(196,80,80,.08)',border:'1px solid rgba(196,80,80,.25)',color:'#E07070',borderRadius:6,padding:'4px 10px',fontSize:'.6rem'}}>⚠ {a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Add to order */}
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <div style={{display:'flex',alignItems:'center',gap:10,background:'var(--s2)',border:'1px solid var(--gb)',borderRadius:100,padding:'8px 16px',flexShrink:0}}>
              <button className="qty-btn" style={{background:'transparent',border:'none'}} onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
              <span style={{fontSize:'.85rem',minWidth:20,textAlign:'center',fontFamily:'var(--fm)'}}>{qty}</span>
              <button className="qty-btn" style={{background:'transparent',border:'none'}} onClick={()=>setQty(q=>q+1)}>+</button>
            </div>
            <button className="btn-gold" style={{flex:1,padding:'15px',fontSize:'.68rem'}}
              onClick={()=>{dispatch({type:'ADD',dish,qty}); onClose()}}>
              Add to Order · ₹{(dish.price*qty).toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   DISH CARD
═══════════════════════════════════════════════════════════════════════════ */

const CARD_BG = {
  steak:   'radial-gradient(ellipse at 60% 40%,rgba(100,30,8,.9) 0%,rgba(40,10,4,.7) 50%,rgba(10,9,6,1) 100%)',
  bisque:  'radial-gradient(ellipse at 55% 40%,rgba(140,60,15,.85) 0%,rgba(60,20,8,.6) 50%,rgba(10,9,6,1) 100%)',
  dessert: 'radial-gradient(ellipse at 55% 35%,rgba(90,60,15,.85) 0%,rgba(40,25,8,.6) 50%,rgba(10,9,6,1) 100%)',
  drink:   'radial-gradient(ellipse at 55% 35%,rgba(15,90,45,.8) 0%,rgba(8,40,20,.6) 50%,rgba(10,9,6,1) 100%)',
  duck:    'radial-gradient(ellipse at 55% 40%,rgba(85,35,5,.88) 0%,rgba(40,15,4,.65) 50%,rgba(10,9,6,1) 100%)',
  caviar:  'radial-gradient(ellipse at 55% 35%,rgba(25,20,10,.9) 0%,rgba(12,10,5,.7) 50%,rgba(10,9,6,1) 100%)',
}

function DishCard({ dish, inCart, onClick }) {
  return (
    <div className="dish-card" onClick={() => onClick(dish)}>
      <div style={{height:200,background:CARD_BG[dish.type]||CARD_BG.steak,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
        <div style={{position:'absolute',top:'-40%',left:'-20%',width:'55%',height:'180%',background:'linear-gradient(108deg,transparent 40%,rgba(184,150,62,.055) 50%,transparent 60%)',animation:`floatY 4.5s ease-in-out infinite`,animationDelay:`${dish.id*.28}s`,pointerEvents:'none'}}/>
        <div style={{textAlign:'center',padding:'0 20px',position:'relative',zIndex:1}}>
          <div style={{fontFamily:'var(--fd)',fontSize:'1.3rem',fontWeight:400,color:'rgba(242,237,222,.88)',lineHeight:1.2,textShadow:'0 2px 20px rgba(0,0,0,.9)',marginBottom:10}}>{dish.name}</div>
          <div className="reveal" style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(8,8,6,.65)',border:`1px solid ${dish.accent}55`,borderRadius:100,padding:'5px 14px'}}>
            <span style={{width:5,height:5,borderRadius:'50%',background:dish.accent,display:'block'}}/>
            <span style={{fontSize:'.58rem',color:dish.accent,letterSpacing:'.14em',fontFamily:'var(--fm)'}}>TAP FOR 3D VIEW</span>
          </div>
        </div>
        <div style={{position:'absolute',top:12,left:12,background:'rgba(8,8,6,.72)',border:`1px solid ${dish.accent}44`,borderRadius:100,padding:'4px 11px',fontSize:'.56rem',color:dish.accent,letterSpacing:'.12em',fontFamily:'var(--fm)'}}>{dish.tag}</div>
        {inCart > 0 && (
          <div style={{position:'absolute',top:12,right:12,background:'var(--gd)',border:'1px solid var(--gold)',borderRadius:100,padding:'4px 10px',fontSize:'.56rem',color:'var(--gold)',fontFamily:'var(--fm)'}}>{inCart}×</div>
        )}
        <div style={{position:'absolute',bottom:0,left:0,right:0,height:70,background:'linear-gradient(to top,var(--s1),transparent)',pointerEvents:'none'}}/>
      </div>
      <div style={{padding:'14px 18px 18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:7}}>
          <div style={{flex:1,paddingRight:10}}>
            <div style={{fontFamily:'var(--fd)',fontSize:'.98rem',fontWeight:400,lineHeight:1.2}}>{dish.name}</div>
            <div style={{fontSize:'.6rem',color:'var(--mt)',marginTop:3,letterSpacing:'.04em',fontFamily:'var(--fm)'}}>
              <span style={{color:'var(--gold)'}}>{'★'.repeat(Math.floor(dish.rating))}</span> {dish.rating} · {dish.prep}
            </div>
          </div>
          <div style={{fontFamily:'var(--fd)',fontSize:'1rem',color:'var(--gold)',flexShrink:0}}>₹{dish.price.toLocaleString()}</div>
        </div>
        <div style={{color:'var(--mt)',fontSize:'.67rem',lineHeight:1.65,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{dish.chef}</div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════════════════════════════════════════ */

function Splash({ onEnter }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const ts = [setTimeout(()=>setPhase(1),250), setTimeout(()=>setPhase(2),950), setTimeout(()=>setPhase(3),1800)]
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--bg)',overflow:'hidden',position:'relative'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 90% 70% at 50% 50%,rgba(184,150,62,.045) 0%,transparent 65%)',pointerEvents:'none'}}/>
      {[190,320,480].map((r,i) => (
        <div key={r} style={{position:'absolute',width:r*2,height:r*2,borderRadius:'50%',border:`1px solid rgba(184,150,62,${.055-i*.015})`,animation:`floatY ${3.5+i}s ease-in-out infinite`,animationDelay:`${i*.55}s`}}/>
      ))}

      <div style={{opacity:phase>=1?1:0,transform:phase>=1?'scale(1)':'scale(.35)',transition:'all .95s cubic-bezier(.16,1,.3,1)',marginBottom:32}}>
        <div style={{width:80,height:80,borderRadius:'50%',background:'rgba(184,150,62,.06)',border:'1px solid rgba(184,150,62,.30)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 55px rgba(184,150,62,.16)',fontFamily:'var(--fd)',fontSize:'2rem',color:'var(--gold)'}}>◈</div>
      </div>

      <div style={{opacity:phase>=2?1:0,transform:phase>=2?'translateY(0)':'translateY(24px)',transition:'all .75s cubic-bezier(.16,1,.3,1)',textAlign:'center',marginBottom:14}}>
        <div className="gold-text" style={{fontFamily:'var(--fd)',fontSize:'clamp(2.8rem,7vw,4.2rem)',fontWeight:400,lineHeight:1}}>HoloMenu X</div>
        <div style={{color:'var(--mt)',fontSize:'.58rem',letterSpacing:'.45em',marginTop:10,fontFamily:'var(--fm)'}}>FINE DINING · REIMAGINED</div>
      </div>

      <div style={{opacity:phase>=3?1:0,transition:'opacity .6s .1s',textAlign:'center',marginBottom:50}}>
        <div style={{fontFamily:'var(--fd)',fontSize:'1.3rem',fontStyle:'italic',color:'rgba(242,237,222,.65)',marginBottom:5}}>Arkaadia Fine Dining</div>
        <div style={{fontSize:'.6rem',color:'var(--mt)',letterSpacing:'.12em',fontFamily:'var(--fm)'}}>TABLE 12 · 2 GUESTS · 20:30</div>
      </div>

      <div style={{opacity:phase>=3?1:0,transform:phase>=3?'translateY(0)':'translateY(18px)',transition:'all .6s .3s'}}>
        <button className="btn-gold" style={{padding:'16px 56px',fontSize:'.72rem'}} onClick={onEnter}>
          Enter Experience
        </button>
      </div>

      <div style={{position:'absolute',bottom:22,left:0,right:0,overflow:'hidden',opacity:phase>=3?.28:0,transition:'opacity .8s'}}>
        <div style={{display:'flex',gap:30,fontSize:'.52rem',letterSpacing:'.24em',color:'var(--mt)',whiteSpace:'nowrap',animation:'marquee 22s linear infinite',fontFamily:'var(--fm)'}}>
          {['PAINTED FOOD ART','PBR LIGHTING','LIVE STEAM','360° ROTATION','MICHELIN AESTHETIC','FULL CART','CINEMATIC CAMERA',
            'PAINTED FOOD ART','PBR LIGHTING','LIVE STEAM','360° ROTATION','MICHELIN AESTHETIC','FULL CART','CINEMATIC CAMERA'
          ].map((t,i) => <span key={i}>◈ {t}</span>)}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APPLICATION
═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  const [view,     setView]     = useState('splash')
  const [cat,      setCat]      = useState('all')
  const [query,    setQuery]    = useState('')
  const [modal,    setModal]    = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [ordered,  setOrdered]  = useState(false)
  const [cart,     dispatch]    = useReducer(cartReducer, [])

  const cartCount = cart.reduce((s,i) => s+i.qty, 0)
  const cartTotal = cart.reduce((s,i) => s+i.dish.price*i.qty, 0)
  const filtered  = DISHES.filter(d =>
    (cat==='all' || d.cat===cat) &&
    (d.name.toLowerCase().includes(query.toLowerCase()) || d.chef.toLowerCase().includes(query.toLowerCase()))
  )

  if (view === 'splash') return <><InjectStyles/><Splash onEnter={()=>setView('menu')}/></>

  return (
    <>
      <InjectStyles/>
      <div style={{minHeight:'100vh',background:'var(--bg)',color:'var(--w)'}}>

        {/* ── NAV ── */}
        <nav style={{position:'sticky',top:0,zIndex:300,background:'rgba(8,8,6,.92)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:'1px solid var(--gb)'}}>
          <div style={{maxWidth:1200,margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:60,gap:16}}>
            {/* Logo */}
            <div style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',flexShrink:0}} onClick={()=>setView('splash')}>
              <span style={{color:'var(--gold)',fontFamily:'var(--fd)',fontSize:'1.1rem'}}>◈</span>
              <span className="gold-text" style={{fontFamily:'var(--fd)',fontSize:'1.05rem'}}>HoloMenu X</span>
            </div>

            {/* Categories */}
            <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',flex:1,justifyContent:'center'}}>
              {CATS.map(c => (
                <div key={c} className={`cat-pill ${cat===c?'active':''}`} onClick={()=>setCat(c)}>
                  {c.charAt(0).toUpperCase()+c.slice(1)}
                </div>
              ))}
            </div>

            {/* Right: search + cart */}
            <div style={{display:'flex',gap:8,alignItems:'center',flexShrink:0}}>
              <div style={{position:'relative'}}>
                <input
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                  placeholder="Search…"
                  style={{background:'var(--gls)',border:'1px solid var(--gb)',borderRadius:100,color:'var(--w)',fontSize:'.65rem',outline:'none',padding:'8px 14px 8px 34px',width:160,fontFamily:'var(--fb)'}}
                />
                <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'var(--mt)',fontSize:'.8rem'}}>⌕</span>
              </div>
              <button className="btn-outline" style={{padding:'8px 18px',fontSize:'.65rem',display:'flex',alignItems:'center',gap:8,position:'relative'}} onClick={()=>setCartOpen(true)}>
                <span>Order</span>
                {cartCount > 0 && (
                  <>
                    <span style={{background:'var(--gold)',color:'#080806',borderRadius:'50%',width:18,height:18,display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:'.6rem',fontWeight:700,fontFamily:'var(--fm)'}}>{cartCount}</span>
                    <span style={{fontSize:'.65rem',color:'var(--gold)',fontFamily:'var(--fm)'}}>₹{cartTotal.toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={{background:'linear-gradient(to bottom,rgba(184,150,62,.03),transparent)',borderBottom:'1px solid var(--gb)',padding:'48px 24px 40px',textAlign:'center'}}>
          <div style={{fontSize:'.56rem',color:'var(--gold)',letterSpacing:'.38em',marginBottom:12,fontFamily:'var(--fm)'}}>◈ ARKAADIA FINE DINING ◈</div>
          <h1 style={{fontFamily:'var(--fd)',fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:400,lineHeight:1.08,marginBottom:14}}>Taste Before You Order</h1>
          <p style={{color:'var(--mt)',fontSize:'.76rem',maxWidth:440,margin:'0 auto',lineHeight:1.85}}>
            Select any dish for a live 3D presentation — porcelain plate, walnut table, cinematic lighting.
            Drag to rotate 360°, scroll to inspect every detail.
          </p>
        </div>

        {/* ── MENU GRID ── */}
        <main style={{maxWidth:1200,margin:'0 auto',padding:'36px 24px'}}>
          {filtered.length === 0 ? (
            <div style={{textAlign:'center',padding:'80px 0',color:'var(--mt)'}}>
              <div style={{fontFamily:'var(--fd)',fontSize:'1.4rem',fontStyle:'italic',marginBottom:8}}>Nothing found</div>
              <div style={{fontSize:'.7rem',marginBottom:20}}>Try a different search or category</div>
              <button className="btn-outline" style={{padding:'10px 24px',fontSize:'.68rem'}} onClick={()=>{setCat('all');setQuery('')}}>Clear Filters</button>
            </div>
          ) : (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:22}}>
              {filtered.map(d => (
                <DishCard key={d.id} dish={d} inCart={cart.find(i=>i.dish.id===d.id)?.qty||0} onClick={setModal}/>
              ))}
            </div>
          )}
        </main>

        {/* ── FOOTER ── */}
        <footer style={{borderTop:'1px solid var(--gb)',padding:'18px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(8,8,6,.7)',backdropFilter:'blur(12px)'}}>
          <span className="gold-text" style={{fontFamily:'var(--fd)',fontSize:'.9rem'}}>◈ HoloMenu X</span>
          <span style={{fontSize:'.58rem',color:'var(--mt)',fontFamily:'var(--fm)'}}>PBR · CANVAS ART · LIVE STEAM · FULL CART</span>
          <span style={{fontSize:'.58rem',color:'var(--mt)',fontFamily:'var(--fm)'}}>ARKAADIA · TABLE 12</span>
        </footer>
      </div>

      {/* ── OVERLAYS ── */}
      {modal && (
        <DishModal dish={modal} cart={cart} dispatch={dispatch} onClose={()=>setModal(null)}/>
      )}
      {cartOpen && (
        <CartDrawer cart={cart} dispatch={dispatch} onClose={()=>setCartOpen(false)} onOrder={()=>{setCartOpen(false);setOrdered(true)}}/>
      )}
      {ordered && (
        <OrderConfirm total={cartTotal} onClose={()=>{setOrdered(false);dispatch({type:'CLEAR'})}}/>
      )}
    </>
  )
}
