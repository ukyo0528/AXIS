import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Noto+Serif+JP:wght@200;300;400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fafafa; color: #3a3a3a; font-family: 'Noto Serif JP', serif; -webkit-tap-highlight-color: transparent; }

  @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Common ── */
  .screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px 48px; background: #fafafa;
    opacity: 0; animation: fadeIn 0.6s ease forwards;
  }
  .back-btn {
    position: fixed; top: 24px; left: 24px; background: none; border: none;
    font-family: 'Noto Serif JP', serif; font-size: 11px; color: #bbb;
    letter-spacing: 0.2em; cursor: pointer; transition: color 0.2s;
    display: flex; align-items: center; gap: 6px; z-index: 200;
  }
  .back-btn:hover { color: #555; }
  .screen-label { font-size: 10px; letter-spacing: 0.35em; color: #888; text-transform: uppercase; margin-bottom: 36px; }
  .screen-heading { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: #222; letter-spacing: 0.06em; margin-bottom: 12px; text-align: center; }
  .screen-desc { font-size: 12px; font-weight: 300; color: #666; letter-spacing: 0.08em; line-height: 2; text-align: center; max-width: 280px; margin-bottom: 48px; }
  .choice-group { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 320px; }
  .btn-primary { background: #222; color: #fafafa; border: none; padding: 16px 48px; font-family: 'Noto Serif JP', serif; font-size: 13px; font-weight: 300; letter-spacing: 0.2em; cursor: pointer; transition: background 0.25s, transform 0.15s; }
  .btn-primary:hover { background: #444; transform: translateY(-1px); }
  .btn-outline { background: transparent; color: #444; border: 1px solid #ccc; padding: 18px 24px; font-family: 'Noto Serif JP', serif; font-size: 13px; font-weight: 300; letter-spacing: 0.1em; cursor: pointer; width: 100%; max-width: 320px; text-align: left; transition: border-color 0.2s, color 0.2s, transform 0.15s; display: flex; align-items: center; justify-content: space-between; }
  .btn-outline:hover { border-color: #888; color: #111; transform: translateY(-1px); }
  .btn-outline .arrow { font-size: 18px; font-weight: 100; color: #bbb; transition: color 0.2s, transform 0.2s; }
  .btn-outline:hover .arrow { color: #555; transform: translateX(4px); }
  .btn-outline .sub-label { font-size: 10px; color: #777; letter-spacing: 0.06em; margin-top: 3px; display: block; }
  .btn-outline .btn-content { display: flex; flex-direction: column; align-items: flex-start; }
  .logo-mark { width: 68px; height: 68px; margin-bottom: 28px; }
  .app-title { font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 50px; letter-spacing: 0.22em; color: #222; margin-bottom: 6px; }
  .app-subtitle { font-weight: 300; font-size: 11px; letter-spacing: 0.3em; color: #777; text-transform: uppercase; margin-bottom: 60px; }
  .divider { width: 1px; height: 44px; background: #d0d0d0; margin: 0 auto 44px; }
  .tagline { font-weight: 300; font-size: 13px; color: #555; letter-spacing: 0.1em; line-height: 2.1; text-align: center; margin-bottom: 52px; max-width: 260px; }
  .ext-note { margin-top: 28px; font-size: 10px; color: #777; letter-spacing: 0.1em; text-align: center; }

  /* ── MBTI Type Selection ── */
  .type-screen { min-height: 100vh; padding: 84px 20px 60px; background: #fafafa; opacity: 0; animation: fadeIn 0.6s ease forwards; }
  .type-screen-inner { max-width: 420px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
  .group-label { font-size: 9px; letter-spacing: 0.4em; color: #888; text-transform: uppercase; margin-bottom: 3px; }
  .group-desc { font-size: 10px; color: #777; letter-spacing: 0.05em; margin-bottom: 10px; }
  .type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 100%; margin-bottom: 20px; }
  .type-card { background: #fff; border: 1px solid #e8e8e8; padding: 12px 4px; cursor: pointer; text-align: center; transition: all 0.15s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .type-card:hover { border-color: #aaa; background: #f5f5f5; transform: translateY(-2px); }
  .type-card.selected { border-color: #333 !important; background: #efefef !important; }
  .type-code { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-weight: 400; color: #222; }
  .type-name { font-size: 8px; color: #888; letter-spacing: 0.03em; line-height: 1.4; }
  .group-sep { width: 100%; height: 1px; background: #ececec; margin: 4px 0 20px; }
  .confirm-area { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 20px; padding-top: 24px; border-top: 1px solid #ececec; }
  .selected-display { font-family: 'Cormorant Garamond', serif; font-size: 34px; font-weight: 300; color: #222; letter-spacing: 0.14em; min-height: 44px; }
  .selected-name { font-size: 11px; color: #666; letter-spacing: 0.1em; min-height: 18px; margin-bottom: 6px; }
  .btn-confirm { background: #222; color: #fafafa; border: none; padding: 15px 48px; font-family: 'Noto Serif JP', serif; font-size: 12px; font-weight: 300; letter-spacing: 0.2em; cursor: pointer; transition: all 0.25s; opacity: 0.2; pointer-events: none; }
  .btn-confirm.active { opacity: 1; pointer-events: auto; }
  .btn-confirm.active:hover { background: #444; transform: translateY(-1px); }

  /* ── Quiz Intro ── */
  .quiz-intro-quote { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; font-style: italic; color: #555; letter-spacing: 0.06em; line-height: 1.9; text-align: center; max-width: 300px; margin-bottom: 48px; }

  /* ── Quiz ── */
  .quiz-screen { min-height: 100vh; padding: 0; background: #fafafa; display: flex; flex-direction: column; opacity: 0; animation: fadeIn 0.4s ease forwards; }
  .quiz-progress { height: 2px; background: #eeeeee; width: 100%; flex-shrink: 0; }
  .quiz-progress-fill { height: 100%; background: #888; transition: width 0.5s ease; }
  .quiz-header { padding: 18px 24px 0; display: flex; justify-content: space-between; align-items: center; }
  .quiz-phase-lbl { font-size: 9px; color: #888; letter-spacing: 0.3em; text-transform: uppercase; }
  .quiz-counter { font-size: 10px; color: #888; letter-spacing: 0.1em; }
  .quiz-body { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 32px 24px 24px; max-width: 480px; margin: 0 auto; width: 100%; }
  .quiz-q-text { font-family: 'Noto Serif JP', serif; font-size: 15px; font-weight: 300; color: #2a2a2a; line-height: 2.2; letter-spacing: 0.06em; text-align: center; margin-bottom: 40px; }

  .scale-wrap { width: 100%; }
  .scale-extremes { display: flex; justify-content: space-between; margin-bottom: 10px; }
  .scale-extreme-txt { font-size: 9px; color: #888; letter-spacing: 0.08em; }
  .scale-row { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px; margin-bottom: 5px; }
  .scale-btn { border: 1px solid #e0e0e0; background: #fff; padding: 11px 0; font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #999; cursor: pointer; transition: all 0.15s; text-align: center; }
  .scale-btn:hover { border-color: #aaa; color: #333; background: #f8f8f8; }
  .scale-btn.sel { background: #222; border-color: #222; color: #fff; }

  .ab-wrap { display: flex; flex-direction: column; gap: 12px; }
  .ab-btn { border: 1px solid #ddd; background: #fff; padding: 20px 20px; font-family: 'Noto Serif JP', serif; font-size: 14px; font-weight: 300; color: #444; cursor: pointer; text-align: left; letter-spacing: 0.08em; transition: all 0.15s; display: flex; align-items: center; gap: 14px; }
  .ab-btn:hover { border-color: #aaa; color: #111; }
  .ab-btn.sel { background: #222; border-color: #222; color: #fff; }
  .ab-letter { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 300; opacity: 0.35; flex-shrink: 0; }
  .ab-btn.sel .ab-letter { opacity: 0.6; color: #fff; }

  .quiz-next { margin-top: 32px; padding: 14px 0; width: 100%; background: #222; color: #fafafa; border: none; font-family: 'Noto Serif JP', serif; font-size: 12px; letter-spacing: 0.25em; cursor: pointer; transition: background 0.2s, opacity 0.3s; opacity: 0; pointer-events: none; }
  .quiz-next.show { opacity: 1; pointer-events: auto; }
  .quiz-next:hover { background: #444; }

  /* ── Loading ── */
  .loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
  .loading-dots { display: flex; gap: 9px; margin-bottom: 28px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; background: #ccc; animation: pulse 1.2s ease-in-out infinite; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }
  .loading-text { font-size: 11px; color: #888; letter-spacing: 0.3em; }

  /* ── Quiz Result ── */
  .result-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 28px 60px; background: #fafafa; opacity: 0; animation: fadeIn 0.9s ease forwards; }
  .result-label { font-size: 9px; letter-spacing: 0.45em; color: #888; text-transform: uppercase; margin-bottom: 20px; }
  .result-philosopher { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-weight: 300; color: #aaa; letter-spacing: 0.2em; margin-bottom: 8px; }
  .result-type-name { font-family: 'Cormorant Garamond', serif; font-size: 44px; font-weight: 300; color: #1a1a1a; letter-spacing: 0.08em; margin-bottom: 4px; line-height: 1.2; }
  .result-type-en { font-size: 10px; color: #888; letter-spacing: 0.25em; margin-bottom: 36px; }
  .result-rule { width: 36px; height: 1px; background: #d0d0d0; margin: 0 auto 32px; }
  .result-desc { font-size: 13px; font-weight: 300; color: #444; letter-spacing: 0.07em; line-height: 2.3; text-align: center; max-width: 300px; margin-bottom: 16px; }
  .result-sub-block { background: #f5f5f5; border-left: 2px solid #ddd; padding: 14px 18px; width: 100%; max-width: 300px; margin-bottom: 44px; }
  .result-sub-label { font-size: 9px; color: #777; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 4px; }
  .result-sub-name { font-size: 13px; color: #444; letter-spacing: 0.1em; }
  .result-sub-desc { font-size: 11px; color: #666; letter-spacing: 0.07em; line-height: 1.8; margin-top: 4px; }



  /* ── Library ── */
  .lib-screen { min-height:100vh; background:#fafafa; padding:72px 0 48px; opacity:0; animation:fadeIn 0.6s ease forwards; }
  .lib-header { text-align:center; padding:0 24px 24px; }
  .lib-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; color:#222; letter-spacing:0.18em; margin-bottom:4px; }
  .lib-sub { font-size:9px; letter-spacing:0.35em; color:#999; text-transform:uppercase; }
  .lib-tabs { display:flex; border-bottom:1px solid #e8e8e8; margin-bottom:0; }
  .lib-tab { flex:1; padding:13px 0; font-family:'Noto Serif JP',serif; font-size:11px; font-weight:300;
    letter-spacing:0.15em; color:#aaa; background:none; border:none; cursor:pointer; transition:all 0.2s;
    border-bottom:2px solid transparent; margin-bottom:-1px; }
  .lib-tab.active { color:#222; border-bottom-color:#222; }
  .lib-body { padding:0 20px 40px; max-width:480px; margin:0 auto; }
  .lib-cat-row { display:flex; gap:8px; flex-wrap:wrap; padding:20px 0 16px; border-bottom:1px solid #f0f0f0; }
  .lib-cat-btn { padding:8px 16px; border:1px solid #e0e0e0; background:#fff; font-family:'Noto Serif JP',serif;
    font-size:11px; font-weight:300; letter-spacing:0.1em; color:#666; cursor:pointer; transition:all 0.15s; }
  .lib-cat-btn:hover { border-color:#aaa; color:#222; }
  .lib-cat-btn.active { border-color:#222; background:#f5f5f5; color:#222; }
  .lib-section { padding-top:20px; }
  .lib-section-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:300; color:#222;
    letter-spacing:0.08em; margin-bottom:4px; }
  .lib-section-count { font-size:10px; color:#bbb; letter-spacing:0.1em; margin-bottom:16px; }
  .lib-person-list { display:flex; flex-direction:column; gap:0; }
  .lib-person-item { display:flex; align-items:center; padding:12px 0; border-bottom:1px solid #f5f5f5;
    gap:12px; cursor:default; }
  .lib-person-name { font-family:'Noto Serif JP',serif; font-size:13px; font-weight:300; color:#2a2a2a; flex:1; }
  .lib-person-years { font-size:10px; color:#666; letter-spacing:0.06em; white-space:nowrap; }
  .lib-type-badge { padding:2px 8px; font-size:9px; letter-spacing:0.08em; border:1px solid #999; color:#333;
    font-family:'Noto Serif JP',serif; white-space:nowrap; flex-shrink:0; }
  .lib-type-btn { padding:16px 14px; border:1px solid #e0e0e0; background:#fff; font-family:'Noto Serif JP',serif;
    font-size:11px; font-weight:300; letter-spacing:0.08em; color:#444; cursor:pointer; transition:all 0.15s;
    text-align:left; display:flex; flex-direction:column; }
  .lib-type-btn:hover { border-color:#888; background:#f9f9f9; }
  .lib-type-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; padding:20px 0 16px; border-bottom:1px solid #f0f0f0; }
  .lib-entry-btn { position:fixed; top:22px; right:22px; border:1px solid #333; background:#222;
    color:#f0f0f0; padding:12px 20px; font-family:'Noto Serif JP',serif; font-size:11px; letter-spacing:0.18em;
    cursor:pointer; transition:all 0.2s; z-index:150; }
  .lib-entry-btn:hover { background:#444; border-color:#555; }
  /* ── DeepDive screens ── */
  .dd-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 80px 24px 52px; background: #fafafa;
    opacity: 0; animation: fadeIn 0.6s ease forwards;
  }
  .dd-scroll {
    min-height: 100vh; padding: 80px 20px 60px; background: #fafafa;
    opacity: 0; animation: fadeIn 0.6s ease forwards;
  }
  .dd-inner { max-width: 420px; margin: 0 auto; }

  .dd-label { font-size: 10px; letter-spacing: 0.35em; color: #444; text-transform: uppercase; text-align: center; margin-bottom: 36px; }
  .dd-heading {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 300; color: #222;
    letter-spacing: 0.06em; text-align: center; margin-bottom: 10px; line-height: 1.6;
  }
  .dd-desc { font-size: 12px; font-weight: 300; color: #444; letter-spacing: 0.08em; line-height: 2; text-align: center; max-width: 280px; margin: 0 auto 40px; }

  /* scene grid */
  .dd-scene-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; max-width: 360px; margin-bottom: 8px; }
  .dd-scene-card {
    border: 1px solid #e8e8e8; background: #fff;
    padding: 20px 16px; cursor: pointer; text-align: left;
    transition: all 0.18s; position: relative; overflow: hidden;
  }
  .dd-scene-card:hover { border-color: #aaa; transform: translateY(-2px); }
  .dd-scene-card.sel { border-color: #222; background: #f7f7f7; }
  .dd-scene-card.sel::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #222; }
  .dd-scene-emoji { font-size: 20px; margin-bottom: 8px; display: block; }
  .dd-scene-label { font-family: 'Cormorant Garamond', serif; font-size: 18px; font-weight: 300; color: #222; margin-bottom: 3px; }
  .dd-scene-sub { font-size: 9px; color: #666; letter-spacing: 0.06em; line-height: 1.5; }

  /* action card */
  .dd-action-card {
    background: #f9f9f9; border: 1px solid #d0d0d0;
    padding: 32px 28px; width: 100%; max-width: 380px; margin-bottom: 20px;
    position: relative;
  }
  .dd-action-card::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 1px; background: #999; }
  .dd-action-tag { font-size: 9px; letter-spacing: 0.35em; color: #444; text-transform: uppercase; margin-bottom: 18px; }
  .dd-action-text { font-size: 15px; font-weight: 300; color: #222; line-height: 2.2; letter-spacing: 0.06em; margin-bottom: 28px; }
  .dd-action-divider { width: 28px; height: 1px; background: #aaa; margin-bottom: 18px; }
  .dd-action-quote { font-family: 'Cormorant Garamond', serif; font-size: 15px; font-style: italic; color: #444; line-height: 1.9; letter-spacing: 0.04em; margin-bottom: 8px; }
  .dd-action-person { font-size: 10px; color: #777; letter-spacing: 0.15em; }

  /* notification box */
  .dd-notif-box {
    border: 1px solid #e8e8e8; background: #f8f8f8;
    padding: 16px 20px; width: 100%; max-width: 380px;
    margin-bottom: 16px; display: flex; align-items: center; gap: 12px;
  }
  .dd-notif-text { font-size: 11px; color: #444; letter-spacing: 0.07em; line-height: 1.8; flex: 1; }
  .dd-notif-btn {
    border: 1px solid #ccc; color: #555; background: transparent;
    padding: 8px 16px; font-family: 'Noto Serif JP', serif;
    font-size: 10px; letter-spacing: 0.12em; cursor: pointer;
    transition: all 0.2s; white-space: nowrap; flex-shrink: 0;
  }
  .dd-notif-btn:hover { background: #f0f0f0; border-color: #888; }

  /* feedback */
  .dd-fb-group { display: flex; flex-direction: column; gap: 10px; width: 100%; max-width: 360px; }
  .dd-fb-btn {
    border: 1px solid #bbb; background: #fff; color: #222;
    padding: 20px 24px; font-family: 'Noto Serif JP', serif;
    font-size: 13px; font-weight: 300; letter-spacing: 0.1em;
    cursor: pointer; text-align: left; transition: all 0.15s;
    display: flex; align-items: center; gap: 14px;
  }
  .dd-fb-btn:hover { border-color: #222; color: #111; background: #f5f5f5; }
  .dd-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  /* returning user floating btn */
  .s1-dd-btn {
    position: fixed; top: 82px; right: 22px;
    border: 1px solid #333; background: #222; color: #f0f0f0;
    padding: 12px 20px; font-family: 'Noto Serif JP', serif;
    font-size: 11px; letter-spacing: 0.18em;
    cursor: pointer; transition: all 0.2s; z-index: 200;
  }
  .s1-dd-btn:hover { background: #444; border-color: #555; }

  /* deepdive entry button on card screens */
  .dd-entry-btn {
    border: 1px solid #e0e0e0; background: #fff;
    padding: 20px 24px; width: 100%;
    font-family: 'Noto Serif JP', serif; font-size: 13px; font-weight: 300;
    letter-spacing: 0.1em; cursor: pointer; color: #444;
    transition: all 0.2s; display: flex; align-items: center;
    justify-content: space-between; margin-top: 12px;
  }
  .dd-entry-btn:hover { border-color: #888; color: #111; }
  .dd-entry-inner { display: flex; flex-direction: column; align-items: flex-start; }
  .dd-entry-sub { font-size: 10px; color: #bbb; letter-spacing: 0.08em; margin-top: 3px; }
  .dd-entry-arrow { font-size: 18px; font-weight: 100; color: #bbb; transition: transform 0.2s; }
  .dd-entry-btn:hover .dd-entry-arrow { transform: translateX(4px); color: #555; }
  /* ── Result image ── */
  .result-img-wrap { width: 140px; height: 140px; border-radius: 50%; overflow: hidden; border: 1px solid #e0e0e0; margin-bottom: 24px; flex-shrink: 0; }
  .result-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }

  /* ── Card image ── */
  .phil-img-wrap { width: 100%; height: 180px; overflow: hidden; margin-bottom: 20px; flex-shrink: 0; }
  .phil-img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: center 15%; }

  /* ── Cards Screen ── */
  .cards-screen { min-height: 100vh; padding: 64px 0 24px; background: #fafafa; display: flex; flex-direction: column; align-items: center; opacity: 0; animation: fadeIn 0.6s ease forwards; }
  .cards-header { text-align: center; padding: 0 24px 24px; }
  .cards-type-lbl { font-size: 9px; letter-spacing: 0.4em; color: #888; text-transform: uppercase; margin-bottom: 5px; }
  .cards-type-name { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 300; color: #444; letter-spacing: 0.1em; }
  .card-viewport { width: 100%; max-width: 400px; padding: 0 20px; flex: 1; display: flex; flex-direction: column; }
  .phil-card { background: #fff; border: 1px solid #e8e8e8; padding: 32px 26px 26px; flex: 1; display: flex; flex-direction: column; min-height: 420px; opacity: 0; animation: fadeIn 0.4s ease forwards; }
  .phil-cat { font-size: 9px; letter-spacing: 0.3em; color: #888; text-transform: uppercase; margin-bottom: 16px; }
  .phil-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; font-weight: 300; color: #1a1a1a; letter-spacing: 0.06em; margin-bottom: 3px; }
  .phil-years { font-size: 10px; color: #888; letter-spacing: 0.1em; margin-bottom: 24px; }
  .phil-rule { width: 28px; height: 1px; background: #e0e0e0; margin-bottom: 20px; }
  .phil-quote { font-family: 'Cormorant Garamond', serif; font-size: 17px; font-weight: 300; font-style: italic; color: #333; line-height: 1.9; letter-spacing: 0.04em; margin-bottom: 22px; flex: 1; }
  .phil-philosophy { font-size: 11px; font-weight: 300; color: #555; letter-spacing: 0.07em; line-height: 2; }
  .cards-nav { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 20px 24px 12px; }
  .nav-btn { width: 42px; height: 42px; border: 1px solid #e0e0e0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #aaa; transition: all 0.15s; }
  .nav-btn:hover:not(:disabled) { border-color: #888; color: #333; }
  .nav-btn:disabled { opacity: 0.2; cursor: default; }
  .nav-dots { display: flex; gap: 7px; }
  .nav-dot { width: 6px; height: 6px; border-radius: 50%; background: #ddd; transition: background 0.2s; }
  .nav-dot.on { background: #555; }
  .cards-back { font-size: 11px; color: #888; letter-spacing: 0.15em; background: none; border: none; cursor: pointer; padding: 8px; transition: color 0.2s; }
  .cards-back:hover { color: #666; }
`;

/* ═══════════════════════════════════════════════════
   QUIZ DATA
═══════════════════════════════════════════════════ */
const PHASES = [
  { id:1, label:"PHASE 1", name:"普段の考え方", qs:[1,2,3,4,5] },
  { id:2, label:"PHASE 2", name:"価値観",       qs:[6,7,8,9,10] },
  { id:3, label:"PHASE 3", name:"選択",         qs:[11,12,13,14,15] },
  { id:4, label:"PHASE 4", name:"思考スタイル", qs:[16,17,18,19,20] },
  { id:5, label:"PHASE 5", name:"生き方",       qs:[21,22,23,24,25] },
  { id:6, label:"PHASE 6", name:"内面",         qs:[26,27,28,29,30] },
  { id:7, label:"PHASE 7", name:"判断",         qs:[31,32,33,34,35] },
  { id:8, label:"PHASE 8", name:"核心",         qs:[36,37,38,39,40] },
];

const QUESTIONS = [
  { id:1,  type:"scale", text:"物事を見ると、まず「なぜそうなるのか」を考える方だ。" },
  { id:2,  type:"scale", text:"大きな成功より、安定した心地よさを大切にしたい。" },
  { id:3,  type:"scale", text:"多数派と違っても、自分の道を行きたい。" },
  { id:4,  type:"scale", text:"直感より、筋道や証拠を重視する。" },
  { id:5,  type:"scale", text:"まず「こうあるべき」という理想像を思い描いてから動く。" },
  { id:6,  type:"scale", text:"変えられないことに悩み続けるのは、もったいないと思う。" },
  { id:7,  type:"scale", text:"人生に決められた正解はないと思う。" },
  { id:8,  type:"scale", text:"机上の理論より、まず試して確かめたい。" },
  { id:9,  type:"scale", text:"会話では、結論よりも相手の考えの背景を知りたくなる。" },
  { id:10, type:"scale", text:"ものごとの「美しさ」や「格好よさ」が、判断の大きな基準になる。" },
  { id:11, type:"ab",    text:"迷ったときは？",               optA:"正解を早く出したい",       optB:"問いを深めたい" },
  { id:12, type:"ab",    text:"何かを選ぶときは？",           optA:"現実に合わせる",           optB:"理想に近づける" },
  { id:13, type:"scale", text:"周りに合わせるより、自分で意味を作りたい。" },
  { id:14, type:"scale", text:"困難が来ても、まず受け止めてから対処したい。" },
  { id:15, type:"scale", text:"小さな楽しみを積み重ねるほうが、幸福に近いと思う。" },
  { id:16, type:"scale", text:"根拠が弱い意見は、すぐには信じない。" },
  { id:17, type:"scale", text:"世界は、まだもっと良くできると思う。" },
  { id:18, type:"scale", text:"自分の意見でも、納得できなければ後から変えるのは自然だと思う。" },
  { id:19, type:"scale", text:"極端な考えより、バランスの取れた考え方に安心感がある。" },
  { id:20, type:"scale", text:"苦しさや逆境も、自分を強くする材料だと考えやすい。" },
  { id:21, type:"scale", text:"刺激が強い毎日より、穏やかな毎日のほうが好きだ。" },
  { id:22, type:"scale", text:"自由は重いが、それでも自分で選びたい。" },
  { id:23, type:"scale", text:"感情に流されるより、まず態度を整えたい。" },
  { id:24, type:"scale", text:"既存の常識や価値観は、しばしば疑うべきだと思う。" },
  { id:25, type:"scale", text:"経験や観察から学ぶほうが、しっくりくる。" },
  { id:26, type:"scale", text:"深い会話をしている時間が好きだ。" },
  { id:27, type:"scale", text:"心地よさのためなら、無理に競争しなくてもいいと思う。" },
  { id:28, type:"scale", text:"「本当にそうか？」を確かめる作業が苦ではない。" },
  { id:29, type:"scale", text:"他人に理解されなくても、自分らしさを優先したい。" },
  { id:30, type:"scale", text:"人は、自分の選択に責任を持つべきだと思う。" },
  { id:31, type:"ab",    text:"迷ったら？",                   optA:"理想を優先する",           optB:"現実の役立ちを優先する" },
  { id:32, type:"ab",    text:"わくわくする刺激と、落ち着く心地よさなら？", optA:"刺激",      optB:"心地よさ" },
  { id:33, type:"scale", text:"「受け入れて進む」ほうが、自分には合っている。" },
  { id:34, type:"scale", text:"まず疑ってから考えるほうだ。" },
  { id:35, type:"scale", text:"人生は、自分で意味を作るものだと思う。" },
  { id:36, type:"scale", text:"本当に価値あるものは、簡単には手に入らないと思う。" },
  { id:37, type:"ab",    text:"安心できるレールと、自由な選択なら？", optA:"安心なレール",    optB:"自由な選択" },
  { id:38, type:"scale", text:"自分を一言で固定されるのが、少し苦手だ。" },
  { id:39, type:"scale", text:"不調のときでも、できる行動に集中したい。" },
  { id:40, type:"scale", text:"あなたは、「どう生きるべきか」を考えることが多い。" },
];

// weight: multiply by scale pts (0/1/2/3)
const SCORING = {
  1:  { scale: {SOC:3, DEC:1} },
  2:  { scale: {EPI:3, STO:1} },
  3:  { scale: {NIE:3, SAR:1} },
  4:  { scale: {DEC:3, ARI:1} },
  5:  { scale: {PLA:3, NIE:1} },
  6:  { scale: {STO:3, EPI:1} },
  7:  { scale: {SAR:3, NIE:1} },
  8:  { scale: {ARI:3, STO:1} },
  9:  { scale: {SOC:3, SAR:1} },
  10: { scale: {PLA:3, NIE:1} },
  11: { ab: { A:{ARI:2,DEC:1}, B:{SOC:3} } },
  12: { ab: { A:{ARI:3,STO:1}, B:{PLA:3,NIE:1} } },
  13: { scale: {NIE:3, SAR:2} },
  14: { scale: {STO:3, ARI:1} },
  15: { scale: {EPI:3, STO:1} },
  16: { scale: {DEC:3, ARI:1} },
  17: { scale: {PLA:3, NIE:1} },
  18: { scale: {SOC:3, DEC:1} },
  19: { scale: {ARI:3, STO:1} },
  20: { scale: {NIE:3, STO:1} },
  21: { scale: {EPI:3, STO:1} },
  22: { scale: {SAR:3, NIE:1} },
  23: { scale: {STO:3, DEC:1} },
  24: { scale: {NIE:3, DEC:2} },
  25: { scale: {ARI:3, DEC:1} },
  26: { scale: {SOC:3, SAR:1} },
  27: { scale: {EPI:3, STO:1} },
  28: { scale: {DEC:3, SOC:1} },
  29: { scale: {NIE:3, SAR:1} },
  30: { scale: {SAR:3, STO:1} },
  31: { ab: { A:{PLA:3,NIE:1}, B:{ARI:3,STO:1} } },
  32: { ab: { A:{NIE:3,SAR:1}, B:{EPI:3,STO:1} } },
  33: { scale: {STO:3, ARI:1} },
  34: { scale: {DEC:3, SOC:1} },
  35: { scale: {SAR:3, NIE:2} },
  36: { scale: {NIE:2, PLA:2, STO:1} },
  37: { ab: { A:{EPI:3,STO:1}, B:{SAR:3,NIE:2} } },
  38: { scale: {SAR:3, NIE:1} },
  39: { scale: {STO:3, ARI:1} },
  40: { scale: {SOC:2, PLA:2, SAR:1} },
};

const PHIL_IMGS = {
  SOC: "data:image/jpeg;base64,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",
  PLA: "data:image/jpeg;base64,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",
  ARI: "data:image/jpeg;base64,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",
  NIE: "data:image/jpeg;base64,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",
  EPI: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAFAAPADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6QrkfE/jZtLhdNLt4b24U4Jkk2ID6DHX9Kv8AjbWn0HwrdXkUZkkysagHH3jjP4DNeGy67DqP7tyYUB4UdBXPVqOLsjWEU9WdZb/FfxKZpIbqy09JV6KsbH/2bmp/+Fp6+Cf9HscD/pmw/wDZq4rRrX7drkbwyqTgkndiujvbZrVJBNEtwv8ACdvzA/Ws5VXF2KjBNXN2T4oana6S1zd21tE5OI/kba361z8/xq14XIWCDTjHjJzG2f8A0Kse+khv9Ckt52kgAO5M88iuPOmymQCKVHPTnjFR7SdtAlFX0PUU+NGqNGN0Vgr+8bY/9Cpbf4v69Ncuhg07YozkRt/8VXmbWVwCBNAyLj7wGRVvTX+xuwRVCsMHPNCqTe47J9D0wfFXXPN2rbWDjGRtjfP/AKFW7a+PdRnhR2gtlLDONrf415VBfLb3COqLu7Y71rR+IWS5CPCyLj74renUS+Jmc432PQv+E51EBv3Vsx7AKf8AGoLj4iX8EGTBbmXsAjY/nXPWkkU0KzRfMh5qtqF41qhKRFgDya2nJRVzNJt2Neb4k+Jk0150s7DzV52tG2Mf99Vj2vxo8QFn+1WdggUcbY3/APiqzZre7upVSViI2O4genpWfcWsMcjIXUDd06/nXm1Ks9o3/U3jBdToZPjN4kK+ZFZab5YOCWR+v/fVVJPjr4iSbaLLTSvr5b//ABVcxqNmjRDbK0cWdyuy/Kfy7VWhXTrkDCmRkXJbgA/T1zWkZ1LK4nC+x1Z+OHix59sdnpgQnCkwvk/+PVMnxv8AEr3Kxi00xRnDbo24/wDHq5mO0sLq8VYFFuWHyKzYGfYmqq6Mbd3G1XIb8/fmlOrNa3DkOyvvjb4lglUQ2WnsOp3RP/8AFVE/x08SxW4d7PSizdAI34+vzVxNwryZiklKbeGU8VhqHtb5hKyyI3CnHT3op1nJWb1E0kz0S7/aC8TROqxWmknI5zE55/77qKL9oPxY7fPZ6SF74hc/+z151qFsH1AsjiUMBtYLt/Sp4bFYNzEgkgYGe1aOq1G9xcup6FD+0D4qb53sNL2e0T5/9Dpsv7QnirePJsNK2EdWik6/9915rcTeSXiMmMdeOgrOmnZeFPy5/A0KpJkuyR6z/wANC+KCmz7LpHnZ7xPj/wBDqKH9ojxZJkNZaTu9onx/6HXkTHn5hyeeDUTTsowDtA9Ku8u5Nz2T/honxUuUay0nzO2Inx/6HV6w+O3i2ZPPmstI8oHkBHB+md3FeHLhoiSSG6g5qzHcSLaunmPj0B/nUyc+jGn3Prnwf8S9M8TPHZz+XZak+dsBlDrJgc7G7n2PP1rtBk818aeC3soNTtLy91E28sUwMYAPyEch8/WvsWyuUurGC4R1dZUDhlOQcjtWtKo3eMt0NrS5y3xKLN4Mk6j9/H0+teLGyiaZMqQG6nHWvbviNcxWvhGR5hlDNGvTpk15ZZ6haS27LIUjYnGWHUVFaSTsaQjdGZZaJE07pDIYH6hs4q5PHqWnoJrfUfPjPRX5yfSpJbmK0vo1tytweuaW1s5plYygxRuxOSOBWLjGTuaJtKxz949/MzPNGCCf4egoLQQoGKMrkc8VtTW/ksVdsjPHFV5SkcoXyvMUdSRVWfRkepnQ3pUFFm2k9Mmooy7XpZgjZXoQMVcuNNhlkVxEduORTItIjLM1u5UnsTUN9SkiJrVGhMkYZXXsDwKYVuVTfI+VPY8Ghrm8t7h4lVcA4Jao7nVC6hJrds46qcipTV9R9DttCubQ6REPNTdj5hu6VY1CS0hgea4ZRCvPqK86gljihyxKEnPBxWdqviCXbLbLcl4gcbQ2Qef8n8K6FUb0RnyLqdPqfjGPZthfYCDxt5Hpz61R024tprokObqVxkxOjIQPUdvw4rmILp1jbyYiZiOZDwF9MVraUk8MOXcmSTl2PU1nZs1jY3xps+oW6wTzxxQK2QF6E98Z6Z7461LF4SUzRi2DlFIyQ3YemfrWfbXEscwZjnb0zXVaTq6PIFY4x+FKXumsUpEC+DrYOpjuJonAAG9cgYGKlupb7Rwv7hJYVUfNjcHO7n3HHT6V0iyrKTFIPMX+9jpWhFYJcQFlVJBjDA85rJNvYtwSPLPE9kl09tfW6LCjggoR2z147dcVymoTKmECnLfebGcfSvSPE3h59Ojku7G3Mlv/AMtICSDH7r7e3auY1/QnlsbW9CmMyKxfcpDDAzhvU8HB70rJu7OecGtjiLovC6/PgAZUg1Ua8kaTJckmrceA7l4w64Iwaj8u1tpAzjJPIFbp20sctiN0kuGUuDvb9aW7sjCiuVySPug1LdSRxSLLA24kdBVC9unbYqLwo5PepjdtWG0iZdMmfErxbAOiHqajurO3WXZCWaQ8kHgCli1WVYWhLbt3RjyVqQRrLCZi2ZBwfp607yTuw0exmkbG2sCQO1WA0fDJkD0NaghiurN3jR5bmPrsGRt9/eqhsZJihjjbY65GF9Opp86e4crLunWkF9ZOE3JcIcg54I9MV9Z/Du3lt/hzoMM3+sjso1b64r5AEDRThAxBBz8p4r6++HMjP8N/D7OxZjYxZJOSeK0o35nroDIPiSizeD3VvumeLP8A31XlkUMcrbXCCIdNwr13xxBHP4aKP93zoyfwNeXai1tbSIgjZ16EdMe9Ku0ma007XJ4YtOublSNPVZBhQ0fAFR65PJZx4tbkk5AKNztp0V/Ba2LRoCJDyCetYd8rSJJIW4HJJNZcqeppdrQqS3l25yVEjtzwakN4xUmeJlXHpUlrAr24c43dyKmuYzDZsjKSD09RVybtdGa03ILWS3mkA8wsewz0qxPaGF98JAJ9ajtDbMF3qoJHpTtTiiZo5IXZUHHynqajm1uUloYE1vP9teYSb/mxg1OkpMwWSAA469jVuOxZI3aKYtu5OaryrdQxFyqMNvXpTTCxg+Ib1YH8tVXfjA46f54rlkZi6gEM8rcEjOff6VZ1GWS6vIfOzt2luvOM4x7GnWkQS6EgXaqcDOABn+daJW2J3LthAwUBn3ufmweAK3ozhFbdtPTPpXP2rg3UiqTk8nnitkNhRGVyeCKynPojenHqaasq4znd9M1oadbvNJuRXcKecEA1grqFtG6pLJu988CrVtdb7gJbTqXz8q55rOTN4WTO9ikaG7J82WAsBtEi5U8fh+ma1LC4uDG4ZYyA/USYyax9I1eOO2ltr5VkQRFumR93PQ96ngurNp40iBRHjWXG485OMdazTNWjtJprebSxDcQhZDkYYZ/XvXmM9lJY6/c6S2Ht2UywqxGdpGRjPocj8K9AeW3FmkaTM567WHQexrE15I3ube/Kqv2eMqWYduv+P51rJ3ZzctkeJ+IEhsriMwRtEki7tpGNrAlWHPbI/WsdLWXVLkKu0cEgtwAK6bxlYoLxHibdG4LqCclQf4effNcpcRz20ayfMpzgYq01bTc45Kz1NCPSfJgdUxJgbi+cY9qpG3knYySbY06DFRG6mWIxmRvm5wOlQm5k8oxljjOSvvRGEu5DaJxpTRx72IOPmxnqKpfOu4Ekg8AVMLyVhtViir1Oae0aNApU5brknrV3a+IW+xJo2oXWkTvPaSFGZdrcZyK0oNZnXT1tJXbZEGKAYBGeoz6VmWUIkuxCpGWHT19q6PRPCx1bUptON3Ha3KoXjSZSRIR1X2OOazqcreppG9tDE/eSurhXw/RiMZx1xX1v8NB/xbTw9/14R/yrxrSdKXShZaXrNsoNuzy280ZDhgR8wx1HWvdPCUMFt4S0yG1JMCW6qhPpWuHleTQpQsrlXx2zr4XkMYyxlQdM968bub3E4jcgy55JNeq/FHU30rwW1wnU3ESfm2K8RmMV4+/flgd2R/KnX1HB6aG35TSkOzbiOSB2qtqaK6rCDsEhwRnrVLStUW6LQAPlR1bvVDWb6GW4Ebb0aFsEg/yrJy0KvodHY2pgtERTuz7VJdpJu29V75qOzuStpEyMSrDPNSSzcbMgFuc5qrtWQ7KxUNsbcrKV+U9qil3NGhwVyeeakGpRNL9hOWYE/N61PeKFto8gDnOR3FTGzH6EYi8uMhCcEdDWVr0hGmBgclSMjOO9aW7bNv3M6kdK5/xFdNEpTZuVkJOelUlqByU89zd3w8uHfzlgvp65pXmDKLeND5pOwJgcfWprBEndVUMVLsx59AAKsJbBp3dyC8QJbBBPtVpq/KNw93mHaXChlZ+oAxk1cuIpJECgkLnGQO1Q2MZSB3BOWPJrRW1E8BU9G4yOM/h3rCe+hvDZGU17p0EZRlMuDhm681DbzacX81YXjDZwwJ5P9K3IrGKFDHJaxFP9oYJ9KqXlkjshjhVI48hQDgc+1Yb6am3mX7O6eWJI4ZWcSgKdzckela2rXl1o1wsa8yLGmxX4I9sdqyvDqRWWqWxfDANj1/GtT4g6Z5fieG6hkJS+t45G3MRggbSB+QP41nZJGquW9A+IupC7Fte2YMQyVkK7v/1Vs694iiuBbrHjybmGRWIPAbpz+Brz3SH13S7l52sFubaIb+BnIHXjPp+PpXW31rLcatZPbW8bW0+6dkY/wsFC8jgZOeelapu9jGSSRy2tam0Ojrp04YT5HbsD3P05/KuYm5RSzDFdJ461BZrlLNLRopLZvn38suBgDP8AntXHbfMO5nwMce1dEY9Tzqj1HXAjyqmTbuHHFQPHHHIFQkDHJJzmq9y+58k5C8U5JN68AYPpWqi1qZXLK22FI5+b1ppTEJCKDjgkdq1bCxW7sCTOEcnC7un4ntV+zS3062ltr2GCZHbDzK/K+n5Vi6lilG5zlrHJFcb4iQwG4H0rSOp3lxctdTuPNIADYweO9TajZSaddRog+SUBo3BzuHrWfqKNb3LwujKyHG1hg/jTTUyn7qNKx1LUYNWivobp/tCdCxyMdxz2r608E3b33gjR7qRFR5rRHIXoCRXx7ZAPAeTkDivrX4ZHPwy8Pf8AXjH/ACraglzMlt2M/wCL8iQ/D6aR1RgtxCfm6Z3da+b7/VkuJRJbn526qvAFfQvxyMS/DOcy52/aoBx/vV822VrumhUsI0BzvNKtFc9wu7WRrWWZot9vLLG6ofMPTB9KqwRXV7M0O0b0O4sx610VhNB9mZN8RlbIxkDNPis44ZBIEBZh2P8AOoUbl27lIa1cWEcSFGznbjORUUl9cXsnkPO6Mx3LgdD6VV8TR+U6zpJhs5XHrVaxtp763TDt56tkbuMCocbCbu7HX6RHJDbL9qQl88MRzitG5nhEJw3yg557Uy0lMNoqlvnHGWqG4uVeMowVs89KfLY1TshsWowFztyMcHPGay9ehjv7B1yNwyy84x+NWpIoWBBXBx1HFUbzT2ksCkTZOM88g+1WhHLafbvDHcQo3zLggDrzjj9KsWEAjWUAt527c4I5PHAqlCslhrC+YwEcrbGJ457H8632RhdBiTuHzHHH4e9U7KRqneHoVreWQymNxjecjtWtFKICySHJ7YrGupmiv0dgFPP51bimW4ucLyFHJrGpFJ3LpSurG0HQoC3HHes2eVJZlijBdu5J4FVru9dtqLnaeMjqR7VnXd46fNErR4BUMOc1nyykro354x0Z0WmgJqKNIqkBsDnAzXpuoWNnrmm6etzPGpmQKpPZlyMe2QBj6V4hpWqFy0dw8pwdoJG457YrubUaufC96TCY4I9jL5n+sOGB3ADoBj9ayaa0aNFKLtZnU6J4bbSL91e5Lxk8MwPllT2K8io/FE0GgL9pt0SJYoDCnlgDbk8D0IyR2p3hvxO93bPDK4O5QCCOtc/8QJfN0rKyMAXEbDGQRjP8/wClaU7NpIxrXSbZ59q13NqN7LPPOWLHGTg4A4wMVTvLGKG1hdZCS4yQR/KpZYDGgHXPOPSqc9ywCr1ZeFyeBXal2PMkurKTwpvbcM5HFNiyoYCP5RyR6VZlzIqyHHocetNlZIoPlILMfpQ2tiEWoII5yHdmVWHQe1GpxgiKNUVFAzgHr9ahS5kOzAAUc4oui/2gZ3EMMrj0rFK0i27rQmt71441ilHmxoCEVj9zPpTLySa5HnvlzkDee5qtIWBBO4fhTgilAu4qC2QSelXZXuhX0sy1HJEqhAxY49Ohr64+GY/4tn4e/wCvGP8AlXyPZKN7DZv39/Svrr4a5Hw08P5HP2GP+VaUviaBmD8cwD8MrgMMj7VB/wChV8tztNHNhJi6r0r6q+NcAuPhldgn7s0Tfk1fL7RCG3diBuY45p1F71xpEEd5LHy4B960rO5u5Z1X7QwTPY1lzKTGVIwR+ta+loN+SMdKxempUW3ozR1OBvtSAsxjX5hu5qtHeSxaxFh1kYj5VHFdFLErWrl8HAwfWuOvlAvy0ZwAOD6VPLrcJaG0dfubbzFuUDOCQMdqn0e/ubtJGuUPXgj0rAF21yUjlAYLxuA5NdNZXUUFt5bMoYDOavlBO7L4cfeOMMOARUch822eJDtYgjrWbdakyyHDDaemadBcgx5Dkk8ZFIq5ymvQTxn94Pn4yRjJHqTWpoUm6CPzHLg8ZJJzx05qbWLTzcsTn5cbSKkt1WO0QeX5JK7h0wop6NWGm1qVtRgeblSFIOMio7VTFcSxrkKTgn1q0kjM/msgRVYkc9fp71Se6jmPlROxOdwKg8j0pNaFJ2ZUuNQnE8kMcZLAjaqnGBU53zRxqYpkcc4wKmFlJDL9plB+YgEY6VqAnKmMjY2AA2OKTbuax5bamYbe0ihVy0sbRtkArgH68da7zRPGtnIQLgKIvL2kJjg9Pxz3qHQ4J3vYY/tEQYHC74gwJxkjH8vpUPjPQ7SOCC9t4I0uWcjEK7ST1zj6VLNHy29027fTbPTbz7XYTiS1ljJ2MeY2x6+h/SoPG9iI/DEdx5ZZ4SWJHJ7cnn069e1TaALeXRkig+ZpHVi8nA446e+TR46Vrfw6i/wREnafboP5j8amCSlcicnKOp5C960j7jkAn1qIWZvHklEm1UHQetNAMchLIPlOdpHGfTFOW5dG3rhWPUAVvJu1kcas9yISLGuwncO9VcnzGbJPpmpbjDSZAJz/ADqNoZRwcgEZ57iqSSMy1Z3flPlowyY5BHWtE3dudNLOnlqTlMct+BrCYSRrtIIVuhNWIY3lVY5HOE4A9M1nKCepabSNGzK3rIiuN78Yc9akn0u6kuvJhgZnjUnaP881U+zbZ4mQ7dp6+lXIbl7W8EkzyB053o3IrLVP3R2T3Ehgnji4i6DJ/wAa+t/hyhj+HGgKc5FjF169K+U7V4VilvEuhtQ8RN1Ir628GlT4I0UpjabKIjHTG0VvQfvMTWhz3xlV2+G90iAlmmiGB/vV8zzafcxwqJI8jduyOa+n/iuceBZR63EQ/wDHq+fb27kgu1jgPJHzZ9Kuo3zFxStc5i6UKmNpXJ5JHatGLaIkKHkkZp2oO+za4UBhnNM07y2hw/yhe+KzbDZnRJco8RUsMjhs1y2tNA8+63B3g8jtWzdNFcjyhg5H3gMVjyxbNQaNELjAGAMmmyZFC3D52n5VY5ye1aCmSGBkABDfxd63NM0OH7Os90kmTyIwCMD3/wAK1To1hdKpEHkleSqNjcPQ00rk8r3OOijuJpViRWkYnj5c1tjTxaRqHuIopWGSrE8fj0rX2W9kxFrbpDIcK3JLY9MmszU0LXMcpQHb8hzzt7im4WWpUVqVbuGVcFpYzxnKturJ1FZUCMGONqnk9RV+54bBJJNQ3kRns0VSPcntWHNrodKppRCbjTxGvJIIPqai0y0Il3HG4AYHoCajUlPJjZgdgADYzmtDT5o0kcDln/THWrUrGVtTR/s6S8kO1QI0XI7A+lX7PQTZXEKSKZC4DgEcgYJ6HvxUem6o1xE1mo3quMPjlT0Bz+Qrs2Ka5aRPFcIlzFyHQ5ww/pn9fY0XuWtCHQry0aZ4GtlUl8eW3UZ6HP4Vf1PSEvjDPjEKPkbvvKw/nXMaClw2rSMRtZZcHjJyD0A+o/SvQYrmG300QyFXbIZ+5UZySaSV9ynLsc5PobaPqcEsLK1vLyA3GwkdB7ZrK+IWrtDoypNFGkzDhmA3BgRjA78j8OtdHqkx1PT7VrfBaEEgdOP615p8Q76K5W2tZXDXEA7NzzyTjsPuijS+hMnaJwxWSRmfO7cck1AwIcLz061LCyuShcgD071HMfn2ocZGK0ObzLVpaQzBssDj35qw0K24851yn3VVqpwQyQN5sZ4X171LqVy7qnHyDjr3rNxblvoPZEN1KtzMi54/QVegt1D7mC7lQHk4yKy7WTY/zKrDHVh0p7kC63JIXVxgg9vpTlH7KHFlxrxRN8gHyHOD3plzMpVnAOZWJHsKoSiSB1yODzn1q2Sr28Ekq/IAQaXKlZoFfUbvyOR19K+yfh7k/Dnw9n/oHw/+gCvjuG3SRWIYocbkUDj6V9i/D/I+Hnh/OM/2fD0/3RW1Jptolqxj/F8OfAEuwEt9oi6f71fONzPMl8GljYjgcjFfSXxYk8rwHK+MgXEWfpurwW6eK6jSRVypbGTRV+IuOxk30qvbDEbE9c4qpYxTzyrEkDsXP3VGSa22sPOlEKYLN+Q9a2LKdNNtWgtIQT0aZuC5/nj2qFG43vdj9O8PqIzJeqqHHEZb+eKvGG1hBWDCnHJjjC1XSaZoVLONx6kL196miljdljYNk8Z/+tXRGPLqyW77FeVZgrGLDnH8frVaCVZZMyLslB+Zfu1qTRojEFhuxwQOD7Gqctu7bZQNrA8cc/8A1xTkJEF/Azr9oiyJIf4RyStVllW9jZGADsMGtFQSHKjpxgf56VmOgtbtHAAGc4Pp/wDWrJlmI0UplIfqpKnn0pY+WkHuRWhf2xju5GiBO4bgP73r+PSsrc3mEqOCK5HFJHSpXZBe28gZHQnAIOQO9Msp/LvEIU5btjg8elaCMJYtjg88U0WnkSI44IOAfY1mp20Y5QvqjTsJILaUxFA6EjOD82fQj2JrbgvbS3sJJbd9j26MgY5AYY547kD88VylnADfZwUDE5yeB61PqZwkW1zKEyoQDAbPetFIztY6Lw34iP2qR5YmUTSFhlc4YnOf5g+xrvILe3mVnICrcFgWPZ+4IrzjTLogWsbokIQjqmQG6E//AK66w3Jt4IYY9zBSd7EdM9/rVcyBJlyLTruS3VLExibGVjkPfJGB69M81414kttTj8RXKanbtBcZ5RhjA7Yx2r3c6a0VhDqUblzEMjD8kdzx3z+lT3/hjS/GllDdajAwuLcECWJsEjrg+o9v8aIy1sE4XVz5pWErcv8ALzgVBcwuZskHpxXruu/By/Ez3Wh3cNxEfmSFztYj2bof0rzK/sLuzupIbiB4Z4yVdHGCK3iznlGwWwMcBLLnI6GqN4+WHQAHoT1q9IkwhVscgZNZV0GmuM98c4ppXYSegwszAgcZ60qv5KbhgNjBzSxoyRM2QD3pkcayyjJ5Pam7GZcjkjubfy3B3g5U+lX5Il/syB5V2wrIVYjr06VnW9lI8rMhxt4IPetMaZcXfh68aOZc2pEvlnqw7n8KxbV9GbRu0UvNEp8wEJjovtX2F8N5hP8ADXw9IBjNhF19hivi+KRlK55Hevsv4XHd8LvDh9bCP+Vb0o2Zle5Q+MMby/D+VExn7TD1/wB6vnxpXt7VYmI27v1r6F+L7hPAEpZgv+kRDJ/3q8DhWK6lMRVSqneSPSpqL3jWNrFvT4z5YMgxvGcdyvpVkgNjGBjjilzujJA5PFJGrAkjsOD6VcNFzClq7F2AbkAA6flTnixkgkMOelMtH8vJK9sZpSxbHy4Oex6VTbeqJSsSBzJGwY5fr9aXen2aN97Fc/N7e4qIRSJMuzkMeB1z9KsKqSpJGRhmGAfQ1nLe5a2K8yG3nWYMdhGCR3B/+vVXU4glusuNxU7uB271Pbt5sbwSDDLnIP6021RpbSeGXrE238Km9xmdeZNglwgyYuevb/8AVVO7g8yLz4E+YjcV9fcVo2Kb45rVl5GUI/kfyqG3LJbrjrEdp45xWMtTSOhhQEtKVcFc8jPrWraMsqMjjoO9S3FgDA08eNp5IHSoIYGjYSZ4Axya5Zq51QY+3gUt5asNwJHPGK0UgiCLGwR5nIAwOVH1qslnceS13CrNGTtLAd+tanhSylvNXMso/dxcnn8qy1NLK+xrp4aM9wiwsioByWyecc4pt5a/ZfGtnD5ha18xFkV+hBGPywa7FLfyCYIR5jH+LHOT1qrqmiW91e6dDuxcSSjcwOTsUZP+fetEmS7Iu+HAts11ply28wSEBW746/mpBpmlM+ieIbm0kffbSHCH/ZPSql5efZfGs80a5V40bB6Mcc/oT+VW9YhVr7Tb2N8Ru3lsT2B5Gf1rXZadDHd69TV0t/s+oXGnSMflJMRPfuP0pmv+GNJ8S2ey+s4mYj/Wp8rr7g9RTdV2JfN5ZxLEiyow4JA6j8sH8K0Eu1Fk86D+HzB78ZIroi+jMmup4D458My+Fb9o0DSWUmTDKRyR3Vvcf/XrgZU/eMw/KvqTxZolt4r8My26jDSqssRJxtkHA/wP1r5pvYhaNNFMhSaNyrKRggg4NXF2MKiMuFHdTgZxxTVf7HOX2hnHT2qdNylpIsEDjnvVGYyM4Zx371TV2ZFxNRkBk2nJfvjoansZpJ0MZc/P8hOcZzWaY2EuAu3virVs6qWhbjdyCKiUUloXF6iyWUlpePZvjzgwXg8V9i/DKMxfDLw8jYytjGD+VfLdrp9rqMltdvKImgXEuf4sdK+pPhjIJPhn4fcdGskI/WroyuxyjymF8cyV+GUxBxi6g/8AQq8Q09Ps1jGJM75jubjp6D8v517x8ZLc3PgExYyDeW5b6B8mvDeZ9QiTrjLHFVUWoRNJF/djJwAMn609l6e3tSY2ncSPrTWk3L3z60LsN9y1EEcqN2eeRXTT+HI57KG9sGYRuuWWTqCPSuQtsq4YfkK7nwlqMdxatps8uAwyBjp9D6ioleOiLjZ7lHRNPW4u2Z1jLAHIYdR3FRavpTacy3UeJbeQ4Vgc7T6GtB7OSzv7i1kOG2MAyj72Rwfxqlp1yjQyWVwT5L8OAM49GA9RWfMW0c5c4i1CGRcbJwQc9mFKgMWqsu7iRcH/AD9DV/WtJlh02XcpxAwcOo4Pvn6ZrIlJF5aysTn7vXrTl5EIkli+zagsmMbxgg+o/wDrGkhhCX0mQAG+b86v3kSvZwOCCVPPqO1LFAGdCF5PGP8AP41jJ2vY0SK8aCASxAjaMkfT/wCtSw6Yt5eRIuI2c4K9Qfp/hWnp+nR3188TOqPsPl7jjcw/h/GnWcaoCuPmjYEBv0/Xis5d+5rC6Nq20610zbGCWt5QMrj7p9RVL+yksrO4FmhPnPwAMYFbEuqWV9GmT9lnkHzI4+Qn2bt+NZkSvDezA7g4bByeAMCspRtodEJX1L9lqNzHbIsp2bf4j0PrWDpetnUfF63rSYSORYYl7AZyfzqzrWptHpIgVQZZONqjkduPr0qDQNB+yxxjUC0DpiZokGZMk8Z7KO3PPtVRu2KeiNzXbeSWNNRxt8tlAI7Lg8fmDWvDHHqPhbYAokAwvpuXlT/n1qTWIlOh3agBV2LgD/ez/Ws/w3N9p0642clAsmz6cGt1G0vU5r3QmtXxt9asWbBKRBWHqAefzBrUEf2bQZ8PnZ8qN6qTkfoaxfE8AF5aXTAqHhKg+4Of5GpW1Iv4V8xSN8DorAnr2H8x+VUtG2xPU2NOlEmkRlyPlLRgjr0yM15Z8XPC8Ud22t2sAAdsXCgdCfuv+PQ+9d7okivo7y7yVNwFVSegxzW1renW+qWMthOADdQsqnPPT/P5VabauRJLY+U1hBztAG41QuITFPhuWHIrY1WJ7O+mhC7TA5VuMcg4rHulld1fP3uK1TurnK1YRneTgACmwkpcqTg7uK6LRPDy3FuLi6ZkTeMKVwHHfmo/E+hLaTvLp8Uz2yIGZjyF/H0rnVem5+zL9nLl5iWwZHma1BXy7gbc+lfUvwtXb8LvDq/3bGMV8jaSZIhG2eVOTX2H8PVRfh7oYi+59jQj8q2oq0mipapMzviv/wAiLKCcD7RF/wChV4RpzB5HmIzgbB7/AOeK9r+NUzW/w3nkTqLmH/0KvF4I2gs4j91iNzfU81rPWQo7Essj7iOhp0CiSVVLZz1OcVBG28EKNxPGavQxxqU3nnHQCmopITd2WpdJu4Yt4U7GPY5H5irmg28suoxkKy7W3MQegFXBqRgtBBbLtjwNoPXPqadY6pc20bAbSHyflAyD61zuonozZRsdVdrFqFmJLdi9zbA46guvdf8ACuIvpzbXS3Kr8shJI9BXUaRrDTt5M42MeQV7+pHoaj8S6WYrQ7VD28jlkfHKMeoP1qG00VYZprpq+j3emgqXaFhGpPXjj8j/ADrz26SQWNtIQQyTBT7Hjit/wxJcWN55jZ/dXAjXn/PqKo641s95cQWhJtxqDkA+gPT+dZ8zsVY2ZdNH/CNveI3CNhwf97qKfBbifT51EY8yDDBh1IB5/Q1oW7xP4TvoiMhUOeOhyMVN4fERuRE6ZMybCf0o3fqO1kY8ELCZJzkkMCT7g1P4ggGmaobjZmC6TeAD6/eH4Hn8a2pLZEjhjCLuiYnB4zzzTr/TDquhyWj4+02xLxnH3hjp+NEY3XKwbs7nMxyrJGUwXUnd7j1qW11FbXfA0CzqThMuQV9cH39KzYpNksW1sN91uKc0QS62g8E56ZxUcuupXN2NGz083usi6S9KfZ2EvlPEWcYPAGPlP6fSt24uzqV6mVCRyTKFVeAwHBY+pJ4/CqdtZpDpwEU5ke6cKGAxx3P4CtCzurJL0LJtIjURoSQMYPWhJJDbcmcFrHxbnguLuxu9IaKMEowR/mXBxg7u/wCFULD4vWOlB/sNpcwl1w3mssgY/gBgVyXjnVRq3ifUrxQDJJKyAA42qp2jp7CuVtxIW3Odw7A45rojDm1MJSsejap8Xb/UkiiM1uEiJZc2zAjtj3qgPiTqhtpbRr/T1gmYMd9rJkYORyK5GVVVAxGAewAp1npsd2uXlKrnoMZxTcUtxKTex6Vo3xKe1sZLZ9V0cqTvBa3uMk+gI6V0um/Ep9f1S2iSGMSIAA9uXKqF7ncOn+NcFoXhfQmtZhdyXAmKHySgBG739q6DwT9itNQurNBhpYhGCTkk5DDH1wenoKzl7rsXHUyfirpr2HjKadU/d36C4B9SeG/WuEjR55cYOFB6dc17h8VdF87wpaXxC+ZYtg+pU8EZ9jg14yJFjRmjxkDk9605mlZHPONpF+x8Qi2hWC+ty8SJtADdW7VX1XU7yeH7FHKv2eRQ+EyeOuKzp4Ptx3RuNwGTipwJU0qGUHlC0LH26islSgpcyWoc7asQNcGBUKnIH619g/DCTzfhh4df+9YRn9K+PbexudRuWjgiaQgbsDsK+xvhtbva/DXw/DIArx2ESkA55xXZSSTI1tfoZXxig8/4fyJxj7VAT9A+a8TuJhjbnG4dK9z+LB/4oSbPeeIf+PV4ZIq3EoUDb24qp7lRLWkQia4UkHaO1amo+V9sDDarYG5QOKbFayxW0bQIWVANxxwD6U9NMvnJmuEEIPTzOMj6daykm3dlppKyFi+dDkNlup9auHSrpQrW0byKR1jzj6YrZ0zw0qok11MxEnZePzNb8WnwxsvlW4jKH5X3Z/TNQ4xWxab6nIwmewuES7geJl6bhjNdLpN9Dd3D6fLHugmQnGTj6DP86t3lja3sG29fKg5BZtpU+xqiuh20d1FJDduu0gglhwexrO1noXe6OQltrjSfEt7YSgugKTxuP4h0B/z3FZXiBYo/Fl95aFEZxcYPZnUHH55rtPEN1BqAS7hwZLZ/KZsYyjH/AOKGfxrh9auPtevzyPgszInB74FZS6lo6S0ZY9H1RSTuMQbnoRxUmi3qQXVu5ICE4JPoef51BZxq2hanKzEMkWwD1yap6dIGCFGCkOMZ7ZNG1mB3+oQ7pI7hFXj7wPQjrmqVpqoGrXFqwyhGQQe9XobiO40wmNgccAEeh/lXIW9x5d81wU+YMSVzzjuK2btqRuJqunxQarKgQqj5dCOn+RXP32vrHdRxrGsjIPm56/StjxnrtsRHa2h3SFQzuDjbkcr9Txn0rhI3YytMQXrFptmqt1NG88SahcypHHIYoolwgUnIB64NUo55zcFhNKJGP3txwaq3McrtuilEJ9MZB/CmWkd3bTiW6m+0RDrGh8ok/wC9g1LcuhasW7rS7a4QvdW0UrN1YDafzFY114ZgRx9ikkV8Z2MN6/41fvL6/wAo1larsOdySzFifodo/Wqs2sSxjfNp93CwGMoocUKc0wcYNHK6vHcxTNDMhhkjAynTg9DUVkz27bn+6y4IzzVm+vm1jU2nkcqdojVZOoUetUpYpYJCVUsM5BHSupO6szkas7o6uw1EmN4gAwGGyf4DjtXR+CmMviO3kLEiNmk6YwoBwP1rzmykllPlfMSxywzXr/gfRWgeM3bCKW7K4zxtTqB9ScfpXPKLUjWMk0d342so73wXLZjB3wM6lzjDL8w/lXzXdZkYsPlPt6V9VajaJOYYJPmRYmQ5Oc5BFeEeL/Bw0fWJbdJQInXzEyD09M966FJJ6nPUjfU5/wAO6BcamzSCb7NEVOxmGdxHapJ7G8tLWe2lUGOYBg6jK7h059aba38mlQfZngDBcsG3YzTtT1u9kuYYZmDJGA8e3OGB7/0ol72w/wB2oabk2gX0MFkI3i8qXJBkH3m9a+sfApVvAmilG3KbOPB9eK+QJNQjkLuiBCVOQPXFfW3wzyfhj4cJ/wCgfD/6DWtG7bbJlO8VEp/FUqPAs244Hnxf+hV4lbW5ds52gdMnFe3/ABSi83wRKpzj7RETj/erxOS5S2G/IYDjHQZqqklF3Yoq6saz6pdQ20UCykiL7uOAPcf49apvqe8/v7gMwOdpbOTWA0sl7cs0sqQxqMD94Mn9av2dvpiT7p7uOKMf3WBdv8K5XNy20NVyo3bPxfLb2ZtzK8RPYjOPoa07PxlmVY5nilQ9SW6H8qqWPiDSNOkC2S2KBjzJKQSB6knJ/KteS78FXsqXF9faZNOfv7Iig/MDJqbPuXzIvzPFrVtGsc8cM8bZTccowIxgmsW8N9pN4sF5E0IYgowOUYZ7GrNzq3gqxt1js1hYnkPavsZD7scH+dUtQ8SaPeWT2j6gk8B+ZQ7AOje3v7j8aUrDTL2p2sUVjfXkMgNtNCzHDfccEHH07153ZA3N957ZPmS5Unpj/IrZttY8vRLyxmubeUTxMo+cdexHvWNZTLEIhI6KFBBHmL1/Os27juu50/mmHSbwbjiTCsPxBFMiniSKJ9y8DBFZz3cTwvH9ugG/usgOB6dqzJJDC37iaNtnCs0q/n7U73Hoj0XTtetrcDLho3QlwSAAc+prldU8TQpeziyx85LE4yFz6Z61zQeZt2+RDnn/AFq8n86gFq+8uNmSenmr/jVXXUd10JJJ/MffKxZmBPXmmxPKCyKByc9elIsLoWYmPd2zIpP86SESxSM58th2Hmr/AI1m7MuMkuo64n8pN0pO31A3fpVcalZOn/HwBg5G7I/nVvbLM+T5KD/fX/GntaK/LeSR6GRf8anTuPmXcktklRN0sb7FG7cRgAeuasSThoiEOc9McisuWwh+6I4NpPOHX/GoJNDtWbfE6RsP7soH9akvmjvc3ZV0jU/JjuoIrcFSC+wc+gOe/U5rjdYsILfXhYWMpuEl2mNVwDluAvJ/zmttdPm8tlN+2O2ZlNWtL0HRI7tZrqclyCXZrnBJ/Cqpu25FVprQu+EfDNhpd/K2rWh+22jnNu+NoI4GccMd2fbjvXa+Hg2pa1vLYIOdxPXByf1/lXMJc6fZRyravCGcgbjLuOB6knPrW3oGtaTa3sU099BEsIJA3Z3HHFbRa6mDa6Hf3ufPZ87cYUHHBPofxrkPiXYx3fhJboriayYMDjt0YH9DVyXxfpF5hH1e3VDwQT0qS617wxPpMtnca1BcLKmx+oJB49PStLp9SXa1j5+uriCaUoQflHGOhNWrVjJp6SxxhjCxTkZO08irer6NBaai8NlcQ39t/BMHCnHoQe9VzaXK2rxRRxJvHRJR1/E0pWasjmWj1Gx6Zb30DTCRI3PBRWGOP619a+A44ovAOhpCMRrZRBfptr5AGlTWpRi0kVwW+UYzke3Y19dfDuOWH4c6AkufMWxjDZ65xXTR30G2rCfEKWO28D31xKu5YQHx6nPA/MivmiWVp5C8hyxOTX0f8Uv+SZ6v/uJ/6MWvm09a5sY3zJDjsGAOMjNIQcdc13fw21h5/EGnaHc6dpc9o3mZeWzRpT8rNy556/pXPa54mk1uJY57SwtxCWI+y2yw5yMc469K5XFKPNcoxwhXAdWUkZG4Y4qe7sbyyt7e4nt5Iobkbonbo4//AFEHnsc16H4rtfDC3mlXutXd/PMNLtgthaR7dwCcFpDwAfQc8Vy0t0nifXrezlnj0fSQ+2FZTvW3XaBy2MscKAC3TgZxTlBRdmwuc+0VwII5nhlWGQkJIykKxHXB6Gk8vAyePrXrej63p+raza6JZ6Pp83hzSYmdri9hLukajLyZzgFj7Vz3hfUbY3PivUraytcQ2MlzbxSwh0j/AHg2gKfQHFN01dWYXOELKpwWH50hZc9QPqa9C8NeJ7nxHc6lZX2n6V5I065lBisURgypwQa5Tw14m1zRF+x6SIma6dfka2WZnfGABkH8qTgtNQuYuctgEH6GngE9a9J+Jc+oW2laJpWqwRm82G5uLhIFjVnPGxSBztHX8K85Y4BI5qZx5ZcoIlFhdfZ4rgW8nkzOY45Np2uw6gHuRkU9tPvY57qFrSYS2YLXC7DmIA4Jb05IrtJZLO18XeGbK/Rf7Ks9PgYIwLKzyIXJIHcuw/IV3clol5qniZrSy0CMGCVJhOwaR5BIMtL3WMhc49Rmto0lLqK54V5ZdSQCQOpx0qWTTbqCVY5raWN3jEqqyEEoRkNj0xzmvTNJghs/HGuS6bM8ml+bERb6Zafao5FLBlyQCqbcE+vPFdb4ha4azeIDUEmnEzR3MFo9wYI3XgEsoKZwQQvK5ojRum7hc8KtdOur2Qx2ltLcSBS5WJCx2jknA7CqLSEHHNeofDgTz3WlywaJpJjjn8t71rnZc+pwm7nGQOmCKzPFVnNNqVuLzRNL057q9z9q0+fz5n+bnI3EA8g8jqKj2Xucw79DjYtL1CdrUJYXLm8z9nxGT5uDg7fXFRNEYyQw2EcEHjFfRziazsfK33tzLLE0iMoYsmwbj1YEE9MDGc1wDaZqB+KF00cGs3NwsCMGiWECNW46ylgU6jPXINazw/LazEpHmFxaXVrLHHNbyxvLGJUUqcuh5DAdxx1pkEbzyLHEjSOxwqqMkn2Ar6B1O/tRZy+Rcvezw2J81ra5tfNtdgIdl4zvwSMgYHbFeb+Bf7H0u/GojULZNSkkaGxju1by7fIOJZSPUfKMdz1HaZUVGSVwucO0TKSGBBHBB7VGSqjk4r0H4ixppum6ZZXmk6bZavPJJPM1lHtXZnao3Z5JOWPpxSaB4P0/SJbu/wBaurO91GwtHvY9LikEi/IMgysvGMkfKOtR7J83KFzz58xOVcFGBwQwwR+dTWlndajcpbWkTTzPnaidTgZP6Vq/8JTfN4gn1qcW13eT53/aIFlTnHRTwMAAD0rq9D8U3tx4d13Vb7T9KjtLa2aCFo7CNC9w/CqOOQBkkenWlCMZPcZ5/Ppt3aRrLc20sUbO0YZ0IBZeGXPqO4qIYHauosZJtU8CeJGvJDM0Vzb3qyN18x3KP+YP6VzBXFTJWsBd0uRBqdsky7oWkUMPqcZ/WvqbRrb7Hotpb4x5UQTH0r5Ssji/t/8Arqn/AKEK+uY+Ix+P8678G9GiJHOfEOwm1LwBqtrbqXmeHcqjqxUhsf8AjtfManJz2NfXVz/qx9a828R/CTTNYvJLzT7k6ZNISzoE3xMT1IGQV/DiqxNF1PeiKLseeab48bSPs72fhzQ1uLdAi3HkN5h+XBJIbqRnP1rL1jX4dXsPsy+H9I08lw3nWkLI/GeMkng5ruv+FIXX/Qeg/wDAZv8A4qj/AIUhdf8AQet//AZv/iq5vZVrWt+RV0c/H410q7tLRNa8LW2o3NrAlutwLl4iyKMLkDisTU9V0671eO6g0eKytFCq1rBKfmAPJ3HkEjv7V3X/AApC7/6D1v8A+Azf/FUf8KQuj/zHoP8AwGb/AOKpOjWluvyHdHHa34x+16U+jaJpyaPpUhDSorl5bgjp5jnqPbpVPwx4hPhuTUGOnwagt7bG3aOcnZjcDkgdRx04rvf+FHXP/Qfg/wDAZv8A4ql/4UfdD/mPQf8AgM3/AMVT9lWve35CujnbHx5FaJciPwxo1s1xbyW/mW0bRuoYY6knj2qjo3itfDulSJp+m2yaq+VGovl5I0I6Ip4U+9defghd9tet/wDwGb/4qm/8KNuyf+Q/b/8AgM3/AMVS9lWve35BdHEx+Lbw+Fr3Q72JdQgmYSwPOxL20mcllPXnnj1PuRWFGxU816p/wo27/wCg9b/+Azf/ABVH/Cjbr/oPW/8A4DN/8VSdCq90PmRxt1r0N5Y6R5kD/a9OQQNIGG2WJW3IPUMMkemMVsah8RCt7Jc6Jp/2CS5vDd3byv5huOoVD6JtJyPU1t/8KPu+2vW//gM3/wAVR/wpC7/6D1v/AOAzf/FU1SrLZfkF0crZ+KNN0vVLy/0/QVjkkKvaxyXLtHbsBySowH55APStHUPiXcaoEg1CxN7a/Z0RlaUxSLMFw0iOmMBjg7TnpW1/wpC7/wCg9b/+Azf/ABVKPgjdf9B23/8AAZv/AIqmqddKyX5BdHK+H/EPh3RrixvX8O3E+oWhD+cL7arOO+3bwPbNRahrXh8xtNpegTWl75olWSW8MqZ3biCuBkH611x+CF1/0HoP/AZv/iqB8ELv/oPQf+Azf/FUvZVrW5fyC6KcnxYi8yyMekyN9jj+RWlWNS53BidoJK4bG3PbnNY154vs5vHNjr9tYzwRW7pJNCZgWmKkntgAAYAGOgrpT8Drr/oP2/8A4DN/8VSf8KPuh/zHoP8AwGb/AOKq3Cu91+Qrozj8Trc21/D/AGfqJ+128sI8y9SRVLggHbsHT61zWg+JLfQo3l/se3vNQDAwXE7lkh46+X0JzyCa7b/hR91/0Hrf/wABm/8AiqT/AIUddf8AQet//AZv/iqTp1m7tfkF0ec6tqt7rdz9o1G7lupecNI2doJyQPQZPQU7Q9V/sU6liDzft1lJacNt2b8fN05xjpXon/Cjrr/oPW//AIDN/wDFUf8ACjrr/oPW/wD4DN/8VUKhWTvYd0eZadNDa30E13areQI4MkDOUEg7jI5Famv+I7jXooLbyYLHT7X/AFFlbLtjj9/9pvc13P8Awo66/wCg9b/+Azf/ABVH/Cj7v/oPW/8A4DN/8VR7CqlZILo4JNXjt/CjaRBE4kuLkT3ErEYZVBCIB6Akk571lEk16l/wpC7/AOg9b/8AgM3/AMVTl+CFyCM69B/4DN/8VQ6FV9AujznRNPn1HXbGzt13SzToqj8ck/gAT+FfWMRzGD61xHhPwBpnhRmuI3e7vnXabiQAbR3CqOmfxNdtDxCv0ruw9J01727Ik7jLn/Vj61Wqzc/6sfWq1dJICiiigBayLrxDFbeI4tFSwv7q5eJJ3eCNTHEjOVDOSwxyp6A9K1xWNFplyvju71UhBay6dDaod3O9ZZGPHphhzQBRvPiFoNlf3lpJ/aLyWUiQzGLT5nAkc/Ig+X5ieoxwR3q34d8Xab4nE5sFu4/IWNyLmAwlkcFkYA84IB54rxHX7GW38WeL5tQhis/tU1uba3nuJXlQKWZZAw3gAhCTx8u9QCORXVfCXTLmC38RaWmp/wBm3ssVu4jiZZZbNgGQlgRs3DaBgZAG3PNAHpUHibR7q4sooL+OT+0ImntZFB8qZVOG2vjbkemc4rSup47KznurhikNvG0sjYztVQST+QryLTvBlvZatrugRaHp/iG9tZVnhk1q7dcW06lgwAVhxKJAdoWtDxjoMNr8PvDvhbUNQkutSlC2a3P2iSJVjUBriZgGGUSJSBvz1X1oA9Ktb2C9sre6gYmK5iWaPcpUlWAIODyOCKztR8WaJpWrWOm3moQRXV9I0USl14ZV3Hcc/Lx0z1JA71wvh3w3b6pq2o33hm9EFjpGrRf2bKJWmhKeSguo1OTlHzjAOAyg9qdrSaTpXxKm1zVvDaTPJiw01TDArXUgXzZbhnkIUYCoiljn5WwOaAPTUmieBp0lR4k3ZdDuA29encYPFcq3xP8ACa6klkdSfe8JmD/Z5duAQMfdznn0xwea5z4e3Gk678PL25tLcprV1bK+o7opYBLJ8zK4EW3duwfmj5b1NcFNa6k3iBbEW1+LqZGu0ujb6t50UAlTNuF37th7t2zjrg0AfQM+q2NtpP8Aak90kNlsWTzpMqoU4wTkZGcj86X+0rUaz/ZXmn7b5H2nytp/1e7buz0+9xXnvjLQ5Jfgu8on1C0a2tTO1tbyzKr5cMfMWXMhwMnBORzVLQdH0HVvibJdLrsd9DDbBLIL4ie6nuWD+YXKKwKqB1U5GeaAPQtZ8W6D4faJNS1S2t5JJY4RGZFLgucKSuche+TwBzV1NVsp9KfUrS5S+tFRnElofODhc5C7c7jwRgd+K8s+KdlcjxTY3pltYblopI9KwY4QZViLSSTyyIQcDCpGOuTyOa7DwxPcHwpcXV/4st3maBGleGO3SDTm2ZYBRkcZ53k9O1AEc3xT8NRXSwLJdzF7cXKPHBlWQqGzkkY4YcHHPFdFo2s2mvaLb6rZGU2twpdDJGUbAJByPqDXzpqcmq+NZv7R06G2vr2TSme+kUxJumXAjYrlQJMKNo5YYyBXrXhrxJFongTRfLsZrye8d1jig6HDFpJJHPEYUElt3OR0JNAHS2PjPw5qFm91b6zamOOQRSCRvLeNycBWRsMpPuKvazq1roWj3Wp3xdba0TfKUXcwGQOB36153pWvMkt5bQwWXi1dMvrea41G3HnzTQTlwjDGcyxZ5XpsPGM4ra+IEq+J0PgLTbg/a74qdQmi+b7DbA7izHszEBVU8nJPQUAdxik71yWh+OLf+wriLXW+x6xo0QXUbY8vkYAlQdXR+CpH97B5roNO1SDVtMa8txIiqzxukqbHjdCVZWHYgigC7RWF4HuJbv4f6DcTyvNNLYxO8jtuZiV5JJ6mt2gAoooFABVyL/Ur9Kp1ci/1K/SgBlz/AKofWq1Wbn/Vj61WoAKKKoX2qmzvLeCOynvBIwWY2xV2tweFZ0zu2k55AOMEmgC/RSF03tGGVpFXcUDDdjnBx74Iqjpmt2mq6bLeJ5tssDMk6XUZieBlGWDg9MDnIJGOQcUAPn0jTLl7l7jT7WZrpBHOZIlYyqBgK2RyMcYp9hplhpdoLbTrG2soASRHBEEUEnJ4A7mqepa59hSB4NM1HVI513q9hEsqgcYJJYdQcjGay7Dxfdap4oXSrbRru1WCJZrs30YjdEcsEK4Yjqh9c+3WgDoxbQi6NwIYxOyCMybRuKg5C564yScVKURsbkVsAj5lB4PX86xT4os/7aXTUhmab7eNPZsAKrmAz568jaMfWpvE3iC38L6JNqV1DczRxozAQQtJyFJG7aDtB6ZPHNAGnDFFbQLDbxRwxIMKkahVH0A4qvfabZanbG2v7O3vICQxiuIlkQkdDhgRWXpviq2uRpsV/b3Wl3l+o2QXNu6fP3QMRjPBwDgkDIrC1v4jXuka9daYmjWsz20ZZm+2MMMQDGD+77g5OM4z1oA7lI0ijSNFCIgwqqMBR6AdqjNtAb1bwwRm5WMwibb84QkErn0yAce1Y/hnxI2veGTrV3bwWNuoYsyzFwNmRITlV27SreucZzVvSdRvr15PtWlm3g2iSC6juFlinQn5cdGBxg4I79TQBpkZ61Xh0+yt5fNhs7aKT+/HCqn8wKqXmtLaeIdL0ryC51BJ38zdgRiJVPTvnditMc0AQXljZ6jbm3vbSC7hJyY54lkU/gwIqCHRdKtrGWyg0yyhtJv9ZBHbosb/AFUDB/GqSeKbCPVNTs9Qnt9PayuI4I2mmC+f5kaupUHHUsVwM/drbIxQBlX3hfw/qdwbi/0LTLyY9ZJrSN2P4kZq9ZWVpplotpYWsNnbKSRFBGI0BPJOBxU+4Ac4rI07WZ77UriI2aNYqzrDfQTh42KNtaNwcFJA2RjkHB57UAaNrZWtijJaW0FsjMXZYY1QFj1JAA596WO1t4JJpIYIonuH3ysiBTI2MZYjqcADJrI8Q+K7Hw7GfPiubq48mS4Fvax75PLQZdzkgKo6ZJHPAyadofiaDXVeOO0urK+EC3K2l6ojdo2HyuCCQVJ4JBOD1AoA0prG0uHd57WCZniMDF41YmM9UJI+6fTpVeXQNHuNJi0uXS7R9PhIKWxiHlqRnkL+J/OuSb4iamibzommiFbee5klbVGCxrC4SQEGHIYM2MY7Vf1zxu2iS6Fb3EOnwXGrEBhPelVh4zx8m5hxjOByQDQB1VtbQWVpFa2sMcFvCoSOONdqoo6ADsKkrgPDnxIuNf8AENpYNYWttHcMV4llZwfLL/xIqjptxknPIGOa1r3xytt4nGiQ6Fq13MiNJMY4AMKDhGXJAcMQ2DkfdNAHU0tIp3KDgrkdD1HsaWgAq3F/qV+lU6uRf6lfpQAy5/1Q+tVqs3P+qH1qqKAFrndehnTW7W60rwxDf6qImRNRnlWGKBTwVdhl29doU/UV0VFAGPoOhNpH2m8u7k6hq16Q11dbAm/aPljRf4I1yQq57kkkkmsq4std8Yn7PrNoNF0I482y84SXN4P7kjL8scfqqkluhIGc9bRQBm6vc3OnaerafpMupTFhHHBC6RKvHBZmOFQY5IBI7A1W8O6HNpaXt/qMqXWrag4mumhGEG1cJFGDzsUcDPJJJOM1t0UAcFLo3iKOCy1i30yKXVbjWm1GW0kuFRbdGt3hRWfnO1dm7bnknGa1b3w9qlz4etbO61D+0pI5zeXauNgunXLpCvaOLzAnBz8q+5rqKKAOA8K3Xiu58Y3Wp6lpCpa3Vvb207vG1o8LJ5jHajM3mqC2CwIzkEZ5rivE/hjXp/iHfSSJdXEDxI6SQwyyg7twAZwMkqABjoM8ete57fal2lOoxQBwPgHw7qb/AAuuNK1Wd7c6lBIi/IyvAJAwbMbYCnJJwMA5zgUkWjTjUbGDSbTxAl5a3MYuNU1CdkiaFDhxs37XDKCFVUAGQcjFd8Xx1P50mQeeKAOY8SxXdn4j0PWoNPutQt7NbmGeO0UPKolVNrBSRuAKYOOeRWloN9q1/Jc3GoacNNtCVFrBKQbggZ3PJtJVc8YUEkAcnJwNfFG30oA4HQ45tJna71XwfquoeIpSRcahHFDMsnJx5blxsjAPCgDA6jOa6+S/u4tfhsTp0rWk0JdbxCGVHXqjjquRjaeQTkcd74GOopcj1oAyfEukTa74fudMinWAXWyOV2BP7rcPMAx3KggfWuSg+0T6XfeFJdB1LN7qd0JLhrdkghheZ5FmWXoSo2lQOd2BXoWaMUAcNq/hXXNR1KeIy209vrGn29hf3hfy3hWNmMuxMHPmByBz8pOTmtG2sNS1fxFLqVxbTaJawWMmn2iCRDcfO6s0pxuVANihRyepOOldRRQB51dfD/zPGVrGdX1t7WWyuHllLxEeZ5sJAJ8vGSV3cjPyA9qn8YeGrt5vD863ur6lHp1w7KkTD7Q0hjkIkLgAcYVQCMfMc5zXfYpKAPJvDPh+/tvHNndT6fqJNpMQ5EZWNBteMszvw65KkCM/dycDGKm8WeDjL4oed7LVZbeeaG9a8soBPPLIsnzRNICHiRYwFQJgfMSSeh9UpMZ60AUNCtrO00S2isNPfTbYrvW2kTY8eTk7hk/Nnk8nrWjSUZoAKuQ/6lfpVOrkX+pX6UAMuf8AVD61Vq1c/wCqH1qtQAUUUd6ADFFHeigAooooAKKKO9AGZrV3q9lGJ9Nt9OkhjRpJ3vbh4tgHORtRsjAOc4rj/hrrniTVfCtgbi0sDBGzxzvLdym5XksMqUxkqykZboRXW65oba95NrcXrx6Xybm1jXBuuRhGfOQnqo+90JxkFj+HVTxKms2N5JZPIFS8gVA0V2ijC5B+669A6844ORjAB55d3niKXQvEM1xqR0qWG/ufssVpfOZ2k8yNQuSAGjXeOAOpHSt97jUdJ0bxLBDq99O8GrW1lbXFzKJZIlk+zhsEj/pox59a1dQ8Babd+JItXhC2zq7XEiBS4mn4Ks2WwFDKrFVA3Mq5PFEvgmPUPCupaPql+9y+qXQu7m4ijEWXDIQFXJwMRqvU8ZoA1ZbbWn1jzodcsl04Sg/ZhY7nKjqvmeZ1Prt4z0rmviDq2uaNZztZanGBdwzfZ7aOxUyIEhLuxlaVQMYzwM8jAOK118IRW+pTXNhrGrafDcTm5ktLeZPJZyQW4ZCQDjkAgfSrHirw7D4q0b+zLh444XcGRjbpKwXBBCbuEYg43YJHPFAFTwlLqS+GrG/1TWoL6CWxhmB+zCLZlAxZnLHdx1Jx61ydr4juv7eOttqXieTwpZFma6e3Rre5z/HgIGECf3gCW68AZPpNvZW1rYxWcUKrbRRiFI8ZUIBtC89sDFclf/DqO+1e9uF1q8trTUA6XdvCihp43xmIyHJ2DbgYGVBIBwaAO1GGQMp3KQCGHIP40lYc3h1pPFVnq0d88UNtGIxbgHGAGG0HdgKdwLAqSSi4IrcoAWko7UUAFFFFABRRRQAUUUUAFXIv9Uv0qnVyIYhX6UADrvQrVRlKnBGDV6kKqwwRmgCjRVzyo/7opPJj/uigCpRirnkx/wB0UeVH/dFAFOirnlR/3RR5Mf8AdFAFOirfkx/3BR5Mf90UAVaSrflR/wB0Uvkx/wB0UAU6O1XPKj/uijyo/wC6KAKdFXPJj/uijyY/7goAp0Vc8mP+6KTyY/7goAqUVc8mP+4KPJj/ALgoAp0Vb8mP+6KPJj/uigCpRVvyY/7go8mP+4KAKlHFXPJj/uCjyY/7ooAp0Vc8mP8AuCjyY/7ooArIhdsD8TVsDAA7UAAcAYFLQB//2Q==",
  STO: "data:image/jpeg;base64,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",
  DEC: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAFAAPADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6G1HUrPSdOnv7+4jtrW3QySSyHCoo7mvCPEv7SFwLuSLw1pUJt1OBcXpYl/cIpGB9Tn6VN+0p4guFh0nw9DIUinDXdwAcb9p2oD7Z3H6gelfP6kr16elRJ9ikj1w/tH+L1iJNjpBOf+eL/wDxdRf8NJeMc/8AHlo+P+uMn/xdeUScwsarnpUpsGj18/tJ+Me1jo//AH5k/wDi6T/hpTxl/wA+Ojf9+JP/AIuvIX6ijGaq4j17/hpPxkelno//AH4k/wDi6P8AhpLxn3s9H/78P/8AF15COKKLgev/APDSHjL/AJ9NH/78P/8AF0D9pDxj/wA+mkH/ALYP/wDF15EDTh2pXYHrg/aP8Zf8+mkf9+H/APi6P+Gj/GR/5dNI/wC/D/8AxdeSYJ60Y7mlcdj1s/tHeMuP9E0f/vw//wAXSj9o3xkT/wAemj/9+H/+Lrx2W6Vfu/MarSSzS9SQPQU7sD2z/hpDxcvDWujA+8L/APxdH/DSPi7P/Hrov/fl/wD4uvDlU55xn3pd6DjDDPXBp6iPcD+0d4w7Wmj/APfh/wD4um/8NIeMs/8AHno//fh//i68W27Bvik/KpY7vcQsgwfUUrsZ7Gf2kfGOeLPR/wDvw/8A8XR/w0j4x/58tH/78P8A/F15IoB5BzQV9aLhY9ZP7SHjP/n10f8A8B3/APi6B+0j4z6fZNH/AO/D/wDxdeS47U3pTuI9cH7SPjP/AJ9NH/78P/8AF0p/aR8ZD/lz0f8A78P/APF15D9KX2ouB67/AMNJ+Mh/y5aP/wB+H/8Ai6T/AIaV8Yg82Oj/APfmT/4uvIcdaaV5JouB7Af2lvGH/Pjo/wD34k/+LqxYftM+Jo7oG+0nS7mDPzJEHibHs2W/lXiwUk4AJpWR14KkUXA+2PAfxI0T4gaa82mu0V1CB9otJceZFnoeOqnsR+hrrsV8R/DHxBP4Z+I+j30LsFkuFt5lH8cchCsD+YP1Ar7bBwvXJFUmI+a/2jxnxvpX/YP/APar140eh45r2T9pAkeONK9P7P8A/ar146/8zWcikNbHkNnuKrkcip5BhDzUX8VKI2NbtSAU5hgikBqiQBHejFHel6UhiD6U8Ug9aeB+dACgZNVbmVmUhOFzjd61LcSeWm0E5NReU87KvQIM4FJDGp5UUOSuXPQVC5Yse2av/YnC525bpjvUD27KD+pHahMLFPAB4yaGQlsY5qybRljB/H6U/crssarljxTuFiFLd/x60rQkYyOtWgziRUxjGfyxUdyz258huWUYz6UrjsRxT+U2DnHQirvDAEcg9DWbN+8kLAYBqzYSbl2E89qbXUksMuBUZFTtgfWojyeaEAzGBikp5HNJ2piGnvTTySKcR3ojPLUth7kkPIA96SRWMjBc8Glh5PTnNKB+/f61HU06Gv4Ot2PjvQlcA7r+D/0YtfcpHWviLwkx/wCFg6Dn/n+h/wDQxX28ehrSDuRJWPmz9o4A+ONKOf8AmH/+1Xrx11+YY7mvY/2jlz400pu4sP8A2q1eO5yQP9qlIURsw+Sq/RgKsT8IfrVfqRxUx2KluMbqKMe1DDBFOHNWQJilwaXijFIYDBqReDTVHFEhxGSD2pDKzkSTMx4C083Zj+ZOD1qqxO0+rGnxW7ySqp6d/anZdRXFFy+7LsST29a1bNnuwQUUxxjccA4xWUbSQsWxxzj3Art/DOhpJphlvMJbg7nY+grKrJRRrTi5M5x7eW+ZvLjIReT2H51b03Qboyfa3tZRGoIjwnHPfJ4/E13Im1S8tI49D8PwW9lH0kukH7zHfmmnxr4gsV8q+0C3uIlOHMUmDj2xxWDnJ6I3UIrVnGXGi3SSRzi3covBwvA9MZ64qfUNEN1EbuOI7iPnU8flXcp4h0zUrRlEDQbjgxydVNV7QRTyKrjdHvdM/RcisvaSv6GnJE8umTy4iBGcxnrjt71RQNFOHUcZ6V6DrsGkRB8+WjN95+9cJf8Al7g9s5O04PGMj1rrpT5uhy1IcvUt+ajkAMCfakdao2+Tlg2SCMDvWg3WtdjLci6cdqMU4jJ6U3GAaYhhzmiPiRs805RzTQMyNSZSJIuDxjrSgESuM8eo70RAc59aFP756ko3/CIUePPD5wR/psHU/wC2K+3j0NfD3hc48c+H8EcXsH/owV9w9jV0yZnzf+0Z/wAjppfp/Z//ALVavHFHI57/ANK9i/aMk2+ONKQjrp//ALVevHxxj03f0omKIycfuvqar4+YVZusBMD+9Vb+IYqI7DluNfgjNGKVuSOKQmtCQBoXmjPOKeEyKQCg96hkYsdoAJp0z7VAHWqglKs35UrDuS+S6hgq9OCcfypo3QDcxxnt3qSC8ZFz948nn16VEshuLn5iOckfX/8AVRr1A1dMhlu2VFGWfC5xwoz0H9fpXpXkxWlhBAUJiTDHjg46Z/nXL+DoVaVpiuccDivRreCOewYNGDnjgc1wVZ3lY7qULK5z0+p/aPnvr86bpycADhpPp6D8KwH1DSY52NjdSTpuKt5hbJPoMjrXZ6lodhfWpc2sbM6hXVj8x9w3XNcxPo0FrbCxjtgqu+Qpcu7sewGOvvWcbWNGncsaDZQ61fSJhlhTH71RnHp1qbxfB/wjdlEIH2rGxAzyzMw5J966PTdMfSdPWH5RLtwyjkAnnk98etZnjfSmvvD7S+ZuYgspzyrLSTXN5DcdDzePSmu913cPEW6hJHwT+FZ2sywfZE2psfO3Hoe9adlp0LQi6YSS5QqFZcqpPXnr+FYGpweW0C7iwAYjP1rtp6y3OOekdivF8vzencVoxSeZHn25qgiqilSeTV2IbIwPxroZzocTmmgU7FJQAAUwDErVKDjmo1H705qWUh0X580q489vpTouCeRgHmmhczs23j26VJfQ2vCpz450E8AC9hH/AJEWvuLsa+GvDuG8XaMVULi9g/8ARi19y44NaUyJnzV+0eQPHekcZP8AZ/8A7VevJR2PQF/6V6x+0kdvjrST/wBQ/wD9qvXkiNlFPUb/AOlTMIheDZHgcjdnPequMsvSrF0MRgFsjPFQfxr6Uo7BLcRiMimninPjOaQDNWSCjJp2cnYDzTT8oqBn2vt7mluNDXLmTjvTTCwI4z9KbJcEyEjA4wKclxIE69eeKeotB4hAjJLBSOAO59ajFuwlJXDKp7VEWdnG4kDGM1at5YtrZyQOg9TSd0UrM6fwveSW024Z2E4P+fxr0jTtSEcYGDtx+dcD4dhRkbIGNowK6+y8uSyYElSvQ151XV3PQpaKxqzyG+D7FSNSM8nJP4VnQy2mlytOQiSgcyfxn2B7UjsLaNm3gEVWs7Ez3C3t8+I0OY424yfU/wCFYmxuLezSoLpYPkcZwSSfxPrReKt3o00bAhWII/2TjpXPapc3MN2zadrKwRt8wiaLcMnkjPpVI+PimnNbzvbtIH+cLwCR096pQb2Jc49TnLVY47iazkZ0Ckg7TjNYfiMwm8iWHAVQQAK0jeNcajJc8DzBkYrnL+Qy6g5J4U7a7qUXzXOKrJcthmGJBTkjgirdvKxTB7e/QVXREdM5+YU+MYkBBweldLOYvfwn0pO9KuTGMgZHFNJpIA7Gm5UEk8c96djg1CyAuaBkvmRKODn6Ck+0qP4CfxqFlx0HNIeOORRyoLmx4du3HinScBV/02D3/wCWi193djXwV4aieXxVpQRSf9Ngz/39WvvTHBq4pLYlts+Zv2lP+R60r/sHf+1XryWIfuFz/fP8q9c/aTAPjjSv+wf/AO1XryKP/VoOcFzWcyojbkgx4xzu61EOHWp7oAR4zyG6VXzhwcUo7DluLJ1pR0pDyaCSO2aYiN3+8D06Yqm7HfkfnViUAkkH3xVZpDnp09KpCY8RqwIOARSxAcqP/wBVMGW+Y+lDRMOVORQBbKIg37gfUcGljSFTndknrVT5gMng9DV/T4BJv3YCr82c9KhrQpPU63Qpk/s2NgQCp2t/SuohIW1DJjmuf0bQJr3TzJZgGdUxLbscb/dT2NXdPmdfMsbotHInBDjDD0JFcc42OyEjVvZ0tbFrk4kaJcqp6bvWuWZde1Ui7Fqwtsg53BS3uMnpWs1vJdMEMx2KfmX19q2BcTxKA2Ag4AHesr8hrbn3OdexvJrYGTTpNgJ3AzgM3uMf41z+oaZDaWxWK1ujubLGUD5T6D1rqNQh1FXEsazJaEEsUO0dOP1rmryd5Yo08+TLn5svnA7/ANKuF90yJ8q0aMexcw3LIuSmDkEYxxWLKd0jv/eYmtrU7pbeJ0QBXkG0euKxU+bAz09a7qevvHFU7CqwC56Z4q1BHlskYqAoeMcEdqtQymM7T0PSrZmizjBppHzZp5+561Gx5pIYvVWqI8Ej3qX+EmogfnNAxU2k5b1FMYBiT1qSNdwIHUnpViK1UcsCx9BUuVhpXNTwNGT430UbCVN/b5x0/wBavWvuMnANfFng6VY/GOjxqgXzL+2Xj2lU/wBK+0sdaqm73FNWPmn9pEKfHOlZ3f8AIP7f9dXryOPGUQBtobOTXr37SMip420nd1/s/wD9qtXjRmAP3mxSkm2NEl3wp44D4qv/ABileUPHtB755pNu1lNKKshPUceW/wAaa0gXrml/iFRTLwxxnjj2pgIwL7QGGX/IUn2dQNzEYHbPWq4cq4bt0pSxIK9RngiqsK463nVWcsAeenbFKbo5JVVBzyCMioNhByKUhc8rzTsK5ahjku5QCQCa6vQvDsj3QYFBhepbHzHsD7D+dc7ouoW0F8sV+hFqxx5iLuaL3x3HqPyr1qw8MkRQzG4jntpE3QzQncki+oP9Kyle9jSNjX8M6XHprHzGUu38Q/pWprOh2OpxYuE/eAYSZV+dD/Ue1UIoo4GVFLgJ0+b/ABrdtttzAw3cYxn3pNFJnluqaVqOhzebKGe3z/rowWT6+oPsa0LW+gkt0Z3RgQGBz19x613FxM1sxjcDPqO9cnq/h+G/3zaeyWd02SVAzDKfdex9x+tYyp32NYzsU9Q1i2mikjVl5XBBPauO1j7Pa6akaHdIRuL47dcUupafqljdeVdWUIc99xII9fpWFc/a74zxykJJGfuDgY7fhUwpNMc6qaMSWV5pC8jZJ/Sjdg5BxT5IyhKsuCOo9KVEBIFd5xiqzvx1qaLORu45FMC7GHGM96tIoLhuvepAlB+UDHamMMmnk8daaRkcGgAHT6Uwfeb61KBiprKEPMzEcKahuxaVx9tbbVLMME1ZKNKRFFyw+96LVhgGhZ1xuJ2pxxmp4bVYISATnruHc1zuRsolvwfZ+V410VigJF9ByTz/AKwV9n9jXyB4aDQeKdIkdTzew8k5/wCWi19f9jW9B3uZVOh8zftLKG8caRkZ/wCJef8A0a1eMMg9cV7N+0s2PHOkf9g8/wDo1q8Zzk1o9zMUKMjFL/EKRe1OHJ6Uhij71JO6Bctx6Y60yWVYl9+wqmxZzuY00rg2IfmfnIFKFH8K8D2po/2Ru9+1Hly5D78GrIFy27inZy3Ix70bpByQGFNaROhDKT+VAxhOZD711Xgvxxd+FLgwSK13pUrZltS3Q/30P8Lfoe/rXKldvB/A048gdiKTVwTsfSejX+n65ZLf6TcLdWxbDhhh4z/ddexrWx5XKgYHpxXzPoHiDUvDuqrf6XcGKX7roeUkX+6w7j/Ir3jwr4stPGmlu1qPs1/CB9otCclc/wASnup9fwPvlJOJtFpnQTRid1Zl6DPPesu/04wN50Sj5eTjirqSvtQMG54q8U86IxgHJGD71DZSOXntY7xY5HRJQhzh1B/A1U8R+GYNXsYL3SbS2S/t8hYmUKk4PWJsevY9j9am8Q6tpHhCdf7S1FUlkXIgjG+Rh67R0+pxXG6n8W4wrRaDpxiLf8t7shyPcIOPzP4UrN7A2lucvqWjx3cLXdqkgVWKOjj54XHWN/Qjse4/HHPNCYX9PwrcFzc3t1NfSXMn2udy8koO0ux55xioJ1lkUyT4LhtpYfxcZrRO2hm11KUaq4Axuwec9qlKhRhcDHpTSQpwOKHPA5HNUSJtOKQ4BA70McZHeheuTTEPHcGtCDbFB5fQtyT/AEqigy49yOtaCIGlQE4+asKjNoItrEDepCMkRJk+m49/51aMNxsOwA9PmPQYqhbsUlnIII3AZ+lXfPlDErLhGHIHeudmyOh0q5WbxJo0UgDNFcQLuxjc29cn86+tDyDXxvoMkh8T6V/1+QZHr+8Wvsj1rqodTCr0PmT9pf8A5HrSP+wef/RrV4z0r2X9pf8A5HrSD/1Dj/6NavGuMVq9zJC5yKbJLsHUZ7ChmCqSapyZZstxnoKErg2K0pkkwg3t6mpRFjBkbcf0psaCMbVGWPU1MF2puPWqEMLcgY49KXzD0pDg5NNNMQZOfT8KjdQ3UU4sRx1oA3cigZGPlwrZ2nofSnkbflOD70MuflI60xWxlGPB6H0oARgUbcOlaeh61eaFrEGp6fKI7iE8Z5Vh3Vh3U9xVDHGDgimD5WxRuB9L+HdftPGOlR6jp5SJlIFzbucm3fqee4PUHuPxxynjP4s2mkrLpnhx0ur5vlkvcAxxeydmb9B7147Dd3FtBPFBcywx3KBJVjcqJFByAwHUZqmQUYBh9MVkqeupo5k11cTXdzLc3EzzzSNueSRizOfUk9aarfMR6imdRSbiFz6fLWpmbOj3Sl9kmM9avXY22AGRnz2x9Ao/xrmYpmjk3IeVORW+sv23T0ePkq53L6ZUf4Gs5KzuUncqkf40zHTnkVIxwMHrioc8daaBigZbJPNSq5jJwahz1xSqD1pNXBOxY+1xbgH2lh/eXpU6X1sGVvk3eocis9ogyM2QCOeh5qqwI+lZ8iZpzNHQQXNmHYkYyc8TCr0d7piwOHjaRyOM3AGPyIrlmj2qpHcUwQ+aT7VHs1vcrnfY7Hw9qdr/AMJXpSqCM3sAH7zOP3i+9fa/Y18EeGIh/wAJPpJOMi+g/wDRq19754IrenFRvYym7nzH+0uf+K60kf8AUO/9qvXjI6cV7N+0v/yPWk/9g7/2q9eLs21MjqelU9yRkjgtyflXrUKEzSl26A8VHI+/CLU2BHCFHU1VhEkeB83btTnOQBUYHapCB6jgdKAI+hoxx6UFge2fpRu/KgQhHvQPlPNPCbuv6U1lK9+negBrvh9rdOxpsqcA9jTnTfHleoqONwwKH8KBjkbcu09RSHDDnqOlNY7SMdaDyN470AOByCOhoPzx7Tx6H0pgPzZHUdvWl6jNAhisQcEU4bQWDdCM/Q0MuefSkDgL0oARyA+5envV3TL9tPuCdnmRPjemcZx0IPYiqB5BHpTs5UHuKGr6DTsbMzwySloCTCTldwwQPQ/SoD15qvbS4IQng9PrVlutTawxBytOBGOOaYD705fu0gJULNFKBI6jbnAOAfrVdY8wgE5Pv61dgdEs59y7iwAB9ORVSA/vCOo9KzvuaW2Go26HZ/EhzUsEZJfY20sPzqNkKy5U8mlhfEu3HUEUPyAveGcP4m0s/wDT7Cf/ACItfeXY18G+GT5fijSyRwbyD/0YtfefY1rDqRI+Y/2mFJ8daQf+od/7VevDZ5ssQD7V7j+0yxHjnScf9A7/ANqvXiu1PvYAPU0+oirCMvkdBUobdIM9qYOMkcU6I5bPXimIlbCkUgb5icU1s7/fFOjO0kYpAMB5+lKQQOKQjBOacDxTEAJMbAHBqJJSp+bmn5weKilG1twH1oAmEin7vQ9RUBG2T2PSmhucinudyZ70AIX3j3FIjbWx/C1MVsNmg8mmBIykNxShuaTO6PPeow3NAEwPao3G0+xpyt+RpcZ4oAizjB9acp5+tIRg7T26U0sfyoAmUkHFXo3LxgnqOtZ5OVDdxU8U21ge3ek0MtN7UL90g0oPzA4z3ppOAcVAyQPiFx260yH5Tn1qa3j3xSHei/L0LY//AFmoYztk25B5qO5fYSX7+e+KktkBuBudVIBIJ/8A1Go34cE9MVLBCZpeGUAddzbaT2GtyxoCkeK9MAb/AJfYPx/eLX3t2NfBXh0bPFWlqSM/bYOh/wCmi1969mraOxmz5i/aaOPHGkf9g8/+jWrxKZsLivbf2mefHOkf9g8/+jWrw5zvl9qOohCcR0QZ5NNk4Bp8XEWfWmA45B3HvTk4Unvmos5YCpVGE9KAGM2XOeKTcRzRJ970pCMjigQ88jOaaVOORTcnuKdkigCAjaTnpSq2DjtUrgEcioSNp9qYCOuDkUg5GakX07VGcrkUASR8HHY0yRMc07sD3FK/zpQAxW6CpCwWoRyPen5BAoAcxBGR1pnVjUjLtxg0jYHI70AIpx8p6UgbBx6UE4cUpGBkUAW7eXcuzkntU/lsQeKz42IYFeDWnDMJogwO1lPPtWctC42ZJDCDA7YRjtJ5bBH61UHyvjOB7c1pgyG24WJvmxkjnp+VUpnaD+LGT0HFZRk7mjSsRvtbk7iauadbxzMfM6Yz19qrpLHIwLEgk9x1/GrywR4JMMT4BP3tppSelgitbjtCgVfFeklev22Dj/totfeA718IeG0B8W6Udn/L9D/F/wBNFr7uIyDW0CJHzD+042PG2lYPJ07H/kV68QUck+le2ftPD/ivNIJ6DTv/AGq9ePw6Tfyx5S3KgjI3sEz+ZrRJvYzb7mdI2Tj3qReIlq4fD2pHrFH/AN/k/wAae2iX4UDyo/8Av6n+NVyS7C5l3M9fv1NkjPParCaHqB/5Zxj6zJ/jUw0LUD/BF/3+T/GlyS7BzIz5OecVGrY/GtN9B1DtHF/3/T/GmHQdQPPlxH/tsn+NHLLsHMu5R46mgAZ61e/sDUMf6mP/AL/p/jR/YGogcRRf9/k/xo5Jdg5l3KUnamMnGa0ToWoY/wBXGf8Atsn+NJ/YOoYzsi+nnJ/jRyy7BzLuZYOCfah1BUEde9aT+HtQxkRx5/67J/jTV0LUgOYU/wC/qf40+SXYOZdzNRuMGgHBxng1oHw9qOeIY/8Av8n+NA8P6kSMwx/9/k/xo5Jdg5l3M512nrTc8YrY/sHUCm0xR/8Af5P8ahPh3Uh0ijP/AG2T/Gjll2DmXcpI29cdaXrx0q4vh/UxyIo/+/yf41IugaiesUeR/wBNk/xo5Jdguu5mN0x3qSM7k2mr8nh/UMD91Hn/AK7J/jTU0HUQciKPP/XZP8aOWXYOZdzPBKPjFWbeYxShvzHqKuP4fv2GfKjz/wBdk/xpv9hakCD5UfH/AE2T/Gk4N9A5kupuW2jz3MauiIyuMqd46VZ/4RmMcyzKB/srz+tUdJOsaeGjWOMx5yF89Rg/nXQxXjzKGlSKM90Mqg/mCR+lcsqdRPY6FODW5Ui0C0Rc+UZu+WOR+lVrjSJo3Y28cTRv0VhjH0NdCJLPylbzFV/TehP86YzRhiEu4FA7lgSfyNTyT6p/cPmj3MDw/omojxbpUhCgC9gztOcDzFr7f7GvkTSLyGPxLpitdqW+2wjAOM/vFr66J4Na0m3uRNWPAP2hbBT4k0i+ZQf9GMaZ9Q5bP6ivJc569a9u/aIwIdA453z/AMlrxHFenRVo3OKo/eDBY8DNWf7I1HGTp15j1+zv/hUujrYHVYRqlzcWtnyXlt4xJIpAyuFPXnFewafr0Oo+H9T1iL4geJhaaYYxMXtYlJLnChRjmqlKxMVc8j1Dw7qek20Fxf2UttHcEiMuMEkAHGO3DA89QaqfYLw2D3y2srWcbiJ5wp2K56KT6mug1/UtMOu2N1b32oeIbWM7p4tRHlbsH7o2ngEE812s3iDQNP8AhNDdyeDbRLfU9QJjsPtMm2QRr/rd3XgjGOlDk0kCSPI+DT1tZ2DlLeVljG5yEOFHqeOB711nxH0bTtN8TQwaXYrYwzWMExgRmYB3Uk9efSvRPETCGXxXA3Elt4XtopAf4WyTj9aHLYfKeGbcdanubG7s4reW5tpYY7lPMhZ1IEi/3l9RWhrvh680Ox0q6vGjRtThadIDxJGgbALDtuHI/wDrV6DqWiaFrvhDwbbX+vrpGpHSx9n+0R5gkG7kM38JzQ5JCUTyfrSYwM1p6/od14d1mbTbxoWnhxkwyB1IIyCCPbt1q94FsodS8faJZ3KhoZbtN6nowHzYP1xiqvpcm2tjMOi6mupf2cdPuRe7d/2cxnzNu3dnb1xt5+lNh0jUp7WS6i0+7e3i275FhYqu77vOO9ejfDfU7S/+I2tajq0S3GpXQme3RwcZxIzjPb5FC/Q16vpcif8ACNQz/Zbq2heOEvEzSkoSD8oOc4Bx04xWUqjjpY0jBM+ZItGv7iF5YrG4kSN1icrETtdvuqeOp7Cpl8N628fmR6LqLpyNy2rkccHnFeweDI72a78Zrvng83Ug0e6SaOQBNzNlkBYfIV46npWn4bt/M0XUF8zU7R7lnMU8ELboFklZGMYYlioK/wAahhkn6DqAoHz3DDLdXMdtBE0s8rBEjUZZmJwAB3Oae9pPFPPDJDIktuSsyFTmMg4Ib0545r2n4V2JstNF3FHqVtY/aDLPeSvbJasqMVz84LjgYOMc55rS+IGp2b+E9X8s3F1aGTa95ZXNqSd5+SNgvzCPdjI6nByaftNbByaXPBIbSa5lWKCF5pGzhI1LMeM8Ac1FsK9RjHrXo3w3udI0N4buPVbE+I78NFbi7V1t7IdDvPGXfoMcY7+rviYkWlaHpNhfaHpena1M8lxObCHYqRglVXdk7iep+gqub3rE8ulzzYjNOMLoAXUruG4ZGMj1+lejeEPhrZXOtacniPVbZDefvINOtZhLLMu0tl2XhFwOvU+1cvrni281zX476aKCKOzIjtbVUBhhjQ/KgU9RxznrTUruyFay1Oe3r/eH51qHw5rIeFDplyXniM0ahMlkAyWAHoCCe+CK7Hw94n1zxH4is9LtdI0AtcSAOf7KiwiZ+Zj7AZqrr3jCa7+KEV7pbIlnY6gPsaRIEUjKox4HO4L1OeMCld3sOytc4QDuKWtzxnYwab451qztlCwQ3kioo6KM5x+GcfhWJVLUkTFGKWigDW8J2gvvGGlQFQWa5Qqccgg5/pX2IRwa+Tfhqf8Ai5mg+90P/QWr6yX7grkrJKVzopPSx49+0Jp00+iaTfIu6K2ndJCP4d6jafzXH5V4ODjivsjV7G11O0msb2BLi2nTZJG4yGFeRan8AoJLpn0rW2ghY5EdzD5hX23KRn8RV06iSsyZwbd0eLAgMCy7lzyM4yPTPauo8QeLrG58Nw+HfD2ltpelrIJ5zLJ5k1xLjqzeg7fQdOldp/woG+P/ADMVr/4DP/8AFUf8M/3v/QxWv/gK/wD8VWjqQfUhQkjyvTJ7W31O3lv7Vry0RwZYFkMZkXuAw6V11z430vWfES3Wu6CtzpFtB9nstOglMS2yggg5HUkDn/61dN/woC9/6GK1/wDAZ/8A4qj/AIUBff8AQxWv/gK//wAVSc4PqPlkjkNQ8cQan8RU8TX2kJPbxsmyy80gBUGE+bHOCM9MGn6R8Sryw8Qa5q99p1vqc2rptaOZiI0IOVGO6jgY9q6v/hn++/6GK0/8Bn/+Ko/4Z/vv+hitP/AZ/wD4qlzUx8szzHV9YvvEGrzanqk5uLqY/MxGAAOigdgOwrR8Sa9b61pPh+0hhkjbSrL7K5cjDnOcjHb6133/AAoC+/6GK1/8Bn/+KoPwAvv+hitP/AZ/8ar2kO5PJI8gJJPJzVvS9Rn0nVLTULYgT2sqzRk9MqcivU/+Gf7/AP6GG0/8Bn/+KpP+Gf7/AP6GK0/8Bn/xo9rHuHJI5K18V6bpvxBm8QWVhOlpIJmFsWXcjSRspAPTaGYke1bifF6K307TYLfRC8tpH5bq8qx27AlSwEKDHVcqTyDzzWn/AMKAvv8AoYrT/wABn/8AiqP+Gf77/oYrX/wFf/4qpcqb3GlNbHNeH/iCvhq51S7sLK4ee9uN6Lc3bPGkZIL7gMbpDjG/sD7c603xVsLvTp9MuNGuorJ441SW1vSl0u1i7AyEHcCxJ9eec5q//wAKAvv+hitf/AV//iqP+Gf77/oYrX/wGf8A+Ko5qY7TON8HeM4/C13qjyQXs0N3AYYUhnCNF8+7OWBGcDqBzWvr/wATLTXPB97o4stQWW4lidZLi4SUDa2T91Vx+tbn/CgL7/oYrX/wGf8A+Kpp/Z/vf+hitf8AwGf/AOKo5qd7hyztY4XQfE1j4ftWmh0K2utYVyYby5cukIxwRF03A9DWLqmralrVytxql/cXsyghWmcsVBJOB6DJNeqf8M/Xv/Qx2v8A4Cv/APFUf8M/3v8A0MVr/wCAz/8AxVV7SG5PJI888G+IU8K+KrPWGtTcrbFiYlYIWyhXrg+tY0o3szDjcSa9c/4UBff9DDa/+Az/APxVL/woG+/6GG1/8Bn/APiqPaQ3uHJI4t/HT23h86Roek2uixzxCO7nhZnmuOORvblVPoPzrL8OalY6T4itNRvrWS6itH81YUIG915QHP8ADuwT9K9H/wCGf73/AKGK1/8AAZ//AIqgfs/33/QxWv8A4DP/APFUueG1x8kjye8upr6+nvLht89xI0sjerMST+pqCvXz+z/e/wDQxWv/AIDP/wDFUn/DP9+P+ZitP/AZ/wDGq9pDuLkkeQ0V68fgBf8A/Qw2n/gM/wDjTov2f7rzB5viK3Cd9lqxP4ZbFHtYdw5JHH/CnT57/wCJmktCpK2rm4lPZUVT/UgfjX1WowoFch4Q8E6T4NsXg09GeaXHnXEuDJJjoPYewrr+lctSfM9DeEeVFa5/1g+lRVLc/wCtH0qKsywooooAKOtFKDg0AZek6/Bq93eQw2V7FFaSSRNczRqsLsjbWCndk4IPUDoagl8aeG4dQjs31uxWSSFp1czp5e1SAfnzjOSOOvX0p2gWM2k6Vex3gQeZe3dydvz/ALt5WcfjtPT8K8KtZ9Jn8X2d695eW2mvp8k32tNFsHKRmVNrSLEj7F/2mUMOnGTQB9DT39pbBTNdQRBxlTJKq7h6jJ5rDsvH2half21nY3El3LczyQKIlB2sj7HJGcgA45x0OemTVTxzo0eq+FZru20/Try8hjQwy3MULFIiyl9jSjarFN20njOM1k/B7Q9KTwmuqJo9ukjX91Ja3MkERneEytsbeox0yMrxjpxQBtxfEbQLi0ubiEahKtqzrLssZDsKy+Wfmxt+96HpzxWlpPifStZ0ptRgmkt7ZLg2pa7jMH70MF2jd1+Y4+vFeDjUf7I1LWhqcQtZGnMbvbyRnaZX3XCoyltyKCdwCnGCHwa63QrK+t/galyxuLlLOex1GG389LjZBEYnYJsHAOHbaeR0oA9hYhWCswDHgAnk0tcPqt0fH3hH+2PD0MiXljem40qeXCCZo3wXUnpHIu9eeoP0rqLLWLG+1S9023uFN5YlfPgYFWQMMq2D1U9mHGQRQBPqOp2WkWRu7+4W3gVgpdgSMnoOAawtE+IvhnxDJbw2GoF7m5leKO3MTeY20sC2Mfd+Und0AIzjOKb4+0/VLzQd+k2H226gWR1AvZrdgdvACxMpkJPGCwA615v4M8HPo/ivRdP12G8ivbgTMCJmycfvXXcl02xNxBxs+bjOSaAPXNb8R6d4egin1F544ZWKB47eSYKQM/NsUlR7nir9ndQ39pDc27+ZDOgkjbBG5SMg4PNecfE66N7PfWehNqlzqdla+dfG01GS3hsoQC2SFYK0zDOxD7E8DnqvDl/ps3heKPw1eRaoLa2UxI16JHJK5USPkkEnqT78cUASWvjnwxfavb6XbazDLe3LMkUSo+XKjLAHbjj61tyOIlZm6KCT9BXiP/CWXenarq2qXPiR28VIHihs3so2tZzG4VrOAZMoG4gZ+Ut9/DAV6Z4y8SLp+kjTbNVl8Q6pGYLKyVsvvYYLtjoiZJZjxx6mgDY0fVrXXdFs9VsmdrW9iWaIuu1ip5GR2q7iuE8E38Pha0HgrVrkRXWkRsbSWX5Re2gyyyJ6lRlWUcjb6Guq0PXbPXrSSe0EyiNgrpNGY3XKh1OPQqysPY0AaPPpRXP61dSR+MvDMEczrHM935iK2A+IMjI74PNdBQAZooooAKKKKAFHWr1Uau0AVrn/AFg+lQ1Nc/60fSoqACiiigAorI1XxLaaTLLFLa6jK8aby0NjLJH0yPnVSv68VX8L+LIvE2nWtwunahZtPbLcEz2zpFyBwshADde3Uc0Ab44NV7XTbCxlmltLG2tpJzulaGFUMh9WIAz+NVZ/EOkQS30P2+GS40+MS3NvE2+WJT0JQcjqPpnnFMu9eis7G0umsNUmF0u5IoLJ5JF4Bw4H3Tz3oA0rq3gvbSS1uoIri3lXZJFKgdHHoQeCKVVEaKqKFVAAqqMAAdAB2rntD8aQeIL14bPR9YWGORonu5rdY4VZeo3b8tyMcA803UvG0Vj4li0WHRtVvJyryStDbnCxqOHXs4LEL1Hf0oA2YdK0+BLdIrG2jS13GFViUCLcCG28cZBOcdcmnWOl6dpayrp1hbWSzNvkFvCsYdumTtAyazvFPiB/Dnhkax9jaRRJArxSt5ZRXdVJJ5AK7u/FczP8SLpBpbQaZZSf2k4ijDX7IA+8g/MYgNu0bgxwGwQue4B36qBjAAA7UnkQC7+1CCP7R5flebsG/ZnO3d1xnnHrUKalbvrNxpalzcW8Edw/y/LsdmVcH1yh4pLfU7O8uru2gnV5rKQRTpggxsVDDOexBBBHB/CgC0cmqUekabDq8uqx6fapqEybJLpYgJXXjgt1I4H5CroOelcbq3xBg0XXNQtL61It7RCVMQd5pXwMIE24+YnAOfQ9M0AdesUas7CNAXOXIUfMcYyfXjjmmWtjZ2AcWdnb2285byYlTcffAGa5bRPG51XRb2Vba3k1WxjMkltBc5hkXj5o5yNrAA4PcMCCOhrDuPi7JAbAPocEP22KCZPNvmOFlV2UkpEw4EfI65PQ8mgD0L+zrI3xvfsdt9rIwZ/JXzP++sZ/WnCythem78iL7SY/KM2wbymc7d3XGecdKyLnxMbf4ejxStkXX7Cl6bcPyAVDEbsdgTzjtWpDqljc3k9pb3lvPc26hpIo5VZkB+6WAPGcd6ALDwQSSwySwRSSQEtE7oGMZIwSpPQ4OOKhsrCz063NvY2kFpCWL+XDGEXJ6nA715/qvxWutKsrmefQII/s808BD6ju3NCm5gNsZ55AGcD6VePxKhi8IzavPaRrOl6bOOCJ3lExUpuKnYG+6xOCByMd6AOqGg6SmsnV1021GosCDdCMeacjB+br04rQFcPZ/FPRrzxEdPxJHbkShJzDKxkZWRRgKp4O9s+hXBxW3rfi+w0H7Sbqz1R0tV3yyw2TtEq4znzDhT+B68UAbtFZGg+Io9ejdl0+/wBPKosix30axSOjZw2wMWAyMfMBWvQAd6KKKAFFXqoir1AFW5/1o+lRVLc/6wfSoqACiiigDmPiBpZ1Xw5GFiluZLedZY7VbX7Slw21lCPHlQV+bO4kBSAT0q14Z0W70rwNpmj3V0y3ltYpbPPDjKuExuXII47ZGOK3aKAOcl8D6bHotra6bLLp99Ys0trqKnfOsrcu7k/6zefvq3De2BjRt01a78ONBqb21vqUkTxPJZlmjViCquu7kdmx26ZPWtGlxzQBy/hBru00i00W80S506XTrVITJhWtpNoC5jcHnON2CAeTmuU8ceFpJ9clnWDUmF5snN/a2puZ0eNxsgUqN0MYUEgoMksctxz6ntz0FBXHUUAcJ4h0VdR+Gy2eh2d/p5nuBJFbSwSGZ5dx2mXLhkG4By5bgKD7Vwtx4b1d7izs9Z0Sd7C2YW1xepYfayWEUokJXJkZXLx4cHGRnCkYr3UNikJLd6AOS1WLW7PxNBqGgafHdRahaQ2UplOxbXZIWEjqSCV2O4wOQwUd60rvR57fXbvX9PUz3T2H2b7GWEa3DI5eMl/4SMsucYw3tW3tx2o3gHrQBV0m9OoaVbXrW1xaGdA5guU2SRnurD1B/wAa8v8AFSa5f+KtbisLO8jEsiW6XCRXCoArW+CHVwDkNJnYFICnnk16397vSdO9AHj/AIL0nX4rfxBYapZT6n51jGn2W8eVYmkZz1aYsuQpydvpjrWfq/hO80+LQbOCxEVzYPbRXR060vjEyojguWjKq/LkkqA2WIz1r3E/N70AFelAHHaraXMngjRrO1sbyTSQqQ31pZo0Vw1uIyoRVchgu4KGGd23PPWtDw1Pp6wSWOmeF77RbeKPI86yW2Rz02jnJP1/OuhznrSYHagDw/X/AAbe2XhzWIk0KCzu797q5t4dPhuZ3RZEC+U0kO1M8Y2tla6ldJin+H0+yxlkvo72OYM1tcJIWaWHewExLn5Ryc447Yr0jmk79aAPM54hb+PYb20Pi62sIoZhsttOIjRmmRvLUeX9xsMSevA5rsfF2n3Wo6ND9kgW6ktbuC7NozBRcLG4Yx5PAPcZ4yozW5RQBlaMtrdmbVF0efTbu4YrMLqIJM2ABk4JGDgcg84rVoooAKKKKADvV6qNX6AKtz/rB9Khqa5/1g+lQ0ALRRRQAUUUUAFFFFAHmfxB13XrHX5NK07WpLKOe1S5DhI/3X7wrtB27udh53d/StLwzq/iHxD4V1me21FZNShuGtoDNFH5alQrFsKoJyGPBzyBS6x4AufEHi6TUL/U3jsFBWOJNjysMcDLR4RQcnb82c9RRoHgfUdC0bV9Olu7bVYLsZhjmzDGzE5JdUX5TgDlSc46CgDjrbxt4huPFk9smqXgV7aIRh4LbYrmRxnb2zge/H0rsfGOs+JNF0XS7CyuLNta1CMQSCO3kkkV8DzJ41XgInLfMMfdHeqo+FEEbtqUdxA+rvxIkglFm0eOIggfeoB5DbicliQQcV0Os+GW1XwtbafH9ktLiFYgQEaSF1RgzQt0ZomIwRkZ4z6UAR+DfFsHiG02/wBoRahLt3+bbWcsUaAYBVmfIL5zkA/hXn91rviSa51ySLUNVKW97eRRGIyhFVHYKBtiZeAAOvbmvRvDOk6po+mvYzrpUdtEGNrDZCVVUlmYg7ycLk8ADj8q529+GhvkudSntdDfWLm8huniNsRbBIycxk4LMW3MWYj5jjjAFAG9YanrX/CH6HdWmnf2teXdrC8rPcpAqkxqS7Eg9STwoJoOt65pl9YLrmn6etrf3C2qyWVw7tDIwOzcHUblJGMjpkcYrT0K31Gz0cQalLatcBm2LaptihTokaggEhRgZI5qhZ+GJTqlvqOtazdazc2hLWyPGkMELEEb1jQctgkBmJxk4xQA2DWtVN5rbW2nvqkdtqK2kEEUkcLIohRnYs5GfnY+9U/AviLVdZ8EJqGtRLZybXIuZZY2DgMwLkLgKBjGD1xV1fDlzYXXiC+0q/WK+1iRJUaeMvHbMqBSQoIzzlu3J54q3p/hvTbLwzb6BJAt5YQQrCUuFDiUA5JYdCSeT7mgDi/CfjO81HxKWvfEAm0eQi3tHbSWtkvJieGWXBUL2UFssfwz6VjHFcPb+CNbaZ7S/wDEn2rRnkjlkhZHaWVo5PMX5mYiMHChggxhRgLk1vQ6bq6eLrjUJdS36fIp2wb2OMqoC7MbVwwZt4OTuwelAG1RRRQAUUUUAFFFFABRRRQAVeqj1q9QBHPHvUEdRVWr1IURuSoJoApUVc8mP+6KPJj/ALooAp0Vc8mP+6KPKj/uigCnRVzyY/7opPKj/uCgCpRVzyo/7go8mP8AuigCnRVzyo/7oo8mP+4KAKdFXPKj/uijyY/7ooAp0Vb8qP8AuCl8qP8AuigCnRirnlR/3BR5Mf8AdFAFOirflR/3BR5Uf90UAVKKueVH/cFHkx/3RQBToq35Mf8AcFL5Mf8AdFAFOirnkx/3BR5Mf90UAU6KueTH/dFHlRj+EUAQQx7myegq1SfSloA//9k=",
  SAR: "data:image/jpeg;base64,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",
};

/* ═══════════════════════════════════════════════════
   TYPE METADATA
═══════════════════════════════════════════════════ */
const TYPE_INFO = {
  SOC: { name:"探究者",     en:"The Questioner",    sub:"問い続けることに、生きる意味を見出す人です。答えよりも「なぜ？」を大切にし、対話と思索の中に喜びを感じます。" },
  PLA: { name:"理想家",     en:"The Idealist",      sub:"美しき理想をこの世に実現しようとする人です。現実の先に輝かしいビジョンを見て、それに向かって情熱を燃やします。" },
  ARI: { name:"実践家",     en:"The Pragmatist",    sub:"考えるより先に動き、現実の中で最善を尽くす人です。バランス感覚に優れ、経験と実績を積み上げることを信じます。" },
  NIE: { name:"自由人",     en:"The Free Spirit",   sub:"他者に与えられた価値観を超え、自分だけの尺度で生きる人です。逆境をも力に変え、自己を不断に超越しようとします。" },
  EPI: { name:"快楽主義者", en:"The Epicurean",     sub:"心の平静と小さな喜びの積み重ねに、真の豊かさを見出す人です。無駄な競争を避け、心地よい生き方を選択します。" },
  STO: { name:"運命受容者", en:"The Stoic",         sub:"変えられないものを静かに受け入れ、今できることに集中する人です。逆境の中でも態度を崩さない内的強さを持ちます。" },
  DEC: { name:"懐疑者",     en:"The Skeptic",       sub:"あらゆることを疑い、論理と証拠によって真実に近づこうとする人です。「本当にそうか？」という問いが思考の出発点です。" },
  SAR: { name:"実存者",     en:"The Existentialist",sub:"自由の重さを引き受け、自分の選択に責任を持って生きる人です。人生に与えられた意味はなく、自分で意味を作るものだと考えます。" },
};

/* ═══════════════════════════════════════════════════
   PHILOSOPHER CARDS DATA
═══════════════════════════════════════════════════ */
const CARDS = {
  SOC: [
    { name:"ソクラテス",             cat:"哲学者",           years:"BC470 — BC399",
      quote:"「無知の知」— 自分は何も知らないと認めることで、本当の探究が始まる。",
      phil:"対話によって人の本質を暴き続け、答えではなく『問い続ける姿勢』を人生そのものにした人物。最終的には死刑判決を受けながらも、自分の哲学を曲げなかった。" },
    { name:"宮崎駿",                 cat:"アニメーション監督", years:"1941 —",
      quote:"「世の中の大事なことって、たいてい面倒くさいんだよ。」",
      phil:"単なる娯楽ではなく、『人間とは何か』を作品で問い続けた。理想よりも、人間の矛盾や弱さを深く見つめる作風は、探究者タイプの本質を体現している。" },
    { name:"カール・ユング",          cat:"心理学者",          years:"1875 — 1961",
      quote:"「あなたが無意識にしていることを意識化しない限り、それは運命として現れる。」",
      phil:"『自分を知ること』を人生最大のテーマとして扱い、人間の深層心理や集合的無意識を研究した。内面探究型の代表格。" },
    { name:"村上春樹",               cat:"文豪",              years:"1949 —",
      quote:"「記憶ってのはね、生きるためにあるんだ。」",
      phil:"喪失感・孤独・自我をテーマにした作品が多い。明確な答えを出さず、『考え続ける余白』を読者へ与える。世界規模で支持される探究型の文学者。" },
    { name:"岡本太郎",               cat:"芸術家",            years:"1911 — 1996",
      quote:"「自分の中に毒を持て。」",
      phil:"常識に流される日本社会へ強烈な疑問を投げかけ続けた。『本当にそれでいいのか？』を生涯叫び続けた探究と反骨を兼ね備える存在。" },
  ],
  PLA: [
    { name:"プラトン",               cat:"哲学者",            years:"BC427 — BC347",
      quote:"「理想を持たぬ者に、美しい人生はない。」",
      phil:"ソクラテスの弟子。現実世界の奥に『完全な理想世界』が存在すると考えた。理念や美を重視する思想の原点として、2400年を超えて影響を与え続けている。" },
    { name:"スティーブ・ジョブズ",    cat:"経営者",            years:"1955 — 2011",
      quote:"「ハングリーであれ。愚かであれ。」",
      phil:"機能ではなく『美しい未来』を作ろうとした。世界観で人を魅了した理想主義者。Apple製品を通じて「こうあるべき」という理想を現実に刻み込み続けた。" },
    { name:"レオナルド・ダ・ヴィンチ", cat:"芸術家・科学者",    years:"1452 — 1519",
      quote:"「学ぶことをやめた時、人は死ぬ。」",
      phil:"絵画・建築・解剖学・工学——人類の理想像のような万能の天才。『完全性』への執着が人生そのものだった。未完の作品群さえも後世への問いかけとなった。" },
    { name:"ウォルト・ディズニー",     cat:"経営者・クリエイター",years:"1901 — 1966",
      quote:"「夢見ることができれば、それは実現できる。」",
      phil:"現実逃避ではなく、『理想世界を作る』ことに人生を賭けた。世界観で人々を魅了した代表的人物。夢を語るだけでなく、それを組織として実現した稀有な理想家。" },
    { name:"坂本龍一",               cat:"音楽家",            years:"1952 — 2023",
      quote:"「芸術は、世界を少しだけ良くできる。」",
      phil:"美しさと社会性を両立した作品を多く残した。環境問題や平和を訴えながら、理想と感性で世界を表現し続けた。その音楽は国境を超えて心に刻まれる。" },
  ],
  ARI: [
    { name:"アリストテレス",          cat:"哲学者",            years:"BC384 — BC322",
      quote:"「人は繰り返すことの結果である。」",
      phil:"現実観察を重視し、理想論ではなく『現実でどう生きるか』を考えた。論理・経験・実践を重視する思想の基盤を作り、あらゆる学問を体系化した実践哲学の父。" },
    { name:"稲盛和夫",               cat:"経営者",            years:"1932 — 2022",
      quote:"「動機善なりや、私心なかりしか。」",
      phil:"京セラ創業者。経営を『人間として正しいか』で判断した。理論だけでなく、現場で成果を出し続けた実践者。JALの再建など不可能と思われた課題も成し遂げた。" },
    { name:"渋沢栄一",               cat:"実業家",            years:"1840 — 1931",
      quote:"「論語と算盤。」",
      phil:"日本資本主義の父。道徳と経済を両立させようとした。現実社会の中で理想を実装し続け、500以上の企業・団体の設立に関わった稀代の実践家。" },
    { name:"大谷翔平",               cat:"アスリート",         years:"1994 —",
      quote:"「先入観は可能を不可能にする。」",
      phil:"二刀流という前例のない挑戦を、地道な努力で実現した。理論と継続を積み上げる実践型の代表格。目標から逆算して今やるべきことを積み上げる姿勢が際立つ。" },
    { name:"松下幸之助",             cat:"経営者",            years:"1894 — 1989",
      quote:"「素直な心。」",
      phil:"パナソニック創業者。現場主義と人間理解を重視した経営者。『現実の中で最善を探す』タイプの代表格。小学校中退から世界的企業を築いた不屈の実践者。" },
  ],
  NIE: [
    { name:"フリードリヒ・ニーチェ",   cat:"哲学者",            years:"1844 — 1900",
      quote:"「神は死んだ。」",
      phil:"既存の価値観を破壊し、『自分で人生の意味を作れ』と説いた。孤独と反骨の象徴。自己超越を「超人」と呼び、与えられた価値観を超えることを人生の目的とした。" },
    { name:"イーロン・マスク",        cat:"経営者",            years:"1971 —",
      quote:"「普通でいるな。」",
      phil:"Tesla・SpaceX創業者。世間の常識より、自分の理想と挑戦を優先し続ける。現代版ニーチェとも呼ばれ、『不可能』という言葉を単なる先入観として退けてきた。" },
    { name:"尾田栄一郎",             cat:"漫画家",            years:"1975 —",
      quote:"「人の夢は終わらねぇ！」",
      phil:"『自由』をテーマに、ONE PIECEを描き続ける漫画家。既存ルールに縛られない生き方を作品で表現し、世界中の読者に「自分の道を行け」というメッセージを届け続けている。" },
    { name:"マイケル・ジョーダン",     cat:"アスリート",         years:"1963 —",
      quote:"「限界なんてただの幻想だ。」",
      phil:"NBA史上最高の選手の一人。勝利と自己超越に執着した。『強さこそ価値』という信念を体現し、失敗を糧に自分を鍛え続けた。6度の優勝は妥協しない意志の産物。" },
    { name:"岡本太郎",               cat:"芸術家",            years:"1911 — 1996",
      quote:"「芸術は爆発だ。」",
      phil:"常識を嫌い、『自分自身であること』を貫いた芸術家。自由と衝動を人生で表現し、『本当に生きるとはどういうことか』を全身で問い続けた自由人の象徴。" },
  ],
  EPI: [
    { name:"エピクロス",             cat:"哲学者",            years:"BC341 — BC270",
      quote:"「足るを知る者は富む。」",
      phil:"『幸福とは、派手な快楽ではなく心の平穏である』と説いた古代ギリシャの哲学者。小さな幸せ・穏やかな人生を重視した思想は、現代の幸福論にも深く影響を与えている。" },
    { name:"タモリ",                 cat:"司会者・芸人",       years:"1945 —",
      quote:"「適当にやればいいんだよ。」",
      phil:"日本を代表する司会者。力みすぎず、自然体で生きる姿勢が多くの人に愛された。『頑張りすぎない哲学』を体現しながら、50年以上トップであり続けた希有な存在。" },
    { name:"是枝裕和",               cat:"映画監督",          years:"1962 —",
      quote:"「日常の中に、人間の本質がある。」",
      phil:"何気ない日常や静かな感情を丁寧に描く作品が特徴。刺激より『穏やかな豊かさ』を大切にする人物。カンヌ映画祭パルム・ドール受賞作『万引き家族』はその代表作。" },
    { name:"ジョン・レノン",          cat:"ミュージシャン",     years:"1940 — 1980",
      quote:"「人生は、他のことを考えている時に起きている。」",
      phil:"ビートルズのメンバー。平和・愛・日常の幸福を重視したアーティスト。成功の先に『心の豊かさ』を求め続け、『Imagine』で世界中の人に穏やかな夢を与えた。" },
    { name:"ムーミン",               cat:"フィクション",       years:"1945（作品誕生）",
      quote:"「自由でいることは、とても大切なんだ。」",
      phil:"競争よりも、自分らしい穏やかな生活を大切にする北欧作品の人気キャラクター。エピクロス思想を非常に現代的に表現した存在として、世界中で愛され続けている。" },
  ],
  STO: [
    { name:"マルクス・アウレリウス",   cat:"哲学者・ローマ皇帝", years:"121 — 180",
      quote:"「外側の出来事ではなく、それをどう受け取るかが重要だ。」",
      phil:"最大の権力を持ちながら、日記『自省録』には謙虚な自己省察が綴られていた。ストレスや不安を『受け止め、律する』思想を残し、現代のメンタル論にも大きな影響を与えている。" },
    { name:"ヴィクトール・フランクル",  cat:"精神科医・哲学者",   years:"1905 — 1997",
      quote:"「人生に絶望は存在しない。意味を見失うだけだ。」",
      phil:"ナチス強制収容所を生き延びた精神科医。極限状況でも『人は態度を選べる』と説いた。ストア派精神を現代で最も鮮烈に体現した人物。著書『夜と霧』は世界的名著。" },
    { name:"三浦知良（キング・カズ）",  cat:"アスリート",         years:"1967 —",
      quote:"「やめる理由より、続ける理由を探したい。」",
      phil:"50代を超えてもプロサッカー選手として現役を続ける自己管理と精神力で有名。感情ではなく『継続』を選び続ける姿勢は、ストア哲学の体現そのものと言える。" },
    { name:"羽生善治",               cat:"将棋棋士",          years:"1970 —",
      quote:"「結果が出ない時こそ、自分を見失わないこと。」",
      phil:"冷静さと継続力で長年トップを維持した将棋界の第一人者。感情に飲まれず、自分を律するタイプ。八冠達成という歴史的偉業も、静かな自己管理の積み重ねの上にある。" },
    { name:"アーノルド・シュワルツェネッガー", cat:"俳優・政治家",years:"1947 —",
      quote:"「壁ではなく、その先を見ろ。」",
      phil:"ボディビルダー・俳優・カリフォルニア州知事と、三つの頂点を制した。努力と規律を徹底し、自ら人生を切り拓いたストイックさの象徴。" },
  ],
  DEC: [
    { name:"ルネ・デカルト",          cat:"哲学者・数学者",      years:"1596 — 1650",
      quote:"「我思う、ゆえに我あり。」",
      phil:"あらゆるものを疑い抜いた末に「考えている自分だけは確かだ」と結論づけた。近代哲学の父として、理性と論理による真理探究の基礎を築いた。" },
    { name:"アルベルト・アインシュタイン", cat:"物理学者",       years:"1879 — 1955",
      quote:"「常識とは、18歳までに身につけた偏見のコレクションだ。」",
      phil:"既存理論を疑い、新しい宇宙観を作った物理学者。疑問を持つ力で歴史を変えた人物。相対性理論は、当たり前を疑い続けた末に生まれた思考の結晶。" },
    { name:"堀江貴文",               cat:"実業家",            years:"1972 —",
      quote:"「常識を疑え。」",
      phil:"既存社会のルールや固定観念へ疑問を投げ続ける実業家。合理性と論理を強く重視するタイプ。「やりたいことをやれ」という一貫したメッセージで多くの人に影響を与えている。" },
    { name:"シャーロック・ホームズ",    cat:"フィクション",       years:"1887（作品誕生）",
      quote:"「データだ。僕はデータなしに結論は出さない。」",
      phil:"観察・分析・推理を徹底する知性の象徴。感情より論理で世界を見る。コナン・ドイルが描いた名探偵は、懐疑的思考の極致として今も世界中で愛され続けている。" },
    { name:"ビル・ゲイツ",           cat:"経営者",            years:"1955 —",
      quote:"「成功を祝うのはいいが、失敗から学ぶほうが大事だ。」",
      phil:"合理性と分析力でMicrosoftを世界企業に育てた。感情より『最適解』を追う人物。現在は慈善活動に注力し、論理的アプローチで世界的問題の解決に挑んでいる。" },
  ],
  SAR: [
    { name:"ジャン＝ポール・サルトル",  cat:"哲学者・作家",       years:"1905 — 1980",
      quote:"「人間は自由の刑に処されている。」",
      phil:"『人生に決められた意味はない』と説いた実存主義哲学者。自由と責任を真正面から描き、『実存は本質に先立つ』という言葉で20世紀の思想を塗り替えた。" },
    { name:"太宰治",                 cat:"文豪",              years:"1909 — 1948",
      quote:"「恥の多い生涯を送って来ました。」",
      phil:"人間の弱さ・孤独・生きづらさを描き続けた文豪。『自分とは何か』に苦しみ続けた実存者。『人間失格』は今もなお日本で最も読まれる小説の一つ。" },
    { name:"カート・コバーン",         cat:"ミュージシャン",     years:"1967 — 1994",
      quote:"「他人に嫌われるより、自分を嫌いになる方が怖い。」",
      phil:"Nirvanaのボーカル。社会への違和感や孤独を音楽で表現した。感受性と自由を極限まで貫き、世界中の若者に「自分の感情を生きる」ことの意味を問いかけた。" },
    { name:"三島由紀夫",             cat:"作家",              years:"1925 — 1970",
      quote:"「命を懸けて生きなければ、生は退屈だ。」",
      phil:"美・死・存在意義に強く執着した作家。『どう生きるか』を命がけで表現した人物。その圧倒的な文体と行動は、日本文学史上最も鮮烈な実存的生き方として記憶されている。" },
    { name:"チェ・ゲバラ",            cat:"革命家",            years:"1928 — 1967",
      quote:"「真の革命家は、愛によって導かれる。」",
      phil:"既存社会へ疑問を抱き、自ら行動を起こした革命家。思想と人生を一致させようとした人物。医師でありながら革命に身を投じた姿は、実存主義的生き方の極致。" },
  ],
};


/* ═══════════════════════════════════════════════════
   MBTI TYPE INFO & CARDS
═══════════════════════════════════════════════════ */
const MBTI_TYPE_INFO = {
  INTJ: { tagline:"戦略で未来を設計する者",   desc:"長期的視点と戦略的思考で、あるべき未来を緻密に設計する。感情より構造で世界を捉え、一歩先を読んで動く。" },
  INTP: { tagline:"真理を探し続ける思考者",   desc:"論理と探究心を武器に、世界の仕組みを解き明かそうとする。問いに終わりはなく、思考そのものが喜びになる。" },
  ENTJ: { tagline:"世界を動かす統率者",       desc:"明確なビジョンと圧倒的な統率力で人と組織を動かす。目標を定めたら、全力でそこへ向かう行動型リーダー。" },
  ENTP: { tagline:"常識を壊す革命家",         desc:"既存の枠組みを疑い、新しいアイデアで世界を揺さぶる。議論と発見を楽しみ、変化そのものを喜びとする。" },
  INFJ: { tagline:"理想で人を導く思想家",     desc:"深い洞察と強い信念で、人々をより良い未来へ導く。内なるビジョンを持ち、静かに、しかし力強く世界に働きかける。" },
  INFP: { tagline:"感性で世界を見つめる詩人", desc:"繊細な感受性と深い内省で、世界の美しさと痛みを感じ取る。自分だけの価値観を大切にし、それを表現し続ける。" },
  ENFJ: { tagline:"人を導き、想いで動かす者", desc:"人の可能性を信じ、言葉と行動で周囲を鼓舞する。チームや社会をより良くすることに喜びを見出すリーダー。" },
  ENFP: { tagline:"情熱で世界を広げる自由人", desc:"好奇心と情熱で新しい世界を切り開く。人との繋がりを大切にし、可能性を信じて自由に飛び回る行動家。" },
  ISTJ: { tagline:"責任と秩序を守る現実主義者", desc:"約束を守り、地道に努力を積み重ねる。信頼と実績を土台に、社会の基盤を支える堅実な現実主義者。" },
  ISFJ: { tagline:"静かに支え続ける守護者",   desc:"献身的に人を支え、表に出ずとも周囲を支える。温かな気遣いと誠実さで、大切な人や場所を守り続ける。" },
  ESFJ: { tagline:"人との繋がりを大切にする支援者", desc:"思いやりと責任感で人々を繋ぎ、コミュニティを温める。調和を重んじ、人を支えることに生き甲斐を感じる。" },
  ESFP: { tagline:"人生を全力で楽しむ行動家", desc:"今この瞬間を全力で生き、周囲を明るく照らす。挑戦を恐れず、行動の中に喜びを見出す自由奔放な存在。" },
  ESTP: { tagline:"勝負を楽しむ挑戦者",       desc:"瞬発力と決断力で現場を制す。リスクを恐れず、スピード感あふれる行動で勝機を掴む現実的な挑戦者。" },
  ESTJ: { tagline:"組織を動かす統率者",       desc:"秩序と責任を軸に、組織を力強く動かす。現実を直視し、安定した成果を着実に生み出す実行者。" },
  ISTP: { tagline:"静かに極める職人",         desc:"論理と感覚で物事の本質を見抜き、黙々と技を極める。言葉より行動で語り、実践の積み重ねに真価がある。" },
  ISFP: { tagline:"感性で世界を表現する自由人", desc:"美しさと感性に従い、独自の世界を生きる。ルールより直感を信じ、自分らしい表現で人々の心に触れる。" },
};

const MBTI_CARDS = {
  INTJ: [
    { name:"ニッコロ・マキャヴェッリ", cat:"政治思想家",   years:"1469 — 1527",
      quote:"「結果が世界を動かす。」",
      phil:"感情ではなく構造と戦略で世界を見た政治思想家。『君主論』は権力の本質を冷徹に分析した名著。INTJの持つ「目的のために全体を設計する」姿勢の原点。" },
    { name:"レイ・ダリオ",           cat:"投資家",         years:"1949 —",
      quote:"「原則を持て。」",
      phil:"人生と経営を徹底的にルール化し成功した投資家。著書『PRINCIPLES』では論理と長期視点による意思決定を説く。感情を排した戦略思考のINTJ的実践者。" },
    { name:"ピーター・ティール",      cat:"投資家・経営者", years:"1967 —",
      quote:"「競争するな、独占しろ。」",
      phil:"PayPal共同創業者。『ゼロ・トゥ・ワン』で「競合から逃げ、独自の価値を作れ」と説いた。未来を先読みして逆張りする思想家型経営者の代表。" },
    { name:"ハンニバル",             cat:"将軍",           years:"BC247 — BC183",
      quote:"「道がなければ作る。」",
      phil:"アルプスを象と共に越えてローマを追い詰めた伝説の将軍。常識外れの戦略で数倍の敵を翻弄し続けた。知略と大局観で歴史を動かしたINTJの象徴。" },
  ],
  INTP: [
    { name:"アルベルト・アインシュタイン", cat:"物理学者",  years:"1879 — 1955",
      quote:"「私はただ、人より長く問題を考えているだけだ。」",
      phil:"相対性理論で宇宙の概念を塗り替えた物理学者。既存理論を疑い続け、思考実験から新しい世界観を生み出した。知的探究を喜びとするINTPの象徴的存在。" },
    { name:"ルネ・デカルト",          cat:"哲学者・数学者", years:"1596 — 1650",
      quote:"「我思う、ゆえに我あり。」",
      phil:"すべてを疑い抜いた末に「考える自分だけは確かだ」と結論づけた近代哲学の父。解析幾何学も創始し、論理思考の体系を作り上げた純粋な思索者。" },
    { name:"アイザック・ニュートン",   cat:"科学者・数学者", years:"1643 — 1727",
      quote:"「私は巨人の肩の上に立っている。」",
      phil:"万有引力と微積分を独自に発展させ近代科学の礎を築いた。孤独な研究を好む内省的な天才。誰にも言わず20年間研究を温めた静かな探究者の典型。" },
    { name:"アラン・チューリング",     cat:"数学者・計算機科学者", years:"1912 — 1954",
      quote:"「機械は考えられるか？」",
      phil:"コンピュータとAIの理論的基盤を作った天才数学者。エニグマ暗号解読で第二次世界大戦の行方を変えた。純粋な知的好奇心から世界を変えたINTPの体現者。" },
  ],
  ENTJ: [
    { name:"ナポレオン・ボナパルト",   cat:"皇帝・軍人",    years:"1769 — 1821",
      quote:"「不可能という言葉はない。」",
      phil:"一兵士からヨーロッパ皇帝まで駆け上がった稀代のリーダー。圧倒的な統率力と決断力でフランスを変革し、世界地図を塗り替えた。ENTJの象徴的存在。" },
    { name:"孫正義",                 cat:"経営者",          years:"1957 —",
      quote:"「志高く。」",
      phil:"SoftBank創業者。300年先を見据えた「300年構想」を掲げ、巨大ビジョンで世界を動かし続ける経営者。スピードと大胆さで不可能を可能にしてきた超長期思考型。" },
    { name:"ジャック・ウェルチ",      cat:"経営者",          years:"1935 — 2020",
      quote:"「変化せよ。」",
      phil:"GE元CEO。在任中に企業価値を40倍にした伝説の経営者。成果主義と組織改革を徹底し、明確な目標と結果で組織を牽引した。ENTJの結果重視精神の体現。" },
    { name:"チンギス・ハン",          cat:"皇帝",            years:"1162 — 1227",
      quote:"「恐れるな。」",
      phil:"遊牧民の一族長から人類史上最大の陸上帝国を作り上げた統率者。圧倒的な行動力と組織力で歴史を変えた。ENTJの持つ「ビジョンを現実にする力」の極致。" },
  ],
  ENTP: [
    { name:"フリードリヒ・ニーチェ",   cat:"哲学者",          years:"1844 — 1900",
      quote:"「神は死んだ。」",
      phil:"既存の価値観・道徳・宗教を根底から批判した哲学者。「超人」概念で自ら意味を作ることを説いた。あらゆる前提を疑い、新たな思想を構築するENTPの原型。" },
    { name:"レオナルド・ダ・ヴィンチ", cat:"芸術家・科学者",   years:"1452 — 1519",
      quote:"「学ぶことをやめた時、人は死ぬ。」",
      phil:"絵画・彫刻・解剖学・工学・音楽を横断した万能の天才。好奇心の赴くまま世界を探究し、数百年先の発明を構想した。アイデアが尽きることのないENTPの象徴。" },
    { name:"堀江貴文",               cat:"実業家",           years:"1972 —",
      quote:"「常識を疑え。」",
      phil:"既存社会のルールや固定観念に挑戦し続ける実業家。「ロケット・寿司・マンガ」と次々新分野へ飛び込み、合理性と論理で既成概念を壊し続ける現代のENTP。" },
    { name:"ヴォルテール",            cat:"思想家・作家",     years:"1694 — 1778",
      quote:"「私はあなたの意見に反対だ。だが、それを言う権利は命がけで守る。」",
      phil:"権力・宗教・慣習を皮肉と知性で批判したフランス啓蒙思想家。フランス革命の精神的土台を作った。議論と批判を武器にした討論型知識人の原型。" },
  ],
  INFJ: [
    { name:"マハトマ・ガンディー",     cat:"指導者・思想家",  years:"1869 — 1948",
      quote:"「あなたが世界で見たい変化に、あなた自身がなりなさい。」",
      phil:"非暴力・不服従でイギリス植民地支配に抵抗し、インド独立を導いた。理想と精神性で国民を動かした稀有なリーダー。静かに、しかし力強くINFJの本質を体現。" },
    { name:"マーティン・ルーサー・キング Jr.", cat:"公民権運動指導者", years:"1929 — 1968",
      quote:"「私には夢がある。」",
      phil:"人種差別撤廃を掲げ、非暴力で公民権運動を牽引した。一つの演説で国を動かした信念の人。深い洞察と揺るがぬ理想で人々を導いたINFJのリーダー像。" },
    { name:"カール・ユング",           cat:"心理学者",        years:"1875 — 1961",
      quote:"「あなたの無意識が人生を支配する。」",
      phil:"集合的無意識・元型・内向/外向などの概念を提唱した心理学者。人間の内面世界を深く探究し、「自分を知ること」を最大の使命とした内面洞察型の代表格。" },
    { name:"ネルソン・マンデラ",        cat:"政治家・活動家",  years:"1918 — 2013",
      quote:"「許しは魂を自由にする。」",
      phil:"27年の獄中生活を経て南アフリカ初の黒人大統領に。憎しみでなく赦しと和解を選び、国家を分裂から救った。長期的理想と精神的強さを併せ持つINFJの体現。" },
  ],
  INFP: [
    { name:"太宰治",                  cat:"文豪",            years:"1909 — 1948",
      quote:"「恥の多い生涯を送って来ました。」",
      phil:"人間の弱さ・孤独・生きづらさを描き続けた文豪。自分自身の内面を徹底的に掘り下げ、『人間失格』など普遍的な苦悩を作品に昇華させた。繊細な感受性の象徴。" },
    { name:"宮沢賢治",                cat:"童話作家・詩人",   years:"1896 — 1933",
      quote:"「世界がぜんたい幸福にならないうちは個人の幸福はあり得ない。」",
      phil:"岩手の自然に根ざし、人と自然・宇宙の繋がりを作品で表現し続けた。優しさと理想を全創作に込め、生前ほとんど認められないまま37歳で逝去。純粋な精神世界型。" },
    { name:"星野道夫",                cat:"写真家",           years:"1952 — 1996",
      quote:"「自然の中に、人間の本当の姿がある。」",
      phil:"アラスカの大自然と向き合い続けた写真家。人間社会の喧騒から離れ、静かに自然と生きた。その文章と写真は今も多くの人の心に「本当の生き方」を問いかける。" },
    { name:"ヘルマン・ヘッセ",         cat:"作家",            years:"1877 — 1962",
      quote:"「自分自身になることほど難しいことはない。」",
      phil:"『デミアン』『シッダールタ』など内面世界の探究を描いたノーベル賞作家。自己発見の旅と精神的成長をテーマに、世界中の若者の心に灯をともし続けている。" },
  ],
  ENFJ: [
    { name:"山本五十六",              cat:"海軍軍人",         years:"1884 — 1943",
      quote:"「やってみせ、言って聞かせて、させてみせ、ほめてやらねば、人は動かじ。」",
      phil:"連合艦隊司令長官。人材育成と部下への信頼を何より重んじたリーダー。『人を動かす力』の体現者として、その言葉は今も経営・教育の場で語り継がれる。" },
    { name:"上杉鷹山",               cat:"藩主",             years:"1751 — 1822",
      quote:"「為せば成る。」",
      phil:"財政破綻寸前の米沢藩を改革した名君。自ら倹約を実践し、民とともに藩を立て直した。ジョン・F・ケネディが最も尊敬する日本人と述べた、民を想う行動型リーダー。" },
    { name:"稲盛和夫",               cat:"経営者",           years:"1932 — 2022",
      quote:"「動機善なりや、私心なかりしか。」",
      phil:"京セラ・KDDIを創業しJALを再建した経営者。『人として正しいこと』を軸に、人を育て組織を導いた。利他の心を経営哲学の中心に置いたENFJの体現者。" },
    { name:"聖徳太子",               cat:"政治家・思想家",   years:"574 — 622",
      quote:"「和を以て貴しとなす。」",
      phil:"日本古代の改革者。十七条憲法で調和と対話を重視した統治を定め、仏教精神で国をまとめた。人々の意見を聴き、理念で動かすENFJ型リーダーの原型。" },
  ],
  ENFP: [
    { name:"坂本龍馬",               cat:"幕末志士",         years:"1836 — 1867",
      quote:"「世に生を得るは事を成すにあり。」",
      phil:"脱藩浪士から時代の変革者へ。薩長同盟を仲介し明治維新の礎を作った。自由な発想と行動力、人を繋ぐ才能で歴史を動かしたENFPの代表格。" },
    { name:"チェ・ゲバラ",            cat:"革命家",           years:"1928 — 1967",
      quote:"「真の革命家は愛によって導かれる。」",
      phil:"医師でありながら革命に身を投じた情熱の人。理想を掲げ、行動で世界を変えようとした。純粋な情熱と人間への愛が行動の源だったENFPの象徴。" },
    { name:"スティーブ・ウォズニアック", cat:"エンジニア",     years:"1950 —",
      quote:"「楽しさを忘れるな。」",
      phil:"Apple共同創業者。好奇心と遊び心で世界初のパーソナルコンピュータを生み出した。利益より『面白さ』を優先し続けた純粋な発明家。自由で創造的なENFPの体現。" },
    { name:"アンリ・ルソー",          cat:"画家",             years:"1844 — 1910",
      quote:"「私は私の世界を描く。」",
      phil:"独学で独自の幻想的世界を描いたナイーブ・アート（素朴派）の画家。批評家の評価を気にせず純粋な感性で描き続けた。ありのままの自分を表現したENFPの精神。" },
  ],
  ISTJ: [
    { name:"徳川吉宗",               cat:"江戸幕府将軍",     years:"1684 — 1751",
      quote:"「質素倹約。」",
      phil:"享保の改革を断行し財政悪化した幕府を立て直した第8代将軍。自らも木綿の着物を纏い倹約を実践した。責任感と堅実さで時代を支えたISTJの体現者。" },
    { name:"二宮尊徳",               cat:"農政家・思想家",   years:"1787 — 1856",
      quote:"「積小為大。」",
      phil:"幼少期の極貧から努力で身を立て、荒廃した農村を次々と復興させた。小さな行動の積み重ねこそが大きな成果を生むと説き実践した。勤勉と誠実の象徴。" },
    { name:"渋沢栄一",               cat:"実業家",           years:"1840 — 1931",
      quote:"「信用は実績から生まれる。」",
      phil:"日本資本主義の父。500以上の企業・団体設立に関わりながら道徳と経済の両立を追求した。約束を守り実績を積み重ねることを人生の軸とした責任感の人。" },
    { name:"ジョージ・ワシントン",     cat:"政治家",           years:"1732 — 1799",
      quote:"「規律こそ国家の土台。」",
      phil:"アメリカ初代大統領。3期目の続投要請を断り自ら権力を手放した。責任感・規律・誠実さで独立国家の基盤を作り上げた。ISTJの模範的な統治者。" },
  ],
  ISFJ: [
    { name:"フローレンス・ナイチンゲール", cat:"看護師",       years:"1820 — 1910",
      quote:"「私は使命に従っただけ。」",
      phil:"近代看護の基礎を作り、クリミア戦争で多くの命を救った。統計学的アプローチで医療改革も推進した。献身と実践でISFJの本質を体現した人物。" },
    { name:"マザー・テレサ",           cat:"修道女",           years:"1910 — 1997",
      quote:"「大きなことではなく、小さなことに愛を込めなさい。」",
      phil:"インド・コルカタの最貧困層の人々に寄り添い続けたノーベル平和賞受賞者。目の前の一人を大切にし続けることを貫いた。他者愛の純粋な象徴。" },
    { name:"野口英世",                cat:"細菌学者",         years:"1876 — 1928",
      quote:"「努力だ、勉強だ、それが天才だ。」",
      phil:"ロックフェラー研究所で黄熱病研究に人生を捧げた細菌学者。幼少期の貧困と障害を乗り越え、黙々と研究を続けた。献身と努力を体現したISFJの人。" },
    { name:"杉原千畝",               cat:"外交官",           years:"1900 — 1986",
      quote:"「私には従うべき人道があった。」",
      phil:"第二次世界大戦中、国の命令に逆らい6000人以上のユダヤ人にビザを発給し命を救った外交官。静かな勇気と責任感で人を守ったISFJの体現者。" },
  ],
  ESFJ: [
    { name:"新渡戸稲造",              cat:"教育者・思想家",   years:"1862 — 1933",
      quote:"「品格とは思いやりである。」",
      phil:"『武士道』を英語で著し日本精神を世界へ伝えた教育者。礼儀・調和・思いやりを重んじ、国際連盟事務局次長として国家間の橋渡し役を果たした。" },
    { name:"津田梅子",               cat:"教育者",           years:"1864 — 1929",
      quote:"「学びは人を自由にする。」",
      phil:"6歳で渡米し女子教育の発展に生涯を捧げた教育者。津田塾大学を設立し、日本女性の自立と教育機会拡大のために闘い続けた。人を支えるESFJの精神。" },
    { name:"福沢諭吉",               cat:"思想家・教育者",   years:"1835 — 1901",
      quote:"「天は人の上に人を造らず。」",
      phil:"『学問のすゝめ』で人々に学びの重要性を説き、慶應義塾を設立した。封建社会の身分制度を批判し、社会全体への貢献を重んじた強い責任感の思想家。" },
    { name:"緒方洪庵",               cat:"医師・教育者",     years:"1810 — 1863",
      quote:"「医は仁術。」",
      phil:"適塾を開き福沢諭吉・大村益次郎など幕末の俊才を育てた医師・教育者。天然痘撲滅に尽力し、人を救い支えることに人生を捧げた。ESFJの体現者。" },
  ],
  ESFP: [
    { name:"アレクサンダー大王",       cat:"王・将軍",         years:"BC356 — BC323",
      quote:"「不可能はない。」",
      phil:"20歳で即位し32歳で死ぬまでに当時の既知世界の大半を征服した古代マケドニア王。大胆な行動力と圧倒的な存在感で人々を魅了し、世界帝国を築いた。" },
    { name:"マルコ・ポーロ",           cat:"冒険家",           years:"1254 — 1324",
      quote:"「世界は歩く者に開かれる。」",
      phil:"シルクロードを旅し東洋文化をヨーロッパへ伝えた探検家。17年間のアジア滞在で見聞きした体験を『東方見聞録』に記した。好奇心と行動力のESFP的象徴。" },
    { name:"本田圭佑",               cat:"サッカー選手・実業家", years:"1986 —",
      quote:"「リスクを取らないことがリスク。」",
      phil:"強い自己表現と挑戦心を持つ元日本代表キャプテン。引退後も経営・投資・途上国支援と多方面に挑み続ける。前向きな行動力とエネルギーでESFPを体現。" },
    { name:"アーネスト・シャクルトン",  cat:"探検家",           years:"1874 — 1922",
      quote:"「困難でも前進せよ。」",
      phil:"南極探検で船が沈んでも全乗組員を生きて帰還させた伝説のリーダー。楽観性と胆力で極限状況を乗り越えた。ESFPの持つ『どんな時も前に進む力』の体現。" },
  ],
  ESTP: [
    { name:"織田信長",               cat:"武将",             years:"1534 — 1582",
      quote:"「常識を壊せ。」",
      phil:"鉄砲を大規模活用するなど軍事革命を起こし、楽市楽座で経済を開放した戦国武将。瞬発力と大胆な決断力で時代を変えた。ESTPの持つ変革エネルギーの象徴。" },
    { name:"前澤友作",               cat:"実業家",           years:"1975 —",
      quote:"「人生は体験。」",
      phil:"ZOZOTOWNを創業後、宇宙旅行やMZ新聞など前例のない挑戦を続ける実業家。スピードと刺激を人生の軸に、大胆な行動で注目を集め続けるESTPの現代版。" },
    { name:"リチャード・ブランソン",    cat:"実業家",           years:"1950 —",
      quote:"「まず飛び込め。」",
      phil:"Virgin Group創業者。音楽・航空・宇宙など多方面に挑戦し続けた冒険的起業家。リスクを恐れず、挑戦を人生そのものとして楽しむ自由奔放なESTPの体現者。" },
    { name:"宮本武蔵",               cat:"剣豪・哲学者",     years:"1584 — 1645",
      quote:"「千日の稽古を鍛とし、万日の稽古を練とす。」",
      phil:"60回以上の真剣勝負に無敗を誇る剣豪。晩年に著した『五輪書』は兵法を超えた人生哲学書となった。実践と現場から学び続けたESTPの職人的側面を体現。" },
  ],
  ESTJ: [
    { name:"徳川家康",               cat:"将軍",             years:"1543 — 1616",
      quote:"「人の一生は重荷を負うて遠き道を行くがごとし。」",
      phil:"戦国時代を制し260年続く江戸幕府を開いた。短期の勝利より長期の安定を重視し、緻密な組織設計で秩序を確立した。忍耐と秩序でESTJの本質を体現。" },
    { name:"松下幸之助",             cat:"経営者",           years:"1894 — 1989",
      quote:"「素直な心。」",
      phil:"小学校中退から世界的企業Panasonicを築いた経営の神様。現場主義と人材育成を重視し、社会インフラを担う強い責任感で組織を率いたESTJの代表格。" },
    { name:"ウィンストン・チャーチル", cat:"政治家",           years:"1874 — 1965",
      quote:"「決して屈するな。」",
      phil:"第二次世界大戦でナチスドイツに対抗し英国を勝利へ導いた首相。明確なビジョンと揺るぎない意志で組織を動かした。責任感と統率力のESTJそのもの。" },
    { name:"豊臣秀吉",               cat:"武将",             years:"1537 — 1598",
      quote:"「露と落ち露と消えにし我が身かな。」",
      phil:"農民から天下人へ。卓越した組織掌握力と人心掌握力で戦国時代を統一した。現場叩き上げから頂点を極めた、実行力と管理能力を兼ね備えたESTJの体現者。" },
  ],
  ISTP: [
    { name:"本田宗一郎",             cat:"経営者・エンジニア", years:"1906 — 1991",
      quote:"「失敗は成功の母。」",
      phil:"Honda創業者。現場主義を徹底し、失敗を繰り返しながら技術革新を続けた。理論より実践、言葉より行動で語る職人気質のエンジニア。ISTPの精神の体現者。" },
    { name:"トーマス・エジソン",       cat:"発明家",           years:"1847 — 1931",
      quote:"「天才とは1%のひらめきと99%の努力。」",
      phil:"電球・蓄音機・映画など1000以上の特許を持つ発明王。膨大な試行錯誤を繰り返し、実践と改善で世界を変えた。ISTJの動きながら考える実験精神の象徴。" },
    { name:"井上尚弥",               cat:"ボクサー",          years:"1993 —",
      quote:"「積み重ねが自信になる。」",
      phil:"4団体統一王者。冷静な状況判断と高度な技術力を兼ね備えた世界最高峰のボクサー。感情に流されず、黙々と練習を積み重ねる寡黙な努力家の姿がISTPそのもの。" },
    { name:"ライト兄弟",             cat:"発明家",           years:"1867/1871 —",
      quote:"「飛べると信じた。」",
      phil:"自転車修理工から航空機を発明した兄弟。理論より実験を重視し、何百回もの失敗を経て世界初の動力飛行を成功させた。実践と技術探究を愛するISTPの体現。" },
  ],
  ISFP: [
    { name:"フィンセント・ファン・ゴッホ", cat:"画家",          years:"1853 — 1890",
      quote:"「普通であることは舗装された道だ。」",
      phil:"37年の短い生涯で約900点の絵画を残した。生前ほとんど評価されながらも感性に従って描き続けた。孤独の中で独自の美を追求し続けたISFPの魂の象徴。" },
    { name:"葛飾北斎",               cat:"浮世絵師",         years:"1760 — 1849",
      quote:"「90歳で本物の絵師になりたい。」",
      phil:"『富嶽三十六景』で世界に影響を与えた浮世絵師。90歳近くまで筆を執り続け、生涯を通して表現を追求した。自由な創作魂と終わりなき成長欲求を持つISFP。" },
    { name:"アンリ・マティス",         cat:"画家",            years:"1869 — 1954",
      quote:"「色彩は感情である。」",
      phil:"フォーヴィスムを牽引した巨匠。晩年に病床でも切り紙絵を制作し続けた。感覚と美を純粋に追求し、生の喜びを色で表現し続けたISFPの体現者。" },
    { name:"ジョン・ミューア",         cat:"自然保護活動家",   years:"1838 — 1914",
      quote:"「自然の中へ行け。」",
      phil:"アメリカ国立公園制度の父。ヨセミテ渓谷を歩きながら自然の美しさを世に伝え続けた。感性で自然と向き合い、静かな自由人として生きたISFPの象徴。" },
  ],
};

/* ═══════════════════════════════════════════════════
   SCORING LOGIC
═══════════════════════════════════════════════════ */
function toScalePts(val) {
  if (val <= 3) return 0;
  if (val <= 6) return 1;
  if (val <= 8) return 2;
  return 3;
}

function calcResult(answers) {
  const s = {SOC:0,PLA:0,ARI:0,NIE:0,EPI:0,STO:0,DEC:0,SAR:0};
  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (ans == null) return;
    const map = SCORING[q.id];
    if (q.type === "scale") {
      const pts = toScalePts(ans);
      if (pts > 0) Object.entries(map.scale).forEach(([t,w]) => { s[t] += pts * w; });
    } else {
      const chosen = map.ab[ans];
      Object.entries(chosen).forEach(([t,w]) => { s[t] += w; });
    }
  });
  const sorted = Object.entries(s).sort((a,b) => b[1]-a[1]);
  return { main: sorted[0][0], sub: sorted[1][0], scores: s };
}



/* ═══════════════════════════════════════════════════
   DEEPDIVE — Data & Logic
═══════════════════════════════════════════════════ */

const DD_KEY = "axis_dd";
const getDD  = () => { try { return JSON.parse(localStorage.getItem(DD_KEY) || "{}"); } catch { return {}; } };
const saveDD = (s) => { try { localStorage.setItem(DD_KEY, JSON.stringify(s)); } catch {} };

const SCENES = [
  { id:"work",      emoji:"💼", label:"仕事",     sub:"キャリア・働き方・目標" },
  { id:"relations", emoji:"🤝", label:"人間関係", sub:"家族・友人・職場の人々" },
  { id:"money",     emoji:"💰", label:"お金",     sub:"収入・支出・将来設計" },
  { id:"health",    emoji:"🌿", label:"健康",     sub:"身体・食事・睡眠・運動" },
  { id:"learning",  emoji:"📖", label:"学び",     sub:"知識・スキル・成長" },
  { id:"play",      emoji:"🎯", label:"遊び",     sub:"趣味・余暇・楽しみ" },
  { id:"family",    emoji:"🏠", label:"家族",     sub:"親・パートナー・子ども" },
  { id:"society",   emoji:"🌍", label:"社会",     sub:"世界・コミュニティ・貢献" },
];

const SCENE_ACTIONS = {
  work: [
    { action:"今日のタスクを3つだけに絞り、最も重要なものから始める。優先順位を決めること自体が、仕事の質を上げる。",
      quote:"人は繰り返すことの結果である。", person:"アリストテレス" },
    { action:"10年後になりたい自分の姿を一文で書き出し、今の仕事との接点を一つ探してみる。",
      quote:"志高く。", person:"孫正義" },
    { action:"今の仕事で自分が本当に貢献できていることを3つ書き出す。自己評価は軸になる。",
      quote:"動機善なりや、私心なかりしか。", person:"稲盛和夫" },
  ],
  relations: [
    { action:"大切な人に、普段言えていない感謝を一言伝える。LINEでも、一言でも構わない。",
      quote:"やってみせ、言って聞かせて、させてみせ、ほめてやらねば人は動かじ。", person:"山本五十六" },
    { action:"最近連絡していない人に、近況報告のメッセージを一通送る。",
      quote:"和を以て貴しとなす。", person:"聖徳太子" },
    { action:"誰かの話を、最後まで口を挟まずに聞く時間を今日一度作る。",
      quote:"問われた者は、初めて自分の中を見る。", person:"ソクラテス" },
  ],
  money: [
    { action:"今月の支出を書き出し、本当に必要なものと不要なものに分類してみる。",
      quote:"論語と算盤。", person:"渋沢栄一" },
    { action:"半年後に向けた小さな貯蓄目標を一つ設定し、今日から始める。完璧より継続。",
      quote:"積小為大。", person:"二宮尊徳" },
    { action:"自分の市場価値を高めるために、今月学べることを一つだけ決める。",
      quote:"先入観は可能を不可能にする。", person:"大谷翔平" },
  ],
  health: [
    { action:"今日は寝る前にスマホを置き、10分だけ自分の身体と対話する時間を作る。",
      quote:"外側の出来事ではなく、それをどう受け取るかが重要だ。", person:"マルクス・アウレリウス" },
    { action:"明日の朝、いつもより30分早く起きて、静かな時間を自分だけのために使う。",
      quote:"やめる理由より、続ける理由を探したい。", person:"三浦知良" },
    { action:"今日の食事で、身体に良いものを意識的に一つだけ選ぶ。小さな選択が軸を作る。",
      quote:"千日の稽古を鍛とし、万日の稽古を練とす。", person:"宮本武蔵" },
  ],
  learning: [
    { action:"今日、気になっていた本・記事・動画を一つだけ集中して読む。深さより継続。",
      quote:"学ぶことをやめた時、人は死ぬ。", person:"レオナルド・ダ・ヴィンチ" },
    { action:"知らないことを知っている人に、素直に質問してみる。謙虚さが最速の成長だ。",
      quote:"無知であると知ることが、真の知恵への入り口だ。", person:"ソクラテス" },
    { action:"今日学んだことを、誰かに説明できる言葉でノートに書いてみる。",
      quote:"我思う、ゆえに我あり。", person:"デカルト" },
  ],
  play: [
    { action:"最近やっていない趣味・楽しみを一つ、今日のスケジュールに強制的に入れる。",
      quote:"人生は、他のことを考えている時に起きている。", person:"ジョン・レノン" },
    { action:"結果を気にせず、純粋に楽しむだけの時間を2時間確保する。それで十分だ。",
      quote:"楽しさを忘れるな。", person:"スティーブ・ウォズニアック" },
    { action:"新しい場所・体験・食べ物など、今まで試していないことを一つだけやってみる。",
      quote:"世界は歩く者に開かれる。", person:"マルコ・ポーロ" },
  ],
  family: [
    { action:"家族や大切な人と、スマホを置いて食事や会話をする時間を今日作る。",
      quote:"大きなことではなく、小さなことに愛を込めなさい。", person:"マザー・テレサ" },
    { action:"親や家族に、普段言えていない感謝や想いを一言だけ伝える機会を作る。",
      quote:"品格とは思いやりである。", person:"新渡戸稲造" },
    { action:"家族のために、今日一つだけ小さなことをしてあげる。言葉でも行動でも。",
      quote:"天は人の上に人を造らず。", person:"福沢諭吉" },
  ],
  society: [
    { action:"今日読んだニュースに対して、自分の意見を一文だけ書いてみる。考える習慣が軸を作る。",
      quote:"常識とは、18歳までに身につけた偏見のコレクションだ。", person:"アインシュタイン" },
    { action:"職場や地域で、誰かの役に立てることを一つ実行する。",
      quote:"あなたが世界で見たい変化に、あなた自身がなりなさい。", person:"ガンディー" },
    { action:"自分の行動が周りに与える影響を意識して、今日一日過ごしてみる。",
      quote:"真の革命家は愛によって導かれる。", person:"チェ・ゲバラ" },
  ],
};

/* ═══════════════════════════════════════════════════
   DEEPDIVE — Components
═══════════════════════════════════════════════════ */

function DDSceneSelect({ onBack, onNext }) {
  const [sel, setSel] = useState(null);
  return (
    <div className="dd-scroll">
      <button className="back-btn" onClick={onBack}>← 戻る</button>
      <div className="dd-inner">
        <p className="dd-label">Deep Dive</p>
        <h2 className="dd-heading">今、最も気になっている<br />場面はどこですか？</h2>
        <p className="dd-desc">直感で一つ選んでください。</p>
        <div className="dd-scene-grid">
          {SCENES.map(s => (
            <button key={s.id} className={"dd-scene-card" + (sel === s.id ? " sel" : "")} onClick={() => setSel(s.id)}>
              <span className="dd-scene-emoji">{s.emoji}</span>
              <p className="dd-scene-label">{s.label}</p>
              <p className="dd-scene-sub">{s.sub}</p>
            </button>
          ))}
        </div>
        <button
          className="btn-primary"
          style={{width:"100%",maxWidth:360,marginTop:8,opacity:sel?1:0.2,pointerEvents:sel?"auto":"none"}}
          onClick={() => sel && onNext(sel)}
        >
          行動提案を見る →
        </button>
      </div>
    </div>
  );
}

function DDActionProposal({ scene, onBack, onDone }) {
  const actions = SCENE_ACTIONS[scene] || SCENE_ACTIONS.work;
  const dd = getDD();
  const idx = (dd.actionIdx || 0) % actions.length;
  const prop = actions[idx];
  const sceneMeta = SCENES.find(s => s.id === scene);
  const [notifState, setNotifState] = useState(dd.notifGranted ? "granted" : "idle");

  const handleNotif = async () => {
    if (!("Notification" in window)) { setNotifState("unsupported"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifState("granted");
      const s = getDD(); s.notifGranted = true; saveDD(s);
      setTimeout(() => {
        new Notification("AXIS — 昨日の振り返り", {
          body: "昨日の行動はどうでしたか？振り返りに進みましょう。",
        });
      }, 24 * 60 * 60 * 1000);
    } else {
      setNotifState("denied");
    }
  };

  const handleDone = () => {
    const s = getDD();
    s.actionIdx  = (s.actionIdx || 0) + 1;
    s.lastScene  = scene;
    s.lastAction = prop.action;
    s.feedbackPending = true;
    s.lastDate   = new Date().toDateString();
    saveDD(s);
    onDone();
  };

  return (
    <div className="dd-scroll">
      <button className="back-btn" onClick={onBack}>← 戻る</button>
      <div className="dd-inner">
        <p className="dd-label">{sceneMeta?.emoji} {sceneMeta?.label} — Today's Action</p>
        <div className="dd-action-card">
          <p className="dd-action-tag">今日のアクション</p>
          <p className="dd-action-text">{prop.action}</p>
          <div className="dd-action-divider" />
          <p className="dd-action-quote">「{prop.quote}」</p>
          <p className="dd-action-person">— {prop.person}</p>
        </div>
        {notifState === "idle" && (
          <div className="dd-notif-box">
            <p className="dd-notif-text">明日の振り返りを通知で受け取りますか？</p>
            <button className="dd-notif-btn" onClick={handleNotif}>許可する</button>
          </div>
        )}
        {notifState === "granted" && (
          <p style={{fontSize:10,color:"#aaa",letterSpacing:"0.1em",textAlign:"center",marginBottom:16}}>
            🔔 明日、通知でお知らせします
          </p>
        )}
        <button className="btn-primary" style={{width:"100%",maxWidth:380}} onClick={handleDone}>
          今日、これをやる
        </button>
      </div>
    </div>
  );
}

function DDFeedback({ onNext }) {
  const choices = [
    { label:"とても合っていた",   score:3, color:"#333" },
    { label:"少し合っていた",     score:2, color:"#999" },
    { label:"違和感を感じた",     score:1, color:"#ddd" },
  ];
  const handle = (score) => {
    const s = getDD(); s.feedbackPending = false; s.lastScore = score; saveDD(s);
    onNext(score);
  };
  return (
    <div className="dd-screen">
      <p className="dd-label">Daily Reflection</p>
      <h2 className="dd-heading">昨日の行動は<br />どうでしたか？</h2>
      <p className="dd-desc" style={{marginBottom:36}}>正直に選んでください。<br />あなたの軸を育てるデータになります。</p>
      <div className="dd-fb-group">
        {choices.map(c => (
          <button key={c.score} className="dd-fb-btn" onClick={() => handle(c.score)}>
            <span className="dd-dot" style={{background:c.color}} />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* DeepDive controller — handles full flow */
function DeepDive({ onBack, onFinish }) {
  const dd = getDD();
  const initPhase = dd.feedbackPending ? "feedback" : "scene";
  const [phase, setPhase]     = useState(initPhase);
  const [scene, setScene]     = useState(dd.lastScene || null);

  if (phase === "feedback") return (
    <DDFeedback onNext={(score) => {
      if (score <= 1) setPhase("scene"); // 違和感 → 新しいシーンへ
      else setPhase("action");           // 合っていた → 次のアクションへ
    }} />
  );
  if (phase === "scene")  return <DDSceneSelect onBack={onBack} onNext={(s) => { setScene(s); setPhase("action"); }} />;
  if (phase === "action") return (
    <DDActionProposal
      scene={scene}
      onBack={() => setPhase("scene")}
      onDone={() => onFinish()}
    />
  );
  return null;
}


/* ═══════════════════════════════════════════════════
   LIBRARY DATA
═══════════════════════════════════════════════════ */
const CAT5 = ["哲学者","経営者","文豪","アスリート","アーティスト"];

const ALL_PERSONS = [
  // ── 哲学者 ─────────────────────────────────────
  {name:"ソクラテス",         cat:"哲学者", type:"SOC", typeLabel:"探究者",  years:"BC470 — BC399"},
  {name:"プラトン",           cat:"哲学者", type:"PLA", typeLabel:"理想家",  years:"BC427 — BC347"},
  {name:"アリストテレス",     cat:"哲学者", type:"ARI", typeLabel:"実践家",  years:"BC384 — BC322"},
  {name:"ニーチェ",           cat:"哲学者", type:"NIE", typeLabel:"自由人",  years:"1844 — 1900"},
  {name:"エピクロス",         cat:"哲学者", type:"EPI", typeLabel:"快楽主義者", years:"BC341 — BC270"},
  {name:"マルクス・アウレリウス", cat:"哲学者", type:"STO", typeLabel:"運命受容者", years:"121 — 180"},
  {name:"デカルト",           cat:"哲学者", type:"DEC", typeLabel:"懐疑者",  years:"1596 — 1650"},
  {name:"サルトル",           cat:"哲学者", type:"SAR", typeLabel:"実存者",  years:"1905 — 1980"},
  {name:"カール・ユング",     cat:"哲学者", type:"SOC", typeLabel:"探究者",  years:"1875 — 1961"},
  {name:"ヴィクトール・フランクル", cat:"哲学者", type:"STO", typeLabel:"運命受容者", years:"1905 — 1997"},
  {name:"セネカ",             cat:"哲学者", type:"STO", typeLabel:"運命受容者", years:"BC4 — AD65"},
  {name:"カミュ",             cat:"哲学者", type:"SAR", typeLabel:"実存者",  years:"1913 — 1960"},
  {name:"マキャヴェッリ",     cat:"哲学者", type:"INTJ",typeLabel:"INTJ建築家", years:"1469 — 1527"},
  {name:"ヴォルテール",       cat:"哲学者", type:"ENTP",typeLabel:"ENTP討論者", years:"1694 — 1778"},
  {name:"アインシュタイン",   cat:"哲学者", type:"INTP",typeLabel:"INTP論理学者", years:"1879 — 1955"},
  {name:"ニュートン",         cat:"哲学者", type:"INTP",typeLabel:"INTP論理学者", years:"1643 — 1727"},
  {name:"アラン・チューリング", cat:"哲学者", type:"INTP",typeLabel:"INTP論理学者", years:"1912 — 1954"},
  // ── 経営者 ─────────────────────────────────────
  {name:"スティーブ・ジョブズ", cat:"経営者", type:"PLA", typeLabel:"理想家",  years:"1955 — 2011"},
  {name:"ウォルト・ディズニー", cat:"経営者", type:"PLA", typeLabel:"理想家",  years:"1901 — 1966"},
  {name:"稲盛和夫",           cat:"経営者", type:"ARI", typeLabel:"実践家",  years:"1932 — 2022"},
  {name:"渋沢栄一",           cat:"経営者", type:"ARI", typeLabel:"実践家",  years:"1840 — 1931"},
  {name:"松下幸之助",         cat:"経営者", type:"ARI", typeLabel:"実践家",  years:"1894 — 1989"},
  {name:"イーロン・マスク",   cat:"経営者", type:"NIE", typeLabel:"自由人",  years:"1971 —"},
  {name:"堀江貴文",           cat:"経営者", type:"DEC", typeLabel:"懐疑者",  years:"1972 —"},
  {name:"ビル・ゲイツ",       cat:"経営者", type:"DEC", typeLabel:"懐疑者",  years:"1955 —"},
  {name:"孫正義",             cat:"経営者", type:"ENTJ",typeLabel:"ENTJ指揮官", years:"1957 —"},
  {name:"ジャック・ウェルチ", cat:"経営者", type:"ENTJ",typeLabel:"ENTJ指揮官", years:"1935 — 2020"},
  {name:"レイ・ダリオ",       cat:"経営者", type:"INTJ",typeLabel:"INTJ建築家", years:"1949 —"},
  {name:"ピーター・ティール", cat:"経営者", type:"INTJ",typeLabel:"INTJ建築家", years:"1967 —"},
  {name:"本田宗一郎",         cat:"経営者", type:"ISTP",typeLabel:"ISTP巨匠",  years:"1906 — 1991"},
  {name:"マーク・トウェイン",         cat:"文豪",   type:"ENFP", typeLabel:"ENFP運動家", years:"1835 — 1910"},
  {name:"前澤友作",           cat:"経営者", type:"ESTP",typeLabel:"ESTP起業家", years:"1975 —"},
  {name:"リチャード・ブランソン", cat:"経営者", type:"ESTP",typeLabel:"ESTP起業家", years:"1950 —"},
  // ── 文豪 ───────────────────────────────────────
  {name:"村上春樹",           cat:"文豪", type:"SOC", typeLabel:"探究者",  years:"1949 —"},
  {name:"太宰治",             cat:"文豪", type:"SAR", typeLabel:"実存者",  years:"1909 — 1948"},
  {name:"ドストエフスキー",   cat:"文豪", type:"NIE", typeLabel:"自由人",  years:"1821 — 1881"},
  {name:"ヘルマン・ヘッセ",   cat:"文豪", type:"INFP",typeLabel:"INFP仲介者", years:"1877 — 1962"},
  {name:"三島由紀夫",         cat:"文豪", type:"SAR", typeLabel:"実存者",  years:"1925 — 1970"},
  {name:"カフカ",             cat:"文豪", type:"SAR", typeLabel:"実存者",  years:"1883 — 1924"},
  {name:"宮沢賢治",           cat:"文豪", type:"INFP",typeLabel:"INFP仲介者", years:"1896 — 1933"},
  {name:"ゲーテ",             cat:"文豪", type:"EPI", typeLabel:"快楽主義者", years:"1749 — 1832"},
  {name:"モンテーニュ",       cat:"文豪", type:"EPI", typeLabel:"快楽主義者", years:"1533 — 1592"},
  // ── アスリート ─────────────────────────────────
  {name:"大谷翔平",           cat:"アスリート", type:"ARI", typeLabel:"実践家",  years:"1994 —"},
  {name:"マイケル・ジョーダン", cat:"アスリート", type:"NIE", typeLabel:"自由人",  years:"1963 —"},
  {name:"三浦知良",           cat:"アスリート", type:"STO", typeLabel:"運命受容者", years:"1967 —"},
  {name:"羽生善治",           cat:"アスリート", type:"STO", typeLabel:"運命受容者", years:"1970 —"},
  {name:"アーノルド・シュワルツェネッガー", cat:"アスリート", type:"STO", typeLabel:"運命受容者", years:"1947 —"},
  {name:"井上尚弥",           cat:"アスリート", type:"ISTP",typeLabel:"ISTP巨匠",  years:"1993 —"},
  {name:"宮本武蔵",           cat:"アスリート", type:"ESTP",typeLabel:"ESTP起業家", years:"1584 — 1645"},
  {name:"本田圭佑",           cat:"アスリート", type:"ESFP",typeLabel:"ESFPエンターテイナー", years:"1986 —"},
  // ── アーティスト ───────────────────────────────
  {name:"ピカソ",             cat:"アーティスト", type:"NIE", typeLabel:"自由人",  years:"1881 — 1973"},
  {name:"ゴッホ",             cat:"アーティスト", type:"ISFP",typeLabel:"ISFP冒険家", years:"1853 — 1890"},
  {name:"レオナルド・ダ・ヴィンチ", cat:"アーティスト", type:"PLA", typeLabel:"理想家", years:"1452 — 1519"},
  {name:"宮崎駿",             cat:"アーティスト", type:"SOC", typeLabel:"探究者",  years:"1941 —"},
  {name:"坂本龍一",           cat:"アーティスト", type:"PLA", typeLabel:"理想家",  years:"1952 — 2023"},
  {name:"ジョン・レノン",     cat:"アーティスト", type:"EPI", typeLabel:"快楽主義者", years:"1940 — 1980"},
  {name:"カート・コバーン",   cat:"アーティスト", type:"SAR", typeLabel:"実存者",  years:"1967 — 1994"},
  {name:"葛飾北斎",           cat:"アーティスト", type:"ISFP",typeLabel:"ISFP冒険家", years:"1760 — 1849"},
  {name:"岡本太郎",           cat:"アーティスト", type:"NIE", typeLabel:"自由人",  years:"1911 — 1996"},
  {name:"尾田栄一郎",         cat:"アーティスト", type:"NIE", typeLabel:"自由人",  years:"1975 —"},

  // ── 追加：哲学者・思想家 ───────────────────────────────
  {name:"ガンディー",           cat:"哲学者", type:"INFJ", typeLabel:"INFJ提唱者",  years:"1869 — 1948"},
  {name:"キング牧師",           cat:"哲学者", type:"INFJ", typeLabel:"INFJ提唱者",  years:"1929 — 1968"},
  {name:"ネルソン・マンデラ",   cat:"哲学者", type:"INFJ", typeLabel:"INFJ提唱者",  years:"1918 — 2013"},
  {name:"ナイチンゲール",       cat:"哲学者", type:"ISFJ", typeLabel:"ISFJ擁護者",  years:"1820 — 1910"},
  {name:"マザー・テレサ",       cat:"哲学者", type:"ISFJ", typeLabel:"ISFJ擁護者",  years:"1910 — 1997"},
  {name:"野口英世",             cat:"哲学者", type:"ISFJ", typeLabel:"ISFJ擁護者",  years:"1876 — 1928"},
  {name:"杉原千畝",             cat:"哲学者", type:"ISFJ", typeLabel:"ISFJ擁護者",  years:"1900 — 1986"},
  {name:"福沢諭吉",             cat:"哲学者", type:"ESFJ", typeLabel:"ESFJ領事",    years:"1835 — 1901"},
  {name:"新渡戸稲造",           cat:"哲学者", type:"ESFJ", typeLabel:"ESFJ領事",    years:"1862 — 1933"},
  {name:"二宮尊徳",             cat:"哲学者", type:"ISTJ", typeLabel:"ISTJ管理者",  years:"1787 — 1856"},
  // ── 追加：経営者・実業家 ────────────────────────────────
  {name:"トーマス・エジソン",   cat:"経営者", type:"ISTP", typeLabel:"ISTP巨匠",    years:"1847 — 1931"},
  {name:"ウィンストン・チャーチル", cat:"経営者", type:"ESTJ", typeLabel:"ESTJ幹部", years:"1874 — 1965"},
  {name:"津田梅子",             cat:"経営者", type:"ESFJ", typeLabel:"ESFJ領事",    years:"1864 — 1929"},
  {name:"緒方洪庵",             cat:"経営者", type:"ESFJ", typeLabel:"ESFJ領事",    years:"1810 — 1863"},
  // ── 追加：文豪・詩人 ────────────────────────────────────
  {name:"星野道夫",             cat:"文豪",   type:"INFP", typeLabel:"INFP仲介者",  years:"1952 — 1996"},
  // ── 追加：アスリート・武将 ──────────────────────────────
  {name:"ハンニバル",           cat:"アスリート", type:"INTJ", typeLabel:"INTJ建築家", years:"BC247 — BC183"},
  {name:"ナポレオン",           cat:"アスリート", type:"ENTJ", typeLabel:"ENTJ指揮官", years:"1769 — 1821"},
  {name:"チンギス・ハン",       cat:"アスリート", type:"ENTJ", typeLabel:"ENTJ指揮官", years:"1162 — 1227"},
  {name:"アレクサンダー大王",   cat:"アスリート", type:"ESFP", typeLabel:"ESFPエンターテイナー", years:"BC356 — BC323"},
  {name:"織田信長",             cat:"アスリート", type:"ESTP", typeLabel:"ESTP起業家", years:"1534 — 1582"},
  {name:"山本五十六",           cat:"アスリート", type:"ENFJ", typeLabel:"ENFJ主人公", years:"1884 — 1943"},
  {name:"上杉鷹山",             cat:"アスリート", type:"ENFJ", typeLabel:"ENFJ主人公", years:"1751 — 1822"},
  {name:"徳川家康",             cat:"アスリート", type:"ESTJ", typeLabel:"ESTJ幹部",  years:"1543 — 1616"},
  {name:"ジョージ・ワシントン", cat:"アスリート", type:"ISTJ", typeLabel:"ISTJ管理者", years:"1732 — 1799"},
  {name:"徳川吉宗",             cat:"アスリート", type:"ISTJ", typeLabel:"ISTJ管理者", years:"1684 — 1751"},
  {name:"エルネスト・シャクルトン", cat:"アスリート", type:"ESFP", typeLabel:"ESFPエンターテイナー", years:"1874 — 1922"},
  {name:"ライト兄弟",           cat:"アスリート", type:"ISTP", typeLabel:"ISTP巨匠",  years:"1867 — 1912"},
  // ── 追加：アーティスト ──────────────────────────────────
  {name:"アンリ・ルソー",       cat:"アーティスト", type:"ENFP", typeLabel:"ENFP運動家", years:"1844 — 1910"},
  {name:"アンリ・マティス",     cat:"アーティスト", type:"ISFP", typeLabel:"ISFP冒険家", years:"1869 — 1954"},
  {name:"マーク・トウェイン",    cat:"文豪",         type:"ENFP", typeLabel:"ENFP運動家",  years:"1835 — 1910"},
  {name:"坂本龍馬",             cat:"アーティスト", type:"ENFP", typeLabel:"ENFP運動家", years:"1836 — 1867"},
  {name:"聖徳太子",             cat:"アーティスト", type:"ENFJ", typeLabel:"ENFJ主人公", years:"574 — 622"},
  {name:"マルコ・ポーロ",       cat:"アーティスト", type:"ESFP", typeLabel:"ESFPエンターテイナー", years:"1254 — 1324"},
  // ── 補充：SOC（探究者）5人以上 ─────────────────────────
  {name:"岡本太郎",   cat:"アーティスト", type:"SOC", typeLabel:"探究者",  years:"1911 — 1996"},
  // ── 補充：DEC（懐疑者）5人以上 ─────────────────────────
  {name:"フランシス・ベーコン", cat:"哲学者", type:"DEC", typeLabel:"懐疑者", years:"1561 — 1626"},
  {name:"カール・ポパー",       cat:"哲学者", type:"DEC", typeLabel:"懐疑者", years:"1902 — 1994"},
  // ── 補充：EPI（快楽主義者）5人以上 ──────────────────────
  {name:"タモリ",     cat:"アーティスト", type:"EPI", typeLabel:"快楽主義者", years:"1945 —"},
  // ── 補充：INTJ 5人以上 ──────────────────────────────────
  {name:"バラク・オバマ",  cat:"哲学者", type:"INTJ", typeLabel:"INTJ建築家", years:"1961 —"},
  // ── 補充：INTP 5人以上 ──────────────────────────────────
  {name:"ダーウィン",      cat:"哲学者", type:"INTP", typeLabel:"INTP論理学者", years:"1809 — 1882"},
  {name:"カント",          cat:"哲学者", type:"INTP", typeLabel:"INTP論理学者", years:"1724 — 1804"},
  // ── 補充：ENTJ 5人以上 ──────────────────────────────────
  {name:"スティーブ・ジョブズ", cat:"経営者", type:"ENTJ", typeLabel:"ENTJ指揮官", years:"1955 — 2011"},
  // ── 補充：ENTP 5人以上 ──────────────────────────────────
  {name:"レオナルド・ダ・ヴィンチ", cat:"アーティスト", type:"ENTP", typeLabel:"ENTP討論者", years:"1452 — 1519"},
  {name:"リチャード・ファインマン", cat:"哲学者", type:"ENTP", typeLabel:"ENTP討論者", years:"1918 — 1988"},
  {name:"ベンジャミン・フランクリン", cat:"哲学者", type:"ENTP", typeLabel:"ENTP討論者", years:"1706 — 1790"},
  {name:"エジソン",        cat:"経営者", type:"ENTP", typeLabel:"ENTP討論者", years:"1847 — 1931"},
  // ── 補充：INFJ 5人以上 ──────────────────────────────────
  {name:"マーティン・ルーサー・キング", cat:"哲学者", type:"INFJ", typeLabel:"INFJ提唱者", years:"1929 — 1968"},
  {name:"ユング",          cat:"哲学者", type:"INFJ", typeLabel:"INFJ提唱者", years:"1875 — 1961"},
  // ── 補充：INFP 5人以上 ──────────────────────────────────
  {name:"ヴィクトール・ユゴー", cat:"文豪", type:"INFP", typeLabel:"INFP仲介者", years:"1802 — 1885"},
  {name:"シェイクスピア",  cat:"文豪", type:"INFP", typeLabel:"INFP仲介者", years:"1564 — 1616"},
  // ── 補充：ENFJ 5人以上 ──────────────────────────────────
  {name:"オプラ・ウィンフリー", cat:"アーティスト", type:"ENFJ", typeLabel:"ENFJ主人公", years:"1954 —"},
  {name:"稲盛和夫",        cat:"経営者", type:"ENFJ", typeLabel:"ENFJ主人公", years:"1932 — 2022"},
  // ── 補充：ENFP 5人以上 ──────────────────────────────────
  {name:"チェ・ゲバラ",    cat:"哲学者", type:"ENFP", typeLabel:"ENFP運動家", years:"1928 — 1967"},
  // ── 補充：ISTJ 5人以上 ──────────────────────────────────
  {name:"渋沢栄一",        cat:"経営者", type:"ISTJ", typeLabel:"ISTJ管理者", years:"1840 — 1931"},
  {name:"豊臣秀吉",        cat:"アスリート", type:"ISTJ", typeLabel:"ISTJ管理者", years:"1537 — 1598"},
  // ── 補充：ISFJ 5人以上 ──────────────────────────────────
  {name:"オードリー・ヘプバーン", cat:"アーティスト", type:"ISFJ", typeLabel:"ISFJ擁護者", years:"1929 — 1993"},
  // ── 補充：ESFJ 5人以上 ──────────────────────────────────
  {name:"ビル・クリントン", cat:"哲学者", type:"ESFJ", typeLabel:"ESFJ領事",  years:"1946 —"},
  // ── 補充：ESFP 5人以上 ──────────────────────────────────
  {name:"坂本龍一",        cat:"アーティスト", type:"ESFP", typeLabel:"ESFPエンターテイナー", years:"1952 — 2023"},
  // ── 補充：ESTJ 5人以上 ──────────────────────────────────
  {name:"松下幸之助",      cat:"経営者", type:"ESTJ", typeLabel:"ESTJ幹部",  years:"1894 — 1989"},
  {name:"孫正義",          cat:"経営者", type:"ESTJ", typeLabel:"ESTJ幹部",  years:"1957 —"},
  {name:"豊臣秀吉",        cat:"アスリート", type:"ESTJ", typeLabel:"ESTJ幹部",  years:"1537 — 1598"},
  // ── 補充：ESTP 5人以上 ──────────────────────────────────
  {name:"ハンニバル",      cat:"アスリート", type:"ESTP", typeLabel:"ESTP起業家", years:"BC247 — BC183"},
  // ── 補充：ISTP 5人以上 ──────────────────────────────────
  {name:"クリント・イーストウッド", cat:"アーティスト", type:"ISTP", typeLabel:"ISTP巨匠", years:"1930 —"},
  {name:"宮本武蔵",        cat:"アスリート", type:"ISTP", typeLabel:"ISTP巨匠",  years:"1584 — 1645"},
  // ── 補充：ISFP 5人以上 ──────────────────────────────────
  {name:"モーツァルト",    cat:"アーティスト", type:"ISFP", typeLabel:"ISFP冒険家", years:"1756 — 1791"},
  {name:"マイケル・ジャクソン", cat:"アーティスト", type:"ISFP", typeLabel:"ISFP冒険家", years:"1958 — 2009"},
];

const TYPE_AXIS = [
  {key:"SOC", label:"探究者",     persons: ALL_PERSONS.filter(p=>p.type==="SOC")},
  {key:"PLA", label:"理想家",     persons: ALL_PERSONS.filter(p=>p.type==="PLA")},
  {key:"ARI", label:"実践家",     persons: ALL_PERSONS.filter(p=>p.type==="ARI")},
  {key:"NIE", label:"自由人",     persons: ALL_PERSONS.filter(p=>p.type==="NIE")},
  {key:"EPI", label:"快楽主義者", persons: ALL_PERSONS.filter(p=>p.type==="EPI")},
  {key:"STO", label:"運命受容者", persons: ALL_PERSONS.filter(p=>p.type==="STO")},
  {key:"DEC", label:"懐疑者",     persons: ALL_PERSONS.filter(p=>p.type==="DEC")},
  {key:"SAR", label:"実存者",     persons: ALL_PERSONS.filter(p=>p.type==="SAR")},
  {key:"INTJ",label:"INTJ建築家", persons: ALL_PERSONS.filter(p=>p.type==="INTJ")},
  {key:"INTP",label:"INTP論理学者",persons:ALL_PERSONS.filter(p=>p.type==="INTP")},
  {key:"ENTJ",label:"ENTJ指揮官", persons: ALL_PERSONS.filter(p=>p.type==="ENTJ")},
  {key:"ENTP",label:"ENTP討論者", persons: ALL_PERSONS.filter(p=>p.type==="ENTP")},
  {key:"INFP",label:"INFP仲介者", persons: ALL_PERSONS.filter(p=>p.type==="INFP")},
  {key:"ENFP",label:"ENFP運動家", persons: ALL_PERSONS.filter(p=>p.type==="ENFP")},
  {key:"ISTP",label:"ISTP巨匠",   persons: ALL_PERSONS.filter(p=>p.type==="ISTP")},
  {key:"ISFP",label:"ISFP冒険家", persons: ALL_PERSONS.filter(p=>p.type==="ISFP")},
  {key:"ESTP",label:"ESTP起業家", persons: ALL_PERSONS.filter(p=>p.type==="ESTP")},
  {key:"ESFP",label:"ESFPエンターテイナー",persons:ALL_PERSONS.filter(p=>p.type==="ESFP")},
  {key:"INFJ",label:"INFJ提唱者",  persons:ALL_PERSONS.filter(p=>p.type==="INFJ")},
  {key:"ENFJ",label:"ENFJ主人公",  persons:ALL_PERSONS.filter(p=>p.type==="ENFJ")},
  {key:"ISTJ",label:"ISTJ管理者",  persons:ALL_PERSONS.filter(p=>p.type==="ISTJ")},
  {key:"ISFJ",label:"ISFJ擁護者",  persons:ALL_PERSONS.filter(p=>p.type==="ISFJ")},
  {key:"ESTJ",label:"ESTJ幹部",    persons:ALL_PERSONS.filter(p=>p.type==="ESTJ")},
  {key:"ESFJ",label:"ESFJ領事",    persons:ALL_PERSONS.filter(p=>p.type==="ESFJ")},
];


/* ═══════════════════════════════════════════════════
   PERSON INFO
═══════════════════════════════════════════════════ */
const PERSON_INFO = {
  "ソクラテス":{"desc":"古代ギリシャの哲学者（BC470-BC399）。著作を残さず、弟子プラトンの対話篇によって思想が伝わる。「無知の知」を説き、問いかけを通じて真理を探求した。不敬神の罪で告発され死刑判決を受けたが、自説を最後まで曲げずに毒杯を飲んで没した。"},
  "プラトン":{"desc":"古代ギリシャの哲学者（BC427-BC347）。ソクラテスの弟子で、アカデメイアを創設した西洋哲学の中心的存在。「イデア論」で現実の背後に完全な観念の世界が存在すると説いた。著作「国家」「パイドン」「ソクラテスの弁明」などが現存している。"},
  "アリストテレス":{"desc":"古代ギリシャの哲学者（BC384-BC322）。プラトンの弟子で、アレクサンダー大王の家庭教師も務めた。論理学・生物学・倫理学・政治学を体系化し「万学の祖」と呼ばれる。著作「ニコマコス倫理学」「政治学」は今も世界中で読まれている。"},
  "ニーチェ":{"desc":"ドイツの哲学者（1844-1900）。「神は死んだ」の宣言で知られ、キリスト教道徳を根底から批判した。「超人」「力への意志」「永劫回帰」などの概念を提唱し、20世紀思想に多大な影響を与えた。著書「ツァラトゥストラはかく語りき」は世界的名著。"},
  "エピクロス":{"desc":"古代ギリシャの哲学者（BC341-BC270）。「アタラクシア（魂の平静）」を人生の最高目標とした。派手な快楽でなく痛みのない静かな生き方こそが幸福だと説いた。アテナイに「庭園」と呼ばれる学校を設立し弟子と共同生活を送った。"},
  "マルクス・アウレリウス":{"desc":"ローマ皇帝・哲学者（121-180）。五賢帝の一人として20年間ローマ帝国を統治した。ストア哲学の実践者で、私的日記「自省録」は2000年後の現代も世界で読み継がれる。戦争と疫病禍の中でも哲学的態度を保ち続けた。"},
  "デカルト":{"desc":"フランスの哲学者・数学者（1596-1650）。「われ思う、ゆえにわれあり」の言葉で知られる近代哲学の父。方法的懐疑から出発し、解析幾何学も創始した。著作「方法序説」「省察」は哲学史上の重要文献。"},
  "サルトル":{"desc":"フランスの哲学者・作家（1905-1980）。「実存は本質に先立つ」の命題で実存主義を牽引した。小説「嘔吐」、戯曲「出口なし」など多くの文学作品も残した。1964年にノーベル文学賞を辞退したことでも知られる。"},
  "カール・ユング":{"desc":"スイスの心理学者（1875-1961）。フロイトと共に精神分析を発展させた後、独自の「分析心理学」を確立した。集合的無意識・元型・内向/外向の概念を提唱し、現代心理学の礎を作った。著書「心理と宗教」「元型論」など。"},
  "カミュ":{"desc":"フランスの作家・哲学者（1913-1960）。アルジェリア生まれ。「異邦人」「ペスト」が代表作で、1957年ノーベル文学賞受賞。不条理哲学を文学的に体現した。46歳で交通事故により急逝した。"},
  "セネカ":{"desc":"古代ローマの哲学者（BC4-AD65）。ストア哲学を代表する思想家で、ネロ皇帝の家庭教師も務めた。「怒りについて」「人生の短さについて」など多数の著作を残した。最終的にはネロに死を命じられ自決した。"},
  "宮崎駿":{"desc":"日本のアニメーション監督（1941-）。スタジオジブリ共同創設者。「となりのトトロ」「もののけ姫」「千と千尋の神隠し」など世界的名作を監督。「千と千尋の神隠し」はアカデミー長編アニメ賞受賞。環境・反戦のメッセージを作品に込め続けている。"},
  "村上春樹":{"desc":"日本の作家（1949-）。「ノルウェイの森」「海辺のカフカ」「1Q84」など多数の小説を執筆し、50以上の言語に翻訳された世界的ベストセラー作家。喪失感・孤独・自我探求を主要テーマとし、複数回ノーベル文学賞候補に挙げられている。"},
  "スティーブ・ジョブズ":{"desc":"米国の実業家（1955-2011）。Appleを共同創業しMac・iPod・iPhone・iPadを世に送り出した。一度はAppleを追われたが復帰後に復活させ、世界最高時価総額企業に育てた。スタンフォード大学卒業式スピーチ「ハングリーであれ、愚かであれ」が世界的に有名。"},
  "ウォルト・ディズニー":{"desc":"米国の実業家・映画製作者（1901-1966）。ミッキーマウスを創造し世界初の長編アニメ映画「白雪姫」を制作。ウォルト・ディズニー・カンパニーを設立しディズニーランドを開園した。映画・テレビ・テーマパークにまたがる一大エンターテインメント帝国を築いた。"},
  "稲盛和夫":{"desc":"日本の実業家（1932-2022）。京セラ・KDDIを創業後、2010年には経営破綻したJALを再建した。「フィロソフィ経営」として知られる人間性重視の経営哲学を確立。盛和塾を通じて世界中の経営者を育成した。"},
  "渋沢栄一":{"desc":"日本の実業家（1840-1931）。「日本資本主義の父」とも呼ばれ、500以上の企業・団体の設立に関わった。一橋大学・東京証券取引所など多くの機関を創設。道徳と経済の両立を説いた著書「論語と算盤」は現代の経営書としても読まれている。"},
  "松下幸之助":{"desc":"日本の実業家（1894-1989）。小学校中退の状態から現在のパナソニック（旧松下電器産業）を創業した「経営の神様」。PHP研究所を創設し政治・経済の研究や出版活動も行った。著書「道をひらく」は累計400万部以上を誇る。"},
  "大谷翔平":{"desc":"日本のプロ野球選手（1994-）。投手と打者の「二刀流」として活躍し、2021年と2023年のMLBオールスターMVPを受賞。2023年WBC優勝・本塁打王・MVPを獲得した。2023年オフにロサンゼルス・ドジャースと10年総額7億ドルの史上最高額契約を結んだ。"},
  "イーロン・マスク":{"desc":"南アフリカ出身の実業家（1971-）。PayPal・Tesla・SpaceX・Xの創業者・CEO。Teslaで電気自動車の普及を推進し、SpaceXで民間宇宙開発を牽引した。2022年にTwitterを約440億ドルで買収しXに改名。世界長者番付上位の常連。"},
  "ヴィクトール・フランクル":{"desc":"オーストリアの精神科医・哲学者（1905-1997）。ナチス強制収容所（アウシュビッツ等）を生き延び、その体験を「夜と霧」に記した世界的ベストセラーとなった。「意味療法（ロゴセラピー）」を創始し、どんな状況でも人生に意味を見出せると説いた。"},
  "三浦知良":{"desc":"日本のプロサッカー選手（1967-）。「キング・カズ」の愛称で知られ、日本人として初めてブラジルでプロ選手となった。日本代表としてW杯最終予選に出場し、国内外の多くのクラブでプレーした。50歳を過ぎても現役を続け、2023年時点でポルトガルのクラブに所属していた。"},
  "羽生善治":{"desc":"日本の将棋棋士（1970-）。1996年に将棋史上初の七冠同時制覇を達成。2023年には史上初の八冠（全タイトル）を制した。通算獲得タイトルは99期以上で歴代最多記録保持者。国民栄誉賞を受賞した日本将棋界のレジェンド。"},
  "アーノルド・シュワルツェネッガー":{"desc":"オーストリア出身の俳優・政治家（1947-）。7度のボディビル世界選手権優勝後、「ターミネーター」「プレデター」などのアクション映画で世界的スターとなった。2003年から2011年までカリフォルニア州知事を務めた。"},
  "太宰治":{"desc":"日本の作家（1909-1948）。青森県出身。「人間失格」「斜陽」「走れメロス」が代表作。自己嫌悪と人間の弱さを文学的に昇華し続けた。芥川賞を4度逃した後、38歳で多摩川に入水し遺体で発見された。「人間失格」は今も日本で最も売れる小説の一つ。"},
  "三島由紀夫":{"desc":"日本の作家（1925-1970）。「仮面の告白」「潮騒」「金閣寺」が代表作。ノーベル文学賞の有力候補でもあった。1970年、自衛隊市ケ谷駐屯地で演説後に割腹自決した。英語・フランス語・ドイツ語で翻訳され、国際的に評価が高い。"},
  "カフカ":{"desc":"チェコ出身のドイツ語作家（1883-1924）。「変身」「城」「審判」が代表作。不条理な官僚制度と人間の疎外を描いた作風は「カフカ的」という形容詞を生んだ。生前は無名に近く、死後に遺稿が世に出て世界的評価を得た。"},
  "カート・コバーン":{"desc":"米国のミュージシャン（1967-1994）。Nirvanaのボーカル・ギタリスト。1991年のアルバム「Nevermind」がグランジムーブメントを牽引し世界的に大ヒット。社会への違和感と孤独を音楽で表現し続けた。1994年、27歳でシアトルの自宅で死去。"},
  "カミュ":{"desc":"フランスの作家・哲学者（1913-1960）。アルジェリア生まれ。「異邦人」「ペスト」が代表作で1957年ノーベル文学賞受賞。不条理哲学を文学的に体現した。46歳で交通事故により急逝した。"},
  "ガンディー":{"desc":"インドの指導者（1869-1948）。「マハトマ（偉大な魂）」の称号で知られる。非暴力・不服従運動を指導しイギリス植民地支配に抵抗、1947年のインド独立を実現した。弁護士資格を持ちながら質素な生活を実践。独立後まもなく暗殺された。"},
  "ネルソン・マンデラ":{"desc":"南アフリカの政治家（1918-2013）。アパルトヘイト撤廃運動を指導したとして27年間投獄された。釈放後の1994年、南アフリカ初の黒人大統領に就任。1993年ノーベル平和賞受賞。憎しみでなく赦しと和解を選び国民和解を推進した。"},
  "ヘルマン・ヘッセ":{"desc":"ドイツ出身のスイスの作家（1877-1962）。「車輪の下」「デミアン」「シッダールタ」「荒野の狼」が代表作。内面世界の探究と自己発見をテーマとした。1946年にノーベル文学賞受賞。太平洋戦争後の日本でも広く読まれた。"},
  "宮沢賢治":{"desc":"日本の童話作家・詩人（1896-1933）。岩手県花巻市出身。「銀河鉄道の夜」「注文の多い料理店」「雨ニモマケズ」が代表作。農業指導者としても活動し、質素な生活を送りながら創作を続けた。37歳で急逝し、作品の大部分は死後に出版された。"},
  "レオナルド・ダ・ヴィンチ":{"desc":"イタリアの芸術家・科学者（1452-1519）。「モナ・リザ」「最後の晩餐」の制作者として世界的に知られる。絵画のみならず解剖学・地質学・天文学・建築・飛行機械など多分野を探究し数千ページに及ぶノートを残した。「万能人」の典型とされる。"},
  "ゴッホ":{"desc":"オランダの画家（1853-1890）。生前は1枚しか絵が売れなかったが没後に評価が急上昇。「ひまわり」「星月夜」が代表作。弟テオとの書簡約900通が残り内面世界を知る貴重な資料となっている。37歳で拳銃自傷の傷が原因で死去した。"},
  "葛飾北斎":{"desc":"日本の浮世絵師（1760-1849）。「富嶽三十六景」の「神奈川沖浪裏」は世界で最も有名な絵画の一つ。生涯に約3万点以上の作品を制作し93回引っ越したとされる。90歳で没した際に「あと5年あれば本物の絵師になれた」と言い残したと伝わる。"},
  "スティーブ・ウォズニアック":{"desc":"米国のエンジニア・実業家（1950-）。スティーブ・ジョブズとともにAppleを共同創業した。Apple I、Apple IIを設計したエンジニアで、パーソナルコンピュータの普及に多大な貢献をした。技術者として純粋な好奇心と遊び心を大切にした人物として知られる。"},
  "マーク・トウェイン":{"desc":"米国の作家（1835-1910）。「トム・ソーヤーの冒険」「ハックルベリー・フィンの冒険」が代表作。南北戦争前後のアメリカ社会を描き、アーネスト・ヘミングウェイに「すべての現代アメリカ文学はマーク・トウェインの1冊の本から生まれた」と評された。"},
  "ナポレオン":{"desc":"フランス皇帝・軍人（1769-1821）。フランス革命後の混乱期に台頭し1804年に皇帝に即位。アウステルリッツの戦いなどで圧勝し欧州大陸を支配した。ナポレオン法典を整備し近代法の基礎を作った。1815年ワーテルロー敗北後にセントヘレナ島に幽閉され没した。"},
  "孫正義":{"desc":"日本の実業家（1957-）。ソフトバンクグループ創業者・会長兼社長。16歳で渡米しカリフォルニア大学バークレー校を卒業後1981年にソフトバンク創業。「300年構想」を掲げる。2000年のアリババへの初期投資が数兆円規模のリターンをもたらした。"},
  "チンギス・ハン":{"desc":"モンゴル帝国の創設者（1162-1227）。諸部族を統一し、アジアから東欧に至る人類史上最大の連続した陸上帝国を建設した。優れた軍事戦略と組織力で知られる。ユーラシア大陸にわたる交易路（シルクロード）を整備し東西交流を促進した。"},
  "アレクサンダー大王":{"desc":"古代マケドニア王（BC356-BC323）。アリストテレスに師事した後20歳で王位に就き、ギリシャ・ペルシャ・エジプト・インドにまたがる大帝国を築いた。32歳で没するまで一度も戦いに敗れなかったとされる。「アレクサンドリア」の名を冠した都市を各地に建設した。"},
  "織田信長":{"desc":"日本の武将（1534-1582）。鉄砲の組織的活用（長篠の戦い）や楽市楽座による経済自由化など革新的な政策を断行した戦国時代の覇者。比叡山延暦寺の焼き討ち等強権的な政策も多い。1582年の本能寺の変で家臣の明智光秀に討たれた。"},
  "宮本武蔵":{"desc":"日本の剣豪・兵法家（1584-1645）。13歳から60余回の真剣勝負に無敗を誇ったとされる。晩年に著した「五輪書」は兵法書として世界的に知られ、現代のビジネス書としても読まれる。「二天一流」という独自の剣術流派を確立した。"},
  "福沢諭吉":{"desc":"日本の啓蒙思想家・教育者（1835-1901）。「天は人の上に人を造らず」の書き出しで知られる「学問のすゝめ」は江戸末期から明治にかけて累計340万部以上売れた。慶應義塾大学を創設し日本の近代化・欧米化を牽引した。"},
  "ガンディー":{"desc":"インドの指導者（1869-1948）。非暴力・不服従運動を指導しイギリス植民地支配に抵抗、1947年のインド独立を実現した弁護士出身の指導者。「マハトマ（偉大な魂）」の称号で知られる。独立後まもなく暗殺されたが世界中の指導者に影響を与えた。"},
  "ニュートン":{"desc":"イギリスの数学者・物理学者（1643-1727）。万有引力の法則、光学、微分積分法（ライプニッツと独立に）を発見し近代科学の礎を築いた。主著「自然哲学の数学的諸原理（プリンキピア）」は科学史上最も重要な著作の一つ。造幣局長官も務めた。"},
  "アインシュタイン":{"desc":"ドイツ出身の物理学者（1879-1955）。特殊相対性理論（E=mc²）と一般相対性理論を提唱し現代物理学の礎を作った。1921年ノーベル物理学賞受賞（光電効果の発見）。ナチス政権下でアメリカに亡命し、原爆開発に反対する活動を晩年に行った。"},
  "ダーウィン":{"desc":"イギリスの博物学者（1809-1882）。ビーグル号での5年間の航海の観察をもとに進化論を確立。1859年の「種の起源」で自然選択説を提唱し生物学に革命をもたらした。当初は宗教界から強い反発を受けたが現代生物学の根幹をなす理論となっている。"},
  "ヴォルテール":{"desc":"フランスの啓蒙思想家・文学者（1694-1778）。「カンディード」が代表作。宗教的不寛容と専制政治を批判した鋭い風刺で知られる。フランス革命の精神的土台を作った啓蒙主義の代表的知識人。バスティーユに投獄されるなど当局に睨まれ続けた。"},
  "マキャヴェッリ":{"desc":"イタリアの政治思想家（1469-1527）。著書「君主論」で目的のためには手段を選ばない政治哲学を論じた。フィレンツェ共和国の外交官として活躍したが失脚後に著述業に専念した。「マキャヴェリズム」は今日でも権謀術数的な政治手法を指す言葉として使われる。"},

};

/* ── Person Modal ── */
function PersonModal({ person, onClose }) {
  const info = PERSON_INFO[person.name];
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,
      display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}
      onClick={onClose}>
      <div style={{background:"#fff",padding:"32px 24px",maxWidth:400,width:"100%",
        maxHeight:"82vh",overflowY:"auto",
        position:"relative",opacity:0,animation:"fadeIn 0.3s ease forwards"}}
        onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"none",
          border:"1px solid #e0e0e0",fontSize:14,color:"#888",cursor:"pointer",padding:"6px 10px",letterSpacing:0}}>×</button>
        <p style={{fontSize:9,letterSpacing:"0.3em",color:"#999",textTransform:"uppercase",marginBottom:12}}>
          {person.cat} ·  {person.typeLabel}
        </p>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:300,
          color:"#222",letterSpacing:"0.06em",marginBottom:4}}>{person.name}</p>
        <p style={{fontSize:11,color:"#bbb",letterSpacing:"0.1em",marginBottom:20}}>{person.years}</p>
        <div style={{width:32,height:1,background:"#ddd",marginBottom:20}} />
        <p style={{fontSize:12,fontWeight:300,color:"#555",letterSpacing:"0.06em",lineHeight:2.1}}>
          {info ? info.desc : "詳細情報は近日公開予定です。"}
        </p>
      </div>
    </div>
  );
}

/* ── Type Detail Modal ── */
function TypeDetailModal({ typeEntry, onSelectPerson, onClose }) {
  if (!typeEntry) return null;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:900,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={onClose}>
      <div style={{background:"#fff",width:"100%",maxWidth:480,maxHeight:"75vh",
        overflowY:"auto",padding:"28px 24px 40px",
        opacity:0,animation:"fadeIn 0.3s ease forwards"}}
        onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
          <div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:300,
              color:"#222",letterSpacing:"0.08em"}}>{typeEntry.key} — {typeEntry.label}</p>
            <p style={{fontSize:10,color:"#aaa",letterSpacing:"0.1em",marginTop:2}}>{typeEntry.persons.length}人</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",font:"20px/1 serif",
            color:"#aaa",cursor:"pointer",padding:"4px 8px"}}>×</button>
        </div>
        <div style={{width:32,height:1,background:"#e0e0e0",marginBottom:20}} />
        {typeEntry.persons.map((p,i) => (
          <div key={i} onClick={() => onSelectPerson(p)}
            style={{display:"flex",alignItems:"center",padding:"12px 0",
              borderBottom:"1px solid #f5f5f5",cursor:"pointer",gap:12}}>
            <span style={{fontFamily:"'Noto Serif JP',serif",fontSize:14,fontWeight:300,
              color:"#2a2a2a",flex:1}}>{p.name}</span>
            <span style={{fontSize:10,color:"#aaa",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{p.years}</span>
            <span style={{padding:"2px 8px",fontSize:9,letterSpacing:"0.06em",
              border:"1px solid #bbb",color:"#555",whiteSpace:"nowrap"}}>{p.cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   LIBRARY SCREEN
═══════════════════════════════════════════════════ */
function LibraryScreen({ go }) {
  const [tab, setTab]         = useState("cat");
  const [activeCat, setActiveCat] = useState(CAT5[0]);
  const [typeModal, setTypeModal] = useState(null);   // TypeDetailModal
  const [personModal, setPersonModal] = useState(null); // PersonModal

  const catPersons = ALL_PERSONS.filter(p => p.cat === activeCat);

  return (
    <div className="lib-screen">
      <button className="back-btn" onClick={() => go("s1")}>← 戻る</button>
      <div className="lib-header">
        <p className="lib-title">偉人ライブラリ</p>
        <p className="lib-sub">Heroes &amp; Philosophers</p>
      </div>

      <div className="lib-tabs">
        <button className={`lib-tab${tab==="cat"?" active":""}`}
          onClick={() => setTab("cat")}>職業別</button>
        <button className={`lib-tab${tab==="type"?" active":""}`}
          onClick={() => setTab("type")}>タイプ別</button>
      </div>

      <div className="lib-body">
        {tab === "cat" && (
          <>
            <div className="lib-cat-row">
              {CAT5.map(c => (
                <button key={c} className={`lib-cat-btn${activeCat===c?" active":""}`}
                  onClick={() => setActiveCat(c)}>{c}</button>
              ))}
            </div>
            <div className="lib-section">
              <p className="lib-section-title">{activeCat}</p>
              <p className="lib-section-count">{catPersons.length}人</p>
              <div className="lib-person-list">
                {catPersons.map((p,i) => (
                  <div key={i} className="lib-person-item"
                    style={{cursor:"pointer"}}
                    onClick={() => setPersonModal(p)}>
                    <span className="lib-person-name">{p.name}</span>
                    <span className="lib-person-years">{p.years}</span>
                    <span className="lib-type-badge">{p.typeLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "type" && (
          <div className="lib-type-grid" style={{paddingTop:20}}>
            {TYPE_AXIS.filter(t=>t.persons.length>0).map(t => (
              <button key={t.key} className="lib-type-btn"
                onClick={() => setTypeModal(t)}>
                <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:13,
                  display:"block",marginBottom:2}}>{t.key}</span>
                <span style={{fontSize:10,color:"#666"}}>{t.label}</span>
                <span style={{fontSize:9,color:"#aaa",marginTop:2,display:"block"}}>
                  {t.persons.length}人 ›
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Type detail modal (bottom sheet) */}
      {typeModal && (
        <TypeDetailModal
          typeEntry={typeModal}
          onSelectPerson={(p) => { setPersonModal(p); }}
          onClose={() => setTypeModal(null)}
        />
      )}

      {/* Person detail modal */}
      {personModal && (
        <PersonModal
          person={personModal}
          onClose={() => setPersonModal(null)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   STATIC SCREEN COMPONENTS
═══════════════════════════════════════════════════ */
const MBTI_COLORS = {
  INTJ:"#8b7ab8",
  INTP:"#8b7ab8",
  ENTJ:"#8b7ab8",
  ENTP:"#8b7ab8",
  INFJ:"#5a9e7a",
  INFP:"#5a9e7a",
  ENFJ:"#5a9e7a",
  ENFP:"#5a9e7a",
  ISTJ:"#4a8ab0",
  ISFJ:"#4a8ab0",
  ESTJ:"#4a8ab0",
  ESFJ:"#4a8ab0",
  ISTP:"#c49820",
  ISFP:"#c49820",
  ESTP:"#c49820",
  ESFP:"#c49820",
};

const MBTI_GROUPS = [
  { id:"analysts",  label:"Analysts",  desc:"分析家 — 論理と革新", types:[{code:"INTJ",name:"建築家"},{code:"INTP",name:"論理学者"},{code:"ENTJ",name:"指揮官"},{code:"ENTP",name:"討論者"}] },
  { id:"diplomats", label:"Diplomats", desc:"外交官 — 共感と理想", types:[{code:"INFJ",name:"提唱者"},{code:"INFP",name:"仲介者"},{code:"ENFJ",name:"主人公"},{code:"ENFP",name:"広報運動家"}] },
  { id:"sentinels", label:"Sentinels", desc:"番人 — 秩序と責任",   types:[{code:"ISTJ",name:"管理者"},{code:"ISFJ",name:"擁護者"},{code:"ESTJ",name:"幹部"},{code:"ESFJ",name:"領事"}] },
  { id:"explorers", label:"Explorers", desc:"探検家 — 自由と即興", types:[{code:"ISTP",name:"巨匠"},{code:"ISFP",name:"冒険家"},{code:"ESTP",name:"起業家"},{code:"ESFP",name:"エンターテイナー"}] },
];

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 72 72" fill="none">
      <circle cx="36" cy="36" r="35" stroke="#d8d8d8" strokeWidth="1"/>
      <line x1="36" y1="12" x2="36" y2="60" stroke="#888" strokeWidth="1"/>
      <line x1="12" y1="36" x2="60" y2="36" stroke="#888" strokeWidth="1"/>
      <circle cx="36" cy="36" r="3" fill="#888"/>
      <line x1="36" y1="12" x2="36" y2="18" stroke="#444" strokeWidth="1.5"/>
      <line x1="36" y1="54" x2="36" y2="60" stroke="#444" strokeWidth="1.5"/>
    </svg>
  );
}

function S1({ go }) {
  return (
    <div className="screen">
      <LogoMark />
      <h1 className="app-title">AXIS</h1>
      <p className="app-subtitle">Find Your Philosophy</p>
      <div className="divider" />
      <p className="tagline">あなたと同じ思想をもつ<br />哲学者・経営者・文豪たちの言葉が<br />自分の軸を照らし出す。</p>
      <button className="btn-primary" onClick={() => go("s2")}>診断に進む</button>
      <button className="lib-entry-btn" onClick={() => go("library")}>
        偉人ライブラリ ›
      </button>
      {typeof window !== "undefined" && Object.keys(getDD()).length > 0 && (
        <button className="s1-dd-btn" onClick={() => go("deepdive")}>
          振り返り ›
        </button>
      )}
    </div>
  );
}

function S2({ go }) {
  return (
    <div className="screen">
      <p className="screen-label">Step 01</p>
      <h2 className="screen-heading">MBTIについて</h2>
      <p className="screen-desc">あなたは自分のMBTIタイプを<br />把握していますか？</p>
      <div className="choice-group">
        <button className="btn-outline" onClick={() => go("s3a")}>
          <div className="btn-content"><span>MBTIを把握している</span></div>
          <span className="arrow">›</span>
        </button>
        <button className="btn-outline" onClick={() => go("s3b")}>
          <div className="btn-content"><span>MBTIを把握していない</span></div>
          <span className="arrow">›</span>
        </button>
      </div>
    </div>
  );
}

function S3A({ go }) {
  const openTest = () => window.open("https://www.16personalities.com/ja/%e6%80%a7%e6%a0%bc%e8%a8%ba%e6%96%ad%e3%83%86%e3%82%b9%e3%83%88","_blank");
  return (
    <div className="screen">
      <button className="back-btn" onClick={() => go("s2")}>← 戻る</button>
      <p className="screen-label">Step 02 — A</p>
      <h2 className="screen-heading">どのように進めますか？</h2>
      <p className="screen-desc">すでに把握しているタイプで進むか、<br />改めて診断テストを受けることができます。</p>
      <div className="choice-group">
        <button className="btn-outline" onClick={() => go("s4")}>
          <div className="btn-content"><span>把握しているMBTIで進む</span><span className="sub-label">タイプを選択して診断へ</span></div>
          <span className="arrow">›</span>
        </button>
        <button className="btn-outline" onClick={openTest}>
          <div className="btn-content"><span>改めてMBTIをテストする</span><span className="sub-label">16personalities.com（外部サイト）</span></div>
          <span className="arrow">›</span>
        </button>
      </div>
      <p className="ext-note">※ テスト後、戻ってタイプを入力してください</p>
    </div>
  );
}

function S3B({ go }) {
  const openTest = () => window.open("https://www.16personalities.com/ja/%e6%80%a7%e6%a0%bc%e8%a8%ba%e6%96%ad%e3%83%86%e3%82%b9%e3%83%88","_blank");
  return (
    <div className="screen">
      <button className="back-btn" onClick={() => go("s2")}>← 戻る</button>
      <p className="screen-label">Step 02 — B</p>
      <h2 className="screen-heading">診断テストを受けましょう</h2>
      <p className="screen-desc">診断テストでMBTIタイプを調べてから<br />哲学者・文豪たちの言葉に出会えます。</p>
      <div className="choice-group">
        <button className="btn-outline" onClick={openTest}>
          <div className="btn-content"><span>MBTIをテストする</span><span className="sub-label">本格診断・約10分（16personalities.com）</span></div>
          <span className="arrow">›</span>
        </button>
        <button className="btn-outline" onClick={() => go("quiz-intro")}>
          <div className="btn-content"><span>簡易テストをする</span><span className="sub-label">アプリ内・約4〜5分</span></div>
          <span className="arrow">›</span>
        </button>
      </div>
    </div>
  );
}

function S4({ go, onConfirm }) {
  const [sel, setSel] = useState(null);
  const allTypes = MBTI_GROUPS.flatMap(g => g.types);
  const selType = allTypes.find(t => t.code === sel);
  return (
    <div className="type-screen">
      <button className="back-btn" onClick={() => go("s3a")}>← 戻る</button>
      <div className="type-screen-inner">
        <p className="screen-label" style={{marginBottom:10}}>Step 03</p>
        <h2 className="screen-heading" style={{marginBottom:8}}>MBTIタイプを選択</h2>
        <p className="screen-desc" style={{marginBottom:32}}>あなたのタイプをタップしてください</p>
        {MBTI_GROUPS.map((g,gi) => (
          <div key={g.id} style={{width:"100%"}}>
            {gi > 0 && <div className="group-sep" />}
            <div className="group-block">
              <p className="group-label">{g.label}</p>
              <p className="group-desc">{g.desc}</p>
              <div className="type-grid">
                {g.types.map(t => (
                  <button key={t.code}
                    className={`type-card${sel===t.code?" selected":""}`}
                    style={{borderLeft:`3px solid ${MBTI_COLORS[t.code]||"#ccc"}`}}
                    onClick={() => setSel(t.code)}>
                    <span className="type-code" style={{color: sel===t.code ? MBTI_COLORS[t.code] : "#222"}}>{t.code}</span>
                    <span className="type-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="confirm-area">
          <div className="selected-display" style={{color: sel ? MBTI_COLORS[sel] : "#ccc"}}>{sel || "—"}</div>
          <div className="selected-name">{selType ? selType.name : "タイプを選んでください"}</div>
          <button className={`btn-confirm${sel?" active":""}`} onClick={() => sel && onConfirm(sel)}>このタイプで進む</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   QUIZ COMPONENTS
═══════════════════════════════════════════════════ */
function QuizIntro({ go }) {
  return (
    <div className="screen">
      <button className="back-btn" onClick={() => go("s3b")}>← 戻る</button>
      <p className="screen-label">思想タイプ診断</p>
      <p className="quiz-intro-quote">
        「この診断では、<br />あなたの『生き方の軸』を分析します。<br />直感で答えてください。」
      </p>
      <p className="screen-desc" style={{marginBottom:44}}>全40問 ／ 約4〜5分<br />各フェーズで少しずつ深掘りします</p>
      <button className="btn-primary" onClick={() => go("quiz")}>診断を開始する</button>
    </div>
  );
}

function QuizScreen({ go, onResult }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const q = QUESTIONS[idx];
  const ans = answers[q.id];
  const progress = ((idx + 1) / 40) * 100;
  const phase = PHASES.find(p => p.qs.includes(q.id));

  const setAns = (v) => setAnswers(prev => ({ ...prev, [q.id]: v }));

  const handleNext = () => {
    if (idx < 39) { setIdx(idx + 1); }
    else { onResult(calcResult(answers)); go("loading"); }
  };
  const handleBack = () => {
    if (idx > 0) setIdx(idx - 1);
    else go("quiz-intro");
  };

  return (
    <div className="quiz-screen" key={idx}>
      <div className="quiz-progress"><div className="quiz-progress-fill" style={{width:`${progress}%`}} /></div>
      <div className="quiz-header">
        <button className="back-btn" style={{position:"relative",top:"auto",left:"auto"}} onClick={handleBack}>← 戻る</button>
        <span className="quiz-phase-lbl">{phase?.label} — {phase?.name}</span>
        <span className="quiz-counter">Q{q.id} / 40</span>
      </div>
      <div className="quiz-body">
        <p className="quiz-q-text">{q.text}</p>
        {q.type === "scale" ? (
          <div className="scale-wrap">
            <div className="scale-extremes">
              <span className="scale-extreme-txt">当てはまらない</span>
              <span className="scale-extreme-txt">当てはまる</span>
            </div>
            <div className="scale-row">
              {[1,2,3,4,5].map(n => (
                <button key={n} className={`scale-btn${ans===n?" sel":""}`} onClick={() => setAns(n)}>{n}</button>
              ))}
            </div>
            <div className="scale-row">
              {[6,7,8,9,10].map(n => (
                <button key={n} className={`scale-btn${ans===n?" sel":""}`} onClick={() => setAns(n)}>{n}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="ab-wrap">
            {["A","B"].map(letter => (
              <button key={letter} className={`ab-btn${ans===letter?" sel":""}`} onClick={() => setAns(letter)}>
                <span className="ab-letter">{letter}</span>
                <span>{letter === "A" ? q.optA : q.optB}</span>
              </button>
            ))}
          </div>
        )}
        <button className={`quiz-next${ans!=null?" show":""}`} onClick={handleNext}>
          {idx < 39 ? "次へ →" : "結果を見る →"}
        </button>
      </div>
    </div>
  );
}

function LoadingScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div className="loading-screen">
      <div className="loading-dots">
        <div className="dot" /><div className="dot" /><div className="dot" />
      </div>
      <p className="loading-text">あなたの思想を分析しています…</p>
    </div>
  );
}

function ResultScreen({ result, go }) {
  const main = TYPE_INFO[result.main];
  const sub  = TYPE_INFO[result.sub];
  const img  = PHIL_IMGS[result.main];
  return (
    <div className="result-screen">
      <p className="result-label">Your Thought Type</p>
      {img && (
        <div className="result-img-wrap">
          <img src={img} alt={main.name} />
        </div>
      )}
      <p className="result-philosopher" style={{fontFamily:"'Cormorant Garamond', serif", letterSpacing:"0.15em"}}>
        {result.main}
      </p>
      <p className="result-type-name">{main.name}</p>
      <p className="result-type-en">{main.en}</p>
      <div className="result-rule" />
      <p className="result-desc">{main.sub}</p>
      <div className="result-sub-block">
        <p className="result-sub-label">Sub Type</p>
        <p className="result-sub-name">{result.sub} — {sub.name}</p>
        <p className="result-sub-desc">同時に、強い「{sub.name}」的側面も持っています。</p>
      </div>
      <button className="btn-primary" onClick={() => go("cards")}>哲学者・偉人の言葉を見る</button>
    </div>
  );
}

function CardsScreen({ typeKey, go }) {
  const [idx, setIdx] = useState(0);
  const cards = CARDS[typeKey] || [];
  const card = cards[idx];
  const info = TYPE_INFO[typeKey];
  const img  = PHIL_IMGS[typeKey];
  if (!card) return null;
  return (
    <div className="cards-screen">
      <button className="back-btn" onClick={() => go("result")}>← 戻る</button>
      <div className="cards-header">
        <p className="cards-type-lbl">Your Type — {typeKey}</p>
        <p className="cards-type-name">{info?.name}</p>
      </div>
      <div className="card-viewport">
        <div className="phil-card" key={idx}>
          {img && idx === 0 && (
            <div className="phil-img-wrap">
              <img src={img} alt={card.name} />
            </div>
          )}
          <p className="phil-cat">{card.cat}</p>
          <p className="phil-name">{card.name}</p>
          <p className="phil-years">{card.years}</p>
          <div className="phil-rule" />
          <p className="phil-quote">「{card.quote}」</p>
          <p className="phil-philosophy">{card.phil}</p>
        </div>
        <div className="cards-nav">
          <button className="nav-btn" disabled={idx===0} onClick={() => setIdx(idx-1)}>‹</button>
          <div className="nav-dots">
            {cards.map((_,i) => <div key={i} className={`nav-dot${i===idx?" on":""}`} />)}
          </div>
          <button className="nav-btn" disabled={idx===cards.length-1} onClick={() => setIdx(idx+1)}>›</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button className="dd-entry-btn" onClick={() => go("deepdive")}>
            <div className="dd-entry-inner">
              <span>さらに自分の人生軸を探していく</span>
              <span className="dd-entry-sub">深掘り質問 → 行動提案</span>
            </div>
            <span className="dd-entry-arrow">›</span>
          </button>
          <div style={{textAlign:"center"}}>
            <button className="cards-back" onClick={() => go("s1")}>トップへ戻る</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MbtiCardsScreen({ mbtiType, go }) {
  const [idx, setIdx] = useState(0);
  const cards = MBTI_CARDS[mbtiType] || [];
  const card = cards[idx];
  const info = MBTI_TYPE_INFO[mbtiType];
  if (!card) return null;
  return (
    <div className="cards-screen">
      <button className="back-btn" onClick={() => { go("s4"); }}>← 戻る</button>
      <div className="cards-header">
        <p className="cards-type-lbl">{mbtiType}</p>
        <p className="cards-type-name">{info?.tagline}</p>
      </div>
      <div className="card-viewport">
        <div style={{background:"#f8f8f8",border:"1px solid #e8e8e8",padding:"14px 20px",marginBottom:16}}>
          <p style={{fontSize:11,color:"#888",letterSpacing:"0.07em",lineHeight:1.9,fontFamily:"'Noto Serif JP',serif",fontWeight:300}}>{info?.desc}</p>
        </div>
        <div className="phil-card" key={idx}>
          <p className="phil-cat">{card.cat}</p>
          <p className="phil-name">{card.name}</p>
          <p className="phil-years">{card.years}</p>
          <div className="phil-rule" />
          <p className="phil-quote">{card.quote}</p>
          <p className="phil-philosophy">{card.phil}</p>
        </div>
        <div className="cards-nav">
          <button className="nav-btn" disabled={idx===0} onClick={() => setIdx(idx-1)}>‹</button>
          <div className="nav-dots">
            {cards.map((_,i) => <div key={i} className={`nav-dot${i===idx?" on":""}`} />)}
          </div>
          <button className="nav-btn" disabled={idx===cards.length-1} onClick={() => setIdx(idx+1)}>›</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button className="dd-entry-btn" onClick={() => go("deepdive")}>
            <div className="dd-entry-inner">
              <span>さらに自分の人生軸を探していく</span>
              <span className="dd-entry-sub">深掘り質問 → 行動提案</span>
            </div>
            <span className="dd-entry-arrow">›</span>
          </button>
          <div style={{textAlign:"center"}}>
            <button className="cards-back" onClick={() => go("s1")}>トップへ戻る</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState("s1");
  const [quizResult, setQuizResult] = useState(null);
  const [mbtiType, setMbtiType] = useState(null);
  const [ddFrom, setDdFrom]     = useState('cards');

  const go = (s) => setScreen(s);

  return (
    <>
      <style>{css}</style>
      {screen === "s1"          && <S1 go={go} />}
      {screen === "s2"          && <S2 go={go} />}
      {screen === "s3a"         && <S3A go={go} />}
      {screen === "s3b"         && <S3B go={go} />}
      {screen === "s4"          && <S4 go={go} onConfirm={(t) => { setMbtiType(t); go("mbti-cards"); }} />}
      {screen === "quiz-intro"  && <QuizIntro go={go} />}
      {screen === "quiz"        && <QuizScreen go={go} onResult={r => setQuizResult(r)} />}
      {screen === "loading"     && <LoadingScreen onDone={() => go("result")} />}
      {screen === "result"      && quizResult && <ResultScreen result={quizResult} go={go} />}
      {screen === "cards"       && quizResult && <CardsScreen typeKey={quizResult.main} go={go} />}
      {screen === "mbti-cards"  && mbtiType && <MbtiCardsScreen mbtiType={mbtiType} go={go} />}
      {screen === "library"     && <LibraryScreen go={go} />}
      {screen === "deepdive"    && (
        <DeepDive
          onBack={() => go(ddFrom)}
          onFinish={() => go("s1")}
        />
      )}
    </>
  );
}
