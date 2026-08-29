(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function pE(n,e){return{x:(n.x+e.x)/2,y:(n.y+e.y)/2}}class mE{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.strokes=[],this.current=null,this.pointerId=null,this.listeners={strokeEnd:[],change:[]},this.dpr=1,this.onPointerDown=this.onPointerDown.bind(this),this.onPointerMove=this.onPointerMove.bind(this),this.onPointerUp=this.onPointerUp.bind(this),this.resize=this.resize.bind(this),e.addEventListener("pointerdown",this.onPointerDown),e.addEventListener("pointermove",this.onPointerMove),e.addEventListener("pointerup",this.onPointerUp),e.addEventListener("pointercancel",this.onPointerUp),e.addEventListener("lostpointercapture",this.onPointerUp),window.addEventListener("resize",this.resize),this.ro=new ResizeObserver(()=>this.resize()),this.ro.observe(e.parentElement||e),this.resize()}on(e,t){this.listeners[e].push(t)}emit(e,t){for(const i of this.listeners[e])i(t)}cssSize(){const e=this.canvas.parentElement||this.canvas;return{width:e.clientWidth,height:e.clientHeight}}pointFromEvent(e){const i=(this.canvas.parentElement||this.canvas).getBoundingClientRect(),{width:r,height:s}=this.cssSize(),o=i.width?r/i.width:1,l=i.height?s/i.height:1;return{x:(e.clientX-i.left)*o,y:(e.clientY-i.top)*l,t:Date.now()}}resize(){const{width:e,height:t}=this.cssSize();!e||!t||(this.dpr=Math.min(window.devicePixelRatio||1,2),this.canvas.width=Math.round(e*this.dpr),this.canvas.height=Math.round(t*this.dpr),this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0),this.redraw())}onPointerDown(e){this.pointerId===null&&(e.preventDefault(),this.canvas.setPointerCapture(e.pointerId),this.pointerId=e.pointerId,this.current=[this.pointFromEvent(e)],this.redraw(),this.emit("change"))}onPointerMove(e){if(e.pointerId!==this.pointerId||!this.current)return;e.preventDefault();const t=this.pointFromEvent(e),i=this.current[this.current.length-1];Math.hypot(t.x-i.x,t.y-i.y)<.8||(this.current.push(t),this.redraw())}onPointerUp(e){if(!(this.pointerId!==null&&e.pointerId!==this.pointerId)){if(this.current&&this.current.length){this.strokes.push(this.current),this.current=null,this.pointerId=null,this.redraw(),this.emit("strokeEnd"),this.emit("change");return}this.current=null,this.pointerId=null}}drawGuides(){const{width:e,height:t}=this.cssSize(),i=this.ctx;i.save(),i.strokeStyle="rgba(243, 235, 225, 0.2)",i.lineWidth=1,i.setLineDash([5,7]),i.beginPath(),i.moveTo(e/2,10),i.lineTo(e/2,t-10),i.moveTo(10,t/2),i.lineTo(e-10,t/2),i.stroke(),i.restore()}drawStroke(e){const t=this.ctx;if(t.save(),t.strokeStyle="#f4f0ea",t.fillStyle="#f4f0ea",t.lineCap="round",t.lineJoin="round",t.lineWidth=4.2,e.length===1){t.beginPath(),t.arc(e[0].x,e[0].y,2.2,0,Math.PI*2),t.fill(),t.restore();return}t.beginPath(),t.moveTo(e[0].x,e[0].y);for(let r=1;r<e.length-1;r+=1){const s=pE(e[r],e[r+1]);t.quadraticCurveTo(e[r].x,e[r].y,s.x,s.y)}const i=e[e.length-1];t.lineTo(i.x,i.y),t.stroke(),t.restore()}redraw(){const{width:e,height:t}=this.cssSize();this.ctx.clearRect(0,0,e,t),this.drawGuides();for(const i of this.strokes)this.drawStroke(i);this.current&&this.drawStroke(this.current)}undo(){this.current?(this.current=null,this.pointerId=null):this.strokes.pop(),this.redraw(),this.emit("change")}clear(){this.strokes=[],this.current=null,this.pointerId=null,this.redraw(),this.emit("change")}hasInk(){return this.strokes.length>0||this.current&&this.current.length>1}toInk(){return(this.current?[...this.strokes,this.current]:this.strokes).filter(t=>t.length>=2).map(t=>{const i=t[0].t;return[t.map(r=>Math.round(r.x)),t.map(r=>Math.round(r.y)),t.map(r=>Math.max(0,r.t-i))]})}}const gE=new Set(["en","zh_CN","zh_TW","ja","ko"]);function gs(n,e){const t=String(n).match(new RegExp(`\\p{Script=${e}}`,"gu"));return t?t.length:0}function co(n,e="zh_CN"){const t=String(n||""),i=gs(t,"Hangul"),r=gs(t,"Hiragana"),s=gs(t,"Katakana"),o=gs(t,"Han"),l=gs(t,"Latin"),c=r+s,u=gE.has(e)?e:"zh_CN";return i>0&&i>=c&&i>=l?"ko":c>0&&c>=l?"ja":o>0&&o>=l?u==="ja"||u==="zh_CN"||u==="zh_TW"?u:"zh_CN":l>0?"en":u}const Mm=new Set(["en","zh_CN","zh_TW","ja","ko"]),_E={en:"en",zh_CN:"zh-CN",zh_TW:"zh-TW",ja:"ja",ko:"ko"};function Zd(n){var t;const e=Array.isArray(n)?(t=n[1])==null?void 0:t[0]:null;if(Array.isArray(e)){const r=e.filter(s=>Array.isArray(s)&&s.some(o=>typeof o=="string"&&o.trim())).sort((s,o)=>o.length-s.length)[0];if(r)return r.filter(s=>typeof s=="string"&&s.trim()).slice(0,12)}throw new Error("Unexpected handwriting response")}const yE={en:["en"],zh_CN:["zh_CN","zh"],zh_TW:["zh_TW","zh-Hant"],ja:["ja"],ko:["ko"]},ef={en:"en-t-i0-handwrit",zh_CN:"zh-t-i0-handwrit",zh_TW:"zh-hant-t-i0-handwrit",ja:"ja-t-i0-handwrit",ko:"ko-t-i0-handwrit"};async function vE({ink:n,width:e,height:t,language:i,preContext:r}){if(!Array.isArray(n)||n.length===0)throw new Error("Draw something first.");const s=Mm.has(i)?i:"ja",o=Math.max(1,Math.round(e)||400),l=Math.max(1,Math.round(t)||400),c=yE[s]||[s],u=["https://www.google.com/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8","https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8"];let f="Recognition failed.";for(const p of c){const m={options:"enable_pre_space",requests:[{writing_guide:{writing_area_width:o,writing_area_height:l},ink:n,language:p,max_num_results:12}]};r&&(m.requests[0].pre_context=String(r).slice(-40));for(const v of u)try{const I=await fetch(v,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)});if(!I.ok){f=`Recognition HTTP ${I.status}`;continue}const k=Zd(await I.json());if(k.length)return{candidates:k}}catch(I){f=I.message||f}}try{const p=ef[s]||ef.ja,m=await fetch(`https://inputtools.google.com/request?itc=${p}&app=demopage`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify([s,n,{}])});if(m.ok){const v=Zd(await m.json());if(v.length)return{candidates:v}}}catch(p){f=p.message||f}throw new Error(f)}function Ko(n,e){const t=String(n).match(new RegExp(`\\p{Script=${e}}`,"gu"));return t?t.length:0}function tf(n){return String(n||"").replace(/\s+/g,"").toLowerCase()}function nf(n){return String(n||"").normalize("NFD").replace(new RegExp("\\p{M}","gu"),"").toLowerCase().replace(/[^a-z]/g,"")}function rf(n,e){const t=nf(n),i=nf(e);return t.length>=3&&t===i}function EE(n){const e=[...String(n||"")].filter(t=>t.trim());return e.length>0&&e.every(t=>new RegExp("\\p{Script=Han}","u").test(t))}function Qo(n,e,t,i){return e?(t==="zh_CN"||t==="zh_TW"?"zh":t)===i||tf(n)!==tf(e)?!1:Ko(n,"Hangul")>0&&i!=="ko"||Ko(n,"Hiragana")+Ko(n,"Katakana")>0&&i!=="ja"||Ko(n,"Latin")>0&&i!=="en":!0}function TE(n){const e=Array.isArray(n==null?void 0:n[0])?n[0]:[],t=e.map(r=>r&&r[0]?r[0]:"").join(""),i=e.map(r=>r&&r[3]?r[3]:"").filter(Boolean).join(" ");return{text:t,romanization:i}}async function Et(n,e,t){if(e!=="auto"&&e===t)return{text:n,romanization:""};const i=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(e)}&tl=${encodeURIComponent(t)}&dt=t&dt=rm&q=${encodeURIComponent(n)}`,r=await fetch(i,{signal:AbortSignal.timeout(8e3)});if(!r.ok)throw new Error(`Translate HTTP ${r.status}`);return TE(await r.json())}async function sf(n,e,t){const[i,r,s,o,l]=await Promise.all([Et(n,e,"zh-CN"),Et(n,e,"zh-TW"),Et(n,e,"ja"),Et(n,e,"ko"),Et(n,e,"en")]),c=i.text||"",u=r.text||"",f=s.text||"",p=o.text||"",[m,v,I]=await Promise.all([c?Et(c,"zh-CN","en"):Promise.resolve({romanization:""}),f?Et(f,"ja","en"):Promise.resolve({romanization:""}),p?Et(p,"ko","en"):Promise.resolve({romanization:""})]),k=t==="zh_CN"||t==="zh_TW"?"zh":t;let N=c||(k==="zh"?n:""),x=u||(k==="zh"?n:"");if(new RegExp("\\p{Script=Han}","u").test(N||x)){const B=N||x,[te,q]=await Promise.all([Et(B,"zh-TW","zh-CN"),Et(B,"zh-CN","zh-TW")]);te.text&&(N=te.text),q.text&&(x=q.text)}const j={zh:{simplified:N,traditional:x,pinyin:m.romanization||""},ja:{text:k==="ja"&&!f?n:f,kana:"",romaji:v.romanization||""},ko:{text:k==="ko"&&!p?n:p,romanization:I.romanization||"",hanja:"",explanation:l.text||""},en:{text:k==="en"&&!l.text?n:l.text||""},gloss:l.text||"",provider:e==="auto"?"gtx-auto":"gtx",sourceLang:t};return wE(j,n,k)}async function wE(n,e,t){let{zh:i,ja:r,ko:s,en:o,gloss:l}=n;if(t==="zh"&&rf(o.text||l,i.pinyin)){const c=[];for(const u of[...e]){if(!new RegExp("\\p{Script=Han}","u").test(u))continue;const f=await Et(u,"zh-CN","en");f.text&&!rf(f.text,f.romanization||"")&&c.at(-1)!==f.text&&c.push(f.text)}if(c.length){const u=c.join(" ");o={text:u},l=u}if(EE(e)&&(r={...r,text:e}),o.text){const u=await Et(o.text,"en","ko");u.text&&(s={...s,text:u.text,explanation:o.text})}}if(t==="ko"&&[...e].length<=4&&[...r.text||""].length<=1&&(o.text||l)){const c=await Et(o.text||l,"en","ja");c.text&&c.text!==r.text&&(r={...r,text:c.text})}return{...n,zh:i,ja:r,ko:s,en:o,gloss:l}}async function IE({text:n,language:e}){var l;const t=String(n||"").trim();if(!t)throw new Error("Nothing to translate.");const i=co(t,Mm.has(e)?e:"zh_CN"),r=_E[i]||"auto";let s=await sf(t,r,i);return(Qo(t,s.zh.simplified,i,"zh")||Qo(t,s.ja.text,i,"ja")||Qo(t,s.ko.text,i,"ko")||Qo(t,(l=s.en)==null?void 0:l.text,i,"en"))&&r!=="auto"&&(s=await sf(t,"auto",i)),s}const of=[{id:"en",htmlLang:"en",short:"EN",name:"English",tts:"en-US",hint:"Draw or type in English",placeholder:"Draw or type…"},{id:"zh_CN",htmlLang:"zh-CN",short:"简",name:"简体中文",tts:"zh-CN",hint:"用手指写一个字",placeholder:"手写或输入…"},{id:"zh_TW",htmlLang:"zh-TW",short:"繁",name:"繁體中文",tts:"zh-TW",hint:"用手指寫一個字",placeholder:"手寫或輸入…"},{id:"ja",htmlLang:"ja",short:"日",name:"日本語",tts:"ja-JP",hint:"指で文字を書いてください",placeholder:"書いて入力…"},{id:"ko",htmlLang:"ko",short:"한",name:"한국어",tts:"ko-KR",hint:"손가락으로 글자를 쓰세요",placeholder:"쓰거나 입력…"}];function Bt(n){return of.find(e=>e.id===n)||of[0]}async function Fm(n,e){const t=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!(t.headers.get("content-type")||"").includes("application/json"))return null;const r=await t.json().catch(()=>null);if(!t.ok)throw new Error((r==null?void 0:r.error)||`Request failed (${t.status})`);return r}async function AE(n){try{const e=await Fm("/api/recognize",n);if(Array.isArray(e==null?void 0:e.candidates)&&e.candidates.length)return e}catch{}return vE(n)}async function Um(n){try{const e=await Fm("/api/translate",n);if(e!=null&&e.zh||e!=null&&e.ja||e!=null&&e.ko)return e}catch{}return IE(n)}function uo(n,e){if(!n||!window.speechSynthesis)return;window.speechSynthesis.cancel();const t=new SpeechSynthesisUtterance(n);t.lang=e;const i=window.speechSynthesis.getVoices(),r=i.find(s=>s.lang===e)||i.find(s=>s.lang.startsWith(e.slice(0,2)));r&&(t.voice=r),window.speechSynthesis.speak(t)}async function Bm(n){var t;if(!n)return;if((t=navigator.clipboard)!=null&&t.writeText){await navigator.clipboard.writeText(n);return}const e=document.createElement("textarea");e.value=n,document.body.appendChild(e),e.select(),document.execCommand("copy"),e.remove()}const CE=()=>{};var af={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jm={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const V=function(n,e){if(!n)throw Br(e)},Br=function(n){return new Error("Firebase Database ("+jm.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zm=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let r=n.charCodeAt(i);r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):(r&64512)===55296&&i+1<n.length&&(n.charCodeAt(i+1)&64512)===56320?(r=65536+((r&1023)<<10)+(n.charCodeAt(++i)&1023),e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},SE=function(n){const e=[];let t=0,i=0;for(;t<n.length;){const r=n[t++];if(r<128)e[i++]=String.fromCharCode(r);else if(r>191&&r<224){const s=n[t++];e[i++]=String.fromCharCode((r&31)<<6|s&63)}else if(r>239&&r<365){const s=n[t++],o=n[t++],l=n[t++],c=((r&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[i++]=String.fromCharCode(55296+(c>>10)),e[i++]=String.fromCharCode(56320+(c&1023))}else{const s=n[t++],o=n[t++];e[i++]=String.fromCharCode((r&15)<<12|(s&63)<<6|o&63)}}return e.join("")},bu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let r=0;r<n.length;r+=3){const s=n[r],o=r+1<n.length,l=o?n[r+1]:0,c=r+2<n.length,u=c?n[r+2]:0,f=s>>2,p=(s&3)<<4|l>>4;let m=(l&15)<<2|u>>6,v=u&63;c||(v=64,o||(m=64)),i.push(t[f],t[p],t[m],t[v])}return i.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(zm(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):SE(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let r=0;r<n.length;){const s=t[n.charAt(r++)],l=r<n.length?t[n.charAt(r)]:0;++r;const u=r<n.length?t[n.charAt(r)]:64;++r;const p=r<n.length?t[n.charAt(r)]:64;if(++r,s==null||l==null||u==null||p==null)throw new RE;const m=s<<2|l>>4;if(i.push(m),u!==64){const v=l<<4&240|u>>2;if(i.push(v),p!==64){const I=u<<6&192|p;i.push(I)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class RE extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const qm=function(n){const e=zm(n);return bu.encodeByteArray(e,!0)},ya=function(n){return qm(n).replace(/\./g,"")},va=function(n){try{return bu.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bE(n){return Wm(void 0,n)}function Wm(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!PE(t)||(n[t]=Wm(n[t],e[t]));return n}function PE(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kE(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NE=()=>kE().__FIREBASE_DEFAULTS__,DE=()=>{if(typeof process>"u"||typeof af>"u")return;const n=af.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},OE=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&va(n[1]);return e&&JSON.parse(e)},il=()=>{try{return CE()||NE()||DE()||OE()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},$m=n=>{var e,t;return(t=(e=il())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Hm=n=>{const e=$m(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const i=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),i]:[e.substring(0,t),i]},Gm=()=>{var n;return(n=il())===null||n===void 0?void 0:n.config},Km=n=>{var e;return(e=il())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,i)=>{t?this.reject(t):this.resolve(i),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,i))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oi(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Pu(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qm(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},i=e||"demo-project",r=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${i}`,aud:i,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},n);return[ya(JSON.stringify(t)),ya(JSON.stringify(o)),""].join(".")}const ks={};function xE(){const n={prod:[],emulator:[]};for(const e of Object.keys(ks))ks[e]?n.emulator.push(e):n.prod.push(e);return n}function LE(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let lf=!1;function ku(n,e){if(typeof window>"u"||typeof document>"u"||!oi(window.location.host)||ks[n]===e||ks[n]||lf)return;ks[n]=e;function t(m){return`__firebase__banner__${m}`}const i="__firebase__banner",s=xE().prod.length>0;function o(){const m=document.getElementById(i);m&&m.remove()}function l(m){m.style.display="flex",m.style.background="#7faaf0",m.style.position="fixed",m.style.bottom="5px",m.style.left="5px",m.style.padding=".5em",m.style.borderRadius="5px",m.style.alignItems="center"}function c(m,v){m.setAttribute("width","24"),m.setAttribute("id",v),m.setAttribute("height","24"),m.setAttribute("viewBox","0 0 24 24"),m.setAttribute("fill","none"),m.style.marginLeft="-6px"}function u(){const m=document.createElement("span");return m.style.cursor="pointer",m.style.marginLeft="16px",m.style.fontSize="24px",m.innerHTML=" &times;",m.onclick=()=>{lf=!0,o()},m}function f(m,v){m.setAttribute("id",v),m.innerText="Learn more",m.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",m.setAttribute("target","__blank"),m.style.paddingLeft="5px",m.style.textDecoration="underline"}function p(){const m=LE(i),v=t("text"),I=document.getElementById(v)||document.createElement("span"),k=t("learnmore"),N=document.getElementById(k)||document.createElement("a"),x=t("preprendIcon"),j=document.getElementById(x)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(m.created){const B=m.element;l(B),f(N,k);const te=u();c(j,x),B.append(j,I,N,te),document.body.appendChild(B)}s?(I.innerText="Preview backend disconnected.",j.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(j.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,I.innerText="Preview backend running in this workspace."),I.setAttribute("id",v)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",p):p()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function it(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Nu(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(it())}function VE(){var n;const e=(n=il())===null||n===void 0?void 0:n.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ME(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function FE(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Ym(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function UE(){const n=it();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function BE(){return jm.NODE_ADMIN===!0}function jE(){return!VE()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function zE(){try{return typeof indexedDB=="object"}catch{return!1}}function qE(){return new Promise((n,e)=>{try{let t=!0;const i="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(i);r.onsuccess=()=>{r.result.close(),t||self.indexedDB.deleteDatabase(i),n(!0)},r.onupgradeneeded=()=>{t=!1},r.onerror=()=>{var s;e(((s=r.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WE="FirebaseError";class bn extends Error{constructor(e,t,i){super(t),this.code=e,this.customData=i,this.name=WE,Object.setPrototypeOf(this,bn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ho.prototype.create)}}class ho{constructor(e,t,i){this.service=e,this.serviceName=t,this.errors=i}create(e,...t){const i=t[0]||{},r=`${this.service}/${e}`,s=this.errors[e],o=s?$E(s,i):"Error",l=`${this.serviceName}: ${o} (${r}).`;return new bn(r,l,i)}}function $E(n,e){return n.replace(HE,(t,i)=>{const r=e[i];return r!=null?String(r):`<${i}?>`})}const HE=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function js(n){return JSON.parse(n)}function We(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xm=function(n){let e={},t={},i={},r="";try{const s=n.split(".");e=js(va(s[0])||""),t=js(va(s[1])||""),r=s[2],i=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:i,signature:r}},GE=function(n){const e=Xm(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},KE=function(n){const e=Xm(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rn(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Cr(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function Pc(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ea(n,e,t){const i={};for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&(i[r]=e.call(t,n[r],r,n));return i}function Gn(n,e){if(n===e)return!0;const t=Object.keys(n),i=Object.keys(e);for(const r of t){if(!i.includes(r))return!1;const s=n[r],o=e[r];if(cf(s)&&cf(o)){if(!Gn(s,o))return!1}else if(s!==o)return!1}for(const r of i)if(!t.includes(r))return!1;return!0}function cf(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jr(n){const e=[];for(const[t,i]of Object.entries(n))Array.isArray(i)?i.forEach(r=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(r))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(i));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QE{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const i=this.W_;if(typeof e=="string")for(let p=0;p<16;p++)i[p]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let p=0;p<16;p++)i[p]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let p=16;p<80;p++){const m=i[p-3]^i[p-8]^i[p-14]^i[p-16];i[p]=(m<<1|m>>>31)&4294967295}let r=this.chain_[0],s=this.chain_[1],o=this.chain_[2],l=this.chain_[3],c=this.chain_[4],u,f;for(let p=0;p<80;p++){p<40?p<20?(u=l^s&(o^l),f=1518500249):(u=s^o^l,f=1859775393):p<60?(u=s&o|l&(s|o),f=2400959708):(u=s^o^l,f=3395469782);const m=(r<<5|r>>>27)+u+c+f+i[p]&4294967295;c=l,l=o,o=(s<<30|s>>>2)&4294967295,s=r,r=m}this.chain_[0]=this.chain_[0]+r&4294967295,this.chain_[1]=this.chain_[1]+s&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+c&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const i=t-this.blockSize;let r=0;const s=this.buf_;let o=this.inbuf_;for(;r<t;){if(o===0)for(;r<=i;)this.compress_(e,r),r+=this.blockSize;if(typeof e=="string"){for(;r<t;)if(s[o]=e.charCodeAt(r),++o,++r,o===this.blockSize){this.compress_(s),o=0;break}}else for(;r<t;)if(s[o]=e[r],++o,++r,o===this.blockSize){this.compress_(s),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let r=this.blockSize-1;r>=56;r--)this.buf_[r]=t&255,t/=256;this.compress_(this.buf_);let i=0;for(let r=0;r<5;r++)for(let s=24;s>=0;s-=8)e[i]=this.chain_[r]>>s&255,++i;return e}}function YE(n,e){const t=new XE(n,e);return t.subscribe.bind(t)}class XE{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(i=>{this.error(i)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,i){let r;if(e===void 0&&t===void 0&&i===void 0)throw new Error("Missing Observer.");JE(e,["next","error","complete"])?r=e:r={next:e,error:t,complete:i},r.next===void 0&&(r.next=sc),r.error===void 0&&(r.error=sc),r.complete===void 0&&(r.complete=sc);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch{}}),this.observers.push(r),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(i){typeof console<"u"&&console.error&&console.error(i)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function JE(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function sc(){}function Du(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZE=function(n){const e=[];let t=0;for(let i=0;i<n.length;i++){let r=n.charCodeAt(i);if(r>=55296&&r<=56319){const s=r-55296;i++,V(i<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(i)-56320;r=65536+(s<<10)+o}r<128?e[t++]=r:r<2048?(e[t++]=r>>6|192,e[t++]=r&63|128):r<65536?(e[t++]=r>>12|224,e[t++]=r>>6&63|128,e[t++]=r&63|128):(e[t++]=r>>18|240,e[t++]=r>>12&63|128,e[t++]=r>>6&63|128,e[t++]=r&63|128)}return e},sl=function(n){let e=0;for(let t=0;t<n.length;t++){const i=n.charCodeAt(t);i<128?e++:i<2048?e+=2:i>=55296&&i<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function we(n){return n&&n._delegate?n._delegate:n}class Kn{constructor(e,t,i){this.name=e,this.instanceFactory=t,this.type=i,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ei="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eT{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const i=new rl;if(this.instancesDeferred.set(t,i),this.isInitialized(t)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:t});r&&i.resolve(r)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const i=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(i)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:i})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(nT(e))try{this.getOrInitializeService({instanceIdentifier:Ei})}catch{}for(const[t,i]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:r});i.resolve(s)}catch{}}}}clearInstance(e=Ei){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Ei){return this.instances.has(e)}getOptions(e=Ei){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,i=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(i))throw Error(`${this.name}(${i}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:i,options:t});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);i===l&&o.resolve(r)}return r}onInit(e,t){var i;const r=this.normalizeInstanceIdentifier(t),s=(i=this.onInitCallbacks.get(r))!==null&&i!==void 0?i:new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const i=this.onInitCallbacks.get(t);if(i)for(const r of i)try{r(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let i=this.instances.get(e);if(!i&&this.component&&(i=this.component.instanceFactory(this.container,{instanceIdentifier:tT(e),options:t}),this.instances.set(e,i),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(i,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,i)}catch{}return i||null}normalizeInstanceIdentifier(e=Ei){return this.component?this.component.multipleInstances?e:Ei:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function tT(n){return n===Ei?void 0:n}function nT(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iT{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new eT(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ne;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(ne||(ne={}));const rT={debug:ne.DEBUG,verbose:ne.VERBOSE,info:ne.INFO,warn:ne.WARN,error:ne.ERROR,silent:ne.SILENT},sT=ne.INFO,oT={[ne.DEBUG]:"log",[ne.VERBOSE]:"log",[ne.INFO]:"info",[ne.WARN]:"warn",[ne.ERROR]:"error"},aT=(n,e,...t)=>{if(e<n.logLevel)return;const i=new Date().toISOString(),r=oT[e];if(r)console[r](`[${i}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ol{constructor(e){this.name=e,this._logLevel=sT,this._logHandler=aT,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ne))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?rT[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ne.DEBUG,...e),this._logHandler(this,ne.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ne.VERBOSE,...e),this._logHandler(this,ne.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ne.INFO,...e),this._logHandler(this,ne.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ne.WARN,...e),this._logHandler(this,ne.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ne.ERROR,...e),this._logHandler(this,ne.ERROR,...e)}}const lT=(n,e)=>e.some(t=>n instanceof t);let uf,hf;function cT(){return uf||(uf=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function uT(){return hf||(hf=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Jm=new WeakMap,kc=new WeakMap,Zm=new WeakMap,oc=new WeakMap,Ou=new WeakMap;function hT(n){const e=new Promise((t,i)=>{const r=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(Bn(n.result)),r()},o=()=>{i(n.error),r()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Jm.set(t,n)}).catch(()=>{}),Ou.set(e,n),e}function dT(n){if(kc.has(n))return;const e=new Promise((t,i)=>{const r=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),r()},o=()=>{i(n.error||new DOMException("AbortError","AbortError")),r()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});kc.set(n,e)}let Nc={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return kc.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Zm.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Bn(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function fT(n){Nc=n(Nc)}function pT(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const i=n.call(ac(this),e,...t);return Zm.set(i,e.sort?e.sort():[e]),Bn(i)}:uT().includes(n)?function(...e){return n.apply(ac(this),e),Bn(Jm.get(this))}:function(...e){return Bn(n.apply(ac(this),e))}}function mT(n){return typeof n=="function"?pT(n):(n instanceof IDBTransaction&&dT(n),lT(n,cT())?new Proxy(n,Nc):n)}function Bn(n){if(n instanceof IDBRequest)return hT(n);if(oc.has(n))return oc.get(n);const e=mT(n);return e!==n&&(oc.set(n,e),Ou.set(e,n)),e}const ac=n=>Ou.get(n);function gT(n,e,{blocked:t,upgrade:i,blocking:r,terminated:s}={}){const o=indexedDB.open(n,e),l=Bn(o);return i&&o.addEventListener("upgradeneeded",c=>{i(Bn(o.result),c.oldVersion,c.newVersion,Bn(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),l.then(c=>{s&&c.addEventListener("close",()=>s()),r&&c.addEventListener("versionchange",u=>r(u.oldVersion,u.newVersion,u))}).catch(()=>{}),l}const _T=["get","getKey","getAll","getAllKeys","count"],yT=["put","add","delete","clear"],lc=new Map;function df(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(lc.get(e))return lc.get(e);const t=e.replace(/FromIndex$/,""),i=e!==t,r=yT.includes(t);if(!(t in(i?IDBIndex:IDBObjectStore).prototype)||!(r||_T.includes(t)))return;const s=async function(o,...l){const c=this.transaction(o,r?"readwrite":"readonly");let u=c.store;return i&&(u=u.index(l.shift())),(await Promise.all([u[t](...l),r&&c.done]))[0]};return lc.set(e,s),s}fT(n=>({...n,get:(e,t,i)=>df(e,t)||n.get(e,t,i),has:(e,t)=>!!df(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vT{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ET(t)){const i=t.getImmediate();return`${i.library}/${i.version}`}else return null}).filter(t=>t).join(" ")}}function ET(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Dc="@firebase/app",ff="0.13.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wn=new ol("@firebase/app"),TT="@firebase/app-compat",wT="@firebase/analytics-compat",IT="@firebase/analytics",AT="@firebase/app-check-compat",CT="@firebase/app-check",ST="@firebase/auth",RT="@firebase/auth-compat",bT="@firebase/database",PT="@firebase/data-connect",kT="@firebase/database-compat",NT="@firebase/functions",DT="@firebase/functions-compat",OT="@firebase/installations",xT="@firebase/installations-compat",LT="@firebase/messaging",VT="@firebase/messaging-compat",MT="@firebase/performance",FT="@firebase/performance-compat",UT="@firebase/remote-config",BT="@firebase/remote-config-compat",jT="@firebase/storage",zT="@firebase/storage-compat",qT="@firebase/firestore",WT="@firebase/ai",$T="@firebase/firestore-compat",HT="firebase",GT="11.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oc="[DEFAULT]",KT={[Dc]:"fire-core",[TT]:"fire-core-compat",[IT]:"fire-analytics",[wT]:"fire-analytics-compat",[CT]:"fire-app-check",[AT]:"fire-app-check-compat",[ST]:"fire-auth",[RT]:"fire-auth-compat",[bT]:"fire-rtdb",[PT]:"fire-data-connect",[kT]:"fire-rtdb-compat",[NT]:"fire-fn",[DT]:"fire-fn-compat",[OT]:"fire-iid",[xT]:"fire-iid-compat",[LT]:"fire-fcm",[VT]:"fire-fcm-compat",[MT]:"fire-perf",[FT]:"fire-perf-compat",[UT]:"fire-rc",[BT]:"fire-rc-compat",[jT]:"fire-gcs",[zT]:"fire-gcs-compat",[qT]:"fire-fst",[$T]:"fire-fst-compat",[WT]:"fire-vertex","fire-js":"fire-js",[HT]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta=new Map,QT=new Map,xc=new Map;function pf(n,e){try{n.container.addComponent(e)}catch(t){wn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Ri(n){const e=n.name;if(xc.has(e))return wn.debug(`There were multiple attempts to register component ${e}.`),!1;xc.set(e,n);for(const t of Ta.values())pf(t,n);for(const t of QT.values())pf(t,n);return!0}function al(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function wt(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},jn=new ho("app","Firebase",YT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XT{constructor(e,t,i){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=i,this.container.addComponent(new Kn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw jn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ui=GT;function eg(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const i=Object.assign({name:Oc,automaticDataCollectionEnabled:!0},e),r=i.name;if(typeof r!="string"||!r)throw jn.create("bad-app-name",{appName:String(r)});if(t||(t=Gm()),!t)throw jn.create("no-options");const s=Ta.get(r);if(s){if(Gn(t,s.options)&&Gn(i,s.config))return s;throw jn.create("duplicate-app",{appName:r})}const o=new iT(r);for(const c of xc.values())o.addComponent(c);const l=new XT(t,i,o);return Ta.set(r,l),l}function xu(n=Oc){const e=Ta.get(n);if(!e&&n===Oc&&Gm())return eg();if(!e)throw jn.create("no-app",{appName:n});return e}function Kt(n,e,t){var i;let r=(i=KT[n])!==null&&i!==void 0?i:n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const l=[`Unable to register library "${r}" with version "${e}":`];s&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&l.push("and"),o&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),wn.warn(l.join(" "));return}Ri(new Kn(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JT="firebase-heartbeat-database",ZT=1,zs="firebase-heartbeat-store";let cc=null;function tg(){return cc||(cc=gT(JT,ZT,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(zs)}catch(t){console.warn(t)}}}}).catch(n=>{throw jn.create("idb-open",{originalErrorMessage:n.message})})),cc}async function ew(n){try{const t=(await tg()).transaction(zs),i=await t.objectStore(zs).get(ng(n));return await t.done,i}catch(e){if(e instanceof bn)wn.warn(e.message);else{const t=jn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});wn.warn(t.message)}}}async function mf(n,e){try{const i=(await tg()).transaction(zs,"readwrite");await i.objectStore(zs).put(e,ng(n)),await i.done}catch(t){if(t instanceof bn)wn.warn(t.message);else{const i=jn.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});wn.warn(i.message)}}}function ng(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tw=1024,nw=30;class iw{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new sw(t),this._heartbeatsCachePromise=this._storage.read().then(i=>(this._heartbeatsCache=i,i))}async triggerHeartbeat(){var e,t;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=gf();if(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:r}),this._heartbeatsCache.heartbeats.length>nw){const o=ow(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(i){wn.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=gf(),{heartbeatsToSend:i,unsentEntries:r}=rw(this._heartbeatsCache.heartbeats),s=ya(JSON.stringify({version:2,heartbeats:i}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return wn.warn(t),""}}}function gf(){return new Date().toISOString().substring(0,10)}function rw(n,e=tw){const t=[];let i=n.slice();for(const r of n){const s=t.find(o=>o.agent===r.agent);if(s){if(s.dates.push(r.date),_f(t)>e){s.dates.pop();break}}else if(t.push({agent:r.agent,dates:[r.date]}),_f(t)>e){t.pop();break}i=i.slice(1)}return{heartbeatsToSend:t,unsentEntries:i}}class sw{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return zE()?qE().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await ew(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return mf(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const r=await this.read();return mf(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function _f(n){return ya(JSON.stringify({version:2,heartbeats:n})).length}function ow(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let i=1;i<n.length;i++)n[i].date<t&&(t=n[i].date,e=i);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aw(n){Ri(new Kn("platform-logger",e=>new vT(e),"PRIVATE")),Ri(new Kn("heartbeat",e=>new iw(e),"PRIVATE")),Kt(Dc,ff,n),Kt(Dc,ff,"esm2017"),Kt("fire-js","")}aw("");var lw="firebase",cw="11.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Kt(lw,cw,"app");function Lu(n,e){var t={};for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&e.indexOf(i)<0&&(t[i]=n[i]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var r=0,i=Object.getOwnPropertySymbols(n);r<i.length;r++)e.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(n,i[r])&&(t[i[r]]=n[i[r]]);return t}function ig(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const uw=ig,rg=new ho("auth","Firebase",ig());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wa=new ol("@firebase/auth");function hw(n,...e){wa.logLevel<=ne.WARN&&wa.warn(`Auth (${Ui}): ${n}`,...e)}function oa(n,...e){wa.logLevel<=ne.ERROR&&wa.error(`Auth (${Ui}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(n,...e){throw Mu(n,...e)}function jt(n,...e){return Mu(n,...e)}function Vu(n,e,t){const i=Object.assign(Object.assign({},uw()),{[e]:t});return new ho("auth","Firebase",i).create(e,{appName:n.name})}function zn(n){return Vu(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function sg(n,e,t){const i=t;if(!(e instanceof i))throw i.name!==e.constructor.name&&en(n,"argument-error"),Vu(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Mu(n,...e){if(typeof n!="string"){const t=e[0],i=[...e.slice(1)];return i[0]&&(i[0].appName=n.name),n._errorFactory.create(t,...i)}return rg.create(n,...e)}function G(n,e,...t){if(!n)throw Mu(e,...t)}function pn(n){const e="INTERNAL ASSERTION FAILED: "+n;throw oa(e),new Error(e)}function In(n,e){n||pn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Lc(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function dw(){return yf()==="http:"||yf()==="https:"}function yf(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fw(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(dw()||FE()||"connection"in navigator)?navigator.onLine:!0}function pw(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fo{constructor(e,t){this.shortDelay=e,this.longDelay=t,In(t>e,"Short delay should be less than long delay!"),this.isMobile=Nu()||Ym()}get(){return fw()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fu(n,e){In(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class og{static initialize(e,t,i){this.fetchImpl=e,t&&(this.headersImpl=t),i&&(this.responseImpl=i)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;pn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;pn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;pn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mw={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gw=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],_w=new fo(3e4,6e4);function Uu(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function zr(n,e,t,i,r={}){return ag(n,r,async()=>{let s={},o={};i&&(e==="GET"?o=i:s={body:JSON.stringify(i)});const l=jr(Object.assign({key:n.config.apiKey},o)).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);const u=Object.assign({method:e,headers:c},s);return ME()||(u.referrerPolicy="no-referrer"),n.emulatorConfig&&oi(n.emulatorConfig.host)&&(u.credentials="include"),og.fetch()(await lg(n,n.config.apiHost,t,l),u)})}async function ag(n,e,t){n._canInitEmulator=!1;const i=Object.assign(Object.assign({},mw),e);try{const r=new vw(n),s=await Promise.race([t(),r.promise]);r.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Yo(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[c,u]=l.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Yo(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Yo(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw Yo(n,"user-disabled",o);const f=i[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(u)throw Vu(n,f,u);en(n,f)}}catch(r){if(r instanceof bn)throw r;en(n,"network-request-failed",{message:String(r)})}}async function yw(n,e,t,i,r={}){const s=await zr(n,e,t,i,r);return"mfaPendingCredential"in s&&en(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function lg(n,e,t,i){const r=`${e}${t}?${i}`,s=n,o=s.config.emulator?Fu(n.config,r):`${n.config.apiScheme}://${r}`;return gw.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}class vw{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,i)=>{this.timer=setTimeout(()=>i(jt(this.auth,"network-request-failed")),_w.get())})}}function Yo(n,e,t){const i={appName:n.name};t.email&&(i.email=t.email),t.phoneNumber&&(i.phoneNumber=t.phoneNumber);const r=jt(n,e,i);return r.customData._tokenResponse=t,r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ew(n,e){return zr(n,"POST","/v1/accounts:delete",e)}async function Ia(n,e){return zr(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ns(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Tw(n,e=!1){const t=we(n),i=await t.getIdToken(e),r=Bu(i);G(r&&r.exp&&r.auth_time&&r.iat,t.auth,"internal-error");const s=typeof r.firebase=="object"?r.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:r,token:i,authTime:Ns(uc(r.auth_time)),issuedAtTime:Ns(uc(r.iat)),expirationTime:Ns(uc(r.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function uc(n){return Number(n)*1e3}function Bu(n){const[e,t,i]=n.split(".");if(e===void 0||t===void 0||i===void 0)return oa("JWT malformed, contained fewer than 3 sections"),null;try{const r=va(t);return r?JSON.parse(r):(oa("Failed to decode base64 JWT payload"),null)}catch(r){return oa("Caught error parsing JWT payload as JSON",r==null?void 0:r.toString()),null}}function vf(n){const e=Bu(n);return G(e,"internal-error"),G(typeof e.exp<"u","internal-error"),G(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qs(n,e,t=!1){if(t)return e;try{return await e}catch(i){throw i instanceof bn&&ww(i)&&n.auth.currentUser===n&&await n.auth.signOut(),i}}function ww({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iw{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const i=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),i}else{this.errorBackoff=3e4;const r=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ns(this.lastLoginAt),this.creationTime=Ns(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Aa(n){var e;const t=n.auth,i=await n.getIdToken(),r=await qs(n,Ia(t,{idToken:i}));G(r==null?void 0:r.users.length,t,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?cg(s.providerUserInfo):[],l=Cw(n.providerData,o),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!(l!=null&&l.length),f=c?u:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:l,metadata:new Vc(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(n,p)}async function Aw(n){const e=we(n);await Aa(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Cw(n,e){return[...n.filter(i=>!e.some(r=>r.providerId===i.providerId)),...e]}function cg(n){return n.map(e=>{var{providerId:t}=e,i=Lu(e,["providerId"]);return{providerId:t,uid:i.rawId||"",displayName:i.displayName||null,email:i.email||null,phoneNumber:i.phoneNumber||null,photoURL:i.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Sw(n,e){const t=await ag(n,{},async()=>{const i=jr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:r,apiKey:s}=n.config,o=await lg(n,r,"/v1/token",`key=${s}`),l=await n._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const c={method:"POST",headers:l,body:i};return n.emulatorConfig&&oi(n.emulatorConfig.host)&&(c.credentials="include"),og.fetch()(o,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function Rw(n,e){return zr(n,"POST","/v2/accounts:revokeToken",Uu(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){G(e.idToken,"internal-error"),G(typeof e.idToken<"u","internal-error"),G(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):vf(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){G(e.length!==0,"internal-error");const t=vf(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(G(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:i,refreshToken:r,expiresIn:s}=await Sw(e,t);this.updateTokensAndExpiration(i,r,Number(s))}updateTokensAndExpiration(e,t,i){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+i*1e3}static fromJSON(e,t){const{refreshToken:i,accessToken:r,expirationTime:s}=t,o=new mr;return i&&(G(typeof i=="string","internal-error",{appName:e}),o.refreshToken=i),r&&(G(typeof r=="string","internal-error",{appName:e}),o.accessToken=r),s&&(G(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new mr,this.toJSON())}_performRefresh(){return pn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xn(n,e){G(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Mt{constructor(e){var{uid:t,auth:i,stsTokenManager:r}=e,s=Lu(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new Iw(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=i,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Vc(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await qs(this,this.stsTokenManager.getToken(this.auth,e));return G(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Tw(this,e)}reload(){return Aw(this)}_assign(e){this!==e&&(G(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Mt(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){G(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let i=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),i=!0),t&&await Aa(this),await this.auth._persistUserIfCurrent(this),i&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(wt(this.auth.app))return Promise.reject(zn(this.auth));const e=await this.getIdToken();return await qs(this,Ew(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var i,r,s,o,l,c,u,f;const p=(i=t.displayName)!==null&&i!==void 0?i:void 0,m=(r=t.email)!==null&&r!==void 0?r:void 0,v=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,I=(o=t.photoURL)!==null&&o!==void 0?o:void 0,k=(l=t.tenantId)!==null&&l!==void 0?l:void 0,N=(c=t._redirectEventId)!==null&&c!==void 0?c:void 0,x=(u=t.createdAt)!==null&&u!==void 0?u:void 0,j=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:B,emailVerified:te,isAnonymous:q,providerData:ce,stsTokenManager:A}=t;G(B&&A,e,"internal-error");const _=mr.fromJSON(this.name,A);G(typeof B=="string",e,"internal-error"),xn(p,e.name),xn(m,e.name),G(typeof te=="boolean",e,"internal-error"),G(typeof q=="boolean",e,"internal-error"),xn(v,e.name),xn(I,e.name),xn(k,e.name),xn(N,e.name),xn(x,e.name),xn(j,e.name);const E=new Mt({uid:B,auth:e,email:m,emailVerified:te,displayName:p,isAnonymous:q,photoURL:I,phoneNumber:v,tenantId:k,stsTokenManager:_,createdAt:x,lastLoginAt:j});return ce&&Array.isArray(ce)&&(E.providerData=ce.map(T=>Object.assign({},T))),N&&(E._redirectEventId=N),E}static async _fromIdTokenResponse(e,t,i=!1){const r=new mr;r.updateFromServerResponse(t);const s=new Mt({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:i});return await Aa(s),s}static async _fromGetAccountInfoResponse(e,t,i){const r=t.users[0];G(r.localId!==void 0,"internal-error");const s=r.providerUserInfo!==void 0?cg(r.providerUserInfo):[],o=!(r.email&&r.passwordHash)&&!(s!=null&&s.length),l=new mr;l.updateFromIdToken(i);const c=new Mt({uid:r.localId,auth:e,stsTokenManager:l,isAnonymous:o}),u={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new Vc(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash)&&!(s!=null&&s.length)};return Object.assign(c,u),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ef=new Map;function mn(n){In(n instanceof Function,"Expected a class definition");let e=Ef.get(n);return e?(In(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Ef.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ug.type="NONE";const Tf=ug;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aa(n,e,t){return`firebase:${n}:${e}:${t}`}class gr{constructor(e,t,i){this.persistence=e,this.auth=t,this.userKey=i;const{config:r,name:s}=this.auth;this.fullUserKey=aa(this.userKey,r.apiKey,s),this.fullPersistenceKey=aa("persistence",r.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ia(this.auth,{idToken:e}).catch(()=>{});return t?Mt._fromGetAccountInfoResponse(this.auth,t,e):null}return Mt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,i="authUser"){if(!t.length)return new gr(mn(Tf),e,i);const r=(await Promise.all(t.map(async u=>{if(await u._isAvailable())return u}))).filter(u=>u);let s=r[0]||mn(Tf);const o=aa(i,e.config.apiKey,e.name);let l=null;for(const u of t)try{const f=await u._get(o);if(f){let p;if(typeof f=="string"){const m=await Ia(e,{idToken:f}).catch(()=>{});if(!m)break;p=await Mt._fromGetAccountInfoResponse(e,m,f)}else p=Mt._fromJSON(e,f);u!==s&&(l=p),s=u;break}}catch{}const c=r.filter(u=>u._shouldAllowMigration);return!s._shouldAllowMigration||!c.length?new gr(s,e,i):(s=c[0],l&&await s._set(o,l.toJSON()),await Promise.all(t.map(async u=>{if(u!==s)try{await u._remove(o)}catch{}})),new gr(s,e,i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wf(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(pg(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(hg(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(gg(e))return"Blackberry";if(_g(e))return"Webos";if(dg(e))return"Safari";if((e.includes("chrome/")||fg(e))&&!e.includes("edge/"))return"Chrome";if(mg(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,i=n.match(t);if((i==null?void 0:i.length)===2)return i[1]}return"Other"}function hg(n=it()){return/firefox\//i.test(n)}function dg(n=it()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function fg(n=it()){return/crios\//i.test(n)}function pg(n=it()){return/iemobile/i.test(n)}function mg(n=it()){return/android/i.test(n)}function gg(n=it()){return/blackberry/i.test(n)}function _g(n=it()){return/webos/i.test(n)}function ju(n=it()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function bw(n=it()){var e;return ju(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function Pw(){return UE()&&document.documentMode===10}function yg(n=it()){return ju(n)||mg(n)||_g(n)||gg(n)||/windows phone/i.test(n)||pg(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vg(n,e=[]){let t;switch(n){case"Browser":t=wf(it());break;case"Worker":t=`${wf(it())}-${n}`;break;default:t=n}const i=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Ui}/${i}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kw{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const i=s=>new Promise((o,l)=>{try{const c=e(s);o(c)}catch(c){l(c)}});i.onAbort=t,this.queue.push(i);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const i of this.queue)await i(e),i.onAbort&&t.push(i.onAbort)}catch(i){t.reverse();for(const r of t)try{r()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:i==null?void 0:i.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nw(n,e={}){return zr(n,"GET","/v2/passwordPolicy",Uu(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dw=6;class Ow{constructor(e){var t,i,r,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:Dw,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(r=(i=e.allowedNonAlphanumericCharacters)===null||i===void 0?void 0:i.join(""))!==null&&r!==void 0?r:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,i,r,s,o,l;const c={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,c),this.validatePasswordCharacterOptions(e,c),c.isValid&&(c.isValid=(t=c.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),c.isValid&&(c.isValid=(i=c.meetsMaxPasswordLength)!==null&&i!==void 0?i:!0),c.isValid&&(c.isValid=(r=c.containsLowercaseLetter)!==null&&r!==void 0?r:!0),c.isValid&&(c.isValid=(s=c.containsUppercaseLetter)!==null&&s!==void 0?s:!0),c.isValid&&(c.isValid=(o=c.containsNumericCharacter)!==null&&o!==void 0?o:!0),c.isValid&&(c.isValid=(l=c.containsNonAlphanumericCharacter)!==null&&l!==void 0?l:!0),c}validatePasswordLengthOptions(e,t){const i=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;i&&(t.meetsMinPasswordLength=e.length>=i),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let i;for(let r=0;r<e.length;r++)i=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,i>="a"&&i<="z",i>="A"&&i<="Z",i>="0"&&i<="9",this.allowedNonAlphanumericCharacters.includes(i))}updatePasswordCharacterOptionsStatuses(e,t,i,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=i)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xw{constructor(e,t,i,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=i,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new If(this),this.idTokenSubscription=new If(this),this.beforeStateQueue=new kw(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=rg,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=mn(t)),this._initializationPromise=this.queue(async()=>{var i,r,s;if(!this._deleted&&(this.persistenceManager=await gr.create(this,e),(i=this._resolvePersistenceManagerAvailable)===null||i===void 0||i.call(this),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((s=this.currentUser)===null||s===void 0?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ia(this,{idToken:e}),i=await Mt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(i)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(wt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const i=await this.assertedPersistence.getCurrentUser();let r=i,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,l=r==null?void 0:r._redirectEventId,c=await this.tryRedirectSignIn(e);(!o||o===l)&&(c!=null&&c.user)&&(r=c.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=i,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return G(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Aa(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=pw()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(wt(this.app))return Promise.reject(zn(this));const t=e?we(e):null;return t&&G(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&G(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return wt(this.app)?Promise.reject(zn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return wt(this.app)?Promise.reject(zn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(mn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Nw(this),t=new Ow(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ho("auth","Firebase",e())}onAuthStateChanged(e,t,i){return this.registerStateListener(this.authStateSubscription,e,t,i)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,i){return this.registerStateListener(this.idTokenSubscription,e,t,i)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const i=this.onAuthStateChanged(()=>{i(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),i={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(i.tenantId=this.tenantId),await Rw(this,i)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const i=await this.getOrInitRedirectPersistenceManager(t);return e===null?i.removeCurrentUser():i.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&mn(e)||this._popupRedirectResolver;G(t,this,"argument-error"),this.redirectPersistenceManager=await gr.create(this,[mn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,i;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const i=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==i&&(this.lastNotifiedUid=i,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,i,r){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(G(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const c=e.addObserver(t,i,r);return()=>{o=!0,c()}}else{const c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return G(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=vg(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const i=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());i&&(t["X-Firebase-Client"]=i);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(wt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t!=null&&t.error&&hw(`Error while retrieving App Check token: ${t.error}`),t==null?void 0:t.token}}function qr(n){return we(n)}class If{constructor(e){this.auth=e,this.observer=null,this.addObserver=YE(t=>this.observer=t)}get next(){return G(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let zu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Lw(n){zu=n}function Vw(n){return zu.loadJS(n)}function Mw(){return zu.gapiScript}function Fw(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uw(n,e){const t=al(n,"auth");if(t.isInitialized()){const r=t.getImmediate(),s=t.getOptions();if(Gn(s,e??{}))return r;en(r,"already-initialized")}return t.initialize({options:e})}function Bw(n,e){const t=(e==null?void 0:e.persistence)||[],i=(Array.isArray(t)?t:[t]).map(mn);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(i,e==null?void 0:e.popupRedirectResolver)}function jw(n,e,t){const i=qr(n);G(/^https?:\/\//.test(e),i,"invalid-emulator-scheme");const r=!1,s=Eg(e),{host:o,port:l}=zw(e),c=l===null?"":`:${l}`,u={url:`${s}//${o}${c}/`},f=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:r})});if(!i._canInitEmulator){G(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),G(Gn(u,i.config.emulator)&&Gn(f,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=u,i.emulatorConfig=f,i.settings.appVerificationDisabledForTesting=!0,oi(o)?(Pu(`${s}//${o}${c}`),ku("Auth",!0)):qw()}function Eg(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function zw(n){const e=Eg(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const i=t[2].split("@").pop()||"",r=/^(\[[^\]]+\])(:|$)/.exec(i);if(r){const s=r[1];return{host:s,port:Af(i.substr(s.length+1))}}else{const[s,o]=i.split(":");return{host:s,port:Af(o)}}}function Af(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function qw(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tg{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return pn("not implemented")}_getIdTokenResponse(e){return pn("not implemented")}_linkToIdToken(e,t){return pn("not implemented")}_getReauthenticationResolver(e){return pn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _r(n,e){return yw(n,"POST","/v1/accounts:signInWithIdp",Uu(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ww="http://localhost";class bi extends Tg{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new bi(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):en("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:i,signInMethod:r}=t,s=Lu(t,["providerId","signInMethod"]);if(!i||!r)return null;const o=new bi(i,r);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return _r(e,t)}_linkToIdToken(e,t){const i=this.buildRequest();return i.idToken=t,_r(e,i)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,_r(e,t)}buildRequest(){const e={requestUri:Ww,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=jr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ll{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po extends ll{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln extends po{constructor(){super("facebook.com")}static credential(e){return bi._fromParams({providerId:Ln.PROVIDER_ID,signInMethod:Ln.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ln.credentialFromTaggedObject(e)}static credentialFromError(e){return Ln.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ln.credential(e.oauthAccessToken)}catch{return null}}}Ln.FACEBOOK_SIGN_IN_METHOD="facebook.com";Ln.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn extends po{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return bi._fromParams({providerId:fn.PROVIDER_ID,signInMethod:fn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return fn.credentialFromTaggedObject(e)}static credentialFromError(e){return fn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:i}=e;if(!t&&!i)return null;try{return fn.credential(t,i)}catch{return null}}}fn.GOOGLE_SIGN_IN_METHOD="google.com";fn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn extends po{constructor(){super("github.com")}static credential(e){return bi._fromParams({providerId:Vn.PROVIDER_ID,signInMethod:Vn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Vn.credentialFromTaggedObject(e)}static credentialFromError(e){return Vn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Vn.credential(e.oauthAccessToken)}catch{return null}}}Vn.GITHUB_SIGN_IN_METHOD="github.com";Vn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mn extends po{constructor(){super("twitter.com")}static credential(e,t){return bi._fromParams({providerId:Mn.PROVIDER_ID,signInMethod:Mn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Mn.credentialFromTaggedObject(e)}static credentialFromError(e){return Mn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:i}=e;if(!t||!i)return null;try{return Mn.credential(t,i)}catch{return null}}}Mn.TWITTER_SIGN_IN_METHOD="twitter.com";Mn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,i,r=!1){const s=await Mt._fromIdTokenResponse(e,i,r),o=Cf(i);return new Sr({user:s,providerId:o,_tokenResponse:i,operationType:t})}static async _forOperation(e,t,i){await e._updateTokensIfNecessary(i,!0);const r=Cf(i);return new Sr({user:e,providerId:r,_tokenResponse:i,operationType:t})}}function Cf(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca extends bn{constructor(e,t,i,r){var s;super(t.code,t.message),this.operationType=i,this.user=r,Object.setPrototypeOf(this,Ca.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:i}}static _fromErrorAndOperation(e,t,i,r){return new Ca(e,t,i,r)}}function wg(n,e,t,i){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Ca._fromErrorAndOperation(n,s,e,i):s})}async function $w(n,e,t=!1){const i=await qs(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Sr._forOperation(n,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hw(n,e,t=!1){const{auth:i}=n;if(wt(i.app))return Promise.reject(zn(i));const r="reauthenticate";try{const s=await qs(n,wg(i,r,e,n),t);G(s.idToken,i,"internal-error");const o=Bu(s.idToken);G(o,i,"internal-error");const{sub:l}=o;return G(n.uid===l,i,"user-mismatch"),Sr._forOperation(n,r,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&en(i,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gw(n,e,t=!1){if(wt(n.app))return Promise.reject(zn(n));const i="signIn",r=await wg(n,i,e),s=await Sr._fromIdTokenResponse(n,i,r);return t||await n._updateCurrentUser(s.user),s}function Kw(n,e,t,i){return we(n).onIdTokenChanged(e,t,i)}function Qw(n,e,t){return we(n).beforeAuthStateChanged(e,t)}function Yw(n,e,t,i){return we(n).onAuthStateChanged(e,t,i)}function Xw(n){return we(n).signOut()}const Sa="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ig{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Sa,"1"),this.storage.removeItem(Sa),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jw=1e3,Zw=10;class Ag extends Ig{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=yg(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const i=this.storage.getItem(t),r=this.localCache[t];i!==r&&e(t,r,i)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,l,c)=>{this.notifyListeners(o,c)});return}const i=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const o=this.storage.getItem(i);!t&&this.localCache[i]===o||this.notifyListeners(i,o)},s=this.storage.getItem(i);Pw()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,Zw):r()}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,i)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:i}),!0)})},Jw)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ag.type="LOCAL";const eI=Ag;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cg extends Ig{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Cg.type="SESSION";const Sg=Cg;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tI(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(r=>r.isListeningto(e));if(t)return t;const i=new cl(e);return this.receivers.push(i),i}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:i,eventType:r,data:s}=t.data,o=this.handlersMap[r];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:i,eventType:r});const l=Array.from(o).map(async u=>u(t.origin,s)),c=await tI(l);t.ports[0].postMessage({status:"done",eventId:i,eventType:r,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}cl.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qu(n="",e=10){let t="";for(let i=0;i<e;i++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nI{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,i=50){const r=typeof MessageChannel<"u"?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,o;return new Promise((l,c)=>{const u=qu("",20);r.port1.start();const f=setTimeout(()=>{c(new Error("unsupported_event"))},i);o={messageChannel:r,onMessage(p){const m=p;if(m.data.eventId===u)switch(m.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(m.data.response);break;default:clearTimeout(f),clearTimeout(s),c(new Error("invalid_response"));break}}},this.handlers.add(o),r.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:u,data:t},[r.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(){return window}function iI(n){Qt().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rg(){return typeof Qt().WorkerGlobalScope<"u"&&typeof Qt().importScripts=="function"}async function rI(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function sI(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function oI(){return Rg()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bg="firebaseLocalStorageDb",aI=1,Ra="firebaseLocalStorage",Pg="fbase_key";class mo{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ul(n,e){return n.transaction([Ra],e?"readwrite":"readonly").objectStore(Ra)}function lI(){const n=indexedDB.deleteDatabase(bg);return new mo(n).toPromise()}function Mc(){const n=indexedDB.open(bg,aI);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const i=n.result;try{i.createObjectStore(Ra,{keyPath:Pg})}catch(r){t(r)}}),n.addEventListener("success",async()=>{const i=n.result;i.objectStoreNames.contains(Ra)?e(i):(i.close(),await lI(),e(await Mc()))})})}async function Sf(n,e,t){const i=ul(n,!0).put({[Pg]:e,value:t});return new mo(i).toPromise()}async function cI(n,e){const t=ul(n,!1).get(e),i=await new mo(t).toPromise();return i===void 0?null:i.value}function Rf(n,e){const t=ul(n,!0).delete(e);return new mo(t).toPromise()}const uI=800,hI=3;class kg{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Mc(),this.db)}async _withRetries(e){let t=0;for(;;)try{const i=await this._openDb();return await e(i)}catch(i){if(t++>hI)throw i;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Rg()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=cl._getInstance(oI()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await rI(),!this.activeServiceWorker)return;this.sender=new nI(this.activeServiceWorker);const i=await this.sender._send("ping",{},800);i&&!((e=i[0])===null||e===void 0)&&e.fulfilled&&!((t=i[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||sI()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Mc();return await Sf(e,Sa,"1"),await Rf(e,Sa),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(i=>Sf(i,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(i=>cI(i,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Rf(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(r=>{const s=ul(r,!1).getAll();return new mo(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],i=new Set;if(e.length!==0)for(const{fbase_key:r,value:s}of e)i.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!i.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const i=this.listeners[e];if(i)for(const r of Array.from(i))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),uI)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}kg.type="LOCAL";const dI=kg;new fo(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wu(n,e){return e?mn(e):(G(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u extends Tg{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return _r(e,this._buildIdpRequest())}_linkToIdToken(e,t){return _r(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return _r(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function fI(n){return Gw(n.auth,new $u(n),n.bypassAuthState)}function pI(n){const{auth:e,user:t}=n;return G(t,e,"internal-error"),Hw(t,new $u(n),n.bypassAuthState)}async function mI(n){const{auth:e,user:t}=n;return G(t,e,"internal-error"),$w(t,new $u(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ng{constructor(e,t,i,r,s=!1){this.auth=e,this.resolver=i,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(i){this.reject(i)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:i,postBody:r,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const c={auth:this.auth,requestUri:t,sessionId:i,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(c))}catch(u){this.reject(u)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return fI;case"linkViaPopup":case"linkViaRedirect":return mI;case"reauthViaPopup":case"reauthViaRedirect":return pI;default:en(this.auth,"internal-error")}}resolve(e){In(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){In(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gI=new fo(2e3,1e4);async function _I(n,e,t){if(wt(n.app))return Promise.reject(jt(n,"operation-not-supported-in-this-environment"));const i=qr(n);sg(n,e,ll);const r=Wu(i,t);return new wi(i,"signInViaPopup",e,r).executeNotNull()}class wi extends Ng{constructor(e,t,i,r,s){super(e,t,r,s),this.provider=i,this.authWindow=null,this.pollId=null,wi.currentPopupAction&&wi.currentPopupAction.cancel(),wi.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return G(e,this.auth,"internal-error"),e}async onExecution(){In(this.filter.length===1,"Popup operations only handle one event");const e=qu();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(jt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(jt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,wi.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,i;if(!((i=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||i===void 0)&&i.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(jt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,gI.get())};e()}}wi.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yI="pendingRedirect",la=new Map;class vI extends Ng{constructor(e,t,i=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,i),this.eventId=null}async execute(){let e=la.get(this.auth._key());if(!e){try{const i=await EI(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(i)}catch(t){e=()=>Promise.reject(t)}la.set(this.auth._key(),e)}return this.bypassAuthState||la.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function EI(n,e){const t=Og(e),i=Dg(n);if(!await i._isAvailable())return!1;const r=await i._get(t)==="true";return await i._remove(t),r}async function TI(n,e){return Dg(n)._set(Og(e),"true")}function wI(n,e){la.set(n._key(),e)}function Dg(n){return mn(n._redirectPersistence)}function Og(n){return aa(yI,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function II(n,e,t){return AI(n,e,t)}async function AI(n,e,t){if(wt(n.app))return Promise.reject(zn(n));const i=qr(n);sg(n,e,ll),await i._initializationPromise;const r=Wu(i,t);return await TI(r,i),r._openRedirect(i,e,"signInViaRedirect")}async function CI(n,e){return await qr(n)._initializationPromise,xg(n,e,!1)}async function xg(n,e,t=!1){if(wt(n.app))return Promise.reject(zn(n));const i=qr(n),r=Wu(i,e),o=await new vI(i,r,t).execute();return o&&!t&&(delete o.user._redirectEventId,await i._persistUserIfCurrent(o.user),await i._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SI=600*1e3;class RI{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(i=>{this.isEventForConsumer(e,i)&&(t=!0,this.sendToConsumer(e,i),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!bI(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var i;if(e.error&&!Lg(e)){const r=((i=e.error.code)===null||i===void 0?void 0:i.split("auth/")[1])||"internal-error";t.onError(jt(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const i=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&i}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=SI&&this.cachedEventUids.clear(),this.cachedEventUids.has(bf(e))}saveEventToCache(e){this.cachedEventUids.add(bf(e)),this.lastProcessedEventTime=Date.now()}}function bf(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Lg({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function bI(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Lg(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PI(n,e={}){return zr(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kI=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,NI=/^https?/;async function DI(n){if(n.config.emulator)return;const{authorizedDomains:e}=await PI(n);for(const t of e)try{if(OI(t))return}catch{}en(n,"unauthorized-domain")}function OI(n){const e=Lc(),{protocol:t,hostname:i}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&i===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===i}if(!NI.test(t))return!1;if(kI.test(n))return i===n;const r=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+r+"|"+r+")$","i").test(i)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xI=new fo(3e4,6e4);function Pf(){const n=Qt().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function LI(n){return new Promise((e,t)=>{var i,r,s;function o(){Pf(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Pf(),t(jt(n,"network-request-failed"))},timeout:xI.get()})}if(!((r=(i=Qt().gapi)===null||i===void 0?void 0:i.iframes)===null||r===void 0)&&r.Iframe)e(gapi.iframes.getContext());else if(!((s=Qt().gapi)===null||s===void 0)&&s.load)o();else{const l=Fw("iframefcb");return Qt()[l]=()=>{gapi.load?o():t(jt(n,"network-request-failed"))},Vw(`${Mw()}?onload=${l}`).catch(c=>t(c))}}).catch(e=>{throw ca=null,e})}let ca=null;function VI(n){return ca=ca||LI(n),ca}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MI=new fo(5e3,15e3),FI="__/auth/iframe",UI="emulator/auth/iframe",BI={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},jI=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function zI(n){const e=n.config;G(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Fu(e,UI):`https://${n.config.authDomain}/${FI}`,i={apiKey:e.apiKey,appName:n.name,v:Ui},r=jI.get(n.config.apiHost);r&&(i.eid=r);const s=n._getFrameworks();return s.length&&(i.fw=s.join(",")),`${t}?${jr(i).slice(1)}`}async function qI(n){const e=await VI(n),t=Qt().gapi;return G(t,n,"internal-error"),e.open({where:document.body,url:zI(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:BI,dontclear:!0},i=>new Promise(async(r,s)=>{await i.restyle({setHideOnLeave:!1});const o=jt(n,"network-request-failed"),l=Qt().setTimeout(()=>{s(o)},MI.get());function c(){Qt().clearTimeout(l),r(i)}i.ping(c).then(c,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const WI={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},$I=500,HI=600,GI="_blank",KI="http://localhost";class kf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function QI(n,e,t,i=$I,r=HI){const s=Math.max((window.screen.availHeight-r)/2,0).toString(),o=Math.max((window.screen.availWidth-i)/2,0).toString();let l="";const c=Object.assign(Object.assign({},WI),{width:i.toString(),height:r.toString(),top:s,left:o}),u=it().toLowerCase();t&&(l=fg(u)?GI:t),hg(u)&&(e=e||KI,c.scrollbars="yes");const f=Object.entries(c).reduce((m,[v,I])=>`${m}${v}=${I},`,"");if(bw(u)&&l!=="_self")return YI(e||"",l),new kf(null);const p=window.open(e||"",l,f);G(p,n,"popup-blocked");try{p.focus()}catch{}return new kf(p)}function YI(n,e){const t=document.createElement("a");t.href=n,t.target=e;const i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XI="__/auth/handler",JI="emulator/auth/handler",ZI=encodeURIComponent("fac");async function Nf(n,e,t,i,r,s){G(n.config.authDomain,n,"auth-domain-config-required"),G(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:i,v:Ui,eventId:r};if(e instanceof ll){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Pc(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))o[f]=p}if(e instanceof po){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}n.tenantId&&(o.tid=n.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const c=await n._getAppCheckToken(),u=c?`#${ZI}=${encodeURIComponent(c)}`:"";return`${eA(n)}?${jr(l).slice(1)}${u}`}function eA({config:n}){return n.emulator?Fu(n,JI):`https://${n.authDomain}/${XI}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hc="webStorageSupport";class tA{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Sg,this._completeRedirectFn=xg,this._overrideRedirectResult=wI}async _openPopup(e,t,i,r){var s;In((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await Nf(e,t,i,Lc(),r);return QI(e,o,qu())}async _openRedirect(e,t,i,r){await this._originValidation(e);const s=await Nf(e,t,i,Lc(),r);return iI(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:r,promise:s}=this.eventManagers[t];return r?Promise.resolve(r):(In(s,"If manager is not set, promise should be"),s)}const i=this.initAndGetManager(e);return this.eventManagers[t]={promise:i},i.catch(()=>{delete this.eventManagers[t]}),i}async initAndGetManager(e){const t=await qI(e),i=new RI(e);return t.register("authEvent",r=>(G(r==null?void 0:r.authEvent,e,"invalid-auth-event"),{status:i.onEvent(r.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:i},this.iframes[e._key()]=t,i}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(hc,{type:hc},r=>{var s;const o=(s=r==null?void 0:r[0])===null||s===void 0?void 0:s[hc];o!==void 0&&t(!!o),en(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=DI(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return yg()||dg()||ju()}}const nA=tA;var Df="@firebase/auth",Of="1.10.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(i=>{e((i==null?void 0:i.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){G(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rA(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function sA(n){Ri(new Kn("auth",(e,{options:t})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=i.options;G(o&&!o.includes(":"),"invalid-api-key",{appName:i.name});const c={apiKey:o,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:vg(n)},u=new xw(i,r,s,c);return Bw(u,t),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,i)=>{e.getProvider("auth-internal").initialize()})),Ri(new Kn("auth-internal",e=>{const t=qr(e.getProvider("auth").getImmediate());return(i=>new iA(i))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Kt(Df,Of,rA(n)),Kt(Df,Of,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oA=300,aA=Km("authIdTokenMaxAge")||oA;let xf=null;const lA=n=>async e=>{const t=e&&await e.getIdTokenResult(),i=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(i&&i>aA)return;const r=t==null?void 0:t.token;xf!==r&&(xf=r,await fetch(n,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))};function cA(n=xu()){const e=al(n,"auth");if(e.isInitialized())return e.getImmediate();const t=Uw(n,{popupRedirectResolver:nA,persistence:[dI,eI,Sg]}),i=Km("authTokenSyncURL");if(i&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(i,location.origin);if(location.origin===s.origin){const o=lA(s.toString());Qw(t,o,()=>o(t.currentUser)),Kw(t,l=>o(l))}}const r=$m("auth");return r&&jw(t,`http://${r}`),t}function uA(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Lw({loadJS(n){return new Promise((e,t)=>{const i=document.createElement("script");i.setAttribute("src",n),i.onload=e,i.onerror=r=>{const s=jt("internal-error");s.customData=r,t(s)},i.type="text/javascript",i.charset="UTF-8",uA().appendChild(i)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});sA("Browser");var Lf=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var qn,Vg;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,_){function E(){}E.prototype=_.prototype,A.D=_.prototype,A.prototype=new E,A.prototype.constructor=A,A.C=function(T,w,C){for(var y=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)y[Y-2]=arguments[Y];return _.prototype[w].apply(T,y)}}function t(){this.blockSize=-1}function i(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(i,t),i.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function r(A,_,E){E||(E=0);var T=Array(16);if(typeof _=="string")for(var w=0;16>w;++w)T[w]=_.charCodeAt(E++)|_.charCodeAt(E++)<<8|_.charCodeAt(E++)<<16|_.charCodeAt(E++)<<24;else for(w=0;16>w;++w)T[w]=_[E++]|_[E++]<<8|_[E++]<<16|_[E++]<<24;_=A.g[0],E=A.g[1],w=A.g[2];var C=A.g[3],y=_+(C^E&(w^C))+T[0]+3614090360&4294967295;_=E+(y<<7&4294967295|y>>>25),y=C+(w^_&(E^w))+T[1]+3905402710&4294967295,C=_+(y<<12&4294967295|y>>>20),y=w+(E^C&(_^E))+T[2]+606105819&4294967295,w=C+(y<<17&4294967295|y>>>15),y=E+(_^w&(C^_))+T[3]+3250441966&4294967295,E=w+(y<<22&4294967295|y>>>10),y=_+(C^E&(w^C))+T[4]+4118548399&4294967295,_=E+(y<<7&4294967295|y>>>25),y=C+(w^_&(E^w))+T[5]+1200080426&4294967295,C=_+(y<<12&4294967295|y>>>20),y=w+(E^C&(_^E))+T[6]+2821735955&4294967295,w=C+(y<<17&4294967295|y>>>15),y=E+(_^w&(C^_))+T[7]+4249261313&4294967295,E=w+(y<<22&4294967295|y>>>10),y=_+(C^E&(w^C))+T[8]+1770035416&4294967295,_=E+(y<<7&4294967295|y>>>25),y=C+(w^_&(E^w))+T[9]+2336552879&4294967295,C=_+(y<<12&4294967295|y>>>20),y=w+(E^C&(_^E))+T[10]+4294925233&4294967295,w=C+(y<<17&4294967295|y>>>15),y=E+(_^w&(C^_))+T[11]+2304563134&4294967295,E=w+(y<<22&4294967295|y>>>10),y=_+(C^E&(w^C))+T[12]+1804603682&4294967295,_=E+(y<<7&4294967295|y>>>25),y=C+(w^_&(E^w))+T[13]+4254626195&4294967295,C=_+(y<<12&4294967295|y>>>20),y=w+(E^C&(_^E))+T[14]+2792965006&4294967295,w=C+(y<<17&4294967295|y>>>15),y=E+(_^w&(C^_))+T[15]+1236535329&4294967295,E=w+(y<<22&4294967295|y>>>10),y=_+(w^C&(E^w))+T[1]+4129170786&4294967295,_=E+(y<<5&4294967295|y>>>27),y=C+(E^w&(_^E))+T[6]+3225465664&4294967295,C=_+(y<<9&4294967295|y>>>23),y=w+(_^E&(C^_))+T[11]+643717713&4294967295,w=C+(y<<14&4294967295|y>>>18),y=E+(C^_&(w^C))+T[0]+3921069994&4294967295,E=w+(y<<20&4294967295|y>>>12),y=_+(w^C&(E^w))+T[5]+3593408605&4294967295,_=E+(y<<5&4294967295|y>>>27),y=C+(E^w&(_^E))+T[10]+38016083&4294967295,C=_+(y<<9&4294967295|y>>>23),y=w+(_^E&(C^_))+T[15]+3634488961&4294967295,w=C+(y<<14&4294967295|y>>>18),y=E+(C^_&(w^C))+T[4]+3889429448&4294967295,E=w+(y<<20&4294967295|y>>>12),y=_+(w^C&(E^w))+T[9]+568446438&4294967295,_=E+(y<<5&4294967295|y>>>27),y=C+(E^w&(_^E))+T[14]+3275163606&4294967295,C=_+(y<<9&4294967295|y>>>23),y=w+(_^E&(C^_))+T[3]+4107603335&4294967295,w=C+(y<<14&4294967295|y>>>18),y=E+(C^_&(w^C))+T[8]+1163531501&4294967295,E=w+(y<<20&4294967295|y>>>12),y=_+(w^C&(E^w))+T[13]+2850285829&4294967295,_=E+(y<<5&4294967295|y>>>27),y=C+(E^w&(_^E))+T[2]+4243563512&4294967295,C=_+(y<<9&4294967295|y>>>23),y=w+(_^E&(C^_))+T[7]+1735328473&4294967295,w=C+(y<<14&4294967295|y>>>18),y=E+(C^_&(w^C))+T[12]+2368359562&4294967295,E=w+(y<<20&4294967295|y>>>12),y=_+(E^w^C)+T[5]+4294588738&4294967295,_=E+(y<<4&4294967295|y>>>28),y=C+(_^E^w)+T[8]+2272392833&4294967295,C=_+(y<<11&4294967295|y>>>21),y=w+(C^_^E)+T[11]+1839030562&4294967295,w=C+(y<<16&4294967295|y>>>16),y=E+(w^C^_)+T[14]+4259657740&4294967295,E=w+(y<<23&4294967295|y>>>9),y=_+(E^w^C)+T[1]+2763975236&4294967295,_=E+(y<<4&4294967295|y>>>28),y=C+(_^E^w)+T[4]+1272893353&4294967295,C=_+(y<<11&4294967295|y>>>21),y=w+(C^_^E)+T[7]+4139469664&4294967295,w=C+(y<<16&4294967295|y>>>16),y=E+(w^C^_)+T[10]+3200236656&4294967295,E=w+(y<<23&4294967295|y>>>9),y=_+(E^w^C)+T[13]+681279174&4294967295,_=E+(y<<4&4294967295|y>>>28),y=C+(_^E^w)+T[0]+3936430074&4294967295,C=_+(y<<11&4294967295|y>>>21),y=w+(C^_^E)+T[3]+3572445317&4294967295,w=C+(y<<16&4294967295|y>>>16),y=E+(w^C^_)+T[6]+76029189&4294967295,E=w+(y<<23&4294967295|y>>>9),y=_+(E^w^C)+T[9]+3654602809&4294967295,_=E+(y<<4&4294967295|y>>>28),y=C+(_^E^w)+T[12]+3873151461&4294967295,C=_+(y<<11&4294967295|y>>>21),y=w+(C^_^E)+T[15]+530742520&4294967295,w=C+(y<<16&4294967295|y>>>16),y=E+(w^C^_)+T[2]+3299628645&4294967295,E=w+(y<<23&4294967295|y>>>9),y=_+(w^(E|~C))+T[0]+4096336452&4294967295,_=E+(y<<6&4294967295|y>>>26),y=C+(E^(_|~w))+T[7]+1126891415&4294967295,C=_+(y<<10&4294967295|y>>>22),y=w+(_^(C|~E))+T[14]+2878612391&4294967295,w=C+(y<<15&4294967295|y>>>17),y=E+(C^(w|~_))+T[5]+4237533241&4294967295,E=w+(y<<21&4294967295|y>>>11),y=_+(w^(E|~C))+T[12]+1700485571&4294967295,_=E+(y<<6&4294967295|y>>>26),y=C+(E^(_|~w))+T[3]+2399980690&4294967295,C=_+(y<<10&4294967295|y>>>22),y=w+(_^(C|~E))+T[10]+4293915773&4294967295,w=C+(y<<15&4294967295|y>>>17),y=E+(C^(w|~_))+T[1]+2240044497&4294967295,E=w+(y<<21&4294967295|y>>>11),y=_+(w^(E|~C))+T[8]+1873313359&4294967295,_=E+(y<<6&4294967295|y>>>26),y=C+(E^(_|~w))+T[15]+4264355552&4294967295,C=_+(y<<10&4294967295|y>>>22),y=w+(_^(C|~E))+T[6]+2734768916&4294967295,w=C+(y<<15&4294967295|y>>>17),y=E+(C^(w|~_))+T[13]+1309151649&4294967295,E=w+(y<<21&4294967295|y>>>11),y=_+(w^(E|~C))+T[4]+4149444226&4294967295,_=E+(y<<6&4294967295|y>>>26),y=C+(E^(_|~w))+T[11]+3174756917&4294967295,C=_+(y<<10&4294967295|y>>>22),y=w+(_^(C|~E))+T[2]+718787259&4294967295,w=C+(y<<15&4294967295|y>>>17),y=E+(C^(w|~_))+T[9]+3951481745&4294967295,A.g[0]=A.g[0]+_&4294967295,A.g[1]=A.g[1]+(w+(y<<21&4294967295|y>>>11))&4294967295,A.g[2]=A.g[2]+w&4294967295,A.g[3]=A.g[3]+C&4294967295}i.prototype.u=function(A,_){_===void 0&&(_=A.length);for(var E=_-this.blockSize,T=this.B,w=this.h,C=0;C<_;){if(w==0)for(;C<=E;)r(this,A,C),C+=this.blockSize;if(typeof A=="string"){for(;C<_;)if(T[w++]=A.charCodeAt(C++),w==this.blockSize){r(this,T),w=0;break}}else for(;C<_;)if(T[w++]=A[C++],w==this.blockSize){r(this,T),w=0;break}}this.h=w,this.o+=_},i.prototype.v=function(){var A=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);A[0]=128;for(var _=1;_<A.length-8;++_)A[_]=0;var E=8*this.o;for(_=A.length-8;_<A.length;++_)A[_]=E&255,E/=256;for(this.u(A),A=Array(16),_=E=0;4>_;++_)for(var T=0;32>T;T+=8)A[E++]=this.g[_]>>>T&255;return A};function s(A,_){var E=l;return Object.prototype.hasOwnProperty.call(E,A)?E[A]:E[A]=_(A)}function o(A,_){this.h=_;for(var E=[],T=!0,w=A.length-1;0<=w;w--){var C=A[w]|0;T&&C==_||(E[w]=C,T=!1)}this.g=E}var l={};function c(A){return-128<=A&&128>A?s(A,function(_){return new o([_|0],0>_?-1:0)}):new o([A|0],0>A?-1:0)}function u(A){if(isNaN(A)||!isFinite(A))return p;if(0>A)return N(u(-A));for(var _=[],E=1,T=0;A>=E;T++)_[T]=A/E|0,E*=4294967296;return new o(_,0)}function f(A,_){if(A.length==0)throw Error("number format error: empty string");if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(A.charAt(0)=="-")return N(f(A.substring(1),_));if(0<=A.indexOf("-"))throw Error('number format error: interior "-" character');for(var E=u(Math.pow(_,8)),T=p,w=0;w<A.length;w+=8){var C=Math.min(8,A.length-w),y=parseInt(A.substring(w,w+C),_);8>C?(C=u(Math.pow(_,C)),T=T.j(C).add(u(y))):(T=T.j(E),T=T.add(u(y)))}return T}var p=c(0),m=c(1),v=c(16777216);n=o.prototype,n.m=function(){if(k(this))return-N(this).m();for(var A=0,_=1,E=0;E<this.g.length;E++){var T=this.i(E);A+=(0<=T?T:4294967296+T)*_,_*=4294967296}return A},n.toString=function(A){if(A=A||10,2>A||36<A)throw Error("radix out of range: "+A);if(I(this))return"0";if(k(this))return"-"+N(this).toString(A);for(var _=u(Math.pow(A,6)),E=this,T="";;){var w=te(E,_).g;E=x(E,w.j(_));var C=((0<E.g.length?E.g[0]:E.h)>>>0).toString(A);if(E=w,I(E))return C+T;for(;6>C.length;)C="0"+C;T=C+T}},n.i=function(A){return 0>A?0:A<this.g.length?this.g[A]:this.h};function I(A){if(A.h!=0)return!1;for(var _=0;_<A.g.length;_++)if(A.g[_]!=0)return!1;return!0}function k(A){return A.h==-1}n.l=function(A){return A=x(this,A),k(A)?-1:I(A)?0:1};function N(A){for(var _=A.g.length,E=[],T=0;T<_;T++)E[T]=~A.g[T];return new o(E,~A.h).add(m)}n.abs=function(){return k(this)?N(this):this},n.add=function(A){for(var _=Math.max(this.g.length,A.g.length),E=[],T=0,w=0;w<=_;w++){var C=T+(this.i(w)&65535)+(A.i(w)&65535),y=(C>>>16)+(this.i(w)>>>16)+(A.i(w)>>>16);T=y>>>16,C&=65535,y&=65535,E[w]=y<<16|C}return new o(E,E[E.length-1]&-2147483648?-1:0)};function x(A,_){return A.add(N(_))}n.j=function(A){if(I(this)||I(A))return p;if(k(this))return k(A)?N(this).j(N(A)):N(N(this).j(A));if(k(A))return N(this.j(N(A)));if(0>this.l(v)&&0>A.l(v))return u(this.m()*A.m());for(var _=this.g.length+A.g.length,E=[],T=0;T<2*_;T++)E[T]=0;for(T=0;T<this.g.length;T++)for(var w=0;w<A.g.length;w++){var C=this.i(T)>>>16,y=this.i(T)&65535,Y=A.i(w)>>>16,ke=A.i(w)&65535;E[2*T+2*w]+=y*ke,j(E,2*T+2*w),E[2*T+2*w+1]+=C*ke,j(E,2*T+2*w+1),E[2*T+2*w+1]+=y*Y,j(E,2*T+2*w+1),E[2*T+2*w+2]+=C*Y,j(E,2*T+2*w+2)}for(T=0;T<_;T++)E[T]=E[2*T+1]<<16|E[2*T];for(T=_;T<2*_;T++)E[T]=0;return new o(E,0)};function j(A,_){for(;(A[_]&65535)!=A[_];)A[_+1]+=A[_]>>>16,A[_]&=65535,_++}function B(A,_){this.g=A,this.h=_}function te(A,_){if(I(_))throw Error("division by zero");if(I(A))return new B(p,p);if(k(A))return _=te(N(A),_),new B(N(_.g),N(_.h));if(k(_))return _=te(A,N(_)),new B(N(_.g),_.h);if(30<A.g.length){if(k(A)||k(_))throw Error("slowDivide_ only works with positive integers.");for(var E=m,T=_;0>=T.l(A);)E=q(E),T=q(T);var w=ce(E,1),C=ce(T,1);for(T=ce(T,2),E=ce(E,2);!I(T);){var y=C.add(T);0>=y.l(A)&&(w=w.add(E),C=y),T=ce(T,1),E=ce(E,1)}return _=x(A,w.j(_)),new B(w,_)}for(w=p;0<=A.l(_);){for(E=Math.max(1,Math.floor(A.m()/_.m())),T=Math.ceil(Math.log(E)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),C=u(E),y=C.j(_);k(y)||0<y.l(A);)E-=T,C=u(E),y=C.j(_);I(C)&&(C=m),w=w.add(C),A=x(A,y)}return new B(w,A)}n.A=function(A){return te(this,A).h},n.and=function(A){for(var _=Math.max(this.g.length,A.g.length),E=[],T=0;T<_;T++)E[T]=this.i(T)&A.i(T);return new o(E,this.h&A.h)},n.or=function(A){for(var _=Math.max(this.g.length,A.g.length),E=[],T=0;T<_;T++)E[T]=this.i(T)|A.i(T);return new o(E,this.h|A.h)},n.xor=function(A){for(var _=Math.max(this.g.length,A.g.length),E=[],T=0;T<_;T++)E[T]=this.i(T)^A.i(T);return new o(E,this.h^A.h)};function q(A){for(var _=A.g.length+1,E=[],T=0;T<_;T++)E[T]=A.i(T)<<1|A.i(T-1)>>>31;return new o(E,A.h)}function ce(A,_){var E=_>>5;_%=32;for(var T=A.g.length-E,w=[],C=0;C<T;C++)w[C]=0<_?A.i(C+E)>>>_|A.i(C+E+1)<<32-_:A.i(C+E);return new o(w,A.h)}i.prototype.digest=i.prototype.v,i.prototype.reset=i.prototype.s,i.prototype.update=i.prototype.u,Vg=i,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=u,o.fromString=f,qn=o}).apply(typeof Lf<"u"?Lf:typeof self<"u"?self:typeof window<"u"?window:{});var Xo=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Mg,Ss,Fg,ua,Fc,Ug,Bg,jg;(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,h,d){return a==Array.prototype||a==Object.prototype||(a[h]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xo=="object"&&Xo];for(var h=0;h<a.length;++h){var d=a[h];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var i=t(this);function r(a,h){if(h)e:{var d=i;a=a.split(".");for(var g=0;g<a.length-1;g++){var S=a[g];if(!(S in d))break e;d=d[S]}a=a[a.length-1],g=d[a],h=h(g),h!=g&&h!=null&&e(d,a,{configurable:!0,writable:!0,value:h})}}function s(a,h){a instanceof String&&(a+="");var d=0,g=!1,S={next:function(){if(!g&&d<a.length){var b=d++;return{value:h(b,a[b]),done:!1}}return g=!0,{done:!0,value:void 0}}};return S[Symbol.iterator]=function(){return S},S}r("Array.prototype.values",function(a){return a||function(){return s(this,function(h,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},l=this||self;function c(a){var h=typeof a;return h=h!="object"?h:a?Array.isArray(a)?"array":h:"null",h=="array"||h=="object"&&typeof a.length=="number"}function u(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function f(a,h,d){return a.call.apply(a.bind,arguments)}function p(a,h,d){if(!a)throw Error();if(2<arguments.length){var g=Array.prototype.slice.call(arguments,2);return function(){var S=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(S,g),a.apply(h,S)}}return function(){return a.apply(h,arguments)}}function m(a,h,d){return m=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,m.apply(null,arguments)}function v(a,h){var d=Array.prototype.slice.call(arguments,1);return function(){var g=d.slice();return g.push.apply(g,arguments),a.apply(this,g)}}function I(a,h){function d(){}d.prototype=h.prototype,a.aa=h.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(g,S,b){for(var U=Array(arguments.length-2),me=2;me<arguments.length;me++)U[me-2]=arguments[me];return h.prototype[S].apply(g,U)}}function k(a){const h=a.length;if(0<h){const d=Array(h);for(let g=0;g<h;g++)d[g]=a[g];return d}return[]}function N(a,h){for(let d=1;d<arguments.length;d++){const g=arguments[d];if(c(g)){const S=a.length||0,b=g.length||0;a.length=S+b;for(let U=0;U<b;U++)a[S+U]=g[U]}else a.push(g)}}class x{constructor(h,d){this.i=h,this.j=d,this.h=0,this.g=null}get(){let h;return 0<this.h?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function j(a){return/^[\s\xa0]*$/.test(a)}function B(){var a=l.navigator;return a&&(a=a.userAgent)?a:""}function te(a){return te[" "](a),a}te[" "]=function(){};var q=B().indexOf("Gecko")!=-1&&!(B().toLowerCase().indexOf("webkit")!=-1&&B().indexOf("Edge")==-1)&&!(B().indexOf("Trident")!=-1||B().indexOf("MSIE")!=-1)&&B().indexOf("Edge")==-1;function ce(a,h,d){for(const g in a)h.call(d,a[g],g,a)}function A(a,h){for(const d in a)h.call(void 0,a[d],d,a)}function _(a){const h={};for(const d in a)h[d]=a[d];return h}const E="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(a,h){let d,g;for(let S=1;S<arguments.length;S++){g=arguments[S];for(d in g)a[d]=g[d];for(let b=0;b<E.length;b++)d=E[b],Object.prototype.hasOwnProperty.call(g,d)&&(a[d]=g[d])}}function w(a){var h=1;a=a.split(":");const d=[];for(;0<h&&a.length;)d.push(a.shift()),h--;return a.length&&d.push(a.join(":")),d}function C(a){l.setTimeout(()=>{throw a},0)}function y(){var a=Ct;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class Y{constructor(){this.h=this.g=null}add(h,d){const g=ke.get();g.set(h,d),this.h?this.h.next=g:this.g=g,this.h=g}}var ke=new x(()=>new Hi,a=>a.reset());class Hi{constructor(){this.next=this.g=this.h=null}set(h,d){this.h=h,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Nt,rt=!1,Ct=new Y,Gi=()=>{const a=l.Promise.resolve(void 0);Nt=()=>{a.then(No)}};var No=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){C(d)}var h=ke;h.j(a),100>h.h&&(h.h++,a.next=h.g,h.g=a)}rt=!1};function gt(){this.s=this.s,this.C=this.C}gt.prototype.s=!1,gt.prototype.ma=function(){this.s||(this.s=!0,this.N())},gt.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function Me(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}Me.prototype.h=function(){this.defaultPrevented=!0};var sn=(function(){if(!l.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};l.addEventListener("test",d,h),l.removeEventListener("test",d,h)}catch{}return a})();function kn(a,h){if(Me.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,g=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget){if(q){e:{try{te(h.nodeName);var S=!0;break e}catch{}S=!1}S||(h=null)}}else d=="mouseover"?h=a.fromElement:d=="mouseout"&&(h=a.toElement);this.relatedTarget=h,g?(this.clientX=g.clientX!==void 0?g.clientX:g.pageX,this.clientY=g.clientY!==void 0?g.clientY:g.pageY,this.screenX=g.screenX||0,this.screenY=g.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:ql[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&kn.aa.h.call(this)}}I(kn,Me);var ql={2:"touch",3:"pen",4:"mouse"};kn.prototype.h=function(){kn.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var hi="closure_listenable_"+(1e6*Math.random()|0),Wl=0;function Wt(a,h,d,g,S){this.listener=a,this.proxy=null,this.src=h,this.type=d,this.capture=!!g,this.ha=S,this.key=++Wl,this.da=this.fa=!1}function Ki(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function Qi(a){this.src=a,this.g={},this.h=0}Qi.prototype.add=function(a,h,d,g,S){var b=a.toString();a=this.g[b],a||(a=this.g[b]=[],this.h++);var U=ts(a,h,g,S);return-1<U?(h=a[U],d||(h.fa=!1)):(h=new Wt(h,this.src,b,!!g,S),h.fa=d,a.push(h)),h};function es(a,h){var d=h.type;if(d in a.g){var g=a.g[d],S=Array.prototype.indexOf.call(g,h,void 0),b;(b=0<=S)&&Array.prototype.splice.call(g,S,1),b&&(Ki(h),a.g[d].length==0&&(delete a.g[d],a.h--))}}function ts(a,h,d,g){for(var S=0;S<a.length;++S){var b=a[S];if(!b.da&&b.listener==h&&b.capture==!!d&&b.ha==g)return S}return-1}var Yi="closure_lm_"+(1e6*Math.random()|0),on={};function _t(a,h,d,g,S){if(Array.isArray(h)){for(var b=0;b<h.length;b++)_t(a,h[b],d,g,S);return null}return d=is(d),a&&a[hi]?a.K(h,d,u(g)?!!g.capture:!1,S):$l(a,h,d,!1,g,S)}function $l(a,h,d,g,S,b){if(!h)throw Error("Invalid event type");var U=u(S)?!!S.capture:!!S,me=Xi(a);if(me||(a[Yi]=me=new Qi(a)),d=me.add(h,d,g,U,b),d.proxy)return d;if(g=Hl(),d.proxy=g,g.src=a,g.listener=d,a.addEventListener)sn||(S=U),S===void 0&&(S=!1),a.addEventListener(h.toString(),g,S);else if(a.attachEvent)a.attachEvent(Dt(h.toString()),g);else if(a.addListener&&a.removeListener)a.addListener(g);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Hl(){function a(d){return h.call(a.src,a.listener,d)}const h=an;return a}function yt(a,h,d,g,S){if(Array.isArray(h))for(var b=0;b<h.length;b++)yt(a,h[b],d,g,S);else g=u(g)?!!g.capture:!!g,d=is(d),a&&a[hi]?(a=a.i,h=String(h).toString(),h in a.g&&(b=a.g[h],d=ts(b,d,g,S),-1<d&&(Ki(b[d]),Array.prototype.splice.call(b,d,1),b.length==0&&(delete a.g[h],a.h--)))):a&&(a=Xi(a))&&(h=a.g[h.toString()],a=-1,h&&(a=ts(h,d,g,S)),(d=-1<a?h[a]:null)&&ns(d))}function ns(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[hi])es(h.i,a);else{var d=a.type,g=a.proxy;h.removeEventListener?h.removeEventListener(d,g,a.capture):h.detachEvent?h.detachEvent(Dt(d),g):h.addListener&&h.removeListener&&h.removeListener(g),(d=Xi(h))?(es(d,a),d.h==0&&(d.src=null,h[Yi]=null)):Ki(a)}}}function Dt(a){return a in on?on[a]:on[a]="on"+a}function an(a,h){if(a.da)a=!0;else{h=new kn(h,this);var d=a.listener,g=a.ha||a.src;a.fa&&ns(a),a=d.call(g,h)}return a}function Xi(a){return a=a[Yi],a instanceof Qi?a:null}var di="__closure_events_fn_"+(1e9*Math.random()>>>0);function is(a){return typeof a=="function"?a:(a[di]||(a[di]=function(h){return a.handleEvent(h)}),a[di])}function Fe(){gt.call(this),this.i=new Qi(this),this.M=this,this.F=null}I(Fe,gt),Fe.prototype[hi]=!0,Fe.prototype.removeEventListener=function(a,h,d,g){yt(this,a,h,d,g)};function $e(a,h){var d,g=a.F;if(g)for(d=[];g;g=g.F)d.push(g);if(a=a.M,g=h.type||h,typeof h=="string")h=new Me(h,a);else if(h instanceof Me)h.target=h.target||a;else{var S=h;h=new Me(g,a),T(h,S)}if(S=!0,d)for(var b=d.length-1;0<=b;b--){var U=h.g=d[b];S=Ji(U,g,!0,h)&&S}if(U=h.g=a,S=Ji(U,g,!0,h)&&S,S=Ji(U,g,!1,h)&&S,d)for(b=0;b<d.length;b++)U=h.g=d[b],S=Ji(U,g,!1,h)&&S}Fe.prototype.N=function(){if(Fe.aa.N.call(this),this.i){var a=this.i,h;for(h in a.g){for(var d=a.g[h],g=0;g<d.length;g++)Ki(d[g]);delete a.g[h],a.h--}}this.F=null},Fe.prototype.K=function(a,h,d,g){return this.i.add(String(a),h,!1,d,g)},Fe.prototype.L=function(a,h,d,g){return this.i.add(String(a),h,!0,d,g)};function Ji(a,h,d,g){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();for(var S=!0,b=0;b<h.length;++b){var U=h[b];if(U&&!U.da&&U.capture==d){var me=U.listener,He=U.ha||U.src;U.fa&&es(a.i,U),S=me.call(He,g)!==!1&&S}}return S&&!g.defaultPrevented}function Do(a,h,d){if(typeof a=="function")d&&(a=m(a,d));else if(a&&typeof a.handleEvent=="function")a=m(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(h)?-1:l.setTimeout(a,h||0)}function Oo(a){a.g=Do(()=>{a.g=null,a.i&&(a.i=!1,Oo(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class Zi extends gt{constructor(h,d){super(),this.m=h,this.l=d,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:Oo(this)}N(){super.N(),this.g&&(l.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function fi(a){gt.call(this),this.h=a,this.g={}}I(fi,gt);var er=[];function Ot(a){ce(a.g,function(h,d){this.g.hasOwnProperty(d)&&ns(h)},a),a.g={}}fi.prototype.N=function(){fi.aa.N.call(this),Ot(this)},fi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var pi=l.JSON.stringify,rs=l.JSON.parse,Gl=class{stringify(a){return l.JSON.stringify(a,void 0)}parse(a){return l.JSON.parse(a,void 0)}};function ss(){}ss.prototype.h=null;function xo(a){return a.h||(a.h=a.i())}function Lo(){}var mi={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function tr(){Me.call(this,"d")}I(tr,Me);function nr(){Me.call(this,"c")}I(nr,Me);var $t={},os=null;function gi(){return os=os||new Fe}$t.La="serverreachability";function R(a){Me.call(this,$t.La,a)}I(R,Me);function D(a){const h=gi();$e(h,new R(h))}$t.STAT_EVENT="statevent";function L(a,h){Me.call(this,$t.STAT_EVENT,a),this.stat=h}I(L,Me);function F(a){const h=gi();$e(h,new L(h,a))}$t.Ma="timingevent";function X(a,h){Me.call(this,$t.Ma,a),this.size=h}I(X,Me);function oe(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return l.setTimeout(function(){a()},h)}function le(){this.g=!0}le.prototype.xa=function(){this.g=!1};function Ne(a,h,d,g,S,b){a.info(function(){if(a.g)if(b)for(var U="",me=b.split("&"),He=0;He<me.length;He++){var ue=me[He].split("=");if(1<ue.length){var Je=ue[0];ue=ue[1];var Ze=Je.split("_");U=2<=Ze.length&&Ze[1]=="type"?U+(Je+"="+ue+"&"):U+(Je+"=redacted&")}}else U=null;else U=b;return"XMLHTTP REQ ("+g+") [attempt "+S+"]: "+h+`
`+d+`
`+U})}function Ce(a,h,d,g,S,b,U){a.info(function(){return"XMLHTTP RESP ("+g+") [ attempt "+S+"]: "+h+`
`+d+`
`+b+" "+U})}function _e(a,h,d,g){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+Be(a,d)+(g?" "+g:"")})}function ln(a,h){a.info(function(){return"TIMEOUT: "+h})}le.prototype.info=function(){};function Be(a,h){if(!a.g)return h;if(!h)return null;try{var d=JSON.parse(h);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var g=d[a];if(!(2>g.length)){var S=g[1];if(Array.isArray(S)&&!(1>S.length)){var b=S[0];if(b!="noop"&&b!="stop"&&b!="close")for(var U=1;U<S.length;U++)S[U]=""}}}}return pi(d)}catch{return h}}var cn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ir={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},xt;function Nn(){}I(Nn,ss),Nn.prototype.g=function(){return new XMLHttpRequest},Nn.prototype.i=function(){return{}},xt=new Nn;function St(a,h,d,g){this.j=a,this.i=h,this.l=d,this.R=g||1,this.U=new fi(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new as}function as(){this.i=null,this.g="",this.h=!1}var gd={},Kl={};function Ql(a,h,d){a.L=1,a.v=Uo(un(h)),a.m=d,a.P=!0,_d(a,null)}function _d(a,h){a.F=Date.now(),Vo(a),a.A=un(a.v);var d=a.A,g=a.R;Array.isArray(g)||(g=[String(g)]),Nd(d.i,"t",g),a.C=0,d=a.j.J,a.h=new as,a.g=Qd(a.j,d?h:null,!a.m),0<a.O&&(a.M=new Zi(m(a.Y,a,a.g),a.O)),h=a.U,d=a.g,g=a.ca;var S="readystatechange";Array.isArray(S)||(S&&(er[0]=S.toString()),S=er);for(var b=0;b<S.length;b++){var U=_t(d,S[b],g||h.handleEvent,!1,h.h||h);if(!U)break;h.g[U.key]=U}h=a.H?_(a.H):{},a.m?(a.u||(a.u="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,h)):(a.u="GET",a.g.ea(a.A,a.u,null,h)),D(),Ne(a.i,a.u,a.A,a.l,a.R,a.m)}St.prototype.ca=function(a){a=a.target;const h=this.M;h&&hn(a)==3?h.j():this.Y(a)},St.prototype.Y=function(a){try{if(a==this.g)e:{const Ze=hn(this.g);var h=this.g.Ba();const or=this.g.Z();if(!(3>Ze)&&(Ze!=3||this.g&&(this.h.h||this.g.oa()||Fd(this.g)))){this.J||Ze!=4||h==7||(h==8||0>=or?D(3):D(2)),Yl(this);var d=this.g.Z();this.X=d;t:if(yd(this)){var g=Fd(this.g);a="";var S=g.length,b=hn(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){_i(this),ls(this);var U="";break t}this.h.i=new l.TextDecoder}for(h=0;h<S;h++)this.h.h=!0,a+=this.h.i.decode(g[h],{stream:!(b&&h==S-1)});g.length=0,this.h.g+=a,this.C=0,U=this.h.g}else U=this.g.oa();if(this.o=d==200,Ce(this.i,this.u,this.A,this.l,this.R,Ze,d),this.o){if(this.T&&!this.K){t:{if(this.g){var me,He=this.g;if((me=He.g?He.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(me)){var ue=me;break t}}ue=null}if(d=ue)_e(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,Xl(this,d);else{this.o=!1,this.s=3,F(12),_i(this),ls(this);break e}}if(this.P){d=!0;let Lt;for(;!this.J&&this.C<U.length;)if(Lt=Qv(this,U),Lt==Kl){Ze==4&&(this.s=4,F(14),d=!1),_e(this.i,this.l,null,"[Incomplete Response]");break}else if(Lt==gd){this.s=4,F(15),_e(this.i,this.l,U,"[Invalid Chunk]"),d=!1;break}else _e(this.i,this.l,Lt,null),Xl(this,Lt);if(yd(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Ze!=4||U.length!=0||this.h.h||(this.s=1,F(16),d=!1),this.o=this.o&&d,!d)_e(this.i,this.l,U,"[Invalid Chunked Response]"),_i(this),ls(this);else if(0<U.length&&!this.W){this.W=!0;var Je=this.j;Je.g==this&&Je.ba&&!Je.M&&(Je.j.info("Great, no buffering proxy detected. Bytes received: "+U.length),ic(Je),Je.M=!0,F(11))}}else _e(this.i,this.l,U,null),Xl(this,U);Ze==4&&_i(this),this.o&&!this.J&&(Ze==4?$d(this.j,this):(this.o=!1,Vo(this)))}else dE(this.g),d==400&&0<U.indexOf("Unknown SID")?(this.s=3,F(12)):(this.s=0,F(13)),_i(this),ls(this)}}}catch{}finally{}};function yd(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Qv(a,h){var d=a.C,g=h.indexOf(`
`,d);return g==-1?Kl:(d=Number(h.substring(d,g)),isNaN(d)?gd:(g+=1,g+d>h.length?Kl:(h=h.slice(g,g+d),a.C=g+d,h)))}St.prototype.cancel=function(){this.J=!0,_i(this)};function Vo(a){a.S=Date.now()+a.I,vd(a,a.I)}function vd(a,h){if(a.B!=null)throw Error("WatchDog timer not null");a.B=oe(m(a.ba,a),h)}function Yl(a){a.B&&(l.clearTimeout(a.B),a.B=null)}St.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(ln(this.i,this.A),this.L!=2&&(D(),F(17)),_i(this),this.s=2,ls(this)):vd(this,this.S-a)};function ls(a){a.j.G==0||a.J||$d(a.j,a)}function _i(a){Yl(a);var h=a.M;h&&typeof h.ma=="function"&&h.ma(),a.M=null,Ot(a.U),a.g&&(h=a.g,a.g=null,h.abort(),h.ma())}function Xl(a,h){try{var d=a.j;if(d.G!=0&&(d.g==a||Jl(d.h,a))){if(!a.K&&Jl(d.h,a)&&d.G==3){try{var g=d.Da.g.parse(h)}catch{g=null}if(Array.isArray(g)&&g.length==3){var S=g;if(S[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)$o(d),qo(d);else break e;nc(d),F(18)}}else d.za=S[1],0<d.za-d.T&&37500>S[2]&&d.F&&d.v==0&&!d.C&&(d.C=oe(m(d.Za,d),6e3));if(1>=wd(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else vi(d,11)}else if((a.K||d.g==a)&&$o(d),!j(h))for(S=d.Da.g.parse(h),h=0;h<S.length;h++){let ue=S[h];if(d.T=ue[0],ue=ue[1],d.G==2)if(ue[0]=="c"){d.K=ue[1],d.ia=ue[2];const Je=ue[3];Je!=null&&(d.la=Je,d.j.info("VER="+d.la));const Ze=ue[4];Ze!=null&&(d.Aa=Ze,d.j.info("SVER="+d.Aa));const or=ue[5];or!=null&&typeof or=="number"&&0<or&&(g=1.5*or,d.L=g,d.j.info("backChannelRequestTimeoutMs_="+g)),g=d;const Lt=a.g;if(Lt){const Go=Lt.g?Lt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Go){var b=g.h;b.g||Go.indexOf("spdy")==-1&&Go.indexOf("quic")==-1&&Go.indexOf("h2")==-1||(b.j=b.l,b.g=new Set,b.h&&(Zl(b,b.h),b.h=null))}if(g.D){const rc=Lt.g?Lt.g.getResponseHeader("X-HTTP-Session-Id"):null;rc&&(g.ya=rc,Ee(g.I,g.D,rc))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),g=d;var U=a;if(g.qa=Kd(g,g.J?g.ia:null,g.W),U.K){Id(g.h,U);var me=U,He=g.L;He&&(me.I=He),me.B&&(Yl(me),Vo(me)),g.g=U}else qd(g);0<d.i.length&&Wo(d)}else ue[0]!="stop"&&ue[0]!="close"||vi(d,7);else d.G==3&&(ue[0]=="stop"||ue[0]=="close"?ue[0]=="stop"?vi(d,7):tc(d):ue[0]!="noop"&&d.l&&d.l.ta(ue),d.v=0)}}D(4)}catch{}}var Yv=class{constructor(a,h){this.g=a,this.map=h}};function Ed(a){this.l=a||10,l.PerformanceNavigationTiming?(a=l.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(l.chrome&&l.chrome.loadTimes&&l.chrome.loadTimes()&&l.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Td(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function wd(a){return a.h?1:a.g?a.g.size:0}function Jl(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function Zl(a,h){a.g?a.g.add(h):a.h=h}function Id(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}Ed.prototype.cancel=function(){if(this.i=Ad(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Ad(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const d of a.g.values())h=h.concat(d.D);return h}return k(a.i)}function Xv(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(c(a)){for(var h=[],d=a.length,g=0;g<d;g++)h.push(a[g]);return h}h=[],d=0;for(g in a)h[d++]=a[g];return h}function Jv(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(c(a)||typeof a=="string"){var h=[];a=a.length;for(var d=0;d<a;d++)h.push(d);return h}h=[],d=0;for(const g in a)h[d++]=g;return h}}}function Cd(a,h){if(a.forEach&&typeof a.forEach=="function")a.forEach(h,void 0);else if(c(a)||typeof a=="string")Array.prototype.forEach.call(a,h,void 0);else for(var d=Jv(a),g=Xv(a),S=g.length,b=0;b<S;b++)h.call(void 0,g[b],d&&d[b],a)}var Sd=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Zv(a,h){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var g=a[d].indexOf("="),S=null;if(0<=g){var b=a[d].substring(0,g);S=a[d].substring(g+1)}else b=a[d];h(b,S?decodeURIComponent(S.replace(/\+/g," ")):"")}}}function yi(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof yi){this.h=a.h,Mo(this,a.j),this.o=a.o,this.g=a.g,Fo(this,a.s),this.l=a.l;var h=a.i,d=new hs;d.i=h.i,h.g&&(d.g=new Map(h.g),d.h=h.h),Rd(this,d),this.m=a.m}else a&&(h=String(a).match(Sd))?(this.h=!1,Mo(this,h[1]||"",!0),this.o=cs(h[2]||""),this.g=cs(h[3]||"",!0),Fo(this,h[4]),this.l=cs(h[5]||"",!0),Rd(this,h[6]||"",!0),this.m=cs(h[7]||"")):(this.h=!1,this.i=new hs(null,this.h))}yi.prototype.toString=function(){var a=[],h=this.j;h&&a.push(us(h,bd,!0),":");var d=this.g;return(d||h=="file")&&(a.push("//"),(h=this.o)&&a.push(us(h,bd,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(us(d,d.charAt(0)=="/"?nE:tE,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",us(d,rE)),a.join("")};function un(a){return new yi(a)}function Mo(a,h,d){a.j=d?cs(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function Fo(a,h){if(h){if(h=Number(h),isNaN(h)||0>h)throw Error("Bad port number "+h);a.s=h}else a.s=null}function Rd(a,h,d){h instanceof hs?(a.i=h,sE(a.i,a.h)):(d||(h=us(h,iE)),a.i=new hs(h,a.h))}function Ee(a,h,d){a.i.set(h,d)}function Uo(a){return Ee(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function cs(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function us(a,h,d){return typeof a=="string"?(a=encodeURI(a).replace(h,eE),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function eE(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var bd=/[#\/\?@]/g,tE=/[#\?:]/g,nE=/[#\?]/g,iE=/[#\?@]/g,rE=/#/g;function hs(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function Dn(a){a.g||(a.g=new Map,a.h=0,a.i&&Zv(a.i,function(h,d){a.add(decodeURIComponent(h.replace(/\+/g," ")),d)}))}n=hs.prototype,n.add=function(a,h){Dn(this),this.i=null,a=rr(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(h),this.h+=1,this};function Pd(a,h){Dn(a),h=rr(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function kd(a,h){return Dn(a),h=rr(a,h),a.g.has(h)}n.forEach=function(a,h){Dn(this),this.g.forEach(function(d,g){d.forEach(function(S){a.call(h,S,g,this)},this)},this)},n.na=function(){Dn(this);const a=Array.from(this.g.values()),h=Array.from(this.g.keys()),d=[];for(let g=0;g<h.length;g++){const S=a[g];for(let b=0;b<S.length;b++)d.push(h[g])}return d},n.V=function(a){Dn(this);let h=[];if(typeof a=="string")kd(this,a)&&(h=h.concat(this.g.get(rr(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)h=h.concat(a[d])}return h},n.set=function(a,h){return Dn(this),this.i=null,a=rr(this,a),kd(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},n.get=function(a,h){return a?(a=this.V(a),0<a.length?String(a[0]):h):h};function Nd(a,h,d){Pd(a,h),0<d.length&&(a.i=null,a.g.set(rr(a,h),k(d)),a.h+=d.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(var d=0;d<h.length;d++){var g=h[d];const b=encodeURIComponent(String(g)),U=this.V(g);for(g=0;g<U.length;g++){var S=b;U[g]!==""&&(S+="="+encodeURIComponent(String(U[g]))),a.push(S)}}return this.i=a.join("&")};function rr(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function sE(a,h){h&&!a.j&&(Dn(a),a.i=null,a.g.forEach(function(d,g){var S=g.toLowerCase();g!=S&&(Pd(this,g),Nd(this,S,d))},a)),a.j=h}function oE(a,h){const d=new le;if(l.Image){const g=new Image;g.onload=v(On,d,"TestLoadImage: loaded",!0,h,g),g.onerror=v(On,d,"TestLoadImage: error",!1,h,g),g.onabort=v(On,d,"TestLoadImage: abort",!1,h,g),g.ontimeout=v(On,d,"TestLoadImage: timeout",!1,h,g),l.setTimeout(function(){g.ontimeout&&g.ontimeout()},1e4),g.src=a}else h(!1)}function aE(a,h){const d=new le,g=new AbortController,S=setTimeout(()=>{g.abort(),On(d,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:g.signal}).then(b=>{clearTimeout(S),b.ok?On(d,"TestPingServer: ok",!0,h):On(d,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(S),On(d,"TestPingServer: error",!1,h)})}function On(a,h,d,g,S){try{S&&(S.onload=null,S.onerror=null,S.onabort=null,S.ontimeout=null),g(d)}catch{}}function lE(){this.g=new Gl}function cE(a,h,d){const g=d||"";try{Cd(a,function(S,b){let U=S;u(S)&&(U=pi(S)),h.push(g+b+"="+encodeURIComponent(U))})}catch(S){throw h.push(g+"type="+encodeURIComponent("_badmap")),S}}function Bo(a){this.l=a.Ub||null,this.j=a.eb||!1}I(Bo,ss),Bo.prototype.g=function(){return new jo(this.l,this.j)},Bo.prototype.i=(function(a){return function(){return a}})({});function jo(a,h){Fe.call(this),this.D=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}I(jo,Fe),n=jo.prototype,n.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=h,this.readyState=1,fs(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const h={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(h.body=a),(this.D||l).fetch(new Request(this.A,h)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,ds(this)),this.readyState=0},n.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,fs(this)),this.g&&(this.readyState=3,fs(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof l.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Dd(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function Dd(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}n.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.v.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?ds(this):fs(this),this.readyState==3&&Dd(this)}},n.Ra=function(a){this.g&&(this.response=this.responseText=a,ds(this))},n.Qa=function(a){this.g&&(this.response=a,ds(this))},n.ga=function(){this.g&&ds(this)};function ds(a){a.readyState=4,a.l=null,a.j=null,a.v=null,fs(a)}n.setRequestHeader=function(a,h){this.u.append(a,h)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var d=h.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=h.next();return a.join(`\r
`)};function fs(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(jo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Od(a){let h="";return ce(a,function(d,g){h+=g,h+=":",h+=d,h+=`\r
`}),h}function ec(a,h,d){e:{for(g in d){var g=!1;break e}g=!0}g||(d=Od(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):Ee(a,h,d))}function Se(a){Fe.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}I(Se,Fe);var uE=/^https?$/i,hE=["POST","PUT"];n=Se.prototype,n.Ha=function(a){this.J=a},n.ea=function(a,h,d,g){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():xt.g(),this.v=this.o?xo(this.o):xo(xt),this.g.onreadystatechange=m(this.Ea,this);try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(b){xd(this,b);return}if(a=d||"",d=new Map(this.headers),g)if(Object.getPrototypeOf(g)===Object.prototype)for(var S in g)d.set(S,g[S]);else if(typeof g.keys=="function"&&typeof g.get=="function")for(const b of g.keys())d.set(b,g.get(b));else throw Error("Unknown input type for opt_headers: "+String(g));g=Array.from(d.keys()).find(b=>b.toLowerCase()=="content-type"),S=l.FormData&&a instanceof l.FormData,!(0<=Array.prototype.indexOf.call(hE,h,void 0))||g||S||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[b,U]of d)this.g.setRequestHeader(b,U);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Md(this),this.u=!0,this.g.send(a),this.u=!1}catch(b){xd(this,b)}};function xd(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.m=5,Ld(a),zo(a)}function Ld(a){a.A||(a.A=!0,$e(a,"complete"),$e(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,$e(this,"complete"),$e(this,"abort"),zo(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),zo(this,!0)),Se.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?Vd(this):this.bb())},n.bb=function(){Vd(this)};function Vd(a){if(a.h&&typeof o<"u"&&(!a.v[1]||hn(a)!=4||a.Z()!=2)){if(a.u&&hn(a)==4)Do(a.Ea,0,a);else if($e(a,"readystatechange"),hn(a)==4){a.h=!1;try{const U=a.Z();e:switch(U){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var d;if(!(d=h)){var g;if(g=U===0){var S=String(a.D).match(Sd)[1]||null;!S&&l.self&&l.self.location&&(S=l.self.location.protocol.slice(0,-1)),g=!uE.test(S?S.toLowerCase():"")}d=g}if(d)$e(a,"complete"),$e(a,"success");else{a.m=6;try{var b=2<hn(a)?a.g.statusText:""}catch{b=""}a.l=b+" ["+a.Z()+"]",Ld(a)}}finally{zo(a)}}}}function zo(a,h){if(a.g){Md(a);const d=a.g,g=a.v[0]?()=>{}:null;a.g=null,a.v=null,h||$e(a,"ready");try{d.onreadystatechange=g}catch{}}}function Md(a){a.I&&(l.clearTimeout(a.I),a.I=null)}n.isActive=function(){return!!this.g};function hn(a){return a.g?a.g.readyState:0}n.Z=function(){try{return 2<hn(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),rs(h)}};function Fd(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function dE(a){const h={};a=(a.g&&2<=hn(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let g=0;g<a.length;g++){if(j(a[g]))continue;var d=w(a[g]);const S=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const b=h[S]||[];h[S]=b,b.push(d)}A(h,function(g){return g.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ps(a,h,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||h}function Ud(a){this.Aa=0,this.i=[],this.j=new le,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ps("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ps("baseRetryDelayMs",5e3,a),this.cb=ps("retryDelaySeedMs",1e4,a),this.Wa=ps("forwardChannelMaxRetries",2,a),this.wa=ps("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new Ed(a&&a.concurrentRequestLimit),this.Da=new lE,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Ud.prototype,n.la=8,n.G=1,n.connect=function(a,h,d,g){F(0),this.W=a,this.H=h||{},d&&g!==void 0&&(this.H.OSID=d,this.H.OAID=g),this.F=this.X,this.I=Kd(this,null,this.W),Wo(this)};function tc(a){if(Bd(a),a.G==3){var h=a.U++,d=un(a.I);if(Ee(d,"SID",a.K),Ee(d,"RID",h),Ee(d,"TYPE","terminate"),ms(a,d),h=new St(a,a.j,h),h.L=2,h.v=Uo(un(d)),d=!1,l.navigator&&l.navigator.sendBeacon)try{d=l.navigator.sendBeacon(h.v.toString(),"")}catch{}!d&&l.Image&&(new Image().src=h.v,d=!0),d||(h.g=Qd(h.j,null),h.g.ea(h.v)),h.F=Date.now(),Vo(h)}Gd(a)}function qo(a){a.g&&(ic(a),a.g.cancel(),a.g=null)}function Bd(a){qo(a),a.u&&(l.clearTimeout(a.u),a.u=null),$o(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&l.clearTimeout(a.s),a.s=null)}function Wo(a){if(!Td(a.h)&&!a.s){a.s=!0;var h=a.Ga;Nt||Gi(),rt||(Nt(),rt=!0),Ct.add(h,a),a.B=0}}function fE(a,h){return wd(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=h.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=oe(m(a.Ga,a,h),Hd(a,a.B)),a.B++,!0)}n.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const S=new St(this,this.j,a);let b=this.o;if(this.S&&(b?(b=_(b),T(b,this.S)):b=this.S),this.m!==null||this.O||(S.H=b,b=null),this.P)e:{for(var h=0,d=0;d<this.i.length;d++){t:{var g=this.i[d];if("__data__"in g.map&&(g=g.map.__data__,typeof g=="string")){g=g.length;break t}g=void 0}if(g===void 0)break;if(h+=g,4096<h){h=d;break e}if(h===4096||d===this.i.length-1){h=d+1;break e}}h=1e3}else h=1e3;h=zd(this,S,h),d=un(this.I),Ee(d,"RID",a),Ee(d,"CVER",22),this.D&&Ee(d,"X-HTTP-Session-Id",this.D),ms(this,d),b&&(this.O?h="headers="+encodeURIComponent(String(Od(b)))+"&"+h:this.m&&ec(d,this.m,b)),Zl(this.h,S),this.Ua&&Ee(d,"TYPE","init"),this.P?(Ee(d,"$req",h),Ee(d,"SID","null"),S.T=!0,Ql(S,d,null)):Ql(S,d,h),this.G=2}}else this.G==3&&(a?jd(this,a):this.i.length==0||Td(this.h)||jd(this))};function jd(a,h){var d;h?d=h.l:d=a.U++;const g=un(a.I);Ee(g,"SID",a.K),Ee(g,"RID",d),Ee(g,"AID",a.T),ms(a,g),a.m&&a.o&&ec(g,a.m,a.o),d=new St(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),h&&(a.i=h.D.concat(a.i)),h=zd(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),Zl(a.h,d),Ql(d,g,h)}function ms(a,h){a.H&&ce(a.H,function(d,g){Ee(h,g,d)}),a.l&&Cd({},function(d,g){Ee(h,g,d)})}function zd(a,h,d){d=Math.min(a.i.length,d);var g=a.l?m(a.l.Na,a.l,a):null;e:{var S=a.i;let b=-1;for(;;){const U=["count="+d];b==-1?0<d?(b=S[0].g,U.push("ofs="+b)):b=0:U.push("ofs="+b);let me=!0;for(let He=0;He<d;He++){let ue=S[He].g;const Je=S[He].map;if(ue-=b,0>ue)b=Math.max(0,S[He].g-100),me=!1;else try{cE(Je,U,"req"+ue+"_")}catch{g&&g(Je)}}if(me){g=U.join("&");break e}}}return a=a.i.splice(0,d),h.D=a,g}function qd(a){if(!a.g&&!a.u){a.Y=1;var h=a.Fa;Nt||Gi(),rt||(Nt(),rt=!0),Ct.add(h,a),a.v=0}}function nc(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=oe(m(a.Fa,a),Hd(a,a.v)),a.v++,!0)}n.Fa=function(){if(this.u=null,Wd(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=oe(m(this.ab,this),a)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,F(10),qo(this),Wd(this))};function ic(a){a.A!=null&&(l.clearTimeout(a.A),a.A=null)}function Wd(a){a.g=new St(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var h=un(a.qa);Ee(h,"RID","rpc"),Ee(h,"SID",a.K),Ee(h,"AID",a.T),Ee(h,"CI",a.F?"0":"1"),!a.F&&a.ja&&Ee(h,"TO",a.ja),Ee(h,"TYPE","xmlhttp"),ms(a,h),a.m&&a.o&&ec(h,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=Uo(un(h)),d.m=null,d.P=!0,_d(d,a)}n.Za=function(){this.C!=null&&(this.C=null,qo(this),nc(this),F(19))};function $o(a){a.C!=null&&(l.clearTimeout(a.C),a.C=null)}function $d(a,h){var d=null;if(a.g==h){$o(a),ic(a),a.g=null;var g=2}else if(Jl(a.h,h))d=h.D,Id(a.h,h),g=1;else return;if(a.G!=0){if(h.o)if(g==1){d=h.m?h.m.length:0,h=Date.now()-h.F;var S=a.B;g=gi(),$e(g,new X(g,d)),Wo(a)}else qd(a);else if(S=h.s,S==3||S==0&&0<h.X||!(g==1&&fE(a,h)||g==2&&nc(a)))switch(d&&0<d.length&&(h=a.h,h.i=h.i.concat(d)),S){case 1:vi(a,5);break;case 4:vi(a,10);break;case 3:vi(a,6);break;default:vi(a,2)}}}function Hd(a,h){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*h}function vi(a,h){if(a.j.info("Error code "+h),h==2){var d=m(a.fb,a),g=a.Xa;const S=!g;g=new yi(g||"//www.google.com/images/cleardot.gif"),l.location&&l.location.protocol=="http"||Mo(g,"https"),Uo(g),S?oE(g.toString(),d):aE(g.toString(),d)}else F(2);a.G=0,a.l&&a.l.sa(h),Gd(a),Bd(a)}n.fb=function(a){a?(this.j.info("Successfully pinged google.com"),F(2)):(this.j.info("Failed to ping google.com"),F(1))};function Gd(a){if(a.G=0,a.ka=[],a.l){const h=Ad(a.h);(h.length!=0||a.i.length!=0)&&(N(a.ka,h),N(a.ka,a.i),a.h.i.length=0,k(a.i),a.i.length=0),a.l.ra()}}function Kd(a,h,d){var g=d instanceof yi?un(d):new yi(d);if(g.g!="")h&&(g.g=h+"."+g.g),Fo(g,g.s);else{var S=l.location;g=S.protocol,h=h?h+"."+S.hostname:S.hostname,S=+S.port;var b=new yi(null);g&&Mo(b,g),h&&(b.g=h),S&&Fo(b,S),d&&(b.l=d),g=b}return d=a.D,h=a.ya,d&&h&&Ee(g,d,h),Ee(g,"VER",a.la),ms(a,g),g}function Qd(a,h,d){if(h&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Ca&&!a.pa?new Se(new Bo({eb:d})):new Se(a.pa),h.Ha(a.J),h}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Yd(){}n=Yd.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function Ho(){}Ho.prototype.g=function(a,h){return new vt(a,h)};function vt(a,h){Fe.call(this),this.g=new Ud(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.va&&(a?a["X-WebChannel-Client-Profile"]=h.va:a={"X-WebChannel-Client-Profile":h.va}),this.g.S=a,(a=h&&h.Sb)&&!j(a)&&(this.g.m=a),this.v=h&&h.supportsCrossDomainXhr||!1,this.u=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!j(h)&&(this.g.D=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new sr(this)}I(vt,Fe),vt.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},vt.prototype.close=function(){tc(this.g)},vt.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=pi(a),a=d);h.i.push(new Yv(h.Ya++,a)),h.G==3&&Wo(h)},vt.prototype.N=function(){this.g.l=null,delete this.j,tc(this.g),delete this.g,vt.aa.N.call(this)};function Xd(a){tr.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const d in h){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}I(Xd,tr);function Jd(){nr.call(this),this.status=1}I(Jd,nr);function sr(a){this.g=a}I(sr,Yd),sr.prototype.ua=function(){$e(this.g,"a")},sr.prototype.ta=function(a){$e(this.g,new Xd(a))},sr.prototype.sa=function(a){$e(this.g,new Jd)},sr.prototype.ra=function(){$e(this.g,"b")},Ho.prototype.createWebChannel=Ho.prototype.g,vt.prototype.send=vt.prototype.o,vt.prototype.open=vt.prototype.m,vt.prototype.close=vt.prototype.close,jg=function(){return new Ho},Bg=function(){return gi()},Ug=$t,Fc={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},cn.NO_ERROR=0,cn.TIMEOUT=8,cn.HTTP_ERROR=6,ua=cn,ir.COMPLETE="complete",Fg=ir,Lo.EventType=mi,mi.OPEN="a",mi.CLOSE="b",mi.ERROR="c",mi.MESSAGE="d",Fe.prototype.listen=Fe.prototype.K,Ss=Lo,Se.prototype.listenOnce=Se.prototype.L,Se.prototype.getLastError=Se.prototype.Ka,Se.prototype.getLastErrorCode=Se.prototype.Ba,Se.prototype.getStatus=Se.prototype.Z,Se.prototype.getResponseJson=Se.prototype.Oa,Se.prototype.getResponseText=Se.prototype.oa,Se.prototype.send=Se.prototype.ea,Se.prototype.setWithCredentials=Se.prototype.Ha,Mg=Se}).apply(typeof Xo<"u"?Xo:typeof self<"u"?self:typeof window<"u"?window:{});const Vf="@firebase/firestore",Mf="4.8.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}tt.UNAUTHENTICATED=new tt(null),tt.GOOGLE_CREDENTIALS=new tt("google-credentials-uid"),tt.FIRST_PARTY=new tt("first-party-uid"),tt.MOCK_USER=new tt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Wr="11.10.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pi=new ol("@firebase/firestore");function lr(){return Pi.logLevel}function z(n,...e){if(Pi.logLevel<=ne.DEBUG){const t=e.map(Hu);Pi.debug(`Firestore (${Wr}): ${n}`,...t)}}function An(n,...e){if(Pi.logLevel<=ne.ERROR){const t=e.map(Hu);Pi.error(`Firestore (${Wr}): ${n}`,...t)}}function Qn(n,...e){if(Pi.logLevel<=ne.WARN){const t=e.map(Hu);Pi.warn(`Firestore (${Wr}): ${n}`,...t)}}function Hu(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $(n,e,t){let i="Unexpected state";typeof e=="string"?i=e:t=e,zg(n,i,t)}function zg(n,e,t){let i=`FIRESTORE (${Wr}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{i+=" CONTEXT: "+JSON.stringify(t)}catch{i+=" CONTEXT: "+t}throw An(i),new Error(i)}function fe(n,e,t,i){let r="Unexpected state";typeof t=="string"?r=t:i=t,n||zg(e,r,i)}function J(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class M extends bn{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yn{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qg{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class hA{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(tt.UNAUTHENTICATED)))}shutdown(){}}class dA{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class fA{constructor(e){this.t=e,this.currentUser=tt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){fe(this.o===void 0,42304);let i=this.i;const r=c=>this.i!==i?(i=this.i,t(c)):Promise.resolve();let s=new yn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new yn,e.enqueueRetryable((()=>r(this.currentUser)))};const o=()=>{const c=s;e.enqueueRetryable((async()=>{await c.promise,await r(this.currentUser)}))},l=c=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((c=>l(c))),setTimeout((()=>{if(!this.auth){const c=this.t.getImmediate({optional:!0});c?l(c):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new yn)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((i=>this.i!==e?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):i?(fe(typeof i.accessToken=="string",31837,{l:i}),new qg(i.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return fe(e===null||typeof e=="string",2055,{h:e}),new tt(e)}}class pA{constructor(e,t,i){this.P=e,this.T=t,this.I=i,this.type="FirstParty",this.user=tt.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class mA{constructor(e,t,i){this.P=e,this.T=t,this.I=i}getToken(){return Promise.resolve(new pA(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(tt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ff{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class gA{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,wt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){fe(this.o===void 0,3512);const i=s=>{s.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,z("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable((()=>i(s)))};const r=s=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((s=>r(s))),setTimeout((()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?r(s):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ff(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(fe(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Ff(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _A(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let i=0;i<n;i++)t[i]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wg(){return new TextEncoder}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let i="";for(;i.length<20;){const r=_A(40);for(let s=0;s<r.length;++s)i.length<20&&r[s]<t&&(i+=e.charAt(r[s]%62))}return i}}function Z(n,e){return n<e?-1:n>e?1:0}function Uc(n,e){let t=0;for(;t<n.length&&t<e.length;){const i=n.codePointAt(t),r=e.codePointAt(t);if(i!==r){if(i<128&&r<128)return Z(i,r);{const s=Wg(),o=yA(s.encode(Uf(n,t)),s.encode(Uf(e,t)));return o!==0?o:Z(i,r)}}t+=i>65535?2:1}return Z(n.length,e.length)}function Uf(n,e){return n.codePointAt(e)>65535?n.substring(e,e+2):n.substring(e,e+1)}function yA(n,e){for(let t=0;t<n.length&&t<e.length;++t)if(n[t]!==e[t])return Z(n[t],e[t]);return Z(n.length,e.length)}function Rr(n,e,t){return n.length===e.length&&n.every(((i,r)=>t(i,e[r])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bf="__name__";class Gt{constructor(e,t,i){t===void 0?t=0:t>e.length&&$(637,{offset:t,range:e.length}),i===void 0?i=e.length-t:i>e.length-t&&$(1746,{length:i,range:e.length-t}),this.segments=e,this.offset=t,this.len=i}get length(){return this.len}isEqual(e){return Gt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Gt?e.forEach((i=>{t.push(i)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,i=this.limit();t<i;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const i=Math.min(e.length,t.length);for(let r=0;r<i;r++){const s=Gt.compareSegments(e.get(r),t.get(r));if(s!==0)return s}return Z(e.length,t.length)}static compareSegments(e,t){const i=Gt.isNumericId(e),r=Gt.isNumericId(t);return i&&!r?-1:!i&&r?1:i&&r?Gt.extractNumericId(e).compare(Gt.extractNumericId(t)):Uc(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return qn.fromString(e.substring(4,e.length-2))}}class ge extends Gt{construct(e,t,i){return new ge(e,t,i)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const i of e){if(i.indexOf("//")>=0)throw new M(P.INVALID_ARGUMENT,`Invalid segment (${i}). Paths must not contain // in them.`);t.push(...i.split("/").filter((r=>r.length>0)))}return new ge(t)}static emptyPath(){return new ge([])}}const vA=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Qe extends Gt{construct(e,t,i){return new Qe(e,t,i)}static isValidIdentifier(e){return vA.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Qe.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Bf}static keyField(){return new Qe([Bf])}static fromServerFormat(e){const t=[];let i="",r=0;const s=()=>{if(i.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(i),i=""};let o=!1;for(;r<e.length;){const l=e[r];if(l==="\\"){if(r+1===e.length)throw new M(P.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const c=e[r+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new M(P.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);i+=c,r+=2}else l==="`"?(o=!o,r++):l!=="."||o?(i+=l,r++):(s(),r++)}if(s(),o)throw new M(P.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Qe(t)}static emptyPath(){return new Qe([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W(ge.fromString(e))}static fromName(e){return new W(ge.fromString(e).popFirst(5))}static empty(){return new W(ge.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ge.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return ge.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new ge(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $g(n,e,t){if(!t)throw new M(P.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function EA(n,e,t,i){if(e===!0&&i===!0)throw new M(P.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function jf(n){if(!W.isDocumentKey(n))throw new M(P.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function zf(n){if(W.isDocumentKey(n))throw new M(P.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function Hg(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function hl(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(i){return i.constructor?i.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":$(12329,{type:typeof n})}function tn(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new M(P.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=hl(n);throw new M(P.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function TA(n,e){if(e<=0)throw new M(P.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xe(n,e){const t={typeString:n};return e&&(t.value=e),t}function go(n,e){if(!Hg(n))throw new M(P.INVALID_ARGUMENT,"JSON must be an object");let t;for(const i in e)if(e[i]){const r=e[i].typeString,s="value"in e[i]?{value:e[i].value}:void 0;if(!(i in n)){t=`JSON missing required field: '${i}'`;break}const o=n[i];if(r&&typeof o!==r){t=`JSON field '${i}' must be a ${r}.`;break}if(s!==void 0&&o!==s.value){t=`Expected '${i}' field to equal '${s.value}'`;break}}if(t)throw new M(P.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf=-62135596800,Wf=1e6;class Te{static now(){return Te.fromMillis(Date.now())}static fromDate(e){return Te.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),i=Math.floor((e-1e3*t)*Wf);return new Te(t,i)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new M(P.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<qf)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new M(P.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Wf}_compareTo(e){return this.seconds===e.seconds?Z(this.nanoseconds,e.nanoseconds):Z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Te._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(go(e,Te._jsonSchema))return new Te(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-qf;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Te._jsonSchemaVersion="firestore/timestamp/1.0",Te._jsonSchema={type:xe("string",Te._jsonSchemaVersion),seconds:xe("number"),nanoseconds:xe("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Q{static fromTimestamp(e){return new Q(e)}static min(){return new Q(new Te(0,0))}static max(){return new Q(new Te(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ws=-1;function wA(n,e){const t=n.toTimestamp().seconds,i=n.toTimestamp().nanoseconds+1,r=Q.fromTimestamp(i===1e9?new Te(t+1,0):new Te(t,i));return new Yn(r,W.empty(),e)}function IA(n){return new Yn(n.readTime,n.key,Ws)}class Yn{constructor(e,t,i){this.readTime=e,this.documentKey=t,this.largestBatchId=i}static min(){return new Yn(Q.min(),W.empty(),Ws)}static max(){return new Yn(Q.max(),W.empty(),Ws)}}function AA(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=W.comparator(n.documentKey,e.documentKey),t!==0?t:Z(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const CA="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class SA{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $r(n){if(n.code!==P.FAILED_PRECONDITION||n.message!==CA)throw n;z("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&$(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new O(((i,r)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(i,r)},this.catchCallback=s=>{this.wrapFailure(t,s).next(i,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof O?t:O.resolve(t)}catch(t){return O.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):O.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):O.reject(t)}static resolve(e){return new O(((t,i)=>{t(e)}))}static reject(e){return new O(((t,i)=>{i(e)}))}static waitFor(e){return new O(((t,i)=>{let r=0,s=0,o=!1;e.forEach((l=>{++r,l.next((()=>{++s,o&&s===r&&t()}),(c=>i(c)))})),o=!0,s===r&&t()}))}static or(e){let t=O.resolve(!1);for(const i of e)t=t.next((r=>r?O.resolve(r):i()));return t}static forEach(e,t){const i=[];return e.forEach(((r,s)=>{i.push(t.call(this,r,s))})),this.waitFor(i)}static mapArray(e,t){return new O(((i,r)=>{const s=e.length,o=new Array(s);let l=0;for(let c=0;c<s;c++){const u=c;t(e[u]).next((f=>{o[u]=f,++l,l===s&&i(o)}),(f=>r(f)))}}))}static doWhile(e,t){return new O(((i,r)=>{const s=()=>{e()===!0?t().next((()=>{s()}),r):i()};s()}))}}function RA(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Hr(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=i=>this._e(i),this.ae=i=>t.writeSequenceNumber(i))}_e(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ae&&this.ae(e),e}}dl.ue=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ku=-1;function fl(n){return n==null}function ba(n){return n===0&&1/n==-1/0}function bA(n){return typeof n=="number"&&Number.isInteger(n)&&!ba(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gg="";function PA(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=$f(e)),e=kA(n.get(t),e);return $f(e)}function kA(n,e){let t=e;const i=n.length;for(let r=0;r<i;r++){const s=n.charAt(r);switch(s){case"\0":t+="";break;case Gg:t+="";break;default:t+=s}}return t}function $f(n){return n+Gg+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hf(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ai(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Kg(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ve=class Bc{constructor(e,t){this.comparator=e,this.root=t||Wn.EMPTY}insert(e,t){return new Bc(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Wn.BLACK,null,null))}remove(e){return new Bc(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Wn.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const i=this.comparator(e,t.key);if(i===0)return t.value;i<0?t=t.left:i>0&&(t=t.right)}return null}indexOf(e){let t=0,i=this.root;for(;!i.isEmpty();){const r=this.comparator(e,i.key);if(r===0)return t+i.left.size;r<0?i=i.left:(t+=i.left.size+1,i=i.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,i)=>(e(t,i),!1)))}toString(){const e=[];return this.inorderTraversal(((t,i)=>(e.push(`${t}:${i}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Jo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Jo(this.root,e,this.comparator,!1)}getReverseIterator(){return new Jo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Jo(this.root,e,this.comparator,!0)}},Jo=class{constructor(e,t,i,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?i(e.key,t):1,t&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},Wn=class dn{constructor(e,t,i,r,s){this.key=e,this.value=t,this.color=i??dn.RED,this.left=r??dn.EMPTY,this.right=s??dn.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,i,r,s){return new dn(e??this.key,t??this.value,i??this.color,r??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let r=this;const s=i(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,t,i),null):s===0?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,i)),r.fixUp()}removeMin(){if(this.left.isEmpty())return dn.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let i,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),t(e,r.key)===0){if(r.right.isEmpty())return dn.EMPTY;i=r.right.min(),r=r.copy(i.key,i.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,dn.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,dn.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw $(43730,{key:this.key,value:this.value});if(this.right.isRed())throw $(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw $(27949);return e+(this.isRed()?0:1)}};Wn.EMPTY=null,Wn.RED=!0,Wn.BLACK=!1;Wn.EMPTY=new class{constructor(){this.size=0}get key(){throw $(57766)}get value(){throw $(16141)}get color(){throw $(16727)}get left(){throw $(29726)}get right(){throw $(36894)}copy(e,t,i,r,s){return this}insert(e,t,i){return new Wn(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ue{constructor(e){this.comparator=e,this.data=new Ve(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,i)=>(e(t),!1)))}forEachInRange(e,t){const i=this.data.getIteratorFrom(e[0]);for(;i.hasNext();){const r=i.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let i;for(i=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();i.hasNext();)if(!e(i.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Gf(this.data.getIterator())}getIteratorFrom(e){return new Gf(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((i=>{t=t.add(i)})),t}isEqual(e){if(!(e instanceof Ue)||this.size!==e.size)return!1;const t=this.data.getIterator(),i=e.data.getIterator();for(;t.hasNext();){const r=t.getNext().key,s=i.getNext().key;if(this.comparator(r,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new Ue(this.comparator);return t.data=e,t}}class Gf{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e){this.fields=e,e.sort(Qe.comparator)}static empty(){return new At([])}unionWith(e){let t=new Ue(Qe.comparator);for(const i of this.fields)t=t.add(i);for(const i of e)t=t.add(i);return new At(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Rr(this.fields,e.fields,((t,i)=>t.isEqual(i)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qg extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(r){try{return atob(r)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new Qg("Invalid base64 string: "+s):s}})(e);return new Ye(t)}static fromUint8Array(e){const t=(function(r){let s="";for(let o=0;o<r.length;++o)s+=String.fromCharCode(r[o]);return s})(e);return new Ye(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const i=new Uint8Array(t.length);for(let r=0;r<t.length;r++)i[r]=t.charCodeAt(r);return i})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Ye.EMPTY_BYTE_STRING=new Ye("");const NA=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Xn(n){if(fe(!!n,39018),typeof n=="string"){let e=0;const t=NA.exec(n);if(fe(!!t,46558,{timestamp:n}),t[1]){let r=t[1];r=(r+"000000000").substr(0,9),e=Number(r)}const i=new Date(n);return{seconds:Math.floor(i.getTime()/1e3),nanos:e}}return{seconds:Pe(n.seconds),nanos:Pe(n.nanos)}}function Pe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Jn(n){return typeof n=="string"?Ye.fromBase64String(n):Ye.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yg="server_timestamp",Xg="__type__",Jg="__previous_value__",Zg="__local_write_time__";function pl(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[Xg])===null||t===void 0?void 0:t.stringValue)===Yg}function ml(n){const e=n.mapValue.fields[Jg];return pl(e)?ml(e):e}function $s(n){const e=Xn(n.mapValue.fields[Zg].timestampValue);return new Te(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class DA{constructor(e,t,i,r,s,o,l,c,u,f){this.databaseId=e,this.appId=t,this.persistenceKey=i,this.host=r,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=c,this.useFetchStreams=u,this.isUsingEmulator=f}}const Pa="(default)";class Hs{constructor(e,t){this.projectId=e,this.database=t||Pa}static empty(){return new Hs("","")}get isDefaultDatabase(){return this.database===Pa}isEqual(e){return e instanceof Hs&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e_="__type__",OA="__max__",Zo={mapValue:{}},t_="__vector__",ka="value";function Zn(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?pl(n)?4:LA(n)?9007199254740991:xA(n)?10:11:$(28295,{value:n})}function nn(n,e){if(n===e)return!0;const t=Zn(n);if(t!==Zn(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return $s(n).isEqual($s(e));case 3:return(function(r,s){if(typeof r.timestampValue=="string"&&typeof s.timestampValue=="string"&&r.timestampValue.length===s.timestampValue.length)return r.timestampValue===s.timestampValue;const o=Xn(r.timestampValue),l=Xn(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(r,s){return Jn(r.bytesValue).isEqual(Jn(s.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(r,s){return Pe(r.geoPointValue.latitude)===Pe(s.geoPointValue.latitude)&&Pe(r.geoPointValue.longitude)===Pe(s.geoPointValue.longitude)})(n,e);case 2:return(function(r,s){if("integerValue"in r&&"integerValue"in s)return Pe(r.integerValue)===Pe(s.integerValue);if("doubleValue"in r&&"doubleValue"in s){const o=Pe(r.doubleValue),l=Pe(s.doubleValue);return o===l?ba(o)===ba(l):isNaN(o)&&isNaN(l)}return!1})(n,e);case 9:return Rr(n.arrayValue.values||[],e.arrayValue.values||[],nn);case 10:case 11:return(function(r,s){const o=r.mapValue.fields||{},l=s.mapValue.fields||{};if(Hf(o)!==Hf(l))return!1;for(const c in o)if(o.hasOwnProperty(c)&&(l[c]===void 0||!nn(o[c],l[c])))return!1;return!0})(n,e);default:return $(52216,{left:n})}}function Gs(n,e){return(n.values||[]).find((t=>nn(t,e)))!==void 0}function br(n,e){if(n===e)return 0;const t=Zn(n),i=Zn(e);if(t!==i)return Z(t,i);switch(t){case 0:case 9007199254740991:return 0;case 1:return Z(n.booleanValue,e.booleanValue);case 2:return(function(s,o){const l=Pe(s.integerValue||s.doubleValue),c=Pe(o.integerValue||o.doubleValue);return l<c?-1:l>c?1:l===c?0:isNaN(l)?isNaN(c)?0:-1:1})(n,e);case 3:return Kf(n.timestampValue,e.timestampValue);case 4:return Kf($s(n),$s(e));case 5:return Uc(n.stringValue,e.stringValue);case 6:return(function(s,o){const l=Jn(s),c=Jn(o);return l.compareTo(c)})(n.bytesValue,e.bytesValue);case 7:return(function(s,o){const l=s.split("/"),c=o.split("/");for(let u=0;u<l.length&&u<c.length;u++){const f=Z(l[u],c[u]);if(f!==0)return f}return Z(l.length,c.length)})(n.referenceValue,e.referenceValue);case 8:return(function(s,o){const l=Z(Pe(s.latitude),Pe(o.latitude));return l!==0?l:Z(Pe(s.longitude),Pe(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Qf(n.arrayValue,e.arrayValue);case 10:return(function(s,o){var l,c,u,f;const p=s.fields||{},m=o.fields||{},v=(l=p[ka])===null||l===void 0?void 0:l.arrayValue,I=(c=m[ka])===null||c===void 0?void 0:c.arrayValue,k=Z(((u=v==null?void 0:v.values)===null||u===void 0?void 0:u.length)||0,((f=I==null?void 0:I.values)===null||f===void 0?void 0:f.length)||0);return k!==0?k:Qf(v,I)})(n.mapValue,e.mapValue);case 11:return(function(s,o){if(s===Zo.mapValue&&o===Zo.mapValue)return 0;if(s===Zo.mapValue)return 1;if(o===Zo.mapValue)return-1;const l=s.fields||{},c=Object.keys(l),u=o.fields||{},f=Object.keys(u);c.sort(),f.sort();for(let p=0;p<c.length&&p<f.length;++p){const m=Uc(c[p],f[p]);if(m!==0)return m;const v=br(l[c[p]],u[f[p]]);if(v!==0)return v}return Z(c.length,f.length)})(n.mapValue,e.mapValue);default:throw $(23264,{le:t})}}function Kf(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return Z(n,e);const t=Xn(n),i=Xn(e),r=Z(t.seconds,i.seconds);return r!==0?r:Z(t.nanos,i.nanos)}function Qf(n,e){const t=n.values||[],i=e.values||[];for(let r=0;r<t.length&&r<i.length;++r){const s=br(t[r],i[r]);if(s)return s}return Z(t.length,i.length)}function Pr(n){return jc(n)}function jc(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const i=Xn(t);return`time(${i.seconds},${i.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Jn(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return W.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let i="[",r=!0;for(const s of t.values||[])r?r=!1:i+=",",i+=jc(s);return i+"]"})(n.arrayValue):"mapValue"in n?(function(t){const i=Object.keys(t.fields||{}).sort();let r="{",s=!0;for(const o of i)s?s=!1:r+=",",r+=`${o}:${jc(t.fields[o])}`;return r+"}"})(n.mapValue):$(61005,{value:n})}function ha(n){switch(Zn(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=ml(n);return e?16+ha(e):16;case 5:return 2*n.stringValue.length;case 6:return Jn(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(i){return(i.values||[]).reduce(((r,s)=>r+ha(s)),0)})(n.arrayValue);case 10:case 11:return(function(i){let r=0;return ai(i.fields,((s,o)=>{r+=s.length+ha(o)})),r})(n.mapValue);default:throw $(13486,{value:n})}}function Na(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function zc(n){return!!n&&"integerValue"in n}function Qu(n){return!!n&&"arrayValue"in n}function Yf(n){return!!n&&"nullValue"in n}function Xf(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function da(n){return!!n&&"mapValue"in n}function xA(n){var e,t;return((t=(((e=n==null?void 0:n.mapValue)===null||e===void 0?void 0:e.fields)||{})[e_])===null||t===void 0?void 0:t.stringValue)===t_}function Ds(n){if(n.geoPointValue)return{geoPointValue:Object.assign({},n.geoPointValue)};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:Object.assign({},n.timestampValue)};if(n.mapValue){const e={mapValue:{fields:{}}};return ai(n.mapValue.fields,((t,i)=>e.mapValue.fields[t]=Ds(i))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ds(n.arrayValue.values[t]);return e}return Object.assign({},n)}function LA(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===OA}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(e){this.value=e}static empty(){return new ut({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let i=0;i<e.length-1;++i)if(t=(t.mapValue.fields||{})[e.get(i)],!da(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ds(t)}setAll(e){let t=Qe.emptyPath(),i={},r=[];e.forEach(((o,l)=>{if(!t.isImmediateParentOf(l)){const c=this.getFieldsMap(t);this.applyChanges(c,i,r),i={},r=[],t=l.popLast()}o?i[l.lastSegment()]=Ds(o):r.push(l.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,i,r)}delete(e){const t=this.field(e.popLast());da(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return nn(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let i=0;i<e.length;++i){let r=t.mapValue.fields[e.get(i)];da(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(i)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,i){ai(t,((r,s)=>e[r]=s));for(const r of i)delete e[r]}clone(){return new ut(Ds(this.value))}}function n_(n){const e=[];return ai(n.fields,((t,i)=>{const r=new Qe([t]);if(da(i)){const s=n_(i.mapValue).fields;if(s.length===0)e.push(r);else for(const o of s)e.push(r.child(o))}else e.push(r)})),new At(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e,t,i,r,s,o,l){this.key=e,this.documentType=t,this.version=i,this.readTime=r,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new nt(e,0,Q.min(),Q.min(),Q.min(),ut.empty(),0)}static newFoundDocument(e,t,i,r){return new nt(e,1,t,Q.min(),i,r,0)}static newNoDocument(e,t){return new nt(e,2,t,Q.min(),Q.min(),ut.empty(),0)}static newUnknownDocument(e,t){return new nt(e,3,t,Q.min(),Q.min(),ut.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Q.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ut.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ut.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Q.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof nt&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new nt(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kr{constructor(e,t){this.position=e,this.inclusive=t}}function Jf(n,e,t){let i=0;for(let r=0;r<n.position.length;r++){const s=e[r],o=n.position[r];if(s.field.isKeyField()?i=W.comparator(W.fromName(o.referenceValue),t.key):i=br(o,t.data.field(s.field)),s.dir==="desc"&&(i*=-1),i!==0)break}return i}function Zf(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!nn(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,t="asc"){this.field=e,this.dir=t}}function VA(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i_{}class Oe extends i_{constructor(e,t,i){super(),this.field=e,this.op=t,this.value=i}static create(e,t,i){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,i):new FA(e,t,i):t==="array-contains"?new jA(e,i):t==="in"?new zA(e,i):t==="not-in"?new qA(e,i):t==="array-contains-any"?new WA(e,i):new Oe(e,t,i)}static createKeyFieldInFilter(e,t,i){return t==="in"?new UA(e,i):new BA(e,i)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(br(t,this.value)):t!==null&&Zn(this.value)===Zn(t)&&this.matchesComparison(br(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return $(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class qt extends i_{constructor(e,t){super(),this.filters=e,this.op=t,this.he=null}static create(e,t){return new qt(e,t)}matches(e){return r_(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.he!==null||(this.he=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.he}getFilters(){return Object.assign([],this.filters)}}function r_(n){return n.op==="and"}function s_(n){return MA(n)&&r_(n)}function MA(n){for(const e of n.filters)if(e instanceof qt)return!1;return!0}function qc(n){if(n instanceof Oe)return n.field.canonicalString()+n.op.toString()+Pr(n.value);if(s_(n))return n.filters.map((e=>qc(e))).join(",");{const e=n.filters.map((t=>qc(t))).join(",");return`${n.op}(${e})`}}function o_(n,e){return n instanceof Oe?(function(i,r){return r instanceof Oe&&i.op===r.op&&i.field.isEqual(r.field)&&nn(i.value,r.value)})(n,e):n instanceof qt?(function(i,r){return r instanceof qt&&i.op===r.op&&i.filters.length===r.filters.length?i.filters.reduce(((s,o,l)=>s&&o_(o,r.filters[l])),!0):!1})(n,e):void $(19439)}function a_(n){return n instanceof Oe?(function(t){return`${t.field.canonicalString()} ${t.op} ${Pr(t.value)}`})(n):n instanceof qt?(function(t){return t.op.toString()+" {"+t.getFilters().map(a_).join(" ,")+"}"})(n):"Filter"}class FA extends Oe{constructor(e,t,i){super(e,t,i),this.key=W.fromName(i.referenceValue)}matches(e){const t=W.comparator(e.key,this.key);return this.matchesComparison(t)}}class UA extends Oe{constructor(e,t){super(e,"in",t),this.keys=l_("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class BA extends Oe{constructor(e,t){super(e,"not-in",t),this.keys=l_("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function l_(n,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((i=>W.fromName(i.referenceValue)))}class jA extends Oe{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Qu(t)&&Gs(t.arrayValue,this.value)}}class zA extends Oe{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Gs(this.value.arrayValue,t)}}class qA extends Oe{constructor(e,t){super(e,"not-in",t)}matches(e){if(Gs(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Gs(this.value.arrayValue,t)}}class WA extends Oe{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Qu(t)||!t.arrayValue.values)&&t.arrayValue.values.some((i=>Gs(this.value.arrayValue,i)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A{constructor(e,t=null,i=[],r=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=i,this.filters=r,this.limit=s,this.startAt=o,this.endAt=l,this.Pe=null}}function ep(n,e=null,t=[],i=[],r=null,s=null,o=null){return new $A(n,e,t,i,r,s,o)}function Yu(n){const e=J(n);if(e.Pe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((i=>qc(i))).join(","),t+="|ob:",t+=e.orderBy.map((i=>(function(s){return s.field.canonicalString()+s.dir})(i))).join(","),fl(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((i=>Pr(i))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((i=>Pr(i))).join(",")),e.Pe=t}return e.Pe}function Xu(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!VA(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!o_(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Zf(n.startAt,e.startAt)&&Zf(n.endAt,e.endAt)}function Wc(n){return W.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bi{constructor(e,t=null,i=[],r=[],s=null,o="F",l=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=i,this.filters=r,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=c,this.Te=null,this.Ie=null,this.de=null,this.startAt,this.endAt}}function HA(n,e,t,i,r,s,o,l){return new Bi(n,e,t,i,r,s,o,l)}function Ju(n){return new Bi(n)}function tp(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Zu(n){return n.collectionGroup!==null}function yr(n){const e=J(n);if(e.Te===null){e.Te=[];const t=new Set;for(const s of e.explicitOrderBy)e.Te.push(s),t.add(s.field.canonicalString());const i=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Ue(Qe.comparator);return o.filters.forEach((c=>{c.getFlattenedFilters().forEach((u=>{u.isInequality()&&(l=l.add(u.field))}))})),l})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.Te.push(new Ks(s,i))})),t.has(Qe.keyField().canonicalString())||e.Te.push(new Ks(Qe.keyField(),i))}return e.Te}function Yt(n){const e=J(n);return e.Ie||(e.Ie=GA(e,yr(n))),e.Ie}function GA(n,e){if(n.limitType==="F")return ep(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((r=>{const s=r.dir==="desc"?"asc":"desc";return new Ks(r.field,s)}));const t=n.endAt?new kr(n.endAt.position,n.endAt.inclusive):null,i=n.startAt?new kr(n.startAt.position,n.startAt.inclusive):null;return ep(n.path,n.collectionGroup,e,n.filters,n.limit,t,i)}}function $c(n,e){const t=n.filters.concat([e]);return new Bi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Da(n,e,t){return new Bi(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function gl(n,e){return Xu(Yt(n),Yt(e))&&n.limitType===e.limitType}function c_(n){return`${Yu(Yt(n))}|lt:${n.limitType}`}function cr(n){return`Query(target=${(function(t){let i=t.path.canonicalString();return t.collectionGroup!==null&&(i+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(i+=`, filters: [${t.filters.map((r=>a_(r))).join(", ")}]`),fl(t.limit)||(i+=", limit: "+t.limit),t.orderBy.length>0&&(i+=`, orderBy: [${t.orderBy.map((r=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(r))).join(", ")}]`),t.startAt&&(i+=", startAt: ",i+=t.startAt.inclusive?"b:":"a:",i+=t.startAt.position.map((r=>Pr(r))).join(",")),t.endAt&&(i+=", endAt: ",i+=t.endAt.inclusive?"a:":"b:",i+=t.endAt.position.map((r=>Pr(r))).join(",")),`Target(${i})`})(Yt(n))}; limitType=${n.limitType})`}function _l(n,e){return e.isFoundDocument()&&(function(i,r){const s=r.key.path;return i.collectionGroup!==null?r.key.hasCollectionId(i.collectionGroup)&&i.path.isPrefixOf(s):W.isDocumentKey(i.path)?i.path.isEqual(s):i.path.isImmediateParentOf(s)})(n,e)&&(function(i,r){for(const s of yr(i))if(!s.field.isKeyField()&&r.data.field(s.field)===null)return!1;return!0})(n,e)&&(function(i,r){for(const s of i.filters)if(!s.matches(r))return!1;return!0})(n,e)&&(function(i,r){return!(i.startAt&&!(function(o,l,c){const u=Jf(o,l,c);return o.inclusive?u<=0:u<0})(i.startAt,yr(i),r)||i.endAt&&!(function(o,l,c){const u=Jf(o,l,c);return o.inclusive?u>=0:u>0})(i.endAt,yr(i),r))})(n,e)}function KA(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function u_(n){return(e,t)=>{let i=!1;for(const r of yr(n)){const s=QA(r,e,t);if(s!==0)return s;i=i||r.field.isKeyField()}return 0}}function QA(n,e,t){const i=n.field.isKeyField()?W.comparator(e.key,t.key):(function(s,o,l){const c=o.data.field(s),u=l.data.field(s);return c!==null&&u!==null?br(c,u):$(42886)})(n.field,e,t);switch(n.dir){case"asc":return i;case"desc":return-1*i;default:return $(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i!==void 0){for(const[r,s]of i)if(this.equalsFn(r,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const i=this.mapKeyFn(e),r=this.inner[i];if(r===void 0)return this.inner[i]=[[e,t]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),i=this.inner[t];if(i===void 0)return!1;for(let r=0;r<i.length;r++)if(this.equalsFn(i[r][0],e))return i.length===1?delete this.inner[t]:i.splice(r,1),this.innerSize--,!0;return!1}forEach(e){ai(this.inner,((t,i)=>{for(const[r,s]of i)e(r,s)}))}isEmpty(){return Kg(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const YA=new Ve(W.comparator);function Cn(){return YA}const h_=new Ve(W.comparator);function Rs(...n){let e=h_;for(const t of n)e=e.insert(t.key,t);return e}function d_(n){let e=h_;return n.forEach(((t,i)=>e=e.insert(t,i.overlayedDocument))),e}function Ii(){return Os()}function f_(){return Os()}function Os(){return new ji((n=>n.toString()),((n,e)=>n.isEqual(e)))}const XA=new Ve(W.comparator),JA=new Ue(W.comparator);function se(...n){let e=JA;for(const t of n)e=e.add(t);return e}const ZA=new Ue(Z);function eC(){return ZA}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eh(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ba(e)?"-0":e}}function p_(n){return{integerValue:""+n}}function tC(n,e){return bA(e)?p_(e):eh(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yl{constructor(){this._=void 0}}function nC(n,e,t){return n instanceof Qs?(function(r,s){const o={fields:{[Xg]:{stringValue:Yg},[Zg]:{timestampValue:{seconds:r.seconds,nanos:r.nanoseconds}}}};return s&&pl(s)&&(s=ml(s)),s&&(o.fields[Jg]=s),{mapValue:o}})(t,e):n instanceof Ys?g_(n,e):n instanceof Xs?__(n,e):(function(r,s){const o=m_(r,s),l=np(o)+np(r.Ee);return zc(o)&&zc(r.Ee)?p_(l):eh(r.serializer,l)})(n,e)}function iC(n,e,t){return n instanceof Ys?g_(n,e):n instanceof Xs?__(n,e):t}function m_(n,e){return n instanceof Oa?(function(i){return zc(i)||(function(s){return!!s&&"doubleValue"in s})(i)})(e)?e:{integerValue:0}:null}class Qs extends yl{}class Ys extends yl{constructor(e){super(),this.elements=e}}function g_(n,e){const t=y_(e);for(const i of n.elements)t.some((r=>nn(r,i)))||t.push(i);return{arrayValue:{values:t}}}class Xs extends yl{constructor(e){super(),this.elements=e}}function __(n,e){let t=y_(e);for(const i of n.elements)t=t.filter((r=>!nn(r,i)));return{arrayValue:{values:t}}}class Oa extends yl{constructor(e,t){super(),this.serializer=e,this.Ee=t}}function np(n){return Pe(n.integerValue||n.doubleValue)}function y_(n){return Qu(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rC{constructor(e,t){this.field=e,this.transform=t}}function sC(n,e){return n.field.isEqual(e.field)&&(function(i,r){return i instanceof Ys&&r instanceof Ys||i instanceof Xs&&r instanceof Xs?Rr(i.elements,r.elements,nn):i instanceof Oa&&r instanceof Oa?nn(i.Ee,r.Ee):i instanceof Qs&&r instanceof Qs})(n.transform,e.transform)}class oC{constructor(e,t){this.version=e,this.transformResults=t}}class ft{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ft}static exists(e){return new ft(void 0,e)}static updateTime(e){return new ft(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function fa(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class vl{}function v_(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new El(n.key,ft.none()):new _o(n.key,n.data,ft.none());{const t=n.data,i=ut.empty();let r=new Ue(Qe.comparator);for(let s of e.fields)if(!r.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?i.delete(s):i.set(s,o),r=r.add(s)}return new li(n.key,i,new At(r.toArray()),ft.none())}}function aC(n,e,t){n instanceof _o?(function(r,s,o){const l=r.value.clone(),c=rp(r.fieldTransforms,s,o.transformResults);l.setAll(c),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()})(n,e,t):n instanceof li?(function(r,s,o){if(!fa(r.precondition,s))return void s.convertToUnknownDocument(o.version);const l=rp(r.fieldTransforms,s,o.transformResults),c=s.data;c.setAll(E_(r)),c.setAll(l),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):(function(r,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function xs(n,e,t,i){return n instanceof _o?(function(s,o,l,c){if(!fa(s.precondition,o))return l;const u=s.value.clone(),f=sp(s.fieldTransforms,c,o);return u.setAll(f),o.convertToFoundDocument(o.version,u).setHasLocalMutations(),null})(n,e,t,i):n instanceof li?(function(s,o,l,c){if(!fa(s.precondition,o))return l;const u=sp(s.fieldTransforms,c,o),f=o.data;return f.setAll(E_(s)),f.setAll(u),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map((p=>p.field)))})(n,e,t,i):(function(s,o,l){return fa(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l})(n,e,t)}function lC(n,e){let t=null;for(const i of n.fieldTransforms){const r=e.data.field(i.field),s=m_(i.transform,r||null);s!=null&&(t===null&&(t=ut.empty()),t.set(i.field,s))}return t||null}function ip(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(i,r){return i===void 0&&r===void 0||!(!i||!r)&&Rr(i,r,((s,o)=>sC(s,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class _o extends vl{constructor(e,t,i,r=[]){super(),this.key=e,this.value=t,this.precondition=i,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class li extends vl{constructor(e,t,i,r,s=[]){super(),this.key=e,this.data=t,this.fieldMask=i,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function E_(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const i=n.data.field(t);e.set(t,i)}})),e}function rp(n,e,t){const i=new Map;fe(n.length===t.length,32656,{Ae:t.length,Re:n.length});for(let r=0;r<t.length;r++){const s=n[r],o=s.transform,l=e.data.field(s.field);i.set(s.field,iC(o,l,t[r]))}return i}function sp(n,e,t){const i=new Map;for(const r of n){const s=r.transform,o=t.data.field(r.field);i.set(r.field,nC(s,o,e))}return i}class El extends vl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class cC extends vl{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uC{constructor(e,t,i,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=i,this.mutations=r}applyToRemoteDocument(e,t){const i=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const s=this.mutations[r];s.key.isEqual(e.key)&&aC(s,e,i[r])}}applyToLocalView(e,t){for(const i of this.baseMutations)i.key.isEqual(e.key)&&(t=xs(i,e,t,this.localWriteTime));for(const i of this.mutations)i.key.isEqual(e.key)&&(t=xs(i,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const i=f_();return this.mutations.forEach((r=>{const s=e.get(r.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=t.has(r.key)?null:l;const c=v_(o,l);c!==null&&i.set(r.key,c),o.isValidDocument()||o.convertToNoDocument(Q.min())})),i}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),se())}isEqual(e){return this.batchId===e.batchId&&Rr(this.mutations,e.mutations,((t,i)=>ip(t,i)))&&Rr(this.baseMutations,e.baseMutations,((t,i)=>ip(t,i)))}}class th{constructor(e,t,i,r){this.batch=e,this.commitVersion=t,this.mutationResults=i,this.docVersions=r}static from(e,t,i){fe(e.mutations.length===i.length,58842,{Ve:e.mutations.length,me:i.length});let r=(function(){return XA})();const s=e.mutations;for(let o=0;o<s.length;o++)r=r.insert(s[o].key,i[o].version);return new th(e,t,i,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hC{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dC{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var De,ae;function fC(n){switch(n){case P.OK:return $(64938);case P.CANCELLED:case P.UNKNOWN:case P.DEADLINE_EXCEEDED:case P.RESOURCE_EXHAUSTED:case P.INTERNAL:case P.UNAVAILABLE:case P.UNAUTHENTICATED:return!1;case P.INVALID_ARGUMENT:case P.NOT_FOUND:case P.ALREADY_EXISTS:case P.PERMISSION_DENIED:case P.FAILED_PRECONDITION:case P.ABORTED:case P.OUT_OF_RANGE:case P.UNIMPLEMENTED:case P.DATA_LOSS:return!0;default:return $(15467,{code:n})}}function T_(n){if(n===void 0)return An("GRPC error has no .code"),P.UNKNOWN;switch(n){case De.OK:return P.OK;case De.CANCELLED:return P.CANCELLED;case De.UNKNOWN:return P.UNKNOWN;case De.DEADLINE_EXCEEDED:return P.DEADLINE_EXCEEDED;case De.RESOURCE_EXHAUSTED:return P.RESOURCE_EXHAUSTED;case De.INTERNAL:return P.INTERNAL;case De.UNAVAILABLE:return P.UNAVAILABLE;case De.UNAUTHENTICATED:return P.UNAUTHENTICATED;case De.INVALID_ARGUMENT:return P.INVALID_ARGUMENT;case De.NOT_FOUND:return P.NOT_FOUND;case De.ALREADY_EXISTS:return P.ALREADY_EXISTS;case De.PERMISSION_DENIED:return P.PERMISSION_DENIED;case De.FAILED_PRECONDITION:return P.FAILED_PRECONDITION;case De.ABORTED:return P.ABORTED;case De.OUT_OF_RANGE:return P.OUT_OF_RANGE;case De.UNIMPLEMENTED:return P.UNIMPLEMENTED;case De.DATA_LOSS:return P.DATA_LOSS;default:return $(39323,{code:n})}}(ae=De||(De={}))[ae.OK=0]="OK",ae[ae.CANCELLED=1]="CANCELLED",ae[ae.UNKNOWN=2]="UNKNOWN",ae[ae.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",ae[ae.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",ae[ae.NOT_FOUND=5]="NOT_FOUND",ae[ae.ALREADY_EXISTS=6]="ALREADY_EXISTS",ae[ae.PERMISSION_DENIED=7]="PERMISSION_DENIED",ae[ae.UNAUTHENTICATED=16]="UNAUTHENTICATED",ae[ae.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",ae[ae.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",ae[ae.ABORTED=10]="ABORTED",ae[ae.OUT_OF_RANGE=11]="OUT_OF_RANGE",ae[ae.UNIMPLEMENTED=12]="UNIMPLEMENTED",ae[ae.INTERNAL=13]="INTERNAL",ae[ae.UNAVAILABLE=14]="UNAVAILABLE",ae[ae.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pC=new qn([4294967295,4294967295],0);function op(n){const e=Wg().encode(n),t=new Vg;return t.update(e),new Uint8Array(t.digest())}function ap(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),i=e.getUint32(4,!0),r=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new qn([t,i],0),new qn([r,s],0)]}class nh{constructor(e,t,i){if(this.bitmap=e,this.padding=t,this.hashCount=i,t<0||t>=8)throw new bs(`Invalid padding: ${t}`);if(i<0)throw new bs(`Invalid hash count: ${i}`);if(e.length>0&&this.hashCount===0)throw new bs(`Invalid hash count: ${i}`);if(e.length===0&&t!==0)throw new bs(`Invalid padding when bitmap length is 0: ${t}`);this.fe=8*e.length-t,this.ge=qn.fromNumber(this.fe)}pe(e,t,i){let r=e.add(t.multiply(qn.fromNumber(i)));return r.compare(pC)===1&&(r=new qn([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ge).toNumber()}ye(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.fe===0)return!1;const t=op(e),[i,r]=ap(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(i,r,s);if(!this.ye(o))return!1}return!0}static create(e,t,i){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new nh(s,r,t);return i.forEach((l=>o.insert(l))),o}insert(e){if(this.fe===0)return;const t=op(e),[i,r]=ap(t);for(let s=0;s<this.hashCount;s++){const o=this.pe(i,r,s);this.we(o)}}we(e){const t=Math.floor(e/8),i=e%8;this.bitmap[t]|=1<<i}}class bs extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tl{constructor(e,t,i,r,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=i,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,i){const r=new Map;return r.set(e,yo.createSynthesizedTargetChangeForCurrentChange(e,t,i)),new Tl(Q.min(),r,new Ve(Z),Cn(),se())}}class yo{constructor(e,t,i,r,s){this.resumeToken=e,this.current=t,this.addedDocuments=i,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,i){return new yo(i,t,se(),se(),se())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pa{constructor(e,t,i,r){this.Se=e,this.removedTargetIds=t,this.key=i,this.be=r}}class w_{constructor(e,t){this.targetId=e,this.De=t}}class I_{constructor(e,t,i=Ye.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=i,this.cause=r}}class lp{constructor(){this.ve=0,this.Ce=cp(),this.Fe=Ye.EMPTY_BYTE_STRING,this.Me=!1,this.xe=!0}get current(){return this.Me}get resumeToken(){return this.Fe}get Oe(){return this.ve!==0}get Ne(){return this.xe}Be(e){e.approximateByteSize()>0&&(this.xe=!0,this.Fe=e)}Le(){let e=se(),t=se(),i=se();return this.Ce.forEach(((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:i=i.add(r);break;default:$(38017,{changeType:s})}})),new yo(this.Fe,this.Me,e,t,i)}ke(){this.xe=!1,this.Ce=cp()}qe(e,t){this.xe=!0,this.Ce=this.Ce.insert(e,t)}Qe(e){this.xe=!0,this.Ce=this.Ce.remove(e)}$e(){this.ve+=1}Ue(){this.ve-=1,fe(this.ve>=0,3241,{ve:this.ve})}Ke(){this.xe=!0,this.Me=!0}}class mC{constructor(e){this.We=e,this.Ge=new Map,this.ze=Cn(),this.je=ea(),this.Je=ea(),this.He=new Ve(Z)}Ye(e){for(const t of e.Se)e.be&&e.be.isFoundDocument()?this.Ze(t,e.be):this.Xe(t,e.key,e.be);for(const t of e.removedTargetIds)this.Xe(t,e.key,e.be)}et(e){this.forEachTarget(e,(t=>{const i=this.tt(t);switch(e.state){case 0:this.nt(t)&&i.Be(e.resumeToken);break;case 1:i.Ue(),i.Oe||i.ke(),i.Be(e.resumeToken);break;case 2:i.Ue(),i.Oe||this.removeTarget(t);break;case 3:this.nt(t)&&(i.Ke(),i.Be(e.resumeToken));break;case 4:this.nt(t)&&(this.rt(t),i.Be(e.resumeToken));break;default:$(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Ge.forEach(((i,r)=>{this.nt(r)&&t(r)}))}it(e){const t=e.targetId,i=e.De.count,r=this.st(t);if(r){const s=r.target;if(Wc(s))if(i===0){const o=new W(s.path);this.Xe(t,o,nt.newNoDocument(o,Q.min()))}else fe(i===1,20013,{expectedCount:i});else{const o=this.ot(t);if(o!==i){const l=this._t(e),c=l?this.ut(l,e,o):1;if(c!==0){this.rt(t);const u=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.He=this.He.insert(t,u)}}}}}_t(e){const t=e.De.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:i="",padding:r=0},hashCount:s=0}=t;let o,l;try{o=Jn(i).toUint8Array()}catch(c){if(c instanceof Qg)return Qn("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{l=new nh(o,r,s)}catch(c){return Qn(c instanceof bs?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return l.fe===0?null:l}ut(e,t,i){return t.De.count===i-this.ht(e,t.targetId)?0:2}ht(e,t){const i=this.We.getRemoteKeysForTarget(t);let r=0;return i.forEach((s=>{const o=this.We.lt(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.Xe(t,s,null),r++)})),r}Pt(e){const t=new Map;this.Ge.forEach(((s,o)=>{const l=this.st(o);if(l){if(s.current&&Wc(l.target)){const c=new W(l.target.path);this.Tt(c).has(o)||this.It(o,c)||this.Xe(o,c,nt.newNoDocument(c,e))}s.Ne&&(t.set(o,s.Le()),s.ke())}}));let i=se();this.Je.forEach(((s,o)=>{let l=!0;o.forEachWhile((c=>{const u=this.st(c);return!u||u.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(i=i.add(s))})),this.ze.forEach(((s,o)=>o.setReadTime(e)));const r=new Tl(e,t,this.He,this.ze,i);return this.ze=Cn(),this.je=ea(),this.Je=ea(),this.He=new Ve(Z),r}Ze(e,t){if(!this.nt(e))return;const i=this.It(e,t.key)?2:0;this.tt(e).qe(t.key,i),this.ze=this.ze.insert(t.key,t),this.je=this.je.insert(t.key,this.Tt(t.key).add(e)),this.Je=this.Je.insert(t.key,this.dt(t.key).add(e))}Xe(e,t,i){if(!this.nt(e))return;const r=this.tt(e);this.It(e,t)?r.qe(t,1):r.Qe(t),this.Je=this.Je.insert(t,this.dt(t).delete(e)),this.Je=this.Je.insert(t,this.dt(t).add(e)),i&&(this.ze=this.ze.insert(t,i))}removeTarget(e){this.Ge.delete(e)}ot(e){const t=this.tt(e).Le();return this.We.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}$e(e){this.tt(e).$e()}tt(e){let t=this.Ge.get(e);return t||(t=new lp,this.Ge.set(e,t)),t}dt(e){let t=this.Je.get(e);return t||(t=new Ue(Z),this.Je=this.Je.insert(e,t)),t}Tt(e){let t=this.je.get(e);return t||(t=new Ue(Z),this.je=this.je.insert(e,t)),t}nt(e){const t=this.st(e)!==null;return t||z("WatchChangeAggregator","Detected inactive target",e),t}st(e){const t=this.Ge.get(e);return t&&t.Oe?null:this.We.Et(e)}rt(e){this.Ge.set(e,new lp),this.We.getRemoteKeysForTarget(e).forEach((t=>{this.Xe(e,t,null)}))}It(e,t){return this.We.getRemoteKeysForTarget(e).has(t)}}function ea(){return new Ve(W.comparator)}function cp(){return new Ve(W.comparator)}const gC={asc:"ASCENDING",desc:"DESCENDING"},_C={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},yC={and:"AND",or:"OR"};class vC{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Hc(n,e){return n.useProto3Json||fl(e)?e:{value:e}}function xa(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function A_(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function EC(n,e){return xa(n,e.toTimestamp())}function Xt(n){return fe(!!n,49232),Q.fromTimestamp((function(t){const i=Xn(t);return new Te(i.seconds,i.nanos)})(n))}function ih(n,e){return Gc(n,e).canonicalString()}function Gc(n,e){const t=(function(r){return new ge(["projects",r.projectId,"databases",r.database])})(n).child("documents");return e===void 0?t:t.child(e)}function C_(n){const e=ge.fromString(n);return fe(k_(e),10190,{key:e.toString()}),e}function Kc(n,e){return ih(n.databaseId,e.path)}function dc(n,e){const t=C_(e);if(t.get(1)!==n.databaseId.projectId)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new M(P.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new W(R_(t))}function S_(n,e){return ih(n.databaseId,e)}function TC(n){const e=C_(n);return e.length===4?ge.emptyPath():R_(e)}function Qc(n){return new ge(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function R_(n){return fe(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function up(n,e,t){return{name:Kc(n,e),fields:t.value.mapValue.fields}}function wC(n,e){let t;if("targetChange"in e){e.targetChange;const i=(function(u){return u==="NO_CHANGE"?0:u==="ADD"?1:u==="REMOVE"?2:u==="CURRENT"?3:u==="RESET"?4:$(39313,{state:u})})(e.targetChange.targetChangeType||"NO_CHANGE"),r=e.targetChange.targetIds||[],s=(function(u,f){return u.useProto3Json?(fe(f===void 0||typeof f=="string",58123),Ye.fromBase64String(f||"")):(fe(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),Ye.fromUint8Array(f||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&(function(u){const f=u.code===void 0?P.UNKNOWN:T_(u.code);return new M(f,u.message||"")})(o);t=new I_(i,r,s,l||null)}else if("documentChange"in e){e.documentChange;const i=e.documentChange;i.document,i.document.name,i.document.updateTime;const r=dc(n,i.document.name),s=Xt(i.document.updateTime),o=i.document.createTime?Xt(i.document.createTime):Q.min(),l=new ut({mapValue:{fields:i.document.fields}}),c=nt.newFoundDocument(r,s,o,l),u=i.targetIds||[],f=i.removedTargetIds||[];t=new pa(u,f,c.key,c)}else if("documentDelete"in e){e.documentDelete;const i=e.documentDelete;i.document;const r=dc(n,i.document),s=i.readTime?Xt(i.readTime):Q.min(),o=nt.newNoDocument(r,s),l=i.removedTargetIds||[];t=new pa([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const i=e.documentRemove;i.document;const r=dc(n,i.document),s=i.removedTargetIds||[];t=new pa([],s,r,null)}else{if(!("filter"in e))return $(11601,{At:e});{e.filter;const i=e.filter;i.targetId;const{count:r=0,unchangedNames:s}=i,o=new dC(r,s),l=i.targetId;t=new w_(l,o)}}return t}function IC(n,e){let t;if(e instanceof _o)t={update:up(n,e.key,e.value)};else if(e instanceof El)t={delete:Kc(n,e.key)};else if(e instanceof li)t={update:up(n,e.key,e.data),updateMask:DC(e.fieldMask)};else{if(!(e instanceof cC))return $(16599,{Rt:e.type});t={verify:Kc(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((i=>(function(s,o){const l=o.transform;if(l instanceof Qs)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Ys)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Xs)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Oa)return{fieldPath:o.field.canonicalString(),increment:l.Ee};throw $(20930,{transform:o.transform})})(0,i)))),e.precondition.isNone||(t.currentDocument=(function(r,s){return s.updateTime!==void 0?{updateTime:EC(r,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:$(27497)})(n,e.precondition)),t}function AC(n,e){return n&&n.length>0?(fe(e!==void 0,14353),n.map((t=>(function(r,s){let o=r.updateTime?Xt(r.updateTime):Xt(s);return o.isEqual(Q.min())&&(o=Xt(s)),new oC(o,r.transformResults||[])})(t,e)))):[]}function CC(n,e){return{documents:[S_(n,e.path)]}}function SC(n,e){const t={structuredQuery:{}},i=e.path;let r;e.collectionGroup!==null?(r=i,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(r=i.popLast(),t.structuredQuery.from=[{collectionId:i.lastSegment()}]),t.parent=S_(n,r);const s=(function(u){if(u.length!==0)return P_(qt.create(u,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const o=(function(u){if(u.length!==0)return u.map((f=>(function(m){return{field:ur(m.field),direction:PC(m.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const l=Hc(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(u){return{before:u.inclusive,values:u.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(u){return{before:!u.inclusive,values:u.position}})(e.endAt)),{Vt:t,parent:r}}function RC(n){let e=TC(n.parent);const t=n.structuredQuery,i=t.from?t.from.length:0;let r=null;if(i>0){fe(i===1,65062);const f=t.from[0];f.allDescendants?r=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=(function(p){const m=b_(p);return m instanceof qt&&s_(m)?m.getFilters():[m]})(t.where));let o=[];t.orderBy&&(o=(function(p){return p.map((m=>(function(I){return new Ks(hr(I.field),(function(N){switch(N){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(I.direction))})(m)))})(t.orderBy));let l=null;t.limit&&(l=(function(p){let m;return m=typeof p=="object"?p.value:p,fl(m)?null:m})(t.limit));let c=null;t.startAt&&(c=(function(p){const m=!!p.before,v=p.values||[];return new kr(v,m)})(t.startAt));let u=null;return t.endAt&&(u=(function(p){const m=!p.before,v=p.values||[];return new kr(v,m)})(t.endAt)),HA(e,r,o,s,l,"F",c,u)}function bC(n,e){const t=(function(r){switch(r){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return $(28987,{purpose:r})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function b_(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const i=hr(t.unaryFilter.field);return Oe.create(i,"==",{doubleValue:NaN});case"IS_NULL":const r=hr(t.unaryFilter.field);return Oe.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=hr(t.unaryFilter.field);return Oe.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=hr(t.unaryFilter.field);return Oe.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return $(61313);default:return $(60726)}})(n):n.fieldFilter!==void 0?(function(t){return Oe.create(hr(t.fieldFilter.field),(function(r){switch(r){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return $(58110);default:return $(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return qt.create(t.compositeFilter.filters.map((i=>b_(i))),(function(r){switch(r){case"AND":return"and";case"OR":return"or";default:return $(1026)}})(t.compositeFilter.op))})(n):$(30097,{filter:n})}function PC(n){return gC[n]}function kC(n){return _C[n]}function NC(n){return yC[n]}function ur(n){return{fieldPath:n.canonicalString()}}function hr(n){return Qe.fromServerFormat(n.fieldPath)}function P_(n){return n instanceof Oe?(function(t){if(t.op==="=="){if(Xf(t.value))return{unaryFilter:{field:ur(t.field),op:"IS_NAN"}};if(Yf(t.value))return{unaryFilter:{field:ur(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Xf(t.value))return{unaryFilter:{field:ur(t.field),op:"IS_NOT_NAN"}};if(Yf(t.value))return{unaryFilter:{field:ur(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ur(t.field),op:kC(t.op),value:t.value}}})(n):n instanceof qt?(function(t){const i=t.getFilters().map((r=>P_(r)));return i.length===1?i[0]:{compositeFilter:{op:NC(t.op),filters:i}}})(n):$(54877,{filter:n})}function DC(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function k_(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{constructor(e,t,i,r,s=Q.min(),o=Q.min(),l=Ye.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=i,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=c}withSequenceNumber(e){return new Fn(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Fn(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Fn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Fn(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OC{constructor(e){this.gt=e}}function xC(n){const e=RC({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Da(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LC{constructor(){this.Dn=new VC}addToCollectionParentIndex(e,t){return this.Dn.add(t),O.resolve()}getCollectionParents(e,t){return O.resolve(this.Dn.getEntries(t))}addFieldIndex(e,t){return O.resolve()}deleteFieldIndex(e,t){return O.resolve()}deleteAllFieldIndexes(e){return O.resolve()}createTargetIndexes(e,t){return O.resolve()}getDocumentsMatchingTarget(e,t){return O.resolve(null)}getIndexType(e,t){return O.resolve(0)}getFieldIndexes(e,t){return O.resolve([])}getNextCollectionGroupToUpdate(e){return O.resolve(null)}getMinOffset(e,t){return O.resolve(Yn.min())}getMinOffsetFromCollectionGroup(e,t){return O.resolve(Yn.min())}updateCollectionGroup(e,t,i){return O.resolve()}updateIndexEntries(e,t){return O.resolve()}}class VC{constructor(){this.index={}}add(e){const t=e.lastSegment(),i=e.popLast(),r=this.index[t]||new Ue(ge.comparator),s=!r.has(i);return this.index[t]=r.add(i),s}has(e){const t=e.lastSegment(),i=e.popLast(),r=this.index[t];return r&&r.has(i)}getEntries(e){return(this.index[e]||new Ue(ge.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hp={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},N_=41943040;class ct{static withCacheSize(e){return new ct(e,ct.DEFAULT_COLLECTION_PERCENTILE,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,i){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ct.DEFAULT_COLLECTION_PERCENTILE=10,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ct.DEFAULT=new ct(N_,ct.DEFAULT_COLLECTION_PERCENTILE,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ct.DISABLED=new ct(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr{constructor(e){this._r=e}next(){return this._r+=2,this._r}static ar(){return new Nr(0)}static ur(){return new Nr(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dp="LruGarbageCollector",MC=1048576;function fp([n,e],[t,i]){const r=Z(n,t);return r===0?Z(e,i):r}class FC{constructor(e){this.Tr=e,this.buffer=new Ue(fp),this.Ir=0}dr(){return++this.Ir}Er(e){const t=[e,this.dr()];if(this.buffer.size<this.Tr)this.buffer=this.buffer.add(t);else{const i=this.buffer.last();fp(t,i)<0&&(this.buffer=this.buffer.delete(i).add(t))}}get maxValue(){return this.buffer.last()[0]}}class UC{constructor(e,t,i){this.garbageCollector=e,this.asyncQueue=t,this.localStore=i,this.Ar=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Ar&&(this.Ar.cancel(),this.Ar=null)}get started(){return this.Ar!==null}Rr(e){z(dp,`Garbage collection scheduled in ${e}ms`),this.Ar=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ar=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Hr(t)?z(dp,"Ignoring IndexedDB error during garbage collection: ",t):await $r(t)}await this.Rr(3e5)}))}}class BC{constructor(e,t){this.Vr=e,this.params=t}calculateTargetCount(e,t){return this.Vr.mr(e).next((i=>Math.floor(t/100*i)))}nthSequenceNumber(e,t){if(t===0)return O.resolve(dl.ue);const i=new FC(t);return this.Vr.forEachTarget(e,(r=>i.Er(r.sequenceNumber))).next((()=>this.Vr.gr(e,(r=>i.Er(r))))).next((()=>i.maxValue))}removeTargets(e,t,i){return this.Vr.removeTargets(e,t,i)}removeOrphanedDocuments(e,t){return this.Vr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(z("LruGarbageCollector","Garbage collection skipped; disabled"),O.resolve(hp)):this.getCacheSize(e).next((i=>i<this.params.cacheSizeCollectionThreshold?(z("LruGarbageCollector",`Garbage collection skipped; Cache size ${i} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),hp):this.pr(e,t)))}getCacheSize(e){return this.Vr.getCacheSize(e)}pr(e,t){let i,r,s,o,l,c,u;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(z("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),r=this.params.maximumSequenceNumbersToCollect):r=p,o=Date.now(),this.nthSequenceNumber(e,r)))).next((p=>(i=p,l=Date.now(),this.removeTargets(e,i,t)))).next((p=>(s=p,c=Date.now(),this.removeOrphanedDocuments(e,i)))).next((p=>(u=Date.now(),lr()<=ne.DEBUG&&z("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${r} in `+(l-o)+`ms
	Removed ${s} targets in `+(c-l)+`ms
	Removed ${p} documents in `+(u-c)+`ms
Total Duration: ${u-f}ms`),O.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:s,documentsRemoved:p}))))}}function jC(n,e){return new BC(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zC{constructor(){this.changes=new ji((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,nt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const i=this.changes.get(t);return i!==void 0?O.resolve(i):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qC{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WC{constructor(e,t,i,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=i,this.indexManager=r}getDocument(e,t){let i=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(i=r,this.remoteDocumentCache.getEntry(e,t)))).next((r=>(i!==null&&xs(i.mutation,r,At.empty(),Te.now()),r)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.getLocalViewOfDocuments(e,i,se()).next((()=>i))))}getLocalViewOfDocuments(e,t,i=se()){const r=Ii();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,i).next((s=>{let o=Rs();return s.forEach(((l,c)=>{o=o.insert(l,c.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const i=Ii();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,se())))}populateOverlays(e,t,i){const r=[];return i.forEach((s=>{t.has(s)||r.push(s)})),this.documentOverlayCache.getOverlays(e,r).next((s=>{s.forEach(((o,l)=>{t.set(o,l)}))}))}computeViews(e,t,i,r){let s=Cn();const o=Os(),l=(function(){return Os()})();return t.forEach(((c,u)=>{const f=i.get(u.key);r.has(u.key)&&(f===void 0||f.mutation instanceof li)?s=s.insert(u.key,u):f!==void 0?(o.set(u.key,f.mutation.getFieldMask()),xs(f.mutation,u,f.mutation.getFieldMask(),Te.now())):o.set(u.key,At.empty())})),this.recalculateAndSaveOverlays(e,s).next((c=>(c.forEach(((u,f)=>o.set(u,f))),t.forEach(((u,f)=>{var p;return l.set(u,new qC(f,(p=o.get(u))!==null&&p!==void 0?p:null))})),l)))}recalculateAndSaveOverlays(e,t){const i=Os();let r=new Ve(((o,l)=>o-l)),s=se();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const l of o)l.keys().forEach((c=>{const u=t.get(c);if(u===null)return;let f=i.get(c)||At.empty();f=l.applyToLocalView(u,f),i.set(c,f);const p=(r.get(l.batchId)||se()).add(c);r=r.insert(l.batchId,p)}))})).next((()=>{const o=[],l=r.getReverseIterator();for(;l.hasNext();){const c=l.getNext(),u=c.key,f=c.value,p=f_();f.forEach((m=>{if(!s.has(m)){const v=v_(t.get(m),i.get(m));v!==null&&p.set(m,v),s=s.add(m)}})),o.push(this.documentOverlayCache.saveOverlays(e,u,p))}return O.waitFor(o)})).next((()=>i))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((i=>this.recalculateAndSaveOverlays(e,i)))}getDocumentsMatchingQuery(e,t,i,r){return(function(o){return W.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Zu(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,i,r):this.getDocumentsMatchingCollectionQuery(e,t,i,r)}getNextDocuments(e,t,i,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,i,r).next((s=>{const o=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,i.largestBatchId,r-s.size):O.resolve(Ii());let l=Ws,c=s;return o.next((u=>O.forEach(u,((f,p)=>(l<p.largestBatchId&&(l=p.largestBatchId),s.get(f)?O.resolve():this.remoteDocumentCache.getEntry(e,f).next((m=>{c=c.insert(f,m)}))))).next((()=>this.populateOverlays(e,u,s))).next((()=>this.computeViews(e,c,u,se()))).next((f=>({batchId:l,changes:d_(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new W(t)).next((i=>{let r=Rs();return i.isFoundDocument()&&(r=r.insert(i.key,i)),r}))}getDocumentsMatchingCollectionGroupQuery(e,t,i,r){const s=t.collectionGroup;let o=Rs();return this.indexManager.getCollectionParents(e,s).next((l=>O.forEach(l,(c=>{const u=(function(p,m){return new Bi(m,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,c.child(s));return this.getDocumentsMatchingCollectionQuery(e,u,i,r).next((f=>{f.forEach(((p,m)=>{o=o.insert(p,m)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,i,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,i.largestBatchId).next((o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,i,s,r)))).next((o=>{s.forEach(((c,u)=>{const f=u.getKey();o.get(f)===null&&(o=o.insert(f,nt.newInvalidDocument(f)))}));let l=Rs();return o.forEach(((c,u)=>{const f=s.get(c);f!==void 0&&xs(f.mutation,u,At.empty(),Te.now()),_l(t,u)&&(l=l.insert(c,u))})),l}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $C{constructor(e){this.serializer=e,this.Br=new Map,this.Lr=new Map}getBundleMetadata(e,t){return O.resolve(this.Br.get(t))}saveBundleMetadata(e,t){return this.Br.set(t.id,(function(r){return{id:r.id,version:r.version,createTime:Xt(r.createTime)}})(t)),O.resolve()}getNamedQuery(e,t){return O.resolve(this.Lr.get(t))}saveNamedQuery(e,t){return this.Lr.set(t.name,(function(r){return{name:r.name,query:xC(r.bundledQuery),readTime:Xt(r.readTime)}})(t)),O.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class HC{constructor(){this.overlays=new Ve(W.comparator),this.kr=new Map}getOverlay(e,t){return O.resolve(this.overlays.get(t))}getOverlays(e,t){const i=Ii();return O.forEach(t,(r=>this.getOverlay(e,r).next((s=>{s!==null&&i.set(r,s)})))).next((()=>i))}saveOverlays(e,t,i){return i.forEach(((r,s)=>{this.wt(e,t,s)})),O.resolve()}removeOverlaysForBatchId(e,t,i){const r=this.kr.get(i);return r!==void 0&&(r.forEach((s=>this.overlays=this.overlays.remove(s))),this.kr.delete(i)),O.resolve()}getOverlaysForCollection(e,t,i){const r=Ii(),s=t.length+1,o=new W(t.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const c=l.getNext().value,u=c.getKey();if(!t.isPrefixOf(u.path))break;u.path.length===s&&c.largestBatchId>i&&r.set(c.getKey(),c)}return O.resolve(r)}getOverlaysForCollectionGroup(e,t,i,r){let s=new Ve(((u,f)=>u-f));const o=this.overlays.getIterator();for(;o.hasNext();){const u=o.getNext().value;if(u.getKey().getCollectionGroup()===t&&u.largestBatchId>i){let f=s.get(u.largestBatchId);f===null&&(f=Ii(),s=s.insert(u.largestBatchId,f)),f.set(u.getKey(),u)}}const l=Ii(),c=s.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((u,f)=>l.set(u,f))),!(l.size()>=r)););return O.resolve(l)}wt(e,t,i){const r=this.overlays.get(i.key);if(r!==null){const o=this.kr.get(r.largestBatchId).delete(i.key);this.kr.set(r.largestBatchId,o)}this.overlays=this.overlays.insert(i.key,new hC(t,i));let s=this.kr.get(t);s===void 0&&(s=se(),this.kr.set(t,s)),this.kr.set(t,s.add(i.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GC{constructor(){this.sessionToken=Ye.EMPTY_BYTE_STRING}getSessionToken(e){return O.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,O.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rh{constructor(){this.qr=new Ue(ze.Qr),this.$r=new Ue(ze.Ur)}isEmpty(){return this.qr.isEmpty()}addReference(e,t){const i=new ze(e,t);this.qr=this.qr.add(i),this.$r=this.$r.add(i)}Kr(e,t){e.forEach((i=>this.addReference(i,t)))}removeReference(e,t){this.Wr(new ze(e,t))}Gr(e,t){e.forEach((i=>this.removeReference(i,t)))}zr(e){const t=new W(new ge([])),i=new ze(t,e),r=new ze(t,e+1),s=[];return this.$r.forEachInRange([i,r],(o=>{this.Wr(o),s.push(o.key)})),s}jr(){this.qr.forEach((e=>this.Wr(e)))}Wr(e){this.qr=this.qr.delete(e),this.$r=this.$r.delete(e)}Jr(e){const t=new W(new ge([])),i=new ze(t,e),r=new ze(t,e+1);let s=se();return this.$r.forEachInRange([i,r],(o=>{s=s.add(o.key)})),s}containsKey(e){const t=new ze(e,0),i=this.qr.firstAfterOrEqual(t);return i!==null&&e.isEqual(i.key)}}class ze{constructor(e,t){this.key=e,this.Hr=t}static Qr(e,t){return W.comparator(e.key,t.key)||Z(e.Hr,t.Hr)}static Ur(e,t){return Z(e.Hr,t.Hr)||W.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class KC{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.er=1,this.Yr=new Ue(ze.Qr)}checkEmpty(e){return O.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,i,r){const s=this.er;this.er++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new uC(s,t,i,r);this.mutationQueue.push(o);for(const l of r)this.Yr=this.Yr.add(new ze(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return O.resolve(o)}lookupMutationBatch(e,t){return O.resolve(this.Zr(t))}getNextMutationBatchAfterBatchId(e,t){const i=t+1,r=this.Xr(i),s=r<0?0:r;return O.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return O.resolve(this.mutationQueue.length===0?Ku:this.er-1)}getAllMutationBatches(e){return O.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const i=new ze(t,0),r=new ze(t,Number.POSITIVE_INFINITY),s=[];return this.Yr.forEachInRange([i,r],(o=>{const l=this.Zr(o.Hr);s.push(l)})),O.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let i=new Ue(Z);return t.forEach((r=>{const s=new ze(r,0),o=new ze(r,Number.POSITIVE_INFINITY);this.Yr.forEachInRange([s,o],(l=>{i=i.add(l.Hr)}))})),O.resolve(this.ei(i))}getAllMutationBatchesAffectingQuery(e,t){const i=t.path,r=i.length+1;let s=i;W.isDocumentKey(s)||(s=s.child(""));const o=new ze(new W(s),0);let l=new Ue(Z);return this.Yr.forEachWhile((c=>{const u=c.key.path;return!!i.isPrefixOf(u)&&(u.length===r&&(l=l.add(c.Hr)),!0)}),o),O.resolve(this.ei(l))}ei(e){const t=[];return e.forEach((i=>{const r=this.Zr(i);r!==null&&t.push(r)})),t}removeMutationBatch(e,t){fe(this.ti(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let i=this.Yr;return O.forEach(t.mutations,(r=>{const s=new ze(r.key,t.batchId);return i=i.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.Yr=i}))}rr(e){}containsKey(e,t){const i=new ze(t,0),r=this.Yr.firstAfterOrEqual(i);return O.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,O.resolve()}ti(e,t){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const t=this.Xr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QC{constructor(e){this.ni=e,this.docs=(function(){return new Ve(W.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const i=t.key,r=this.docs.get(i),s=r?r.size:0,o=this.ni(t);return this.docs=this.docs.insert(i,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,i.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const i=this.docs.get(t);return O.resolve(i?i.document.mutableCopy():nt.newInvalidDocument(t))}getEntries(e,t){let i=Cn();return t.forEach((r=>{const s=this.docs.get(r);i=i.insert(r,s?s.document.mutableCopy():nt.newInvalidDocument(r))})),O.resolve(i)}getDocumentsMatchingQuery(e,t,i,r){let s=Cn();const o=t.path,l=new W(o.child("__id-9223372036854775808__")),c=this.docs.getIteratorFrom(l);for(;c.hasNext();){const{key:u,value:{document:f}}=c.getNext();if(!o.isPrefixOf(u.path))break;u.path.length>o.length+1||AA(IA(f),i)<=0||(r.has(f.key)||_l(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return O.resolve(s)}getAllFromCollectionGroup(e,t,i,r){$(9500)}ri(e,t){return O.forEach(this.docs,(i=>t(i)))}newChangeBuffer(e){return new YC(this)}getSize(e){return O.resolve(this.size)}}class YC extends zC{constructor(e){super(),this.Or=e}applyChanges(e){const t=[];return this.changes.forEach(((i,r)=>{r.isValidDocument()?t.push(this.Or.addEntry(e,r)):this.Or.removeEntry(i)})),O.waitFor(t)}getFromCache(e,t){return this.Or.getEntry(e,t)}getAllFromCache(e,t){return this.Or.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XC{constructor(e){this.persistence=e,this.ii=new ji((t=>Yu(t)),Xu),this.lastRemoteSnapshotVersion=Q.min(),this.highestTargetId=0,this.si=0,this.oi=new rh,this.targetCount=0,this._i=Nr.ar()}forEachTarget(e,t){return this.ii.forEach(((i,r)=>t(r))),O.resolve()}getLastRemoteSnapshotVersion(e){return O.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return O.resolve(this.si)}allocateTargetId(e){return this.highestTargetId=this._i.next(),O.resolve(this.highestTargetId)}setTargetsMetadata(e,t,i){return i&&(this.lastRemoteSnapshotVersion=i),t>this.si&&(this.si=t),O.resolve()}hr(e){this.ii.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this._i=new Nr(t),this.highestTargetId=t),e.sequenceNumber>this.si&&(this.si=e.sequenceNumber)}addTargetData(e,t){return this.hr(t),this.targetCount+=1,O.resolve()}updateTargetData(e,t){return this.hr(t),O.resolve()}removeTargetData(e,t){return this.ii.delete(t.target),this.oi.zr(t.targetId),this.targetCount-=1,O.resolve()}removeTargets(e,t,i){let r=0;const s=[];return this.ii.forEach(((o,l)=>{l.sequenceNumber<=t&&i.get(l.targetId)===null&&(this.ii.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),r++)})),O.waitFor(s).next((()=>r))}getTargetCount(e){return O.resolve(this.targetCount)}getTargetData(e,t){const i=this.ii.get(t)||null;return O.resolve(i)}addMatchingKeys(e,t,i){return this.oi.Kr(t,i),O.resolve()}removeMatchingKeys(e,t,i){this.oi.Gr(t,i);const r=this.persistence.referenceDelegate,s=[];return r&&t.forEach((o=>{s.push(r.markPotentiallyOrphaned(e,o))})),O.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.oi.zr(t),O.resolve()}getMatchingKeysForTargetId(e,t){const i=this.oi.Jr(t);return O.resolve(i)}containsKey(e,t){return O.resolve(this.oi.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class D_{constructor(e,t){this.ai={},this.overlays={},this.ui=new dl(0),this.ci=!1,this.ci=!0,this.li=new GC,this.referenceDelegate=e(this),this.hi=new XC(this),this.indexManager=new LC,this.remoteDocumentCache=(function(r){return new QC(r)})((i=>this.referenceDelegate.Pi(i))),this.serializer=new OC(t),this.Ti=new $C(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ci=!1,Promise.resolve()}get started(){return this.ci}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new HC,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let i=this.ai[e.toKey()];return i||(i=new KC(t,this.referenceDelegate),this.ai[e.toKey()]=i),i}getGlobalsCache(){return this.li}getTargetCache(){return this.hi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ti}runTransaction(e,t,i){z("MemoryPersistence","Starting transaction:",e);const r=new JC(this.ui.next());return this.referenceDelegate.Ii(),i(r).next((s=>this.referenceDelegate.di(r).next((()=>s)))).toPromise().then((s=>(r.raiseOnCommittedEvent(),s)))}Ei(e,t){return O.or(Object.values(this.ai).map((i=>()=>i.containsKey(e,t))))}}class JC extends SA{constructor(e){super(),this.currentSequenceNumber=e}}class sh{constructor(e){this.persistence=e,this.Ai=new rh,this.Ri=null}static Vi(e){return new sh(e)}get mi(){if(this.Ri)return this.Ri;throw $(60996)}addReference(e,t,i){return this.Ai.addReference(i,t),this.mi.delete(i.toString()),O.resolve()}removeReference(e,t,i){return this.Ai.removeReference(i,t),this.mi.add(i.toString()),O.resolve()}markPotentiallyOrphaned(e,t){return this.mi.add(t.toString()),O.resolve()}removeTarget(e,t){this.Ai.zr(t.targetId).forEach((r=>this.mi.add(r.toString())));const i=this.persistence.getTargetCache();return i.getMatchingKeysForTargetId(e,t.targetId).next((r=>{r.forEach((s=>this.mi.add(s.toString())))})).next((()=>i.removeTargetData(e,t)))}Ii(){this.Ri=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return O.forEach(this.mi,(i=>{const r=W.fromPath(i);return this.fi(e,r).next((s=>{s||t.removeEntry(r,Q.min())}))})).next((()=>(this.Ri=null,t.apply(e))))}updateLimboDocument(e,t){return this.fi(e,t).next((i=>{i?this.mi.delete(t.toString()):this.mi.add(t.toString())}))}Pi(e){return 0}fi(e,t){return O.or([()=>O.resolve(this.Ai.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ei(e,t)])}}class La{constructor(e,t){this.persistence=e,this.gi=new ji((i=>PA(i.path)),((i,r)=>i.isEqual(r))),this.garbageCollector=jC(this,t)}static Vi(e,t){return new La(e,t)}Ii(){}di(e){return O.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}mr(e){const t=this.yr(e);return this.persistence.getTargetCache().getTargetCount(e).next((i=>t.next((r=>i+r))))}yr(e){let t=0;return this.gr(e,(i=>{t++})).next((()=>t))}gr(e,t){return O.forEach(this.gi,((i,r)=>this.Sr(e,i,r).next((s=>s?O.resolve():t(r)))))}removeTargets(e,t,i){return this.persistence.getTargetCache().removeTargets(e,t,i)}removeOrphanedDocuments(e,t){let i=0;const r=this.persistence.getRemoteDocumentCache(),s=r.newChangeBuffer();return r.ri(e,(o=>this.Sr(e,o,t).next((l=>{l||(i++,s.removeEntry(o,Q.min()))})))).next((()=>s.apply(e))).next((()=>i))}markPotentiallyOrphaned(e,t){return this.gi.set(t,e.currentSequenceNumber),O.resolve()}removeTarget(e,t){const i=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,i)}addReference(e,t,i){return this.gi.set(i,e.currentSequenceNumber),O.resolve()}removeReference(e,t,i){return this.gi.set(i,e.currentSequenceNumber),O.resolve()}updateLimboDocument(e,t){return this.gi.set(t,e.currentSequenceNumber),O.resolve()}Pi(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ha(e.data.value)),t}Sr(e,t,i){return O.or([()=>this.persistence.Ei(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const r=this.gi.get(t);return O.resolve(r!==void 0&&r>i)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh{constructor(e,t,i,r){this.targetId=e,this.fromCache=t,this.Is=i,this.ds=r}static Es(e,t){let i=se(),r=se();for(const s of t.docChanges)switch(s.type){case 0:i=i.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new oh(e,t.fromCache,i,r)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZC{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eS{constructor(){this.As=!1,this.Rs=!1,this.Vs=100,this.fs=(function(){return jE()?8:RA(it())>0?6:4})()}initialize(e,t){this.gs=e,this.indexManager=t,this.As=!0}getDocumentsMatchingQuery(e,t,i,r){const s={result:null};return this.ps(e,t).next((o=>{s.result=o})).next((()=>{if(!s.result)return this.ys(e,t,r,i).next((o=>{s.result=o}))})).next((()=>{if(s.result)return;const o=new ZC;return this.ws(e,t,o).next((l=>{if(s.result=l,this.Rs)return this.Ss(e,t,o,l.size)}))})).next((()=>s.result))}Ss(e,t,i,r){return i.documentReadCount<this.Vs?(lr()<=ne.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",cr(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),O.resolve()):(lr()<=ne.DEBUG&&z("QueryEngine","Query:",cr(t),"scans",i.documentReadCount,"local documents and returns",r,"documents as results."),i.documentReadCount>this.fs*r?(lr()<=ne.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",cr(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Yt(t))):O.resolve())}ps(e,t){if(tp(t))return O.resolve(null);let i=Yt(t);return this.indexManager.getIndexType(e,i).next((r=>r===0?null:(t.limit!==null&&r===1&&(t=Da(t,null,"F"),i=Yt(t)),this.indexManager.getDocumentsMatchingTarget(e,i).next((s=>{const o=se(...s);return this.gs.getDocuments(e,o).next((l=>this.indexManager.getMinOffset(e,i).next((c=>{const u=this.bs(t,l);return this.Ds(t,u,o,c.readTime)?this.ps(e,Da(t,null,"F")):this.vs(e,u,t,c)}))))})))))}ys(e,t,i,r){return tp(t)||r.isEqual(Q.min())?O.resolve(null):this.gs.getDocuments(e,i).next((s=>{const o=this.bs(t,s);return this.Ds(t,o,i,r)?O.resolve(null):(lr()<=ne.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),cr(t)),this.vs(e,o,t,wA(r,Ws)).next((l=>l)))}))}bs(e,t){let i=new Ue(u_(e));return t.forEach(((r,s)=>{_l(e,s)&&(i=i.add(s))})),i}Ds(e,t,i,r){if(e.limit===null)return!1;if(i.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}ws(e,t,i){return lr()<=ne.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",cr(t)),this.gs.getDocumentsMatchingQuery(e,t,Yn.min(),i)}vs(e,t,i,r){return this.gs.getDocumentsMatchingQuery(e,i,r).next((s=>(t.forEach((o=>{s=s.insert(o.key,o)})),s)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ah="LocalStore",tS=3e8;class nS{constructor(e,t,i,r){this.persistence=e,this.Cs=t,this.serializer=r,this.Fs=new Ve(Z),this.Ms=new ji((s=>Yu(s)),Xu),this.xs=new Map,this.Os=e.getRemoteDocumentCache(),this.hi=e.getTargetCache(),this.Ti=e.getBundleCache(),this.Ns(i)}Ns(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new WC(this.Os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Os.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Fs)))}}function iS(n,e,t,i){return new nS(n,e,t,i)}async function O_(n,e){const t=J(n);return await t.persistence.runTransaction("Handle user change","readonly",(i=>{let r;return t.mutationQueue.getAllMutationBatches(i).next((s=>(r=s,t.Ns(e),t.mutationQueue.getAllMutationBatches(i)))).next((s=>{const o=[],l=[];let c=se();for(const u of r){o.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}for(const u of s){l.push(u.batchId);for(const f of u.mutations)c=c.add(f.key)}return t.localDocuments.getDocuments(i,c).next((u=>({Bs:u,removedBatchIds:o,addedBatchIds:l})))}))}))}function rS(n,e){const t=J(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(i=>{const r=e.batch.keys(),s=t.Os.newChangeBuffer({trackRemovals:!0});return(function(l,c,u,f){const p=u.batch,m=p.keys();let v=O.resolve();return m.forEach((I=>{v=v.next((()=>f.getEntry(c,I))).next((k=>{const N=u.docVersions.get(I);fe(N!==null,48541),k.version.compareTo(N)<0&&(p.applyToRemoteDocument(k,u),k.isValidDocument()&&(k.setReadTime(u.commitVersion),f.addEntry(k)))}))})),v.next((()=>l.mutationQueue.removeMutationBatch(c,p)))})(t,i,e,s).next((()=>s.apply(i))).next((()=>t.mutationQueue.performConsistencyCheck(i))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(i,r,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(i,(function(l){let c=se();for(let u=0;u<l.mutationResults.length;++u)l.mutationResults[u].transformResults.length>0&&(c=c.add(l.batch.mutations[u].key));return c})(e)))).next((()=>t.localDocuments.getDocuments(i,r)))}))}function x_(n){const e=J(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.hi.getLastRemoteSnapshotVersion(t)))}function sS(n,e){const t=J(n),i=e.snapshotVersion;let r=t.Fs;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(s=>{const o=t.Os.newChangeBuffer({trackRemovals:!0});r=t.Fs;const l=[];e.targetChanges.forEach(((f,p)=>{const m=r.get(p);if(!m)return;l.push(t.hi.removeMatchingKeys(s,f.removedDocuments,p).next((()=>t.hi.addMatchingKeys(s,f.addedDocuments,p))));let v=m.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?v=v.withResumeToken(Ye.EMPTY_BYTE_STRING,Q.min()).withLastLimboFreeSnapshotVersion(Q.min()):f.resumeToken.approximateByteSize()>0&&(v=v.withResumeToken(f.resumeToken,i)),r=r.insert(p,v),(function(k,N,x){return k.resumeToken.approximateByteSize()===0||N.snapshotVersion.toMicroseconds()-k.snapshotVersion.toMicroseconds()>=tS?!0:x.addedDocuments.size+x.modifiedDocuments.size+x.removedDocuments.size>0})(m,v,f)&&l.push(t.hi.updateTargetData(s,v))}));let c=Cn(),u=se();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))})),l.push(oS(s,o,e.documentUpdates).next((f=>{c=f.Ls,u=f.ks}))),!i.isEqual(Q.min())){const f=t.hi.getLastRemoteSnapshotVersion(s).next((p=>t.hi.setTargetsMetadata(s,s.currentSequenceNumber,i)));l.push(f)}return O.waitFor(l).next((()=>o.apply(s))).next((()=>t.localDocuments.getLocalViewOfDocuments(s,c,u))).next((()=>c))})).then((s=>(t.Fs=r,s)))}function oS(n,e,t){let i=se(),r=se();return t.forEach((s=>i=i.add(s))),e.getEntries(n,i).next((s=>{let o=Cn();return t.forEach(((l,c)=>{const u=s.get(l);c.isFoundDocument()!==u.isFoundDocument()&&(r=r.add(l)),c.isNoDocument()&&c.version.isEqual(Q.min())?(e.removeEntry(l,c.readTime),o=o.insert(l,c)):!u.isValidDocument()||c.version.compareTo(u.version)>0||c.version.compareTo(u.version)===0&&u.hasPendingWrites?(e.addEntry(c),o=o.insert(l,c)):z(ah,"Ignoring outdated watch update for ",l,". Current version:",u.version," Watch version:",c.version)})),{Ls:o,ks:r}}))}function aS(n,e){const t=J(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(i=>(e===void 0&&(e=Ku),t.mutationQueue.getNextMutationBatchAfterBatchId(i,e))))}function lS(n,e){const t=J(n);return t.persistence.runTransaction("Allocate target","readwrite",(i=>{let r;return t.hi.getTargetData(i,e).next((s=>s?(r=s,O.resolve(r)):t.hi.allocateTargetId(i).next((o=>(r=new Fn(e,o,"TargetPurposeListen",i.currentSequenceNumber),t.hi.addTargetData(i,r).next((()=>r)))))))})).then((i=>{const r=t.Fs.get(i.targetId);return(r===null||i.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(t.Fs=t.Fs.insert(i.targetId,i),t.Ms.set(e,i.targetId)),i}))}async function Yc(n,e,t){const i=J(n),r=i.Fs.get(e),s=t?"readwrite":"readwrite-primary";try{t||await i.persistence.runTransaction("Release target",s,(o=>i.persistence.referenceDelegate.removeTarget(o,r)))}catch(o){if(!Hr(o))throw o;z(ah,`Failed to update sequence numbers for target ${e}: ${o}`)}i.Fs=i.Fs.remove(e),i.Ms.delete(r.target)}function pp(n,e,t){const i=J(n);let r=Q.min(),s=se();return i.persistence.runTransaction("Execute query","readwrite",(o=>(function(c,u,f){const p=J(c),m=p.Ms.get(f);return m!==void 0?O.resolve(p.Fs.get(m)):p.hi.getTargetData(u,f)})(i,o,Yt(e)).next((l=>{if(l)return r=l.lastLimboFreeSnapshotVersion,i.hi.getMatchingKeysForTargetId(o,l.targetId).next((c=>{s=c}))})).next((()=>i.Cs.getDocumentsMatchingQuery(o,e,t?r:Q.min(),t?s:se()))).next((l=>(cS(i,KA(e),l),{documents:l,qs:s})))))}function cS(n,e,t){let i=n.xs.get(e)||Q.min();t.forEach(((r,s)=>{s.readTime.compareTo(i)>0&&(i=s.readTime)})),n.xs.set(e,i)}class mp{constructor(){this.activeTargetIds=eC()}Gs(e){this.activeTargetIds=this.activeTargetIds.add(e)}zs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class uS{constructor(){this.Fo=new mp,this.Mo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,i){}addLocalQueryTarget(e,t=!0){return t&&this.Fo.Gs(e),this.Mo[e]||"not-current"}updateQueryState(e,t,i){this.Mo[e]=t}removeLocalQueryTarget(e){this.Fo.zs(e)}isLocalQueryTarget(e){return this.Fo.activeTargetIds.has(e)}clearQueryState(e){delete this.Mo[e]}getAllActiveQueryTargets(){return this.Fo.activeTargetIds}isActiveQueryTarget(e){return this.Fo.activeTargetIds.has(e)}start(){return this.Fo=new mp,Promise.resolve()}handleUserChange(e,t,i){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hS{xo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gp="ConnectivityMonitor";class _p{constructor(){this.Oo=()=>this.No(),this.Bo=()=>this.Lo(),this.ko=[],this.qo()}xo(e){this.ko.push(e)}shutdown(){window.removeEventListener("online",this.Oo),window.removeEventListener("offline",this.Bo)}qo(){window.addEventListener("online",this.Oo),window.addEventListener("offline",this.Bo)}No(){z(gp,"Network connectivity changed: AVAILABLE");for(const e of this.ko)e(0)}Lo(){z(gp,"Network connectivity changed: UNAVAILABLE");for(const e of this.ko)e(1)}static C(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ta=null;function Xc(){return ta===null?ta=(function(){return 268435456+Math.round(2147483648*Math.random())})():ta++,"0x"+ta.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fc="RestConnection",dS={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class fS{get Qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.$o=t+"://"+e.host,this.Uo=`projects/${i}/databases/${r}`,this.Ko=this.databaseId.database===Pa?`project_id=${i}`:`project_id=${i}&database_id=${r}`}Wo(e,t,i,r,s){const o=Xc(),l=this.Go(e,t.toUriEncodedString());z(fc,`Sending RPC '${e}' ${o}:`,l,i);const c={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.Ko};this.zo(c,r,s);const{host:u}=new URL(l),f=oi(u);return this.jo(e,l,c,i,f).then((p=>(z(fc,`Received RPC '${e}' ${o}: `,p),p)),(p=>{throw Qn(fc,`RPC '${e}' ${o} failed with error: `,p,"url: ",l,"request:",i),p}))}Jo(e,t,i,r,s,o){return this.Wo(e,t,i,r,s)}zo(e,t,i){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Wr})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((r,s)=>e[s]=r)),i&&i.headers.forEach(((r,s)=>e[s]=r))}Go(e,t){const i=dS[e];return`${this.$o}/v1/${t}:${i}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pS{constructor(e){this.Ho=e.Ho,this.Yo=e.Yo}Zo(e){this.Xo=e}e_(e){this.t_=e}n_(e){this.r_=e}onMessage(e){this.i_=e}close(){this.Yo()}send(e){this.Ho(e)}s_(){this.Xo()}o_(){this.t_()}__(e){this.r_(e)}a_(e){this.i_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et="WebChannelConnection";class mS extends fS{constructor(e){super(e),this.u_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}jo(e,t,i,r,s){const o=Xc();return new Promise(((l,c)=>{const u=new Mg;u.setWithCredentials(!0),u.listenOnce(Fg.COMPLETE,(()=>{try{switch(u.getLastErrorCode()){case ua.NO_ERROR:const p=u.getResponseJson();z(et,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),l(p);break;case ua.TIMEOUT:z(et,`RPC '${e}' ${o} timed out`),c(new M(P.DEADLINE_EXCEEDED,"Request time out"));break;case ua.HTTP_ERROR:const m=u.getStatus();if(z(et,`RPC '${e}' ${o} failed with status:`,m,"response text:",u.getResponseText()),m>0){let v=u.getResponseJson();Array.isArray(v)&&(v=v[0]);const I=v==null?void 0:v.error;if(I&&I.status&&I.message){const k=(function(x){const j=x.toLowerCase().replace(/_/g,"-");return Object.values(P).indexOf(j)>=0?j:P.UNKNOWN})(I.status);c(new M(k,I.message))}else c(new M(P.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new M(P.UNAVAILABLE,"Connection failed."));break;default:$(9055,{c_:e,streamId:o,l_:u.getLastErrorCode(),h_:u.getLastError()})}}finally{z(et,`RPC '${e}' ${o} completed.`)}}));const f=JSON.stringify(r);z(et,`RPC '${e}' ${o} sending request:`,r),u.send(t,"POST",f,i,15)}))}P_(e,t,i){const r=Xc(),s=[this.$o,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=jg(),l=Bg(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.zo(c.initMessageHeaders,t,i),c.encodeInitMessageHeaders=!0;const f=s.join("");z(et,`Creating RPC '${e}' stream ${r}: ${f}`,c);const p=o.createWebChannel(f,c);this.T_(p);let m=!1,v=!1;const I=new pS({Ho:N=>{v?z(et,`Not sending because RPC '${e}' stream ${r} is closed:`,N):(m||(z(et,`Opening RPC '${e}' stream ${r} transport.`),p.open(),m=!0),z(et,`RPC '${e}' stream ${r} sending:`,N),p.send(N))},Yo:()=>p.close()}),k=(N,x,j)=>{N.listen(x,(B=>{try{j(B)}catch(te){setTimeout((()=>{throw te}),0)}}))};return k(p,Ss.EventType.OPEN,(()=>{v||(z(et,`RPC '${e}' stream ${r} transport opened.`),I.s_())})),k(p,Ss.EventType.CLOSE,(()=>{v||(v=!0,z(et,`RPC '${e}' stream ${r} transport closed`),I.__(),this.I_(p))})),k(p,Ss.EventType.ERROR,(N=>{v||(v=!0,Qn(et,`RPC '${e}' stream ${r} transport errored. Name:`,N.name,"Message:",N.message),I.__(new M(P.UNAVAILABLE,"The operation could not be completed")))})),k(p,Ss.EventType.MESSAGE,(N=>{var x;if(!v){const j=N.data[0];fe(!!j,16349);const B=j,te=(B==null?void 0:B.error)||((x=B[0])===null||x===void 0?void 0:x.error);if(te){z(et,`RPC '${e}' stream ${r} received error:`,te);const q=te.status;let ce=(function(E){const T=De[E];if(T!==void 0)return T_(T)})(q),A=te.message;ce===void 0&&(ce=P.INTERNAL,A="Unknown error status: "+q+" with message "+te.message),v=!0,I.__(new M(ce,A)),p.close()}else z(et,`RPC '${e}' stream ${r} received:`,j),I.a_(j)}})),k(l,Ug.STAT_EVENT,(N=>{N.stat===Fc.PROXY?z(et,`RPC '${e}' stream ${r} detected buffering proxy`):N.stat===Fc.NOPROXY&&z(et,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{I.o_()}),0),I}terminate(){this.u_.forEach((e=>e.close())),this.u_=[]}T_(e){this.u_.push(e)}I_(e){this.u_=this.u_.filter((t=>t===e))}}function pc(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wl(n){return new vC(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L_{constructor(e,t,i=1e3,r=1.5,s=6e4){this.Fi=e,this.timerId=t,this.d_=i,this.E_=r,this.A_=s,this.R_=0,this.V_=null,this.m_=Date.now(),this.reset()}reset(){this.R_=0}f_(){this.R_=this.A_}g_(e){this.cancel();const t=Math.floor(this.R_+this.p_()),i=Math.max(0,Date.now()-this.m_),r=Math.max(0,t-i);r>0&&z("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.R_} ms, delay with jitter: ${t} ms, last attempt: ${i} ms ago)`),this.V_=this.Fi.enqueueAfterDelay(this.timerId,r,(()=>(this.m_=Date.now(),e()))),this.R_*=this.E_,this.R_<this.d_&&(this.R_=this.d_),this.R_>this.A_&&(this.R_=this.A_)}y_(){this.V_!==null&&(this.V_.skipDelay(),this.V_=null)}cancel(){this.V_!==null&&(this.V_.cancel(),this.V_=null)}p_(){return(Math.random()-.5)*this.R_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yp="PersistentStream";class V_{constructor(e,t,i,r,s,o,l,c){this.Fi=e,this.w_=i,this.S_=r,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=c,this.state=0,this.b_=0,this.D_=null,this.v_=null,this.stream=null,this.C_=0,this.F_=new L_(e,t)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.C_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Fi.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(e){this.q_(),this.stream.send(e)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}Q_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.q_(),this.Q_(),this.F_.cancel(),this.b_++,e!==4?this.F_.reset():t&&t.code===P.RESOURCE_EXHAUSTED?(An(t.toString()),An("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):t&&t.code===P.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.n_(t)}U_(){}auth(){this.state=1;const e=this.K_(this.b_),t=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([i,r])=>{this.b_===t&&this.W_(i,r)}),(i=>{e((()=>{const r=new M(P.UNKNOWN,"Fetching auth token failed: "+i.message);return this.G_(r)}))}))}W_(e,t){const i=this.K_(this.b_);this.stream=this.z_(e,t),this.stream.Zo((()=>{i((()=>this.listener.Zo()))})),this.stream.e_((()=>{i((()=>(this.state=2,this.v_=this.Fi.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.e_())))})),this.stream.n_((r=>{i((()=>this.G_(r)))})),this.stream.onMessage((r=>{i((()=>++this.C_==1?this.j_(r):this.onNext(r)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(e){return z(yp,`close with error: ${e}`),this.stream=null,this.close(4,e)}K_(e){return t=>{this.Fi.enqueueAndForget((()=>this.b_===e?t():(z(yp,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class gS extends V_{constructor(e,t,i,r,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,i,r,o),this.serializer=s}z_(e,t){return this.connection.P_("Listen",e,t)}j_(e){return this.onNext(e)}onNext(e){this.F_.reset();const t=wC(this.serializer,e),i=(function(s){if(!("targetChange"in s))return Q.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Q.min():o.readTime?Xt(o.readTime):Q.min()})(e);return this.listener.J_(t,i)}H_(e){const t={};t.database=Qc(this.serializer),t.addTarget=(function(s,o){let l;const c=o.target;if(l=Wc(c)?{documents:CC(s,c)}:{query:SC(s,c).Vt},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=A_(s,o.resumeToken);const u=Hc(s,o.expectedCount);u!==null&&(l.expectedCount=u)}else if(o.snapshotVersion.compareTo(Q.min())>0){l.readTime=xa(s,o.snapshotVersion.toTimestamp());const u=Hc(s,o.expectedCount);u!==null&&(l.expectedCount=u)}return l})(this.serializer,e);const i=bC(this.serializer,e);i&&(t.labels=i),this.k_(t)}Y_(e){const t={};t.database=Qc(this.serializer),t.removeTarget=e,this.k_(t)}}class _S extends V_{constructor(e,t,i,r,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,i,r,o),this.serializer=s}get Z_(){return this.C_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.Z_&&this.X_([])}z_(e,t){return this.connection.P_("Write",e,t)}j_(e){return fe(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,fe(!e.writeResults||e.writeResults.length===0,55816),this.listener.ea()}onNext(e){fe(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.F_.reset();const t=AC(e.writeResults,e.commitTime),i=Xt(e.commitTime);return this.listener.ta(i,t)}na(){const e={};e.database=Qc(this.serializer),this.k_(e)}X_(e){const t={streamToken:this.lastStreamToken,writes:e.map((i=>IC(this.serializer,i)))};this.k_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yS{}class vS extends yS{constructor(e,t,i,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=i,this.serializer=r,this.ra=!1}ia(){if(this.ra)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,t,i,r){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,o])=>this.connection.Wo(e,Gc(t,i),r,s,o))).catch((s=>{throw s.name==="FirebaseError"?(s.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new M(P.UNKNOWN,s.toString())}))}Jo(e,t,i,r,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,l])=>this.connection.Jo(e,Gc(t,i),r,o,l,s))).catch((o=>{throw o.name==="FirebaseError"?(o.code===P.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new M(P.UNKNOWN,o.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}class ES{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(e){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ua("Offline")))}set(e){this.ha(),this.sa=0,e==="Online"&&(this._a=!1),this.ua(e)}ua(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ca(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(An(t),this._a=!1):z("OnlineStateTracker",t)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ki="RemoteStore";class TS{constructor(e,t,i,r,s){this.localStore=e,this.datastore=t,this.asyncQueue=i,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Set,this.da=[],this.Ea=s,this.Ea.xo((o=>{i.enqueueAndForget((async()=>{zi(this)&&(z(ki,"Restarting streams for network reachability change."),await(async function(c){const u=J(c);u.Ia.add(4),await vo(u),u.Aa.set("Unknown"),u.Ia.delete(4),await Il(u)})(this))}))})),this.Aa=new ES(i,r)}}async function Il(n){if(zi(n))for(const e of n.da)await e(!0)}async function vo(n){for(const e of n.da)await e(!1)}function M_(n,e){const t=J(n);t.Ta.has(e.targetId)||(t.Ta.set(e.targetId,e),hh(t)?uh(t):Gr(t).x_()&&ch(t,e))}function lh(n,e){const t=J(n),i=Gr(t);t.Ta.delete(e),i.x_()&&F_(t,e),t.Ta.size===0&&(i.x_()?i.B_():zi(t)&&t.Aa.set("Unknown"))}function ch(n,e){if(n.Ra.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Q.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Gr(n).H_(e)}function F_(n,e){n.Ra.$e(e),Gr(n).Y_(e)}function uh(n){n.Ra=new mC({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),Et:e=>n.Ta.get(e)||null,lt:()=>n.datastore.serializer.databaseId}),Gr(n).start(),n.Aa.aa()}function hh(n){return zi(n)&&!Gr(n).M_()&&n.Ta.size>0}function zi(n){return J(n).Ia.size===0}function U_(n){n.Ra=void 0}async function wS(n){n.Aa.set("Online")}async function IS(n){n.Ta.forEach(((e,t)=>{ch(n,e)}))}async function AS(n,e){U_(n),hh(n)?(n.Aa.la(e),uh(n)):n.Aa.set("Unknown")}async function CS(n,e,t){if(n.Aa.set("Online"),e instanceof I_&&e.state===2&&e.cause)try{await(async function(r,s){const o=s.cause;for(const l of s.targetIds)r.Ta.has(l)&&(await r.remoteSyncer.rejectListen(l,o),r.Ta.delete(l),r.Ra.removeTarget(l))})(n,e)}catch(i){z(ki,"Failed to remove targets %s: %s ",e.targetIds.join(","),i),await Va(n,i)}else if(e instanceof pa?n.Ra.Ye(e):e instanceof w_?n.Ra.it(e):n.Ra.et(e),!t.isEqual(Q.min()))try{const i=await x_(n.localStore);t.compareTo(i)>=0&&await(function(s,o){const l=s.Ra.Pt(o);return l.targetChanges.forEach(((c,u)=>{if(c.resumeToken.approximateByteSize()>0){const f=s.Ta.get(u);f&&s.Ta.set(u,f.withResumeToken(c.resumeToken,o))}})),l.targetMismatches.forEach(((c,u)=>{const f=s.Ta.get(c);if(!f)return;s.Ta.set(c,f.withResumeToken(Ye.EMPTY_BYTE_STRING,f.snapshotVersion)),F_(s,c);const p=new Fn(f.target,c,u,f.sequenceNumber);ch(s,p)})),s.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(i){z(ki,"Failed to raise snapshot:",i),await Va(n,i)}}async function Va(n,e,t){if(!Hr(e))throw e;n.Ia.add(1),await vo(n),n.Aa.set("Offline"),t||(t=()=>x_(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{z(ki,"Retrying IndexedDB access"),await t(),n.Ia.delete(1),await Il(n)}))}function B_(n,e){return e().catch((t=>Va(n,t,e)))}async function Al(n){const e=J(n),t=ei(e);let i=e.Pa.length>0?e.Pa[e.Pa.length-1].batchId:Ku;for(;SS(e);)try{const r=await aS(e.localStore,i);if(r===null){e.Pa.length===0&&t.B_();break}i=r.batchId,RS(e,r)}catch(r){await Va(e,r)}j_(e)&&z_(e)}function SS(n){return zi(n)&&n.Pa.length<10}function RS(n,e){n.Pa.push(e);const t=ei(n);t.x_()&&t.Z_&&t.X_(e.mutations)}function j_(n){return zi(n)&&!ei(n).M_()&&n.Pa.length>0}function z_(n){ei(n).start()}async function bS(n){ei(n).na()}async function PS(n){const e=ei(n);for(const t of n.Pa)e.X_(t.mutations)}async function kS(n,e,t){const i=n.Pa.shift(),r=th.from(i,e,t);await B_(n,(()=>n.remoteSyncer.applySuccessfulWrite(r))),await Al(n)}async function NS(n,e){e&&ei(n).Z_&&await(async function(i,r){if((function(o){return fC(o)&&o!==P.ABORTED})(r.code)){const s=i.Pa.shift();ei(i).N_(),await B_(i,(()=>i.remoteSyncer.rejectFailedWrite(s.batchId,r))),await Al(i)}})(n,e),j_(n)&&z_(n)}async function vp(n,e){const t=J(n);t.asyncQueue.verifyOperationInProgress(),z(ki,"RemoteStore received new credentials");const i=zi(t);t.Ia.add(3),await vo(t),i&&t.Aa.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ia.delete(3),await Il(t)}async function DS(n,e){const t=J(n);e?(t.Ia.delete(2),await Il(t)):e||(t.Ia.add(2),await vo(t),t.Aa.set("Unknown"))}function Gr(n){return n.Va||(n.Va=(function(t,i,r){const s=J(t);return s.ia(),new gS(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)})(n.datastore,n.asyncQueue,{Zo:wS.bind(null,n),e_:IS.bind(null,n),n_:AS.bind(null,n),J_:CS.bind(null,n)}),n.da.push((async e=>{e?(n.Va.N_(),hh(n)?uh(n):n.Aa.set("Unknown")):(await n.Va.stop(),U_(n))}))),n.Va}function ei(n){return n.ma||(n.ma=(function(t,i,r){const s=J(t);return s.ia(),new _S(i,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,r)})(n.datastore,n.asyncQueue,{Zo:()=>Promise.resolve(),e_:bS.bind(null,n),n_:NS.bind(null,n),ea:PS.bind(null,n),ta:kS.bind(null,n)}),n.da.push((async e=>{e?(n.ma.N_(),await Al(n)):(await n.ma.stop(),n.Pa.length>0&&(z(ki,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ma}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{constructor(e,t,i,r,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=i,this.op=r,this.removalCallback=s,this.deferred=new yn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,i,r,s){const o=Date.now()+i,l=new dh(e,t,o,r,s);return l.start(i),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new M(P.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function fh(n,e){if(An("AsyncQueue",`${e}: ${n}`),Hr(n))return new M(P.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vr{static emptySet(e){return new vr(e.comparator)}constructor(e){this.comparator=e?(t,i)=>e(t,i)||W.comparator(t.key,i.key):(t,i)=>W.comparator(t.key,i.key),this.keyedMap=Rs(),this.sortedSet=new Ve(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,i)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof vr)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),i=e.sortedSet.getIterator();for(;t.hasNext();){const r=t.getNext().key,s=i.getNext().key;if(!r.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const i=new vr;return i.comparator=this.comparator,i.keyedMap=e,i.sortedSet=t,i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ep{constructor(){this.fa=new Ve(W.comparator)}track(e){const t=e.doc.key,i=this.fa.get(t);i?e.type!==0&&i.type===3?this.fa=this.fa.insert(t,e):e.type===3&&i.type!==1?this.fa=this.fa.insert(t,{type:i.type,doc:e.doc}):e.type===2&&i.type===2?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):e.type===2&&i.type===0?this.fa=this.fa.insert(t,{type:0,doc:e.doc}):e.type===1&&i.type===0?this.fa=this.fa.remove(t):e.type===1&&i.type===2?this.fa=this.fa.insert(t,{type:1,doc:i.doc}):e.type===0&&i.type===1?this.fa=this.fa.insert(t,{type:2,doc:e.doc}):$(63341,{At:e,ga:i}):this.fa=this.fa.insert(t,e)}pa(){const e=[];return this.fa.inorderTraversal(((t,i)=>{e.push(i)})),e}}class Dr{constructor(e,t,i,r,s,o,l,c,u){this.query=e,this.docs=t,this.oldDocs=i,this.docChanges=r,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=c,this.hasCachedResults=u}static fromInitialDocuments(e,t,i,r,s){const o=[];return t.forEach((l=>{o.push({type:0,doc:l})})),new Dr(e,t,vr.emptySet(t),o,i,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&gl(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,i=e.docChanges;if(t.length!==i.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==i[r].type||!t[r].doc.isEqual(i[r].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OS{constructor(){this.ya=void 0,this.wa=[]}Sa(){return this.wa.some((e=>e.ba()))}}class xS{constructor(){this.queries=Tp(),this.onlineState="Unknown",this.Da=new Set}terminate(){(function(t,i){const r=J(t),s=r.queries;r.queries=Tp(),s.forEach(((o,l)=>{for(const c of l.wa)c.onError(i)}))})(this,new M(P.ABORTED,"Firestore shutting down"))}}function Tp(){return new ji((n=>c_(n)),gl)}async function q_(n,e){const t=J(n);let i=3;const r=e.query;let s=t.queries.get(r);s?!s.Sa()&&e.ba()&&(i=2):(s=new OS,i=e.ba()?0:1);try{switch(i){case 0:s.ya=await t.onListen(r,!0);break;case 1:s.ya=await t.onListen(r,!1);break;case 2:await t.onFirstRemoteStoreListen(r)}}catch(o){const l=fh(o,`Initialization of query '${cr(e.query)}' failed`);return void e.onError(l)}t.queries.set(r,s),s.wa.push(e),e.va(t.onlineState),s.ya&&e.Ca(s.ya)&&ph(t)}async function W_(n,e){const t=J(n),i=e.query;let r=3;const s=t.queries.get(i);if(s){const o=s.wa.indexOf(e);o>=0&&(s.wa.splice(o,1),s.wa.length===0?r=e.ba()?0:1:!s.Sa()&&e.ba()&&(r=2))}switch(r){case 0:return t.queries.delete(i),t.onUnlisten(i,!0);case 1:return t.queries.delete(i),t.onUnlisten(i,!1);case 2:return t.onLastRemoteStoreUnlisten(i);default:return}}function LS(n,e){const t=J(n);let i=!1;for(const r of e){const s=r.query,o=t.queries.get(s);if(o){for(const l of o.wa)l.Ca(r)&&(i=!0);o.ya=r}}i&&ph(t)}function VS(n,e,t){const i=J(n),r=i.queries.get(e);if(r)for(const s of r.wa)s.onError(t);i.queries.delete(e)}function ph(n){n.Da.forEach((e=>{e.next()}))}var Jc,wp;(wp=Jc||(Jc={})).Fa="default",wp.Cache="cache";class $_{constructor(e,t,i){this.query=e,this.Ma=t,this.xa=!1,this.Oa=null,this.onlineState="Unknown",this.options=i||{}}Ca(e){if(!this.options.includeMetadataChanges){const i=[];for(const r of e.docChanges)r.type!==3&&i.push(r);e=new Dr(e.query,e.docs,e.oldDocs,i,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.xa?this.Na(e)&&(this.Ma.next(e),t=!0):this.Ba(e,this.onlineState)&&(this.La(e),t=!0),this.Oa=e,t}onError(e){this.Ma.error(e)}va(e){this.onlineState=e;let t=!1;return this.Oa&&!this.xa&&this.Ba(this.Oa,e)&&(this.La(this.Oa),t=!0),t}Ba(e,t){if(!e.fromCache||!this.ba())return!0;const i=t!=="Offline";return(!this.options.ka||!i)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Na(e){if(e.docChanges.length>0)return!0;const t=this.Oa&&this.Oa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}La(e){e=Dr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.xa=!0,this.Ma.next(e)}ba(){return this.options.source!==Jc.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H_{constructor(e){this.key=e}}class G_{constructor(e){this.key=e}}class MS{constructor(e,t){this.query=e,this.Ha=t,this.Ya=null,this.hasCachedResults=!1,this.current=!1,this.Za=se(),this.mutatedKeys=se(),this.Xa=u_(e),this.eu=new vr(this.Xa)}get tu(){return this.Ha}nu(e,t){const i=t?t.ru:new Ep,r=t?t.eu:this.eu;let s=t?t.mutatedKeys:this.mutatedKeys,o=r,l=!1;const c=this.query.limitType==="F"&&r.size===this.query.limit?r.last():null,u=this.query.limitType==="L"&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((f,p)=>{const m=r.get(f),v=_l(this.query,p)?p:null,I=!!m&&this.mutatedKeys.has(m.key),k=!!v&&(v.hasLocalMutations||this.mutatedKeys.has(v.key)&&v.hasCommittedMutations);let N=!1;m&&v?m.data.isEqual(v.data)?I!==k&&(i.track({type:3,doc:v}),N=!0):this.iu(m,v)||(i.track({type:2,doc:v}),N=!0,(c&&this.Xa(v,c)>0||u&&this.Xa(v,u)<0)&&(l=!0)):!m&&v?(i.track({type:0,doc:v}),N=!0):m&&!v&&(i.track({type:1,doc:m}),N=!0,(c||u)&&(l=!0)),N&&(v?(o=o.add(v),s=k?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),i.track({type:1,doc:f})}return{eu:o,ru:i,Ds:l,mutatedKeys:s}}iu(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,i,r){const s=this.eu;this.eu=e.eu,this.mutatedKeys=e.mutatedKeys;const o=e.ru.pa();o.sort(((f,p)=>(function(v,I){const k=N=>{switch(N){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return $(20277,{At:N})}};return k(v)-k(I)})(f.type,p.type)||this.Xa(f.doc,p.doc))),this.su(i),r=r!=null&&r;const l=t&&!r?this.ou():[],c=this.Za.size===0&&this.current&&!r?1:0,u=c!==this.Ya;return this.Ya=c,o.length!==0||u?{snapshot:new Dr(this.query,e.eu,s,o,e.mutatedKeys,c===0,u,!1,!!i&&i.resumeToken.approximateByteSize()>0),_u:l}:{_u:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({eu:this.eu,ru:new Ep,mutatedKeys:this.mutatedKeys,Ds:!1},!1)):{_u:[]}}au(e){return!this.Ha.has(e)&&!!this.eu.has(e)&&!this.eu.get(e).hasLocalMutations}su(e){e&&(e.addedDocuments.forEach((t=>this.Ha=this.Ha.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ha=this.Ha.delete(t))),this.current=e.current)}ou(){if(!this.current)return[];const e=this.Za;this.Za=se(),this.eu.forEach((i=>{this.au(i.key)&&(this.Za=this.Za.add(i.key))}));const t=[];return e.forEach((i=>{this.Za.has(i)||t.push(new G_(i))})),this.Za.forEach((i=>{e.has(i)||t.push(new H_(i))})),t}uu(e){this.Ha=e.qs,this.Za=se();const t=this.nu(e.documents);return this.applyChanges(t,!0)}cu(){return Dr.fromInitialDocuments(this.query,this.eu,this.mutatedKeys,this.Ya===0,this.hasCachedResults)}}const mh="SyncEngine";class FS{constructor(e,t,i){this.query=e,this.targetId=t,this.view=i}}class US{constructor(e){this.key=e,this.lu=!1}}class BS{constructor(e,t,i,r,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=i,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.hu={},this.Pu=new ji((l=>c_(l)),gl),this.Tu=new Map,this.Iu=new Set,this.du=new Ve(W.comparator),this.Eu=new Map,this.Au=new rh,this.Ru={},this.Vu=new Map,this.mu=Nr.ur(),this.onlineState="Unknown",this.fu=void 0}get isPrimaryClient(){return this.fu===!0}}async function jS(n,e,t=!0){const i=Z_(n);let r;const s=i.Pu.get(e);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.cu()):r=await K_(i,e,t,!0),r}async function zS(n,e){const t=Z_(n);await K_(t,e,!0,!1)}async function K_(n,e,t,i){const r=await lS(n.localStore,Yt(e)),s=r.targetId,o=n.sharedClientState.addLocalQueryTarget(s,t);let l;return i&&(l=await qS(n,e,s,o==="current",r.resumeToken)),n.isPrimaryClient&&t&&M_(n.remoteStore,r),l}async function qS(n,e,t,i,r){n.gu=(p,m,v)=>(async function(k,N,x,j){let B=N.view.nu(x);B.Ds&&(B=await pp(k.localStore,N.query,!1).then((({documents:A})=>N.view.nu(A,B))));const te=j&&j.targetChanges.get(N.targetId),q=j&&j.targetMismatches.get(N.targetId)!=null,ce=N.view.applyChanges(B,k.isPrimaryClient,te,q);return Ap(k,N.targetId,ce._u),ce.snapshot})(n,p,m,v);const s=await pp(n.localStore,e,!0),o=new MS(e,s.qs),l=o.nu(s.documents),c=yo.createSynthesizedTargetChangeForCurrentChange(t,i&&n.onlineState!=="Offline",r),u=o.applyChanges(l,n.isPrimaryClient,c);Ap(n,t,u._u);const f=new FS(e,t,o);return n.Pu.set(e,f),n.Tu.has(t)?n.Tu.get(t).push(e):n.Tu.set(t,[e]),u.snapshot}async function WS(n,e,t){const i=J(n),r=i.Pu.get(e),s=i.Tu.get(r.targetId);if(s.length>1)return i.Tu.set(r.targetId,s.filter((o=>!gl(o,e)))),void i.Pu.delete(e);i.isPrimaryClient?(i.sharedClientState.removeLocalQueryTarget(r.targetId),i.sharedClientState.isActiveQueryTarget(r.targetId)||await Yc(i.localStore,r.targetId,!1).then((()=>{i.sharedClientState.clearQueryState(r.targetId),t&&lh(i.remoteStore,r.targetId),Zc(i,r.targetId)})).catch($r)):(Zc(i,r.targetId),await Yc(i.localStore,r.targetId,!0))}async function $S(n,e){const t=J(n),i=t.Pu.get(e),r=t.Tu.get(i.targetId);t.isPrimaryClient&&r.length===1&&(t.sharedClientState.removeLocalQueryTarget(i.targetId),lh(t.remoteStore,i.targetId))}async function HS(n,e,t){const i=ZS(n);try{const r=await(function(o,l){const c=J(o),u=Te.now(),f=l.reduce(((v,I)=>v.add(I.key)),se());let p,m;return c.persistence.runTransaction("Locally write mutations","readwrite",(v=>{let I=Cn(),k=se();return c.Os.getEntries(v,f).next((N=>{I=N,I.forEach(((x,j)=>{j.isValidDocument()||(k=k.add(x))}))})).next((()=>c.localDocuments.getOverlayedDocuments(v,I))).next((N=>{p=N;const x=[];for(const j of l){const B=lC(j,p.get(j.key).overlayedDocument);B!=null&&x.push(new li(j.key,B,n_(B.value.mapValue),ft.exists(!0)))}return c.mutationQueue.addMutationBatch(v,u,x,l)})).next((N=>{m=N;const x=N.applyToLocalDocumentSet(p,k);return c.documentOverlayCache.saveOverlays(v,N.batchId,x)}))})).then((()=>({batchId:m.batchId,changes:d_(p)})))})(i.localStore,e);i.sharedClientState.addPendingMutation(r.batchId),(function(o,l,c){let u=o.Ru[o.currentUser.toKey()];u||(u=new Ve(Z)),u=u.insert(l,c),o.Ru[o.currentUser.toKey()]=u})(i,r.batchId,t),await Eo(i,r.changes),await Al(i.remoteStore)}catch(r){const s=fh(r,"Failed to persist write");t.reject(s)}}async function Q_(n,e){const t=J(n);try{const i=await sS(t.localStore,e);e.targetChanges.forEach(((r,s)=>{const o=t.Eu.get(s);o&&(fe(r.addedDocuments.size+r.modifiedDocuments.size+r.removedDocuments.size<=1,22616),r.addedDocuments.size>0?o.lu=!0:r.modifiedDocuments.size>0?fe(o.lu,14607):r.removedDocuments.size>0&&(fe(o.lu,42227),o.lu=!1))})),await Eo(t,i,e)}catch(i){await $r(i)}}function Ip(n,e,t){const i=J(n);if(i.isPrimaryClient&&t===0||!i.isPrimaryClient&&t===1){const r=[];i.Pu.forEach(((s,o)=>{const l=o.view.va(e);l.snapshot&&r.push(l.snapshot)})),(function(o,l){const c=J(o);c.onlineState=l;let u=!1;c.queries.forEach(((f,p)=>{for(const m of p.wa)m.va(l)&&(u=!0)})),u&&ph(c)})(i.eventManager,e),r.length&&i.hu.J_(r),i.onlineState=e,i.isPrimaryClient&&i.sharedClientState.setOnlineState(e)}}async function GS(n,e,t){const i=J(n);i.sharedClientState.updateQueryState(e,"rejected",t);const r=i.Eu.get(e),s=r&&r.key;if(s){let o=new Ve(W.comparator);o=o.insert(s,nt.newNoDocument(s,Q.min()));const l=se().add(s),c=new Tl(Q.min(),new Map,new Ve(Z),o,l);await Q_(i,c),i.du=i.du.remove(s),i.Eu.delete(e),gh(i)}else await Yc(i.localStore,e,!1).then((()=>Zc(i,e,t))).catch($r)}async function KS(n,e){const t=J(n),i=e.batch.batchId;try{const r=await rS(t.localStore,e);X_(t,i,null),Y_(t,i),t.sharedClientState.updateMutationState(i,"acknowledged"),await Eo(t,r)}catch(r){await $r(r)}}async function QS(n,e,t){const i=J(n);try{const r=await(function(o,l){const c=J(o);return c.persistence.runTransaction("Reject batch","readwrite-primary",(u=>{let f;return c.mutationQueue.lookupMutationBatch(u,l).next((p=>(fe(p!==null,37113),f=p.keys(),c.mutationQueue.removeMutationBatch(u,p)))).next((()=>c.mutationQueue.performConsistencyCheck(u))).next((()=>c.documentOverlayCache.removeOverlaysForBatchId(u,f,l))).next((()=>c.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(u,f))).next((()=>c.localDocuments.getDocuments(u,f)))}))})(i.localStore,e);X_(i,e,t),Y_(i,e),i.sharedClientState.updateMutationState(e,"rejected",t),await Eo(i,r)}catch(r){await $r(r)}}function Y_(n,e){(n.Vu.get(e)||[]).forEach((t=>{t.resolve()})),n.Vu.delete(e)}function X_(n,e,t){const i=J(n);let r=i.Ru[i.currentUser.toKey()];if(r){const s=r.get(e);s&&(t?s.reject(t):s.resolve(),r=r.remove(e)),i.Ru[i.currentUser.toKey()]=r}}function Zc(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const i of n.Tu.get(e))n.Pu.delete(i),t&&n.hu.pu(i,t);n.Tu.delete(e),n.isPrimaryClient&&n.Au.zr(e).forEach((i=>{n.Au.containsKey(i)||J_(n,i)}))}function J_(n,e){n.Iu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(lh(n.remoteStore,t),n.du=n.du.remove(e),n.Eu.delete(t),gh(n))}function Ap(n,e,t){for(const i of t)i instanceof H_?(n.Au.addReference(i.key,e),YS(n,i)):i instanceof G_?(z(mh,"Document no longer in limbo: "+i.key),n.Au.removeReference(i.key,e),n.Au.containsKey(i.key)||J_(n,i.key)):$(19791,{yu:i})}function YS(n,e){const t=e.key,i=t.path.canonicalString();n.du.get(t)||n.Iu.has(i)||(z(mh,"New document in limbo: "+t),n.Iu.add(i),gh(n))}function gh(n){for(;n.Iu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Iu.values().next().value;n.Iu.delete(e);const t=new W(ge.fromString(e)),i=n.mu.next();n.Eu.set(i,new US(t)),n.du=n.du.insert(t,i),M_(n.remoteStore,new Fn(Yt(Ju(t.path)),i,"TargetPurposeLimboResolution",dl.ue))}}async function Eo(n,e,t){const i=J(n),r=[],s=[],o=[];i.Pu.isEmpty()||(i.Pu.forEach(((l,c)=>{o.push(i.gu(c,e,t).then((u=>{var f;if((u||t)&&i.isPrimaryClient){const p=u?!u.fromCache:(f=t==null?void 0:t.targetChanges.get(c.targetId))===null||f===void 0?void 0:f.current;i.sharedClientState.updateQueryState(c.targetId,p?"current":"not-current")}if(u){r.push(u);const p=oh.Es(c.targetId,u);s.push(p)}})))})),await Promise.all(o),i.hu.J_(r),await(async function(c,u){const f=J(c);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>O.forEach(u,(m=>O.forEach(m.Is,(v=>f.persistence.referenceDelegate.addReference(p,m.targetId,v))).next((()=>O.forEach(m.ds,(v=>f.persistence.referenceDelegate.removeReference(p,m.targetId,v)))))))))}catch(p){if(!Hr(p))throw p;z(ah,"Failed to update sequence numbers: "+p)}for(const p of u){const m=p.targetId;if(!p.fromCache){const v=f.Fs.get(m),I=v.snapshotVersion,k=v.withLastLimboFreeSnapshotVersion(I);f.Fs=f.Fs.insert(m,k)}}})(i.localStore,s))}async function XS(n,e){const t=J(n);if(!t.currentUser.isEqual(e)){z(mh,"User change. New user:",e.toKey());const i=await O_(t.localStore,e);t.currentUser=e,(function(s,o){s.Vu.forEach((l=>{l.forEach((c=>{c.reject(new M(P.CANCELLED,o))}))})),s.Vu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,i.removedBatchIds,i.addedBatchIds),await Eo(t,i.Bs)}}function JS(n,e){const t=J(n),i=t.Eu.get(e);if(i&&i.lu)return se().add(i.key);{let r=se();const s=t.Tu.get(e);if(!s)return r;for(const o of s){const l=t.Pu.get(o);r=r.unionWith(l.view.tu)}return r}}function Z_(n){const e=J(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Q_.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=JS.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=GS.bind(null,e),e.hu.J_=LS.bind(null,e.eventManager),e.hu.pu=VS.bind(null,e.eventManager),e}function ZS(n){const e=J(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=KS.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=QS.bind(null,e),e}class Ma{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=wl(e.databaseInfo.databaseId),this.sharedClientState=this.bu(e),this.persistence=this.Du(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Cu(e,this.localStore),this.indexBackfillerScheduler=this.Fu(e,this.localStore)}Cu(e,t){return null}Fu(e,t){return null}vu(e){return iS(this.persistence,new eS,e.initialUser,this.serializer)}Du(e){return new D_(sh.Vi,this.serializer)}bu(e){return new uS}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ma.provider={build:()=>new Ma};class eR extends Ma{constructor(e){super(),this.cacheSizeBytes=e}Cu(e,t){fe(this.persistence.referenceDelegate instanceof La,46915);const i=this.persistence.referenceDelegate.garbageCollector;return new UC(i,e.asyncQueue,t)}Du(e){const t=this.cacheSizeBytes!==void 0?ct.withCacheSize(this.cacheSizeBytes):ct.DEFAULT;return new D_((i=>La.Vi(i,t)),this.serializer)}}class eu{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=i=>Ip(this.syncEngine,i,1),this.remoteStore.remoteSyncer.handleCredentialChange=XS.bind(null,this.syncEngine),await DS(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new xS})()}createDatastore(e){const t=wl(e.databaseInfo.databaseId),i=(function(s){return new mS(s)})(e.databaseInfo);return(function(s,o,l,c){return new vS(s,o,l,c)})(e.authCredentials,e.appCheckCredentials,i,t)}createRemoteStore(e){return(function(i,r,s,o,l){return new TS(i,r,s,o,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>Ip(this.syncEngine,t,0)),(function(){return _p.C()?new _p:new hS})())}createSyncEngine(e,t){return(function(r,s,o,l,c,u,f){const p=new BS(r,s,o,l,c,u);return f&&(p.fu=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(r){const s=J(r);z(ki,"RemoteStore shutting down."),s.Ia.add(5),await vo(s),s.Ea.shutdown(),s.Aa.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}eu.provider={build:()=>new eu};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.xu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.xu(this.observer.error,e):An("Uncaught Error in snapshot listener:",e.toString()))}Ou(){this.muted=!0}xu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ti="FirestoreClient";class tR{constructor(e,t,i,r,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=i,this.databaseInfo=r,this.user=tt.UNAUTHENTICATED,this.clientId=Gu.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(i,(async o=>{z(ti,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(i,(o=>(z(ti,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new yn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const i=fh(t,"Failed to shutdown persistence");e.reject(i)}})),e.promise}}async function mc(n,e){n.asyncQueue.verifyOperationInProgress(),z(ti,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let i=t.initialUser;n.setCredentialChangeListener((async r=>{i.isEqual(r)||(await O_(e.localStore,r),i=r)})),e.persistence.setDatabaseDeletedListener((()=>{Qn("Terminating Firestore due to IndexedDb database deletion"),n.terminate().then((()=>{z("Terminating Firestore due to IndexedDb database deletion completed successfully")})).catch((r=>{Qn("Terminating Firestore due to IndexedDb database deletion failed",r)}))})),n._offlineComponents=e}async function Cp(n,e){n.asyncQueue.verifyOperationInProgress();const t=await nR(n);z(ti,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((i=>vp(e.remoteStore,i))),n.setAppCheckTokenChangeListener(((i,r)=>vp(e.remoteStore,r))),n._onlineComponents=e}async function nR(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){z(ti,"Using user provided OfflineComponentProvider");try{await mc(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(r){return r.name==="FirebaseError"?r.code===P.FAILED_PRECONDITION||r.code===P.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11})(t))throw t;Qn("Error using user provided cache. Falling back to memory cache: "+t),await mc(n,new Ma)}}else z(ti,"Using default OfflineComponentProvider"),await mc(n,new eR(void 0));return n._offlineComponents}async function ty(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(z(ti,"Using user provided OnlineComponentProvider"),await Cp(n,n._uninitializedComponentsProvider._online)):(z(ti,"Using default OnlineComponentProvider"),await Cp(n,new eu))),n._onlineComponents}function iR(n){return ty(n).then((e=>e.syncEngine))}async function ny(n){const e=await ty(n),t=e.eventManager;return t.onListen=jS.bind(null,e.syncEngine),t.onUnlisten=WS.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=zS.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=$S.bind(null,e.syncEngine),t}function rR(n,e,t={}){const i=new yn;return n.asyncQueue.enqueueAndForget((async()=>(function(s,o,l,c,u){const f=new ey({next:m=>{f.Ou(),o.enqueueAndForget((()=>W_(s,p)));const v=m.docs.has(l);!v&&m.fromCache?u.reject(new M(P.UNAVAILABLE,"Failed to get document because the client is offline.")):v&&m.fromCache&&c&&c.source==="server"?u.reject(new M(P.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):u.resolve(m)},error:m=>u.reject(m)}),p=new $_(Ju(l.path),f,{includeMetadataChanges:!0,ka:!0});return q_(s,p)})(await ny(n),n.asyncQueue,e,t,i))),i.promise}function sR(n,e,t={}){const i=new yn;return n.asyncQueue.enqueueAndForget((async()=>(function(s,o,l,c,u){const f=new ey({next:m=>{f.Ou(),o.enqueueAndForget((()=>W_(s,p))),m.fromCache&&c.source==="server"?u.reject(new M(P.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):u.resolve(m)},error:m=>u.reject(m)}),p=new $_(l,f,{includeMetadataChanges:!0,ka:!0});return q_(s,p)})(await ny(n),n.asyncQueue,e,t,i))),i.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iy(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sp=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ry="firestore.googleapis.com",Rp=!0;class bp{constructor(e){var t,i;if(e.host===void 0){if(e.ssl!==void 0)throw new M(P.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=ry,this.ssl=Rp}else this.host=e.host,this.ssl=(t=e.ssl)!==null&&t!==void 0?t:Rp;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=N_;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<MC)throw new M(P.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}EA("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=iy((i=e.experimentalLongPollingOptions)!==null&&i!==void 0?i:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new M(P.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(i,r){return i.timeoutSeconds===r.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Cl{constructor(e,t,i,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=i,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new bp({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new M(P.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new M(P.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new bp(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(i){if(!i)return new hA;switch(i.type){case"firstParty":return new mA(i.sessionIndex||"0",i.iamToken||null,i.authTokenFactory||null);case"provider":return i.client;default:throw new M(P.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const i=Sp.get(t);i&&(z("ComponentProvider","Removing Datastore"),Sp.delete(t),i.terminate())})(this),Promise.resolve()}}function oR(n,e,t,i={}){var r;n=tn(n,Cl);const s=oi(e),o=n._getSettings(),l=Object.assign(Object.assign({},o),{emulatorOptions:n._getEmulatorOptions()}),c=`${e}:${t}`;s&&(Pu(`https://${c}`),ku("Firestore",!0)),o.host!==ry&&o.host!==c&&Qn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},o),{host:c,ssl:s,emulatorOptions:i});if(!Gn(u,l)&&(n._setSettings(u),i.mockUserToken)){let f,p;if(typeof i.mockUserToken=="string")f=i.mockUserToken,p=tt.MOCK_USER;else{f=Qm(i.mockUserToken,(r=n._app)===null||r===void 0?void 0:r.options.projectId);const m=i.mockUserToken.sub||i.mockUserToken.user_id;if(!m)throw new M(P.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new tt(m)}n._authCredentials=new dA(new qg(f,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pn{constructor(e,t,i){this.converter=t,this._query=i,this.type="query",this.firestore=e}withConverter(e){return new Pn(this.firestore,e,this._query)}}class Le{constructor(e,t,i){this.converter=t,this._key=i,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new $n(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Le(this.firestore,e,this._key)}toJSON(){return{type:Le._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,i){if(go(t,Le._jsonSchema))return new Le(e,i||null,new W(ge.fromString(t.referencePath)))}}Le._jsonSchemaVersion="firestore/documentReference/1.0",Le._jsonSchema={type:xe("string",Le._jsonSchemaVersion),referencePath:xe("string")};class $n extends Pn{constructor(e,t,i){super(e,t,Ju(i)),this._path=i,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Le(this.firestore,null,new W(e))}withConverter(e){return new $n(this.firestore,e,this._path)}}function _h(n,e,...t){if(n=we(n),$g("collection","path",e),n instanceof Cl){const i=ge.fromString(e,...t);return zf(i),new $n(n,null,i)}{if(!(n instanceof Le||n instanceof $n))throw new M(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(ge.fromString(e,...t));return zf(i),new $n(n.firestore,null,i)}}function Kr(n,e,...t){if(n=we(n),arguments.length===1&&(e=Gu.newId()),$g("doc","path",e),n instanceof Cl){const i=ge.fromString(e,...t);return jf(i),new Le(n,null,new W(i))}{if(!(n instanceof Le||n instanceof $n))throw new M(P.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const i=n._path.child(ge.fromString(e,...t));return jf(i),new Le(n.firestore,n instanceof $n?n.converter:null,new W(i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pp="AsyncQueue";class kp{constructor(e=Promise.resolve()){this.Zu=[],this.Xu=!1,this.ec=[],this.tc=null,this.nc=!1,this.rc=!1,this.sc=[],this.F_=new L_(this,"async_queue_retry"),this.oc=()=>{const i=pc();i&&z(Pp,"Visibility state changed to "+i.visibilityState),this.F_.y_()},this._c=e;const t=pc();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.oc)}get isShuttingDown(){return this.Xu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.ac(),this.uc(e)}enterRestrictedMode(e){if(!this.Xu){this.Xu=!0,this.rc=e||!1;const t=pc();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.oc)}}enqueue(e){if(this.ac(),this.Xu)return new Promise((()=>{}));const t=new yn;return this.uc((()=>this.Xu&&this.rc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Zu.push(e),this.cc())))}async cc(){if(this.Zu.length!==0){try{await this.Zu[0](),this.Zu.shift(),this.F_.reset()}catch(e){if(!Hr(e))throw e;z(Pp,"Operation failed with retryable error: "+e)}this.Zu.length>0&&this.F_.g_((()=>this.cc()))}}uc(e){const t=this._c.then((()=>(this.nc=!0,e().catch((i=>{throw this.tc=i,this.nc=!1,An("INTERNAL UNHANDLED ERROR: ",Np(i)),i})).then((i=>(this.nc=!1,i))))));return this._c=t,t}enqueueAfterDelay(e,t,i){this.ac(),this.sc.indexOf(e)>-1&&(t=0);const r=dh.createAndSchedule(this,e,t,i,(s=>this.lc(s)));return this.ec.push(r),r}ac(){this.tc&&$(47125,{hc:Np(this.tc)})}verifyOperationInProgress(){}async Pc(){let e;do e=this._c,await e;while(e!==this._c)}Tc(e){for(const t of this.ec)if(t.timerId===e)return!0;return!1}Ic(e){return this.Pc().then((()=>{this.ec.sort(((t,i)=>t.targetTimeMs-i.targetTimeMs));for(const t of this.ec)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Pc()}))}dc(e){this.sc.push(e)}lc(e){const t=this.ec.indexOf(e);this.ec.splice(t,1)}}function Np(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}class qi extends Cl{constructor(e,t,i,r){super(e,t,i,r),this.type="firestore",this._queue=new kp,this._persistenceKey=(r==null?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new kp(e),this._firestoreClient=void 0,await e}}}function aR(n,e){const t=typeof n=="object"?n:xu(),i=typeof n=="string"?n:Pa,r=al(t,"firestore").getImmediate({identifier:i});if(!r._initialized){const s=Hm("firestore");s&&oR(r,...s)}return r}function Sl(n){if(n._terminated)throw new M(P.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||lR(n),n._firestoreClient}function lR(n){var e,t,i;const r=n._freezeSettings(),s=(function(l,c,u,f){return new DA(l,c,u,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,iy(f.experimentalLongPollingOptions),f.useFetchStreams,f.isUsingEmulator)})(n._databaseId,((e=n._app)===null||e===void 0?void 0:e.options.appId)||"",n._persistenceKey,r);n._componentsProvider||!((t=r.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((i=r.localCache)===null||i===void 0)&&i._onlineComponentProvider)&&(n._componentsProvider={_offline:r.localCache._offlineComponentProvider,_online:r.localCache._onlineComponentProvider}),n._firestoreClient=new tR(n._authCredentials,n._appCheckCredentials,n._queue,s,n._componentsProvider&&(function(l){const c=l==null?void 0:l._online.build();return{_offline:l==null?void 0:l._offline.build(c),_online:c}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rt{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Rt(Ye.fromBase64String(e))}catch(t){throw new M(P.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Rt(Ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:Rt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(go(e,Rt._jsonSchema))return Rt.fromBase64String(e.bytes)}}Rt._jsonSchemaVersion="firestore/bytes/1.0",Rt._jsonSchema={type:xe("string",Rt._jsonSchemaVersion),bytes:xe("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class To{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new M(P.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Qe(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new M(P.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new M(P.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return Z(this._lat,e._lat)||Z(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Jt._jsonSchemaVersion}}static fromJSON(e){if(go(e,Jt._jsonSchema))return new Jt(e.latitude,e.longitude)}}Jt._jsonSchemaVersion="firestore/geoPoint/1.0",Jt._jsonSchema={type:xe("string",Jt._jsonSchemaVersion),latitude:xe("number"),longitude:xe("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(i,r){if(i.length!==r.length)return!1;for(let s=0;s<i.length;++s)if(i[s]!==r[s])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Zt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(go(e,Zt._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Zt(e.vectorValues);throw new M(P.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Zt._jsonSchemaVersion="firestore/vectorValue/1.0",Zt._jsonSchema={type:xe("string",Zt._jsonSchemaVersion),vectorValues:xe("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cR=/^__.*__$/;class uR{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return this.fieldMask!==null?new li(e,this.data,this.fieldMask,t,this.fieldTransforms):new _o(e,this.data,t,this.fieldTransforms)}}class sy{constructor(e,t,i){this.data=e,this.fieldMask=t,this.fieldTransforms=i}toMutation(e,t){return new li(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function oy(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw $(40011,{Ec:n})}}class yh{constructor(e,t,i,r,s,o){this.settings=e,this.databaseId=t,this.serializer=i,this.ignoreUndefinedProperties=r,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ec(){return this.settings.Ec}Rc(e){return new yh(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Vc(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:i,mc:!1});return r.fc(e),r}gc(e){var t;const i=(t=this.path)===null||t===void 0?void 0:t.child(e),r=this.Rc({path:i,mc:!1});return r.Ac(),r}yc(e){return this.Rc({path:void 0,mc:!0})}wc(e){return Fa(e,this.settings.methodName,this.settings.Sc||!1,this.path,this.settings.bc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.fc(this.path.get(e))}fc(e){if(e.length===0)throw this.wc("Document fields must not be empty");if(oy(this.Ec)&&cR.test(e))throw this.wc('Document fields cannot begin and end with "__"')}}class hR{constructor(e,t,i){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=i||wl(e)}Dc(e,t,i,r=!1){return new yh({Ec:e,methodName:t,bc:i,path:Qe.emptyPath(),mc:!1,Sc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function wo(n){const e=n._freezeSettings(),t=wl(n._databaseId);return new hR(n._databaseId,!!e.ignoreUndefinedProperties,t)}function ay(n,e,t,i,r,s={}){const o=n.Dc(s.merge||s.mergeFields?2:0,e,t,r);Eh("Data must be an object, but it was:",o,i);const l=hy(i,o);let c,u;if(s.merge)c=new At(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const p of s.mergeFields){const m=tu(e,p,t);if(!o.contains(m))throw new M(P.INVALID_ARGUMENT,`Field '${m}' is specified in your field mask but missing from your input data.`);fy(f,m)||f.push(m)}c=new At(f),u=o.fieldTransforms.filter((p=>c.covers(p.field)))}else c=null,u=o.fieldTransforms;return new uR(new ut(l),c,u)}class bl extends Rl{_toFieldTransform(e){if(e.Ec!==2)throw e.Ec===1?e.wc(`${this._methodName}() can only appear at the top level of your update data`):e.wc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof bl}}class vh extends Rl{_toFieldTransform(e){return new rC(e.path,new Qs)}isEqual(e){return e instanceof vh}}function ly(n,e,t,i){const r=n.Dc(1,e,t);Eh("Data must be an object, but it was:",r,i);const s=[],o=ut.empty();ai(i,((c,u)=>{const f=Th(e,c,t);u=we(u);const p=r.gc(f);if(u instanceof bl)s.push(f);else{const m=Io(u,p);m!=null&&(s.push(f),o.set(f,m))}}));const l=new At(s);return new sy(o,l,r.fieldTransforms)}function cy(n,e,t,i,r,s){const o=n.Dc(1,e,t),l=[tu(e,i,t)],c=[r];if(s.length%2!=0)throw new M(P.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let m=0;m<s.length;m+=2)l.push(tu(e,s[m])),c.push(s[m+1]);const u=[],f=ut.empty();for(let m=l.length-1;m>=0;--m)if(!fy(u,l[m])){const v=l[m];let I=c[m];I=we(I);const k=o.gc(v);if(I instanceof bl)u.push(v);else{const N=Io(I,k);N!=null&&(u.push(v),f.set(v,N))}}const p=new At(u);return new sy(f,p,o.fieldTransforms)}function uy(n,e,t,i=!1){return Io(t,n.Dc(i?4:3,e))}function Io(n,e){if(dy(n=we(n)))return Eh("Unsupported field value:",e,n),hy(n,e);if(n instanceof Rl)return(function(i,r){if(!oy(r.Ec))throw r.wc(`${i._methodName}() can only be used with update() and set()`);if(!r.path)throw r.wc(`${i._methodName}() is not currently supported inside arrays`);const s=i._toFieldTransform(r);s&&r.fieldTransforms.push(s)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.mc&&e.Ec!==4)throw e.wc("Nested arrays are not supported");return(function(i,r){const s=[];let o=0;for(const l of i){let c=Io(l,r.yc(o));c==null&&(c={nullValue:"NULL_VALUE"}),s.push(c),o++}return{arrayValue:{values:s}}})(n,e)}return(function(i,r){if((i=we(i))===null)return{nullValue:"NULL_VALUE"};if(typeof i=="number")return tC(r.serializer,i);if(typeof i=="boolean")return{booleanValue:i};if(typeof i=="string")return{stringValue:i};if(i instanceof Date){const s=Te.fromDate(i);return{timestampValue:xa(r.serializer,s)}}if(i instanceof Te){const s=new Te(i.seconds,1e3*Math.floor(i.nanoseconds/1e3));return{timestampValue:xa(r.serializer,s)}}if(i instanceof Jt)return{geoPointValue:{latitude:i.latitude,longitude:i.longitude}};if(i instanceof Rt)return{bytesValue:A_(r.serializer,i._byteString)};if(i instanceof Le){const s=r.databaseId,o=i.firestore._databaseId;if(!o.isEqual(s))throw r.wc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:ih(i.firestore._databaseId||r.databaseId,i._key.path)}}if(i instanceof Zt)return(function(o,l){return{mapValue:{fields:{[e_]:{stringValue:t_},[ka]:{arrayValue:{values:o.toArray().map((u=>{if(typeof u!="number")throw l.wc("VectorValues must only contain numeric values.");return eh(l.serializer,u)}))}}}}}})(i,r);throw r.wc(`Unsupported field value: ${hl(i)}`)})(n,e)}function hy(n,e){const t={};return Kg(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ai(n,((i,r)=>{const s=Io(r,e.Vc(i));s!=null&&(t[i]=s)})),{mapValue:{fields:t}}}function dy(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Te||n instanceof Jt||n instanceof Rt||n instanceof Le||n instanceof Rl||n instanceof Zt)}function Eh(n,e,t){if(!dy(t)||!Hg(t)){const i=hl(t);throw i==="an object"?e.wc(n+" a custom object"):e.wc(n+" "+i)}}function tu(n,e,t){if((e=we(e))instanceof To)return e._internalPath;if(typeof e=="string")return Th(n,e);throw Fa("Field path arguments must be of type string or ",n,!1,void 0,t)}const dR=new RegExp("[~\\*/\\[\\]]");function Th(n,e,t){if(e.search(dR)>=0)throw Fa(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new To(...e.split("."))._internalPath}catch{throw Fa(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Fa(n,e,t,i,r){const s=i&&!i.isEmpty(),o=r!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${i}`),o&&(c+=` in document ${r}`),c+=")"),new M(P.INVALID_ARGUMENT,l+n+c)}function fy(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wh{constructor(e,t,i,r,s){this._firestore=e,this._userDataWriter=t,this._key=i,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Le(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new fR(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Ih("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class fR extends wh{data(){return super.data()}}function Ih(n,e){return typeof e=="string"?Th(n,e):e instanceof To?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pR(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new M(P.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ah{}class Pl extends Ah{}function mR(n,e,...t){let i=[];e instanceof Ah&&i.push(e),i=i.concat(t),(function(s){const o=s.filter((c=>c instanceof Sh)).length,l=s.filter((c=>c instanceof Ch)).length;if(o>1||o>0&&l>0)throw new M(P.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(i);for(const r of i)n=r._apply(n);return n}class Ch extends Pl{constructor(e,t,i){super(),this._field=e,this._op=t,this._value=i,this.type="where"}static _create(e,t,i){return new Ch(e,t,i)}_apply(e){const t=this._parse(e);return py(e._query,t),new Pn(e.firestore,e.converter,$c(e._query,t))}_parse(e){const t=wo(e.firestore);return(function(s,o,l,c,u,f,p){let m;if(u.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new M(P.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){Op(p,f);const I=[];for(const k of p)I.push(Dp(c,s,k));m={arrayValue:{values:I}}}else m=Dp(c,s,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||Op(p,f),m=uy(l,o,p,f==="in"||f==="not-in");return Oe.create(u,f,m)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}class Sh extends Ah{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Sh(e,t)}_parse(e){const t=this._queryConstraints.map((i=>i._parse(e))).filter((i=>i.getFilters().length>0));return t.length===1?t[0]:qt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(r,s){let o=r;const l=s.getFlattenedFilters();for(const c of l)py(o,c),o=$c(o,c)})(e._query,t),new Pn(e.firestore,e.converter,$c(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Rh extends Pl{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Rh(e,t)}_apply(e){const t=(function(r,s,o){if(r.startAt!==null)throw new M(P.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(r.endAt!==null)throw new M(P.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Ks(s,o)})(e._query,this._field,this._direction);return new Pn(e.firestore,e.converter,(function(r,s){const o=r.explicitOrderBy.concat([s]);return new Bi(r.path,r.collectionGroup,o,r.filters.slice(),r.limit,r.limitType,r.startAt,r.endAt)})(e._query,t))}}function gc(n,e="asc"){const t=e,i=Ih("orderBy",n);return Rh._create(i,t)}class bh extends Pl{constructor(e,t,i){super(),this.type=e,this._limit=t,this._limitType=i}static _create(e,t,i){return new bh(e,t,i)}_apply(e){return new Pn(e.firestore,e.converter,Da(e._query,this._limit,this._limitType))}}function gR(n){return TA("limit",n),bh._create("limit",n,"F")}class Ph extends Pl{constructor(e,t,i){super(),this.type=e,this._docOrFields=t,this._inclusive=i}static _create(e,t,i){return new Ph(e,t,i)}_apply(e){const t=yR(e,this.type,this._docOrFields,this._inclusive);return new Pn(e.firestore,e.converter,(function(r,s){return new Bi(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),r.limit,r.limitType,s,r.endAt)})(e._query,t))}}function _R(...n){return Ph._create("startAfter",n,!1)}function yR(n,e,t,i){if(t[0]=we(t[0]),t[0]instanceof wh)return(function(s,o,l,c,u){if(!c)throw new M(P.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${l}().`);const f=[];for(const p of yr(s))if(p.field.isKeyField())f.push(Na(o,c.key));else{const m=c.data.field(p.field);if(pl(m))throw new M(P.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+p.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(m===null){const v=p.field.canonicalString();throw new M(P.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${v}' (used as the orderBy) does not exist.`)}f.push(m)}return new kr(f,u)})(n._query,n.firestore._databaseId,e,t[0]._document,i);{const r=wo(n.firestore);return(function(o,l,c,u,f,p){const m=o.explicitOrderBy;if(f.length>m.length)throw new M(P.INVALID_ARGUMENT,`Too many arguments provided to ${u}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const v=[];for(let I=0;I<f.length;I++){const k=f[I];if(m[I].field.isKeyField()){if(typeof k!="string")throw new M(P.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${u}(), but got a ${typeof k}`);if(!Zu(o)&&k.indexOf("/")!==-1)throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${u}() must be a plain document ID, but '${k}' contains a slash.`);const N=o.path.child(ge.fromString(k));if(!W.isDocumentKey(N))throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${u}() must result in a valid document path, but '${N}' is not because it contains an odd number of segments.`);const x=new W(N);v.push(Na(l,x))}else{const N=uy(c,u,k);v.push(N)}}return new kr(v,p)})(n._query,n.firestore._databaseId,r,e,t,i)}}function Dp(n,e,t){if(typeof(t=we(t))=="string"){if(t==="")throw new M(P.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Zu(e)&&t.indexOf("/")!==-1)throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const i=e.path.child(ge.fromString(t));if(!W.isDocumentKey(i))throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${i}' is not because it has an odd number of segments (${i.length}).`);return Na(n,new W(i))}if(t instanceof Le)return Na(n,t._key);throw new M(P.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${hl(t)}.`)}function Op(n,e){if(!Array.isArray(n)||n.length===0)throw new M(P.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function py(n,e){const t=(function(r,s){for(const o of r)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null})(n.filters,(function(r){switch(r){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new M(P.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new M(P.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class vR{convertValue(e,t="none"){switch(Zn(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Pe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Jn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw $(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const i={};return ai(e,((r,s)=>{i[r]=this.convertValue(s,t)})),i}convertVectorValue(e){var t,i,r;const s=(r=(i=(t=e.fields)===null||t===void 0?void 0:t[ka].arrayValue)===null||i===void 0?void 0:i.values)===null||r===void 0?void 0:r.map((o=>Pe(o.doubleValue)));return new Zt(s)}convertGeoPoint(e){return new Jt(Pe(e.latitude),Pe(e.longitude))}convertArray(e,t){return(e.values||[]).map((i=>this.convertValue(i,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const i=ml(e);return i==null?null:this.convertValue(i,t);case"estimate":return this.convertTimestamp($s(e));default:return null}}convertTimestamp(e){const t=Xn(e);return new Te(t.seconds,t.nanos)}convertDocumentKey(e,t){const i=ge.fromString(e);fe(k_(i),9688,{name:e});const r=new Hs(i.get(1),i.get(3)),s=new W(i.popFirst(5));return r.isEqual(t)||An(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function my(n,e,t){let i;return i=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,i}class Ps{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Si extends wh{constructor(e,t,i,r,s,o){super(e,t,i,r,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new ma(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const i=this._document.data.field(Ih("DocumentSnapshot.get",e));if(i!==null)return this._userDataWriter.convertValue(i,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new M(P.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Si._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Si._jsonSchemaVersion="firestore/documentSnapshot/1.0",Si._jsonSchema={type:xe("string",Si._jsonSchemaVersion),bundleSource:xe("string","DocumentSnapshot"),bundleName:xe("string"),bundle:xe("string")};class ma extends Si{data(e={}){return super.data(e)}}class Er{constructor(e,t,i,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Ps(r.hasPendingWrites,r.fromCache),this.query=i}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((i=>{e.call(t,new ma(this._firestore,this._userDataWriter,i.key,i,new Ps(this._snapshot.mutatedKeys.has(i.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new M(P.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(r,s){if(r._snapshot.oldDocs.isEmpty()){let o=0;return r._snapshot.docChanges.map((l=>{const c=new ma(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Ps(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);return l.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}}))}{let o=r._snapshot.oldDocs;return r._snapshot.docChanges.filter((l=>s||l.type!==3)).map((l=>{const c=new ma(r._firestore,r._userDataWriter,l.doc.key,l.doc,new Ps(r._snapshot.mutatedKeys.has(l.doc.key),r._snapshot.fromCache),r.query.converter);let u=-1,f=-1;return l.type!==0&&(u=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:ER(l.type),doc:c,oldIndex:u,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new M(P.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Er._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Gu.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],i=[],r=[];return this.docs.forEach((s=>{s._document!==null&&(t.push(s._document),i.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),r.push(s.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function ER(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return $(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TR(n){n=tn(n,Le);const e=tn(n.firestore,qi);return rR(Sl(e),n._key).then((t=>IR(e,n,t)))}Er._jsonSchemaVersion="firestore/querySnapshot/1.0",Er._jsonSchema={type:xe("string",Er._jsonSchemaVersion),bundleSource:xe("string","QuerySnapshot"),bundleName:xe("string"),bundle:xe("string")};class gy extends vR{constructor(e){super(),this.firestore=e}convertBytes(e){return new Rt(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Le(this.firestore,null,t)}}function _y(n){n=tn(n,Pn);const e=tn(n.firestore,qi),t=Sl(e),i=new gy(e);return pR(n._query),sR(t,n._query).then((r=>new Er(e,i,n,r)))}function wR(n,e,t,...i){n=tn(n,Le);const r=tn(n.firestore,qi),s=wo(r);let o;return o=typeof(e=we(e))=="string"||e instanceof To?cy(s,"updateDoc",n._key,e,t,i):ly(s,"updateDoc",n._key,e),kl(r,[o.toMutation(n._key,ft.exists(!0))])}function yy(n){return kl(tn(n.firestore,qi),[new El(n._key,ft.none())])}function vy(n,e){const t=tn(n.firestore,qi),i=Kr(n),r=my(n.converter,e);return kl(t,[ay(wo(n.firestore),"addDoc",i._key,r,n.converter!==null,{}).toMutation(i._key,ft.exists(!1))]).then((()=>i))}function kl(n,e){return(function(i,r){const s=new yn;return i.asyncQueue.enqueueAndForget((async()=>HS(await iR(i),r,s))),s.promise})(Sl(n),e)}function IR(n,e,t){const i=t.docs.get(e._key),r=new gy(n);return new Si(n,r,e._key,i,new Ps(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AR{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=wo(e)}set(e,t,i){this._verifyNotCommitted();const r=_c(e,this._firestore),s=my(r.converter,t,i),o=ay(this._dataReader,"WriteBatch.set",r._key,s,r.converter!==null,i);return this._mutations.push(o.toMutation(r._key,ft.none())),this}update(e,t,i,...r){this._verifyNotCommitted();const s=_c(e,this._firestore);let o;return o=typeof(t=we(t))=="string"||t instanceof To?cy(this._dataReader,"WriteBatch.update",s._key,t,i,r):ly(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,ft.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=_c(e,this._firestore);return this._mutations=this._mutations.concat(new El(t._key,ft.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new M(P.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function _c(n,e){if((n=we(n)).firestore!==e)throw new M(P.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}function Ua(){return new vh("serverTimestamp")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CR(n){return Sl(n=tn(n,qi)),new AR(n,(e=>kl(n,e)))}(function(e,t=!0){(function(r){Wr=r})(Ui),Ri(new Kn("firestore",((i,{instanceIdentifier:r,options:s})=>{const o=i.getProvider("app").getImmediate(),l=new qi(new fA(i.getProvider("auth-internal")),new gA(o,i.getProvider("app-check-internal")),(function(u,f){if(!Object.prototype.hasOwnProperty.apply(u.options,["projectId"]))throw new M(P.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Hs(u.options.projectId,f)})(o,r),o);return s=Object.assign({useFetchStreams:t},s),l._setSettings(s),l}),"PUBLIC").setMultipleInstances(!0)),Kt(Vf,Mf,e),Kt(Vf,Mf,"esm2017")})();var xp={};const Lp="@firebase/database",Vp="1.0.20";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ey="";function SR(n){Ey=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class RR{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),We(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:js(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bR{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return rn(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ty=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new RR(e)}}catch{}return new bR},Ai=Ty("localStorage"),PR=Ty("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tr=new ol("@firebase/database"),kR=(function(){let n=1;return function(){return n++}})(),wy=function(n){const e=ZE(n),t=new QE;t.update(e);const i=t.digest();return bu.encodeByteArray(i)},Ao=function(...n){let e="";for(let t=0;t<n.length;t++){const i=n[t];Array.isArray(i)||i&&typeof i=="object"&&typeof i.length=="number"?e+=Ao.apply(null,i):typeof i=="object"?e+=We(i):e+=i,e+=" "}return e};let Ls=null,Mp=!0;const NR=function(n,e){V(!0,"Can't turn on custom loggers persistently."),Tr.logLevel=ne.VERBOSE,Ls=Tr.log.bind(Tr)},Ge=function(...n){if(Mp===!0&&(Mp=!1,Ls===null&&PR.get("logging_enabled")===!0&&NR()),Ls){const e=Ao.apply(null,n);Ls(e)}},Co=function(n){return function(...e){Ge(n,...e)}},nu=function(...n){const e="FIREBASE INTERNAL ERROR: "+Ao(...n);Tr.error(e)},Sn=function(...n){const e=`FIREBASE FATAL ERROR: ${Ao(...n)}`;throw Tr.error(e),new Error(e)},pt=function(...n){const e="FIREBASE WARNING: "+Ao(...n);Tr.warn(e)},DR=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&pt("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},kh=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},OR=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},Or="[MIN_NAME]",Ni="[MAX_NAME]",Wi=function(n,e){if(n===e)return 0;if(n===Or||e===Ni)return-1;if(e===Or||n===Ni)return 1;{const t=Fp(n),i=Fp(e);return t!==null?i!==null?t-i===0?n.length-e.length:t-i:-1:i!==null?1:n<e?-1:1}},xR=function(n,e){return n===e?0:n<e?-1:1},_s=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+We(e))},Nh=function(n){if(typeof n!="object"||n===null)return We(n);const e=[];for(const i in n)e.push(i);e.sort();let t="{";for(let i=0;i<e.length;i++)i!==0&&(t+=","),t+=We(e[i]),t+=":",t+=Nh(n[e[i]]);return t+="}",t},Iy=function(n,e){const t=n.length;if(t<=e)return[n];const i=[];for(let r=0;r<t;r+=e)r+e>t?i.push(n.substring(r,t)):i.push(n.substring(r,r+e));return i};function Xe(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const Ay=function(n){V(!kh(n),"Invalid JSON number");const e=11,t=52,i=(1<<e-1)-1;let r,s,o,l,c;n===0?(s=0,o=0,r=1/n===-1/0?1:0):(r=n<0,n=Math.abs(n),n>=Math.pow(2,1-i)?(l=Math.min(Math.floor(Math.log(n)/Math.LN2),i),s=l+i,o=Math.round(n*Math.pow(2,t-l)-Math.pow(2,t))):(s=0,o=Math.round(n/Math.pow(2,1-i-t))));const u=[];for(c=t;c;c-=1)u.push(o%2?1:0),o=Math.floor(o/2);for(c=e;c;c-=1)u.push(s%2?1:0),s=Math.floor(s/2);u.push(r?1:0),u.reverse();const f=u.join("");let p="";for(c=0;c<64;c+=8){let m=parseInt(f.substr(c,8),2).toString(16);m.length===1&&(m="0"+m),p=p+m}return p.toLowerCase()},LR=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},VR=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function MR(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const i=new Error(n+" at "+e._path.toString()+": "+t);return i.code=n.toUpperCase(),i}const FR=new RegExp("^-?(0*)\\d{1,10}$"),UR=-2147483648,BR=2147483647,Fp=function(n){if(FR.test(n)){const e=Number(n);if(e>=UR&&e<=BR)return e}return null},Qr=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw pt("Exception was thrown by user callback.",t),e},Math.floor(0))}},jR=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Vs=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zR{constructor(e,t){this.appCheckProvider=t,this.appName=e.name,wt(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(i=>this.appCheck=i)}getToken(e){if(this.serverAppAppCheckToken){if(e)throw new Error("Attempted reuse of `FirebaseServerApp.appCheckToken` after previous usage failed.");return Promise.resolve({token:this.serverAppAppCheckToken})}return this.appCheck?this.appCheck.getToken(e):new Promise((t,i)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(i=>i.addTokenListener(e))}notifyForInvalidToken(){pt(`Provided AppCheck credentials for the app named "${this.appName}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qR{constructor(e,t,i){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=i,this.auth_=null,this.auth_=i.getImmediate({optional:!0}),this.auth_||i.onInit(r=>this.auth_=r)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?(Ge("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,i)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,i):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',pt(e)}}class ga{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}ga.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh="5",Cy="v",Sy="s",Ry="r",by="f",Py=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,ky="ls",Ny="p",iu="ac",Dy="websocket",Oy="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xy{constructor(e,t,i,r,s=!1,o="",l=!1,c=!1,u=null){this.secure=t,this.namespace=i,this.webSocketOnly=r,this.nodeAdmin=s,this.persistenceKey=o,this.includeNamespaceInQueryParams=l,this.isUsingEmulator=c,this.emulatorOptions=u,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=Ai.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&Ai.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function WR(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function Ly(n,e,t){V(typeof e=="string","typeof type must == string"),V(typeof t=="object","typeof params must == object");let i;if(e===Dy)i=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===Oy)i=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);WR(n)&&(t.ns=n.namespace);const r=[];return Xe(t,(s,o)=>{r.push(s+"="+o)}),i+r.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $R{constructor(){this.counters_={}}incrementCounter(e,t=1){rn(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return bE(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yc={},vc={};function Oh(n){const e=n.toString();return yc[e]||(yc[e]=new $R),yc[e]}function HR(n,e){const t=n.toString();return vc[t]||(vc[t]=e()),vc[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class GR{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const i=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let r=0;r<i.length;++r)i[r]&&Qr(()=>{this.onMessage_(i[r])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Up="start",KR="close",QR="pLPCommand",YR="pRTLPCB",Vy="id",My="pw",Fy="ser",XR="cb",JR="seg",ZR="ts",eb="d",tb="dframe",Uy=1870,By=30,nb=Uy-By,ib=25e3,rb=3e4;class dr{constructor(e,t,i,r,s,o,l){this.connId=e,this.repoInfo=t,this.applicationId=i,this.appCheckToken=r,this.authToken=s,this.transportSessionId=o,this.lastSessionId=l,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=Co(e),this.stats_=Oh(t),this.urlFn=c=>(this.appCheckToken&&(c[iu]=this.appCheckToken),Ly(t,Oy,c))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new GR(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(rb)),OR(()=>{if(this.isClosed_)return;this.scriptTagHolder=new xh((...s)=>{const[o,l,c,u,f]=s;if(this.incrementIncomingBytes_(s),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===Up)this.id=l,this.password=c;else if(o===KR)l?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(l,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...s)=>{const[o,l]=s;this.incrementIncomingBytes_(s),this.myPacketOrderer.handleResponse(o,l)},()=>{this.onClosed_()},this.urlFn);const i={};i[Up]="t",i[Fy]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(i[XR]=this.scriptTagHolder.uniqueCallbackIdentifier),i[Cy]=Dh,this.transportSessionId&&(i[Sy]=this.transportSessionId),this.lastSessionId&&(i[ky]=this.lastSessionId),this.applicationId&&(i[Ny]=this.applicationId),this.appCheckToken&&(i[iu]=this.appCheckToken),typeof location<"u"&&location.hostname&&Py.test(location.hostname)&&(i[Ry]=by);const r=this.urlFn(i);this.log_("Connecting via long-poll to "+r),this.scriptTagHolder.addTag(r,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){dr.forceAllow_=!0}static forceDisallow(){dr.forceDisallow_=!0}static isAvailable(){return dr.forceAllow_?!0:!dr.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!LR()&&!VR()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=We(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=qm(t),r=Iy(i,nb);for(let s=0;s<r.length;s++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,r.length,r[s]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const i={};i[tb]="t",i[Vy]=e,i[My]=t,this.myDisconnFrame.src=this.urlFn(i),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=We(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class xh{constructor(e,t,i,r){this.onDisconnect=i,this.urlFn=r,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=kR(),window[QR+this.uniqueCallbackIdentifier]=e,window[YR+this.uniqueCallbackIdentifier]=t,this.myIFrame=xh.createIFrame_();let s="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(s='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+s+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(l){Ge("frame writing exception"),l.stack&&Ge(l.stack),Ge(l)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||Ge("No IE domain setting required")}catch{const i=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+i+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[Vy]=this.myID,e[My]=this.myPW,e[Fy]=this.currentSerial;let t=this.urlFn(e),i="",r=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+By+i.length<=Uy;){const o=this.pendingSegs.shift();i=i+"&"+JR+r+"="+o.seg+"&"+ZR+r+"="+o.ts+"&"+eb+r+"="+o.d,r++}return t=t+i,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,i){this.pendingSegs.push({seg:e,ts:t,d:i}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const i=()=>{this.outstandingRequests.delete(t),this.newRequest_()},r=setTimeout(i,Math.floor(ib)),s=()=>{clearTimeout(r),i()};this.addTag(e,s)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const i=this.myIFrame.doc.createElement("script");i.type="text/javascript",i.async=!0,i.src=e,i.onload=i.onreadystatechange=function(){const r=i.readyState;(!r||r==="loaded"||r==="complete")&&(i.onload=i.onreadystatechange=null,i.parentNode&&i.parentNode.removeChild(i),t())},i.onerror=()=>{Ge("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(i)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sb=16384,ob=45e3;let Ba=null;typeof MozWebSocket<"u"?Ba=MozWebSocket:typeof WebSocket<"u"&&(Ba=WebSocket);class Vt{constructor(e,t,i,r,s,o,l){this.connId=e,this.applicationId=i,this.appCheckToken=r,this.authToken=s,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=Co(this.connId),this.stats_=Oh(t),this.connURL=Vt.connectionURL_(t,o,l,r,i),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,i,r,s){const o={};return o[Cy]=Dh,typeof location<"u"&&location.hostname&&Py.test(location.hostname)&&(o[Ry]=by),t&&(o[Sy]=t),i&&(o[ky]=i),r&&(o[iu]=r),s&&(o[Ny]=s),Ly(e,Dy,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,Ai.set("previous_websocket_failure",!0);try{let i;BE(),this.mySock=new Ba(this.connURL,[],i)}catch(i){this.log_("Error instantiating WebSocket.");const r=i.message||i.data;r&&this.log_(r),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=i=>{this.handleIncomingFrame(i)},this.mySock.onerror=i=>{this.log_("WebSocket error.  Closing connection.");const r=i.message||i.data;r&&this.log_(r),this.onClosed_()}}start(){}static forceDisallow(){Vt.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,i=navigator.userAgent.match(t);i&&i.length>1&&parseFloat(i[1])<4.4&&(e=!0)}return!e&&Ba!==null&&!Vt.forceDisallow_}static previouslyFailed(){return Ai.isInMemoryStorage||Ai.get("previous_websocket_failure")===!0}markConnectionHealthy(){Ai.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const i=js(t);this.onMessage(i)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(V(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const i=this.extractFrameCount_(t);i!==null&&this.appendFrame_(i)}}send(e){this.resetKeepAlive();const t=We(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const i=Iy(t,sb);i.length>1&&this.sendString_(String(i.length));for(let r=0;r<i.length;r++)this.sendString_(i[r])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(ob))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Vt.responsesRequiredToBeHealthy=2;Vt.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Js{static get ALL_TRANSPORTS(){return[dr,Vt]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}constructor(e){this.initTransports_(e)}initTransports_(e){const t=Vt&&Vt.isAvailable();let i=t&&!Vt.previouslyFailed();if(e.webSocketOnly&&(t||pt("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),i=!0),i)this.transports_=[Vt];else{const r=this.transports_=[];for(const s of Js.ALL_TRANSPORTS)s&&s.isAvailable()&&r.push(s);Js.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}Js.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ab=6e4,lb=5e3,cb=10*1024,ub=100*1024,Ec="t",Bp="d",hb="s",jp="r",db="e",zp="o",qp="a",Wp="n",$p="p",fb="h";class pb{constructor(e,t,i,r,s,o,l,c,u,f){this.id=e,this.repoInfo_=t,this.applicationId_=i,this.appCheckToken_=r,this.authToken_=s,this.onMessage_=o,this.onReady_=l,this.onDisconnect_=c,this.onKill_=u,this.lastSessionId=f,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=Co("c:"+this.id+":"),this.transportManager_=new Js(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),i=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,i)},Math.floor(0));const r=e.healthyTimeout||0;r>0&&(this.healthyTimeout_=Vs(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>ub?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>cb?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(r)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(Ec in e){const t=e[Ec];t===qp?this.upgradeIfSecondaryHealthy_():t===jp?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===zp&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=_s("t",e),i=_s("d",e);if(t==="c")this.onSecondaryControl_(i);else if(t==="d")this.pendingDataMessages.push(i);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:$p,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:qp,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Wp,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=_s("t",e),i=_s("d",e);t==="c"?this.onControl_(i):t==="d"&&this.onDataMessage_(i)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=_s(Ec,e);if(Bp in e){const i=e[Bp];if(t===fb){const r=Object.assign({},i);this.repoInfo_.isUsingEmulator&&(r.h=this.repoInfo_.host),this.onHandshake_(r)}else if(t===Wp){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let r=0;r<this.pendingDataMessages.length;++r)this.onDataMessage_(this.pendingDataMessages[r]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===hb?this.onConnectionShutdown_(i):t===jp?this.onReset_(i):t===db?nu("Server Error: "+i):t===zp?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):nu("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,i=e.v,r=e.h;this.sessionId=e.s,this.repoInfo_.host=r,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Dh!==i&&pt("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),i=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,i),Vs(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(ab))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Vs(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(lb))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:$p,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(Ai.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{put(e,t,i,r){}merge(e,t,i,r){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,i){}onDisconnectMerge(e,t,i){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(e){this.allowedEvents_=e,this.listeners_={},V(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const i=[...this.listeners_[e]];for(let r=0;r<i.length;r++)i[r].callback.apply(i[r].context,t)}}on(e,t,i){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:i});const r=this.getInitialEvent(e);r&&t.apply(i,r)}off(e,t,i){this.validateEventType_(e);const r=this.listeners_[e]||[];for(let s=0;s<r.length;s++)if(r[s].callback===t&&(!i||i===r[s].context)){r.splice(s,1);return}}validateEventType_(e){V(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ja extends zy{static getInstance(){return new ja}constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Nu()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}getInitialEvent(e){return V(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hp=32,Gp=768;class pe{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let i=0;for(let r=0;r<this.pieces_.length;r++)this.pieces_[r].length>0&&(this.pieces_[i]=this.pieces_[r],i++);this.pieces_.length=i,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function he(){return new pe("")}function ie(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function ni(n){return n.pieces_.length-n.pieceNum_}function ve(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new pe(n.pieces_,e)}function Lh(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function mb(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function Zs(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function qy(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new pe(e,0)}function Re(n,e){const t=[];for(let i=n.pieceNum_;i<n.pieces_.length;i++)t.push(n.pieces_[i]);if(e instanceof pe)for(let i=e.pieceNum_;i<e.pieces_.length;i++)t.push(e.pieces_[i]);else{const i=e.split("/");for(let r=0;r<i.length;r++)i[r].length>0&&t.push(i[r])}return new pe(t,0)}function re(n){return n.pieceNum_>=n.pieces_.length}function ht(n,e){const t=ie(n),i=ie(e);if(t===null)return e;if(t===i)return ht(ve(n),ve(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function gb(n,e){const t=Zs(n,0),i=Zs(e,0);for(let r=0;r<t.length&&r<i.length;r++){const s=Wi(t[r],i[r]);if(s!==0)return s}return t.length===i.length?0:t.length<i.length?-1:1}function Vh(n,e){if(ni(n)!==ni(e))return!1;for(let t=n.pieceNum_,i=e.pieceNum_;t<=n.pieces_.length;t++,i++)if(n.pieces_[t]!==e.pieces_[i])return!1;return!0}function bt(n,e){let t=n.pieceNum_,i=e.pieceNum_;if(ni(n)>ni(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[i])return!1;++t,++i}return!0}class _b{constructor(e,t){this.errorPrefix_=t,this.parts_=Zs(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let i=0;i<this.parts_.length;i++)this.byteLength_+=sl(this.parts_[i]);Wy(this)}}function yb(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=sl(e),Wy(n)}function vb(n){const e=n.parts_.pop();n.byteLength_-=sl(e),n.parts_.length>0&&(n.byteLength_-=1)}function Wy(n){if(n.byteLength_>Gp)throw new Error(n.errorPrefix_+"has a key path longer than "+Gp+" bytes ("+n.byteLength_+").");if(n.parts_.length>Hp)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+Hp+") or object contains a cycle "+Ti(n))}function Ti(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mh extends zy{static getInstance(){return new Mh}constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const i=!document[e];i!==this.visible_&&(this.visible_=i,this.trigger("visible",i))},!1)}getInitialEvent(e){return V(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ys=1e3,Eb=300*1e3,Kp=30*1e3,Tb=1.3,wb=3e4,Ib="server_kill",Qp=3;class vn extends jy{constructor(e,t,i,r,s,o,l,c){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=i,this.onConnectStatus_=r,this.onServerInfoUpdate_=s,this.authTokenProvider_=o,this.appCheckTokenProvider_=l,this.authOverride_=c,this.id=vn.nextPersistentConnectionId_++,this.log_=Co("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=ys,this.maxReconnectDelay_=Eb,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,c)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Mh.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&ja.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,i){const r=++this.requestNumber_,s={r,a:e,b:t};this.log_(We(s)),V(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(s),i&&(this.requestCBHash_[r]=i)}get(e){this.initConnection_();const t=new rl,r={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const l=o.d;o.s==="ok"?t.resolve(l):t.reject(l)}};this.outstandingGets_.push(r),this.outstandingGetCount_++;const s=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(s),t.promise}listen(e,t,i,r){this.initConnection_();const s=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+s),this.listens.has(o)||this.listens.set(o,new Map),V(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),V(!this.listens.get(o).has(s),"listen() called twice for same path/queryId.");const l={onComplete:r,hashFn:t,query:e,tag:i};this.listens.get(o).set(s,l),this.connected_&&this.sendListen_(l)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,i=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(i)})}sendListen_(e){const t=e.query,i=t._path.toString(),r=t._queryIdentifier;this.log_("Listen on "+i+" for "+r);const s={p:i},o="q";e.tag&&(s.q=t._queryObject,s.t=e.tag),s.h=e.hashFn(),this.sendRequest(o,s,l=>{const c=l.d,u=l.s;vn.warnOnListenWarnings_(c,t),(this.listens.get(i)&&this.listens.get(i).get(r))===e&&(this.log_("listen response",l),u!=="ok"&&this.removeListen_(i,r),e.onComplete&&e.onComplete(u,c))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&rn(e,"w")){const i=Cr(e,"w");if(Array.isArray(i)&&~i.indexOf("no_index")){const r='".indexOn": "'+t._queryParams.getIndex().toString()+'"',s=t._path.toString();pt(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${r} at ${s} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||KE(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=Kp)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=GE(e)?"auth":"gauth",i={cred:e};this.authOverride_===null?i.noauth=!0:typeof this.authOverride_=="object"&&(i.authvar=this.authOverride_),this.sendRequest(t,i,r=>{const s=r.s,o=r.d||"error";this.authToken_===e&&(s==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(s,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,i=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,i)})}unlisten(e,t){const i=e._path.toString(),r=e._queryIdentifier;this.log_("Unlisten called for "+i+" "+r),V(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(i,r)&&this.connected_&&this.sendUnlisten_(i,r,e._queryObject,t)}sendUnlisten_(e,t,i,r){this.log_("Unlisten on "+e+" for "+t);const s={p:e},o="n";r&&(s.q=i,s.t=r),this.sendRequest(o,s)}onDisconnectPut(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:i})}onDisconnectMerge(e,t,i){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,i):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:i})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,i,r){const s={p:t,d:i};this.log_("onDisconnect "+e,s),this.sendRequest(e,s,o=>{r&&setTimeout(()=>{r(o.s,o.d)},Math.floor(0))})}put(e,t,i,r){this.putInternal("p",e,t,i,r)}merge(e,t,i,r){this.putInternal("m",e,t,i,r)}putInternal(e,t,i,r,s){this.initConnection_();const o={p:t,d:i};s!==void 0&&(o.h=s),this.outstandingPuts_.push({action:e,request:o,onComplete:r}),this.outstandingPutCount_++;const l=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(l):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,i=this.outstandingPuts_[e].request,r=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,i,s=>{this.log_(t+" response",s),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),r&&r(s.s,s.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,i=>{if(i.s!=="ok"){const s=i.d;this.log_("reportStats","Error sending stats: "+s)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+We(e));const t=e.r,i=this.requestCBHash_[t];i&&(delete this.requestCBHash_[t],i(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):nu("Unrecognized action received from server: "+We(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){V(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=ys,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=ys,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>wb&&(this.reconnectDelay_=ys),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=Math.max(0,new Date().getTime()-this.lastConnectionAttemptTime_);let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*Tb)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),i=this.onRealtimeDisconnect_.bind(this),r=this.id+":"+vn.nextConnectionId_++,s=this.lastSessionId;let o=!1,l=null;const c=function(){l?l.close():(o=!0,i())},u=function(p){V(l,"sendRequest call when we're not connected not allowed."),l.sendRequest(p)};this.realtime_={close:c,sendRequest:u};const f=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[p,m]=await Promise.all([this.authTokenProvider_.getToken(f),this.appCheckTokenProvider_.getToken(f)]);o?Ge("getToken() completed but was canceled"):(Ge("getToken() completed. Creating connection."),this.authToken_=p&&p.accessToken,this.appCheckToken_=m&&m.token,l=new pb(r,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,i,v=>{pt(v+" ("+this.repoInfo_.toString()+")"),this.interrupt(Ib)},s))}catch(p){this.log_("Failed to get token: "+p),o||(this.repoInfo_.nodeAdmin&&pt(p),c())}}}interrupt(e){Ge("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){Ge("Resuming connection for reason: "+e),delete this.interruptReasons_[e],Pc(this.interruptReasons_)&&(this.reconnectDelay_=ys,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let i;t?i=t.map(s=>Nh(s)).join("$"):i="default";const r=this.removeListen_(e,i);r&&r.onComplete&&r.onComplete("permission_denied")}removeListen_(e,t){const i=new pe(e).toString();let r;if(this.listens.has(i)){const s=this.listens.get(i);r=s.get(t),s.delete(t),s.size===0&&this.listens.delete(i)}else r=void 0;return r}onAuthRevoked_(e,t){Ge("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=Qp&&(this.reconnectDelay_=Kp,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){Ge("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=Qp&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Ey.replace(/\./g,"-")]=1,Nu()?e["framework.cordova"]=1:Ym()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=ja.getInstance().currentlyOnline();return Pc(this.interruptReasons_)&&e}}vn.nextPersistentConnectionId_=0;vn.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new ee(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nl{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const i=new ee(Or,e),r=new ee(Or,t);return this.compare(i,r)!==0}minPost(){return ee.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let na;class $y extends Nl{static get __EMPTY_NODE(){return na}static set __EMPTY_NODE(e){na=e}compare(e,t){return Wi(e.name,t.name)}isDefinedOn(e){throw Br("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return ee.MIN}maxPost(){return new ee(Ni,na)}makePost(e,t){return V(typeof e=="string","KeyIndex indexValue must always be a string."),new ee(e,na)}toString(){return".key"}}const wr=new $y;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e,t,i,r,s=null){this.isReverse_=r,this.resultGenerator_=s,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?i(e.key,t):1,r&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class qe{constructor(e,t,i,r,s){this.key=e,this.value=t,this.color=i??qe.RED,this.left=r??dt.EMPTY_NODE,this.right=s??dt.EMPTY_NODE}copy(e,t,i,r,s){return new qe(e??this.key,t??this.value,i??this.color,r??this.left,s??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,i){let r=this;const s=i(e,r.key);return s<0?r=r.copy(null,null,null,r.left.insert(e,t,i),null):s===0?r=r.copy(null,t,null,null,null):r=r.copy(null,null,null,null,r.right.insert(e,t,i)),r.fixUp_()}removeMin_(){if(this.left.isEmpty())return dt.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let i,r;if(i=this,t(e,i.key)<0)!i.left.isEmpty()&&!i.left.isRed_()&&!i.left.left.isRed_()&&(i=i.moveRedLeft_()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed_()&&(i=i.rotateRight_()),!i.right.isEmpty()&&!i.right.isRed_()&&!i.right.left.isRed_()&&(i=i.moveRedRight_()),t(e,i.key)===0){if(i.right.isEmpty())return dt.EMPTY_NODE;r=i.right.min_(),i=i.copy(r.key,r.value,null,null,i.right.removeMin_())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,qe.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,qe.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}qe.RED=!0;qe.BLACK=!1;class Ab{copy(e,t,i,r,s){return this}insert(e,t,i){return new qe(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class dt{constructor(e,t=dt.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new dt(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,qe.BLACK,null,null))}remove(e){return new dt(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,qe.BLACK,null,null))}get(e){let t,i=this.root_;for(;!i.isEmpty();){if(t=this.comparator_(e,i.key),t===0)return i.value;t<0?i=i.left:t>0&&(i=i.right)}return null}getPredecessorKey(e){let t,i=this.root_,r=null;for(;!i.isEmpty();)if(t=this.comparator_(e,i.key),t===0){if(i.left.isEmpty())return r?r.key:null;for(i=i.left;!i.right.isEmpty();)i=i.right;return i.key}else t<0?i=i.left:t>0&&(r=i,i=i.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new ia(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new ia(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new ia(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new ia(this.root_,null,this.comparator_,!0,e)}}dt.EMPTY_NODE=new Ab;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cb(n,e){return Wi(n.name,e.name)}function Fh(n,e){return Wi(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ru;function Sb(n){ru=n}const Hy=function(n){return typeof n=="number"?"number:"+Ay(n):"string:"+n},Gy=function(n){if(n.isLeafNode()){const e=n.val();V(typeof e=="string"||typeof e=="number"||typeof e=="object"&&rn(e,".sv"),"Priority must be a string or number.")}else V(n===ru||n.isEmpty(),"priority of unexpected type.");V(n===ru||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Yp;class je{static set __childrenNodeConstructor(e){Yp=e}static get __childrenNodeConstructor(){return Yp}constructor(e,t=je.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,V(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),Gy(this.priorityNode_)}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new je(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:je.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return re(e)?this:ie(e)===".priority"?this.priorityNode_:je.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:je.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const i=ie(e);return i===null?t:t.isEmpty()&&i!==".priority"?this:(V(i!==".priority"||ni(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(i,je.__childrenNodeConstructor.EMPTY_NODE.updateChild(ve(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+Hy(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=Ay(this.value_):e+=this.value_,this.lazyHash_=wy(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===je.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof je.__childrenNodeConstructor?-1:(V(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,i=typeof this.value_,r=je.VALUE_TYPE_ORDER.indexOf(t),s=je.VALUE_TYPE_ORDER.indexOf(i);return V(r>=0,"Unknown leaf type: "+t),V(s>=0,"Unknown leaf type: "+i),r===s?i==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:s-r}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}je.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ky,Qy;function Rb(n){Ky=n}function bb(n){Qy=n}class Pb extends Nl{compare(e,t){const i=e.node.getPriority(),r=t.node.getPriority(),s=i.compareTo(r);return s===0?Wi(e.name,t.name):s}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return ee.MIN}maxPost(){return new ee(Ni,new je("[PRIORITY-POST]",Qy))}makePost(e,t){const i=Ky(e);return new ee(t,new je("[PRIORITY-POST]",i))}toString(){return".priority"}}const be=new Pb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kb=Math.log(2);class Nb{constructor(e){const t=s=>parseInt(Math.log(s)/kb,10),i=s=>parseInt(Array(s+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const r=i(this.count);this.bits_=e+1&r}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const za=function(n,e,t,i){n.sort(e);const r=function(c,u){const f=u-c;let p,m;if(f===0)return null;if(f===1)return p=n[c],m=t?t(p):p,new qe(m,p.node,qe.BLACK,null,null);{const v=parseInt(f/2,10)+c,I=r(c,v),k=r(v+1,u);return p=n[v],m=t?t(p):p,new qe(m,p.node,qe.BLACK,I,k)}},s=function(c){let u=null,f=null,p=n.length;const m=function(I,k){const N=p-I,x=p;p-=I;const j=r(N+1,x),B=n[N],te=t?t(B):B;v(new qe(te,B.node,k,null,j))},v=function(I){u?(u.left=I,u=I):(f=I,u=I)};for(let I=0;I<c.count;++I){const k=c.nextBitIsOne(),N=Math.pow(2,c.count-(I+1));k?m(N,qe.BLACK):(m(N,qe.BLACK),m(N,qe.RED))}return f},o=new Nb(n.length),l=s(o);return new dt(i||e,l)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Tc;const ar={};class gn{static get Default(){return V(ar&&be,"ChildrenNode.ts has not been loaded"),Tc=Tc||new gn({".priority":ar},{".priority":be}),Tc}constructor(e,t){this.indexes_=e,this.indexSet_=t}get(e){const t=Cr(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof dt?t:null}hasIndex(e){return rn(this.indexSet_,e.toString())}addIndex(e,t){V(e!==wr,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const i=[];let r=!1;const s=t.getIterator(ee.Wrap);let o=s.getNext();for(;o;)r=r||e.isDefinedOn(o.node),i.push(o),o=s.getNext();let l;r?l=za(i,e.getCompare()):l=ar;const c=e.toString(),u=Object.assign({},this.indexSet_);u[c]=e;const f=Object.assign({},this.indexes_);return f[c]=l,new gn(f,u)}addToIndexes(e,t){const i=Ea(this.indexes_,(r,s)=>{const o=Cr(this.indexSet_,s);if(V(o,"Missing index implementation for "+s),r===ar)if(o.isDefinedOn(e.node)){const l=[],c=t.getIterator(ee.Wrap);let u=c.getNext();for(;u;)u.name!==e.name&&l.push(u),u=c.getNext();return l.push(e),za(l,o.getCompare())}else return ar;else{const l=t.get(e.name);let c=r;return l&&(c=c.remove(new ee(e.name,l))),c.insert(e,e.node)}});return new gn(i,this.indexSet_)}removeFromIndexes(e,t){const i=Ea(this.indexes_,r=>{if(r===ar)return r;{const s=t.get(e.name);return s?r.remove(new ee(e.name,s)):r}});return new gn(i,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let vs;class H{static get EMPTY_NODE(){return vs||(vs=new H(new dt(Fh),null,gn.Default))}constructor(e,t,i){this.children_=e,this.priorityNode_=t,this.indexMap_=i,this.lazyHash_=null,this.priorityNode_&&Gy(this.priorityNode_),this.children_.isEmpty()&&V(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}isLeafNode(){return!1}getPriority(){return this.priorityNode_||vs}updatePriority(e){return this.children_.isEmpty()?this:new H(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?vs:t}}getChild(e){const t=ie(e);return t===null?this:this.getImmediateChild(t).getChild(ve(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(V(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const i=new ee(e,t);let r,s;t.isEmpty()?(r=this.children_.remove(e),s=this.indexMap_.removeFromIndexes(i,this.children_)):(r=this.children_.insert(e,t),s=this.indexMap_.addToIndexes(i,this.children_));const o=r.isEmpty()?vs:this.priorityNode_;return new H(r,o,s)}}updateChild(e,t){const i=ie(e);if(i===null)return t;{V(ie(e)!==".priority"||ni(e)===1,".priority must be the last token in a path");const r=this.getImmediateChild(i).updateChild(ve(e),t);return this.updateImmediateChild(i,r)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let i=0,r=0,s=!0;if(this.forEachChild(be,(o,l)=>{t[o]=l.val(e),i++,s&&H.INTEGER_REGEXP_.test(o)?r=Math.max(r,Number(o)):s=!1}),!e&&s&&r<2*i){const o=[];for(const l in t)o[l]=t[l];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+Hy(this.getPriority().val())+":"),this.forEachChild(be,(t,i)=>{const r=i.hash();r!==""&&(e+=":"+t+":"+r)}),this.lazyHash_=e===""?"":wy(e)}return this.lazyHash_}getPredecessorChildName(e,t,i){const r=this.resolveIndex_(i);if(r){const s=r.getPredecessorKey(new ee(e,t));return s?s.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.minKey();return i&&i.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new ee(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const i=t.maxKey();return i&&i.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new ee(t,this.children_.get(t)):null}forEachChild(e,t){const i=this.resolveIndex_(e);return i?i.inorderTraversal(r=>t(r.name,r.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getIteratorFrom(e,r=>r);{const r=this.children_.getIteratorFrom(e.name,ee.Wrap);let s=r.peek();for(;s!=null&&t.compare(s,e)<0;)r.getNext(),s=r.peek();return r}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const i=this.resolveIndex_(t);if(i)return i.getReverseIteratorFrom(e,r=>r);{const r=this.children_.getReverseIteratorFrom(e.name,ee.Wrap);let s=r.peek();for(;s!=null&&t.compare(s,e)>0;)r.getNext(),s=r.peek();return r}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===So?-1:0}withIndex(e){if(e===wr||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new H(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===wr||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const i=this.getIterator(be),r=t.getIterator(be);let s=i.getNext(),o=r.getNext();for(;s&&o;){if(s.name!==o.name||!s.node.equals(o.node))return!1;s=i.getNext(),o=r.getNext()}return s===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===wr?null:this.indexMap_.get(e.toString())}}H.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class Db extends H{constructor(){super(new dt(Fh),H.EMPTY_NODE,gn.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return H.EMPTY_NODE}isEmpty(){return!1}}const So=new Db;Object.defineProperties(ee,{MIN:{value:new ee(Or,H.EMPTY_NODE)},MAX:{value:new ee(Ni,So)}});$y.__EMPTY_NODE=H.EMPTY_NODE;je.__childrenNodeConstructor=H;Sb(So);bb(So);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ob=!0;function Ke(n,e=null){if(n===null)return H.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),V(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new je(t,Ke(e))}if(!(n instanceof Array)&&Ob){const t=[];let i=!1;if(Xe(n,(o,l)=>{if(o.substring(0,1)!=="."){const c=Ke(l);c.isEmpty()||(i=i||!c.getPriority().isEmpty(),t.push(new ee(o,c)))}}),t.length===0)return H.EMPTY_NODE;const s=za(t,Cb,o=>o.name,Fh);if(i){const o=za(t,be.getCompare());return new H(s,Ke(e),new gn({".priority":o},{".priority":be}))}else return new H(s,Ke(e),gn.Default)}else{let t=H.EMPTY_NODE;return Xe(n,(i,r)=>{if(rn(n,i)&&i.substring(0,1)!=="."){const s=Ke(r);(s.isLeafNode()||!s.isEmpty())&&(t=t.updateImmediateChild(i,s))}}),t.updatePriority(Ke(e))}}Rb(Ke);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xb extends Nl{constructor(e){super(),this.indexPath_=e,V(!re(e)&&ie(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const i=this.extractChild(e.node),r=this.extractChild(t.node),s=i.compareTo(r);return s===0?Wi(e.name,t.name):s}makePost(e,t){const i=Ke(e),r=H.EMPTY_NODE.updateChild(this.indexPath_,i);return new ee(t,r)}maxPost(){const e=H.EMPTY_NODE.updateChild(this.indexPath_,So);return new ee(Ni,e)}toString(){return Zs(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lb extends Nl{compare(e,t){const i=e.node.compareTo(t.node);return i===0?Wi(e.name,t.name):i}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return ee.MIN}maxPost(){return ee.MAX}makePost(e,t){const i=Ke(e);return new ee(t,i)}toString(){return".value"}}const Vb=new Lb;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yy(n){return{type:"value",snapshotNode:n}}function xr(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function eo(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function to(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function Mb(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uh{constructor(e){this.index_=e}updateChild(e,t,i,r,s,o){V(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const l=e.getImmediateChild(t);return l.getChild(r).equals(i.getChild(r))&&l.isEmpty()===i.isEmpty()||(o!=null&&(i.isEmpty()?e.hasChild(t)?o.trackChildChange(eo(t,l)):V(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):l.isEmpty()?o.trackChildChange(xr(t,i)):o.trackChildChange(to(t,i,l))),e.isLeafNode()&&i.isEmpty())?e:e.updateImmediateChild(t,i).withIndex(this.index_)}updateFullNode(e,t,i){return i!=null&&(e.isLeafNode()||e.forEachChild(be,(r,s)=>{t.hasChild(r)||i.trackChildChange(eo(r,s))}),t.isLeafNode()||t.forEachChild(be,(r,s)=>{if(e.hasChild(r)){const o=e.getImmediateChild(r);o.equals(s)||i.trackChildChange(to(r,s,o))}else i.trackChildChange(xr(r,s))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?H.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no{constructor(e){this.indexedFilter_=new Uh(e.getIndex()),this.index_=e.getIndex(),this.startPost_=no.getStartPost_(e),this.endPost_=no.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,i=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&i}updateChild(e,t,i,r,s,o){return this.matches(new ee(t,i))||(i=H.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,i,r,s,o)}updateFullNode(e,t,i){t.isLeafNode()&&(t=H.EMPTY_NODE);let r=t.withIndex(this.index_);r=r.updatePriority(H.EMPTY_NODE);const s=this;return t.forEachChild(be,(o,l)=>{s.matches(new ee(o,l))||(r=r.updateImmediateChild(o,H.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,r,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fb{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const i=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?i<=0:i<0},this.withinEndPost=t=>{const i=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?i<=0:i<0},this.rangedFilter_=new no(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,i,r,s,o){return this.rangedFilter_.matches(new ee(t,i))||(i=H.EMPTY_NODE),e.getImmediateChild(t).equals(i)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,i,r,s,o):this.fullLimitUpdateChild_(e,t,i,s,o)}updateFullNode(e,t,i){let r;if(t.isLeafNode()||t.isEmpty())r=H.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){r=H.EMPTY_NODE.withIndex(this.index_);let s;this.reverse_?s=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):s=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;s.hasNext()&&o<this.limit_;){const l=s.getNext();if(this.withinDirectionalStart(l))if(this.withinDirectionalEnd(l))r=r.updateImmediateChild(l.name,l.node),o++;else break;else continue}}else{r=t.withIndex(this.index_),r=r.updatePriority(H.EMPTY_NODE);let s;this.reverse_?s=r.getReverseIterator(this.index_):s=r.getIterator(this.index_);let o=0;for(;s.hasNext();){const l=s.getNext();o<this.limit_&&this.withinDirectionalStart(l)&&this.withinDirectionalEnd(l)?o++:r=r.updateImmediateChild(l.name,H.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,r,i)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,i,r,s){let o;if(this.reverse_){const p=this.index_.getCompare();o=(m,v)=>p(v,m)}else o=this.index_.getCompare();const l=e;V(l.numChildren()===this.limit_,"");const c=new ee(t,i),u=this.reverse_?l.getFirstChild(this.index_):l.getLastChild(this.index_),f=this.rangedFilter_.matches(c);if(l.hasChild(t)){const p=l.getImmediateChild(t);let m=r.getChildAfterChild(this.index_,u,this.reverse_);for(;m!=null&&(m.name===t||l.hasChild(m.name));)m=r.getChildAfterChild(this.index_,m,this.reverse_);const v=m==null?1:o(m,c);if(f&&!i.isEmpty()&&v>=0)return s!=null&&s.trackChildChange(to(t,i,p)),l.updateImmediateChild(t,i);{s!=null&&s.trackChildChange(eo(t,p));const k=l.updateImmediateChild(t,H.EMPTY_NODE);return m!=null&&this.rangedFilter_.matches(m)?(s!=null&&s.trackChildChange(xr(m.name,m.node)),k.updateImmediateChild(m.name,m.node)):k}}else return i.isEmpty()?e:f&&o(u,c)>=0?(s!=null&&(s.trackChildChange(eo(u.name,u.node)),s.trackChildChange(xr(t,i))),l.updateImmediateChild(t,i).updateImmediateChild(u.name,H.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bh{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=be}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return V(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return V(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:Or}hasEnd(){return this.endSet_}getIndexEndValue(){return V(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return V(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:Ni}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return V(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===be}copy(){const e=new Bh;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function Ub(n){return n.loadsAllData()?new Uh(n.getIndex()):n.hasLimit()?new Fb(n):new no(n)}function Xp(n){const e={};if(n.isDefault())return e;let t;if(n.index_===be?t="$priority":n.index_===Vb?t="$value":n.index_===wr?t="$key":(V(n.index_ instanceof xb,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=We(t),n.startSet_){const i=n.startAfterSet_?"startAfter":"startAt";e[i]=We(n.indexStartValue_),n.startNameSet_&&(e[i]+=","+We(n.indexStartName_))}if(n.endSet_){const i=n.endBeforeSet_?"endBefore":"endAt";e[i]=We(n.indexEndValue_),n.endNameSet_&&(e[i]+=","+We(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function Jp(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==be&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qa extends jy{reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(V(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}constructor(e,t,i,r){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=i,this.appCheckTokenProvider_=r,this.log_=Co("p:rest:"),this.listens_={}}listen(e,t,i,r){const s=e._path.toString();this.log_("Listen called for "+s+" "+e._queryIdentifier);const o=qa.getListenId_(e,i),l={};this.listens_[o]=l;const c=Xp(e._queryParams);this.restRequest_(s+".json",c,(u,f)=>{let p=f;if(u===404&&(p=null,u=null),u===null&&this.onDataUpdate_(s,p,!1,i),Cr(this.listens_,o)===l){let m;u?u===401?m="permission_denied":m="rest_error:"+u:m="ok",r(m,null)}})}unlisten(e,t){const i=qa.getListenId_(e,t);delete this.listens_[i]}get(e){const t=Xp(e._queryParams),i=e._path.toString(),r=new rl;return this.restRequest_(i+".json",t,(s,o)=>{let l=o;s===404&&(l=null,s=null),s===null?(this.onDataUpdate_(i,l,!1,null),r.resolve(l)):r.reject(new Error(l))}),r.promise}refreshAuthToken(e){}restRequest_(e,t={},i){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([r,s])=>{r&&r.accessToken&&(t.auth=r.accessToken),s&&s.token&&(t.ac=s.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+jr(t);this.log_("Sending REST request for "+o);const l=new XMLHttpRequest;l.onreadystatechange=()=>{if(i&&l.readyState===4){this.log_("REST Response for "+o+" received. status:",l.status,"response:",l.responseText);let c=null;if(l.status>=200&&l.status<300){try{c=js(l.responseText)}catch{pt("Failed to parse JSON response for "+o+": "+l.responseText)}i(null,c)}else l.status!==401&&l.status!==404&&pt("Got unsuccessful REST response for "+o+" Status: "+l.status),i(l.status);i=null}},l.open("GET",o,!0),l.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bb{constructor(){this.rootNode_=H.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wa(){return{value:null,children:new Map}}function Xy(n,e,t){if(re(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const i=ie(e);n.children.has(i)||n.children.set(i,Wa());const r=n.children.get(i);e=ve(e),Xy(r,e,t)}}function su(n,e,t){n.value!==null?t(e,n.value):jb(n,(i,r)=>{const s=new pe(e.toString()+"/"+i);su(r,s,t)})}function jb(n,e){n.children.forEach((t,i)=>{e(i,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zb{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&Xe(this.last_,(i,r)=>{t[i]=t[i]-r}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zp=10*1e3,qb=30*1e3,Wb=300*1e3;class $b{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new zb(e);const i=Zp+(qb-Zp)*Math.random();Vs(this.reportStats_.bind(this),Math.floor(i))}reportStats_(){const e=this.statsListener_.get(),t={};let i=!1;Xe(e,(r,s)=>{s>0&&rn(this.statsToReport_,r)&&(t[r]=s,i=!0)}),i&&this.server_.reportStats(t),Vs(this.reportStats_.bind(this),Math.floor(Math.random()*2*Wb))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ft;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Ft||(Ft={}));function jh(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function zh(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function qh(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(e,t,i){this.path=e,this.affectedTree=t,this.revert=i,this.type=Ft.ACK_USER_WRITE,this.source=jh()}operationForChild(e){if(re(this.path)){if(this.affectedTree.value!=null)return V(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new pe(e));return new $a(he(),t,this.revert)}}else return V(ie(this.path)===e,"operationForChild called for unrelated child."),new $a(ve(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class io{constructor(e,t){this.source=e,this.path=t,this.type=Ft.LISTEN_COMPLETE}operationForChild(e){return re(this.path)?new io(this.source,he()):new io(this.source,ve(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e,t,i){this.source=e,this.path=t,this.snap=i,this.type=Ft.OVERWRITE}operationForChild(e){return re(this.path)?new Di(this.source,he(),this.snap.getImmediateChild(e)):new Di(this.source,ve(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lr{constructor(e,t,i){this.source=e,this.path=t,this.children=i,this.type=Ft.MERGE}operationForChild(e){if(re(this.path)){const t=this.children.subtree(new pe(e));return t.isEmpty()?null:t.value?new Di(this.source,he(),t.value):new Lr(this.source,he(),t)}else return V(ie(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new Lr(this.source,ve(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{constructor(e,t,i){this.node_=e,this.fullyInitialized_=t,this.filtered_=i}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(re(e))return this.isFullyInitialized()&&!this.filtered_;const t=ie(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hb{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function Gb(n,e,t,i){const r=[],s=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&s.push(Mb(o.childName,o.snapshotNode))}),Es(n,r,"child_removed",e,i,t),Es(n,r,"child_added",e,i,t),Es(n,r,"child_moved",s,i,t),Es(n,r,"child_changed",e,i,t),Es(n,r,"value",e,i,t),r}function Es(n,e,t,i,r,s){const o=i.filter(l=>l.type===t);o.sort((l,c)=>Qb(n,l,c)),o.forEach(l=>{const c=Kb(n,l,s);r.forEach(u=>{u.respondsTo(l.type)&&e.push(u.createEvent(c,n.query_))})})}function Kb(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function Qb(n,e,t){if(e.childName==null||t.childName==null)throw Br("Should only compare child_ events.");const i=new ee(e.childName,e.snapshotNode),r=new ee(t.childName,t.snapshotNode);return n.index_.compare(i,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dl(n,e){return{eventCache:n,serverCache:e}}function Ms(n,e,t,i){return Dl(new Oi(e,t,i),n.serverCache)}function Jy(n,e,t,i){return Dl(n.eventCache,new Oi(e,t,i))}function ou(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function xi(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let wc;const Yb=()=>(wc||(wc=new dt(xR)),wc);class ye{static fromObject(e){let t=new ye(null);return Xe(e,(i,r)=>{t=t.set(new pe(i),r)}),t}constructor(e,t=Yb()){this.value=e,this.children=t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:he(),value:this.value};if(re(e))return null;{const i=ie(e),r=this.children.get(i);if(r!==null){const s=r.findRootMostMatchingPathAndValue(ve(e),t);return s!=null?{path:Re(new pe(i),s.path),value:s.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(re(e))return this;{const t=ie(e),i=this.children.get(t);return i!==null?i.subtree(ve(e)):new ye(null)}}set(e,t){if(re(e))return new ye(t,this.children);{const i=ie(e),s=(this.children.get(i)||new ye(null)).set(ve(e),t),o=this.children.insert(i,s);return new ye(this.value,o)}}remove(e){if(re(e))return this.children.isEmpty()?new ye(null):new ye(null,this.children);{const t=ie(e),i=this.children.get(t);if(i){const r=i.remove(ve(e));let s;return r.isEmpty()?s=this.children.remove(t):s=this.children.insert(t,r),this.value===null&&s.isEmpty()?new ye(null):new ye(this.value,s)}else return this}}get(e){if(re(e))return this.value;{const t=ie(e),i=this.children.get(t);return i?i.get(ve(e)):null}}setTree(e,t){if(re(e))return t;{const i=ie(e),s=(this.children.get(i)||new ye(null)).setTree(ve(e),t);let o;return s.isEmpty()?o=this.children.remove(i):o=this.children.insert(i,s),new ye(this.value,o)}}fold(e){return this.fold_(he(),e)}fold_(e,t){const i={};return this.children.inorderTraversal((r,s)=>{i[r]=s.fold_(Re(e,r),t)}),t(e,this.value,i)}findOnPath(e,t){return this.findOnPath_(e,he(),t)}findOnPath_(e,t,i){const r=this.value?i(t,this.value):!1;if(r)return r;if(re(e))return null;{const s=ie(e),o=this.children.get(s);return o?o.findOnPath_(ve(e),Re(t,s),i):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,he(),t)}foreachOnPath_(e,t,i){if(re(e))return this;{this.value&&i(t,this.value);const r=ie(e),s=this.children.get(r);return s?s.foreachOnPath_(ve(e),Re(t,r),i):new ye(null)}}foreach(e){this.foreach_(he(),e)}foreach_(e,t){this.children.inorderTraversal((i,r)=>{r.foreach_(Re(e,i),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,i)=>{i.value&&e(t,i.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zt{constructor(e){this.writeTree_=e}static empty(){return new zt(new ye(null))}}function Fs(n,e,t){if(re(e))return new zt(new ye(t));{const i=n.writeTree_.findRootMostValueAndPath(e);if(i!=null){const r=i.path;let s=i.value;const o=ht(r,e);return s=s.updateChild(o,t),new zt(n.writeTree_.set(r,s))}else{const r=new ye(t),s=n.writeTree_.setTree(e,r);return new zt(s)}}}function au(n,e,t){let i=n;return Xe(t,(r,s)=>{i=Fs(i,Re(e,r),s)}),i}function em(n,e){if(re(e))return zt.empty();{const t=n.writeTree_.setTree(e,new ye(null));return new zt(t)}}function lu(n,e){return $i(n,e)!=null}function $i(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(ht(t.path,e)):null}function tm(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(be,(i,r)=>{e.push(new ee(i,r))}):n.writeTree_.children.inorderTraversal((i,r)=>{r.value!=null&&e.push(new ee(i,r.value))}),e}function Hn(n,e){if(re(e))return n;{const t=$i(n,e);return t!=null?new zt(new ye(t)):new zt(n.writeTree_.subtree(e))}}function cu(n){return n.writeTree_.isEmpty()}function Vr(n,e){return Zy(he(),n.writeTree_,e)}function Zy(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let i=null;return e.children.inorderTraversal((r,s)=>{r===".priority"?(V(s.value!==null,"Priority writes must always be leaf nodes"),i=s.value):t=Zy(Re(n,r),s,t)}),!t.getChild(n).isEmpty()&&i!==null&&(t=t.updateChild(Re(n,".priority"),i)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wh(n,e){return iv(e,n)}function Xb(n,e,t,i,r){V(i>n.lastWriteId,"Stacking an older write on top of newer ones"),r===void 0&&(r=!0),n.allWrites.push({path:e,snap:t,writeId:i,visible:r}),r&&(n.visibleWrites=Fs(n.visibleWrites,e,t)),n.lastWriteId=i}function Jb(n,e,t,i){V(i>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:i,visible:!0}),n.visibleWrites=au(n.visibleWrites,e,t),n.lastWriteId=i}function Zb(n,e){for(let t=0;t<n.allWrites.length;t++){const i=n.allWrites[t];if(i.writeId===e)return i}return null}function e0(n,e){const t=n.allWrites.findIndex(l=>l.writeId===e);V(t>=0,"removeWrite called with nonexistent writeId.");const i=n.allWrites[t];n.allWrites.splice(t,1);let r=i.visible,s=!1,o=n.allWrites.length-1;for(;r&&o>=0;){const l=n.allWrites[o];l.visible&&(o>=t&&t0(l,i.path)?r=!1:bt(i.path,l.path)&&(s=!0)),o--}if(r){if(s)return n0(n),!0;if(i.snap)n.visibleWrites=em(n.visibleWrites,i.path);else{const l=i.children;Xe(l,c=>{n.visibleWrites=em(n.visibleWrites,Re(i.path,c))})}return!0}else return!1}function t0(n,e){if(n.snap)return bt(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&bt(Re(n.path,t),e))return!0;return!1}function n0(n){n.visibleWrites=ev(n.allWrites,i0,he()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function i0(n){return n.visible}function ev(n,e,t){let i=zt.empty();for(let r=0;r<n.length;++r){const s=n[r];if(e(s)){const o=s.path;let l;if(s.snap)bt(t,o)?(l=ht(t,o),i=Fs(i,l,s.snap)):bt(o,t)&&(l=ht(o,t),i=Fs(i,he(),s.snap.getChild(l)));else if(s.children){if(bt(t,o))l=ht(t,o),i=au(i,l,s.children);else if(bt(o,t))if(l=ht(o,t),re(l))i=au(i,he(),s.children);else{const c=Cr(s.children,ie(l));if(c){const u=c.getChild(ve(l));i=Fs(i,he(),u)}}}else throw Br("WriteRecord should have .snap or .children")}}return i}function tv(n,e,t,i,r){if(!i&&!r){const s=$i(n.visibleWrites,e);if(s!=null)return s;{const o=Hn(n.visibleWrites,e);if(cu(o))return t;if(t==null&&!lu(o,he()))return null;{const l=t||H.EMPTY_NODE;return Vr(o,l)}}}else{const s=Hn(n.visibleWrites,e);if(!r&&cu(s))return t;if(!r&&t==null&&!lu(s,he()))return null;{const o=function(u){return(u.visible||r)&&(!i||!~i.indexOf(u.writeId))&&(bt(u.path,e)||bt(e,u.path))},l=ev(n.allWrites,o,e),c=t||H.EMPTY_NODE;return Vr(l,c)}}}function r0(n,e,t){let i=H.EMPTY_NODE;const r=$i(n.visibleWrites,e);if(r)return r.isLeafNode()||r.forEachChild(be,(s,o)=>{i=i.updateImmediateChild(s,o)}),i;if(t){const s=Hn(n.visibleWrites,e);return t.forEachChild(be,(o,l)=>{const c=Vr(Hn(s,new pe(o)),l);i=i.updateImmediateChild(o,c)}),tm(s).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}else{const s=Hn(n.visibleWrites,e);return tm(s).forEach(o=>{i=i.updateImmediateChild(o.name,o.node)}),i}}function s0(n,e,t,i,r){V(i||r,"Either existingEventSnap or existingServerSnap must exist");const s=Re(e,t);if(lu(n.visibleWrites,s))return null;{const o=Hn(n.visibleWrites,s);return cu(o)?r.getChild(t):Vr(o,r.getChild(t))}}function o0(n,e,t,i){const r=Re(e,t),s=$i(n.visibleWrites,r);if(s!=null)return s;if(i.isCompleteForChild(t)){const o=Hn(n.visibleWrites,r);return Vr(o,i.getNode().getImmediateChild(t))}else return null}function a0(n,e){return $i(n.visibleWrites,e)}function l0(n,e,t,i,r,s,o){let l;const c=Hn(n.visibleWrites,e),u=$i(c,he());if(u!=null)l=u;else if(t!=null)l=Vr(c,t);else return[];if(l=l.withIndex(o),!l.isEmpty()&&!l.isLeafNode()){const f=[],p=o.getCompare(),m=s?l.getReverseIteratorFrom(i,o):l.getIteratorFrom(i,o);let v=m.getNext();for(;v&&f.length<r;)p(v,i)!==0&&f.push(v),v=m.getNext();return f}else return[]}function c0(){return{visibleWrites:zt.empty(),allWrites:[],lastWriteId:-1}}function Ha(n,e,t,i){return tv(n.writeTree,n.treePath,e,t,i)}function $h(n,e){return r0(n.writeTree,n.treePath,e)}function nm(n,e,t,i){return s0(n.writeTree,n.treePath,e,t,i)}function Ga(n,e){return a0(n.writeTree,Re(n.treePath,e))}function u0(n,e,t,i,r,s){return l0(n.writeTree,n.treePath,e,t,i,r,s)}function Hh(n,e,t){return o0(n.writeTree,n.treePath,e,t)}function nv(n,e){return iv(Re(n.treePath,e),n.writeTree)}function iv(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class h0{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,i=e.childName;V(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),V(i!==".priority","Only non-priority child changes can be tracked.");const r=this.changeMap.get(i);if(r){const s=r.type;if(t==="child_added"&&s==="child_removed")this.changeMap.set(i,to(i,e.snapshotNode,r.snapshotNode));else if(t==="child_removed"&&s==="child_added")this.changeMap.delete(i);else if(t==="child_removed"&&s==="child_changed")this.changeMap.set(i,eo(i,r.oldSnap));else if(t==="child_changed"&&s==="child_added")this.changeMap.set(i,xr(i,e.snapshotNode));else if(t==="child_changed"&&s==="child_changed")this.changeMap.set(i,to(i,e.snapshotNode,r.oldSnap));else throw Br("Illegal combination of changes: "+e+" occurred after "+r)}else this.changeMap.set(i,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class d0{getCompleteChild(e){return null}getChildAfterChild(e,t,i){return null}}const rv=new d0;class Gh{constructor(e,t,i=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=i}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const i=this.optCompleteServerCache_!=null?new Oi(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return Hh(this.writes_,e,i)}}getChildAfterChild(e,t,i){const r=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:xi(this.viewCache_),s=u0(this.writes_,r,t,1,i,e);return s.length===0?null:s[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f0(n){return{filter:n}}function p0(n,e){V(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),V(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function m0(n,e,t,i,r){const s=new h0;let o,l;if(t.type===Ft.OVERWRITE){const u=t;u.source.fromUser?o=uu(n,e,u.path,u.snap,i,r,s):(V(u.source.fromServer,"Unknown source."),l=u.source.tagged||e.serverCache.isFiltered()&&!re(u.path),o=Ka(n,e,u.path,u.snap,i,r,l,s))}else if(t.type===Ft.MERGE){const u=t;u.source.fromUser?o=_0(n,e,u.path,u.children,i,r,s):(V(u.source.fromServer,"Unknown source."),l=u.source.tagged||e.serverCache.isFiltered(),o=hu(n,e,u.path,u.children,i,r,l,s))}else if(t.type===Ft.ACK_USER_WRITE){const u=t;u.revert?o=E0(n,e,u.path,i,r,s):o=y0(n,e,u.path,u.affectedTree,i,r,s)}else if(t.type===Ft.LISTEN_COMPLETE)o=v0(n,e,t.path,i,s);else throw Br("Unknown operation type: "+t.type);const c=s.getChanges();return g0(e,o,c),{viewCache:o,changes:c}}function g0(n,e,t){const i=e.eventCache;if(i.isFullyInitialized()){const r=i.getNode().isLeafNode()||i.getNode().isEmpty(),s=ou(n);(t.length>0||!n.eventCache.isFullyInitialized()||r&&!i.getNode().equals(s)||!i.getNode().getPriority().equals(s.getPriority()))&&t.push(Yy(ou(e)))}}function sv(n,e,t,i,r,s){const o=e.eventCache;if(Ga(i,t)!=null)return e;{let l,c;if(re(t))if(V(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const u=xi(e),f=u instanceof H?u:H.EMPTY_NODE,p=$h(i,f);l=n.filter.updateFullNode(e.eventCache.getNode(),p,s)}else{const u=Ha(i,xi(e));l=n.filter.updateFullNode(e.eventCache.getNode(),u,s)}else{const u=ie(t);if(u===".priority"){V(ni(t)===1,"Can't have a priority with additional path components");const f=o.getNode();c=e.serverCache.getNode();const p=nm(i,t,f,c);p!=null?l=n.filter.updatePriority(f,p):l=o.getNode()}else{const f=ve(t);let p;if(o.isCompleteForChild(u)){c=e.serverCache.getNode();const m=nm(i,t,o.getNode(),c);m!=null?p=o.getNode().getImmediateChild(u).updateChild(f,m):p=o.getNode().getImmediateChild(u)}else p=Hh(i,u,e.serverCache);p!=null?l=n.filter.updateChild(o.getNode(),u,p,f,r,s):l=o.getNode()}}return Ms(e,l,o.isFullyInitialized()||re(t),n.filter.filtersNodes())}}function Ka(n,e,t,i,r,s,o,l){const c=e.serverCache;let u;const f=o?n.filter:n.filter.getIndexedFilter();if(re(t))u=f.updateFullNode(c.getNode(),i,null);else if(f.filtersNodes()&&!c.isFiltered()){const v=c.getNode().updateChild(t,i);u=f.updateFullNode(c.getNode(),v,null)}else{const v=ie(t);if(!c.isCompleteForPath(t)&&ni(t)>1)return e;const I=ve(t),N=c.getNode().getImmediateChild(v).updateChild(I,i);v===".priority"?u=f.updatePriority(c.getNode(),N):u=f.updateChild(c.getNode(),v,N,I,rv,null)}const p=Jy(e,u,c.isFullyInitialized()||re(t),f.filtersNodes()),m=new Gh(r,p,s);return sv(n,p,t,r,m,l)}function uu(n,e,t,i,r,s,o){const l=e.eventCache;let c,u;const f=new Gh(r,e,s);if(re(t))u=n.filter.updateFullNode(e.eventCache.getNode(),i,o),c=Ms(e,u,!0,n.filter.filtersNodes());else{const p=ie(t);if(p===".priority")u=n.filter.updatePriority(e.eventCache.getNode(),i),c=Ms(e,u,l.isFullyInitialized(),l.isFiltered());else{const m=ve(t),v=l.getNode().getImmediateChild(p);let I;if(re(m))I=i;else{const k=f.getCompleteChild(p);k!=null?Lh(m)===".priority"&&k.getChild(qy(m)).isEmpty()?I=k:I=k.updateChild(m,i):I=H.EMPTY_NODE}if(v.equals(I))c=e;else{const k=n.filter.updateChild(l.getNode(),p,I,m,f,o);c=Ms(e,k,l.isFullyInitialized(),n.filter.filtersNodes())}}}return c}function im(n,e){return n.eventCache.isCompleteForChild(e)}function _0(n,e,t,i,r,s,o){let l=e;return i.foreach((c,u)=>{const f=Re(t,c);im(e,ie(f))&&(l=uu(n,l,f,u,r,s,o))}),i.foreach((c,u)=>{const f=Re(t,c);im(e,ie(f))||(l=uu(n,l,f,u,r,s,o))}),l}function rm(n,e,t){return t.foreach((i,r)=>{e=e.updateChild(i,r)}),e}function hu(n,e,t,i,r,s,o,l){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let c=e,u;re(t)?u=i:u=new ye(null).setTree(t,i);const f=e.serverCache.getNode();return u.children.inorderTraversal((p,m)=>{if(f.hasChild(p)){const v=e.serverCache.getNode().getImmediateChild(p),I=rm(n,v,m);c=Ka(n,c,new pe(p),I,r,s,o,l)}}),u.children.inorderTraversal((p,m)=>{const v=!e.serverCache.isCompleteForChild(p)&&m.value===null;if(!f.hasChild(p)&&!v){const I=e.serverCache.getNode().getImmediateChild(p),k=rm(n,I,m);c=Ka(n,c,new pe(p),k,r,s,o,l)}}),c}function y0(n,e,t,i,r,s,o){if(Ga(r,t)!=null)return e;const l=e.serverCache.isFiltered(),c=e.serverCache;if(i.value!=null){if(re(t)&&c.isFullyInitialized()||c.isCompleteForPath(t))return Ka(n,e,t,c.getNode().getChild(t),r,s,l,o);if(re(t)){let u=new ye(null);return c.getNode().forEachChild(wr,(f,p)=>{u=u.set(new pe(f),p)}),hu(n,e,t,u,r,s,l,o)}else return e}else{let u=new ye(null);return i.foreach((f,p)=>{const m=Re(t,f);c.isCompleteForPath(m)&&(u=u.set(f,c.getNode().getChild(m)))}),hu(n,e,t,u,r,s,l,o)}}function v0(n,e,t,i,r){const s=e.serverCache,o=Jy(e,s.getNode(),s.isFullyInitialized()||re(t),s.isFiltered());return sv(n,o,t,i,rv,r)}function E0(n,e,t,i,r,s){let o;if(Ga(i,t)!=null)return e;{const l=new Gh(i,e,r),c=e.eventCache.getNode();let u;if(re(t)||ie(t)===".priority"){let f;if(e.serverCache.isFullyInitialized())f=Ha(i,xi(e));else{const p=e.serverCache.getNode();V(p instanceof H,"serverChildren would be complete if leaf node"),f=$h(i,p)}f=f,u=n.filter.updateFullNode(c,f,s)}else{const f=ie(t);let p=Hh(i,f,e.serverCache);p==null&&e.serverCache.isCompleteForChild(f)&&(p=c.getImmediateChild(f)),p!=null?u=n.filter.updateChild(c,f,p,ve(t),l,s):e.eventCache.getNode().hasChild(f)?u=n.filter.updateChild(c,f,H.EMPTY_NODE,ve(t),l,s):u=c,u.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Ha(i,xi(e)),o.isLeafNode()&&(u=n.filter.updateFullNode(u,o,s)))}return o=e.serverCache.isFullyInitialized()||Ga(i,he())!=null,Ms(e,u,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class T0{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const i=this.query_._queryParams,r=new Uh(i.getIndex()),s=Ub(i);this.processor_=f0(s);const o=t.serverCache,l=t.eventCache,c=r.updateFullNode(H.EMPTY_NODE,o.getNode(),null),u=s.updateFullNode(H.EMPTY_NODE,l.getNode(),null),f=new Oi(c,o.isFullyInitialized(),r.filtersNodes()),p=new Oi(u,l.isFullyInitialized(),s.filtersNodes());this.viewCache_=Dl(p,f),this.eventGenerator_=new Hb(this.query_)}get query(){return this.query_}}function w0(n){return n.viewCache_.serverCache.getNode()}function I0(n,e){const t=xi(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!re(e)&&!t.getImmediateChild(ie(e)).isEmpty())?t.getChild(e):null}function sm(n){return n.eventRegistrations_.length===0}function A0(n,e){n.eventRegistrations_.push(e)}function om(n,e,t){const i=[];if(t){V(e==null,"A cancel should cancel all event registrations.");const r=n.query._path;n.eventRegistrations_.forEach(s=>{const o=s.createCancelEvent(t,r);o&&i.push(o)})}if(e){let r=[];for(let s=0;s<n.eventRegistrations_.length;++s){const o=n.eventRegistrations_[s];if(!o.matches(e))r.push(o);else if(e.hasAnyCallback()){r=r.concat(n.eventRegistrations_.slice(s+1));break}}n.eventRegistrations_=r}else n.eventRegistrations_=[];return i}function am(n,e,t,i){e.type===Ft.MERGE&&e.source.queryId!==null&&(V(xi(n.viewCache_),"We should always have a full cache before handling merges"),V(ou(n.viewCache_),"Missing event cache, even though we have a server cache"));const r=n.viewCache_,s=m0(n.processor_,r,e,t,i);return p0(n.processor_,s.viewCache),V(s.viewCache.serverCache.isFullyInitialized()||!r.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=s.viewCache,ov(n,s.changes,s.viewCache.eventCache.getNode(),null)}function C0(n,e){const t=n.viewCache_.eventCache,i=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(be,(s,o)=>{i.push(xr(s,o))}),t.isFullyInitialized()&&i.push(Yy(t.getNode())),ov(n,i,t.getNode(),e)}function ov(n,e,t,i){const r=i?[i]:n.eventRegistrations_;return Gb(n.eventGenerator_,e,t,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qa;class S0{constructor(){this.views=new Map}}function R0(n){V(!Qa,"__referenceConstructor has already been defined"),Qa=n}function b0(){return V(Qa,"Reference.ts has not been loaded"),Qa}function P0(n){return n.views.size===0}function Kh(n,e,t,i){const r=e.source.queryId;if(r!==null){const s=n.views.get(r);return V(s!=null,"SyncTree gave us an op for an invalid query."),am(s,e,t,i)}else{let s=[];for(const o of n.views.values())s=s.concat(am(o,e,t,i));return s}}function k0(n,e,t,i,r){const s=e._queryIdentifier,o=n.views.get(s);if(!o){let l=Ha(t,r?i:null),c=!1;l?c=!0:i instanceof H?(l=$h(t,i),c=!1):(l=H.EMPTY_NODE,c=!1);const u=Dl(new Oi(l,c,!1),new Oi(i,r,!1));return new T0(e,u)}return o}function N0(n,e,t,i,r,s){const o=k0(n,e,i,r,s);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),A0(o,t),C0(o,t)}function D0(n,e,t,i){const r=e._queryIdentifier,s=[];let o=[];const l=ii(n);if(r==="default")for(const[c,u]of n.views.entries())o=o.concat(om(u,t,i)),sm(u)&&(n.views.delete(c),u.query._queryParams.loadsAllData()||s.push(u.query));else{const c=n.views.get(r);c&&(o=o.concat(om(c,t,i)),sm(c)&&(n.views.delete(r),c.query._queryParams.loadsAllData()||s.push(c.query)))}return l&&!ii(n)&&s.push(new(b0())(e._repo,e._path)),{removed:s,events:o}}function av(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function Ir(n,e){let t=null;for(const i of n.views.values())t=t||I0(i,e);return t}function lv(n,e){if(e._queryParams.loadsAllData())return Ol(n);{const i=e._queryIdentifier;return n.views.get(i)}}function cv(n,e){return lv(n,e)!=null}function ii(n){return Ol(n)!=null}function Ol(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ya;function O0(n){V(!Ya,"__referenceConstructor has already been defined"),Ya=n}function x0(){return V(Ya,"Reference.ts has not been loaded"),Ya}let L0=1;class lm{constructor(e){this.listenProvider_=e,this.syncPointTree_=new ye(null),this.pendingWriteTree_=c0(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function V0(n,e,t,i,r){return Xb(n.pendingWriteTree_,e,t,i,r),r?Yr(n,new Di(jh(),e,t)):[]}function M0(n,e,t,i){Jb(n.pendingWriteTree_,e,t,i);const r=ye.fromObject(t);return Yr(n,new Lr(jh(),e,r))}function Ci(n,e,t=!1){const i=Zb(n.pendingWriteTree_,e);if(e0(n.pendingWriteTree_,e)){let s=new ye(null);return i.snap!=null?s=s.set(he(),!0):Xe(i.children,o=>{s=s.set(new pe(o),!0)}),Yr(n,new $a(i.path,s,t))}else return[]}function xl(n,e,t){return Yr(n,new Di(zh(),e,t))}function F0(n,e,t){const i=ye.fromObject(t);return Yr(n,new Lr(zh(),e,i))}function U0(n,e){return Yr(n,new io(zh(),e))}function B0(n,e,t){const i=Qh(n,t);if(i){const r=Yh(i),s=r.path,o=r.queryId,l=ht(s,e),c=new io(qh(o),l);return Xh(n,s,c)}else return[]}function du(n,e,t,i,r=!1){const s=e._path,o=n.syncPointTree_.get(s);let l=[];if(o&&(e._queryIdentifier==="default"||cv(o,e))){const c=D0(o,e,t,i);P0(o)&&(n.syncPointTree_=n.syncPointTree_.remove(s));const u=c.removed;if(l=c.events,!r){const f=u.findIndex(m=>m._queryParams.loadsAllData())!==-1,p=n.syncPointTree_.findOnPath(s,(m,v)=>ii(v));if(f&&!p){const m=n.syncPointTree_.subtree(s);if(!m.isEmpty()){const v=q0(m);for(let I=0;I<v.length;++I){const k=v[I],N=k.query,x=fv(n,k);n.listenProvider_.startListening(Us(N),Xa(n,N),x.hashFn,x.onComplete)}}}!p&&u.length>0&&!i&&(f?n.listenProvider_.stopListening(Us(e),null):u.forEach(m=>{const v=n.queryToTagMap.get(Ll(m));n.listenProvider_.stopListening(Us(m),v)}))}W0(n,u)}return l}function j0(n,e,t,i){const r=Qh(n,i);if(r!=null){const s=Yh(r),o=s.path,l=s.queryId,c=ht(o,e),u=new Di(qh(l),c,t);return Xh(n,o,u)}else return[]}function z0(n,e,t,i){const r=Qh(n,i);if(r){const s=Yh(r),o=s.path,l=s.queryId,c=ht(o,e),u=ye.fromObject(t),f=new Lr(qh(l),c,u);return Xh(n,o,f)}else return[]}function cm(n,e,t,i=!1){const r=e._path;let s=null,o=!1;n.syncPointTree_.foreachOnPath(r,(m,v)=>{const I=ht(m,r);s=s||Ir(v,I),o=o||ii(v)});let l=n.syncPointTree_.get(r);l?(o=o||ii(l),s=s||Ir(l,he())):(l=new S0,n.syncPointTree_=n.syncPointTree_.set(r,l));let c;s!=null?c=!0:(c=!1,s=H.EMPTY_NODE,n.syncPointTree_.subtree(r).foreachChild((v,I)=>{const k=Ir(I,he());k&&(s=s.updateImmediateChild(v,k))}));const u=cv(l,e);if(!u&&!e._queryParams.loadsAllData()){const m=Ll(e);V(!n.queryToTagMap.has(m),"View does not exist, but we have a tag");const v=$0();n.queryToTagMap.set(m,v),n.tagToQueryMap.set(v,m)}const f=Wh(n.pendingWriteTree_,r);let p=N0(l,e,t,f,s,c);if(!u&&!o&&!i){const m=lv(l,e);p=p.concat(H0(n,e,m))}return p}function uv(n,e,t){const r=n.pendingWriteTree_,s=n.syncPointTree_.findOnPath(e,(o,l)=>{const c=ht(o,e),u=Ir(l,c);if(u)return u});return tv(r,e,s,t,!0)}function Yr(n,e){return hv(e,n.syncPointTree_,null,Wh(n.pendingWriteTree_,he()))}function hv(n,e,t,i){if(re(n.path))return dv(n,e,t,i);{const r=e.get(he());t==null&&r!=null&&(t=Ir(r,he()));let s=[];const o=ie(n.path),l=n.operationForChild(o),c=e.children.get(o);if(c&&l){const u=t?t.getImmediateChild(o):null,f=nv(i,o);s=s.concat(hv(l,c,u,f))}return r&&(s=s.concat(Kh(r,n,i,t))),s}}function dv(n,e,t,i){const r=e.get(he());t==null&&r!=null&&(t=Ir(r,he()));let s=[];return e.children.inorderTraversal((o,l)=>{const c=t?t.getImmediateChild(o):null,u=nv(i,o),f=n.operationForChild(o);f&&(s=s.concat(dv(f,l,c,u)))}),r&&(s=s.concat(Kh(r,n,i,t))),s}function fv(n,e){const t=e.query,i=Xa(n,t);return{hashFn:()=>(w0(e)||H.EMPTY_NODE).hash(),onComplete:r=>{if(r==="ok")return i?B0(n,t._path,i):U0(n,t._path);{const s=MR(r,t);return du(n,t,null,s)}}}}function Xa(n,e){const t=Ll(e);return n.queryToTagMap.get(t)}function Ll(n){return n._path.toString()+"$"+n._queryIdentifier}function Qh(n,e){return n.tagToQueryMap.get(e)}function Yh(n){const e=n.indexOf("$");return V(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new pe(n.substr(0,e))}}function Xh(n,e,t){const i=n.syncPointTree_.get(e);V(i,"Missing sync point for query tag that we're tracking");const r=Wh(n.pendingWriteTree_,e);return Kh(i,t,r,null)}function q0(n){return n.fold((e,t,i)=>{if(t&&ii(t))return[Ol(t)];{let r=[];return t&&(r=av(t)),Xe(i,(s,o)=>{r=r.concat(o)}),r}})}function Us(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(x0())(n._repo,n._path):n}function W0(n,e){for(let t=0;t<e.length;++t){const i=e[t];if(!i._queryParams.loadsAllData()){const r=Ll(i),s=n.queryToTagMap.get(r);n.queryToTagMap.delete(r),n.tagToQueryMap.delete(s)}}}function $0(){return L0++}function H0(n,e,t){const i=e._path,r=Xa(n,e),s=fv(n,t),o=n.listenProvider_.startListening(Us(e),r,s.hashFn,s.onComplete),l=n.syncPointTree_.subtree(i);if(r)V(!ii(l.value),"If we're adding a query, it shouldn't be shadowed");else{const c=l.fold((u,f,p)=>{if(!re(u)&&f&&ii(f))return[Ol(f).query];{let m=[];return f&&(m=m.concat(av(f).map(v=>v.query))),Xe(p,(v,I)=>{m=m.concat(I)}),m}});for(let u=0;u<c.length;++u){const f=c[u];n.listenProvider_.stopListening(Us(f),Xa(n,f))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jh{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new Jh(t)}node(){return this.node_}}class Zh{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=Re(this.path_,e);return new Zh(this.syncTree_,t)}node(){return uv(this.syncTree_,this.path_)}}const G0=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},um=function(n,e,t){if(!n||typeof n!="object")return n;if(V(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return K0(n[".sv"],e,t);if(typeof n[".sv"]=="object")return Q0(n[".sv"],e);V(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},K0=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:V(!1,"Unexpected server value: "+n)}},Q0=function(n,e,t){n.hasOwnProperty("increment")||V(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const i=n.increment;typeof i!="number"&&V(!1,"Unexpected increment value: "+i);const r=e.node();if(V(r!==null&&typeof r<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!r.isLeafNode())return i;const o=r.getValue();return typeof o!="number"?i:o+i},pv=function(n,e,t,i){return ed(e,new Zh(t,n),i)},Y0=function(n,e,t){return ed(n,new Jh(e),t)};function ed(n,e,t){const i=n.getPriority().val(),r=um(i,e.getImmediateChild(".priority"),t);let s;if(n.isLeafNode()){const o=n,l=um(o.getValue(),e,t);return l!==o.getValue()||r!==o.getPriority().val()?new je(l,Ke(r)):n}else{const o=n;return s=o,r!==o.getPriority().val()&&(s=s.updatePriority(new je(r))),o.forEachChild(be,(l,c)=>{const u=ed(c,e.getImmediateChild(l),t);u!==c&&(s=s.updateImmediateChild(l,u))}),s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(e="",t=null,i={children:{},childCount:0}){this.name=e,this.parent=t,this.node=i}}function nd(n,e){let t=e instanceof pe?e:new pe(e),i=n,r=ie(t);for(;r!==null;){const s=Cr(i.node.children,r)||{children:{},childCount:0};i=new td(r,i,s),t=ve(t),r=ie(t)}return i}function Xr(n){return n.node.value}function mv(n,e){n.node.value=e,fu(n)}function gv(n){return n.node.childCount>0}function X0(n){return Xr(n)===void 0&&!gv(n)}function Vl(n,e){Xe(n.node.children,(t,i)=>{e(new td(t,n,i))})}function _v(n,e,t,i){t&&e(n),Vl(n,r=>{_v(r,e,!0)})}function J0(n,e,t){let i=n.parent;for(;i!==null;){if(e(i))return!0;i=i.parent}return!1}function Ro(n){return new pe(n.parent===null?n.name:Ro(n.parent)+"/"+n.name)}function fu(n){n.parent!==null&&Z0(n.parent,n.name,n)}function Z0(n,e,t){const i=X0(t),r=rn(n.node.children,e);i&&r?(delete n.node.children[e],n.node.childCount--,fu(n)):!i&&!r&&(n.node.children[e]=t.node,n.node.childCount++,fu(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eP=/[\[\].#$\/\u0000-\u001F\u007F]/,tP=/[\[\].#$\u0000-\u001F\u007F]/,Ic=10*1024*1024,id=function(n){return typeof n=="string"&&n.length!==0&&!eP.test(n)},yv=function(n){return typeof n=="string"&&n.length!==0&&!tP.test(n)},nP=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),yv(n)},iP=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!kh(n)||n&&typeof n=="object"&&rn(n,".sv")},rd=function(n,e,t){const i=t instanceof pe?new _b(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+Ti(i));if(typeof e=="function")throw new Error(n+"contains a function "+Ti(i)+" with contents = "+e.toString());if(kh(e))throw new Error(n+"contains "+e.toString()+" "+Ti(i));if(typeof e=="string"&&e.length>Ic/3&&sl(e)>Ic)throw new Error(n+"contains a string greater than "+Ic+" utf8 bytes "+Ti(i)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let r=!1,s=!1;if(Xe(e,(o,l)=>{if(o===".value")r=!0;else if(o!==".priority"&&o!==".sv"&&(s=!0,!id(o)))throw new Error(n+" contains an invalid key ("+o+") "+Ti(i)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);yb(i,o),rd(n,l,i),vb(i)}),r&&s)throw new Error(n+' contains ".value" child '+Ti(i)+" in addition to actual children.")}},rP=function(n,e){let t,i;for(t=0;t<e.length;t++){i=e[t];const s=Zs(i);for(let o=0;o<s.length;o++)if(!(s[o]===".priority"&&o===s.length-1)){if(!id(s[o]))throw new Error(n+"contains an invalid key ("+s[o]+") in path "+i.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(gb);let r=null;for(t=0;t<e.length;t++){if(i=e[t],r!==null&&bt(r,i))throw new Error(n+"contains a path "+r.toString()+" that is ancestor of another path "+i.toString());r=i}},sP=function(n,e,t,i){const r=Du(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(r+" must be an object containing the children to replace.");const s=[];Xe(e,(o,l)=>{const c=new pe(o);if(rd(r,l,Re(t,c)),Lh(c)===".priority"&&!iP(l))throw new Error(r+"contains an invalid value for '"+c.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");s.push(c)}),rP(r,s)},vv=function(n,e,t,i){if(!yv(t))throw new Error(Du(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},oP=function(n,e,t,i){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),vv(n,e,t)},aP=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!id(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!nP(t))throw new Error(Du(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lP{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function sd(n,e){let t=null;for(let i=0;i<e.length;i++){const r=e[i],s=r.getPath();t!==null&&!Vh(s,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:s}),t.events.push(r)}t&&n.eventLists_.push(t)}function Ev(n,e,t){sd(n,t),Tv(n,i=>Vh(i,e))}function Rn(n,e,t){sd(n,t),Tv(n,i=>bt(i,e)||bt(e,i))}function Tv(n,e){n.recursionDepth_++;let t=!0;for(let i=0;i<n.eventLists_.length;i++){const r=n.eventLists_[i];if(r){const s=r.path;e(s)?(cP(n.eventLists_[i]),n.eventLists_[i]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function cP(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const i=t.getEventRunner();Ls&&Ge("event: "+t.toString()),Qr(i)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uP="repo_interrupt",hP=25;class dP{constructor(e,t,i,r){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=i,this.appCheckProvider_=r,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new lP,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Wa(),this.transactionQueueTree_=new td,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function fP(n,e,t){if(n.stats_=Oh(n.repoInfo_),n.forceRestClient_||jR())n.server_=new qa(n.repoInfo_,(i,r,s,o)=>{hm(n,i,r,s,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>dm(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{We(t)}catch(i){throw new Error("Invalid authOverride provided: "+i)}}n.persistentConnection_=new vn(n.repoInfo_,e,(i,r,s,o)=>{hm(n,i,r,s,o)},i=>{dm(n,i)},i=>{mP(n,i)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(i=>{n.server_.refreshAuthToken(i)}),n.appCheckProvider_.addTokenChangeListener(i=>{n.server_.refreshAppCheckToken(i.token)}),n.statsReporter_=HR(n.repoInfo_,()=>new $b(n.stats_,n.server_)),n.infoData_=new Bb,n.infoSyncTree_=new lm({startListening:(i,r,s,o)=>{let l=[];const c=n.infoData_.getNode(i._path);return c.isEmpty()||(l=xl(n.infoSyncTree_,i._path,c),setTimeout(()=>{o("ok")},0)),l},stopListening:()=>{}}),ad(n,"connected",!1),n.serverSyncTree_=new lm({startListening:(i,r,s,o)=>(n.server_.listen(i,s,r,(l,c)=>{const u=o(l,c);Rn(n.eventQueue_,i._path,u)}),[]),stopListening:(i,r)=>{n.server_.unlisten(i,r)}})}function pP(n){const t=n.infoData_.getNode(new pe(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function od(n){return G0({timestamp:pP(n)})}function hm(n,e,t,i,r){n.dataUpdateCount++;const s=new pe(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(r)if(i){const c=Ea(t,u=>Ke(u));o=z0(n.serverSyncTree_,s,c,r)}else{const c=Ke(t);o=j0(n.serverSyncTree_,s,c,r)}else if(i){const c=Ea(t,u=>Ke(u));o=F0(n.serverSyncTree_,s,c)}else{const c=Ke(t);o=xl(n.serverSyncTree_,s,c)}let l=s;o.length>0&&(l=ro(n,s)),Rn(n.eventQueue_,l,o)}function dm(n,e){ad(n,"connected",e),e===!1&&_P(n)}function mP(n,e){Xe(e,(t,i)=>{ad(n,t,i)})}function ad(n,e,t){const i=new pe("/.info/"+e),r=Ke(t);n.infoData_.updateSnapshot(i,r);const s=xl(n.infoSyncTree_,i,r);Rn(n.eventQueue_,i,s)}function wv(n){return n.nextWriteId_++}function gP(n,e,t,i){ld(n,"update",{path:e.toString(),value:t});let r=!0;const s=od(n),o={};if(Xe(t,(l,c)=>{r=!1,o[l]=pv(Re(e,l),Ke(c),n.serverSyncTree_,s)}),r)Ge("update() called with empty data.  Don't do anything."),fm(n,i,"ok",void 0);else{const l=wv(n),c=M0(n.serverSyncTree_,e,o,l);sd(n.eventQueue_,c),n.server_.merge(e.toString(),t,(u,f)=>{const p=u==="ok";p||pt("update at "+e+" failed: "+u);const m=Ci(n.serverSyncTree_,l,!p),v=m.length>0?ro(n,e):e;Rn(n.eventQueue_,v,m),fm(n,i,u,f)}),Xe(t,u=>{const f=Rv(n,Re(e,u));ro(n,f)}),Rn(n.eventQueue_,e,[])}}function _P(n){ld(n,"onDisconnectEvents");const e=od(n),t=Wa();su(n.onDisconnect_,he(),(r,s)=>{const o=pv(r,s,n.serverSyncTree_,e);Xy(t,r,o)});let i=[];su(t,he(),(r,s)=>{i=i.concat(xl(n.serverSyncTree_,r,s));const o=Rv(n,r);ro(n,o)}),n.onDisconnect_=Wa(),Rn(n.eventQueue_,he(),i)}function yP(n,e,t){let i;ie(e._path)===".info"?i=cm(n.infoSyncTree_,e,t):i=cm(n.serverSyncTree_,e,t),Ev(n.eventQueue_,e._path,i)}function vP(n,e,t){let i;ie(e._path)===".info"?i=du(n.infoSyncTree_,e,t):i=du(n.serverSyncTree_,e,t),Ev(n.eventQueue_,e._path,i)}function EP(n){n.persistentConnection_&&n.persistentConnection_.interrupt(uP)}function ld(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),Ge(t,...e)}function fm(n,e,t,i){e&&Qr(()=>{if(t==="ok")e(null);else{const r=(t||"error").toUpperCase();let s=r;i&&(s+=": "+i);const o=new Error(s);o.code=r,e(o)}})}function Iv(n,e,t){return uv(n.serverSyncTree_,e,t)||H.EMPTY_NODE}function cd(n,e=n.transactionQueueTree_){if(e||Ml(n,e),Xr(e)){const t=Cv(n,e);V(t.length>0,"Sending zero length transaction queue"),t.every(r=>r.status===0)&&TP(n,Ro(e),t)}else gv(e)&&Vl(e,t=>{cd(n,t)})}function TP(n,e,t){const i=t.map(u=>u.currentWriteId),r=Iv(n,e,i);let s=r;const o=r.hash();for(let u=0;u<t.length;u++){const f=t[u];V(f.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),f.status=1,f.retryCount++;const p=ht(e,f.path);s=s.updateChild(p,f.currentOutputSnapshotRaw)}const l=s.val(!0),c=e;n.server_.put(c.toString(),l,u=>{ld(n,"transaction put response",{path:c.toString(),status:u});let f=[];if(u==="ok"){const p=[];for(let m=0;m<t.length;m++)t[m].status=2,f=f.concat(Ci(n.serverSyncTree_,t[m].currentWriteId)),t[m].onComplete&&p.push(()=>t[m].onComplete(null,!0,t[m].currentOutputSnapshotResolved)),t[m].unwatcher();Ml(n,nd(n.transactionQueueTree_,e)),cd(n,n.transactionQueueTree_),Rn(n.eventQueue_,e,f);for(let m=0;m<p.length;m++)Qr(p[m])}else{if(u==="datastale")for(let p=0;p<t.length;p++)t[p].status===3?t[p].status=4:t[p].status=0;else{pt("transaction at "+c.toString()+" failed: "+u);for(let p=0;p<t.length;p++)t[p].status=4,t[p].abortReason=u}ro(n,e)}},o)}function ro(n,e){const t=Av(n,e),i=Ro(t),r=Cv(n,t);return wP(n,r,i),i}function wP(n,e,t){if(e.length===0)return;const i=[];let r=[];const o=e.filter(l=>l.status===0).map(l=>l.currentWriteId);for(let l=0;l<e.length;l++){const c=e[l],u=ht(t,c.path);let f=!1,p;if(V(u!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),c.status===4)f=!0,p=c.abortReason,r=r.concat(Ci(n.serverSyncTree_,c.currentWriteId,!0));else if(c.status===0)if(c.retryCount>=hP)f=!0,p="maxretry",r=r.concat(Ci(n.serverSyncTree_,c.currentWriteId,!0));else{const m=Iv(n,c.path,o);c.currentInputSnapshot=m;const v=e[l].update(m.val());if(v!==void 0){rd("transaction failed: Data returned ",v,c.path);let I=Ke(v);typeof v=="object"&&v!=null&&rn(v,".priority")||(I=I.updatePriority(m.getPriority()));const N=c.currentWriteId,x=od(n),j=Y0(I,m,x);c.currentOutputSnapshotRaw=I,c.currentOutputSnapshotResolved=j,c.currentWriteId=wv(n),o.splice(o.indexOf(N),1),r=r.concat(V0(n.serverSyncTree_,c.path,j,c.currentWriteId,c.applyLocally)),r=r.concat(Ci(n.serverSyncTree_,N,!0))}else f=!0,p="nodata",r=r.concat(Ci(n.serverSyncTree_,c.currentWriteId,!0))}Rn(n.eventQueue_,t,r),r=[],f&&(e[l].status=2,(function(m){setTimeout(m,Math.floor(0))})(e[l].unwatcher),e[l].onComplete&&(p==="nodata"?i.push(()=>e[l].onComplete(null,!1,e[l].currentInputSnapshot)):i.push(()=>e[l].onComplete(new Error(p),!1,null))))}Ml(n,n.transactionQueueTree_);for(let l=0;l<i.length;l++)Qr(i[l]);cd(n,n.transactionQueueTree_)}function Av(n,e){let t,i=n.transactionQueueTree_;for(t=ie(e);t!==null&&Xr(i)===void 0;)i=nd(i,t),e=ve(e),t=ie(e);return i}function Cv(n,e){const t=[];return Sv(n,e,t),t.sort((i,r)=>i.order-r.order),t}function Sv(n,e,t){const i=Xr(e);if(i)for(let r=0;r<i.length;r++)t.push(i[r]);Vl(e,r=>{Sv(n,r,t)})}function Ml(n,e){const t=Xr(e);if(t){let i=0;for(let r=0;r<t.length;r++)t[r].status!==2&&(t[i]=t[r],i++);t.length=i,mv(e,t.length>0?t:void 0)}Vl(e,i=>{Ml(n,i)})}function Rv(n,e){const t=Ro(Av(n,e)),i=nd(n.transactionQueueTree_,e);return J0(i,r=>{Ac(n,r)}),Ac(n,i),_v(i,r=>{Ac(n,r)}),t}function Ac(n,e){const t=Xr(e);if(t){const i=[];let r=[],s=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(V(s===o-1,"All SENT items should be at beginning of queue."),s=o,t[o].status=3,t[o].abortReason="set"):(V(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),r=r.concat(Ci(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&i.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));s===-1?mv(e,void 0):t.length=s+1,Rn(n.eventQueue_,Ro(e),r);for(let o=0;o<i.length;o++)Qr(i[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function IP(n){let e="";const t=n.split("/");for(let i=0;i<t.length;i++)if(t[i].length>0){let r=t[i];try{r=decodeURIComponent(r.replace(/\+/g," "))}catch{}e+="/"+r}return e}function AP(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const i=t.split("=");i.length===2?e[decodeURIComponent(i[0])]=decodeURIComponent(i[1]):pt(`Invalid query segment '${t}' in query '${n}'`)}return e}const pm=function(n,e){const t=CP(n),i=t.namespace;t.domain==="firebase.com"&&Sn(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!i||i==="undefined")&&t.domain!=="localhost"&&Sn("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||DR();const r=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new xy(t.host,t.secure,i,r,e,"",i!==t.subdomain),path:new pe(t.pathString)}},CP=function(n){let e="",t="",i="",r="",s="",o=!0,l="https",c=443;if(typeof n=="string"){let u=n.indexOf("//");u>=0&&(l=n.substring(0,u-1),n=n.substring(u+2));let f=n.indexOf("/");f===-1&&(f=n.length);let p=n.indexOf("?");p===-1&&(p=n.length),e=n.substring(0,Math.min(f,p)),f<p&&(r=IP(n.substring(f,p)));const m=AP(n.substring(Math.min(n.length,p)));u=e.indexOf(":"),u>=0?(o=l==="https"||l==="wss",c=parseInt(e.substring(u+1),10)):u=e.length;const v=e.slice(0,u);if(v.toLowerCase()==="localhost")t="localhost";else if(v.split(".").length<=2)t=v;else{const I=e.indexOf(".");i=e.substring(0,I).toLowerCase(),t=e.substring(I+1),s=i}"ns"in m&&(s=m.ns)}return{host:e,port:c,domain:t,subdomain:i,secure:o,scheme:l,pathString:r,namespace:s}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SP{constructor(e,t,i,r){this.eventType=e,this.eventRegistration=t,this.snapshot=i,this.prevName=r}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+We(this.snapshot.exportVal())}}class RP{constructor(e,t,i){this.eventRegistration=e,this.error=t,this.path=i}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bP{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return V(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ud{constructor(e,t,i,r){this._repo=e,this._path=t,this._queryParams=i,this._orderByCalled=r}get key(){return re(this._path)?null:Lh(this._path)}get ref(){return new ci(this._repo,this._path)}get _queryIdentifier(){const e=Jp(this._queryParams),t=Nh(e);return t==="{}"?"default":t}get _queryObject(){return Jp(this._queryParams)}isEqual(e){if(e=we(e),!(e instanceof ud))return!1;const t=this._repo===e._repo,i=Vh(this._path,e._path),r=this._queryIdentifier===e._queryIdentifier;return t&&i&&r}toJSON(){return this.toString()}toString(){return this._repo.toString()+mb(this._path)}}class ci extends ud{constructor(e,t){super(e,t,new Bh,!1)}get parent(){const e=qy(this._path);return e===null?null:new ci(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class Ja{constructor(e,t,i){this._node=e,this.ref=t,this._index=i}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new pe(e),i=pu(this.ref,e);return new Ja(this._node.getChild(t),i,be)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(i,r)=>e(new Ja(r,pu(this.ref,i),be)))}hasChild(e){const t=new pe(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function bv(n,e){return n=we(n),n._checkNotDeleted("ref"),e!==void 0?pu(n._root,e):n._root}function pu(n,e){return n=we(n),ie(n._path)===null?oP("child","path",e):vv("child","path",e),new ci(n._repo,Re(n._path,e))}function PP(n,e){sP("update",e,n._path);const t=new rl;return gP(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}class hd{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const i=t._queryParams.getIndex();return new SP("value",this,new Ja(e.snapshotNode,new ci(t._repo,t._path),i))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new RP(this,e,t):null}matches(e){return e instanceof hd?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function kP(n,e,t,i,r){const s=new bP(t,void 0),o=new hd(s);return yP(n._repo,n,o),()=>vP(n._repo,n,o)}function NP(n,e,t,i){return kP(n,"value",e)}R0(ci);O0(ci);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const DP="FIREBASE_DATABASE_EMULATOR_HOST",mu={};let OP=!1;function xP(n,e,t,i){const r=e.lastIndexOf(":"),s=e.substring(0,r),o=oi(s);n.repoInfo_=new xy(e,o,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0,t),i&&(n.authTokenProvider_=i)}function LP(n,e,t,i,r){let s=i||n.options.databaseURL;s===void 0&&(n.options.projectId||Sn("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),Ge("Using default host for project ",n.options.projectId),s=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=pm(s,r),l=o.repoInfo,c;typeof process<"u"&&xp&&(c=xp[DP]),c?(s=`http://${c}?ns=${l.namespace}`,o=pm(s,r),l=o.repoInfo):o.repoInfo.secure;const u=new qR(n.name,n.options,e);aP("Invalid Firebase Database URL",o),re(o.path)||Sn("Database URL must point to the root of a Firebase Database (not including a child path).");const f=MP(l,n,u,new zR(n,t));return new FP(f,n)}function VP(n,e){const t=mu[e];(!t||t[n.key]!==n)&&Sn(`Database ${e}(${n.repoInfo_}) has already been deleted.`),EP(n),delete t[n.key]}function MP(n,e,t,i){let r=mu[e.name];r||(r={},mu[e.name]=r);let s=r[n.toURLString()];return s&&Sn("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),s=new dP(n,OP,t,i),r[n.toURLString()]=s,s}class FP{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(fP(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ci(this._repo,he())),this._rootInternal}_delete(){return this._rootInternal!==null&&(VP(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&Sn("Cannot call "+e+" on a deleted database.")}}function UP(n=xu(),e){const t=al(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const i=Hm("database");i&&BP(t,...i)}return t}function BP(n,e,t,i={}){n=we(n),n._checkNotDeleted("useEmulator");const r=`${e}:${t}`,s=n._repoInternal;if(n._instanceStarted){if(r===n._repoInternal.repoInfo_.host&&Gn(i,s.repoInfo_.emulatorOptions))return;Sn("connectDatabaseEmulator() cannot initialize or alter the emulator configuration after the database instance has started.")}let o;if(s.repoInfo_.nodeAdmin)i.mockUserToken&&Sn('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),o=new ga(ga.OWNER);else if(i.mockUserToken){const l=typeof i.mockUserToken=="string"?i.mockUserToken:Qm(i.mockUserToken,n.app.options.projectId);o=new ga(l)}oi(e)&&(Pu(e),ku("Database",!0)),xP(s,r,i,o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jP(n){SR(Ui),Ri(new Kn("database",(e,{instanceIdentifier:t})=>{const i=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return LP(i,r,s,t)},"PUBLIC").setMultipleInstances(!0)),Kt(Lp,Vp,n),Kt(Lp,Vp,"esm2017")}vn.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};vn.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};jP();const zP=["/firebase-config.json","/api/firebase-config","https://zh-kr-jp.web.app/firebase-config.json","https://zh-kr-jp.web.app/api/firebase-config"];let Za=!1,Ts=null,En=null,ri=null,so=null;const mm=new fn;function qP(n){!(n!=null&&n.apiKey)||!(n!=null&&n.projectId)||Ts||(Ts=eg(n),En=cA(Ts),ri=aR(Ts),so=UP(Ts),Za=!0)}async function WP(n){const e=await fetch(n,{headers:{Accept:"application/json"}});if(!e.ok)return null;const t=await e.json().catch(()=>null);return t!=null&&t.apiKey?t:null}async function $P(){if(Za)return!0;const n=new Set;for(const e of zP)if(!n.has(e)){n.add(e);try{qP(await WP(e))}catch{}if(Za)return!0}return!1}let ra=null;function Pv(){return Za}function bo(){return ri}function HP(n){return En?(CI(En).catch(()=>{}),Yw(En,n)):(n(null),()=>{})}async function GP(){if(!En)throw new Error("Firebase is not configured.");try{await _I(En,mm)}catch(n){if((n==null?void 0:n.code)==="auth/popup-blocked"||(n==null?void 0:n.code)==="auth/popup-closed-by-user"){await II(En,mm);return}throw n}}function KP(){return En?Xw(En):Promise.resolve()}function gm(n,e){if(ra&&(ra(),ra=null),!so||!n)return;const t=bv(so,`users/${n}/prefs`);ra=NP(t,i=>{e(i.val()||{})})}function QP(n,e){return!so||!n?Promise.resolve():PP(bv(so,`users/${n}/prefs`),e)}function YP(n,e){return!ri||!n?Promise.resolve():vy(_h(ri,"users",n,"history"),{...e,createdAt:Ua()})}async function XP(n,{pageSize:e=20,cursor:t=null,sort:i="newest"}={}){if(!ri||!n)return{items:[],cursor:null,done:!0};const r=i==="oldest"?gc("createdAt","asc"):i==="az"?gc("source"):gc("createdAt","desc"),s=[_h(ri,"users",n,"history"),r];t&&s.push(_R(t)),s.push(gR(e));const o=await _y(mR(...s));return{items:o.docs.map(l=>({id:l.id,...l.data()})),cursor:o.docs[o.docs.length-1]||null,done:o.docs.length<e}}function JP(n,e){return!ri||!n||!e?Promise.resolve():yy(Kr(ri,"users",n,"history",e))}const ZP=["en","zh_CN","zh_TW","ja","ko"],dd=[{key:"en",label:"EN"},{key:"zh_CN",label:"简"},{key:"zh_pinyin",label:"拼音"},{key:"zh_TW",label:"繁"},{key:"ja",label:"日"},{key:"ja_romaji",label:"ロマ"},{key:"ko",label:"한"},{key:"ko_romanization",label:"로마"}];function _m(){return{en:"",zh_CN:"",zh_TW:"",ja:"",ko:"",zh_pinyin:"",ja_romaji:"",ko_romanization:""}}function st(n){return String(n??"").replace(/<[^>]*>/g,"")}function Cc(){var n;return(n=globalThis.crypto)!=null&&n.randomUUID?crypto.randomUUID().replace(/-/g,"").slice(0,10):`b${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`}function ws(n,e=0){const t=Number(n==null?void 0:n.createdAt);return Number.isFinite(t)?t:e}function ek(n,e,t){var o,l,c,u,f,p,m,v,I;const i=st(n).trim(),r=co(i,(t==null?void 0:t.sourceLang)||e),s={en:r==="en"?i:((o=t==null?void 0:t.en)==null?void 0:o.text)||(t==null?void 0:t.gloss)||"",zh_CN:((l=t==null?void 0:t.zh)==null?void 0:l.simplified)||(r==="zh_CN"||r==="zh_TW"?i:""),zh_TW:((c=t==null?void 0:t.zh)==null?void 0:c.traditional)||(r==="zh_TW"?i:""),ja:r==="ja"?i:((u=t==null?void 0:t.ja)==null?void 0:u.text)||"",ko:r==="ko"?i:((f=t==null?void 0:t.ko)==null?void 0:f.text)||"",zh_pinyin:((p=t==null?void 0:t.zh)==null?void 0:p.pinyin)||"",ja_romaji:((m=t==null?void 0:t.ja)==null?void 0:m.romaji)||((v=t==null?void 0:t.ja)==null?void 0:v.kana)||"",ko_romanization:((I=t==null?void 0:t.ko)==null?void 0:I.romanization)||""};return s[r]=i,{fromLang:r,translations:s}}function kv(n){const e=bo();return!e||!n?null:_h(e,"users",n,"notes")}function ym(n){return n?typeof n.toMillis=="function"?n.toMillis():typeof n.toDate=="function"?n.toDate().getTime():n instanceof Date?n.getTime():typeof n=="number"&&Number.isFinite(n)?n:typeof n.seconds=="number"?n.seconds*1e3:0:0}function gu(n){let e=!1,t=0;for(const i of n||[])typeof(i==null?void 0:i.sortOrder)=="number"&&Number.isFinite(i.sortOrder)&&((!e||i.sortOrder<t)&&(t=i.sortOrder),e=!0);return e?t-1:0}function tk(n,e){const t=typeof(n==null?void 0:n.sortOrder)=="number"&&Number.isFinite(n.sortOrder),i=typeof(e==null?void 0:e.sortOrder)=="number"&&Number.isFinite(e.sortOrder);return t&&i&&n.sortOrder!==e.sortOrder?n.sortOrder-e.sortOrder:t&&!i?-1:!t&&i?1:ym((e==null?void 0:e.updatedAt)||(e==null?void 0:e.createdAt))-ym((n==null?void 0:n.updatedAt)||(n==null?void 0:n.createdAt))}async function Nv(n){const e=kv(n);return e?(await _y(e)).docs.map(i=>({id:i.id,...i.data()})).sort(tk):[]}async function nk(n,e){const t=bo();if(!t||!n||!Array.isArray(e)||!e.length)return;const i=e.map((s,o)=>({id:s,index:o})).filter(s=>s.id&&!String(s.id).startsWith("local-")),r=400;for(let s=0;s<i.length;s+=r){const o=CR(t);for(const l of i.slice(s,s+r))o.update(Kr(t,"users",n,"notes",l.id),{sortOrder:l.index});await o.commit()}}async function ik(n,e){const t=bo();if(!t||!n||!e)return null;const i=await TR(Kr(t,"users",n,"notes",e));return i.exists()?{id:i.id,...i.data()}:null}async function vm(n,e={}){const t=kv(n);if(!t)throw new Error("Sign in to save notes.");let i=e.sortOrder;return(typeof i!="number"||!Number.isFinite(i))&&(i=gu(await Nv(n))),(await vy(t,{title:st(e.title||""),sourceLang:e.sourceLang||"zh_CN",blocks:Array.isArray(e.blocks)?e.blocks:[],sortOrder:i,createdAt:Ua(),updatedAt:Ua()})).id}async function rk(n,e,t){const i=bo();!i||!n||!e||await wR(Kr(i,"users",n,"notes",e),{title:st(t.title||""),sourceLang:t.sourceLang||"zh_CN",blocks:Array.isArray(t.blocks)?t.blocks:[],updatedAt:Ua()})}async function Em(n,e){const t=bo();!t||!n||!e||await yy(Kr(t,"users",n,"notes",e))}function Tm(n){const e=st((n==null?void 0:n.title)||"").trim();if(e)return e;const t=((n==null?void 0:n.blocks)||[]).find(i=>st(i.source||"").trim());return st((t==null?void 0:t.source)||"").trim().slice(0,48)||"Untitled"}function sk(n){const e=(n==null?void 0:n.updatedAt)||(n==null?void 0:n.createdAt);if(!(e!=null&&e.toDate))return"";const t=e.toDate(),i=new Date;return t.toDateString()===i.toDateString()?t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):t.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}Object.fromEntries(dd.map(n=>[n.key,n.label]));dd.map(n=>n.key);const ok={en:"en-US",zh_CN:"zh-CN",zh_TW:"zh-TW",zh_pinyin:"zh-CN",ja:"ja-JP",ja_romaji:"ja-JP",ko:"ko-KR",ko_romanization:"ko-KR"},ak={zh_pinyin:{keys:["zh_CN","zh_TW"],ttsKey:"zh_CN"},ja_romaji:{keys:["ja"],ttsKey:"ja"},ko_romanization:{keys:["ko"],ttsKey:"ko"}};function wm(n,e){const t=String(n||"").trim();t&&uo(t,ok[e]||Bt(e).tts)}function lk(n){const e=String(n.source||"").trim();e&&uo(e,Bt(n.lang).tts)}function ck(n,e){var t;return n.lang===e&&n.source?n.source:((t=n.translations)==null?void 0:t[e])||""}function uk(n,e,t){const i=ak[e];if(i){const r=i.keys.map(s=>ck(n,s)).find(s=>String(s||"").trim());wm(r,i.ttsKey);return}wm(t,e)}function hk(n){return String(n??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}const Im=6;function Am(n,e){const t=document.createElement("button");t.type="button",t.className=`${n} note-grip`.trim(),t.setAttribute("aria-label",e),t.title="Drag to reorder",t.draggable=!1,t.textContent="";for(let i=0;i<6;i+=1)t.append(document.createElement("span"));return t.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation()}),t.addEventListener("contextmenu",i=>{i.preventDefault(),i.stopPropagation()}),t}function sa(n){return typeof n=="function"?n():n}function Cm(n,{item:e,container:t,itemSelector:i,onCommit:r,onDragEnd:s,onTap:o}){n.addEventListener("pointerdown",l=>{if(l.pointerType==="mouse"&&l.button!==0)return;l.preventDefault(),l.stopPropagation();const c=l.pointerId,u=l.clientX,f=l.clientY;let p=!0,m=!1,v=null,I=-1,k=0;const N=()=>{try{n.releasePointerCapture(c)}catch{}},x=()=>{e.classList.remove("is-dragging"),e.style.position="",e.style.left="",e.style.top="",e.style.width="",e.style.height="",e.style.zIndex="",e.style.pointerEvents="",e.style.margin="",e.style.transform=""},j=T=>{if(!p)return;p=!1,window.removeEventListener("pointermove",A),window.removeEventListener("pointerup",_),window.removeEventListener("pointercancel",E),document.body.classList.remove("is-reordering"),N();let w=I;const C=sa(t);v!=null&&v.parentElement&&C&&(w=[...C.children].filter(Y=>{var ke;return Y===v||((ke=Y.matches)==null?void 0:ke.call(Y,i))&&Y!==e}).indexOf(v),v.remove()),v=null,x(),m&&(s==null||s()),T&&m&&w>=0&&w!==I?r(I,w):T&&!m&&(o==null||o())},B=T=>{e.style.top=`${T-k}px`},te=T=>{if(!v)return;const w=sa(t);if(!w)return;const C=[...w.querySelectorAll(i)].filter(Y=>Y!==e);let y=null;for(const Y of C){const ke=Y.getBoundingClientRect();if(T<ke.top+ke.height/2){y=Y;break}}if(y)v.nextElementSibling!==y&&y.before(v);else if(C.length){const Y=C[C.length-1];Y.nextElementSibling!==v&&Y.after(v)}},q=T=>{var ke;const w=sa(t);if(!w)return;const C=((ke=w.closest)==null?void 0:ke.call(w,".note-editor, .notes-list"))||w;if(!C)return;const y=C.getBoundingClientRect(),Y=56;T<y.top+Y?C.scrollTop-=16:T>y.bottom-Y&&(C.scrollTop+=16)},ce=T=>{m=!0,document.body.classList.add("is-reordering");const w=e.getBoundingClientRect();k=f-w.top;const C=sa(t);if(!C)return;I=[...C.querySelectorAll(i)].indexOf(e),v=document.createElement("div"),v.className=e.classList.contains("note-card")?"note-reorder-placeholder note-card-placeholder":"note-reorder-placeholder notes-row-placeholder",v.style.height=`${w.height}px`,v.setAttribute("aria-hidden","true"),e.after(v),e.classList.add("is-dragging"),e.style.position="fixed",e.style.left=`${w.left}px`,e.style.top=`${w.top}px`,e.style.width=`${w.width}px`,e.style.height=`${w.height}px`,e.style.zIndex="40",e.style.pointerEvents="none",e.style.margin="0",B(T.clientY),te(T.clientY)},A=T=>{if(!(!p||T.pointerId!==c)){if(!m){if(Math.abs(T.clientX-u)<Im&&Math.abs(T.clientY-f)<Im)return;ce(T)}T.preventDefault(),B(T.clientY),te(T.clientY),q(T.clientY)}},_=T=>{T.pointerId===c&&j(!0)},E=T=>{T.pointerId===c&&j(!1)};window.addEventListener("pointermove",A,{passive:!1}),window.addEventListener("pointerup",_),window.addEventListener("pointercancel",E);try{n.setPointerCapture(c)}catch{}})}function dk(n,e){n&&(n.textContent="",e?n.dataset.display=e:delete n.dataset.display)}function fk({appEl:n,getUser:e,getLanguage:t,getPhrase:i,setPhrase:r,setStatus:s,hideKeyboard:o,onOpenChange:l,onHistory:c,getCardSort:u}){var tr,nr,$t,os,gi;const f=document.getElementById("notes-pane"),p=document.getElementById("notes-list-view"),m=document.getElementById("note-editor-view"),v=document.getElementById("notes-list"),I=document.getElementById("note-title"),k=document.getElementById("note-editor"),N=document.getElementById("note-view-langs");let x=null,j=[],B=[],te=0,q=null,ce=null,A=new Set(["all"]),_=new Set,E=0,T=0,w=0,C=0,y=!1,Y=null,ke={start:0,end:0},Hi={start:0,end:0},Nt="body";function rt(){var R;return((R=e())==null?void 0:R.uid)||null}function Ct(){return!!(x!=null&&x.id)}function Gi(){return y&&Ct()}function No(){n==null||n.classList.toggle("note-open",Ct()),l==null||l(Ct())}function gt(){return A.has("all")||A.size===0}function Me(R,D){return R===D?!1:gt()?!0:A.has(R)}function sn(){if(m&&(m.dataset.viewLangs=gt()?"all":[...A].join(" ")),!N)return;N.querySelectorAll("[data-view-lang]").forEach(D=>{const L=D.dataset.viewLang,F=gt()?L==="all":A.has(L);D.setAttribute("aria-pressed",String(F))}),k==null||k.querySelectorAll(".note-tr").forEach(D=>{var X;const L=D.closest(".note-card"),F=(X=j.find(oe=>oe.id===(L==null?void 0:L.dataset.id)))==null?void 0:X.lang;D.hidden=!Me(D.dataset.key,F)});const R=document.getElementById("note-card-tools");R&&(R.hidden=_.size===0)}function kn(){return(u==null?void 0:u())!=="oldest"}function ql(){j.forEach((R,D)=>{const L=Number(R.createdAt);(!Number.isFinite(L)||L<=0)&&(R.createdAt=D+1)})}function hi(){ql();const R=j.filter(L=>st(L.source||"").trim()),D=kn()?-1:1;return R.sort((L,F)=>{const X=ws(L,0)-ws(F,0);return X?D*X:D*String(L.id||"").localeCompare(String(F.id||""))})}function Wl(){return q?q.value:""}function Wt(){q&&(q.style.height="auto",q.style.height=`${Math.max(q.scrollHeight,40)}px`)}function Ki(R){var ln;const D=document.createElement("article");D.className="note-block note-card",D.dataset.id=R.id,D.tabIndex=0,D.setAttribute("aria-label","Translation card"),Y===R.id&&D.classList.add("is-editing"),_.has(R.id)&&D.classList.add("is-selected");const L=Am("note-card-select","Select or reorder this card");L.setAttribute("aria-pressed",String(_.has(R.id))),L.title="Tap to select, drag to reorder";const F=document.createElement("p");F.className="note-card-source",F.lang=Bt(R.lang).htmlLang,F.textContent=R.source||"",F.title="Tap to listen, hold to edit",F.setAttribute("role","button");let X=0;const oe=()=>{X&&window.clearTimeout(X),X=0};F.addEventListener("pointerdown",Be=>{Be.preventDefault(),Be.stopPropagation(),oe(),X=window.setTimeout(()=>{X=0,Yi(R.id)},480)}),F.addEventListener("pointerup",Be=>{Be.preventDefault(),Be.stopPropagation(),X&&(oe(),lk(R))}),F.addEventListener("pointercancel",oe);const le=document.createElement("div");le.className="note-xlate";for(const Be of dd){const cn=Be.key;if(!Me(cn,R.lang))continue;const ir=((ln=R.translations)==null?void 0:ln[cn])||"";if(!String(ir).trim()&&!gt())continue;const xt=document.createElement("p");xt.className="note-tr",xt.dataset.key=cn;const Nn=document.createElement("span");Nn.className="note-tr-label",Nn.textContent=Be.label;const St=document.createElement("span");St.className="note-tr-text",dk(St,ir),xt.title="Tap to listen",xt.setAttribute("role","button"),xt.append(Nn,St),xt.addEventListener("pointerdown",as=>{as.preventDefault(),as.stopPropagation(),uk(R,cn,ir)}),le.append(xt)}const Ne=document.createElement("button");Ne.type="button",Ne.className="note-card-edit";const Ce=Y===R.id;Ne.setAttribute("aria-label",Ce?"Done editing":"Edit this card"),Ne.textContent=Ce?"Done":"Edit",Ne.addEventListener("pointerdown",Be=>{Be.preventDefault(),Be.stopPropagation(),Yi(R.id)});const _e=document.createElement("button");return _e.type="button",_e.className="note-card-delete",_e.setAttribute("aria-label","Delete this card"),_e.textContent="✕",_e.addEventListener("pointerdown",Be=>{Be.preventDefault(),Be.stopPropagation(),ts(R.id)}),Cm(L,{item:D,container:()=>ce,itemSelector:".note-card",onCommit:$l,onTap:()=>Qi(R.id)}),D.append(L,Ne,_e,F,le),D}function Qi(R){_.has(R)?_.delete(R):_.add(R),_t(),sn()}function es(){if(!_.size)return;const R=_.size;window.confirm(`Delete ${R} card${R===1?"":"s"}?`)&&(j=j.filter(D=>!_.has(D.id)),Y&&_.has(Y)&&(Y=null,q&&(q.value=""),Wt(),on()),_.clear(),_t(),sn(),yt().catch(D=>{s(D.message||"Could not delete cards.")}))}function ts(R){const D=j.find(F=>F.id===R);if(!D)return;const L=st(D.source||"").trim().slice(0,40)||"this card";window.confirm(`Delete “${L}”?`)&&(j=j.filter(F=>F.id!==R),_.delete(R),Y===R&&(Y=null,q&&(q.value=""),Wt(),on(),s("")),_t(),yt().catch(F=>{s(F.message||"Could not delete card.")}))}function Yi(R){const D=j.find(L=>L.id===R);if(D){if(Y===R){Y=null,q&&(q.value=""),Wt(),_t(),on(),s("");return}if(Y=R,Nt="body",q){q.value=D.source||"",q.lang=Bt(D.lang||t()).htmlLang,Wt(),q.focus({preventScroll:!0});const L=q.value.length;ke={start:L,end:L},q.setSelectionRange(L,L)}_t(),on(),s("Editing this card. Tap Enter to update.")}}function on(){const R=document.getElementById("note-enter");!R||R.disabled||(R.textContent=Y?"Update":"Enter")}function _t(){if(ce){ce.replaceChildren();for(const R of hi())ce.append(Ki(R))}}function $l(R,D){const L=hi();if(R===D||R<0||D<0||R>=L.length||D>L.length)return;const F=L.slice(),[X]=F.splice(R,1);if(!X)return;F.splice(D,0,X);const oe=Date.now(),le=kn();F.forEach((Ce,_e)=>{Ce.createdAt=le?oe-_e:oe+_e});const Ne=j.filter(Ce=>!F.some(_e=>_e.id===Ce.id));j=F.concat(Ne),_t(),sn(),yt().catch(Ce=>{s(Ce.message||"Could not save card order.")})}function Hl(){_t(),sn()}async function yt(){if(!x||!Ct())return;const R=++w;x.title=(I==null?void 0:I.value)||"",x.sourceLang=t(),x.blocks=j.map(L=>({id:L.id||Cc(),type:"paragraph",source:st(L.source||""),lang:L.lang||t(),createdAt:ws(L,Date.now()),translations:{..._m(),...L.translations||{}}}));const D=rt();if(D&&R===w){if(x.local||String(x.id||"").startsWith("local-")){const L=x.id,F=typeof x.sortOrder=="number"&&Number.isFinite(x.sortOrder)?x.sortOrder:gu(B),X=await vm(D,{title:x.title,sourceLang:x.sourceLang,blocks:x.blocks,sortOrder:F});x.id=X,x.local=!1,x.sortOrder=F;const oe=B.findIndex(le=>le.id===L);oe>=0?B[oe]={...B[oe],id:X,local:!1,sortOrder:F}:B=[{...x},...B];return}await rk(D,x.id,{title:x.title,sourceLang:x.sourceLang,blocks:x.blocks})}}async function ns(){const R=st(Wl()).trim();if(!R){s("Nothing to translate.");return}const D=++C,L=co(R,t());s("Translating…");try{const F=await Um({text:R,language:L});if(D!==C)return;const X=ek(R,L,F);if(!ZP.some(Ce=>Ce!==X.fromLang&&String(X.translations[Ce]||"").trim()))throw new Error("Translation came back empty. Try Enter again.");const le=Y?j.findIndex(Ce=>Ce.id===Y):-1,Ne={id:Y||Cc(),type:"paragraph",source:R,lang:X.fromLang,createdAt:le>=0?ws(j[le],Date.now()):Date.now(),translations:X.translations};le>=0?j[le]=Ne:j.push(Ne),Y=null,q&&(q.value=""),Wt(),_t(),on(),c==null||c(R,F,X.fromLang),s(le>=0?"Updated.":""),await yt()}catch(F){if(D!==C)return;s(F.message||"Translation failed.")}}function Dt(){if(!q)return;Nt="body";const R=q.selectionStart,D=q.selectionEnd;typeof R=="number"&&(ke.start=R),typeof D=="number"&&(ke.end=D)}function an(){if(!I)return;Nt="title";const R=I.selectionStart,D=I.selectionEnd;typeof R=="number"&&(Hi.start=R),typeof D=="number"&&(Hi.end=D)}function Xi(R,D,L,F){const X=Math.min(D.start,R.value.length),oe=Math.min(Math.max(D.end,X),R.value.length),le=R.value.slice(0,X),Ne=R.value.slice(oe);let _e=`${le&&!/\s$/.test(le)&&!/^\s/.test(L)&&!/^[,.!?、。！？]/.test(L)&&/[A-Za-z]/.test(L)?" ":""}${L}`;if(F){const Be=Math.max(0,F-(le.length+Ne.length));_e=[..._e].slice(0,Be).join("")}if(!_e)return D;R.value=`${le}${_e}${Ne}`;const ln=le.length+_e.length;try{R.setSelectionRange(ln,ln)}catch{}return{start:ln,end:ln}}function di(R){const D=String(R??"");if(D){if(Nt==="title"&&I){Hi=Xi(I,Hi,D,80),x&&(x.title=I.value),window.clearTimeout(T),T=window.setTimeout(()=>yt().catch(()=>{}),400);return}q&&(Dt(),ke=Xi(q,ke,D),Wt())}}async function is(){const R=document.getElementById("note-enter");R&&(R.disabled=!0,R.textContent="Translating…"),o==null||o();try{await ns()}finally{R&&(R.disabled=!1,R.textContent=Y?"Update":"Enter")}}function Fe(){if(!Gi())return!1;const R=st(i());return R?(di(R),r(""),!0):!1}async function $e(){return Fe()}async function Ji(R){if(!Gi())return!1;const D=st(R||"");return D?(di(D),r(""),!0):!1}function Do(){if(!k)return;k.replaceChildren();const R=document.createElement("div");R.className="note-compose",q=document.createElement("textarea"),q.className="note-source",q.setAttribute("aria-label","Note"),q.placeholder="Write here, then tap Enter.",q.spellcheck=!1,q.lang=Bt(t()).htmlLang,q.value="",q.addEventListener("focus",Dt),q.addEventListener("input",()=>{Dt(),Wt()}),q.addEventListener("click",Dt),q.addEventListener("keyup",Dt),q.addEventListener("select",Dt),q.addEventListener("mouseup",Dt),q.addEventListener("touchend",Dt),q.addEventListener("keydown",L=>{L.key!=="Enter"||L.isComposing||(L.metaKey||L.ctrlKey)&&(L.preventDefault(),is())});const D=document.createElement("button");D.type="button",D.className="note-enter",D.id="note-enter",D.textContent="Enter",D.setAttribute("aria-label","Translate into a card"),D.addEventListener("pointerdown",L=>{L.preventDefault(),L.stopPropagation(),!D.disabled&&is()}),D.addEventListener("click",L=>{L.preventDefault(),L.stopPropagation()}),R.append(q,D),ce=document.createElement("div"),ce.className="note-cards",k.append(R,ce),_t(),Wt()}function Oo(){window.clearTimeout(E),q=null,ce=null,k&&k.replaceChildren()}function Zi(R){if(v){if(!R.length){v.innerHTML='<p class="empty-note">No notes yet. Tap New.</p>';return}v.replaceChildren();for(const D of R){const L=document.createElement("div");L.className="notes-row",L.dataset.id=D.id;const F=Am("notes-handle","Reorder this note");Cm(F,{item:L,container:v,itemSelector:".notes-row",onCommit:fi,onDragEnd:()=>{te=Date.now()+400}});const X=document.createElement("button");X.type="button",X.className="notes-item";const oe=document.createElement("div");oe.className="notes-title",oe.textContent=Tm(D);const le=document.createElement("div");le.className="notes-meta";const Ne=(D.blocks||[]).filter(_e=>st(_e.source||"").trim()).length;le.textContent=[sk(D),Ne?`${Ne} card${Ne===1?"":"s"}`:""].filter(Boolean).join("  ·  "),X.append(oe,le);const Ce=document.createElement("button");Ce.type="button",Ce.className="notes-delete",Ce.setAttribute("aria-label","Delete note"),Ce.textContent="✕",L.append(F,X,Ce),v.append(L)}}}function fi(R,D){if(R===D||R<0||D<0||R>=B.length||D>B.length)return;const L=B.slice(),[F]=L.splice(R,1);if(!F)return;L.splice(D,0,F),L.forEach((oe,le)=>{oe.sortOrder=le}),B=L,Zi(B);const X=rt();X&&nk(X,B.map(oe=>oe.id)).catch(oe=>{s(oe.message||"Could not save note order.")})}async function er(){if(!v)return;const R=rt();if(!Pv()){v.innerHTML='<p class="empty-note">Notes need Firebase to save.</p>';return}if(!R){const D=B.filter(L=>L.local||String(L.id||"").startsWith("local-"));if(D.length){B=D,Zi(B);return}v.innerHTML='<p class="empty-note">Sign in to write notes.</p>';return}v.innerHTML='<p class="empty-note">Loading…</p>';try{B=await Nv(R),Zi(B)}catch(D){v.innerHTML=`<p class="empty-note">${hk(D.message||"Could not load notes.")}</p>`}}function Ot(){x=null,j=[],Y=null,_.clear(),p&&(p.hidden=!1),m&&(m.hidden=!0),No(),Oo(),y&&er()}async function pi(R){x=R,j=(R.blocks||[]).filter(D=>st(D.source||"").trim()).map((D,L)=>({id:D.id||Cc(),type:"paragraph",source:st(D.source||""),lang:D.lang||t(),createdAt:ws(D,L+1),translations:{..._m(),...D.translations||{}}})),I&&(I.value=R.title||""),p&&(p.hidden=!0),m&&(m.hidden=!1),No(),sn(),Nt="body",Do()}async function rs(R){if(String(R||"").startsWith("local-")){const F=B.find(X=>X.id===R)||x;if(!F){s("Note not found."),Ot();return}await pi(F);return}const D=rt();if(!D){s("Sign in with G to save notes to Firestore.");return}const L=await ik(D,R);if(!L){s("Note not found."),Ot();return}await pi(L)}async function Gl(){const R=rt(),D=gu(B);if(R){s("Creating…");try{const F=await vm(R,{title:"",sourceLang:t(),blocks:[],sortOrder:D});B=[{id:F,title:"",sourceLang:t(),blocks:[],sortOrder:D},...B.filter(X=>X.id!==F)],s(""),await rs(F);return}catch(F){s(F.message||"Could not save to Firestore. Working locally.")}}else s("Working locally. Sign in with G to save.");const L={id:`local-${Date.now().toString(36)}`,title:"",sourceLang:t(),blocks:[],local:!0,sortOrder:D};B=[L,...B.filter(F=>F.id!==L.id)],await pi(L)}async function ss(){if(!(x!=null&&x.id))return;const R=rt(),D=Tm(x);if(!window.confirm(`Delete “${D}”?`))return;const L=x.id;R&&!x.local&&!String(L).startsWith("local-")&&await Em(R,L),B=B.filter(F=>F.id!==L),Ot()}async function xo(){y=!0,f&&(f.hidden=!1),Ct()?p&&(p.hidden=!0):Ot()}async function Lo(){if(y=!1,x!=null&&x.id)try{await yt()}catch{}f&&(f.hidden=!0)}function mi(){if(y){if(!rt()){Ot();return}Ct()&&!String(x.id).startsWith("local-")?rs(x.id):er()}}return(tr=document.getElementById("note-new"))==null||tr.addEventListener("click",()=>{Gl()}),(nr=document.getElementById("note-save"))==null||nr.addEventListener("click",async()=>{if(Ct()){s("Saving…");try{await yt(),s(rt()?"Saved.":"Saved locally. Sign in with G to keep it.")}catch(R){s(R.message||"Could not save note.")}}}),($t=document.getElementById("note-back"))==null||$t.addEventListener("click",async()=>{try{await yt()}catch{}Ot()}),(os=document.getElementById("note-delete"))==null||os.addEventListener("click",()=>{ss()}),I==null||I.addEventListener("focus",an),I==null||I.addEventListener("click",an),I==null||I.addEventListener("keyup",an),I==null||I.addEventListener("select",an),I==null||I.addEventListener("mouseup",an),I==null||I.addEventListener("touchend",an),I==null||I.addEventListener("input",()=>{an(),x&&(x.title=I.value),window.clearTimeout(T),T=window.setTimeout(()=>yt().catch(()=>{}),400)}),I==null||I.addEventListener("keydown",R=>{R.key==="Enter"&&(R.preventDefault(),I.blur())}),N==null||N.addEventListener("click",R=>{const D=R.target.closest("[data-view-lang]");if(!D)return;const L=D.dataset.viewLang||"all";L==="all"?A=new Set(["all"]):(A.delete("all"),A.has(L)?A.delete(L):A.add(L),A.size||A.add("all")),sn(),_t()}),(gi=document.getElementById("note-delete-selected"))==null||gi.addEventListener("click",()=>{es()}),v==null||v.addEventListener("click",async R=>{var L;if(Date.now()<te){R.preventDefault(),R.stopPropagation();return}const D=R.target.closest(".notes-row");if(D&&!R.target.closest(".notes-handle")){if(R.target.closest(".notes-delete")){const F=D.dataset.id,X=((L=D.querySelector(".notes-title"))==null?void 0:L.textContent)||"this note";if(!window.confirm(`Delete “${X}”?`))return;const oe=rt();oe&&F&&!String(F).startsWith("local-")&&await Em(oe,F),B=B.filter(le=>le.id!==F),(x==null?void 0:x.id)===F?Ot():Zi(B);return}rs(D.dataset.id)}}),sn(),{enter:xo,leave:Lo,isEditing:Gi,hasOpenNote:Ct,hasFocusedBlock:()=>document.activeElement===q,onAuth:mi,commitFromComposer:$e,insertAtCaret:di,insertFromComposer:Fe,onCandidatePicked:Ji,persistNote:yt,showList:Ot,renderList:er,refreshCardOrder:Hl}}const si=document.getElementById("app"),at=new mE(document.getElementById("ink")),de=document.getElementById("phrase"),Dv=document.getElementById("hint"),Sm=document.getElementById("status"),Ov=document.getElementById("candidates"),kt=document.getElementById("results"),fr=document.getElementById("account"),Is=document.getElementById("account-photo"),As=document.getElementById("account-label"),Fl=document.getElementById("sheet-backdrop"),fd=document.getElementById("menu-sheet"),xv=document.getElementById("history-sheet"),Lv=document.getElementById("settings-sheet"),Vv=document.getElementById("card-sheet"),pk=document.getElementById("card-sheet-title"),ot=document.getElementById("card-sheet-body"),Rm=document.getElementById("card-sheet-text"),bm=document.getElementById("card-sheet-reading"),mt=document.getElementById("history-list"),Pm=document.getElementById("history-tools"),el=document.getElementById("history-search"),km=document.getElementById("history-lang"),Nm=document.getElementById("history-sort"),_u=document.getElementById("setting-layout"),yu=document.getElementById("setting-history"),vu=document.getElementById("setting-speak"),pr=document.getElementById("setting-card-sort");let Ae=localStorage.getItem("sanpitsu-lang")||"zh_CN";(!Bt(Ae).id||Ae!==Bt(Ae).id)&&(Ae="zh_CN");let Tn=localStorage.getItem("sanpitsu-layout")==="stack"?"stack":"grid",Ut=[],Dm=0,Sc=0,Rc=0,Ar="",Ie=null,Eu=!1,Om="",It=[],Tu=null,Tt=!1,_a=!1,Mv="",wu="",Fv="newest",xm=0;const Mr=20;let Li=localStorage.getItem("sanpitsu-save-history")!=="0",Vi=localStorage.getItem("sanpitsu-speak")==="1",Mi=localStorage.getItem("sanpitsu-card-sort")==="oldest"?"oldest":"newest",Pt=localStorage.getItem("sanpitsu-mode")==="notes"?"notes":"dictionary",K=null;function mk(){return Bt(Ae)}function lt(n){Sm.hidden=!n,Sm.textContent=n||""}function oo(){const n=mk();de.lang=n.htmlLang,de.placeholder=n.placeholder,Dv.textContent=n.hint;const e=document.getElementById("lang-select");e&&e.value!==Ae&&(e.value=Ae),localStorage.setItem("sanpitsu-lang",Ae),Jr()}function Jr(){Ie&&!Eu&&QP(Ie.uid,{language:Ae,layout:Tn,saveHistory:Li,speakAfterTranslate:Vi,cardSort:Mi}).catch(()=>{})}function tl(){si.classList.toggle("layout-stack",Tn==="stack"),document.querySelectorAll(".layouts button").forEach(n=>{n.setAttribute("aria-selected",String(n.dataset.layout===Tn))}),localStorage.setItem("sanpitsu-layout",Tn),Jr()}function Lm(){const n=window.innerWidth;si.classList.toggle("layout-tablet",n>=720&&n<1024),si.classList.toggle("layout-split",n>=1024)}function Po(){Dv.classList.toggle("hidden",at.hasInk())}function Ul(){Ov.innerHTML=Ut.map((n,e)=>`<button type="button" class="candidate${e===0?" top":""}" data-index="${e}">${Un(n)}</button>`).join("")}function Un(n){return String(n??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function Uv(n){de.value=`${de.value}${n}`,at.clear(),Ut=[],Ul(),Po()}async function Iu(){if(!at.hasInk())return;const n=++Sc;lt("Recognizing…");try{const{width:e,height:t}=at.cssSize(),i=await AE({ink:at.toInk(),width:e,height:t,language:Ae,preContext:de.value});if(n!==Sc)return;Ut=i.candidates||[],Ul(),lt(Ut.length?"":"No match. Try again.")}catch(e){if(n!==Sc)return;lt(e.message||"Recognition failed.")}}function pd(){clearTimeout(Dm),Dm=window.setTimeout(Iu,380)}function Bv(n,e){return co(n,e||Ae)}function jv(){const n=de.value.trim();if(!n)return;const e=co(n,Ae);e!==Ae&&(Ae=e,oo())}function Bs(n,e){n&&(n.textContent="",e?n.dataset.display=e:delete n.dataset.display)}function Ht(n,{text:e,reading:t,explain:i,speakLang:r,isSource:s}){const o=kt.querySelector(`[data-key="${n}"]`);if(!o)return;o.classList.toggle("source",!!(s&&e)),o.dataset.text=e,o.dataset.lang=r,o.lang=r,o.setAttribute("aria-label",e||Bt(n).name),Bs(o.querySelector(".text"),e);const l=o.querySelector(".reading");Bs(l,t),l.hidden=!t;const c=o.querySelector(".explain");c&&(Bs(c,i||""),c.hidden=!i);const u=o.querySelector(".card-expand");u&&(u.hidden=!e)}function Fr(n){var c,u,f,p,m,v,I,k,N,x,j;const e=de.value.trim();if(!n||!e){Ht("en",{text:"",reading:"",explain:"",speakLang:"en-US",isSource:!1}),Ht("zh_CN",{text:"",reading:"",explain:"",speakLang:"zh-CN",isSource:!1}),Ht("zh_TW",{text:"",reading:"",explain:"",speakLang:"zh-TW",isSource:!1}),Ht("ko",{text:"",reading:"",explain:"",speakLang:"ko-KR",isSource:!1}),Ht("ja",{text:"",reading:"",explain:"",speakLang:"ja-JP",isSource:!1});return}const t=Bv(e,n.sourceLang),i=((c=n.zh)==null?void 0:c.simplified)||(t==="zh_CN"||t==="zh_TW"?e:""),r=((u=n.zh)==null?void 0:u.traditional)||(t==="zh_TW"?e:""),s=t==="ja"?e:((f=n.ja)==null?void 0:f.text)||"",o=t==="ko"?e:((p=n.ko)==null?void 0:p.text)||"",l=t==="en"?e:((m=n.en)==null?void 0:m.text)||n.gloss||"";Ht("en",{text:l,reading:t==="en"?"":n.gloss&&n.gloss!==l?n.gloss:"",speakLang:"en-US",isSource:t==="en"}),Ht("zh_CN",{text:i,reading:((v=n.zh)==null?void 0:v.pinyin)||"",speakLang:"zh-CN",isSource:t==="zh_CN"}),Ht("zh_TW",{text:r,reading:((I=n.zh)==null?void 0:I.pinyin)||"",speakLang:"zh-TW",isSource:t==="zh_TW"}),Ht("ko",{text:o,reading:[(k=n.ko)==null?void 0:k.romanization,((N=n.ko)==null?void 0:N.hanja)||""].filter(Boolean).join("  "),speakLang:"ko-KR",isSource:t==="ko"}),Ht("ja",{text:s,reading:[(x=n.ja)==null?void 0:x.kana,(j=n.ja)==null?void 0:j.romaji].filter(Boolean).join("  "),speakLang:"ja-JP",isSource:t==="ja"})}async function zv(){const n=de.value.trim();if(!n){Ar="",Fr(null);return}const e=`${Ae}:${n}`;if(e===Ar)return;const t=++Rc;lt("Translating…");try{const i=await Um({text:n,language:Ae});if(t!==Rc)return;if(Ar=e,Fr(i),lt(""),Hv(n,i),Vi){const r=Bv(n,i.sourceLang);uo(n,r==="en"?"en-US":r==="ko"?"ko-KR":r==="ja"?"ja-JP":r==="zh_TW"?"zh-TW":"zh-CN")}}catch(i){if(t!==Rc)return;lt(i.message||"Translation failed.")}}document.querySelector(".layouts").addEventListener("click",n=>{const e=n.target.closest("button[data-layout]");!e||e.dataset.layout===Tn||(Tn=e.dataset.layout==="stack"?"stack":"grid",tl())});document.getElementById("lang-select").addEventListener("change",n=>{Ae=n.target.value,oo(),at.hasInk()&&pd()});Ov.addEventListener("click",n=>{const e=n.target.closest(".candidate");if(!e)return;const t=Ut[Number(e.dataset.index)];if(Pt==="notes"&&(K!=null&&K.isEditing())){K.insertAtCaret(t);return}Uv(t)});let Fi=0,Au=!1,Cu={x:0,y:0};function qv(n){return Math.hypot(n.clientX-Cu.x,n.clientY-Cu.y)>10}function Bl(n){var e,t;n.preventDefault(),n.stopPropagation(),(t=(e=window.getSelection)==null?void 0:e.call(window))==null||t.removeAllRanges()}kt.addEventListener("touchstart",n=>{var e;n.target.closest(".card-expand")||(e=n.target.closest(".card"))!=null&&e.dataset.text&&Bl(n)},{passive:!1});kt.addEventListener("selectstart",n=>{n.target.closest(".card")&&n.preventDefault()});kt.addEventListener("dragstart",n=>{n.target.closest(".card")&&n.preventDefault()});kt.addEventListener("pointerdown",n=>{if(n.target.closest(".card-expand"))return;const e=n.target.closest(".card");e!=null&&e.dataset.text&&(Bl(n),Au=!1,Cu={x:n.clientX,y:n.clientY},clearTimeout(Fi),Fi=window.setTimeout(async()=>{Au=!0,await Bm(e.dataset.text),lt("Copied"),setTimeout(()=>lt(""),800)},480))},{passive:!1});kt.addEventListener("pointermove",n=>{Fi&&qv(n)&&clearTimeout(Fi)});kt.addEventListener("pointerup",n=>{var t,i;if(clearTimeout(Fi),n.target.closest(".card-expand"))return;const e=n.target.closest(".card");!(e!=null&&e.dataset.text)||Au||n.pointerType==="mouse"&&n.button!==0||qv(n)||((i=(t=window.getSelection)==null?void 0:t.call(window))==null||i.removeAllRanges(),uo(e.dataset.text,e.dataset.lang))});kt.addEventListener("pointercancel",()=>{clearTimeout(Fi)});kt.addEventListener("pointerleave",n=>{n.target===kt&&clearTimeout(Fi)});kt.addEventListener("click",n=>{const e=n.target.closest(".card-expand");if(e){n.preventDefault(),n.stopPropagation(),gk(e.closest(".card"));return}n.target.closest(".card")&&n.preventDefault()});let Ur=0,Su=!1,ao={x:0,y:0};ot.addEventListener("touchstart",n=>{ot.dataset.text&&Bl(n)},{passive:!1});ot.addEventListener("selectstart",n=>n.preventDefault());ot.addEventListener("pointerdown",n=>{ot.dataset.text&&(Bl(n),Su=!1,ao={x:n.clientX,y:n.clientY},clearTimeout(Ur),Ur=window.setTimeout(async()=>{Su=!0,await Bm(ot.dataset.text),lt("Copied"),setTimeout(()=>lt(""),800)},480))},{passive:!1});ot.addEventListener("pointermove",n=>{Ur&&Math.hypot(n.clientX-ao.x,n.clientY-ao.y)>10&&clearTimeout(Ur)});ot.addEventListener("pointerup",n=>{clearTimeout(Ur),!(!ot.dataset.text||Su)&&(Math.hypot(n.clientX-ao.x,n.clientY-ao.y)>10||uo(ot.dataset.text,ot.dataset.lang))});ot.addEventListener("pointercancel",()=>clearTimeout(Ur));ot.addEventListener("contextmenu",n=>n.preventDefault());document.addEventListener("keydown",n=>{n.key==="Escape"&&!Fl.hidden&&ui()});kt.addEventListener("contextmenu",n=>{n.target.closest(".card")&&n.preventDefault()});document.getElementById("undo").addEventListener("click",()=>{at.undo(),Po(),at.hasInk()?pd():(Ut=[],Ul(),lt(""))});document.getElementById("clear").addEventListener("click",()=>{at.clear(),Ut=[],Ul(),Po(),lt("")});document.getElementById("accept").addEventListener("click",()=>{if(Pt==="notes"&&(K!=null&&K.isEditing())){Ut[0]?K.insertAtCaret(Ut[0]):de.value.trim()?K.insertFromComposer():at.hasInk()&&Iu();return}if(Ut[0])Uv(Ut[0]);else if(at.hasInk()){Iu();return}de.value.trim()&&zv()});document.getElementById("backspace").addEventListener("click",()=>{de.value=[...de.value].slice(0,-1).join(""),de.value.trim()||(Ar="",Fr(null))});document.getElementById("clear-text").addEventListener("click",()=>{de.value="",Ar="",Fr(null),lt("")});const bc=document.getElementById("keyboard-trap");function ko(){de.readOnly=!0,de.setAttribute("inputmode","none"),de.blur(),bc&&(bc.focus({preventScroll:!0}),bc.blur()),document.activeElement&&document.activeElement!==document.body&&document.activeElement.blur(),window.scrollTo(0,0),window.setTimeout(()=>{de.readOnly=!1,de.setAttribute("inputmode","search")},120)}function md(n){if(n==null||n.preventDefault(),ko(),Pt==="notes"){K==null||K.insertFromComposer();return}zv()}function Wv(n){return n.key==="Enter"||n.key==="Go"||n.key==="Done"||n.key==="Search"}de.addEventListener("input",n=>{n.isComposing||jv()});de.addEventListener("compositionend",()=>{jv()});de.addEventListener("keydown",n=>{Wv(n)&&(n.isComposing||md(n))});de.addEventListener("keyup",n=>{!Wv(n)||n.isComposing||ko()});de.addEventListener("search",md);document.getElementById("phrase-form").addEventListener("submit",md);let $v=!1;si.addEventListener("pointerdown",n=>{$v=!!n.target.closest("#phrase-form, .workspace, .mode-switch, .note-editor-head, .note-view-langs"),document.activeElement===de&&(n.target.closest("#phrase-form")||ko())},!0);de.addEventListener("blur",()=>{Pt!=="notes"||!(K!=null&&K.isEditing())||window.setTimeout(()=>{$v||document.activeElement!==de&&(K==null||K.insertFromComposer())},80)});at.on("change",Po);at.on("strokeEnd",pd);function jl(){const n=Pt==="notes";si.classList.toggle("mode-notes",n),si.classList.toggle("mode-dictionary",!n);const e=document.getElementById("notes-pane");e&&(e.hidden=!n),document.querySelectorAll(".mode-switch [data-mode]").forEach(t=>{t.setAttribute("aria-selected",String(t.dataset.mode===Pt))}),localStorage.setItem("sanpitsu-mode",Pt),n?K==null||K.enter():K==null||K.leave(),window.setTimeout(()=>at.resize(),40)}K=fk({appEl:si,getUser:()=>Ie,getLanguage:()=>Ae,getPhrase:()=>de.value,setPhrase:n=>{de.value=n},setStatus:lt,hideKeyboard:ko,onOpenChange(){si.classList.toggle("note-open",!!(K!=null&&K.hasOpenNote())),window.setTimeout(()=>at.resize(),40)},onHistory:Hv,getCardSort:()=>Mi});var Vm;(Vm=document.querySelector(".mode-switch"))==null||Vm.addEventListener("click",n=>{const e=n.target.closest("[data-mode]");!e||e.dataset.mode===Pt||(Pt=e.dataset.mode==="notes"?"notes":"dictionary",jl())});function Hv(n,e,t){if(!Ie||!Li||!n||!e)return;const i=t||Ae,r=`${i}:${n}`;r!==Om&&(Om=r,YP(Ie.uid,{source:n,language:i,zh:e.zh||null,ja:e.ja||null,ko:e.ko||null,en:e.en||null,gloss:e.gloss||""}).catch(()=>{}))}function ui(){Fl.hidden=!0,fd.hidden=!0,xv.hidden=!0,Lv.hidden=!0,Vv.hidden=!0}function gk(n){var r;const e=n==null?void 0:n.dataset.text;if(!e)return;ko();const t=Bt(n.dataset.key);pk.textContent=t.name,Bs(Rm,e),Rm.lang=n.dataset.lang||t.htmlLang;const i=((r=n.querySelector(".reading"))==null?void 0:r.dataset.display)||"";Bs(bm,i),bm.hidden=!i,ot.dataset.text=e,ot.dataset.lang=n.dataset.lang||t.tts,nl(Vv)}function nl(n){ui(),Fl.hidden=!1,n.hidden=!1}function Gv(){_u.value=Tn,yu.checked=Li,vu.checked=Vi,pr&&(pr.value=Mi)}function _k(n){var e,t,i,r;return[(e=n.en)==null?void 0:e.text,(t=n.zh)==null?void 0:t.simplified,(i=n.ja)==null?void 0:i.text,(r=n.ko)==null?void 0:r.text,n.gloss].filter(Boolean).slice(0,3).join("  ")}function yk(n){var r;if(!((r=n.createdAt)!=null&&r.toDate))return"";const e=n.createdAt.toDate(),t=new Date;return e.toDateString()===t.toDateString()?e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}):e.toLocaleString([],{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}function Cs(n,e,t){if(!e)return"";const i=t?`<span class="history-reading">${Un(t)}</span>`:"";return`<p class="history-line"><span class="history-lang">${n}</span><span class="history-block"><span class="history-main">${Un(e)}</span>${i}</span></p>`}function vk(n){var p,m,v,I,k,N,x,j,B,te;const e=yk(n),t=((p=n.zh)==null?void 0:p.simplified)||"",i=((m=n.zh)==null?void 0:m.traditional)||"",r=((v=n.zh)==null?void 0:v.pinyin)||"",s=((I=n.ko)==null?void 0:I.text)||"",o=[(k=n.ko)==null?void 0:k.romanization,(N=n.ko)==null?void 0:N.hanja].filter(Boolean).join("  "),l=((x=n.ja)==null?void 0:x.text)||"",c=[(j=n.ja)==null?void 0:j.kana,(B=n.ja)==null?void 0:B.romaji].filter(Boolean).join("  "),u=((te=n.en)==null?void 0:te.text)||n.gloss||"",f=n.gloss&&n.gloss!==u?n.gloss:"";return`<div class="history-row" data-id="${Un(n.id)}">
    <div class="history-item" role="button" tabindex="0">
      <div class="history-top">
        <div class="history-source">${Un(n.source||"")}</div>
        <div class="history-time">${Un(e)}</div>
      </div>
      <div class="history-meta">${Un(_k(n))}</div>
      <div class="history-detail">
        ${Cs("EN",u,f)}
        ${Cs("简",t,r)}
        ${Cs("繁",i,r)}
        ${Cs("한",s,o)}
        ${Cs("日",l,c)}
        <button type="button" class="history-load">Load</button>
      </div>
    </div>
    <button type="button" class="history-delete" aria-label="Delete">✕</button>
  </div>`}function zl(){return mt.querySelector(".history-sentinel")}function Ek(n){var i,r,s,o,l,c,u,f,p,m;if(wu&&n.language!==wu)return!1;const e=Mv.trim().toLowerCase();return e?[n.source,(i=n.en)==null?void 0:i.text,(r=n.zh)==null?void 0:r.simplified,(s=n.zh)==null?void 0:s.traditional,(o=n.zh)==null?void 0:o.pinyin,(l=n.ja)==null?void 0:l.text,(c=n.ja)==null?void 0:c.kana,(u=n.ja)==null?void 0:u.romaji,(f=n.ko)==null?void 0:f.text,(p=n.ko)==null?void 0:p.romanization,(m=n.ko)==null?void 0:m.hanja,n.gloss].filter(Boolean).join(`
`).toLowerCase().includes(e):!0}function _n(){return It.filter(Ek)}function Tk(){mt.querySelectorAll(".empty-note:not(.history-sentinel)").forEach(n=>n.remove()),!zl()&&mt.insertAdjacentHTML("beforeend",'<p class="history-sentinel empty-note" hidden>Loading more…</p>')}function wk(n){const e=zl();if(!e)return;const t=!n&&_n().length<Mr;e.hidden=n&&_n().length>0,e.textContent=n?_n().length?"":"No matches.":"Loading more…",n&&_n().length&&(e.hidden=!0),t&&(e.hidden=!1)}function lo(){const n=new Set([...mt.querySelectorAll(".history-row.expanded")].map(i=>i.dataset.id));Tk();const e=zl();mt.querySelectorAll(".history-row").forEach(i=>i.remove());const t=_n();if(!t.length&&Tt){e&&(e.hidden=!1,e.textContent=It.length?"No matches.":"No saved translations yet.");return}e.insertAdjacentHTML("beforebegin",t.map(vk).join("")),mt.querySelectorAll(".history-row").forEach(i=>{n.has(i.dataset.id)&&i.classList.add("expanded")}),wk(Tt)}const Ru=new IntersectionObserver(n=>{n.some(e=>e.isIntersecting)&&Zr()},{root:mt,rootMargin:"120px"});async function Zr(){if(!Ie||_a||Tt)return;_a=!0;const n=It.length===0;try{const e=await XP(Ie.uid,{pageSize:Mr,cursor:Tu,sort:Fv}),t=new Set(It.map(s=>s.id)),i=e.items.filter(s=>!t.has(s.id));if(n&&!i.length){Tt=!0,mt.innerHTML='<p class="empty-note">No saved translations yet.</p>';return}n&&(mt.innerHTML=""),It=It.concat(i),Tu=e.cursor,Tt=e.done||!e.items.length,lo(),Ru.disconnect();const r=zl();r&&!Tt&&Ru.observe(r)}catch(e){Tt=!0,It.length?lo():mt.innerHTML=`<p class="empty-note">${Un(e.message||"Could not load history.")}</p>`}finally{_a=!1}!Tt&&_n().length<Mr&&window.setTimeout(()=>Zr(),0)}async function Kv(){if(Ru.disconnect(),It=[],Tu=null,Tt=!1,_a=!1,Pm&&(Pm.hidden=!Ie),!Ie){mt.innerHTML='<p class="empty-note">Sign in to keep translations.</p>';return}mt.innerHTML='<p class="empty-note">Loading…</p>',await Zr()}function Ik(){if(!Ie){fr.classList.remove("signed-in"),Is.hidden=!0,Is.removeAttribute("src"),As.hidden=!1,As.textContent="G",fr.setAttribute("aria-label","Sign in with Google");return}if(fr.classList.add("signed-in"),fr.setAttribute("aria-label","Account menu"),Ie.photoURL){Is.src=Ie.photoURL,Is.hidden=!1,As.hidden=!0;return}Is.hidden=!0,As.hidden=!1,As.textContent=(Ie.displayName||"U").slice(0,1).toUpperCase()}fr.hidden=!Pv();fr.addEventListener("click",async()=>{try{if(!Ie){await GP();return}document.getElementById("menu-name").textContent=Ie.displayName||"Signed in",document.getElementById("menu-email").textContent=Ie.email||"";const n=document.getElementById("menu-photo");Ie.photoURL?(n.src=Ie.photoURL,n.hidden=!1):(n.removeAttribute("src"),n.hidden=!0),nl(fd)}catch(n){lt(n.message||"Sign-in failed.")}});Fl.addEventListener("click",ui);document.querySelectorAll(".sheet-close").forEach(n=>{n.addEventListener("click",ui)});fd.addEventListener("click",async n=>{const e=n.target.closest("[data-open]");if((e==null?void 0:e.dataset.open)==="history"){nl(xv),await Kv();return}if((e==null?void 0:e.dataset.open)==="notes"){ui(),Pt="notes",jl(),K==null||K.showList(),K==null||K.renderList();return}(e==null?void 0:e.dataset.open)==="settings"&&(Gv(),nl(Lv))});document.getElementById("sign-out").addEventListener("click",async()=>{ui(),await KP()});function Ak(n){n!=null&&n.source&&(Pt==="notes"&&(Pt="dictionary",jl()),de.value=n.source,n.language&&Bt(n.language).id===n.language&&(Ae=n.language,oo()),Ar=`${Ae}:${n.source.trim()}`,Fr(n),ui())}el.addEventListener("input",()=>{window.clearTimeout(xm),xm=window.setTimeout(()=>{Mv=el.value,lo(),!Tt&&_n().length<Mr&&Zr()},200)});el.addEventListener("keydown",n=>{n.key==="Enter"&&(n.preventDefault(),el.blur())});km.addEventListener("change",()=>{wu=km.value,lo(),!Tt&&_n().length<Mr&&Zr()});Nm.addEventListener("change",()=>{Fv=Nm.value,Kv()});mt.addEventListener("click",async n=>{const e=n.target.closest(".history-row");if(!e||!Ie)return;if(n.target.closest(".history-delete")){const i=It.find(s=>s.id===e.dataset.id),r=i!=null&&i.source?`“${i.source}”`:"this translation";if(!window.confirm(`Delete ${r} from history?`))return;await JP(Ie.uid,e.dataset.id),It=It.filter(s=>s.id!==e.dataset.id),!It.length&&Tt?mt.innerHTML='<p class="empty-note">No saved translations yet.</p>':(lo(),!Tt&&_n().length<Mr&&await Zr());return}const t=It.find(i=>i.id===e.dataset.id);if(n.target.closest(".history-load")){Ak(t);return}n.target.closest(".history-item")&&e.classList.toggle("expanded")});_u.addEventListener("change",()=>{Tn=_u.value==="stack"?"stack":"grid",tl()});yu.addEventListener("change",()=>{Li=yu.checked,localStorage.setItem("sanpitsu-save-history",Li?"1":"0"),Jr()});vu.addEventListener("change",()=>{Vi=vu.checked,localStorage.setItem("sanpitsu-speak",Vi?"1":"0"),Jr()});pr==null||pr.addEventListener("change",()=>{var n;Mi=pr.value==="oldest"?"oldest":"newest",localStorage.setItem("sanpitsu-card-sort",Mi),Jr(),(n=K==null?void 0:K.refreshCardOrder)==null||n.call(K)});async function Ck(){var n;await $P(),HP(e=>{if(Ie=e,Ik(),K==null||K.onAuth(e),!Ie){gm(null),ui();return}gm(Ie.uid,t=>{var i;Eu=!0,t.language&&t.language!==Ae&&(Ae=t.language,oo()),(t.layout==="stack"||t.layout==="grid")&&(Tn=t.layout,tl()),typeof t.saveHistory=="boolean"&&(Li=t.saveHistory,localStorage.setItem("sanpitsu-save-history",Li?"1":"0")),typeof t.speakAfterTranslate=="boolean"&&(Vi=t.speakAfterTranslate,localStorage.setItem("sanpitsu-speak",Vi?"1":"0")),(t.cardSort==="oldest"||t.cardSort==="newest")&&(Mi=t.cardSort,localStorage.setItem("sanpitsu-card-sort",Mi),(i=K==null?void 0:K.refreshCardOrder)==null||i.call(K)),Eu=!1,Gv()}),Jr()}),oo(),tl(),Lm(),jl(),window.addEventListener("resize",Lm),Po(),Fr(null),"serviceWorker"in navigator&&navigator.serviceWorker.getRegistrations().then(e=>{e.forEach(t=>t.unregister())}),(n=window.speechSynthesis)==null||n.getVoices()}Ck();
