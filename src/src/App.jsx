import { useState, useRef, useEffect } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #060810;
    --s1:       #0c0f1a;
    --s2:       #111520;
    --s3:       #161b2e;
    --s4:       #1c2235;
    --border:   rgba(255,255,255,0.07);
    --border2:  rgba(255,255,255,0.12);
    --blue:     #4f8ef7;
    --blue2:    #3b7ef0;
    --blue-a:   rgba(79,142,247,0.1);
    --blue-b:   rgba(79,142,247,0.2);
    --teal:     #2dd4bf;
    --green:    #22c55e;
    --amber:    #f59e0b;
    --red:      #ef4444;
    --orange:   #f97316;
    --violet:   #a78bfa;
    --t1:       #f0f4ff;
    --t2:       #8b99b8;
    --t3:       #4b5675;
    --t4:       #2a3248;
    --mono:     'JetBrains Mono', monospace;
    --sans:     'Inter', sans-serif;
  }

  html, body { background: var(--bg); }

  .app {
    font-family: var(--sans);
    min-height: 100vh;
    background: var(--bg);
    color: var(--t1);
    display: flex;
    position: relative;
  }

  /* subtle mesh bg */
  .app-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 50% at 80% 0%, rgba(79,142,247,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 10% 100%, rgba(45,212,191,0.05) 0%, transparent 60%);
  }

  /* ────────── SIDEBAR ────────── */
  .sidebar {
    position: fixed; left: 0; top: 0; bottom: 0; width: 232px;
    z-index: 100; display: flex; flex-direction: column;
    background: var(--s1);
    border-right: 1px solid var(--border);
  }

  .logo-area {
    padding: 22px 18px 18px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-body {
    flex: 1; overflow-y: auto; padding: 12px 10px;
    scrollbar-width: none;
  }

  .nav-group-label {
    font-size: 9.5px; font-weight: 700; letter-spacing: 1.8px;
    color: var(--t3); text-transform: uppercase;
    padding: 14px 10px 5px;
  }

  .nav-btn {
    display: flex; align-items: center; gap: 9px;
    width: 100%; padding: 8px 10px; border-radius: 7px;
    background: none; border: none; cursor: pointer;
    font-family: var(--sans); font-size: 13px; font-weight: 500;
    color: var(--t2); text-align: left;
    transition: all 0.15s; position: relative;
    margin-bottom: 1px;
  }
  .nav-btn:hover { background: var(--s3); color: var(--t1); }
  .nav-btn.active {
    background: var(--blue-a); color: var(--blue);
    font-weight: 600;
  }
  .nav-btn.active::before {
    content: ''; position: absolute;
    left: -10px; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%; border-radius: 0 2px 2px 0;
    background: var(--blue);
  }
  .nav-ico { width: 15px; height: 15px; flex-shrink: 0; }
  .nav-pill {
    margin-left: auto; background: var(--red);
    color: white; font-size: 10px; font-weight: 700;
    padding: 1px 6px; border-radius: 8px;
    font-family: var(--mono);
  }

  .sidebar-foot {
    padding: 12px 10px;
    border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: 8px;
    background: var(--s2); cursor: pointer;
    transition: background 0.15s;
  }
  .user-card:hover { background: var(--s3); }
  .user-avi {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--blue), var(--teal));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white;
  }
  .user-name { font-size: 12.5px; font-weight: 600; color: var(--t1); }
  .user-role { font-size: 10.5px; color: var(--t3); }

  /* ────────── MAIN ────────── */
  .main {
    margin-left: 232px;
    flex: 1; min-height: 100vh;
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
  }

  /* ────────── TOPBAR ────────── */
  .topbar {
    position: sticky; top: 0; z-index: 50;
    height: 56px; padding: 0 28px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(6,8,16,0.82); backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
  }
  .topbar-left { display: flex; align-items: center; gap: 8px; }
  .topbar-crumb {
    font-size: 12px; font-weight: 500; color: var(--t3);
  }
  .topbar-crumb-sep { color: var(--t4); margin: 0 4px; }
  .topbar-page { font-size: 13px; font-weight: 600; color: var(--t1); }
  .topbar-right { display: flex; align-items: center; gap: 10px; }

  .status-pill {
    display: flex; align-items: center; gap: 6px;
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.2);
    border-radius: 20px; padding: 4px 12px;
    font-size: 11px; font-weight: 600; color: var(--green);
  }
  .status-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--green); animation: blink 2s infinite;
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }

  /* ────────── CONTENT ────────── */
  .content { padding: 28px 28px; flex: 1; max-width: 1120px; }

  .pg-head { margin-bottom: 24px; }
  .pg-title { font-size: 20px; font-weight: 800; color: var(--t1); letter-spacing: -0.4px; }
  .pg-sub { font-size: 12.5px; color: var(--t2); margin-top: 3px; line-height: 1.4; }
  .pg-head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }

  /* ────────── BUTTONS ────────── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 15px; border-radius: 7px; border: none;
    font-family: var(--sans); font-size: 12.5px; font-weight: 600;
    cursor: pointer; white-space: nowrap; transition: all 0.15s;
    text-decoration: none;
  }
  .btn-primary { background: var(--blue); color: white; }
  .btn-primary:hover { background: var(--blue2); box-shadow: 0 4px 14px rgba(79,142,247,0.35); }
  .btn-ghost { background: var(--s2); color: var(--t2); border: 1px solid var(--border2); }
  .btn-ghost:hover { color: var(--t1); background: var(--s3); }
  .btn-del { background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.2); }
  .btn-del:hover { background: rgba(239,68,68,0.18); }

  /* ────────── STAT CARDS ────────── */
  .stats {
    display: grid; grid-template-columns: repeat(5,1fr);
    gap: 10px; margin-bottom: 24px;
  }
  .stat {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 10px; padding: 16px 18px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
    animation: up 0.45s ease both;
  }
  .stat:hover { border-color: var(--border2); transform: translateY(-1px); }
  .stat::after {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: var(--ac, var(--blue));
  }
  .stat-v {
    font-size: 28px; font-weight: 800; color: var(--t1);
    font-family: var(--mono); letter-spacing: -1px; line-height: 1;
  }
  .stat-l { font-size: 10.5px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 5px; }
  .stat-s { font-size: 10.5px; color: var(--t2); margin-top: 2px; }

  /* ────────── CARD ────────── */
  .card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 10px; padding: 20px;
    animation: up 0.4s ease both;
  }
  .card-head {
    font-size: 11px; font-weight: 700; color: var(--t2);
    text-transform: uppercase; letter-spacing: 1px;
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }
  .card-head::before {
    content: ''; display: block; width: 3px; height: 13px;
    background: var(--blue); border-radius: 2px;
  }

  /* ────────── CHART ────────── */
  .chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .donut-row { display: flex; align-items: center; gap: 18px; }
  .legend { display: flex; flex-direction: column; gap: 7px; }
  .leg-row { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--t2); }
  .leg-swatch { width: 7px; height: 7px; border-radius: 2px; flex-shrink: 0; }
  .leg-n { margin-left: auto; font-family: var(--mono); font-size: 11.5px; font-weight: 600; color: var(--t1); }

  .bar-row { margin-bottom: 12px; }
  .bar-lbl { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--t2); margin-bottom: 5px; }
  .bar-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 2px; transition: width 0.9s cubic-bezier(.4,0,.2,1); }

  /* ────────── ISSUE LIST ────────── */
  .issue-list { display: flex; flex-direction: column; gap: 7px; }
  .issue-card {
    display: flex; align-items: flex-start; gap: 14px;
    background: var(--s1); border: 1px solid var(--border);
    border-left: 3px solid var(--sev-c, var(--border));
    border-radius: 8px; padding: 13px 16px;
    cursor: pointer; transition: all 0.14s;
    animation: up 0.4s ease both;
  }
  .issue-card:hover { background: var(--s2); border-color: var(--border2); border-left-color: var(--sev-c, var(--border)); }
  .issue-body { flex: 1; min-width: 0; }
  .issue-title { font-size: 13px; font-weight: 600; color: var(--t1); margin-bottom: 2px; }
  .issue-desc { font-size: 11.5px; color: var(--t2); line-height: 1.45; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 560px; }
  .issue-meta { display: flex; align-items: center; gap: 12px; }
  .issue-meta span { font-size: 10.5px; color: var(--t3); font-family: var(--mono); }
  .issue-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }

  /* ────────── BADGES ────────── */
  .badge {
    display: inline-flex; align-items: center;
    padding: 2px 9px; border-radius: 5px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.4px;
    text-transform: uppercase; font-family: var(--mono);
    border: 1px solid transparent; white-space: nowrap;
  }
  .bc { background: rgba(239,68,68,0.1);   color: #f87171; border-color: rgba(239,68,68,0.2); }
  .bh { background: rgba(249,115,22,0.1);  color: #fb923c; border-color: rgba(249,115,22,0.2); }
  .bm { background: rgba(245,158,11,0.1);  color: #fbbf24; border-color: rgba(245,158,11,0.2); }
  .bl { background: rgba(34,197,94,0.1);   color: #4ade80; border-color: rgba(34,197,94,0.2); }
  .bo { background: rgba(239,68,68,0.1);   color: #f87171; border-color: rgba(239,68,68,0.2); }
  .bip{ background: rgba(245,158,11,0.1);  color: #fbbf24; border-color: rgba(245,158,11,0.2); }
  .br { background: rgba(34,197,94,0.1);   color: #4ade80; border-color: rgba(34,197,94,0.2); }
  .bcu{ background: rgba(167,139,250,0.1); color: #a78bfa; border-color: rgba(167,139,250,0.2); }

  /* ────────── TOOLBAR ────────── */
  .toolbar { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .search-wrap {
    flex: 1; min-width: 200px; height: 36px;
    display: flex; align-items: center; gap: 9px;
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 7px; padding: 0 12px;
    transition: border-color 0.15s;
  }
  .search-wrap:focus-within { border-color: var(--blue); }
  .search-wrap input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--t1); font-family: var(--sans); font-size: 12.5px;
  }
  .search-wrap input::placeholder { color: var(--t3); }
  .fsel {
    height: 36px; padding: 0 11px; border-radius: 7px;
    background: var(--s1); border: 1px solid var(--border);
    color: var(--t2); font-family: var(--sans); font-size: 12.5px;
    outline: none; cursor: pointer; transition: border-color 0.15s;
  }
  .fsel:focus { border-color: var(--blue); }
  .fsel option { background: #111520; }

  /* ────────── DETAIL ────────── */
  .detail {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 10px; padding: 26px;
    animation: up 0.3s ease;
  }
  .detail-title { font-size: 18px; font-weight: 800; color: var(--t1); letter-spacing: -0.3px; }
  .detail-meta-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(130px,1fr));
    gap: 1px; background: var(--border); border-radius: 8px;
    overflow: hidden; margin: 18px 0; border: 1px solid var(--border);
  }
  .detail-cell { background: var(--s2); padding: 11px 14px; }
  .detail-cell-lbl { font-size: 9.5px; font-weight: 700; color: var(--t3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px; }
  .detail-cell-val { font-size: 12.5px; font-weight: 600; color: var(--t1); }
  .sol-list { display: flex; flex-direction: column; gap: 7px; }
  .sol-item {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 12px 14px; border-radius: 7px;
    background: rgba(34,197,94,0.04);
    border: 1px solid rgba(34,197,94,0.1);
    transition: all 0.14s; animation: up 0.3s ease both;
  }
  .sol-item:hover { background: rgba(34,197,94,0.08); }
  .sol-n {
    width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0;
    background: var(--green); color: #060810;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 800; margin-top: 1px;
  }
  .sol-t { font-size: 12.5px; color: var(--t2); line-height: 1.55; }
  .sec-lbl {
    font-size: 10px; font-weight: 700; color: var(--green);
    text-transform: uppercase; letter-spacing: 1.5px;
    margin: 20px 0 10px;
  }

  /* ────────── REPORT TABLE ────────── */
  .rep-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 0; border-bottom: 1px solid var(--border);
    gap: 10px; font-size: 12.5px;
  }
  .rep-row:last-child { border-bottom: none; }

  /* ────────── MODAL ────────── */
  .overlay {
    position: fixed; inset: 0; z-index: 900;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fi 0.15s ease;
  }
  .modal {
    background: var(--s1); border: 1px solid var(--border2);
    border-radius: 14px; padding: 26px; width: 100%; max-width: 510px;
    max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6);
    animation: su 0.22s ease;
  }
  .modal-title { font-size: 17px; font-weight: 800; color: var(--t1); margin-bottom: 20px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .fg { margin-bottom: 13px; }
  .fl {
    display: block; font-size: 10px; font-weight: 700; color: var(--t3);
    text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;
  }
  .fc {
    width: 100%; padding: 9px 12px;
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 7px; color: var(--t1);
    font-family: var(--sans); font-size: 12.5px;
    outline: none; transition: border-color 0.14s;
  }
  .fc:focus { border-color: var(--blue); }
  .fc option { background: #111520; }
  textarea.fc { resize: vertical; min-height: 76px; }

  /* ────────── CHATBOT ────────── */
  .bot-fab {
    position: fixed; bottom: 22px; right: 22px; z-index: 400;
    width: 50px; height: 50px; border-radius: 13px; border: none;
    background: var(--blue); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(79,142,247,0.45);
    transition: all 0.18s;
  }
  .bot-fab:hover { background: var(--blue2); transform: scale(1.06); }
  .bot-win {
    position: fixed; bottom: 84px; right: 22px; z-index: 400;
    width: 355px; height: 510px;
    background: var(--s1); border: 1px solid var(--border2);
    border-radius: 14px; display: flex; flex-direction: column;
    box-shadow: 0 20px 56px rgba(0,0,0,0.65);
    animation: su 0.22s ease; overflow: hidden;
  }
  .bot-head {
    padding: 14px 16px; border-bottom: 1px solid var(--border);
    background: var(--s2);
    display: flex; align-items: center; justify-content: space-between;
  }
  .bot-avi-row { display: flex; align-items: center; gap: 10px; }
  .bot-avi {
    width: 30px; height: 30px; border-radius: 7px;
    background: linear-gradient(135deg, var(--blue), var(--teal));
    display: flex; align-items: center; justify-content: center;
  }
  .bot-name { font-size: 13px; font-weight: 700; color: var(--t1); }
  .bot-msgs {
    flex: 1; overflow-y: auto; padding: 13px;
    display: flex; flex-direction: column; gap: 9px;
    scrollbar-width: thin; scrollbar-color: var(--border) transparent;
  }
  .msg { max-width: 86%; animation: up 0.22s ease; }
  .msg-bot { align-self: flex-start; }
  .msg-usr { align-self: flex-end; }
  .bubble { padding: 9px 12px; border-radius: 11px; font-size: 12.5px; line-height: 1.55; }
  .msg-bot .bubble { background: var(--s2); border: 1px solid var(--border); color: var(--t1); border-bottom-left-radius: 3px; }
  .msg-usr .bubble { background: var(--blue); color: white; border-bottom-right-radius: 3px; }
  .msg-t { font-size: 9.5px; color: var(--t3); margin-top: 3px; padding: 0 2px; }
  .msg-bot .msg-t { text-align: left; }
  .msg-usr .msg-t { text-align: right; }
  .dots { display: flex; gap: 3px; padding: 9px 12px; }
  .dots span { width: 5px; height: 5px; border-radius: 50%; background: var(--t3); animation: bounce 1.2s infinite; }
  .dots span:nth-child(2) { animation-delay: .18s; }
  .dots span:nth-child(3) { animation-delay: .36s; }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  .bot-suggs { padding: 7px 13px; display: flex; flex-wrap: wrap; gap: 5px; border-top: 1px solid var(--border); }
  .sugg {
    padding: 4px 9px; border-radius: 5px; font-size: 11px; font-weight: 600;
    background: var(--s2); border: 1px solid var(--border);
    color: var(--t2); cursor: pointer; font-family: var(--sans);
    transition: all 0.12s;
  }
  .sugg:hover { border-color: var(--blue); color: var(--blue); }
  .bot-inp-row { padding: 11px 13px; border-top: 1px solid var(--border); display: flex; gap: 7px; }
  .bot-inp {
    flex: 1; padding: 8px 11px;
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 7px; color: var(--t1);
    font-family: var(--sans); font-size: 12.5px;
    outline: none; transition: border-color 0.14s;
  }
  .bot-inp:focus { border-color: var(--blue); }
  .bot-inp::placeholder { color: var(--t3); }
  .bot-send {
    width: 34px; height: 34px; border-radius: 7px; border: none;
    background: var(--blue); cursor: pointer; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.14s;
  }
  .bot-send:hover { background: var(--blue2); }

  /* ────────── BACK ────────── */
  .back {
    display: inline-flex; align-items: center; gap: 5px;
    background: none; border: none; color: var(--t2);
    font-family: var(--sans); font-size: 12px; font-weight: 500;
    cursor: pointer; margin-bottom: 18px; padding: 0;
    transition: color 0.14s;
  }
  .back:hover { color: var(--t1); }

  /* ────────── ANIMS ────────── */
  @keyframes up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fi { from{opacity:0} to{opacity:1} }
  @keyframes su { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

  /* ────────── RESPONSIVE ────────── */
  @media(max-width:860px){
    .sidebar { display: none; }
    .main { margin-left: 0; }
    .stats { grid-template-columns: repeat(2,1fr); }
    .chart-grid { grid-template-columns: 1fr; }
    .content { padding: 16px; }
    .topbar { padding: 0 16px; }
  }
`;

/* ─────────────── DATA ─────────────── */
const SEED=[
  {id:"gmp1",cat:"GMP",catIcon:"🏭",title:"Batch Record Discrepancies",severity:"critical",status:"open",description:"Incomplete or inaccurate batch manufacturing records found during audit.",regulation:"21 CFR Part 211.188",solutions:["Implement electronic batch records (EBR) with real-time data capture","Establish dual-review process for all batch documentation","Train personnel on ALCOA+ principles","Conduct monthly internal audits of records"],timeline:"30–60 days",cost:"Medium",custom:false},
  {id:"gmp2",cat:"GMP",catIcon:"🏭",title:"Equipment Qualification Gaps",severity:"high",status:"inprogress",description:"Critical manufacturing equipment lacks current IQ/OQ/PQ documentation.",regulation:"21 CFR Part 211.68",solutions:["Develop a risk-based qualification master plan","Prioritize equipment impacting product quality","Engage qualified vendors for retrospective studies","Implement periodic requalification schedule"],timeline:"60–90 days",cost:"High",custom:false},
  {id:"gmp3",cat:"GMP",catIcon:"🏭",title:"Environmental Monitoring Failures",severity:"high",status:"open",description:"Out-of-specification microbial counts detected in controlled manufacturing areas.",regulation:"21 CFR Part 211.42",solutions:["Increase monitoring frequency immediately","Conduct root cause analysis using Ishikawa method","Review gowning and cleaning SOPs","Install continuous particle monitoring system"],timeline:"14–30 days",cost:"Medium",custom:false},
  {id:"reg1",cat:"Regulatory",catIcon:"📋",title:"Post-Approval Change Management",severity:"critical",status:"open",description:"Manufacturing changes implemented without required FDA prior approval submissions.",regulation:"21 CFR Part 314.70",solutions:["Establish formal change control procedure immediately","Train team on CBE-30, CBE-0, and PAS categories","Create a changes tracking database","Engage regulatory counsel for retroactive filing"],timeline:"30–45 days",cost:"High",custom:false},
  {id:"reg2",cat:"Regulatory",catIcon:"📋",title:"Labeling Non-Compliance",severity:"medium",status:"resolved",description:"Product labeling does not reflect current approved prescribing information.",regulation:"21 CFR Part 201",solutions:["Conduct gap analysis between PI and current labels","Implement labeling control system","Establish artwork review workflow with QA sign-off","Create regulatory change notification process"],timeline:"45–60 days",cost:"Medium",custom:false},
  {id:"qms1",cat:"Quality",catIcon:"✅",title:"CAPA Effectiveness Failures",severity:"critical",status:"inprogress",description:"Corrective and Preventive Actions not verified for effectiveness post-implementation.",regulation:"21 CFR Part 820.100 / ICH Q10",solutions:["Define SMART effectiveness criteria at CAPA initiation","Implement structured CAPA check schedule (30/60/90 days)","Use statistical tools to verify process improvements","Integrate CAPA metrics into monthly management review"],timeline:"30 days",cost:"Low",custom:false},
  {id:"qms2",cat:"Quality",catIcon:"✅",title:"OOS Investigation Deficiencies",severity:"high",status:"open",description:"Out-of-specification results not investigated per FDA-established procedures.",regulation:"21 CFR Part 211.192",solutions:["Develop robust OOS SOP per FDA 2006 guidance","Train QC analysts on Phase I and Phase II investigations","Implement OOS tracking software","Establish scientific review board for invalidation decisions"],timeline:"21–30 days",cost:"Low",custom:false},
  {id:"qms3",cat:"Quality",catIcon:"✅",title:"Supplier Qualification Gaps",severity:"medium",status:"open",description:"Critical raw material suppliers not qualified per current quality agreements.",regulation:"ICH Q7 / 21 CFR Part 211.84",solutions:["Perform risk stratification of entire supplier base","Conduct on-site audits for all high-risk suppliers","Implement supplier performance scorecards","Establish quality technical agreements with all critical suppliers"],timeline:"60–90 days",cost:"Medium",custom:false},
  {id:"clin1",cat:"Clinical",catIcon:"🔬",title:"Informed Consent Deficiencies",severity:"critical",status:"open",description:"Patients enrolled in clinical trials without properly documented informed consent.",regulation:"21 CFR Part 50 / ICH E6 GCP",solutions:["Immediately halt new enrollment pending consent review","Re-consent all affected subjects where required","Retrain all investigators on GCP requirements","Implement eConsent system with complete audit trail"],timeline:"Immediate",cost:"High",custom:false},
  {id:"pv1",cat:"Pharmacovigilance",catIcon:"⚠️",title:"Adverse Event Reporting Delays",severity:"critical",status:"inprogress",description:"Serious adverse drug reactions not reported within 15-day FDA requirement.",regulation:"21 CFR Part 314.81 / ICH E2A",solutions:["Implement 24/7 adverse event intake and triage system","Deploy dedicated pharmacovigilance software platform","Establish clear Medical Safety Officer escalation pathway","Conduct root cause analysis on all late submissions"],timeline:"Immediate",cost:"High",custom:false},
];

const SEV={
  critical:{label:"Critical",color:"#f87171",cls:"bc"},
  high:    {label:"High",    color:"#fb923c",cls:"bh"},
  medium:  {label:"Medium",  color:"#fbbf24",cls:"bm"},
  low:     {label:"Low",     color:"#4ade80", cls:"bl"},
};
const STATUS={
  open:      {label:"Open",        cls:"bo"},
  inprogress:{label:"In Progress", cls:"bip"},
  resolved:  {label:"Resolved",    cls:"br"},
};
const CATS=["GMP","Regulatory","Quality","Clinical","Pharmacovigilance","Other"];
const CICONS={"GMP":"🏭","Regulatory":"📋","Quality":"✅","Clinical":"🔬","Pharmacovigilance":"⚠️","Other":"📁"};

/* ─────────────── LOGO ─────────────── */
function Logo(){
  return(
    <div style={{display:"flex",alignItems:"center",gap:11}}>
      {/* Mark: hexagonal DNA/compliance shield motif */}
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gA" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4f8ef7"/>
            <stop offset="1" stopColor="#2dd4bf"/>
          </linearGradient>
          <linearGradient id="gB" x1="18" y1="4" x2="18" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa"/>
            <stop offset="1" stopColor="#22d3ee"/>
          </linearGradient>
        </defs>
        {/* Rounded square base */}
        <rect width="36" height="36" rx="9" fill="#0d1525"/>
        {/* Outer hex ring */}
        <path d="M18 4 L30 10.5 V22.5 L18 29 L6 22.5 V10.5 Z"
          stroke="url(#gA)" strokeWidth="1.2" fill="none" opacity="0.5" strokeLinejoin="round"/>
        {/* Inner hex */}
        <path d="M18 9 L25 13 V21 L18 25 L11 21 V13 Z"
          stroke="url(#gA)" strokeWidth="1" fill="rgba(79,142,247,0.06)" strokeLinejoin="round"/>
        {/* Letter A — geometric, clean */}
        <path d="M15 24 L18 14.5 L21 24" stroke="url(#gB)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M16.1 21 H19.9" stroke="url(#gB)" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Pulse dot bottom-right */}
        <circle cx="28" cy="28" r="2.5" fill="#22c55e"/>
      </svg>

      {/* Wordmark */}
      <div>
        <div style={{
          fontFamily:"'Inter',sans-serif",
          fontSize:15, fontWeight:800,
          letterSpacing:"-0.5px", lineHeight:1,
        }}>
          <span style={{color:"#e8eeff"}}>Audit</span>
          <span style={{
            background:"linear-gradient(90deg,#4f8ef7,#2dd4bf)",
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text"
          }}>Nova</span>
        </div>
        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:8, fontWeight:600,
          color:"#2a3248",
          letterSpacing:"2.5px",
          textTransform:"uppercase",
          marginTop:3,
        }}>COMPLIANCE · AI</div>
      </div>
    </div>
  );
}

/* ─────────────── NAV ICONS ─────────────── */
const Ico={
  dash: <svg className="nav-ico" viewBox="0 0 15 15" fill="currentColor"><rect x="1" y="1" width="5.5" height="5.5" rx="1.5"/><rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5"/><rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5"/><rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5"/></svg>,
  list: <svg className="nav-ico" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="4" x2="13" y2="4"/><line x1="2" y1="7.5" x2="9" y2="7.5"/><line x1="2" y1="11" x2="6" y2="11"/></svg>,
  rpt:  <svg className="nav-ico" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="1.5" width="11" height="12" rx="2"/><line x1="5" y1="5" x2="10" y2="5" strokeLinecap="round"/><line x1="5" y1="7.5" x2="10" y2="7.5" strokeLinecap="round"/><line x1="5" y1="10" x2="7.5" y2="10" strokeLinecap="round"/></svg>,
  add:  <svg className="nav-ico" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7.5" cy="7.5" r="5.5"/><line x1="7.5" y1="5" x2="7.5" y2="10" strokeLinecap="round"/><line x1="5" y1="7.5" x2="10" y2="7.5" strokeLinecap="round"/></svg>,
};

/* ─────────────── DONUT ─────────────── */
function Donut({data,size=132}){
  const r=46,cx=size/2,cy=size/2,c=2*Math.PI*r;
  const total=data.reduce((s,d)=>s+d.v,0)||1;
  let cum=0;
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="16"/>
      {data.map((d,i)=>{
        const pct=d.v/total,dash=pct*c,off=(cum/total)*c;
        cum+=d.v;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none"
          stroke={d.color} strokeWidth="16"
          strokeDasharray={`${dash} ${c-dash}`} strokeDashoffset={-off}
          style={{transform:"rotate(-90deg)",transformOrigin:`${cx}px ${cy}px`}}/>;
      })}
      <text x={cx} y={cy-5} textAnchor="middle" fill="#f0f4ff" fontSize="19" fontWeight="800" fontFamily="JetBrains Mono,monospace">{total}</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill="#4b5675" fontSize="8.5" fontWeight="700" letterSpacing="1.2">TOTAL</text>
    </svg>
  );
}

/* ─────────────── CHATBOT ─────────────── */
const SYS=`You are Nova, AuditNova's expert pharmaceutical compliance AI. Your role:
1. SOLVE compliance problems with specific, actionable steps
2. Cite exact regulations (21 CFR, ICH, EU GMP) in every answer
3. Give PRECAUTIONARY tips to prevent issues before they occur
4. Flag urgency: Immediate / 30 days / 60–90 days
5. Topics: GMP, CAPA, FDA inspections, OOS, pharmacovigilance, clinical, regulatory submissions, suppliers, labeling
Tone: Senior QA/regulatory consultant. Concise. Use numbered steps. End with "💡 Tip:" when relevant.`;
const SUGGS=["Fix batch records","Prepare for FDA inspection","Handle OOS result","Prevent CAPA failures"];

function ChatBot(){
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState([{r:"bot",t:"Hi, I'm Nova — your AI compliance expert.\n\nAsk me anything: GMP, FDA inspections, CAPA, OOS investigations, regulatory submissions.",ts:now()}]);
  const [hist,setHist]=useState([]);
  const [inp,setInp]=useState("");
  const [busy,setBusy]=useState(false);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs,busy]);

  function now(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});}

  async function send(txt){
    if(!txt.trim()||busy)return;
    setMsgs(m=>[...m,{r:"usr",t:txt,ts:now()}]);
    setInp("");setBusy(true);
    const nh=[...hist,{role:"user",content:txt}];
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:SYS,messages:nh})});
      const d=await res.json();
      const reply=d.content?.map(b=>b.text||"").join("\n").trim()||"Please try again.";
      setHist([...nh,{role:"assistant",content:reply}]);
      setMsgs(m=>[...m,{r:"bot",t:reply,ts:now()}]);
    }catch{
      setMsgs(m=>[...m,{r:"bot",t:"⚠️ Connection issue. Please try again.",ts:now()}]);
    }finally{setBusy(false);}
  }

  const fmt=t=>t.split("\n").map((l,i,a)=><span key={i}>{l}{i<a.length-1&&<br/>}</span>);

  return(
    <>
      <button className="bot-fab" onClick={()=>setOpen(o=>!o)}>
        {open
          ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        }
      </button>
      {open&&(
        <div className="bot-win">
          <div className="bot-head">
            <div className="bot-avi-row">
              <div className="bot-avi">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <div className="bot-name">Nova AI</div>
                <div style={{fontSize:10.5,color:busy?"#fbbf24":"#22c55e"}}>{busy?"Thinking…":"● Online"}</div>
              </div>
            </div>
            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>{setMsgs([{r:"bot",t:"Chat cleared.",ts:now()}]);setHist([]);}}
                style={{background:"none",border:"1px solid var(--border)",color:"var(--t3)",cursor:"pointer",borderRadius:5,padding:"2px 7px",fontSize:10.5,fontFamily:"inherit"}}>Clear</button>
              <button style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:19,lineHeight:1,paddingTop:1}} onClick={()=>setOpen(false)}>×</button>
            </div>
          </div>
          <div className="bot-msgs">
            {msgs.map((m,i)=>(
              <div key={i} className={`msg msg-${m.r}`}>
                <div className="bubble">{fmt(m.t)}</div>
                <div className="msg-t">{m.ts}</div>
              </div>
            ))}
            {busy&&<div className="msg msg-bot"><div className="bubble"><div className="dots"><span/><span/><span/></div></div></div>}
            <div ref={endRef}/>
          </div>
          <div className="bot-suggs">{SUGGS.map(s=><button key={s} className="sugg" onClick={()=>send(s)}>{s}</button>)}</div>
          <div className="bot-inp-row">
            <input className="bot-inp" value={inp} onChange={e=>setInp(e.target.value)}
              placeholder="Ask about any compliance issue…"
              onKeyDown={e=>e.key==="Enter"&&send(inp)} disabled={busy}/>
            <button className="bot-send" onClick={()=>send(inp)} disabled={busy} style={{opacity:busy?0.5:1}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────── ADD MODAL ─────────────── */
function AddModal({onClose,onAdd}){
  const [f,setF]=useState({title:"",cat:"GMP",severity:"medium",description:"",regulation:"",timeline:"",cost:"Medium",solutions:""});
  const upd=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{
    if(!f.title.trim()||!f.description.trim())return;
    onAdd({...f,id:"c"+Date.now(),catIcon:CICONS[f.cat]||"📁",status:"open",custom:true,
      solutions:f.solutions.split("\n").filter(x=>x.trim())});
    onClose();
  };
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div className="modal-title" style={{marginBottom:0}}>Add Custom Issue</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--t3)",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
        </div>
        <div className="fg">
          <label className="fl">Issue Title *</label>
          <input className="fc" value={f.title} onChange={e=>upd("title",e.target.value)} placeholder="e.g. Missing SOP for cleaning validation"/>
        </div>
        <div className="form-row">
          <div className="fg">
            <label className="fl">Category</label>
            <select className="fc" value={f.cat} onChange={e=>upd("cat",e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
          </div>
          <div className="fg">
            <label className="fl">Severity</label>
            <select className="fc" value={f.severity} onChange={e=>upd("severity",e.target.value)}>
              {Object.entries(SEV).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Description *</label>
          <textarea className="fc" value={f.description} onChange={e=>upd("description",e.target.value)} placeholder="Describe the compliance issue in detail…"/>
        </div>
        <div className="fg">
          <label className="fl">Regulation Reference</label>
          <input className="fc" value={f.regulation} onChange={e=>upd("regulation",e.target.value)} placeholder="e.g. 21 CFR Part 211.68"/>
        </div>
        <div className="form-row">
          <div className="fg">
            <label className="fl">Timeline</label>
            <input className="fc" value={f.timeline} onChange={e=>upd("timeline",e.target.value)} placeholder="30–60 days"/>
          </div>
          <div className="fg">
            <label className="fl">Cost Impact</label>
            <select className="fc" value={f.cost} onChange={e=>upd("cost",e.target.value)}>{["Low","Medium","High"].map(c=><option key={c}>{c}</option>)}</select>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Solutions (one per line)</label>
          <textarea className="fc" value={f.solutions} onChange={e=>upd("solutions",e.target.value)}
            placeholder={"Implement electronic records…\nTrain all personnel on ALCOA+…\nConduct monthly internal audits…"} style={{minHeight:88}}/>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:4}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={submit}>Add Issue</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── MAIN APP ─────────────── */
export default function App(){
  const [view,setView]=useState("dash");
  const [issues,setIssues]=useState(SEED);
  const [sel,setSel]=useState(null);
  const [prev,setPrev]=useState("list");
  const [q,setQ]=useState("");
  const [fSev,setFSev]=useState("all");
  const [fStat,setFStat]=useState("all");
  const [showAdd,setShowAdd]=useState(false);

  const open=(iss,from="list")=>{setSel(iss);setPrev(from);setView("detail");};
  const updStat=(id,s)=>setIssues(is=>is.map(i=>i.id===id?{...i,status:s}:i));
  const addIssue=iss=>setIssues(is=>[iss,...is]);
  const delIssue=id=>{setIssues(is=>is.filter(i=>i.id!==id));setView(prev);};

  const filtered=issues.filter(i=>{
    const qLow=q.toLowerCase();
    return(i.title.toLowerCase().includes(qLow)||i.description.toLowerCase().includes(qLow))
      &&(fSev==="all"||i.severity===fSev)
      &&(fStat==="all"||i.status===fStat);
  });

  const critN=issues.filter(i=>i.severity==="critical").length;
  const highN=issues.filter(i=>i.severity==="high").length;
  const resN =issues.filter(i=>i.status==="resolved").length;
  const openN=issues.filter(i=>i.status==="open").length;
  const rate =issues.length?Math.round((resN/issues.length)*100):0;
  const critOpen=issues.filter(i=>i.severity==="critical"&&i.status!=="resolved");

  const sevData=Object.entries(SEV).map(([k,v])=>({v:issues.filter(i=>i.severity===k).length,color:v.color,label:v.label})).filter(d=>d.v>0);
  const statData=[
    {v:openN,color:"#f87171",label:"Open"},
    {v:issues.filter(i=>i.status==="inprogress").length,color:"#fbbf24",label:"In Progress"},
    {v:resN, color:"#4ade80",label:"Resolved"},
  ].filter(d=>d.v>0);
  const catData=CATS.map(c=>({c,n:issues.filter(i=>i.cat===c).length})).filter(d=>d.n>0);
  const catMax=Math.max(...catData.map(d=>d.n),1);

  function exportPDF(){
    const w=window.open("","_blank");
    const rows=issues.map(i=>`
      <tr>
        <td>${i.catIcon} ${i.title}${i.custom?'<span class="custom">Custom</span>':''}</td>
        <td>${i.cat}</td>
        <td style="color:${SEV[i.severity].color};font-weight:700">${SEV[i.severity].label}</td>
        <td style="font-weight:600">${STATUS[i.status].label}</td>
        <td style="font-size:11px;color:#555">${i.regulation||"—"}</td>
        <td>${i.timeline||"—"}</td>
      </tr>`).join("");
    w.document.write(`<!DOCTYPE html><html><head><title>AuditNova Compliance Report</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:'Inter',system-ui,sans-serif;padding:48px;color:#0f172a;background:white}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #e2e8f0}
      .logo{font-size:20px;font-weight:800;letter-spacing:-0.5px}
      .logo span{color:#4f8ef7}
      .tagline{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin-top:3px}
      .date{font-size:11px;color:#94a3b8;text-align:right}
      .date strong{display:block;font-size:13px;color:#475569;margin-bottom:2px}
      h2{font-size:12px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:1px;margin:24px 0 10px}
      .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:32px}
      .sc{background:#f8fafc;border:1px solid #e2e8f0;padding:14px 16px;border-radius:8px}
      .sv{font-size:26px;font-weight:800;font-family:monospace}
      .sl{font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;margin-top:2px}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{background:#0f172a;color:white;padding:9px 11px;text-align:left;font-size:10.5px;letter-spacing:0.5px;font-weight:700}
      td{padding:9px 11px;border-bottom:1px solid #f1f5f9;vertical-align:middle}
      tr:nth-child(even) td{background:#fafbfc}
      .custom{background:#ede9fe;color:#7c3aed;font-size:10px;font-weight:700;padding:1px 6px;border-radius:4px;margin-left:6px}
      .foot{margin-top:40px;padding-top:14px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8}
      @media print{body{padding:24px}}
    </style></head><body>
    <div class="header">
      <div>
        <div class="logo">Audit<span>Nova</span></div>
        <div class="tagline">Compliance Intelligence</div>
      </div>
      <div class="date">
        <strong>Compliance Report</strong>
        Generated ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}
      </div>
    </div>
    <h2>Summary</h2>
    <div class="stats">
      <div class="sc"><div class="sv">${issues.length}</div><div class="sl">Total Issues</div></div>
      <div class="sc"><div class="sv" style="color:#ef4444">${critN}</div><div class="sl">Critical</div></div>
      <div class="sc"><div class="sv" style="color:#f97316">${highN}</div><div class="sl">High Risk</div></div>
      <div class="sc"><div class="sv" style="color:#22c55e">${resN}</div><div class="sl">Resolved</div></div>
      <div class="sc"><div class="sv" style="color:#06b6d4">${rate}%</div><div class="sl">Resolve Rate</div></div>
    </div>
    <h2>All Compliance Issues</h2>
    <table><thead><tr><th>Issue</th><th>Category</th><th>Severity</th><th>Status</th><th>Regulation</th><th>Timeline</th></tr></thead>
    <tbody>${rows}</tbody></table>
    <div class="foot"><span>AuditNova · Pharmaceutical Compliance Intelligence</span><span>Confidential — Internal Use Only</span></div>
    </body></html>`);
    w.document.close();
    setTimeout(()=>w.print(),450);
  }

  const pageNames={dash:"Overview",list:"All Issues",detail:"Issue Detail",reports:"Reports"};

  return(
    <>
      <style>{style}</style>
      {showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={addIssue}/>}
      <div className="app">
        <div className="app-bg"/>

        {/* ── SIDEBAR ── */}
        <aside className="sidebar">
          <div className="logo-area"><Logo/></div>

          <div className="sidebar-body">
            <div className="nav-group-label">Workspace</div>

            <button className={`nav-btn ${view==="dash"?"active":""}`} onClick={()=>setView("dash")}>
              {Ico.dash} Dashboard
            </button>
            <button className={`nav-btn ${view==="list"||view==="detail"?"active":""}`} onClick={()=>setView("list")}>
              {Ico.list} Issues
              {critOpen.length>0&&<span className="nav-pill">{critOpen.length}</span>}
            </button>
            <button className={`nav-btn ${view==="reports"?"active":""}`} onClick={()=>setView("reports")}>
              {Ico.rpt} Reports
            </button>

            <div className="nav-group-label">Actions</div>
            <button className="nav-btn" onClick={()=>setShowAdd(true)}>
              {Ico.add} Add Custom Issue
            </button>
          </div>

          <div className="sidebar-foot">
            <div className="user-card">
              <div className="user-avi">QA</div>
              <div>
                <div className="user-name">QA Manager</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="main">

          {/* TOPBAR */}
          <div className="topbar">
            <div className="topbar-left">
              <span className="topbar-crumb">AuditNova</span>
              <span className="topbar-crumb-sep">/</span>
              <span className="topbar-page">{pageNames[view]||"Detail"}</span>
            </div>
            <div className="topbar-right">
              <div className="status-pill"><div className="status-dot"/>Live</div>
              {view==="reports"&&(
                <button className="btn btn-primary" onClick={exportPDF}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8zm0-4h8v2H8z"/></svg>
                  Export PDF
                </button>
              )}
            </div>
          </div>

          <div className="content">

            {/* ══ DASHBOARD ══ */}
            {view==="dash"&&(
              <div>
                <div className="pg-head">
                  <div className="pg-title">Compliance Overview</div>
                  <div className="pg-sub">{new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} · Pharmaceutical Quality Intelligence</div>
                </div>

                <div className="stats">
                  {[
                    {label:"Total Issues", v:issues.length,  sub:"All areas",       ac:"#4f8ef7"},
                    {label:"Critical",     v:critN,           sub:"Act immediately", ac:"#ef4444"},
                    {label:"High Risk",    v:highN,           sub:"Priority review", ac:"#f97316"},
                    {label:"Resolved",     v:resN,            sub:"Issues closed",   ac:"#22c55e"},
                    {label:"Resolve Rate", v:rate+"%",        sub:"Overall progress",ac:"#2dd4bf"},
                  ].map((s,i)=>(
                    <div key={s.label} className="stat" style={{"--ac":s.ac,animationDelay:`${i*.06}s`}}>
                      <div className="stat-v">{s.v}</div>
                      <div className="stat-l">{s.label}</div>
                      <div className="stat-s">{s.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="chart-grid">
                  <div className="card">
                    <div className="card-head">By Severity</div>
                    <div className="donut-row">
                      <Donut data={sevData}/>
                      <div className="legend">
                        {sevData.map(d=>(
                          <div key={d.label} className="leg-row">
                            <div className="leg-swatch" style={{background:d.color}}/>
                            <span>{d.label}</span>
                            <span className="leg-n">{d.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-head">Resolution Status</div>
                    <div className="donut-row">
                      <Donut data={statData}/>
                      <div className="legend">
                        {statData.map(d=>(
                          <div key={d.label} className="leg-row">
                            <div className="leg-swatch" style={{background:d.color}}/>
                            <span>{d.label}</span>
                            <span className="leg-n">{d.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{marginTop:10,marginBottom:10}}>
                  <div className="card-head">Issues by Compliance Area</div>
                  {catData.map(({c,n})=>(
                    <div key={c} className="bar-row">
                      <div className="bar-lbl">
                        <span>{CICONS[c]} {c}</span>
                        <span style={{fontFamily:"var(--mono)",fontSize:11}}>{n}</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{width:`${(n/catMax)*100}%`,background:"var(--blue)"}}/>
                      </div>
                    </div>
                  ))}
                </div>

                {critOpen.length>0&&(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:8,margin:"18px 0 10px",fontSize:11,fontWeight:700,color:"#f87171",textTransform:"uppercase",letterSpacing:"1px"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:"#f87171",animation:"blink 1.5s infinite"}}/>
                      Critical — Requires Immediate Action
                    </div>
                    <div className="issue-list">
                      {critOpen.slice(0,5).map((iss,i)=>(
                        <div key={iss.id} className="issue-card" style={{"--sev-c":SEV[iss.severity].color,animationDelay:`${i*.05}s`}} onClick={()=>open(iss,"dash")}>
                          <div className="issue-body">
                            <div className="issue-title">{iss.title}</div>
                            <div className="issue-desc">{iss.description}</div>
                            <div className="issue-meta">
                              <span>{iss.regulation}</span>
                              <span>⏱ {iss.timeline}</span>
                            </div>
                          </div>
                          <div className="issue-right">
                            <span className={`badge ${SEV[iss.severity].cls}`}>{SEV[iss.severity].label}</span>
                            <span className={`badge ${STATUS[iss.status].cls}`}>{STATUS[iss.status].label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ══ ISSUE LIST ══ */}
            {(view==="list"||view==="detail")&&(
              <div>
                {view==="detail"&&sel?(
                  <>
                    <button className="back" onClick={()=>setView(prev)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round"/></svg>
                      Back to {prev==="dash"?"Dashboard":"Issues"}
                    </button>

                    <div className="detail">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                        <div>
                          <div className="detail-title">{sel.title}</div>
                          <div style={{fontSize:12,color:"var(--t2)",marginTop:4}}>{sel.regulation}</div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                          <span className={`badge ${SEV[sel.severity].cls}`}>{SEV[sel.severity].label}</span>
                          <select style={{padding:"5px 9px",background:"var(--s2)",border:"1px solid var(--border)",borderRadius:6,color:"var(--t1)",fontFamily:"inherit",fontSize:11.5,cursor:"pointer",outline:"none"}}
                            value={sel.status}
                            onChange={e=>{updStat(sel.id,e.target.value);setSel(s=>({...s,status:e.target.value}));}}>
                            {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                          </select>
                          {sel.custom&&<button className="btn btn-del" onClick={()=>delIssue(sel.id)}>Delete</button>}
                        </div>
                      </div>

                      <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.7,marginTop:12}}>{sel.description}</p>

                      <div className="detail-meta-grid">
                        {[["Category",`${sel.catIcon} ${sel.cat}`],["Timeline",sel.timeline||"—"],["Cost Impact",sel.cost||"—"],["Status",STATUS[sel.status].label],["Type",sel.custom?"Custom":"Pre-built"]].map(([k,v])=>(
                          <div key={k} className="detail-cell">
                            <div className="detail-cell-lbl">{k}</div>
                            <div className="detail-cell-val">{v}</div>
                          </div>
                        ))}
                      </div>

                      {sel.solutions?.length>0&&(
                        <>
                          <div className="sec-lbl">Recommended Solutions</div>
                          <div className="sol-list">
                            {sel.solutions.map((s,i)=>(
                              <div key={i} className="sol-item" style={{animationDelay:`${i*.06}s`}}>
                                <div className="sol-n">{i+1}</div>
                                <div className="sol-t">{s}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ):(
                  <>
                    <div className="pg-head">
                      <div className="pg-head-row">
                        <div>
                          <div className="pg-title">All Issues</div>
                          <div className="pg-sub">{filtered.length} of {issues.length} issues · Click status badge to cycle Open → In Progress → Resolved</div>
                        </div>
                        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                          Add Issue
                        </button>
                      </div>
                    </div>

                    <div className="toolbar">
                      <div className="search-wrap">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" strokeWidth="2.2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35" strokeLinecap="round"/></svg>
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search issues or regulations…"/>
                      </div>
                      <select className="fsel" value={fSev} onChange={e=>setFSev(e.target.value)}>
                        <option value="all">All Severities</option>
                        {Object.entries(SEV).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                      <select className="fsel" value={fStat} onChange={e=>setFStat(e.target.value)}>
                        <option value="all">All Statuses</option>
                        {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>

                    <div className="issue-list">
                      {filtered.length===0&&(
                        <div style={{textAlign:"center",color:"var(--t3)",padding:"52px 0",fontSize:13}}>No issues match your filters.</div>
                      )}
                      {filtered.map((iss,i)=>(
                        <div key={iss.id} className="issue-card"
                          style={{"--sev-c":SEV[iss.severity].color,animationDelay:`${i*.03}s`}}
                          onClick={()=>open(iss,"list")}>
                          <div className="issue-body">
                            <div className="issue-title">
                              {iss.title}
                              {iss.custom&&<span className="badge bcu" style={{marginLeft:8,fontSize:9.5,padding:"1px 6px"}}>Custom</span>}
                            </div>
                            <div className="issue-desc">{iss.description}</div>
                            <div className="issue-meta">
                              <span>{iss.cat}</span>
                              <span>{iss.regulation||"No ref"}</span>
                              <span>⏱ {iss.timeline||"TBD"}</span>
                            </div>
                          </div>
                          <div className="issue-right">
                            <span className={`badge ${SEV[iss.severity].cls}`}>{SEV[iss.severity].label}</span>
                            <span className={`badge ${STATUS[iss.status].cls}`}
                              title="Click to cycle status"
                              onClick={e=>{e.stopPropagation();updStat(iss.id,iss.status==="open"?"inprogress":iss.status==="inprogress"?"resolved":"open");}}>
                              {STATUS[iss.status].label}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ══ REPORTS ══ */}
            {view==="reports"&&(
              <div>
                <div className="pg-head">
                  <div className="pg-title">Compliance Reports</div>
                  <div className="pg-sub">Aggregate analysis across all regulatory domains</div>
                </div>

                <div className="chart-grid" style={{marginBottom:10}}>
                  <div className="card">
                    <div className="card-head">Severity Breakdown</div>
                    {Object.entries(SEV).map(([k,cfg])=>{
                      const n=issues.filter(i=>i.severity===k).length;
                      const pct=Math.round((n/issues.length)*100);
                      return(
                        <div key={k} className="bar-row">
                          <div className="bar-lbl">
                            <span style={{color:cfg.color,fontWeight:600}}>{cfg.label}</span>
                            <span style={{fontFamily:"var(--mono)",fontSize:11}}>{n} · {pct}%</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`,background:cfg.color}}/></div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="card">
                    <div className="card-head">Resolution Status</div>
                    {[{k:"open",c:"#f87171"},{k:"inprogress",c:"#fbbf24"},{k:"resolved",c:"#4ade80"}].map(({k,c})=>{
                      const n=issues.filter(i=>i.status===k).length;
                      const pct=Math.round((n/issues.length)*100);
                      return(
                        <div key={k} className="bar-row">
                          <div className="bar-lbl">
                            <span style={{color:c,fontWeight:600}}>{STATUS[k].label}</span>
                            <span style={{fontFamily:"var(--mono)",fontSize:11}}>{n} · {pct}%</span>
                          </div>
                          <div className="bar-track"><div className="bar-fill" style={{width:`${pct}%`,background:c}}/></div>
                        </div>
                      );
                    })}
                    <div style={{marginTop:16,padding:"13px 15px",background:"rgba(34,197,94,0.05)",border:"1px solid rgba(34,197,94,0.14)",borderRadius:7}}>
                      <div style={{fontSize:9.5,color:"var(--t3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700}}>Overall Resolve Rate</div>
                      <div style={{fontSize:30,fontWeight:800,color:"#22c55e",fontFamily:"var(--mono)",letterSpacing:"-1px",marginTop:2}}>{rate}%</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{marginBottom:10}}>
                  <div className="card-head">By Compliance Area</div>
                  {CATS.map(cat=>{
                    const all=issues.filter(i=>i.cat===cat);
                    if(!all.length)return null;
                    const cr=all.filter(i=>i.severity==="critical").length;
                    const re=all.filter(i=>i.status==="resolved").length;
                    return(
                      <div key={cat} className="rep-row">
                        <span style={{fontWeight:500}}>{CICONS[cat]} {cat}</span>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          {cr>0&&<span className="badge bc">{cr} critical</span>}
                          <span style={{fontSize:11,color:"#4ade80",fontFamily:"var(--mono)"}}>{re} resolved</span>
                          <span style={{fontSize:11,color:"var(--blue)",fontFamily:"var(--mono)",fontWeight:700}}>{all.length} total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="card">
                  <div className="card-head">Priority Actions · Critical Unresolved</div>
                  {critOpen.length===0&&(
                    <div style={{textAlign:"center",color:"#22c55e",padding:"18px 0",fontWeight:600,fontSize:13}}>✓ All critical issues resolved</div>
                  )}
                  {critOpen.map(iss=>(
                    <div key={iss.id} className="rep-row" style={{cursor:"pointer"}} onClick={()=>open(iss,"reports")}>
                      <div>
                        <div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{iss.catIcon} {iss.title}</div>
                        <div style={{fontSize:10.5,color:"var(--t3)",fontFamily:"var(--mono)"}}>{iss.regulation}</div>
                      </div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
                        <span style={{fontSize:11,color:"var(--t3)"}}>⏱ {iss.timeline}</span>
                        <span className={`badge ${STATUS[iss.status].cls}`}>{STATUS[iss.status].label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>{/* /content */}
        </div>{/* /main */}

        <ChatBot/>
      </div>
    </>
  );
}

