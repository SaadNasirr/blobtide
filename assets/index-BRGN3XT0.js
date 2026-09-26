(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Jc="modulepreload",Kc=function(i,t){return new URL(i,t).href},To={},Zc=function(t,e,n){let s=Promise.resolve();if(e&&e.length>0){let a=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};const o=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),c=l?.nonce||l?.getAttribute("nonce");s=a(e.map(u=>{if(u=Kc(u,n),u in To)return;To[u]=!0;const h=u.endsWith(".css"),d=h?'[rel="stylesheet"]':"";if(!!n)for(let _=o.length-1;_>=0;_--){const f=o[_];if(f.href===u&&(!h||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${d}`))return;const g=document.createElement("link");if(g.rel=h?"stylesheet":Jc,h||(g.as="script"),g.crossOrigin="",g.href=u,c&&g.setAttribute("nonce",c),document.head.appendChild(g),h)return new Promise((_,f)=>{g.addEventListener("load",_),g.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return t().catch(r)})},Ye={appName:"Blobtide",packageId:"com.blobtide.game",liveUrl:"https://saadnasirr.github.io/blobtide/",privacyUrl:"https://saadnasirr.github.io/blobtide/privacy-policy.html",supportEmail:"saad.nasirr.23@gmail.com",saveVersion:1,maxCoins:5e5,ads:{interstitialEveryWins:3,minLevelForInterstitial:3,minMsBetweenInterstitials:9e4,rewardedTimeoutMs:3e4,testUnits:{androidRewarded:"ca-app-pub-3940256099942544/5224354917",androidInterstitial:"ca-app-pub-3940256099942544/1033173712",iosRewarded:"ca-app-pub-3940256099942544/1712485313",iosInterstitial:"ca-app-pub-3940256099942544/4411468910"}},iap:{removeAds:"remove_ads",coins200:"coins_200",coins1000:"coins_1000",skinPrism:"skin_prism"}};function gr(){try{const i=globalThis.window;return!!(i?.Capacitor?.isNativePlatform?.()||i?.BlobtideNativeIap?.isNative)}catch{return!1}}function _r(){if(gr())return!1;try{const i=globalThis.location?.hostname;return i==="localhost"||i==="127.0.0.1"}catch{return!1}}function Ao(){if(gr())return!1;try{const i=globalThis.location?.hostname;return i==="localhost"||i==="127.0.0.1"}catch{return!1}}function js(i,t,e){const n=Math.max(1,Math.floor(e));let s=Math.max(0,Math.floor(t));return i==="add"?s+=n:i==="sub"?s=Math.max(0,s-n):i==="mul"?s*=n:i==="div"&&(s=Math.floor(s/n)),Math.min(s,99999)}function jl(i,t){const e=Math.floor(t);return i==="add"?`+${e}`:i==="sub"?`-${e}`:i==="mul"?`×${e}`:i==="div"?`÷${e}`:"?"}function jc(i){let t=i.startCount;const e=[...i.pieces].sort((n,s)=>n.z-s.z);for(const n of e)if(n.type==="gate")t=js(n.op,t,n.value);else if(n.type==="dualgate"){const s=js(n.left.op,t,n.left.value),r=js(n.right.op,t,n.right.value);t=Math.max(s,r)}else if(n.type==="saw"||n.type==="wall"||n.type==="spinner"||n.type==="crusher"){if(n.move)continue;Math.abs(n.x||0)<.55&&(t=Math.max(0,t-(n.damage||2)))}else if(n.type==="hole")Math.abs(n.x||0)<.55&&(t=Math.max(0,Math.floor(t*.7)));else if(n.type==="grow")t+=Math.max(1,Math.floor(n.amount||8));else if(n.type==="army")t=t>n.count?t-n.count:0;else if(n.type==="finish")return{count:t,hp:n.hp};return{count:t,hp:1}}function we(i,t,e,n=0){return{z:i,type:"gate",op:t,value:e,x:n}}function wn(i,t,e){return{z:i,type:"dualgate",left:t,right:e}}function Gn(i,t,e,n=1.4){return{z:i,type:"saw",x:t,damage:e,width:n}}function Qs(i,t,e=2){return{z:i,type:"hole",x:t,width:e}}function tr(i,t,e=1.3,n=3){return{z:i,type:"wall",x:t,width:e,damage:n}}function cs(i,t,e,n=1.55,s=2.8){return{z:i,type:"saw",x:t,damage:e,width:1.35,move:!0,amp:n,speed:s}}function Sn(i,t,e=0){return{z:i,type:"army",x:e,count:t}}function At(i,t,e=6){return{z:i,type:"coin",x:t,amount:e}}function Bn(i,t=0){return{z:i,type:"boost",x:t}}function Er(i,t=0){return{z:i,type:"shield",x:t}}function kn(i,t=0){return{z:i,type:"magnet",x:t}}function zn(i,t=0){return{z:i,type:"star",x:t}}function ri(i,t=0,e=8){return{z:i,type:"grow",x:t,amount:e}}function an(i,t,e,n=1.7){return{z:i,type:"spinner",x:t,damage:e,width:n}}function Hn(i,t,e,n=2.2){return{z:i,type:"crusher",x:t,damage:e,width:n}}function on(i,t){return{z:i,type:"finish",hp:t}}function Qc(){return[{id:1,startCount:2,pieces:[At(8,0,6),At(12,1.2,6),At(16,-1.2,6),we(26,"add",4),At(36,0,8),we(48,"add",6),At(58,1.3,8),Gn(70,1.7,4,1.4),At(80,0,8),wn(92,{op:"mul",value:2},{op:"add",value:5}),At(104,0,8),Sn(118,8),we(132,"add",8),At(142,0,8),an(154,1.65,4),At(164,-1.2,8),on(178,12)]},{id:2,startCount:4,pieces:[At(8,0,6),we(18,"mul",2),At(28,-1.4,8),At(32,0,6),At(36,1.4,6),we(48,"add",8),Gn(60,1.7,5,1.45),At(70,0,8),Sn(84,10),we(98,"add",10),zn(108,0),At(116,0,8),an(128,-1.6,5),Bn(140,.4),kn(150,0),At(158,1.3,10),Hn(170,1.55,5),on(186,12)]},{id:3,startCount:5,pieces:[At(8,0,8),we(18,"add",4),Bn(28,0),At(36,1.3,8),Gn(48,1.65,5,1.5),At(58,-1.6,8),kn(68,-.4),At(76,1.5,8),we(88,"add",5),Sn(102,6),ri(114,0,8),zn(118,1.1),At(128,0,10),an(140,-1.65,5),tr(152,-1.95,1.5,5),Hn(164,1.5,5),on(180,14)]},{id:4,startCount:5,pieces:[At(8,-1.2,8),wn(18,{op:"mul",value:2},{op:"add",value:6}),At(30,-1.4,8),kn(40,0),At(48,1.3,8),cs(60,0,5,1.7),Bn(72,-.8),ri(82,.6,8),we(94,"add",4),Sn(108,8),zn(120,0),At(128,-1.2,10),an(140,1.6,5),Qs(152,1.6,1.9),on(168,12)]},{id:5,startCount:7,pieces:[At(8,0,8),we(16,"add",3),Er(26,1.5),Qs(38,1.55,2.1),At(48,-1.5,8),Bn(58,0),wn(70,{op:"mul",value:2},{op:"sub",value:4}),kn(82,-1.2),At(90,1.4,10),Sn(104,10),ri(116,0,8),zn(126,-.8),At(134,0,10),an(146,-1.6,6),Hn(158,1.5,6),cs(170,0,7,1.75),on(186,14)]},{id:6,startCount:8,pieces:[At(8,1.2,8),wn(18,{op:"add",value:5},{op:"div",value:2}),Bn(28,-1.2),Gn(40,1.55,6),kn(50,0),At(58,1.5,10),we(70,"mul",2),Sn(84,12),tr(96,-1.8,1.6,4),zn(108,1.2),ri(118,0,10),an(130,1.65,6),At(140,1.6,12),Hn(152,-1.5,6),wn(164,{op:"add",value:4},{op:"sub",value:8}),on(180,22)]},{id:7,startCount:6,pieces:[At(8,0,8),we(16,"mul",3),tr(28,1.9,1.7,5),Bn(38,0),kn(48,-.6),At(56,1.4,10),wn(68,{op:"add",value:8},{op:"sub",value:6}),Sn(82,10),cs(96,0,6,1.8),zn(108,.8),ri(118,-.8,10),an(130,-1.65,6),Er(142,1.2),At(150,0,12),Hn(162,1.5,6),Gn(174,-1.7,7,1.5),on(190,22)]},{id:8,startCount:10,pieces:[At(8,0,8),wn(18,{op:"div",value:2},{op:"add",value:6}),Er(28,-1.4),we(40,"mul",2),kn(50,0),At(58,-1.3,10),Gn(70,1.75,7),Sn(84,12),Bn(96,0),ri(106,0,10),an(118,-1.6,6),Qs(130,-1.5,1.9),zn(142,1.1),At(150,0,12),Hn(162,1.5,7),cs(174,0,8,1.85),on(192,24)]}]}function th(i){const t=4+Math.floor(i/8),e=[];let n=8;e.push(At(n,0,6+i%4)),n+=6,e.push(At(n,1.25,6)),n+=5,e.push(At(n,-1.25,6)),n+=10,e.push(we(n,"add",3+i%5)),n+=12,e.push(wn(n,{op:"mul",value:2},{op:"add",value:4+i%4})),n+=12,e.push(Gn(n,1.68,4+i%6,1.4)),n+=11,e.push(At(n,0,8)),n+=8,e.push(an(n,-1.62,4+i%5)),n+=12,e.push(At(n,1.2,8)),n+=9,e.push(Sn(n,6+i%10+Math.floor(i/12))),n+=14,e.push(we(n,"add",5+i%6)),n+=12,e.push(Hn(n,1.55,5+i%5)),n+=12,e.push(wn(n,{op:"add",value:6},{op:"sub",value:3})),n+=12,e.push(Qs(n,1.62,1.85)),n+=10,e.push(At(n,0,10)),n+=8,i>14&&(e.push(cs(n,0,5+i%6,1.5)),n+=12,e.push(Bn(n,0)),n+=10),i>22&&(e.push(an(n,1.7,6)),n+=12,e.push(ri(n,0,8)),n+=10,e.push(tr(n,-1.85,1.5,4+i%5)),n+=12),i>34&&(e.push(kn(n,0)),n+=8,e.push(zn(n,1)),n+=8,e.push(Hn(n,-1.52,6)),n+=12);const s=1+Math.floor(i/10);for(let u=0;u<s;u++)e.push(At(n,(u%2?1:-1)*1.2,8)),n+=7,e.push(we(n,u%2?"add":"mul",u%2?4:2)),n+=12,e.push(Gn(n,(u%2?1:-1)*1.7,5,1.4)),n+=11;e.push(At(n,0,10)),n+=10;const r={startCount:t,pieces:[...e,on(n+8,1)]},a=jc(r),l=.78+Math.min(1,(i-8)/48)*.16,c=Math.min(a.count,Math.max(t+4,Math.floor(a.count*l)));return e.push(on(n+8,c)),{id:i,startCount:t,pieces:e}}function eh(){const i=Qc();for(let t=9;t<=56;t++)i.push(th(t));return i}const _s=eh(),$n=[{id:"lime",name:"Glow Lime",price:0,color:13041482,emissive:7077658},{id:"cyan",name:"Electric Cyan",price:50,color:4059903,emissive:49878},{id:"magenta",name:"Hot Magenta",price:100,color:16727212,emissive:16711799},{id:"gold",name:"Sun Gold",price:250,color:16765286,emissive:16752412},{id:"ice",name:"Ice Glass",price:250,color:13694207,emissive:8050687},{id:"ember",name:"Ember",price:400,color:16739125,emissive:16722432},{id:"honey",name:"Honey",price:300,color:16762967,emissive:16755200},{id:"mint",name:"Mint Crystal",price:350,color:8257475,emissive:2883496},{id:"void",name:"Void",price:600,color:8019199,emissive:4858623},{id:"rainbow",name:"Prism",price:1200,color:16777215,emissive:16737996,iap:!0}];function nh(i){return $n.find(t=>t.id===i)||$n[0]}function Ql({leftover:i=0,doorHp:t=1}={}){const e=Math.max(1,Math.floor(Number(t)||1)),n=Math.max(0,Math.floor(Number(i)||0));return n>=Math.ceil(e*.5)?3:n>=Math.ceil(e*.15)?2:1}function tc(){return{stars:0,bestCoins:0,bestCrowd:0,completed:!1}}function ec(i,t){const e={...tc(),...i&&typeof i=="object"?i:{}},n=t&&typeof t=="object"?t:{};return{completed:!!(e.completed||n.completed),stars:Math.max(0,Math.min(3,Math.max(e.stars||0,n.stars||0))),bestCoins:Math.max(0,e.bestCoins||0,n.bestCoins||0),bestCrowd:Math.max(0,e.bestCrowd||0,n.bestCrowd||0)}}function ih(i,t=55){const e=i&&typeof i=="object"?i:{},n={};for(let s=0;s<=t;s++){const r=e[s]??e[String(s)];!r||typeof r!="object"||(n[s]=ec(tc(),{completed:r.completed===!0,stars:r.stars,bestCoins:r.bestCoins,bestCrowd:r.bestCrowd}))}return n}function nc(i,t=null){try{if(typeof localStorage>"u")return t;const e=localStorage.getItem(i);return e?JSON.parse(e):t}catch{return t}}function ic(i,t){try{return typeof localStorage>"u"?!1:(localStorage.setItem(i,JSON.stringify(t)),!0)}catch{return!1}}const cr=[{id:"wins",kind:"wins",target:3,reward:40,label:"Win 3 levels"},{id:"coins",kind:"coins",target:60,reward:25,label:"Pocket 60 coins"},{id:"combo",kind:"combo",target:1,reward:20,label:"Land a x3 combo"},{id:"stars",kind:"stars",target:1,reward:35,label:"Smash a 3-star"}];function Co(i=Date.now()){return new Date(i).toISOString().slice(0,10)}function sh(i,t,e=Date.now()){const n=Co(e),s=typeof i=="string"?i:"",r=Math.max(0,Math.floor(Number(t)||0));if(s===n)return{day:n,streak:Math.max(1,r),claim:0};const a=Co(e-864e5),o=s===a?r+1:1,l=15+Math.min(7,o)*5;return{day:n,streak:o,claim:l}}function rh(i){return Math.max(0,Math.floor(Number(i)||0))*4}function ah({reason:i,crowd:t=0,doorHp:e=0}={}){if(i!=="door")return{close:!1,line:"Swipe and smash. One more go."};const n=Math.max(1,Math.floor(e)),s=Math.max(0,Math.floor(t));return s>=Math.ceil(n*.65)?{close:!0,line:`SO CLOSE · ${s} / ${n}`}:{close:!1,line:`Need ${n}. You had ${s}.`}}function oh(i,t){const e=new Set(i||[]),n=$n.find(s=>!s.iap&&s.price>0&&!e.has(s.id));return n?{id:n.id,name:n.name,price:n.price,have:Math.max(0,Math.floor(Number(t)||0))}:null}function lh(i,t,e,n=1){const s=cr,r=(Math.floor(Number(i)||0)%s.length+s.length)%s.length,a=s[r];let o=Math.max(0,Math.floor(Number(t)||0));return a.kind===e&&(o+=Math.max(0,Math.floor(Number(n)||0))),o<a.target?{missionIndex:r,progress:o,completed:!1,reward:0,mission:a}:{missionIndex:(r+1)%s.length,progress:0,completed:!0,reward:a.reward,mission:a}}const Ro="blobtide_",$a=55,sc=new Set($n.map(i=>i.id));function ch(i,t=$a){const e=Math.max(0,Math.floor(i));return e>=t?{levelIndex:t,campaignComplete:!0}:{levelIndex:e+1,campaignComplete:!1}}function gn(i,t,e){const n=Math.floor(Number(i));return Number.isFinite(n)?Math.min(e,Math.max(t,n)):t}function Po(i,t=$a){const e=i&&typeof i=="object"?i:{};let n=Array.isArray(e.ownedSkins)?e.ownedSkins.filter(r=>typeof r=="string"&&sc.has(r)):[];n.includes("lime")||(n=["lime",...n]),n=[...new Set(n)];const s=typeof e.equipped=="string"&&n.includes(e.equipped)?e.equipped:"lime";return{v:Ye.saveVersion,coins:gn(e.coins,0,Ye.maxCoins),ownedSkins:n,equipped:s,removeAds:e.removeAds===!0,levelIndex:gn(e.levelIndex,0,t),maxUnlocked:gn(e.maxUnlocked,0,t),winsSinceAd:gn(e.winsSinceAd,0,30),campaignComplete:e.campaignComplete===!0,stats:ih(e.stats,t),winStreak:gn(e.winStreak,0,99),bestStreak:gn(e.bestStreak,0,99),dailyStreak:gn(e.dailyStreak,0,99),lastPlayDay:/^\d{4}-\d{2}-\d{2}$/.test(e.lastPlayDay)?e.lastPlayDay:"",missionIndex:gn(e.missionIndex,0,cr.length-1),missionProgress:gn(e.missionProgress,0,9999)}}const hh={coins:0,ownedSkins:["lime"],equipped:"lime",removeAds:!1,levelIndex:0,maxUnlocked:0,winsSinceAd:0,campaignComplete:!1,stats:{},winStreak:0,bestStreak:0,dailyStreak:0,lastPlayDay:"",missionIndex:0,missionProgress:0,load(){const i=nc(Ro+"save",null);return!i||typeof i!="object"?this:(Object.assign(this,Po(i)),this)},save(){const i=Po(this);Object.assign(this,i),ic(Ro+"save",i)},addCoins(i){this.coins=Math.min(Ye.maxCoins,this.coins+Math.max(0,Math.floor(i))),this.save()},buySkin(i,t){return!sc.has(i)||i==="rainbow"?!1:this.ownedSkins.includes(i)?!0:this.coins<t?!1:(this.coins-=t,this.ownedSkins.push(i),this.equipped=i,this.save(),!0)},equip(i){return this.ownedSkins.includes(i)?(this.equipped=i,this.save(),!0):!1},recordLevelWin(i,{coins:t=0,crowd:e=0,leftover:n=0,doorHp:s=1}={}){const r=Ql({leftover:n,doorHp:s}),a=Math.max(0,Math.floor(i));return this.stats[a]=ec(this.stats[a],{completed:!0,stars:r,bestCoins:Math.max(0,Math.floor(t)),bestCrowd:Math.max(0,Math.floor(e))}),this.save(),{stars:r,best:this.stats[a]}},isUnlocked(i){return i<=this.maxUnlocked},onWin(i){const t=ch(i,$a);return this.levelIndex=t.levelIndex,this.campaignComplete=t.campaignComplete,this.maxUnlocked=Math.max(this.maxUnlocked,this.levelIndex),this.winsSinceAd+=1,this.save(),t},beginNewRun(){this.campaignComplete=!1,this.levelIndex=0,this.save()},grantRemoveAds(){this.removeAds=!0,this.save()},claimDaily(){const i=sh(this.lastPlayDay,this.dailyStreak);return this.lastPlayDay=i.day,this.dailyStreak=i.streak,i.claim>0?this.addCoins(i.claim):this.save(),i},noteWin(i=1){return this.winStreak+=1,this.bestStreak=Math.max(this.bestStreak,this.winStreak),this.pushMission("wins",1),i>=3&&this.pushMission("stars",1),this.save(),rh(this.winStreak)},noteFail(){this.winStreak=0,this.save()},pushMission(i,t=1){const e=lh(this.missionIndex,this.missionProgress,i,t);return this.missionIndex=e.missionIndex,this.missionProgress=e.progress,e.completed&&e.reward?this.addCoins(e.reward):this.save(),e},hookView(){const i=cr[this.missionIndex%cr.length];return{winStreak:this.winStreak,bestStreak:this.bestStreak,dailyStreak:this.dailyStreak,mission:`${i.label} · ${this.missionProgress}/${i.target}`,nextSkin:oh(this.ownedSkins,this.coins)}}};function uh({adsRemoved:i,winsSinceAd:t,levelIndex:e,lastShownAt:n=0,now:s=Date.now(),tutorialActive:r=!1}={}){return!(i||r||Math.max(0,Math.floor(Number(e)||0))<Ye.ads.minLevelForInterstitial||Math.max(0,Math.floor(Number(t)||0))<Ye.ads.interstitialEveryWins||s-n<Ye.ads.minMsBetweenInterstitials)}async function xi(i,...t){const n=globalThis.window?.BlobtidePlatform?.[i];if(typeof n=="function")return n(...t)}const qe={async gameplayStart(){await xi("gameplayStart")},async gameplayStop(){await xi("gameplayStop")},async commercialBreak(){return await xi("commercialBreak")!==!1},async rewardedBreak(){return await xi("rewardedBreak")===!0},happyTime(){xi("happyTime")},openExternalLink(i){xi("openExternalLink",i)},has(i){return typeof globalThis.window?.BlobtidePlatform?.[i]=="function"}};function Lo(i){return new Promise(t=>setTimeout(t,i))}class dh{constructor(t,e){this.economy=t,this.overlay=e,this.lastInterstitialAt=0,this.rewardedBusy=!1}adsEnabled(){return!this.economy.removeAds}canShowInterstitial(t=!1){return uh({adsRemoved:!this.adsEnabled(),winsSinceAd:this.economy.winsSinceAd,levelIndex:this.economy.levelIndex,lastShownAt:this.lastInterstitialAt,now:Date.now(),tutorialActive:t})}async showRewarded(t){if(this.rewardedBusy)return!1;this.rewardedBusy=!0;try{return qe.has("rewardedBreak")?!!await qe.rewardedBreak():globalThis.window?.BlobtideNativeAds?.showRewarded?!!await globalThis.window.BlobtideNativeAds.showRewarded(t):Ao()?(this.overlay.showAd("Rewarded",`Unlock ${t}`,1800),await Lo(1800),this.overlay.hideAd(),!0):!1}catch{return!1}finally{this.rewardedBusy=!1}}async maybeInterstitial(t=!1){if(!this.canShowInterstitial(t))return!1;try{if(qe.has("commercialBreak"))return await qe.commercialBreak(),this.lastInterstitialAt=Date.now(),this.economy.winsSinceAd=0,this.economy.save(),!0;if(globalThis.window?.BlobtideNativeAds?.showInterstitial){const e=await globalThis.window.BlobtideNativeAds.showInterstitial();return e&&(this.lastInterstitialAt=Date.now(),this.economy.winsSinceAd=0,this.economy.save()),!!e}return Ao()?(this.overlay.showAd("Break","A short ad keeps Blobtide free.",1600),await Lo(1600),this.overlay.hideAd(),this.lastInterstitialAt=Date.now(),this.economy.winsSinceAd=0,this.economy.save(),!0):!1}catch{return!1}}}const fh={[Ye.iap.coins200]:200,[Ye.iap.coins1000]:1e3};class ph{constructor(t){this.economy=t}async buyRemoveAds(){return this.fulfill(Ye.iap.removeAds,()=>this.economy.grantRemoveAds())}async buyCoins(t,e){const n=fh[e];return n==null||n!==t?!1:this.fulfill(e,()=>this.economy.addCoins(n))}async buyPrism(){return this.fulfill(Ye.iap.skinPrism,()=>{this.economy.ownedSkins.includes("rainbow")||this.economy.ownedSkins.push("rainbow"),this.economy.equipped="rainbow",this.economy.save()})}async restore(){if(!globalThis.window?.BlobtideNativeIap?.restore)return!1;try{const t=await globalThis.window.BlobtideNativeIap.restore(),e=Array.isArray(t)?t:[];return e.includes(Ye.iap.removeAds)&&this.economy.grantRemoveAds(),e.includes(Ye.iap.skinPrism)&&!this.economy.ownedSkins.includes("rainbow")&&(this.economy.ownedSkins.push("rainbow"),this.economy.save()),!0}catch{return!1}}async fulfill(t,e){if(globalThis.window?.BlobtideNativeIap?.buy){const n=await globalThis.window.BlobtideNativeIap.buy(t);return n&&e(),!!n}return _r()?(e(),!0):!1}}const De={event(i,t={}){if(typeof i!="string"||!/^[a-z][a-z0-9_]{0,39}$/.test(i))return;const e={},n=/^(email|name|phone|user|password|idfa|gaid|ip)$/;for(const[s,r]of Object.entries(t))!/^[a-z][a-z0-9_]{0,39}$/.test(s)||n.test(s)||(typeof r=="number"&&Number.isFinite(r)?e[s]=r:typeof r=="string"?e[s]=r.slice(0,80):typeof r=="boolean"&&(e[s]=r));if(globalThis.window?.BlobtideAnalytics?.event){globalThis.window.BlobtideAnalytics.event(i,e);return}typeof globalThis.gtag=="function"&&globalThis.gtag("event",i,e)}},mh={async request(){return globalThis.window?.BlobtideConsent?.request?globalThis.window.BlobtideConsent.request():{att:!1,ump:!1,native:gr()}}};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ja="170",gh=0,Io=1,_h=2,rc=1,vh=2,bn=3,Jn=0,Ue=1,cn=2,qn=0,Oi=1,Do=2,Uo=3,No=4,xh=5,li=100,Mh=101,yh=102,Sh=103,bh=104,wh=200,Eh=201,Th=202,Ah=203,oa=204,la=205,Ch=206,Rh=207,Ph=208,Lh=209,Ih=210,Dh=211,Uh=212,Nh=213,Fh=214,ca=0,ha=1,ua=2,Hi=3,da=4,fa=5,pa=6,ma=7,Ka=0,Oh=1,Bh=2,Yn=0,kh=1,zh=2,Gh=3,Hh=4,Vh=5,Wh=6,Xh=7,ac=300,Vi=301,Wi=302,ga=303,_a=304,vr=306,vs=1e3,hi=1001,va=1002,ze=1003,qh=1004,Ts=1005,hn=1006,Tr=1007,ui=1008,Cn=1009,oc=1010,lc=1011,xs=1012,Za=1013,fi=1014,un=1015,ys=1016,ja=1017,Qa=1018,Xi=1020,cc=35902,hc=1021,uc=1022,nn=1023,dc=1024,fc=1025,Bi=1026,qi=1027,to=1028,eo=1029,pc=1030,no=1031,io=1033,er=33776,nr=33777,ir=33778,sr=33779,xa=35840,Ma=35841,ya=35842,Sa=35843,ba=36196,wa=37492,Ea=37496,Ta=37808,Aa=37809,Ca=37810,Ra=37811,Pa=37812,La=37813,Ia=37814,Da=37815,Ua=37816,Na=37817,Fa=37818,Oa=37819,Ba=37820,ka=37821,rr=36492,za=36494,Ga=36495,mc=36283,Ha=36284,Va=36285,Wa=36286,Yh=3200,$h=3201,so=0,Jh=1,Wn="",Ie="srgb",$i="srgb-linear",xr="linear",jt="srgb",Mi=7680,Fo=519,Kh=512,Zh=513,jh=514,gc=515,Qh=516,tu=517,eu=518,nu=519,Oo=35044,hr=35048,Bo="300 es",Tn=2e3,ur=2001;class Ji{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const s=this._listeners[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Se=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ko=1234567;const ds=Math.PI/180,Ms=180/Math.PI;function Ki(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Se[i&255]+Se[i>>8&255]+Se[i>>16&255]+Se[i>>24&255]+"-"+Se[t&255]+Se[t>>8&255]+"-"+Se[t>>16&15|64]+Se[t>>24&255]+"-"+Se[e&63|128]+Se[e>>8&255]+"-"+Se[e>>16&255]+Se[e>>24&255]+Se[n&255]+Se[n>>8&255]+Se[n>>16&255]+Se[n>>24&255]).toLowerCase()}function xe(i,t,e){return Math.max(t,Math.min(e,i))}function ro(i,t){return(i%t+t)%t}function iu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function su(i,t,e){return i!==t?(e-i)/(t-i):0}function fs(i,t,e){return(1-e)*i+e*t}function ru(i,t,e,n){return fs(i,t,1-Math.exp(-e*n))}function au(i,t=1){return t-Math.abs(ro(i,t*2)-t)}function ou(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function lu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function cu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function hu(i,t){return i+Math.random()*(t-i)}function uu(i){return i*(.5-Math.random())}function du(i){i!==void 0&&(ko=i);let t=ko+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function fu(i){return i*ds}function pu(i){return i*Ms}function mu(i){return(i&i-1)===0&&i!==0}function gu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _u(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function vu(i,t,e,n,s){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),u=a((t+n)/2),h=r((t-n)/2),d=a((t-n)/2),m=r((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(o*u,l*h,l*d,o*c);break;case"YZY":i.set(l*d,o*u,l*h,o*c);break;case"ZXZ":i.set(l*h,l*d,o*u,o*c);break;case"XZX":i.set(o*u,l*g,l*m,o*c);break;case"YXY":i.set(l*m,o*u,l*g,o*c);break;case"ZYZ":i.set(l*g,l*m,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Ni(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Te(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const dr={DEG2RAD:ds,RAD2DEG:Ms,generateUUID:Ki,clamp:xe,euclideanModulo:ro,mapLinear:iu,inverseLerp:su,lerp:fs,damp:ru,pingpong:au,smoothstep:ou,smootherstep:lu,randInt:cu,randFloat:hu,randFloatSpread:uu,seededRandom:du,degToRad:fu,radToDeg:pu,isPowerOfTwo:mu,ceilPowerOfTwo:gu,floorPowerOfTwo:_u,setQuaternionFromProperEuler:vu,normalize:Te,denormalize:Ni};class ut{constructor(t=0,e=0){ut.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Nt{constructor(t,e,n,s,r,a,o,l,c){Nt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],m=n[5],g=n[8],_=s[0],f=s[3],p=s[6],b=s[1],w=s[4],M=s[7],N=s[2],T=s[5],A=s[8];return r[0]=a*_+o*b+l*N,r[3]=a*f+o*w+l*T,r[6]=a*p+o*M+l*A,r[1]=c*_+u*b+h*N,r[4]=c*f+u*w+h*T,r[7]=c*p+u*M+h*A,r[2]=d*_+m*b+g*N,r[5]=d*f+m*w+g*T,r[8]=d*p+m*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*r*u+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*a-o*c,d=o*l-u*r,m=c*r-a*l,g=e*h+n*d+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=h*_,t[1]=(s*c-u*n)*_,t[2]=(o*n-s*a)*_,t[3]=d*_,t[4]=(u*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=m*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ar.makeScale(t,e)),this}rotate(t){return this.premultiply(Ar.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ar.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ar=new Nt;function _c(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function fr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function xu(){const i=fr("canvas");return i.style.display="block",i}const zo={};function hs(i){i in zo||(zo[i]=!0,console.warn(i))}function Mu(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function yu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function Su(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const Yt={enabled:!0,workingColorSpace:$i,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===jt&&(i.r=An(i.r),i.g=An(i.g),i.b=An(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===jt&&(i.r=ki(i.r),i.g=ki(i.g),i.b=ki(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Wn?xr:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const Go=[.64,.33,.3,.6,.15,.06],Ho=[.2126,.7152,.0722],Vo=[.3127,.329],Wo=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xo=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Yt.define({[$i]:{primaries:Go,whitePoint:Vo,transfer:xr,toXYZ:Wo,fromXYZ:Xo,luminanceCoefficients:Ho,workingColorSpaceConfig:{unpackColorSpace:Ie},outputColorSpaceConfig:{drawingBufferColorSpace:Ie}},[Ie]:{primaries:Go,whitePoint:Vo,transfer:jt,toXYZ:Wo,fromXYZ:Xo,luminanceCoefficients:Ho,outputColorSpaceConfig:{drawingBufferColorSpace:Ie}}});let yi;class bu{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{yi===void 0&&(yi=fr("canvas")),yi.width=t.width,yi.height=t.height;const n=yi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=yi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=An(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let wu=0;class vc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=Ki(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Cr(s[a].image)):r.push(Cr(s[a]))}else r=Cr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Cr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?bu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Eu=0;class Ee extends Ji{constructor(t=Ee.DEFAULT_IMAGE,e=Ee.DEFAULT_MAPPING,n=hi,s=hi,r=hn,a=ui,o=nn,l=Cn,c=Ee.DEFAULT_ANISOTROPY,u=Wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Eu++}),this.uuid=Ki(),this.name="",this.source=new vc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ut(0,0),this.repeat=new ut(1,1),this.center=new ut(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ac)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case vs:t.x=t.x-Math.floor(t.x);break;case hi:t.x=t.x<0?0:1;break;case va:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case vs:t.y=t.y-Math.floor(t.y);break;case hi:t.y=t.y<0?0:1;break;case va:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ee.DEFAULT_IMAGE=null;Ee.DEFAULT_MAPPING=ac;Ee.DEFAULT_ANISOTROPY=1;class Qt{constructor(t=0,e=0,n=0,s=1){Qt.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],m=l[5],g=l[9],_=l[2],f=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,M=(m+1)/2,N=(p+1)/2,T=(u+d)/4,A=(h+_)/4,P=(g+f)/4;return w>M&&w>N?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=T/n,r=A/n):M>N?M<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(M),n=T/s,r=P/s):N<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(N),n=A/r,s=P/r),this.set(n,s,r,e),this}let b=Math.sqrt((f-g)*(f-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(f-g)/b,this.y=(h-_)/b,this.z=(d-u)/b,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tu extends Ji{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Qt(0,0,t,e),this.scissorTest=!1,this.viewport=new Qt(0,0,t,e);const s={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:hn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Ee(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,s=t.textures.length;n<s;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new vc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pi extends Tu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class xc extends Ee{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ze,this.minFilter=ze,this.wrapR=hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Au extends Ee{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=ze,this.minFilter=ze,this.wrapR=hi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ss{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[a+0],m=r[a+1],g=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(o===1){t[e+0]=d,t[e+1]=m,t[e+2]=g,t[e+3]=_;return}if(h!==_||l!==d||c!==m||u!==g){let f=1-o;const p=l*d+c*m+u*g+h*_,b=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const N=Math.sqrt(w),T=Math.atan2(N,p*b);f=Math.sin(f*T)/N,o=Math.sin(o*T)/N}const M=o*b;if(l=l*f+d*M,c=c*f+m*M,u=u*f+g*M,h=h*f+_*M,f===1-o){const N=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=N,c*=N,u*=N,h*=N}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[a],d=r[a+1],m=r[a+2],g=r[a+3];return t[e]=o*g+u*h+l*m-c*d,t[e+1]=l*g+u*d+c*h-o*m,t[e+2]=c*g+u*m+o*d-l*h,t[e+3]=u*g-o*h-l*d-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(s/2),h=o(r/2),d=l(n/2),m=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*m*g,this._y=c*m*h-d*u*g,this._z=c*u*g+d*m*h,this._w=c*u*h-d*m*g;break;case"YXZ":this._x=d*u*h+c*m*g,this._y=c*m*h-d*u*g,this._z=c*u*g-d*m*h,this._w=c*u*h+d*m*g;break;case"ZXY":this._x=d*u*h-c*m*g,this._y=c*m*h+d*u*g,this._z=c*u*g+d*m*h,this._w=c*u*h-d*m*g;break;case"ZYX":this._x=d*u*h-c*m*g,this._y=c*m*h+d*u*g,this._z=c*u*g-d*m*h,this._w=c*u*h+d*m*g;break;case"YZX":this._x=d*u*h+c*m*g,this._y=c*m*h+d*u*g,this._z=c*u*g-d*m*h,this._w=c*u*h-d*m*g;break;case"XZY":this._x=d*u*h-c*m*g,this._y=c*m*h-d*u*g,this._z=c*u*g+d*m*h,this._w=c*u*h+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=n+o+h;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>h){const m=2*Math.sqrt(1+n-o-h);this._w=(u-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-n-h);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-s*o,this._w=a*u-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,a=this._w;let o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*s+e*this._y,this._z=m*r+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=a*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(t=0,e=0,n=0){C.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(qo.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(qo.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),u=2*(o*e-r*s),h=2*(r*n-a*e);return this.x=e+l*c+a*h-o*u,this.y=n+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Rr.copy(this).projectOnVector(t),this.sub(Rr)}reflect(t){return this.sub(Rr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Rr=new C,qo=new Ss;class mi{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ze.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ze.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Ze.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ze):Ze.fromBufferAttribute(r,a),Ze.applyMatrix4(t.matrixWorld),this.expandByPoint(Ze);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),As.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),As.copy(n.boundingBox)),As.applyMatrix4(t.matrixWorld),this.union(As)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ze),Ze.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ns),Cs.subVectors(this.max,ns),Si.subVectors(t.a,ns),bi.subVectors(t.b,ns),wi.subVectors(t.c,ns),In.subVectors(bi,Si),Dn.subVectors(wi,bi),Qn.subVectors(Si,wi);let e=[0,-In.z,In.y,0,-Dn.z,Dn.y,0,-Qn.z,Qn.y,In.z,0,-In.x,Dn.z,0,-Dn.x,Qn.z,0,-Qn.x,-In.y,In.x,0,-Dn.y,Dn.x,0,-Qn.y,Qn.x,0];return!Pr(e,Si,bi,wi,Cs)||(e=[1,0,0,0,1,0,0,0,1],!Pr(e,Si,bi,wi,Cs))?!1:(Rs.crossVectors(In,Dn),e=[Rs.x,Rs.y,Rs.z],Pr(e,Si,bi,wi,Cs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ze).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ze).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_n[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_n[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_n[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_n[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_n[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_n[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_n[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_n[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_n),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const _n=[new C,new C,new C,new C,new C,new C,new C,new C],Ze=new C,As=new mi,Si=new C,bi=new C,wi=new C,In=new C,Dn=new C,Qn=new C,ns=new C,Cs=new C,Rs=new C,ti=new C;function Pr(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ti.fromArray(i,r);const o=s.x*Math.abs(ti.x)+s.y*Math.abs(ti.y)+s.z*Math.abs(ti.z),l=t.dot(ti),c=e.dot(ti),u=n.dot(ti);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Cu=new mi,is=new C,Lr=new C;class Zi{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Cu.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;is.subVectors(t,this.center);const e=is.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Lr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(is.copy(t.center).add(Lr)),this.expandByPoint(is.copy(t.center).sub(Lr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const vn=new C,Ir=new C,Ps=new C,Un=new C,Dr=new C,Ls=new C,Ur=new C;class Mc{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,vn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=vn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(vn.copy(this.origin).addScaledVector(this.direction,e),vn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ir.copy(t).add(e).multiplyScalar(.5),Ps.copy(e).sub(t).normalize(),Un.copy(this.origin).sub(Ir);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ps),o=Un.dot(this.direction),l=-Un.dot(Ps),c=Un.lengthSq(),u=Math.abs(1-a*a);let h,d,m,g;if(u>0)if(h=a*l-o,d=a*o-l,g=r*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,m=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),m=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),m=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Ir).addScaledVector(Ps,d),m}intersectSphere(t,e){vn.subVectors(t.center,this.origin);const n=vn.dot(this.direction),s=vn.dot(vn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),u>=0?(r=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(r=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(o=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,vn)!==null}intersectTriangle(t,e,n,s,r){Dr.subVectors(e,t),Ls.subVectors(n,t),Ur.crossVectors(Dr,Ls);let a=this.direction.dot(Ur),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Un.subVectors(this.origin,t);const l=o*this.direction.dot(Ls.crossVectors(Un,Ls));if(l<0)return null;const c=o*this.direction.dot(Dr.cross(Un));if(c<0||l+c>a)return null;const u=-o*Un.dot(Ur);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class te{constructor(t,e,n,s,r,a,o,l,c,u,h,d,m,g,_,f){te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,u,h,d,m,g,_,f)}set(t,e,n,s,r,a,o,l,c,u,h,d,m,g,_,f){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=m,p[7]=g,p[11]=_,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new te().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ei.setFromMatrixColumn(t,0).length(),r=1/Ei.setFromMatrixColumn(t,1).length(),a=1/Ei.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(t.order==="XYZ"){const d=a*u,m=a*h,g=o*u,_=o*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=m+g*c,e[5]=d-_*c,e[9]=-o*l,e[2]=_-d*c,e[6]=g+m*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*u,m=l*h,g=c*u,_=c*h;e[0]=d+_*o,e[4]=g*o-m,e[8]=a*c,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=m*o-g,e[6]=_+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*u,m=l*h,g=c*u,_=c*h;e[0]=d-_*o,e[4]=-a*h,e[8]=g+m*o,e[1]=m+g*o,e[5]=a*u,e[9]=_-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*u,m=a*h,g=o*u,_=o*h;e[0]=l*u,e[4]=g*c-m,e[8]=d*c+_,e[1]=l*h,e[5]=_*c+d,e[9]=m*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,m=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=_-d*h,e[8]=g*h+m,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=m*h+g,e[10]=d-_*h}else if(t.order==="XZY"){const d=a*l,m=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+_,e[5]=a*u,e[9]=m*h-g,e[2]=g*h-m,e[6]=o*u,e[10]=_*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ru,t,Pu)}lookAt(t,e,n){const s=this.elements;return Fe.subVectors(t,e),Fe.lengthSq()===0&&(Fe.z=1),Fe.normalize(),Nn.crossVectors(n,Fe),Nn.lengthSq()===0&&(Math.abs(n.z)===1?Fe.x+=1e-4:Fe.z+=1e-4,Fe.normalize(),Nn.crossVectors(n,Fe)),Nn.normalize(),Is.crossVectors(Fe,Nn),s[0]=Nn.x,s[4]=Is.x,s[8]=Fe.x,s[1]=Nn.y,s[5]=Is.y,s[9]=Fe.y,s[2]=Nn.z,s[6]=Is.z,s[10]=Fe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],m=n[13],g=n[2],_=n[6],f=n[10],p=n[14],b=n[3],w=n[7],M=n[11],N=n[15],T=s[0],A=s[4],P=s[8],S=s[12],x=s[1],R=s[5],z=s[9],k=s[13],V=s[2],K=s[6],W=s[10],tt=s[14],H=s[3],rt=s[7],dt=s[11],St=s[15];return r[0]=a*T+o*x+l*V+c*H,r[4]=a*A+o*R+l*K+c*rt,r[8]=a*P+o*z+l*W+c*dt,r[12]=a*S+o*k+l*tt+c*St,r[1]=u*T+h*x+d*V+m*H,r[5]=u*A+h*R+d*K+m*rt,r[9]=u*P+h*z+d*W+m*dt,r[13]=u*S+h*k+d*tt+m*St,r[2]=g*T+_*x+f*V+p*H,r[6]=g*A+_*R+f*K+p*rt,r[10]=g*P+_*z+f*W+p*dt,r[14]=g*S+_*k+f*tt+p*St,r[3]=b*T+w*x+M*V+N*H,r[7]=b*A+w*R+M*K+N*rt,r[11]=b*P+w*z+M*W+N*dt,r[15]=b*S+w*k+M*tt+N*St,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],m=t[14],g=t[3],_=t[7],f=t[11],p=t[15];return g*(+r*l*h-s*c*h-r*o*d+n*c*d+s*o*m-n*l*m)+_*(+e*l*m-e*c*d+r*a*d-s*a*m+s*c*u-r*l*u)+f*(+e*c*h-e*o*m-r*a*h+n*a*m+r*o*u-n*c*u)+p*(-s*o*u-e*l*h+e*o*d+s*a*h-n*a*d+n*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],m=t[11],g=t[12],_=t[13],f=t[14],p=t[15],b=h*f*c-_*d*c+_*l*m-o*f*m-h*l*p+o*d*p,w=g*d*c-u*f*c-g*l*m+a*f*m+u*l*p-a*d*p,M=u*_*c-g*h*c+g*o*m-a*_*m-u*o*p+a*h*p,N=g*h*l-u*_*l-g*o*d+a*_*d+u*o*f-a*h*f,T=e*b+n*w+s*M+r*N;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return t[0]=b*A,t[1]=(_*d*r-h*f*r-_*s*m+n*f*m+h*s*p-n*d*p)*A,t[2]=(o*f*r-_*l*r+_*s*c-n*f*c-o*s*p+n*l*p)*A,t[3]=(h*l*r-o*d*r-h*s*c+n*d*c+o*s*m-n*l*m)*A,t[4]=w*A,t[5]=(u*f*r-g*d*r+g*s*m-e*f*m-u*s*p+e*d*p)*A,t[6]=(g*l*r-a*f*r-g*s*c+e*f*c+a*s*p-e*l*p)*A,t[7]=(a*d*r-u*l*r+u*s*c-e*d*c-a*s*m+e*l*m)*A,t[8]=M*A,t[9]=(g*h*r-u*_*r-g*n*m+e*_*m+u*n*p-e*h*p)*A,t[10]=(a*_*r-g*o*r+g*n*c-e*_*c-a*n*p+e*o*p)*A,t[11]=(u*o*r-a*h*r-u*n*c+e*h*c+a*n*m-e*o*m)*A,t[12]=N*A,t[13]=(u*_*s-g*h*s+g*n*d-e*_*d-u*n*f+e*h*f)*A,t[14]=(g*o*s-a*_*s-g*n*l+e*_*l+a*n*f-e*o*f)*A,t[15]=(a*h*s-u*o*s+u*n*l-e*h*l-a*n*d+e*o*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+n,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,u=a+a,h=o+o,d=r*c,m=r*u,g=r*h,_=a*u,f=a*h,p=o*h,b=l*c,w=l*u,M=l*h,N=n.x,T=n.y,A=n.z;return s[0]=(1-(_+p))*N,s[1]=(m+M)*N,s[2]=(g-w)*N,s[3]=0,s[4]=(m-M)*T,s[5]=(1-(d+p))*T,s[6]=(f+b)*T,s[7]=0,s[8]=(g+w)*A,s[9]=(f-b)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=Ei.set(s[0],s[1],s[2]).length();const a=Ei.set(s[4],s[5],s[6]).length(),o=Ei.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],je.copy(this);const c=1/r,u=1/a,h=1/o;return je.elements[0]*=c,je.elements[1]*=c,je.elements[2]*=c,je.elements[4]*=u,je.elements[5]*=u,je.elements[6]*=u,je.elements[8]*=h,je.elements[9]*=h,je.elements[10]*=h,e.setFromRotationMatrix(je),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Tn){const l=this.elements,c=2*r/(e-t),u=2*r/(n-s),h=(e+t)/(e-t),d=(n+s)/(n-s);let m,g;if(o===Tn)m=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===ur)m=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Tn){const l=this.elements,c=1/(e-t),u=1/(n-s),h=1/(a-r),d=(e+t)*c,m=(n+s)*u;let g,_;if(o===Tn)g=(a+r)*h,_=-2*h;else if(o===ur)g=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ei=new C,je=new te,Ru=new C(0,0,0),Pu=new C(1,1,1),Nn=new C,Is=new C,Fe=new C,Yo=new te,$o=new Ss;class sn{constructor(t=0,e=0,n=0,s=sn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-xe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Yo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Yo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $o.setFromEuler(this),this.setFromQuaternion($o,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}sn.DEFAULT_ORDER="XYZ";class yc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Lu=0;const Jo=new C,Ti=new Ss,xn=new te,Ds=new C,ss=new C,Iu=new C,Du=new Ss,Ko=new C(1,0,0),Zo=new C(0,1,0),jo=new C(0,0,1),Qo={type:"added"},Uu={type:"removed"},Ai={type:"childadded",child:null},Nr={type:"childremoved",child:null};class de extends Ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=de.DEFAULT_UP.clone();const t=new C,e=new sn,n=new Ss,s=new C(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new te},normalMatrix:{value:new Nt}}),this.matrix=new te,this.matrixWorld=new te,this.matrixAutoUpdate=de.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new yc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ti.setFromAxisAngle(t,e),this.quaternion.multiply(Ti),this}rotateOnWorldAxis(t,e){return Ti.setFromAxisAngle(t,e),this.quaternion.premultiply(Ti),this}rotateX(t){return this.rotateOnAxis(Ko,t)}rotateY(t){return this.rotateOnAxis(Zo,t)}rotateZ(t){return this.rotateOnAxis(jo,t)}translateOnAxis(t,e){return Jo.copy(t).applyQuaternion(this.quaternion),this.position.add(Jo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ko,t)}translateY(t){return this.translateOnAxis(Zo,t)}translateZ(t){return this.translateOnAxis(jo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ds.copy(t):Ds.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(ss,Ds,this.up):xn.lookAt(Ds,ss,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),Ti.setFromRotationMatrix(xn),this.quaternion.premultiply(Ti.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Qo),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Uu),Nr.child=t,this.dispatchEvent(Nr),Nr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),xn.multiply(t.parent.matrixWorld)),t.applyMatrix4(xn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Qo),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,t,Iu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,Du,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(t.shapes,h)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),h=a(t.shapes),d=a(t.skeletons),m=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}de.DEFAULT_UP=new C(0,1,0);de.DEFAULT_MATRIX_AUTO_UPDATE=!0;de.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Qe=new C,Mn=new C,Fr=new C,yn=new C,Ci=new C,Ri=new C,tl=new C,Or=new C,Br=new C,kr=new C,zr=new Qt,Gr=new Qt,Hr=new Qt;class en{constructor(t=new C,e=new C,n=new C){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Qe.subVectors(t,e),s.cross(Qe);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Qe.subVectors(s,e),Mn.subVectors(n,e),Fr.subVectors(t,e);const a=Qe.dot(Qe),o=Qe.dot(Mn),l=Qe.dot(Fr),c=Mn.dot(Mn),u=Mn.dot(Fr),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,m=(c*l-o*u)*d,g=(a*u-o*l)*d;return r.set(1-m-g,g,m)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,yn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,yn.x),l.addScaledVector(a,yn.y),l.addScaledVector(o,yn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return zr.setScalar(0),Gr.setScalar(0),Hr.setScalar(0),zr.fromBufferAttribute(t,e),Gr.fromBufferAttribute(t,n),Hr.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(zr,r.x),a.addScaledVector(Gr,r.y),a.addScaledVector(Hr,r.z),a}static isFrontFacing(t,e,n,s){return Qe.subVectors(n,e),Mn.subVectors(t,e),Qe.cross(Mn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Qe.subVectors(this.c,this.b),Mn.subVectors(this.a,this.b),Qe.cross(Mn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return en.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return en.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return en.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return en.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return en.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Ci.subVectors(s,n),Ri.subVectors(r,n),Or.subVectors(t,n);const l=Ci.dot(Or),c=Ri.dot(Or);if(l<=0&&c<=0)return e.copy(n);Br.subVectors(t,s);const u=Ci.dot(Br),h=Ri.dot(Br);if(u>=0&&h<=u)return e.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(Ci,a);kr.subVectors(t,r);const m=Ci.dot(kr),g=Ri.dot(kr);if(g>=0&&m<=g)return e.copy(r);const _=m*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(Ri,o);const f=u*g-m*h;if(f<=0&&h-u>=0&&m-g>=0)return tl.subVectors(r,s),o=(h-u)/(h-u+(m-g)),e.copy(s).addScaledVector(tl,o);const p=1/(f+_+d);return a=_*p,o=d*p,e.copy(n).addScaledVector(Ci,a).addScaledVector(Ri,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Sc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},Us={h:0,s:0,l:0};function Vr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ie){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Yt.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Yt.workingColorSpace){if(t=ro(t,1),e=xe(e,0,1),n=xe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Vr(a,r,t+1/3),this.g=Vr(a,r,t),this.b=Vr(a,r,t-1/3)}return Yt.toWorkingColorSpace(this,s),this}setStyle(t,e=Ie){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ie){const n=Sc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=ki(t.r),this.g=ki(t.g),this.b=ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ie){return Yt.fromWorkingColorSpace(be.copy(this),t),Math.round(xe(be.r*255,0,255))*65536+Math.round(xe(be.g*255,0,255))*256+Math.round(xe(be.b*255,0,255))}getHexString(t=Ie){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(be.copy(this),e);const n=be.r,s=be.g,r=be.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=Ie){Yt.fromWorkingColorSpace(be.copy(this),t);const e=be.r,n=be.g,s=be.b;return t!==Ie?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Fn),this.setHSL(Fn.h+t,Fn.s+e,Fn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Fn),t.getHSL(Us);const n=fs(Fn.h,Us.h,e),s=fs(Fn.s,Us.s,e),r=fs(Fn.l,Us.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new Bt;Bt.NAMES=Sc;let Nu=0;class gi extends Ji{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Nu++}),this.uuid=Ki(),this.name="",this.blending=Oi,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oa,this.blendDst=la,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Bt(0,0,0),this.blendAlpha=0,this.depthFunc=Hi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Oi&&(n.blending=this.blending),this.side!==Jn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==oa&&(n.blendSrc=this.blendSrc),this.blendDst!==la&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Hi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Re extends gi{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new Bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.combine=Ka,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const pe=new C,Ns=new ut;class $e{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Oo,this.updateRanges=[],this.gpuType=un,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ns.fromBufferAttribute(this,e),Ns.applyMatrix3(t),this.setXY(e,Ns.x,Ns.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyMatrix3(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyMatrix4(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.applyNormalMatrix(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)pe.fromBufferAttribute(this,e),pe.transformDirection(t),this.setXYZ(e,pe.x,pe.y,pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ni(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Te(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ni(e,this.array)),e}setX(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ni(e,this.array)),e}setY(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ni(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ni(e,this.array)),e}setW(t,e){return this.normalized&&(e=Te(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),s=Te(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Te(e,this.array),n=Te(n,this.array),s=Te(s,this.array),r=Te(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Oo&&(t.usage=this.usage),t}}class bc extends $e{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class wc extends $e{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends $e{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Fu=0;const We=new te,Wr=new de,Pi=new C,Oe=new mi,rs=new mi,ve=new C;class Pe extends Ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_c(t)?wc:bc)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Nt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return We.makeRotationFromQuaternion(t),this.applyMatrix4(We),this}rotateX(t){return We.makeRotationX(t),this.applyMatrix4(We),this}rotateY(t){return We.makeRotationY(t),this.applyMatrix4(We),this}rotateZ(t){return We.makeRotationZ(t),this.applyMatrix4(We),this}translate(t,e,n){return We.makeTranslation(t,e,n),this.applyMatrix4(We),this}scale(t,e,n){return We.makeScale(t,e,n),this.applyMatrix4(We),this}lookAt(t){return Wr.lookAt(t),Wr.updateMatrix(),this.applyMatrix4(Wr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{for(let n=0,s=e.count;n<s;n++){const r=t[n];e.setXYZ(n,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Oe.setFromBufferAttribute(r),this.morphTargetsRelative?(ve.addVectors(this.boundingBox.min,Oe.min),this.boundingBox.expandByPoint(ve),ve.addVectors(this.boundingBox.max,Oe.max),this.boundingBox.expandByPoint(ve)):(this.boundingBox.expandByPoint(Oe.min),this.boundingBox.expandByPoint(Oe.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const n=this.boundingSphere.center;if(Oe.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];rs.setFromBufferAttribute(o),this.morphTargetsRelative?(ve.addVectors(Oe.min,rs.min),Oe.expandByPoint(ve),ve.addVectors(Oe.max,rs.max),Oe.expandByPoint(ve)):(Oe.expandByPoint(rs.min),Oe.expandByPoint(rs.max))}Oe.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)ve.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ve));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ve.fromBufferAttribute(o,c),l&&(Pi.fromBufferAttribute(t,c),ve.add(Pi)),s=Math.max(s,n.distanceToSquared(ve))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $e(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<n.count;P++)o[P]=new C,l[P]=new C;const c=new C,u=new C,h=new C,d=new ut,m=new ut,g=new ut,_=new C,f=new C;function p(P,S,x){c.fromBufferAttribute(n,P),u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,x),d.fromBufferAttribute(r,P),m.fromBufferAttribute(r,S),g.fromBufferAttribute(r,x),u.sub(c),h.sub(c),m.sub(d),g.sub(d);const R=1/(m.x*g.y-g.x*m.y);isFinite(R)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-m.y).multiplyScalar(R),f.copy(h).multiplyScalar(m.x).addScaledVector(u,-g.x).multiplyScalar(R),o[P].add(_),o[S].add(_),o[x].add(_),l[P].add(f),l[S].add(f),l[x].add(f))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let P=0,S=b.length;P<S;++P){const x=b[P],R=x.start,z=x.count;for(let k=R,V=R+z;k<V;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const w=new C,M=new C,N=new C,T=new C;function A(P){N.fromBufferAttribute(s,P),T.copy(N);const S=o[P];w.copy(S),w.sub(N.multiplyScalar(N.dot(S))).normalize(),M.crossVectors(T,S);const R=M.dot(l[P])<0?-1:1;a.setXYZW(P,w.x,w.y,w.z,R)}for(let P=0,S=b.length;P<S;++P){const x=b[P],R=x.start,z=x.count;for(let k=R,V=R+z;k<V;k+=3)A(t.getX(k+0)),A(t.getX(k+1)),A(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new $e(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const s=new C,r=new C,a=new C,o=new C,l=new C,c=new C,u=new C,h=new C;if(t)for(let d=0,m=t.count;d<m;d+=3){const g=t.getX(d+0),_=t.getX(d+1),f=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,f),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,f),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let d=0,m=e.count;d<m;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ve.fromBufferAttribute(t,e),ve.normalize(),t.setXYZ(e,ve.x,ve.y,ve.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let m=0,g=0;for(let _=0,f=l.length;_<f;_++){o.isInterleavedBufferAttribute?m=l[_]*o.data.stride+o.offset:m=l[_]*u;for(let p=0;p<u;p++)d[g++]=c[m++]}return new $e(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Pe,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],m=t(d,n);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const m=c[h];u.push(m.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const s=t.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,m=h.length;d<m;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const el=new te,ei=new Mc,Fs=new Zi,nl=new C,Os=new C,Bs=new C,ks=new C,Xr=new C,zs=new C,il=new C,Gs=new C;class nt extends de{constructor(t=new Pe,e=new Re){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){zs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(Xr.fromBufferAttribute(h,t),a?zs.addScaledVector(Xr,u):zs.addScaledVector(Xr.sub(e),u))}e.add(zs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Fs.copy(n.boundingSphere),Fs.applyMatrix4(r),ei.copy(t.ray).recast(t.near),!(Fs.containsPoint(ei.origin)===!1&&(ei.intersectSphere(Fs,nl)===null||ei.origin.distanceToSquared(nl)>(t.far-t.near)**2))&&(el.copy(r).invert(),ei.copy(t.ray).applyMatrix4(el),!(n.boundingBox!==null&&ei.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ei)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const f=d[g],p=a[f.materialIndex],b=Math.max(f.start,m.start),w=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let M=b,N=w;M<N;M+=3){const T=o.getX(M),A=o.getX(M+1),P=o.getX(M+2);s=Hs(this,p,t,n,c,u,h,T,A,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=f.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(o.count,m.start+m.count);for(let f=g,p=_;f<p;f+=3){const b=o.getX(f),w=o.getX(f+1),M=o.getX(f+2);s=Hs(this,a,t,n,c,u,h,b,w,M),s&&(s.faceIndex=Math.floor(f/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const f=d[g],p=a[f.materialIndex],b=Math.max(f.start,m.start),w=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let M=b,N=w;M<N;M+=3){const T=M,A=M+1,P=M+2;s=Hs(this,p,t,n,c,u,h,T,A,P),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=f.materialIndex,e.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(l.count,m.start+m.count);for(let f=g,p=_;f<p;f+=3){const b=f,w=f+1,M=f+2;s=Hs(this,a,t,n,c,u,h,b,w,M),s&&(s.faceIndex=Math.floor(f/3),e.push(s))}}}}function Ou(i,t,e,n,s,r,a,o){let l;if(t.side===Ue?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===Jn,o),l===null)return null;Gs.copy(o),Gs.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Gs);return c<e.near||c>e.far?null:{distance:c,point:Gs.clone(),object:i}}function Hs(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Os),i.getVertexPosition(l,Bs),i.getVertexPosition(c,ks);const u=Ou(i,t,e,n,Os,Bs,ks,il);if(u){const h=new C;en.getBarycoord(il,Os,Bs,ks,h),s&&(u.uv=en.getInterpolatedAttribute(s,o,l,c,h,new ut)),r&&(u.uv1=en.getInterpolatedAttribute(r,o,l,c,h,new ut)),a&&(u.normal=en.getInterpolatedAttribute(a,o,l,c,h,new C),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new C,materialIndex:0};en.getNormal(Os,Bs,ks,d.normal),u.face=d,u.barycoord=h}return u}class Be extends Pe{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,m=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(u,3)),this.setAttribute("uv",new oe(h,2));function g(_,f,p,b,w,M,N,T,A,P,S){const x=M/A,R=N/P,z=M/2,k=N/2,V=T/2,K=A+1,W=P+1;let tt=0,H=0;const rt=new C;for(let dt=0;dt<W;dt++){const St=dt*R-k;for(let zt=0;zt<K;zt++){const ee=zt*x-z;rt[_]=ee*b,rt[f]=St*w,rt[p]=V,c.push(rt.x,rt.y,rt.z),rt[_]=0,rt[f]=0,rt[p]=T>0?1:-1,u.push(rt.x,rt.y,rt.z),h.push(zt/A),h.push(1-dt/P),tt+=1}}for(let dt=0;dt<P;dt++)for(let St=0;St<A;St++){const zt=d+St+K*dt,ee=d+St+K*(dt+1),Y=d+(St+1)+K*(dt+1),et=d+(St+1)+K*dt;l.push(zt,ee,et),l.push(ee,Y,et),H+=6}o.addGroup(m,H,S),m+=H,d+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Be(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Yi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ae(i){const t={};for(let e=0;e<i.length;e++){const n=Yi(i[e]);for(const s in n)t[s]=n[s]}return t}function Bu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ec(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const ku={clone:Yi,merge:Ae};var zu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kn extends gi{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zu,this.fragmentShader=Gu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Yi(t.uniforms),this.uniformsGroups=Bu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Tc extends de{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new te,this.projectionMatrix=new te,this.projectionMatrixInverse=new te,this.coordinateSystem=Tn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const On=new C,sl=new ut,rl=new ut;class ke extends Tc{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ms*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ms*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){On.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(On.x,On.y).multiplyScalar(-t/On.z),On.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(On.x,On.y).multiplyScalar(-t/On.z)}getViewSize(t,e){return this.getViewBounds(t,sl,rl),e.subVectors(rl,sl)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ds*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Li=-90,Ii=1;class Hu extends de{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ke(Li,Ii,t,e);s.layers=this.layers,this.add(s);const r=new ke(Li,Ii,t,e);r.layers=this.layers,this.add(r);const a=new ke(Li,Ii,t,e);a.layers=this.layers,this.add(a);const o=new ke(Li,Ii,t,e);o.layers=this.layers,this.add(o);const l=new ke(Li,Ii,t,e);l.layers=this.layers,this.add(l);const c=new ke(Li,Ii,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ur)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(h,d,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ac extends Ee{constructor(t,e,n,s,r,a,o,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:Vi,super(t,e,n,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Vu extends pi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ac(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:hn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Be(5,5,5),r=new Kn({name:"CubemapFromEquirect",uniforms:Yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ue,blending:qn});r.uniforms.tEquirect.value=e;const a=new nt(s,r),o=e.minFilter;return e.minFilter===ui&&(e.minFilter=hn),new Hu(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}const qr=new C,Wu=new C,Xu=new Nt;class ai{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=qr.subVectors(n,e).cross(Wu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(qr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Xu.getNormalMatrix(t),s=this.coplanarPoint(qr).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ni=new Zi,Vs=new C;class ao{constructor(t=new ai,e=new ai,n=new ai,s=new ai,r=new ai,a=new ai){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Tn){const n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],c=s[4],u=s[5],h=s[6],d=s[7],m=s[8],g=s[9],_=s[10],f=s[11],p=s[12],b=s[13],w=s[14],M=s[15];if(n[0].setComponents(l-r,d-c,f-m,M-p).normalize(),n[1].setComponents(l+r,d+c,f+m,M+p).normalize(),n[2].setComponents(l+a,d+u,f+g,M+b).normalize(),n[3].setComponents(l-a,d-u,f-g,M-b).normalize(),n[4].setComponents(l-o,d-h,f-_,M-w).normalize(),e===Tn)n[5].setComponents(l+o,d+h,f+_,M+w).normalize();else if(e===ur)n[5].setComponents(o,h,_,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ni.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ni.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ni)}intersectsSprite(t){return ni.center.set(0,0,0),ni.radius=.7071067811865476,ni.applyMatrix4(t.matrixWorld),this.intersectsSphere(ni)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Vs.x=s.normal.x>0?t.max.x:t.min.x,Vs.y=s.normal.y>0?t.max.y:t.min.y,Vs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Vs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Cc(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function qu(i){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const u=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,u);else{h.sort((m,g)=>m.start-g.start);let d=0;for(let m=1;m<h.length;m++){const g=h[d],_=h[m];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,h[d]=_)}h.length=d+1;for(let m=0,g=h.length;m<g;m++){const _=h[m];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}class dn extends Pe{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,u=l+1,h=t/o,d=e/l,m=[],g=[],_=[],f=[];for(let p=0;p<u;p++){const b=p*d-a;for(let w=0;w<c;w++){const M=w*h-r;g.push(M,-b,0),_.push(0,0,1),f.push(w/o),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<o;b++){const w=b+c*p,M=b+c*(p+1),N=b+1+c*(p+1),T=b+1+c*p;m.push(w,M,T),m.push(M,N,T)}this.setIndex(m),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new dn(t.width,t.height,t.widthSegments,t.heightSegments)}}var Yu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$u=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Ju=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ku=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ju=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,td=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ed=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,nd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,id=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,sd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,ad=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,od=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ld=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,cd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,hd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ud=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,fd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,md=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,gd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_d=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,vd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,xd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Md=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Sd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,bd="gl_FragColor = linearToOutputTexel( gl_FragColor );",wd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ed=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Td=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ad=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Cd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Rd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Pd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ld=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Id=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Dd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ud=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Nd=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Fd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Od=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Bd=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kd=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,zd=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Gd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Wd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Xd=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,qd=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Yd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,$d=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Qd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ef=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,nf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,af=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,of=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,hf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,df=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ff=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,gf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_f=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,xf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,yf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Sf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,bf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ef=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Tf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Af=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Cf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Pf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,If=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Df=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Uf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Nf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ff=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Of=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Bf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,kf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Gf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Hf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Vf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Wf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,qf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Yf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$f=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,tp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,ep=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,np=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ip=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,sp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,rp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ap=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,op=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,lp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,hp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,up=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,pp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,mp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_p=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,vp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Sp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ep=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Tp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ot={alphahash_fragment:Yu,alphahash_pars_fragment:$u,alphamap_fragment:Ju,alphamap_pars_fragment:Ku,alphatest_fragment:Zu,alphatest_pars_fragment:ju,aomap_fragment:Qu,aomap_pars_fragment:td,batching_pars_vertex:ed,batching_vertex:nd,begin_vertex:id,beginnormal_vertex:sd,bsdfs:rd,iridescence_fragment:ad,bumpmap_pars_fragment:od,clipping_planes_fragment:ld,clipping_planes_pars_fragment:cd,clipping_planes_pars_vertex:hd,clipping_planes_vertex:ud,color_fragment:dd,color_pars_fragment:fd,color_pars_vertex:pd,color_vertex:md,common:gd,cube_uv_reflection_fragment:_d,defaultnormal_vertex:vd,displacementmap_pars_vertex:xd,displacementmap_vertex:Md,emissivemap_fragment:yd,emissivemap_pars_fragment:Sd,colorspace_fragment:bd,colorspace_pars_fragment:wd,envmap_fragment:Ed,envmap_common_pars_fragment:Td,envmap_pars_fragment:Ad,envmap_pars_vertex:Cd,envmap_physical_pars_fragment:kd,envmap_vertex:Rd,fog_vertex:Pd,fog_pars_vertex:Ld,fog_fragment:Id,fog_pars_fragment:Dd,gradientmap_pars_fragment:Ud,lightmap_pars_fragment:Nd,lights_lambert_fragment:Fd,lights_lambert_pars_fragment:Od,lights_pars_begin:Bd,lights_toon_fragment:zd,lights_toon_pars_fragment:Gd,lights_phong_fragment:Hd,lights_phong_pars_fragment:Vd,lights_physical_fragment:Wd,lights_physical_pars_fragment:Xd,lights_fragment_begin:qd,lights_fragment_maps:Yd,lights_fragment_end:$d,logdepthbuf_fragment:Jd,logdepthbuf_pars_fragment:Kd,logdepthbuf_pars_vertex:Zd,logdepthbuf_vertex:jd,map_fragment:Qd,map_pars_fragment:tf,map_particle_fragment:ef,map_particle_pars_fragment:nf,metalnessmap_fragment:sf,metalnessmap_pars_fragment:rf,morphinstance_vertex:af,morphcolor_vertex:of,morphnormal_vertex:lf,morphtarget_pars_vertex:cf,morphtarget_vertex:hf,normal_fragment_begin:uf,normal_fragment_maps:df,normal_pars_fragment:ff,normal_pars_vertex:pf,normal_vertex:mf,normalmap_pars_fragment:gf,clearcoat_normal_fragment_begin:_f,clearcoat_normal_fragment_maps:vf,clearcoat_pars_fragment:xf,iridescence_pars_fragment:Mf,opaque_fragment:yf,packing:Sf,premultiplied_alpha_fragment:bf,project_vertex:wf,dithering_fragment:Ef,dithering_pars_fragment:Tf,roughnessmap_fragment:Af,roughnessmap_pars_fragment:Cf,shadowmap_pars_fragment:Rf,shadowmap_pars_vertex:Pf,shadowmap_vertex:Lf,shadowmask_pars_fragment:If,skinbase_vertex:Df,skinning_pars_vertex:Uf,skinning_vertex:Nf,skinnormal_vertex:Ff,specularmap_fragment:Of,specularmap_pars_fragment:Bf,tonemapping_fragment:kf,tonemapping_pars_fragment:zf,transmission_fragment:Gf,transmission_pars_fragment:Hf,uv_pars_fragment:Vf,uv_pars_vertex:Wf,uv_vertex:Xf,worldpos_vertex:qf,background_vert:Yf,background_frag:$f,backgroundCube_vert:Jf,backgroundCube_frag:Kf,cube_vert:Zf,cube_frag:jf,depth_vert:Qf,depth_frag:tp,distanceRGBA_vert:ep,distanceRGBA_frag:np,equirect_vert:ip,equirect_frag:sp,linedashed_vert:rp,linedashed_frag:ap,meshbasic_vert:op,meshbasic_frag:lp,meshlambert_vert:cp,meshlambert_frag:hp,meshmatcap_vert:up,meshmatcap_frag:dp,meshnormal_vert:fp,meshnormal_frag:pp,meshphong_vert:mp,meshphong_frag:gp,meshphysical_vert:_p,meshphysical_frag:vp,meshtoon_vert:xp,meshtoon_frag:Mp,points_vert:yp,points_frag:Sp,shadow_vert:bp,shadow_frag:wp,sprite_vert:Ep,sprite_frag:Tp},it={common:{diffuse:{value:new Bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new ut(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new Bt(16777215)},opacity:{value:1},center:{value:new ut(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},ln={basic:{uniforms:Ae([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.fog]),vertexShader:Ot.meshbasic_vert,fragmentShader:Ot.meshbasic_frag},lambert:{uniforms:Ae([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Ot.meshlambert_vert,fragmentShader:Ot.meshlambert_frag},phong:{uniforms:Ae([it.common,it.specularmap,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.fog,it.lights,{emissive:{value:new Bt(0)},specular:{value:new Bt(1118481)},shininess:{value:30}}]),vertexShader:Ot.meshphong_vert,fragmentShader:Ot.meshphong_frag},standard:{uniforms:Ae([it.common,it.envmap,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.roughnessmap,it.metalnessmap,it.fog,it.lights,{emissive:{value:new Bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag},toon:{uniforms:Ae([it.common,it.aomap,it.lightmap,it.emissivemap,it.bumpmap,it.normalmap,it.displacementmap,it.gradientmap,it.fog,it.lights,{emissive:{value:new Bt(0)}}]),vertexShader:Ot.meshtoon_vert,fragmentShader:Ot.meshtoon_frag},matcap:{uniforms:Ae([it.common,it.bumpmap,it.normalmap,it.displacementmap,it.fog,{matcap:{value:null}}]),vertexShader:Ot.meshmatcap_vert,fragmentShader:Ot.meshmatcap_frag},points:{uniforms:Ae([it.points,it.fog]),vertexShader:Ot.points_vert,fragmentShader:Ot.points_frag},dashed:{uniforms:Ae([it.common,it.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ot.linedashed_vert,fragmentShader:Ot.linedashed_frag},depth:{uniforms:Ae([it.common,it.displacementmap]),vertexShader:Ot.depth_vert,fragmentShader:Ot.depth_frag},normal:{uniforms:Ae([it.common,it.bumpmap,it.normalmap,it.displacementmap,{opacity:{value:1}}]),vertexShader:Ot.meshnormal_vert,fragmentShader:Ot.meshnormal_frag},sprite:{uniforms:Ae([it.sprite,it.fog]),vertexShader:Ot.sprite_vert,fragmentShader:Ot.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ot.background_vert,fragmentShader:Ot.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Ot.backgroundCube_vert,fragmentShader:Ot.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ot.cube_vert,fragmentShader:Ot.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ot.equirect_vert,fragmentShader:Ot.equirect_frag},distanceRGBA:{uniforms:Ae([it.common,it.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ot.distanceRGBA_vert,fragmentShader:Ot.distanceRGBA_frag},shadow:{uniforms:Ae([it.lights,it.fog,{color:{value:new Bt(0)},opacity:{value:1}}]),vertexShader:Ot.shadow_vert,fragmentShader:Ot.shadow_frag}};ln.physical={uniforms:Ae([ln.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new ut(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new Bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new ut},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new Bt(0)},specularColor:{value:new Bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new ut},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Ot.meshphysical_vert,fragmentShader:Ot.meshphysical_frag};const Ws={r:0,b:0,g:0},ii=new sn,Ap=new te;function Cp(i,t,e,n,s,r,a){const o=new Bt(0);let l=r===!0?0:1,c,u,h=null,d=0,m=null;function g(b){let w=b.isScene===!0?b.background:null;return w&&w.isTexture&&(w=(b.backgroundBlurriness>0?e:t).get(w)),w}function _(b){let w=!1;const M=g(b);M===null?p(o,l):M&&M.isColor&&(p(M,1),w=!0);const N=i.xr.getEnvironmentBlendMode();N==="additive"?n.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function f(b,w){const M=g(w);M&&(M.isCubeTexture||M.mapping===vr)?(u===void 0&&(u=new nt(new Be(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:Yi(ln.backgroundCube.uniforms),vertexShader:ln.backgroundCube.vertexShader,fragmentShader:ln.backgroundCube.fragmentShader,side:Ue,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(N,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),ii.copy(w.backgroundRotation),ii.x*=-1,ii.y*=-1,ii.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(ii.y*=-1,ii.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ap.makeRotationFromEuler(ii)),u.material.toneMapped=Yt.getTransfer(M.colorSpace)!==jt,(h!==M||d!==M.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,h=M,d=M.version,m=i.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(c===void 0&&(c=new nt(new dn(2,2),new Kn({name:"BackgroundMaterial",uniforms:Yi(ln.background.uniforms),vertexShader:ln.background.vertexShader,fragmentShader:ln.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=M,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(M.colorSpace)!==jt,M.matrixAutoUpdate===!0&&M.updateMatrix(),c.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||d!==M.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,h=M,d=M.version,m=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function p(b,w){b.getRGB(Ws,Ec(i)),n.buffers.color.setClear(Ws.r,Ws.g,Ws.b,w,a)}return{getClearColor:function(){return o},setClearColor:function(b,w=1){o.set(b),l=w,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,p(o,l)},render:_,addToRenderList:f}}function Rp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(x,R,z,k,V){let K=!1;const W=h(k,z,R);r!==W&&(r=W,c(r.object)),K=m(x,k,z,V),K&&g(x,k,z,V),V!==null&&t.update(V,i.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,M(x,R,z,k),V!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function l(){return i.createVertexArray()}function c(x){return i.bindVertexArray(x)}function u(x){return i.deleteVertexArray(x)}function h(x,R,z){const k=z.wireframe===!0;let V=n[x.id];V===void 0&&(V={},n[x.id]=V);let K=V[R.id];K===void 0&&(K={},V[R.id]=K);let W=K[k];return W===void 0&&(W=d(l()),K[k]=W),W}function d(x){const R=[],z=[],k=[];for(let V=0;V<e;V++)R[V]=0,z[V]=0,k[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:z,attributeDivisors:k,object:x,attributes:{},index:null}}function m(x,R,z,k){const V=r.attributes,K=R.attributes;let W=0;const tt=z.getAttributes();for(const H in tt)if(tt[H].location>=0){const dt=V[H];let St=K[H];if(St===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(St=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(St=x.instanceColor)),dt===void 0||dt.attribute!==St||St&&dt.data!==St.data)return!0;W++}return r.attributesNum!==W||r.index!==k}function g(x,R,z,k){const V={},K=R.attributes;let W=0;const tt=z.getAttributes();for(const H in tt)if(tt[H].location>=0){let dt=K[H];dt===void 0&&(H==="instanceMatrix"&&x.instanceMatrix&&(dt=x.instanceMatrix),H==="instanceColor"&&x.instanceColor&&(dt=x.instanceColor));const St={};St.attribute=dt,dt&&dt.data&&(St.data=dt.data),V[H]=St,W++}r.attributes=V,r.attributesNum=W,r.index=k}function _(){const x=r.newAttributes;for(let R=0,z=x.length;R<z;R++)x[R]=0}function f(x){p(x,0)}function p(x,R){const z=r.newAttributes,k=r.enabledAttributes,V=r.attributeDivisors;z[x]=1,k[x]===0&&(i.enableVertexAttribArray(x),k[x]=1),V[x]!==R&&(i.vertexAttribDivisor(x,R),V[x]=R)}function b(){const x=r.newAttributes,R=r.enabledAttributes;for(let z=0,k=R.length;z<k;z++)R[z]!==x[z]&&(i.disableVertexAttribArray(z),R[z]=0)}function w(x,R,z,k,V,K,W){W===!0?i.vertexAttribIPointer(x,R,z,V,K):i.vertexAttribPointer(x,R,z,k,V,K)}function M(x,R,z,k){_();const V=k.attributes,K=z.getAttributes(),W=R.defaultAttributeValues;for(const tt in K){const H=K[tt];if(H.location>=0){let rt=V[tt];if(rt===void 0&&(tt==="instanceMatrix"&&x.instanceMatrix&&(rt=x.instanceMatrix),tt==="instanceColor"&&x.instanceColor&&(rt=x.instanceColor)),rt!==void 0){const dt=rt.normalized,St=rt.itemSize,zt=t.get(rt);if(zt===void 0)continue;const ee=zt.buffer,Y=zt.type,et=zt.bytesPerElement,xt=Y===i.INT||Y===i.UNSIGNED_INT||rt.gpuType===Za;if(rt.isInterleavedBufferAttribute){const at=rt.data,Tt=at.stride,It=rt.offset;if(at.isInstancedInterleavedBuffer){for(let Gt=0;Gt<H.locationSize;Gt++)p(H.location+Gt,at.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Gt=0;Gt<H.locationSize;Gt++)f(H.location+Gt);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let Gt=0;Gt<H.locationSize;Gt++)w(H.location+Gt,St/H.locationSize,Y,dt,Tt*et,(It+St/H.locationSize*Gt)*et,xt)}else{if(rt.isInstancedBufferAttribute){for(let at=0;at<H.locationSize;at++)p(H.location+at,rt.meshPerAttribute);x.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let at=0;at<H.locationSize;at++)f(H.location+at);i.bindBuffer(i.ARRAY_BUFFER,ee);for(let at=0;at<H.locationSize;at++)w(H.location+at,St/H.locationSize,Y,dt,St*et,St/H.locationSize*at*et,xt)}}else if(W!==void 0){const dt=W[tt];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(H.location,dt);break;case 3:i.vertexAttrib3fv(H.location,dt);break;case 4:i.vertexAttrib4fv(H.location,dt);break;default:i.vertexAttrib1fv(H.location,dt)}}}}b()}function N(){P();for(const x in n){const R=n[x];for(const z in R){const k=R[z];for(const V in k)u(k[V].object),delete k[V];delete R[z]}delete n[x]}}function T(x){if(n[x.id]===void 0)return;const R=n[x.id];for(const z in R){const k=R[z];for(const V in k)u(k[V].object),delete k[V];delete R[z]}delete n[x.id]}function A(x){for(const R in n){const z=n[R];if(z[x.id]===void 0)continue;const k=z[x.id];for(const V in k)u(k[V].object),delete k[V];delete z[x.id]}}function P(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:P,resetDefaultState:S,dispose:N,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:f,disableUnusedAttributes:b}}function Pp(i,t,e){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),e.update(u,n,1)}function a(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),e.update(u,n,h))}function o(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,u,0,h);let m=0;for(let g=0;g<h;g++)m+=u[g];e.update(m,n,1)}function l(c,u,h,d){if(h===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{m.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Lp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==nn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const P=A===ys&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Cn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==un&&!P)}function l(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),f=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),b=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),N=g>0,T=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:m,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:b,maxVaryings:w,maxFragmentUniforms:M,vertexTextures:N,maxSamples:T}}function Ip(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new ai,o=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const m=h.length!==0||d||n!==0||s;return s=d,n=h.length,m},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,m){const g=h.clippingPlanes,_=h.clipIntersection,f=h.clipShadows,p=i.get(h);if(!s||g===null||g.length===0||r&&!f)r?u(null):c();else{const b=r?0:n,w=b*4;let M=p.clippingState||null;l.value=M,M=u(g,d,w,m);for(let N=0;N!==w;++N)M[N]=e[N];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(h,d,m,g){const _=h!==null?h.length:0;let f=null;if(_!==0){if(f=l.value,g!==!0||f===null){const p=m+_*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(f===null||f.length<p)&&(f=new Float32Array(p));for(let w=0,M=m;w!==_;++w,M+=4)a.copy(h[w]).applyMatrix4(b,o),a.normal.toArray(f,M),f[M+3]=a.constant}l.value=f,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,f}}function Dp(i){let t=new WeakMap;function e(a,o){return o===ga?a.mapping=Vi:o===_a&&(a.mapping=Wi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===ga||o===_a)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Vu(l.height);return c.fromEquirectangularTexture(i,a),t.set(a,c),a.addEventListener("dispose",s),e(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Rc extends Tc{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Fi=4,al=[.125,.215,.35,.446,.526,.582],ci=20,Yr=new Rc,ol=new Bt;let $r=null,Jr=0,Kr=0,Zr=!1;const oi=(1+Math.sqrt(5))/2,Di=1/oi,ll=[new C(-oi,Di,0),new C(oi,Di,0),new C(-Di,0,oi),new C(Di,0,oi),new C(0,oi,-Di),new C(0,oi,Di),new C(-1,1,-1),new C(1,1,-1),new C(-1,1,1),new C(1,1,1)];class cl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){$r=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),Zr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=dl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ul(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget($r,Jr,Kr),this._renderer.xr.enabled=Zr,t.scissorTest=!1,Xs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Vi||t.mapping===Wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),$r=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),Zr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:hn,minFilter:hn,generateMipmaps:!1,type:ys,format:nn,colorSpace:$i,depthBuffer:!1},s=hl(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hl(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Up(r)),this._blurMaterial=Np(r,t,e)}return s}_compileMaterial(t){const e=new nt(this._lodPlanes[0],t);this._renderer.compile(e,Yr)}_sceneToCubeUV(t,e,n,s){const o=new ke(90,1,e,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(ol),u.toneMapping=Yn,u.autoClear=!1;const m=new Re({name:"PMREM.Background",side:Ue,depthWrite:!1,depthTest:!1}),g=new nt(new Be,m);let _=!1;const f=t.background;f?f.isColor&&(m.color.copy(f),t.background=null,_=!0):(m.color.copy(ol),_=!0);for(let p=0;p<6;p++){const b=p%3;b===0?(o.up.set(0,l[p],0),o.lookAt(c[p],0,0)):b===1?(o.up.set(0,0,l[p]),o.lookAt(0,c[p],0)):(o.up.set(0,l[p],0),o.lookAt(0,0,c[p]));const w=this._cubeSize;Xs(s,b*w,p>2?w:0,w,w),u.setRenderTarget(s),_&&u.render(g,o),u.render(t,o)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=f}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Vi||t.mapping===Wi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=dl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ul());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new nt(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Xs(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Yr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=ll[(s-r-1)%ll.length];this._blur(t,r-1,r,a,o)}e.autoClear=n}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new nt(this._lodPlanes[s],c),d=c.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ci-1),_=r/g,f=isFinite(r)?1+Math.floor(u*_):ci;f>ci&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ci}`);const p=[];let b=0;for(let A=0;A<ci;++A){const P=A/_,S=Math.exp(-P*P/2);p.push(S),A===0?b+=S:A<f&&(b+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/b;d.envMap.value=t.texture,d.samples.value=f,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:w}=this;d.dTheta.value=g,d.mipInt.value=w-n;const M=this._sizeLods[s],N=3*M*(s>w-Fi?s-w+Fi:0),T=4*(this._cubeSize-M);Xs(e,N,T,3*M,2*M),l.setRenderTarget(e),l.render(h,Yr)}}function Up(i){const t=[],e=[],n=[];let s=i;const r=i-Fi+1+al.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Fi?l=al[a-i+Fi-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,g=6,_=3,f=2,p=1,b=new Float32Array(_*g*m),w=new Float32Array(f*g*m),M=new Float32Array(p*g*m);for(let T=0;T<m;T++){const A=T%3*2/3-1,P=T>2?0:-1,S=[A,P,0,A+2/3,P,0,A+2/3,P+1,0,A,P,0,A+2/3,P+1,0,A,P+1,0];b.set(S,_*g*T),w.set(d,f*g*T);const x=[T,T,T,T,T,T];M.set(x,p*g*T)}const N=new Pe;N.setAttribute("position",new $e(b,_)),N.setAttribute("uv",new $e(w,f)),N.setAttribute("faceIndex",new $e(M,p)),t.push(N),s>Fi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function hl(i,t,e){const n=new pi(i,t,e);return n.texture.mapping=vr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Xs(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Np(i,t,e){const n=new Float32Array(ci),s=new C(0,1,0);return new Kn({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function ul(){return new Kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function dl(){return new Kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:oo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qn,depthTest:!1,depthWrite:!1})}function oo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Fp(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===ga||l===_a,u=l===Vi||l===Wi;if(c||u){let h=t.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new cl(i)),h=c?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&s(m)?(e===null&&(e=new cl(i)),h=c?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Op(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&hs("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Bp(i,t,e,n){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let f=0,p=_.length;f<p;f++)t.remove(_[f])}d.removeEventListener("dispose",a),delete s[d.id];const m=r.get(d);m&&(t.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const m=h.morphAttributes;for(const g in m){const _=m[g];for(let f=0,p=_.length;f<p;f++)t.update(_[f],i.ARRAY_BUFFER)}}function c(h){const d=[],m=h.index,g=h.attributes.position;let _=0;if(m!==null){const b=m.array;_=m.version;for(let w=0,M=b.length;w<M;w+=3){const N=b[w+0],T=b[w+1],A=b[w+2];d.push(N,T,T,A,A,N)}}else if(g!==void 0){const b=g.array;_=g.version;for(let w=0,M=b.length/3-1;w<M;w+=3){const N=w+0,T=w+1,A=w+2;d.push(N,T,T,A,A,N)}}else return;const f=new(_c(d)?wc:bc)(d,1);f.version=_;const p=r.get(h);p&&t.remove(p),r.set(h,f)}function u(h){const d=r.get(h);if(d){const m=h.index;m!==null&&d.version<m.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function kp(i,t,e){let n;function s(d){n=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,m){i.drawElements(n,m,r,d*a),e.update(m,n,1)}function c(d,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,d*a,g),e.update(m,n,g))}function u(d,m,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,m,0,r,d,0,g);let f=0;for(let p=0;p<g;p++)f+=m[p];e.update(f,n,1)}function h(d,m,g,_){if(g===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<d.length;p++)c(d[p]/a,m[p],_[p]);else{f.multiDrawElementsInstancedWEBGL(n,m,0,r,d,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=m[b]*_[b];e.update(p,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function zp(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Gp(i,t,e){const n=new WeakMap,s=new Qt;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(o);if(d===void 0||d.count!==h){let S=function(){A.dispose(),n.delete(o),o.removeEventListener("dispose",S)};d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let w=0;m===!0&&(w=1),g===!0&&(w=2),_===!0&&(w=3);let M=o.attributes.position.count*w,N=1;M>t.maxTextureSize&&(N=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const T=new Float32Array(M*N*4*h),A=new xc(T,M,N,h);A.type=un,A.needsUpdate=!0;const P=w*4;for(let x=0;x<h;x++){const R=f[x],z=p[x],k=b[x],V=M*N*4*x;for(let K=0;K<R.count;K++){const W=K*P;m===!0&&(s.fromBufferAttribute(R,K),T[V+W+0]=s.x,T[V+W+1]=s.y,T[V+W+2]=s.z,T[V+W+3]=0),g===!0&&(s.fromBufferAttribute(z,K),T[V+W+4]=s.x,T[V+W+5]=s.y,T[V+W+6]=s.z,T[V+W+7]=0),_===!0&&(s.fromBufferAttribute(k,K),T[V+W+8]=s.x,T[V+W+9]=s.y,T[V+W+10]=s.z,T[V+W+11]=k.itemSize===4?s.w:1)}}d={count:h,texture:A,size:new ut(M,N)},n.set(o,d),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let m=0;for(let _=0;_<c.length;_++)m+=c[_];const g=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Hp(i,t,e,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=t.get(l,u);if(s.get(h)!==c&&(t.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:r,dispose:a}}class Pc extends Ee{constructor(t,e,n,s,r,a,o,l,c,u=Bi){if(u!==Bi&&u!==qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Bi&&(n=fi),n===void 0&&u===qi&&(n=Xi),super(null,s,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:ze,this.minFilter=l!==void 0?l:ze,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Lc=new Ee,fl=new Pc(1,1),Ic=new xc,Dc=new Au,Uc=new Ac,pl=[],ml=[],gl=new Float32Array(16),_l=new Float32Array(9),vl=new Float32Array(4);function ji(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=pl[s];if(r===void 0&&(r=new Float32Array(s),pl[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function ge(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function _e(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Mr(i,t){let e=ml[t];e===void 0&&(e=new Int32Array(t),ml[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Vp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Wp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2fv(this.addr,t),_e(e,t)}}function Xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ge(e,t))return;i.uniform3fv(this.addr,t),_e(e,t)}}function qp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4fv(this.addr,t),_e(e,t)}}function Yp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;vl.set(n),i.uniformMatrix2fv(this.addr,!1,vl),_e(e,n)}}function $p(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;_l.set(n),i.uniformMatrix3fv(this.addr,!1,_l),_e(e,n)}}function Jp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ge(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),_e(e,t)}else{if(ge(e,n))return;gl.set(n),i.uniformMatrix4fv(this.addr,!1,gl),_e(e,n)}}function Kp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Zp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2iv(this.addr,t),_e(e,t)}}function jp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ge(e,t))return;i.uniform3iv(this.addr,t),_e(e,t)}}function Qp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4iv(this.addr,t),_e(e,t)}}function tm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function em(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ge(e,t))return;i.uniform2uiv(this.addr,t),_e(e,t)}}function nm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ge(e,t))return;i.uniform3uiv(this.addr,t),_e(e,t)}}function im(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ge(e,t))return;i.uniform4uiv(this.addr,t),_e(e,t)}}function sm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(fl.compareFunction=gc,r=fl):r=Lc,e.setTexture2D(t||r,s)}function rm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Dc,s)}function am(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Uc,s)}function om(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Ic,s)}function lm(i){switch(i){case 5126:return Vp;case 35664:return Wp;case 35665:return Xp;case 35666:return qp;case 35674:return Yp;case 35675:return $p;case 35676:return Jp;case 5124:case 35670:return Kp;case 35667:case 35671:return Zp;case 35668:case 35672:return jp;case 35669:case 35673:return Qp;case 5125:return tm;case 36294:return em;case 36295:return nm;case 36296:return im;case 35678:case 36198:case 36298:case 36306:case 35682:return sm;case 35679:case 36299:case 36307:return rm;case 35680:case 36300:case 36308:case 36293:return am;case 36289:case 36303:case 36311:case 36292:return om}}function cm(i,t){i.uniform1fv(this.addr,t)}function hm(i,t){const e=ji(t,this.size,2);i.uniform2fv(this.addr,e)}function um(i,t){const e=ji(t,this.size,3);i.uniform3fv(this.addr,e)}function dm(i,t){const e=ji(t,this.size,4);i.uniform4fv(this.addr,e)}function fm(i,t){const e=ji(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function pm(i,t){const e=ji(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function mm(i,t){const e=ji(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function gm(i,t){i.uniform1iv(this.addr,t)}function _m(i,t){i.uniform2iv(this.addr,t)}function vm(i,t){i.uniform3iv(this.addr,t)}function xm(i,t){i.uniform4iv(this.addr,t)}function Mm(i,t){i.uniform1uiv(this.addr,t)}function ym(i,t){i.uniform2uiv(this.addr,t)}function Sm(i,t){i.uniform3uiv(this.addr,t)}function bm(i,t){i.uniform4uiv(this.addr,t)}function wm(i,t,e){const n=this.cache,s=t.length,r=Mr(e,s);ge(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Lc,r[a])}function Em(i,t,e){const n=this.cache,s=t.length,r=Mr(e,s);ge(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Dc,r[a])}function Tm(i,t,e){const n=this.cache,s=t.length,r=Mr(e,s);ge(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Uc,r[a])}function Am(i,t,e){const n=this.cache,s=t.length,r=Mr(e,s);ge(n,r)||(i.uniform1iv(this.addr,r),_e(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Ic,r[a])}function Cm(i){switch(i){case 5126:return cm;case 35664:return hm;case 35665:return um;case 35666:return dm;case 35674:return fm;case 35675:return pm;case 35676:return mm;case 5124:case 35670:return gm;case 35667:case 35671:return _m;case 35668:case 35672:return vm;case 35669:case 35673:return xm;case 5125:return Mm;case 36294:return ym;case 36295:return Sm;case 36296:return bm;case 35678:case 36198:case 36298:case 36306:case 35682:return wm;case 35679:case 36299:case 36307:return Em;case 35680:case 36300:case 36308:case 36293:return Tm;case 36289:case 36303:case 36311:case 36292:return Am}}class Rm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=lm(e.type)}}class Pm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Cm(e.type)}}class Lm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function xl(i,t){i.seq.push(t),i.map[t.id]=t}function Im(i,t,e){const n=i.name,s=n.length;for(jr.lastIndex=0;;){const r=jr.exec(n),a=jr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){xl(e,c===void 0?new Rm(o,i,t):new Pm(o,i,t));break}else{let h=e.map[o];h===void 0&&(h=new Lm(o),xl(e,h)),e=h}}}class ar{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Im(r,a,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Ml(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Dm=37297;let Um=0;function Nm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const yl=new Nt;function Fm(i){Yt._getMatrix(yl,Yt.workingColorSpace,i);const t=`mat3( ${yl.elements.map(e=>e.toFixed(4))} )`;switch(Yt.getTransfer(i)){case xr:return[t,"LinearTransferOETF"];case jt:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Sl(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Nm(i.getShaderSource(t),a)}else return s}function Om(i,t){const e=Fm(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Bm(i,t){let e;switch(t){case kh:e="Linear";break;case zh:e="Reinhard";break;case Gh:e="Cineon";break;case Hh:e="ACESFilmic";break;case Wh:e="AgX";break;case Xh:e="Neutral";break;case Vh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const qs=new C;function km(){Yt.getLuminanceCoefficients(qs);const i=qs.x.toFixed(4),t=qs.y.toFixed(4),e=qs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function zm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(us).join(`
`)}function Gm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Hm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function us(i){return i!==""}function bl(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wl(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Vm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xa(i){return i.replace(Vm,Xm)}const Wm=new Map;function Xm(i,t){let e=Ot[t];if(e===void 0){const n=Wm.get(t);if(n!==void 0)e=Ot[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Xa(e)}const qm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function El(i){return i.replace(qm,Ym)}function Ym(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Tl(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function $m(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===rc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===vh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===bn&&(t="SHADOWMAP_TYPE_VSM"),t}function Jm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Vi:case Wi:t="ENVMAP_TYPE_CUBE";break;case vr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Km(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Wi:t="ENVMAP_MODE_REFRACTION";break}return t}function Zm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ka:t="ENVMAP_BLENDING_MULTIPLY";break;case Oh:t="ENVMAP_BLENDING_MIX";break;case Bh:t="ENVMAP_BLENDING_ADD";break}return t}function jm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Qm(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=$m(e),c=Jm(e),u=Km(e),h=Zm(e),d=jm(e),m=zm(e),g=Gm(r),_=s.createProgram();let f,p,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(us).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(us).join(`
`),p.length>0&&(p+=`
`)):(f=[Tl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(us).join(`
`),p=[Tl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Yn?"#define TONE_MAPPING":"",e.toneMapping!==Yn?Ot.tonemapping_pars_fragment:"",e.toneMapping!==Yn?Bm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ot.colorspace_pars_fragment,Om("linearToOutputTexel",e.outputColorSpace),km(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(us).join(`
`)),a=Xa(a),a=bl(a,e),a=wl(a,e),o=Xa(o),o=bl(o,e),o=wl(o,e),a=El(a),o=El(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",e.glslVersion===Bo?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=b+f+a,M=b+p+o,N=Ml(s,s.VERTEX_SHADER,w),T=Ml(s,s.FRAGMENT_SHADER,M);s.attachShader(_,N),s.attachShader(_,T),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(R){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(_).trim(),k=s.getShaderInfoLog(N).trim(),V=s.getShaderInfoLog(T).trim();let K=!0,W=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,N,T);else{const tt=Sl(s,N,"vertex"),H=Sl(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+z+`
`+tt+`
`+H)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(k===""||V==="")&&(W=!1);W&&(R.diagnostics={runnable:K,programLog:z,vertexShader:{log:k,prefix:f},fragmentShader:{log:V,prefix:p}})}s.deleteShader(N),s.deleteShader(T),P=new ar(s,_),S=Hm(s,_)}let P;this.getUniforms=function(){return P===void 0&&A(this),P};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let x=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=s.getProgramParameter(_,Dm)),x},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Um++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=N,this.fragmentShader=T,this}let t0=0;class e0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new n0(t),e.set(t,n)),n}}class n0{constructor(t){this.id=t0++,this.code=t,this.usedTimes=0}}function i0(i,t,e,n,s,r,a){const o=new yc,l=new e0,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return c.add(S),S===0?"uv":`uv${S}`}function f(S,x,R,z,k){const V=z.fog,K=k.geometry,W=S.isMeshStandardMaterial?z.environment:null,tt=(S.isMeshStandardMaterial?e:t).get(S.envMap||W),H=tt&&tt.mapping===vr?tt.image.height:null,rt=g[S.type];S.precision!==null&&(m=s.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const dt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,St=dt!==void 0?dt.length:0;let zt=0;K.morphAttributes.position!==void 0&&(zt=1),K.morphAttributes.normal!==void 0&&(zt=2),K.morphAttributes.color!==void 0&&(zt=3);let ee,Y,et,xt;if(rt){const Zt=ln[rt];ee=Zt.vertexShader,Y=Zt.fragmentShader}else ee=S.vertexShader,Y=S.fragmentShader,l.update(S),et=l.getVertexShaderID(S),xt=l.getFragmentShaderID(S);const at=i.getRenderTarget(),Tt=i.state.buffers.depth.getReversed(),It=k.isInstancedMesh===!0,Gt=k.isBatchedMesh===!0,le=!!S.map,Xt=!!S.matcap,fe=!!tt,U=!!S.aoMap,He=!!S.lightMap,Ht=!!S.bumpMap,Vt=!!S.normalMap,wt=!!S.displacementMap,se=!!S.emissiveMap,bt=!!S.metalnessMap,E=!!S.roughnessMap,v=S.anisotropy>0,F=S.clearcoat>0,$=S.dispersion>0,Z=S.iridescence>0,q=S.sheen>0,Mt=S.transmission>0,ot=v&&!!S.anisotropyMap,ft=F&&!!S.clearcoatMap,qt=F&&!!S.clearcoatNormalMap,j=F&&!!S.clearcoatRoughnessMap,pt=Z&&!!S.iridescenceMap,Et=Z&&!!S.iridescenceThicknessMap,Rt=q&&!!S.sheenColorMap,mt=q&&!!S.sheenRoughnessMap,Wt=!!S.specularMap,Ft=!!S.specularColorMap,ne=!!S.specularIntensityMap,L=Mt&&!!S.transmissionMap,st=Mt&&!!S.thicknessMap,G=!!S.gradientMap,J=!!S.alphaMap,ht=S.alphaTest>0,lt=!!S.alphaHash,Dt=!!S.extensions;let he=Yn;S.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(he=i.toneMapping);const ye={shaderID:rt,shaderType:S.type,shaderName:S.name,vertexShader:ee,fragmentShader:Y,defines:S.defines,customVertexShaderID:et,customFragmentShaderID:xt,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Gt,batchingColor:Gt&&k._colorsTexture!==null,instancing:It,instancingColor:It&&k.instanceColor!==null,instancingMorph:It&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:at===null?i.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:$i,alphaToCoverage:!!S.alphaToCoverage,map:le,matcap:Xt,envMap:fe,envMapMode:fe&&tt.mapping,envMapCubeUVHeight:H,aoMap:U,lightMap:He,bumpMap:Ht,normalMap:Vt,displacementMap:d&&wt,emissiveMap:se,normalMapObjectSpace:Vt&&S.normalMapType===Jh,normalMapTangentSpace:Vt&&S.normalMapType===so,metalnessMap:bt,roughnessMap:E,anisotropy:v,anisotropyMap:ot,clearcoat:F,clearcoatMap:ft,clearcoatNormalMap:qt,clearcoatRoughnessMap:j,dispersion:$,iridescence:Z,iridescenceMap:pt,iridescenceThicknessMap:Et,sheen:q,sheenColorMap:Rt,sheenRoughnessMap:mt,specularMap:Wt,specularColorMap:Ft,specularIntensityMap:ne,transmission:Mt,transmissionMap:L,thicknessMap:st,gradientMap:G,opaque:S.transparent===!1&&S.blending===Oi&&S.alphaToCoverage===!1,alphaMap:J,alphaTest:ht,alphaHash:lt,combine:S.combine,mapUv:le&&_(S.map.channel),aoMapUv:U&&_(S.aoMap.channel),lightMapUv:He&&_(S.lightMap.channel),bumpMapUv:Ht&&_(S.bumpMap.channel),normalMapUv:Vt&&_(S.normalMap.channel),displacementMapUv:wt&&_(S.displacementMap.channel),emissiveMapUv:se&&_(S.emissiveMap.channel),metalnessMapUv:bt&&_(S.metalnessMap.channel),roughnessMapUv:E&&_(S.roughnessMap.channel),anisotropyMapUv:ot&&_(S.anisotropyMap.channel),clearcoatMapUv:ft&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:qt&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:pt&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Et&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:Rt&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:mt&&_(S.sheenRoughnessMap.channel),specularMapUv:Wt&&_(S.specularMap.channel),specularColorMapUv:Ft&&_(S.specularColorMap.channel),specularIntensityMapUv:ne&&_(S.specularIntensityMap.channel),transmissionMapUv:L&&_(S.transmissionMap.channel),thicknessMapUv:st&&_(S.thicknessMap.channel),alphaMapUv:J&&_(S.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(Vt||v),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!K.attributes.uv&&(le||J),fog:!!V,useFog:S.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Tt,skinning:k.isSkinnedMesh===!0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:St,morphTextureStride:zt,numDirLights:x.directional.length,numPointLights:x.point.length,numSpotLights:x.spot.length,numSpotLightMaps:x.spotLightMap.length,numRectAreaLights:x.rectArea.length,numHemiLights:x.hemi.length,numDirLightShadows:x.directionalShadowMap.length,numPointLightShadows:x.pointShadowMap.length,numSpotLightShadows:x.spotShadowMap.length,numSpotLightShadowsWithMaps:x.numSpotLightShadowsWithMaps,numLightProbes:x.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&R.length>0,shadowMapType:i.shadowMap.type,toneMapping:he,decodeVideoTexture:le&&S.map.isVideoTexture===!0&&Yt.getTransfer(S.map.colorSpace)===jt,decodeVideoTextureEmissive:se&&S.emissiveMap.isVideoTexture===!0&&Yt.getTransfer(S.emissiveMap.colorSpace)===jt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===cn,flipSided:S.side===Ue,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Dt&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Dt&&S.extensions.multiDraw===!0||Gt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return ye.vertexUv1s=c.has(1),ye.vertexUv2s=c.has(2),ye.vertexUv3s=c.has(3),c.clear(),ye}function p(S){const x=[];if(S.shaderID?x.push(S.shaderID):(x.push(S.customVertexShaderID),x.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)x.push(R),x.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(b(x,S),w(x,S),x.push(i.outputColorSpace)),x.push(S.customProgramCacheKey),x.join()}function b(S,x){S.push(x.precision),S.push(x.outputColorSpace),S.push(x.envMapMode),S.push(x.envMapCubeUVHeight),S.push(x.mapUv),S.push(x.alphaMapUv),S.push(x.lightMapUv),S.push(x.aoMapUv),S.push(x.bumpMapUv),S.push(x.normalMapUv),S.push(x.displacementMapUv),S.push(x.emissiveMapUv),S.push(x.metalnessMapUv),S.push(x.roughnessMapUv),S.push(x.anisotropyMapUv),S.push(x.clearcoatMapUv),S.push(x.clearcoatNormalMapUv),S.push(x.clearcoatRoughnessMapUv),S.push(x.iridescenceMapUv),S.push(x.iridescenceThicknessMapUv),S.push(x.sheenColorMapUv),S.push(x.sheenRoughnessMapUv),S.push(x.specularMapUv),S.push(x.specularColorMapUv),S.push(x.specularIntensityMapUv),S.push(x.transmissionMapUv),S.push(x.thicknessMapUv),S.push(x.combine),S.push(x.fogExp2),S.push(x.sizeAttenuation),S.push(x.morphTargetsCount),S.push(x.morphAttributeCount),S.push(x.numDirLights),S.push(x.numPointLights),S.push(x.numSpotLights),S.push(x.numSpotLightMaps),S.push(x.numHemiLights),S.push(x.numRectAreaLights),S.push(x.numDirLightShadows),S.push(x.numPointLightShadows),S.push(x.numSpotLightShadows),S.push(x.numSpotLightShadowsWithMaps),S.push(x.numLightProbes),S.push(x.shadowMapType),S.push(x.toneMapping),S.push(x.numClippingPlanes),S.push(x.numClipIntersection),S.push(x.depthPacking)}function w(S,x){o.disableAll(),x.supportsVertexTextures&&o.enable(0),x.instancing&&o.enable(1),x.instancingColor&&o.enable(2),x.instancingMorph&&o.enable(3),x.matcap&&o.enable(4),x.envMap&&o.enable(5),x.normalMapObjectSpace&&o.enable(6),x.normalMapTangentSpace&&o.enable(7),x.clearcoat&&o.enable(8),x.iridescence&&o.enable(9),x.alphaTest&&o.enable(10),x.vertexColors&&o.enable(11),x.vertexAlphas&&o.enable(12),x.vertexUv1s&&o.enable(13),x.vertexUv2s&&o.enable(14),x.vertexUv3s&&o.enable(15),x.vertexTangents&&o.enable(16),x.anisotropy&&o.enable(17),x.alphaHash&&o.enable(18),x.batching&&o.enable(19),x.dispersion&&o.enable(20),x.batchingColor&&o.enable(21),S.push(o.mask),o.disableAll(),x.fog&&o.enable(0),x.useFog&&o.enable(1),x.flatShading&&o.enable(2),x.logarithmicDepthBuffer&&o.enable(3),x.reverseDepthBuffer&&o.enable(4),x.skinning&&o.enable(5),x.morphTargets&&o.enable(6),x.morphNormals&&o.enable(7),x.morphColors&&o.enable(8),x.premultipliedAlpha&&o.enable(9),x.shadowMapEnabled&&o.enable(10),x.doubleSided&&o.enable(11),x.flipSided&&o.enable(12),x.useDepthPacking&&o.enable(13),x.dithering&&o.enable(14),x.transmission&&o.enable(15),x.sheen&&o.enable(16),x.opaque&&o.enable(17),x.pointsUvs&&o.enable(18),x.decodeVideoTexture&&o.enable(19),x.decodeVideoTextureEmissive&&o.enable(20),x.alphaToCoverage&&o.enable(21),S.push(o.mask)}function M(S){const x=g[S.type];let R;if(x){const z=ln[x];R=ku.clone(z.uniforms)}else R=S.uniforms;return R}function N(S,x){let R;for(let z=0,k=u.length;z<k;z++){const V=u[z];if(V.cacheKey===x){R=V,++R.usedTimes;break}}return R===void 0&&(R=new Qm(i,x,S,r),u.push(R)),R}function T(S){if(--S.usedTimes===0){const x=u.indexOf(S);u[x]=u[u.length-1],u.pop(),S.destroy()}}function A(S){l.remove(S)}function P(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:M,acquireProgram:N,releaseProgram:T,releaseShaderCache:A,programs:u,dispose:P}}function s0(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function r0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Al(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Cl(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(h,d,m,g,_,f){let p=i[t];return p===void 0?(p={id:h.id,object:h,geometry:d,material:m,groupOrder:g,renderOrder:h.renderOrder,z:_,group:f},i[t]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=m,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=_,p.group=f),t++,p}function o(h,d,m,g,_,f){const p=a(h,d,m,g,_,f);m.transmission>0?n.push(p):m.transparent===!0?s.push(p):e.push(p)}function l(h,d,m,g,_,f){const p=a(h,d,m,g,_,f);m.transmission>0?n.unshift(p):m.transparent===!0?s.unshift(p):e.unshift(p)}function c(h,d){e.length>1&&e.sort(h||r0),n.length>1&&n.sort(d||Al),s.length>1&&s.sort(d||Al)}function u(){for(let h=t,d=i.length;h<d;h++){const m=i[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function a0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Cl,i.set(n,[a])):s>=r.length?(a=new Cl,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function o0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new C,color:new Bt};break;case"SpotLight":e={position:new C,direction:new C,color:new Bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new Bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new Bt,groundColor:new Bt};break;case"RectAreaLight":e={color:new Bt,position:new C,halfWidth:new C,halfHeight:new C};break}return i[t.id]=e,e}}}function l0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ut,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let c0=0;function h0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function u0(i){const t=new o0,e=l0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const s=new C,r=new te,a=new te;function o(c){let u=0,h=0,d=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let m=0,g=0,_=0,f=0,p=0,b=0,w=0,M=0,N=0,T=0,A=0;c.sort(h0);for(let S=0,x=c.length;S<x;S++){const R=c[S],z=R.color,k=R.intensity,V=R.distance,K=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)u+=z.r*k,h+=z.g*k,d+=z.b*k;else if(R.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(R.sh.coefficients[W],k);A++}else if(R.isDirectionalLight){const W=t.get(R);if(W.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const tt=R.shadow,H=e.get(R);H.shadowIntensity=tt.intensity,H.shadowBias=tt.bias,H.shadowNormalBias=tt.normalBias,H.shadowRadius=tt.radius,H.shadowMapSize=tt.mapSize,n.directionalShadow[m]=H,n.directionalShadowMap[m]=K,n.directionalShadowMatrix[m]=R.shadow.matrix,b++}n.directional[m]=W,m++}else if(R.isSpotLight){const W=t.get(R);W.position.setFromMatrixPosition(R.matrixWorld),W.color.copy(z).multiplyScalar(k),W.distance=V,W.coneCos=Math.cos(R.angle),W.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),W.decay=R.decay,n.spot[_]=W;const tt=R.shadow;if(R.map&&(n.spotLightMap[N]=R.map,N++,tt.updateMatrices(R),R.castShadow&&T++),n.spotLightMatrix[_]=tt.matrix,R.castShadow){const H=e.get(R);H.shadowIntensity=tt.intensity,H.shadowBias=tt.bias,H.shadowNormalBias=tt.normalBias,H.shadowRadius=tt.radius,H.shadowMapSize=tt.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=K,M++}_++}else if(R.isRectAreaLight){const W=t.get(R);W.color.copy(z).multiplyScalar(k),W.halfWidth.set(R.width*.5,0,0),W.halfHeight.set(0,R.height*.5,0),n.rectArea[f]=W,f++}else if(R.isPointLight){const W=t.get(R);if(W.color.copy(R.color).multiplyScalar(R.intensity),W.distance=R.distance,W.decay=R.decay,R.castShadow){const tt=R.shadow,H=e.get(R);H.shadowIntensity=tt.intensity,H.shadowBias=tt.bias,H.shadowNormalBias=tt.normalBias,H.shadowRadius=tt.radius,H.shadowMapSize=tt.mapSize,H.shadowCameraNear=tt.camera.near,H.shadowCameraFar=tt.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=K,n.pointShadowMatrix[g]=R.shadow.matrix,w++}n.point[g]=W,g++}else if(R.isHemisphereLight){const W=t.get(R);W.skyColor.copy(R.color).multiplyScalar(k),W.groundColor.copy(R.groundColor).multiplyScalar(k),n.hemi[p]=W,p++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=it.LTC_FLOAT_1,n.rectAreaLTC2=it.LTC_FLOAT_2):(n.rectAreaLTC1=it.LTC_HALF_1,n.rectAreaLTC2=it.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const P=n.hash;(P.directionalLength!==m||P.pointLength!==g||P.spotLength!==_||P.rectAreaLength!==f||P.hemiLength!==p||P.numDirectionalShadows!==b||P.numPointShadows!==w||P.numSpotShadows!==M||P.numSpotMaps!==N||P.numLightProbes!==A)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=f,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+N-T,n.spotLightMap.length=N,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=A,P.directionalLength=m,P.pointLength=g,P.spotLength=_,P.rectAreaLength=f,P.hemiLength=p,P.numDirectionalShadows=b,P.numPointShadows=w,P.numSpotShadows=M,P.numSpotMaps=N,P.numLightProbes=A,n.version=c0++)}function l(c,u){let h=0,d=0,m=0,g=0,_=0;const f=u.matrixWorldInverse;for(let p=0,b=c.length;p<b;p++){const w=c[p];if(w.isDirectionalLight){const M=n.directional[h];M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),h++}else if(w.isSpotLight){const M=n.spot[m];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(f),M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(f),m++}else if(w.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(f),a.identity(),r.copy(w.matrixWorld),r.premultiply(f),a.extractRotation(r),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(w.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(f),d++}else if(w.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(f),_++}}}return{setup:o,setupView:l,state:n}}function Rl(i){const t=new u0(i),e=[],n=[];function s(u){c.camera=u,e.length=0,n.length=0}function r(u){e.push(u)}function a(u){n.push(u)}function o(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function d0(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Rl(i),t.set(s,[o])):r>=a.length?(o=new Rl(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class f0 extends gi{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Yh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class p0 extends gi{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const m0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,g0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function _0(i,t,e){let n=new ao;const s=new ut,r=new ut,a=new Qt,o=new f0({depthPacking:$h}),l=new p0,c={},u=e.maxTextureSize,h={[Jn]:Ue,[Ue]:Jn,[cn]:cn},d=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ut},radius:{value:4}},vertexShader:m0,fragmentShader:g0}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new Pe;g.setAttribute("position",new $e(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new nt(g,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rc;let p=this.type;this.render=function(T,A,P){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||T.length===0)return;const S=i.getRenderTarget(),x=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),z=i.state;z.setBlending(qn),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const k=p!==bn&&this.type===bn,V=p===bn&&this.type!==bn;for(let K=0,W=T.length;K<W;K++){const tt=T[K],H=tt.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",tt,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const rt=H.getFrameExtents();if(s.multiply(rt),r.copy(H.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/rt.x),s.x=r.x*rt.x,H.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/rt.y),s.y=r.y*rt.y,H.mapSize.y=r.y)),H.map===null||k===!0||V===!0){const St=this.type!==bn?{minFilter:ze,magFilter:ze}:{};H.map!==null&&H.map.dispose(),H.map=new pi(s.x,s.y,St),H.map.texture.name=tt.name+".shadowMap",H.camera.updateProjectionMatrix()}i.setRenderTarget(H.map),i.clear();const dt=H.getViewportCount();for(let St=0;St<dt;St++){const zt=H.getViewport(St);a.set(r.x*zt.x,r.y*zt.y,r.x*zt.z,r.y*zt.w),z.viewport(a),H.updateMatrices(tt,St),n=H.getFrustum(),M(A,P,H.camera,tt,this.type)}H.isPointLightShadow!==!0&&this.type===bn&&b(H,P),H.needsUpdate=!1}p=this.type,f.needsUpdate=!1,i.setRenderTarget(S,x,R)};function b(T,A){const P=t.update(_);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new pi(s.x,s.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(A,null,P,d,_,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(A,null,P,m,_,null)}function w(T,A,P,S){let x=null;const R=P.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)x=R;else if(x=P.isPointLight===!0?l:o,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=x.uuid,k=A.uuid;let V=c[z];V===void 0&&(V={},c[z]=V);let K=V[k];K===void 0&&(K=x.clone(),V[k]=K,A.addEventListener("dispose",N)),x=K}if(x.visible=A.visible,x.wireframe=A.wireframe,S===bn?x.side=A.shadowSide!==null?A.shadowSide:A.side:x.side=A.shadowSide!==null?A.shadowSide:h[A.side],x.alphaMap=A.alphaMap,x.alphaTest=A.alphaTest,x.map=A.map,x.clipShadows=A.clipShadows,x.clippingPlanes=A.clippingPlanes,x.clipIntersection=A.clipIntersection,x.displacementMap=A.displacementMap,x.displacementScale=A.displacementScale,x.displacementBias=A.displacementBias,x.wireframeLinewidth=A.wireframeLinewidth,x.linewidth=A.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const z=i.properties.get(x);z.light=P}return x}function M(T,A,P,S,x){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&x===bn)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,T.matrixWorld);const k=t.update(T),V=T.material;if(Array.isArray(V)){const K=k.groups;for(let W=0,tt=K.length;W<tt;W++){const H=K[W],rt=V[H.materialIndex];if(rt&&rt.visible){const dt=w(T,rt,S,x);T.onBeforeShadow(i,T,A,P,k,dt,H),i.renderBufferDirect(P,null,k,dt,T,H),T.onAfterShadow(i,T,A,P,k,dt,H)}}}else if(V.visible){const K=w(T,V,S,x);T.onBeforeShadow(i,T,A,P,k,K,null),i.renderBufferDirect(P,null,k,K,T,null),T.onAfterShadow(i,T,A,P,k,K,null)}}const z=T.children;for(let k=0,V=z.length;k<V;k++)M(z[k],A,P,S,x)}function N(T){T.target.removeEventListener("dispose",N);for(const P in c){const S=c[P],x=T.target.uuid;x in S&&(S[x].dispose(),delete S[x])}}}const v0={[ca]:ha,[ua]:pa,[da]:ma,[Hi]:fa,[ha]:ca,[pa]:ua,[ma]:da,[fa]:Hi};function x0(i,t){function e(){let L=!1;const st=new Qt;let G=null;const J=new Qt(0,0,0,0);return{setMask:function(ht){G!==ht&&!L&&(i.colorMask(ht,ht,ht,ht),G=ht)},setLocked:function(ht){L=ht},setClear:function(ht,lt,Dt,he,ye){ye===!0&&(ht*=he,lt*=he,Dt*=he),st.set(ht,lt,Dt,he),J.equals(st)===!1&&(i.clearColor(ht,lt,Dt,he),J.copy(st))},reset:function(){L=!1,G=null,J.set(-1,0,0,0)}}}function n(){let L=!1,st=!1,G=null,J=null,ht=null;return{setReversed:function(lt){if(st!==lt){const Dt=t.get("EXT_clip_control");st?Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.ZERO_TO_ONE_EXT):Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.NEGATIVE_ONE_TO_ONE_EXT);const he=ht;ht=null,this.setClear(he)}st=lt},getReversed:function(){return st},setTest:function(lt){lt?at(i.DEPTH_TEST):Tt(i.DEPTH_TEST)},setMask:function(lt){G!==lt&&!L&&(i.depthMask(lt),G=lt)},setFunc:function(lt){if(st&&(lt=v0[lt]),J!==lt){switch(lt){case ca:i.depthFunc(i.NEVER);break;case ha:i.depthFunc(i.ALWAYS);break;case ua:i.depthFunc(i.LESS);break;case Hi:i.depthFunc(i.LEQUAL);break;case da:i.depthFunc(i.EQUAL);break;case fa:i.depthFunc(i.GEQUAL);break;case pa:i.depthFunc(i.GREATER);break;case ma:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}J=lt}},setLocked:function(lt){L=lt},setClear:function(lt){ht!==lt&&(st&&(lt=1-lt),i.clearDepth(lt),ht=lt)},reset:function(){L=!1,G=null,J=null,ht=null,st=!1}}}function s(){let L=!1,st=null,G=null,J=null,ht=null,lt=null,Dt=null,he=null,ye=null;return{setTest:function(Zt){L||(Zt?at(i.STENCIL_TEST):Tt(i.STENCIL_TEST))},setMask:function(Zt){st!==Zt&&!L&&(i.stencilMask(Zt),st=Zt)},setFunc:function(Zt,Je,pn){(G!==Zt||J!==Je||ht!==pn)&&(i.stencilFunc(Zt,Je,pn),G=Zt,J=Je,ht=pn)},setOp:function(Zt,Je,pn){(lt!==Zt||Dt!==Je||he!==pn)&&(i.stencilOp(Zt,Je,pn),lt=Zt,Dt=Je,he=pn)},setLocked:function(Zt){L=Zt},setClear:function(Zt){ye!==Zt&&(i.clearStencil(Zt),ye=Zt)},reset:function(){L=!1,st=null,G=null,J=null,ht=null,lt=null,Dt=null,he=null,ye=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,m=[],g=null,_=!1,f=null,p=null,b=null,w=null,M=null,N=null,T=null,A=new Bt(0,0,0),P=0,S=!1,x=null,R=null,z=null,k=null,V=null;const K=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,tt=0;const H=i.getParameter(i.VERSION);H.indexOf("WebGL")!==-1?(tt=parseFloat(/^WebGL (\d)/.exec(H)[1]),W=tt>=1):H.indexOf("OpenGL ES")!==-1&&(tt=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),W=tt>=2);let rt=null,dt={};const St=i.getParameter(i.SCISSOR_BOX),zt=i.getParameter(i.VIEWPORT),ee=new Qt().fromArray(St),Y=new Qt().fromArray(zt);function et(L,st,G,J){const ht=new Uint8Array(4),lt=i.createTexture();i.bindTexture(L,lt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Dt=0;Dt<G;Dt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(st,0,i.RGBA,1,1,J,0,i.RGBA,i.UNSIGNED_BYTE,ht):i.texImage2D(st+Dt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ht);return lt}const xt={};xt[i.TEXTURE_2D]=et(i.TEXTURE_2D,i.TEXTURE_2D,1),xt[i.TEXTURE_CUBE_MAP]=et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),xt[i.TEXTURE_2D_ARRAY]=et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),xt[i.TEXTURE_3D]=et(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),at(i.DEPTH_TEST),a.setFunc(Hi),Ht(!1),Vt(Io),at(i.CULL_FACE),U(qn);function at(L){u[L]!==!0&&(i.enable(L),u[L]=!0)}function Tt(L){u[L]!==!1&&(i.disable(L),u[L]=!1)}function It(L,st){return h[L]!==st?(i.bindFramebuffer(L,st),h[L]=st,L===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=st),L===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=st),!0):!1}function Gt(L,st){let G=m,J=!1;if(L){G=d.get(st),G===void 0&&(G=[],d.set(st,G));const ht=L.textures;if(G.length!==ht.length||G[0]!==i.COLOR_ATTACHMENT0){for(let lt=0,Dt=ht.length;lt<Dt;lt++)G[lt]=i.COLOR_ATTACHMENT0+lt;G.length=ht.length,J=!0}}else G[0]!==i.BACK&&(G[0]=i.BACK,J=!0);J&&i.drawBuffers(G)}function le(L){return g!==L?(i.useProgram(L),g=L,!0):!1}const Xt={[li]:i.FUNC_ADD,[Mh]:i.FUNC_SUBTRACT,[yh]:i.FUNC_REVERSE_SUBTRACT};Xt[Sh]=i.MIN,Xt[bh]=i.MAX;const fe={[wh]:i.ZERO,[Eh]:i.ONE,[Th]:i.SRC_COLOR,[oa]:i.SRC_ALPHA,[Ih]:i.SRC_ALPHA_SATURATE,[Ph]:i.DST_COLOR,[Ch]:i.DST_ALPHA,[Ah]:i.ONE_MINUS_SRC_COLOR,[la]:i.ONE_MINUS_SRC_ALPHA,[Lh]:i.ONE_MINUS_DST_COLOR,[Rh]:i.ONE_MINUS_DST_ALPHA,[Dh]:i.CONSTANT_COLOR,[Uh]:i.ONE_MINUS_CONSTANT_COLOR,[Nh]:i.CONSTANT_ALPHA,[Fh]:i.ONE_MINUS_CONSTANT_ALPHA};function U(L,st,G,J,ht,lt,Dt,he,ye,Zt){if(L===qn){_===!0&&(Tt(i.BLEND),_=!1);return}if(_===!1&&(at(i.BLEND),_=!0),L!==xh){if(L!==f||Zt!==S){if((p!==li||M!==li)&&(i.blendEquation(i.FUNC_ADD),p=li,M=li),Zt)switch(L){case Oi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Do:i.blendFunc(i.ONE,i.ONE);break;case Uo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case No:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case Oi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Do:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Uo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case No:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}b=null,w=null,N=null,T=null,A.set(0,0,0),P=0,f=L,S=Zt}return}ht=ht||st,lt=lt||G,Dt=Dt||J,(st!==p||ht!==M)&&(i.blendEquationSeparate(Xt[st],Xt[ht]),p=st,M=ht),(G!==b||J!==w||lt!==N||Dt!==T)&&(i.blendFuncSeparate(fe[G],fe[J],fe[lt],fe[Dt]),b=G,w=J,N=lt,T=Dt),(he.equals(A)===!1||ye!==P)&&(i.blendColor(he.r,he.g,he.b,ye),A.copy(he),P=ye),f=L,S=!1}function He(L,st){L.side===cn?Tt(i.CULL_FACE):at(i.CULL_FACE);let G=L.side===Ue;st&&(G=!G),Ht(G),L.blending===Oi&&L.transparent===!1?U(qn):U(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const J=L.stencilWrite;o.setTest(J),J&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),se(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?at(i.SAMPLE_ALPHA_TO_COVERAGE):Tt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ht(L){x!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),x=L)}function Vt(L){L!==gh?(at(i.CULL_FACE),L!==R&&(L===Io?i.cullFace(i.BACK):L===_h?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Tt(i.CULL_FACE),R=L}function wt(L){L!==z&&(W&&i.lineWidth(L),z=L)}function se(L,st,G){L?(at(i.POLYGON_OFFSET_FILL),(k!==st||V!==G)&&(i.polygonOffset(st,G),k=st,V=G)):Tt(i.POLYGON_OFFSET_FILL)}function bt(L){L?at(i.SCISSOR_TEST):Tt(i.SCISSOR_TEST)}function E(L){L===void 0&&(L=i.TEXTURE0+K-1),rt!==L&&(i.activeTexture(L),rt=L)}function v(L,st,G){G===void 0&&(rt===null?G=i.TEXTURE0+K-1:G=rt);let J=dt[G];J===void 0&&(J={type:void 0,texture:void 0},dt[G]=J),(J.type!==L||J.texture!==st)&&(rt!==G&&(i.activeTexture(G),rt=G),i.bindTexture(L,st||xt[L]),J.type=L,J.texture=st)}function F(){const L=dt[rt];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Z(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function q(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Mt(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ot(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function ft(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function qt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function pt(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Et(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Rt(L){ee.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),ee.copy(L))}function mt(L){Y.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Y.copy(L))}function Wt(L,st){let G=c.get(st);G===void 0&&(G=new WeakMap,c.set(st,G));let J=G.get(L);J===void 0&&(J=i.getUniformBlockIndex(st,L.name),G.set(L,J))}function Ft(L,st){const J=c.get(st).get(L);l.get(st)!==J&&(i.uniformBlockBinding(st,J,L.__bindingPointIndex),l.set(st,J))}function ne(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},rt=null,dt={},h={},d=new WeakMap,m=[],g=null,_=!1,f=null,p=null,b=null,w=null,M=null,N=null,T=null,A=new Bt(0,0,0),P=0,S=!1,x=null,R=null,z=null,k=null,V=null,ee.set(0,0,i.canvas.width,i.canvas.height),Y.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:at,disable:Tt,bindFramebuffer:It,drawBuffers:Gt,useProgram:le,setBlending:U,setMaterial:He,setFlipSided:Ht,setCullFace:Vt,setLineWidth:wt,setPolygonOffset:se,setScissorTest:bt,activeTexture:E,bindTexture:v,unbindTexture:F,compressedTexImage2D:$,compressedTexImage3D:Z,texImage2D:pt,texImage3D:Et,updateUBOMapping:Wt,uniformBlockBinding:Ft,texStorage2D:qt,texStorage3D:j,texSubImage2D:q,texSubImage3D:Mt,compressedTexSubImage2D:ot,compressedTexSubImage3D:ft,scissor:Rt,viewport:mt,reset:ne}}function Pl(i,t,e,n){const s=M0(n);switch(e){case hc:return i*t;case dc:return i*t;case fc:return i*t*2;case to:return i*t/s.components*s.byteLength;case eo:return i*t/s.components*s.byteLength;case pc:return i*t*2/s.components*s.byteLength;case no:return i*t*2/s.components*s.byteLength;case uc:return i*t*3/s.components*s.byteLength;case nn:return i*t*4/s.components*s.byteLength;case io:return i*t*4/s.components*s.byteLength;case er:case nr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ir:case sr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ma:case Sa:return Math.max(i,16)*Math.max(t,8)/4;case xa:case ya:return Math.max(i,8)*Math.max(t,8)/2;case ba:case wa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ea:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ta:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Aa:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ca:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Ra:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Pa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case La:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ia:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Da:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ua:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Na:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Fa:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Oa:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ba:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case ka:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case rr:case za:case Ga:return Math.ceil(i/4)*Math.ceil(t/4)*16;case mc:case Ha:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Va:case Wa:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function M0(i){switch(i){case Cn:case oc:return{byteLength:1,components:1};case xs:case lc:case ys:return{byteLength:2,components:1};case ja:case Qa:return{byteLength:2,components:4};case fi:case Za:case un:return{byteLength:4,components:1};case cc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function y0(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ut,u=new WeakMap;let h;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(E,v){return m?new OffscreenCanvas(E,v):fr("canvas")}function _(E,v,F){let $=1;const Z=bt(E);if((Z.width>F||Z.height>F)&&($=F/Math.max(Z.width,Z.height)),$<1)if(typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&E instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&E instanceof ImageBitmap||typeof VideoFrame<"u"&&E instanceof VideoFrame){const q=Math.floor($*Z.width),Mt=Math.floor($*Z.height);h===void 0&&(h=g(q,Mt));const ot=v?g(q,Mt):h;return ot.width=q,ot.height=Mt,ot.getContext("2d").drawImage(E,0,0,q,Mt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+q+"x"+Mt+")."),ot}else return"data"in E&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),E;return E}function f(E){return E.generateMipmaps}function p(E){i.generateMipmap(E)}function b(E){return E.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:E.isWebGL3DRenderTarget?i.TEXTURE_3D:E.isWebGLArrayRenderTarget||E.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(E,v,F,$,Z=!1){if(E!==null){if(i[E]!==void 0)return i[E];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+E+"'")}let q=v;if(v===i.RED&&(F===i.FLOAT&&(q=i.R32F),F===i.HALF_FLOAT&&(q=i.R16F),F===i.UNSIGNED_BYTE&&(q=i.R8)),v===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.R8UI),F===i.UNSIGNED_SHORT&&(q=i.R16UI),F===i.UNSIGNED_INT&&(q=i.R32UI),F===i.BYTE&&(q=i.R8I),F===i.SHORT&&(q=i.R16I),F===i.INT&&(q=i.R32I)),v===i.RG&&(F===i.FLOAT&&(q=i.RG32F),F===i.HALF_FLOAT&&(q=i.RG16F),F===i.UNSIGNED_BYTE&&(q=i.RG8)),v===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RG8UI),F===i.UNSIGNED_SHORT&&(q=i.RG16UI),F===i.UNSIGNED_INT&&(q=i.RG32UI),F===i.BYTE&&(q=i.RG8I),F===i.SHORT&&(q=i.RG16I),F===i.INT&&(q=i.RG32I)),v===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RGB8UI),F===i.UNSIGNED_SHORT&&(q=i.RGB16UI),F===i.UNSIGNED_INT&&(q=i.RGB32UI),F===i.BYTE&&(q=i.RGB8I),F===i.SHORT&&(q=i.RGB16I),F===i.INT&&(q=i.RGB32I)),v===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),F===i.UNSIGNED_INT&&(q=i.RGBA32UI),F===i.BYTE&&(q=i.RGBA8I),F===i.SHORT&&(q=i.RGBA16I),F===i.INT&&(q=i.RGBA32I)),v===i.RGB&&F===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),v===i.RGBA){const Mt=Z?xr:Yt.getTransfer($);F===i.FLOAT&&(q=i.RGBA32F),F===i.HALF_FLOAT&&(q=i.RGBA16F),F===i.UNSIGNED_BYTE&&(q=Mt===jt?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function M(E,v){let F;return E?v===null||v===fi||v===Xi?F=i.DEPTH24_STENCIL8:v===un?F=i.DEPTH32F_STENCIL8:v===xs&&(F=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===fi||v===Xi?F=i.DEPTH_COMPONENT24:v===un?F=i.DEPTH_COMPONENT32F:v===xs&&(F=i.DEPTH_COMPONENT16),F}function N(E,v){return f(E)===!0||E.isFramebufferTexture&&E.minFilter!==ze&&E.minFilter!==hn?Math.log2(Math.max(v.width,v.height))+1:E.mipmaps!==void 0&&E.mipmaps.length>0?E.mipmaps.length:E.isCompressedTexture&&Array.isArray(E.image)?v.mipmaps.length:1}function T(E){const v=E.target;v.removeEventListener("dispose",T),P(v),v.isVideoTexture&&u.delete(v)}function A(E){const v=E.target;v.removeEventListener("dispose",A),x(v)}function P(E){const v=n.get(E);if(v.__webglInit===void 0)return;const F=E.source,$=d.get(F);if($){const Z=$[v.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&S(E),Object.keys($).length===0&&d.delete(F)}n.remove(E)}function S(E){const v=n.get(E);i.deleteTexture(v.__webglTexture);const F=E.source,$=d.get(F);delete $[v.__cacheKey],a.memory.textures--}function x(E){const v=n.get(E);if(E.depthTexture&&(E.depthTexture.dispose(),n.remove(E.depthTexture)),E.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(v.__webglFramebuffer[$]))for(let Z=0;Z<v.__webglFramebuffer[$].length;Z++)i.deleteFramebuffer(v.__webglFramebuffer[$][Z]);else i.deleteFramebuffer(v.__webglFramebuffer[$]);v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer[$])}else{if(Array.isArray(v.__webglFramebuffer))for(let $=0;$<v.__webglFramebuffer.length;$++)i.deleteFramebuffer(v.__webglFramebuffer[$]);else i.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&i.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&i.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let $=0;$<v.__webglColorRenderbuffer.length;$++)v.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(v.__webglColorRenderbuffer[$]);v.__webglDepthRenderbuffer&&i.deleteRenderbuffer(v.__webglDepthRenderbuffer)}const F=E.textures;for(let $=0,Z=F.length;$<Z;$++){const q=n.get(F[$]);q.__webglTexture&&(i.deleteTexture(q.__webglTexture),a.memory.textures--),n.remove(F[$])}n.remove(E)}let R=0;function z(){R=0}function k(){const E=R;return E>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+E+" texture units while this GPU supports only "+s.maxTextures),R+=1,E}function V(E){const v=[];return v.push(E.wrapS),v.push(E.wrapT),v.push(E.wrapR||0),v.push(E.magFilter),v.push(E.minFilter),v.push(E.anisotropy),v.push(E.internalFormat),v.push(E.format),v.push(E.type),v.push(E.generateMipmaps),v.push(E.premultiplyAlpha),v.push(E.flipY),v.push(E.unpackAlignment),v.push(E.colorSpace),v.join()}function K(E,v){const F=n.get(E);if(E.isVideoTexture&&wt(E),E.isRenderTargetTexture===!1&&E.version>0&&F.__version!==E.version){const $=E.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(F,E,v);return}}e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+v)}function W(E,v){const F=n.get(E);if(E.version>0&&F.__version!==E.version){Y(F,E,v);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+v)}function tt(E,v){const F=n.get(E);if(E.version>0&&F.__version!==E.version){Y(F,E,v);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+v)}function H(E,v){const F=n.get(E);if(E.version>0&&F.__version!==E.version){et(F,E,v);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+v)}const rt={[vs]:i.REPEAT,[hi]:i.CLAMP_TO_EDGE,[va]:i.MIRRORED_REPEAT},dt={[ze]:i.NEAREST,[qh]:i.NEAREST_MIPMAP_NEAREST,[Ts]:i.NEAREST_MIPMAP_LINEAR,[hn]:i.LINEAR,[Tr]:i.LINEAR_MIPMAP_NEAREST,[ui]:i.LINEAR_MIPMAP_LINEAR},St={[Kh]:i.NEVER,[nu]:i.ALWAYS,[Zh]:i.LESS,[gc]:i.LEQUAL,[jh]:i.EQUAL,[eu]:i.GEQUAL,[Qh]:i.GREATER,[tu]:i.NOTEQUAL};function zt(E,v){if(v.type===un&&t.has("OES_texture_float_linear")===!1&&(v.magFilter===hn||v.magFilter===Tr||v.magFilter===Ts||v.magFilter===ui||v.minFilter===hn||v.minFilter===Tr||v.minFilter===Ts||v.minFilter===ui)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(E,i.TEXTURE_WRAP_S,rt[v.wrapS]),i.texParameteri(E,i.TEXTURE_WRAP_T,rt[v.wrapT]),(E===i.TEXTURE_3D||E===i.TEXTURE_2D_ARRAY)&&i.texParameteri(E,i.TEXTURE_WRAP_R,rt[v.wrapR]),i.texParameteri(E,i.TEXTURE_MAG_FILTER,dt[v.magFilter]),i.texParameteri(E,i.TEXTURE_MIN_FILTER,dt[v.minFilter]),v.compareFunction&&(i.texParameteri(E,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(E,i.TEXTURE_COMPARE_FUNC,St[v.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===ze||v.minFilter!==Ts&&v.minFilter!==ui||v.type===un&&t.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(E,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,s.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function ee(E,v){let F=!1;E.__webglInit===void 0&&(E.__webglInit=!0,v.addEventListener("dispose",T));const $=v.source;let Z=d.get($);Z===void 0&&(Z={},d.set($,Z));const q=V(v);if(q!==E.__cacheKey){Z[q]===void 0&&(Z[q]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),Z[q].usedTimes++;const Mt=Z[E.__cacheKey];Mt!==void 0&&(Z[E.__cacheKey].usedTimes--,Mt.usedTimes===0&&S(v)),E.__cacheKey=q,E.__webglTexture=Z[q].texture}return F}function Y(E,v,F){let $=i.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),v.isData3DTexture&&($=i.TEXTURE_3D);const Z=ee(E,v),q=v.source;e.bindTexture($,E.__webglTexture,i.TEXTURE0+F);const Mt=n.get(q);if(q.version!==Mt.__version||Z===!0){e.activeTexture(i.TEXTURE0+F);const ot=Yt.getPrimaries(Yt.workingColorSpace),ft=v.colorSpace===Wn?null:Yt.getPrimaries(v.colorSpace),qt=v.colorSpace===Wn||ot===ft?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,qt);let j=_(v.image,!1,s.maxTextureSize);j=se(v,j);const pt=r.convert(v.format,v.colorSpace),Et=r.convert(v.type);let Rt=w(v.internalFormat,pt,Et,v.colorSpace,v.isVideoTexture);zt($,v);let mt;const Wt=v.mipmaps,Ft=v.isVideoTexture!==!0,ne=Mt.__version===void 0||Z===!0,L=q.dataReady,st=N(v,j);if(v.isDepthTexture)Rt=M(v.format===qi,v.type),ne&&(Ft?e.texStorage2D(i.TEXTURE_2D,1,Rt,j.width,j.height):e.texImage2D(i.TEXTURE_2D,0,Rt,j.width,j.height,0,pt,Et,null));else if(v.isDataTexture)if(Wt.length>0){Ft&&ne&&e.texStorage2D(i.TEXTURE_2D,st,Rt,Wt[0].width,Wt[0].height);for(let G=0,J=Wt.length;G<J;G++)mt=Wt[G],Ft?L&&e.texSubImage2D(i.TEXTURE_2D,G,0,0,mt.width,mt.height,pt,Et,mt.data):e.texImage2D(i.TEXTURE_2D,G,Rt,mt.width,mt.height,0,pt,Et,mt.data);v.generateMipmaps=!1}else Ft?(ne&&e.texStorage2D(i.TEXTURE_2D,st,Rt,j.width,j.height),L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,j.width,j.height,pt,Et,j.data)):e.texImage2D(i.TEXTURE_2D,0,Rt,j.width,j.height,0,pt,Et,j.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){Ft&&ne&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,Rt,Wt[0].width,Wt[0].height,j.depth);for(let G=0,J=Wt.length;G<J;G++)if(mt=Wt[G],v.format!==nn)if(pt!==null)if(Ft){if(L)if(v.layerUpdates.size>0){const ht=Pl(mt.width,mt.height,v.format,v.type);for(const lt of v.layerUpdates){const Dt=mt.data.subarray(lt*ht/mt.data.BYTES_PER_ELEMENT,(lt+1)*ht/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,lt,mt.width,mt.height,1,pt,Dt)}v.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,mt.width,mt.height,j.depth,pt,mt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,G,Rt,mt.width,mt.height,j.depth,0,mt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ft?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,G,0,0,0,mt.width,mt.height,j.depth,pt,Et,mt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,G,Rt,mt.width,mt.height,j.depth,0,pt,Et,mt.data)}else{Ft&&ne&&e.texStorage2D(i.TEXTURE_2D,st,Rt,Wt[0].width,Wt[0].height);for(let G=0,J=Wt.length;G<J;G++)mt=Wt[G],v.format!==nn?pt!==null?Ft?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,G,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(i.TEXTURE_2D,G,Rt,mt.width,mt.height,0,mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ft?L&&e.texSubImage2D(i.TEXTURE_2D,G,0,0,mt.width,mt.height,pt,Et,mt.data):e.texImage2D(i.TEXTURE_2D,G,Rt,mt.width,mt.height,0,pt,Et,mt.data)}else if(v.isDataArrayTexture)if(Ft){if(ne&&e.texStorage3D(i.TEXTURE_2D_ARRAY,st,Rt,j.width,j.height,j.depth),L)if(v.layerUpdates.size>0){const G=Pl(j.width,j.height,v.format,v.type);for(const J of v.layerUpdates){const ht=j.data.subarray(J*G/j.data.BYTES_PER_ELEMENT,(J+1)*G/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,J,j.width,j.height,1,pt,Et,ht)}v.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,pt,Et,j.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Rt,j.width,j.height,j.depth,0,pt,Et,j.data);else if(v.isData3DTexture)Ft?(ne&&e.texStorage3D(i.TEXTURE_3D,st,Rt,j.width,j.height,j.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,pt,Et,j.data)):e.texImage3D(i.TEXTURE_3D,0,Rt,j.width,j.height,j.depth,0,pt,Et,j.data);else if(v.isFramebufferTexture){if(ne)if(Ft)e.texStorage2D(i.TEXTURE_2D,st,Rt,j.width,j.height);else{let G=j.width,J=j.height;for(let ht=0;ht<st;ht++)e.texImage2D(i.TEXTURE_2D,ht,Rt,G,J,0,pt,Et,null),G>>=1,J>>=1}}else if(Wt.length>0){if(Ft&&ne){const G=bt(Wt[0]);e.texStorage2D(i.TEXTURE_2D,st,Rt,G.width,G.height)}for(let G=0,J=Wt.length;G<J;G++)mt=Wt[G],Ft?L&&e.texSubImage2D(i.TEXTURE_2D,G,0,0,pt,Et,mt):e.texImage2D(i.TEXTURE_2D,G,Rt,pt,Et,mt);v.generateMipmaps=!1}else if(Ft){if(ne){const G=bt(j);e.texStorage2D(i.TEXTURE_2D,st,Rt,G.width,G.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt,Et,j)}else e.texImage2D(i.TEXTURE_2D,0,Rt,pt,Et,j);f(v)&&p($),Mt.__version=q.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function et(E,v,F){if(v.image.length!==6)return;const $=ee(E,v),Z=v.source;e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture,i.TEXTURE0+F);const q=n.get(Z);if(Z.version!==q.__version||$===!0){e.activeTexture(i.TEXTURE0+F);const Mt=Yt.getPrimaries(Yt.workingColorSpace),ot=v.colorSpace===Wn?null:Yt.getPrimaries(v.colorSpace),ft=v.colorSpace===Wn||Mt===ot?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,v.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,v.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ft);const qt=v.isCompressedTexture||v.image[0].isCompressedTexture,j=v.image[0]&&v.image[0].isDataTexture,pt=[];for(let J=0;J<6;J++)!qt&&!j?pt[J]=_(v.image[J],!0,s.maxCubemapSize):pt[J]=j?v.image[J].image:v.image[J],pt[J]=se(v,pt[J]);const Et=pt[0],Rt=r.convert(v.format,v.colorSpace),mt=r.convert(v.type),Wt=w(v.internalFormat,Rt,mt,v.colorSpace),Ft=v.isVideoTexture!==!0,ne=q.__version===void 0||$===!0,L=Z.dataReady;let st=N(v,Et);zt(i.TEXTURE_CUBE_MAP,v);let G;if(qt){Ft&&ne&&e.texStorage2D(i.TEXTURE_CUBE_MAP,st,Wt,Et.width,Et.height);for(let J=0;J<6;J++){G=pt[J].mipmaps;for(let ht=0;ht<G.length;ht++){const lt=G[ht];v.format!==nn?Rt!==null?Ft?L&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht,0,0,lt.width,lt.height,Rt,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht,Wt,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ft?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht,0,0,lt.width,lt.height,Rt,mt,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht,Wt,lt.width,lt.height,0,Rt,mt,lt.data)}}}else{if(G=v.mipmaps,Ft&&ne){G.length>0&&st++;const J=bt(pt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,st,Wt,J.width,J.height)}for(let J=0;J<6;J++)if(j){Ft?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,pt[J].width,pt[J].height,Rt,mt,pt[J].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Wt,pt[J].width,pt[J].height,0,Rt,mt,pt[J].data);for(let ht=0;ht<G.length;ht++){const Dt=G[ht].image[J].image;Ft?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht+1,0,0,Dt.width,Dt.height,Rt,mt,Dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht+1,Wt,Dt.width,Dt.height,0,Rt,mt,Dt.data)}}else{Ft?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Rt,mt,pt[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Wt,Rt,mt,pt[J]);for(let ht=0;ht<G.length;ht++){const lt=G[ht];Ft?L&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht+1,0,0,Rt,mt,lt.image[J]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ht+1,Wt,Rt,mt,lt.image[J])}}}f(v)&&p(i.TEXTURE_CUBE_MAP),q.__version=Z.version,v.onUpdate&&v.onUpdate(v)}E.__version=v.version}function xt(E,v,F,$,Z,q){const Mt=r.convert(F.format,F.colorSpace),ot=r.convert(F.type),ft=w(F.internalFormat,Mt,ot,F.colorSpace),qt=n.get(v),j=n.get(F);if(j.__renderTarget=v,!qt.__hasExternalTextures){const pt=Math.max(1,v.width>>q),Et=Math.max(1,v.height>>q);Z===i.TEXTURE_3D||Z===i.TEXTURE_2D_ARRAY?e.texImage3D(Z,q,ft,pt,Et,v.depth,0,Mt,ot,null):e.texImage2D(Z,q,ft,pt,Et,0,Mt,ot,null)}e.bindFramebuffer(i.FRAMEBUFFER,E),Vt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Z,j.__webglTexture,0,Ht(v)):(Z===i.TEXTURE_2D||Z>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Z,j.__webglTexture,q),e.bindFramebuffer(i.FRAMEBUFFER,null)}function at(E,v,F){if(i.bindRenderbuffer(i.RENDERBUFFER,E),v.depthBuffer){const $=v.depthTexture,Z=$&&$.isDepthTexture?$.type:null,q=M(v.stencilBuffer,Z),Mt=v.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ot=Ht(v);Vt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ot,q,v.width,v.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ot,q,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,q,v.width,v.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Mt,i.RENDERBUFFER,E)}else{const $=v.textures;for(let Z=0;Z<$.length;Z++){const q=$[Z],Mt=r.convert(q.format,q.colorSpace),ot=r.convert(q.type),ft=w(q.internalFormat,Mt,ot,q.colorSpace),qt=Ht(v);F&&Vt(v)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,qt,ft,v.width,v.height):Vt(v)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,qt,ft,v.width,v.height):i.renderbufferStorage(i.RENDERBUFFER,ft,v.width,v.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Tt(E,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,E),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(v.depthTexture);$.__renderTarget=v,(!$.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),K(v.depthTexture,0);const Z=$.__webglTexture,q=Ht(v);if(v.depthTexture.format===Bi)Vt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,Z,0);else if(v.depthTexture.format===qi)Vt(v)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0,q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,Z,0);else throw new Error("Unknown depthTexture format")}function It(E){const v=n.get(E),F=E.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==E.depthTexture){const $=E.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),$){const Z=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,$.removeEventListener("dispose",Z)};$.addEventListener("dispose",Z),v.__depthDisposeCallback=Z}v.__boundDepthTexture=$}if(E.depthTexture&&!v.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Tt(v.__webglFramebuffer,E)}else if(F){v.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer[$]),v.__webglDepthbuffer[$]===void 0)v.__webglDepthbuffer[$]=i.createRenderbuffer(),at(v.__webglDepthbuffer[$],E,!1);else{const Z=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,q=v.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,q),i.framebufferRenderbuffer(i.FRAMEBUFFER,Z,i.RENDERBUFFER,q)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=i.createRenderbuffer(),at(v.__webglDepthbuffer,E,!1);else{const $=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Z=v.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Z),i.framebufferRenderbuffer(i.FRAMEBUFFER,$,i.RENDERBUFFER,Z)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Gt(E,v,F){const $=n.get(E);v!==void 0&&xt($.__webglFramebuffer,E,E.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&It(E)}function le(E){const v=E.texture,F=n.get(E),$=n.get(v);E.addEventListener("dispose",A);const Z=E.textures,q=E.isWebGLCubeRenderTarget===!0,Mt=Z.length>1;if(Mt||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=v.version,a.memory.textures++),q){F.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer[ot]=[];for(let ft=0;ft<v.mipmaps.length;ft++)F.__webglFramebuffer[ot][ft]=i.createFramebuffer()}else F.__webglFramebuffer[ot]=i.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){F.__webglFramebuffer=[];for(let ot=0;ot<v.mipmaps.length;ot++)F.__webglFramebuffer[ot]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Mt)for(let ot=0,ft=Z.length;ot<ft;ot++){const qt=n.get(Z[ot]);qt.__webglTexture===void 0&&(qt.__webglTexture=i.createTexture(),a.memory.textures++)}if(E.samples>0&&Vt(E)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let ot=0;ot<Z.length;ot++){const ft=Z[ot];F.__webglColorRenderbuffer[ot]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[ot]);const qt=r.convert(ft.format,ft.colorSpace),j=r.convert(ft.type),pt=w(ft.internalFormat,qt,j,ft.colorSpace,E.isXRRenderTarget===!0),Et=Ht(E);i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,pt,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,F.__webglColorRenderbuffer[ot])}i.bindRenderbuffer(i.RENDERBUFFER,null),E.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),at(F.__webglDepthRenderbuffer,E,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(q){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),zt(i.TEXTURE_CUBE_MAP,v);for(let ot=0;ot<6;ot++)if(v.mipmaps&&v.mipmaps.length>0)for(let ft=0;ft<v.mipmaps.length;ft++)xt(F.__webglFramebuffer[ot][ft],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,ft);else xt(F.__webglFramebuffer[ot],E,v,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);f(v)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Mt){for(let ot=0,ft=Z.length;ot<ft;ot++){const qt=Z[ot],j=n.get(qt);e.bindTexture(i.TEXTURE_2D,j.__webglTexture),zt(i.TEXTURE_2D,qt),xt(F.__webglFramebuffer,E,qt,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,0),f(qt)&&p(i.TEXTURE_2D)}e.unbindTexture()}else{let ot=i.TEXTURE_2D;if((E.isWebGL3DRenderTarget||E.isWebGLArrayRenderTarget)&&(ot=E.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ot,$.__webglTexture),zt(ot,v),v.mipmaps&&v.mipmaps.length>0)for(let ft=0;ft<v.mipmaps.length;ft++)xt(F.__webglFramebuffer[ft],E,v,i.COLOR_ATTACHMENT0,ot,ft);else xt(F.__webglFramebuffer,E,v,i.COLOR_ATTACHMENT0,ot,0);f(v)&&p(ot),e.unbindTexture()}E.depthBuffer&&It(E)}function Xt(E){const v=E.textures;for(let F=0,$=v.length;F<$;F++){const Z=v[F];if(f(Z)){const q=b(E),Mt=n.get(Z).__webglTexture;e.bindTexture(q,Mt),p(q),e.unbindTexture()}}}const fe=[],U=[];function He(E){if(E.samples>0){if(Vt(E)===!1){const v=E.textures,F=E.width,$=E.height;let Z=i.COLOR_BUFFER_BIT;const q=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Mt=n.get(E),ot=v.length>1;if(ot)for(let ft=0;ft<v.length;ft++)e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglFramebuffer);for(let ft=0;ft<v.length;ft++){if(E.resolveDepthBuffer&&(E.depthBuffer&&(Z|=i.DEPTH_BUFFER_BIT),E.stencilBuffer&&E.resolveStencilBuffer&&(Z|=i.STENCIL_BUFFER_BIT)),ot){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[ft]);const qt=n.get(v[ft]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,qt,0)}i.blitFramebuffer(0,0,F,$,0,0,F,$,Z,i.NEAREST),l===!0&&(fe.length=0,U.length=0,fe.push(i.COLOR_ATTACHMENT0+ft),E.depthBuffer&&E.resolveDepthBuffer===!1&&(fe.push(q),U.push(q),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,U)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,fe))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ot)for(let ft=0;ft<v.length;ft++){e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.RENDERBUFFER,Mt.__webglColorRenderbuffer[ft]);const qt=n.get(v[ft]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Mt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ft,i.TEXTURE_2D,qt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Mt.__webglMultisampledFramebuffer)}else if(E.depthBuffer&&E.resolveDepthBuffer===!1&&l){const v=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[v])}}}function Ht(E){return Math.min(s.maxSamples,E.samples)}function Vt(E){const v=n.get(E);return E.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function wt(E){const v=a.render.frame;u.get(E)!==v&&(u.set(E,v),E.update())}function se(E,v){const F=E.colorSpace,$=E.format,Z=E.type;return E.isCompressedTexture===!0||E.isVideoTexture===!0||F!==$i&&F!==Wn&&(Yt.getTransfer(F)===jt?($!==nn||Z!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),v}function bt(E){return typeof HTMLImageElement<"u"&&E instanceof HTMLImageElement?(c.width=E.naturalWidth||E.width,c.height=E.naturalHeight||E.height):typeof VideoFrame<"u"&&E instanceof VideoFrame?(c.width=E.displayWidth,c.height=E.displayHeight):(c.width=E.width,c.height=E.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=z,this.setTexture2D=K,this.setTexture2DArray=W,this.setTexture3D=tt,this.setTextureCube=H,this.rebindTextures=Gt,this.setupRenderTarget=le,this.updateRenderTargetMipmap=Xt,this.updateMultisampleRenderTarget=He,this.setupDepthRenderbuffer=It,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Vt}function S0(i,t){function e(n,s=Wn){let r;const a=Yt.getTransfer(s);if(n===Cn)return i.UNSIGNED_BYTE;if(n===ja)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Qa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===cc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===oc)return i.BYTE;if(n===lc)return i.SHORT;if(n===xs)return i.UNSIGNED_SHORT;if(n===Za)return i.INT;if(n===fi)return i.UNSIGNED_INT;if(n===un)return i.FLOAT;if(n===ys)return i.HALF_FLOAT;if(n===hc)return i.ALPHA;if(n===uc)return i.RGB;if(n===nn)return i.RGBA;if(n===dc)return i.LUMINANCE;if(n===fc)return i.LUMINANCE_ALPHA;if(n===Bi)return i.DEPTH_COMPONENT;if(n===qi)return i.DEPTH_STENCIL;if(n===to)return i.RED;if(n===eo)return i.RED_INTEGER;if(n===pc)return i.RG;if(n===no)return i.RG_INTEGER;if(n===io)return i.RGBA_INTEGER;if(n===er||n===nr||n===ir||n===sr)if(a===jt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===er)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===nr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===er)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===nr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ir)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===sr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===xa||n===Ma||n===ya||n===Sa)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===xa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ma)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ya)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Sa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ba||n===wa||n===Ea)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ba||n===wa)return a===jt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ea)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ta||n===Aa||n===Ca||n===Ra||n===Pa||n===La||n===Ia||n===Da||n===Ua||n===Na||n===Fa||n===Oa||n===Ba||n===ka)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ta)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Aa)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ca)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ra)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Pa)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===La)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ia)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Da)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ua)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Na)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Fa)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Oa)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ba)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ka)return a===jt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===rr||n===za||n===Ga)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===rr)return a===jt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ga)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===mc||n===Ha||n===Va||n===Wa)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===rr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ha)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Va)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wa)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class b0 extends ke{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class ue extends de{constructor(){super(),this.isGroup=!0,this.type="Group"}}const w0={type:"move"};class Qr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ue,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ue,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ue,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const f=e.getJointPose(_,n),p=this._getHandJoint(c,_);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),m=.02,g=.005;c.inputState.pinching&&d>m+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=m-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(w0)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ue;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const E0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,T0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class A0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const s=new Ee,r=t.properties.get(s);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Kn({vertexShader:E0,fragmentShader:T0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new nt(new dn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class C0 extends Ji{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,m=null,g=null;const _=new A0,f=e.getContextAttributes();let p=null,b=null;const w=[],M=[],N=new ut;let T=null;const A=new ke;A.viewport=new Qt;const P=new ke;P.viewport=new Qt;const S=[A,P],x=new b0;let R=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let et=w[Y];return et===void 0&&(et=new Qr,w[Y]=et),et.getTargetRaySpace()},this.getControllerGrip=function(Y){let et=w[Y];return et===void 0&&(et=new Qr,w[Y]=et),et.getGripSpace()},this.getHand=function(Y){let et=w[Y];return et===void 0&&(et=new Qr,w[Y]=et),et.getHandSpace()};function k(Y){const et=M.indexOf(Y.inputSource);if(et===-1)return;const xt=w[et];xt!==void 0&&(xt.update(Y.inputSource,Y.frame,c||a),xt.dispatchEvent({type:Y.type,data:Y.inputSource}))}function V(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",V),s.removeEventListener("inputsourceschange",K);for(let Y=0;Y<w.length;Y++){const et=M[Y];et!==null&&(M[Y]=null,w[Y].disconnect(et))}R=null,z=null,_.reset(),t.setRenderTarget(p),m=null,d=null,h=null,s=null,b=null,ee.stop(),n.isPresenting=!1,t.setPixelRatio(T),t.setSize(N.width,N.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",V),s.addEventListener("inputsourceschange",K),f.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(N),s.renderState.layers===void 0){const et={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,et),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new pi(m.framebufferWidth,m.framebufferHeight,{format:nn,type:Cn,colorSpace:t.outputColorSpace,stencilBuffer:f.stencil})}else{let et=null,xt=null,at=null;f.depth&&(at=f.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=f.stencil?qi:Bi,xt=f.stencil?Xi:fi);const Tt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:r};h=new XRWebGLBinding(s,e),d=h.createProjectionLayer(Tt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new pi(d.textureWidth,d.textureHeight,{format:nn,type:Cn,depthTexture:new Pc(d.textureWidth,d.textureHeight,xt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:f.stencil,colorSpace:t.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ee.setContext(s),ee.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function K(Y){for(let et=0;et<Y.removed.length;et++){const xt=Y.removed[et],at=M.indexOf(xt);at>=0&&(M[at]=null,w[at].disconnect(xt))}for(let et=0;et<Y.added.length;et++){const xt=Y.added[et];let at=M.indexOf(xt);if(at===-1){for(let It=0;It<w.length;It++)if(It>=M.length){M.push(xt),at=It;break}else if(M[It]===null){M[It]=xt,at=It;break}if(at===-1)break}const Tt=w[at];Tt&&Tt.connect(xt)}}const W=new C,tt=new C;function H(Y,et,xt){W.setFromMatrixPosition(et.matrixWorld),tt.setFromMatrixPosition(xt.matrixWorld);const at=W.distanceTo(tt),Tt=et.projectionMatrix.elements,It=xt.projectionMatrix.elements,Gt=Tt[14]/(Tt[10]-1),le=Tt[14]/(Tt[10]+1),Xt=(Tt[9]+1)/Tt[5],fe=(Tt[9]-1)/Tt[5],U=(Tt[8]-1)/Tt[0],He=(It[8]+1)/It[0],Ht=Gt*U,Vt=Gt*He,wt=at/(-U+He),se=wt*-U;if(et.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(se),Y.translateZ(wt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Tt[10]===-1)Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{const bt=Gt+wt,E=le+wt,v=Ht-se,F=Vt+(at-se),$=Xt*le/E*bt,Z=fe*le/E*bt;Y.projectionMatrix.makePerspective(v,F,$,Z,bt,E),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function rt(Y,et){et===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(et.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let et=Y.near,xt=Y.far;_.texture!==null&&(_.depthNear>0&&(et=_.depthNear),_.depthFar>0&&(xt=_.depthFar)),x.near=P.near=A.near=et,x.far=P.far=A.far=xt,(R!==x.near||z!==x.far)&&(s.updateRenderState({depthNear:x.near,depthFar:x.far}),R=x.near,z=x.far),A.layers.mask=Y.layers.mask|2,P.layers.mask=Y.layers.mask|4,x.layers.mask=A.layers.mask|P.layers.mask;const at=Y.parent,Tt=x.cameras;rt(x,at);for(let It=0;It<Tt.length;It++)rt(Tt[It],at);Tt.length===2?H(x,A,P):x.projectionMatrix.copy(A.projectionMatrix),dt(Y,x,at)};function dt(Y,et,xt){xt===null?Y.matrix.copy(et.matrixWorld):(Y.matrix.copy(xt.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(et.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(et.projectionMatrix),Y.projectionMatrixInverse.copy(et.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Ms*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(Y){l=Y,d!==null&&(d.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(x)};let St=null;function zt(Y,et){if(u=et.getViewerPose(c||a),g=et,u!==null){const xt=u.views;m!==null&&(t.setRenderTargetFramebuffer(b,m.framebuffer),t.setRenderTarget(b));let at=!1;xt.length!==x.cameras.length&&(x.cameras.length=0,at=!0);for(let It=0;It<xt.length;It++){const Gt=xt[It];let le=null;if(m!==null)le=m.getViewport(Gt);else{const fe=h.getViewSubImage(d,Gt);le=fe.viewport,It===0&&(t.setRenderTargetTextures(b,fe.colorTexture,d.ignoreDepthValues?void 0:fe.depthStencilTexture),t.setRenderTarget(b))}let Xt=S[It];Xt===void 0&&(Xt=new ke,Xt.layers.enable(It),Xt.viewport=new Qt,S[It]=Xt),Xt.matrix.fromArray(Gt.transform.matrix),Xt.matrix.decompose(Xt.position,Xt.quaternion,Xt.scale),Xt.projectionMatrix.fromArray(Gt.projectionMatrix),Xt.projectionMatrixInverse.copy(Xt.projectionMatrix).invert(),Xt.viewport.set(le.x,le.y,le.width,le.height),It===0&&(x.matrix.copy(Xt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),at===!0&&x.cameras.push(Xt)}const Tt=s.enabledFeatures;if(Tt&&Tt.includes("depth-sensing")){const It=h.getDepthInformation(xt[0]);It&&It.isValid&&It.texture&&_.init(t,It,s.renderState)}}for(let xt=0;xt<w.length;xt++){const at=M[xt],Tt=w[xt];at!==null&&Tt!==void 0&&Tt.update(at,et,c||a)}St&&St(Y,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}const ee=new Cc;ee.setAnimationLoop(zt),this.setAnimationLoop=function(Y){St=Y},this.dispose=function(){}}}const si=new sn,R0=new te;function P0(i,t){function e(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function n(f,p){p.color.getRGB(f.fogColor.value,Ec(i)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,b,w,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(f,p):p.isMeshToonMaterial?(r(f,p),h(f,p)):p.isMeshPhongMaterial?(r(f,p),u(f,p)):p.isMeshStandardMaterial?(r(f,p),d(f,p),p.isMeshPhysicalMaterial&&m(f,p,M)):p.isMeshMatcapMaterial?(r(f,p),g(f,p)):p.isMeshDepthMaterial?r(f,p):p.isMeshDistanceMaterial?(r(f,p),_(f,p)):p.isMeshNormalMaterial?r(f,p):p.isLineBasicMaterial?(a(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?l(f,p,b,w):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,e(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,e(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,e(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Ue&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,e(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Ue&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,e(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,e(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const b=t.get(p),w=b.envMap,M=b.envMapRotation;w&&(f.envMap.value=w,si.copy(M),si.x*=-1,si.y*=-1,si.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),f.envMapRotation.value.setFromMatrix4(R0.makeRotationFromEuler(si)),f.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,f.aoMapTransform))}function a(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,e(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,b,w){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*b,f.scale.value=w*.5,p.map&&(f.map.value=p.map,e(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,e(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,e(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,e(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function u(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function h(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function d(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,b){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ue&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=b.texture,f.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,p){p.matcap&&(f.matcap.value=p.matcap)}function _(f,p){const b=t.get(p).light;f.referencePosition.value.setFromMatrixPosition(b.matrixWorld),f.nearDistance.value=b.shadow.camera.near,f.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function L0(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,w){const M=w.program;n.uniformBlockBinding(b,M)}function c(b,w){let M=s[b.id];M===void 0&&(g(b),M=u(b),s[b.id]=M,b.addEventListener("dispose",f));const N=w.program;n.updateUBOMapping(b,N);const T=t.render.frame;r[b.id]!==T&&(d(b),r[b.id]=T)}function u(b){const w=h();b.__bindingPointIndex=w;const M=i.createBuffer(),N=b.__size,T=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,N,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,M),M}function h(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const w=s[b.id],M=b.uniforms,N=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let T=0,A=M.length;T<A;T++){const P=Array.isArray(M[T])?M[T]:[M[T]];for(let S=0,x=P.length;S<x;S++){const R=P[S];if(m(R,T,S,N)===!0){const z=R.__offset,k=Array.isArray(R.value)?R.value:[R.value];let V=0;for(let K=0;K<k.length;K++){const W=k[K],tt=_(W);typeof W=="number"||typeof W=="boolean"?(R.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,z+V,R.__data)):W.isMatrix3?(R.__data[0]=W.elements[0],R.__data[1]=W.elements[1],R.__data[2]=W.elements[2],R.__data[3]=0,R.__data[4]=W.elements[3],R.__data[5]=W.elements[4],R.__data[6]=W.elements[5],R.__data[7]=0,R.__data[8]=W.elements[6],R.__data[9]=W.elements[7],R.__data[10]=W.elements[8],R.__data[11]=0):(W.toArray(R.__data,V),V+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,R.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,w,M,N){const T=b.value,A=w+"_"+M;if(N[A]===void 0)return typeof T=="number"||typeof T=="boolean"?N[A]=T:N[A]=T.clone(),!0;{const P=N[A];if(typeof T=="number"||typeof T=="boolean"){if(P!==T)return N[A]=T,!0}else if(P.equals(T)===!1)return P.copy(T),!0}return!1}function g(b){const w=b.uniforms;let M=0;const N=16;for(let A=0,P=w.length;A<P;A++){const S=Array.isArray(w[A])?w[A]:[w[A]];for(let x=0,R=S.length;x<R;x++){const z=S[x],k=Array.isArray(z.value)?z.value:[z.value];for(let V=0,K=k.length;V<K;V++){const W=k[V],tt=_(W),H=M%N,rt=H%tt.boundary,dt=H+rt;M+=rt,dt!==0&&N-dt<tt.storage&&(M+=N-dt),z.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=M,M+=tt.storage}}}const T=M%N;return T>0&&(M+=N-T),b.__size=M,b.__cache={},this}function _(b){const w={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(w.boundary=4,w.storage=4):b.isVector2?(w.boundary=8,w.storage=8):b.isVector3||b.isColor?(w.boundary=16,w.storage=12):b.isVector4?(w.boundary=16,w.storage=16):b.isMatrix3?(w.boundary=48,w.storage=48):b.isMatrix4?(w.boundary=64,w.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),w}function f(b){const w=b.target;w.removeEventListener("dispose",f);const M=a.indexOf(w.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function p(){for(const b in s)i.deleteBuffer(s[b]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}class Ll{constructor(t={}){const{canvas:e=xu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const g=new Uint32Array(4),_=new Int32Array(4);let f=null,p=null;const b=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ie,this.toneMapping=Yn,this.toneMappingExposure=1;const M=this;let N=!1,T=0,A=0,P=null,S=-1,x=null;const R=new Qt,z=new Qt;let k=null;const V=new Bt(0);let K=0,W=e.width,tt=e.height,H=1,rt=null,dt=null;const St=new Qt(0,0,W,tt),zt=new Qt(0,0,W,tt);let ee=!1;const Y=new ao;let et=!1,xt=!1;const at=new te,Tt=new te,It=new C,Gt=new Qt,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function fe(){return P===null?H:1}let U=n;function He(y,I){return e.getContext(y,I)}try{const y={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ja}`),e.addEventListener("webglcontextlost",J,!1),e.addEventListener("webglcontextrestored",ht,!1),e.addEventListener("webglcontextcreationerror",lt,!1),U===null){const I="webgl2";if(U=He(I,y),U===null)throw He(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ht,Vt,wt,se,bt,E,v,F,$,Z,q,Mt,ot,ft,qt,j,pt,Et,Rt,mt,Wt,Ft,ne,L;function st(){Ht=new Op(U),Ht.init(),Ft=new S0(U,Ht),Vt=new Lp(U,Ht,t,Ft),wt=new x0(U,Ht),Vt.reverseDepthBuffer&&d&&wt.buffers.depth.setReversed(!0),se=new zp(U),bt=new s0,E=new y0(U,Ht,wt,bt,Vt,Ft,se),v=new Dp(M),F=new Fp(M),$=new qu(U),ne=new Rp(U,$),Z=new Bp(U,$,se,ne),q=new Hp(U,Z,$,se),Rt=new Gp(U,Vt,E),j=new Ip(bt),Mt=new i0(M,v,F,Ht,Vt,ne,j),ot=new P0(M,bt),ft=new a0,qt=new d0(Ht),Et=new Cp(M,v,F,wt,q,m,l),pt=new _0(M,q,Vt),L=new L0(U,se,Vt,wt),mt=new Pp(U,Ht,se),Wt=new kp(U,Ht,se),se.programs=Mt.programs,M.capabilities=Vt,M.extensions=Ht,M.properties=bt,M.renderLists=ft,M.shadowMap=pt,M.state=wt,M.info=se}st();const G=new C0(M,U);this.xr=G,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const y=Ht.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ht.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(y){y!==void 0&&(H=y,this.setSize(W,tt,!1))},this.getSize=function(y){return y.set(W,tt)},this.setSize=function(y,I,O=!0){if(G.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=y,tt=I,e.width=Math.floor(y*H),e.height=Math.floor(I*H),O===!0&&(e.style.width=y+"px",e.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(W*H,tt*H).floor()},this.setDrawingBufferSize=function(y,I,O){W=y,tt=I,H=O,e.width=Math.floor(y*O),e.height=Math.floor(I*O),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(R)},this.getViewport=function(y){return y.copy(St)},this.setViewport=function(y,I,O,B){y.isVector4?St.set(y.x,y.y,y.z,y.w):St.set(y,I,O,B),wt.viewport(R.copy(St).multiplyScalar(H).round())},this.getScissor=function(y){return y.copy(zt)},this.setScissor=function(y,I,O,B){y.isVector4?zt.set(y.x,y.y,y.z,y.w):zt.set(y,I,O,B),wt.scissor(z.copy(zt).multiplyScalar(H).round())},this.getScissorTest=function(){return ee},this.setScissorTest=function(y){wt.setScissorTest(ee=y)},this.setOpaqueSort=function(y){rt=y},this.setTransparentSort=function(y){dt=y},this.getClearColor=function(y){return y.copy(Et.getClearColor())},this.setClearColor=function(){Et.setClearColor.apply(Et,arguments)},this.getClearAlpha=function(){return Et.getClearAlpha()},this.setClearAlpha=function(){Et.setClearAlpha.apply(Et,arguments)},this.clear=function(y=!0,I=!0,O=!0){let B=0;if(y){let D=!1;if(P!==null){const Q=P.texture.format;D=Q===io||Q===no||Q===eo}if(D){const Q=P.texture.type,ct=Q===Cn||Q===fi||Q===xs||Q===Xi||Q===ja||Q===Qa,gt=Et.getClearColor(),_t=Et.getClearAlpha(),Lt=gt.r,Ut=gt.g,vt=gt.b;ct?(g[0]=Lt,g[1]=Ut,g[2]=vt,g[3]=_t,U.clearBufferuiv(U.COLOR,0,g)):(_[0]=Lt,_[1]=Ut,_[2]=vt,_[3]=_t,U.clearBufferiv(U.COLOR,0,_))}else B|=U.COLOR_BUFFER_BIT}I&&(B|=U.DEPTH_BUFFER_BIT),O&&(B|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",J,!1),e.removeEventListener("webglcontextrestored",ht,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),ft.dispose(),qt.dispose(),bt.dispose(),v.dispose(),F.dispose(),q.dispose(),ne.dispose(),L.dispose(),Mt.dispose(),G.dispose(),G.removeEventListener("sessionstart",vo),G.removeEventListener("sessionend",xo),jn.stop()};function J(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),N=!0}function ht(){console.log("THREE.WebGLRenderer: Context Restored."),N=!1;const y=se.autoReset,I=pt.enabled,O=pt.autoUpdate,B=pt.needsUpdate,D=pt.type;st(),se.autoReset=y,pt.enabled=I,pt.autoUpdate=O,pt.needsUpdate=B,pt.type=D}function lt(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Dt(y){const I=y.target;I.removeEventListener("dispose",Dt),he(I)}function he(y){ye(y),bt.remove(y)}function ye(y){const I=bt.get(y).programs;I!==void 0&&(I.forEach(function(O){Mt.releaseProgram(O)}),y.isShaderMaterial&&Mt.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,O,B,D,Q){I===null&&(I=le);const ct=D.isMesh&&D.matrixWorld.determinant()<0,gt=qc(y,I,O,B,D);wt.setMaterial(B,ct);let _t=O.index,Lt=1;if(B.wireframe===!0){if(_t=Z.getWireframeAttribute(O),_t===void 0)return;Lt=2}const Ut=O.drawRange,vt=O.attributes.position;let $t=Ut.start*Lt,ie=(Ut.start+Ut.count)*Lt;Q!==null&&($t=Math.max($t,Q.start*Lt),ie=Math.min(ie,(Q.start+Q.count)*Lt)),_t!==null?($t=Math.max($t,0),ie=Math.min(ie,_t.count)):vt!=null&&($t=Math.max($t,0),ie=Math.min(ie,vt.count));const re=ie-$t;if(re<0||re===1/0)return;ne.setup(D,B,gt,O,_t);let Le,Jt=mt;if(_t!==null&&(Le=$.get(_t),Jt=Wt,Jt.setIndex(Le)),D.isMesh)B.wireframe===!0?(wt.setLineWidth(B.wireframeLinewidth*fe()),Jt.setMode(U.LINES)):Jt.setMode(U.TRIANGLES);else if(D.isLine){let yt=B.linewidth;yt===void 0&&(yt=1),wt.setLineWidth(yt*fe()),D.isLineSegments?Jt.setMode(U.LINES):D.isLineLoop?Jt.setMode(U.LINE_LOOP):Jt.setMode(U.LINE_STRIP)}else D.isPoints?Jt.setMode(U.POINTS):D.isSprite&&Jt.setMode(U.TRIANGLES);if(D.isBatchedMesh)if(D._multiDrawInstances!==null)Jt.renderMultiDrawInstances(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount,D._multiDrawInstances);else if(Ht.get("WEBGL_multi_draw"))Jt.renderMultiDraw(D._multiDrawStarts,D._multiDrawCounts,D._multiDrawCount);else{const yt=D._multiDrawStarts,mn=D._multiDrawCounts,Kt=D._multiDrawCount,Ke=_t?$.get(_t).bytesPerElement:1,vi=bt.get(B).currentProgram.getUniforms();for(let Ne=0;Ne<Kt;Ne++)vi.setValue(U,"_gl_DrawID",Ne),Jt.render(yt[Ne]/Ke,mn[Ne])}else if(D.isInstancedMesh)Jt.renderInstances($t,re,D.count);else if(O.isInstancedBufferGeometry){const yt=O._maxInstanceCount!==void 0?O._maxInstanceCount:1/0,mn=Math.min(O.instanceCount,yt);Jt.renderInstances($t,re,mn)}else Jt.render($t,re)};function Zt(y,I,O){y.transparent===!0&&y.side===cn&&y.forceSinglePass===!1?(y.side=Ue,y.needsUpdate=!0,Es(y,I,O),y.side=Jn,y.needsUpdate=!0,Es(y,I,O),y.side=cn):Es(y,I,O)}this.compile=function(y,I,O=null){O===null&&(O=y),p=qt.get(O),p.init(I),w.push(p),O.traverseVisible(function(D){D.isLight&&D.layers.test(I.layers)&&(p.pushLight(D),D.castShadow&&p.pushShadow(D))}),y!==O&&y.traverseVisible(function(D){D.isLight&&D.layers.test(I.layers)&&(p.pushLight(D),D.castShadow&&p.pushShadow(D))}),p.setupLights();const B=new Set;return y.traverse(function(D){if(!(D.isMesh||D.isPoints||D.isLine||D.isSprite))return;const Q=D.material;if(Q)if(Array.isArray(Q))for(let ct=0;ct<Q.length;ct++){const gt=Q[ct];Zt(gt,O,D),B.add(gt)}else Zt(Q,O,D),B.add(Q)}),w.pop(),p=null,B},this.compileAsync=function(y,I,O=null){const B=this.compile(y,I,O);return new Promise(D=>{function Q(){if(B.forEach(function(ct){bt.get(ct).currentProgram.isReady()&&B.delete(ct)}),B.size===0){D(y);return}setTimeout(Q,10)}Ht.get("KHR_parallel_shader_compile")!==null?Q():setTimeout(Q,10)})};let Je=null;function pn(y){Je&&Je(y)}function vo(){jn.stop()}function xo(){jn.start()}const jn=new Cc;jn.setAnimationLoop(pn),typeof self<"u"&&jn.setContext(self),this.setAnimationLoop=function(y){Je=y,G.setAnimationLoop(y),y===null?jn.stop():jn.start()},G.addEventListener("sessionstart",vo),G.addEventListener("sessionend",xo),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(N===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(G.cameraAutoUpdate===!0&&G.updateCamera(I),I=G.getCamera()),y.isScene===!0&&y.onBeforeRender(M,y,I,P),p=qt.get(y,w.length),p.init(I),w.push(p),Tt.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Y.setFromProjectionMatrix(Tt),xt=this.localClippingEnabled,et=j.init(this.clippingPlanes,xt),f=ft.get(y,b.length),f.init(),b.push(f),G.enabled===!0&&G.isPresenting===!0){const Q=M.xr.getDepthSensingMesh();Q!==null&&wr(Q,I,-1/0,M.sortObjects)}wr(y,I,0,M.sortObjects),f.finish(),M.sortObjects===!0&&f.sort(rt,dt),Xt=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Xt&&Et.addToRenderList(f,y),this.info.render.frame++,et===!0&&j.beginShadows();const O=p.state.shadowsArray;pt.render(O,y,I),et===!0&&j.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=f.opaque,D=f.transmissive;if(p.setupLights(),I.isArrayCamera){const Q=I.cameras;if(D.length>0)for(let ct=0,gt=Q.length;ct<gt;ct++){const _t=Q[ct];yo(B,D,y,_t)}Xt&&Et.render(y);for(let ct=0,gt=Q.length;ct<gt;ct++){const _t=Q[ct];Mo(f,y,_t,_t.viewport)}}else D.length>0&&yo(B,D,y,I),Xt&&Et.render(y),Mo(f,y,I);P!==null&&(E.updateMultisampleRenderTarget(P),E.updateRenderTargetMipmap(P)),y.isScene===!0&&y.onAfterRender(M,y,I),ne.resetDefaultState(),S=-1,x=null,w.pop(),w.length>0?(p=w[w.length-1],et===!0&&j.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?f=b[b.length-1]:f=null};function wr(y,I,O,B){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)O=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Y.intersectsSprite(y)){B&&Gt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Tt);const ct=q.update(y),gt=y.material;gt.visible&&f.push(y,ct,gt,O,Gt.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Y.intersectsObject(y))){const ct=q.update(y),gt=y.material;if(B&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Gt.copy(y.boundingSphere.center)):(ct.boundingSphere===null&&ct.computeBoundingSphere(),Gt.copy(ct.boundingSphere.center)),Gt.applyMatrix4(y.matrixWorld).applyMatrix4(Tt)),Array.isArray(gt)){const _t=ct.groups;for(let Lt=0,Ut=_t.length;Lt<Ut;Lt++){const vt=_t[Lt],$t=gt[vt.materialIndex];$t&&$t.visible&&f.push(y,ct,$t,O,Gt.z,vt)}}else gt.visible&&f.push(y,ct,gt,O,Gt.z,null)}}const Q=y.children;for(let ct=0,gt=Q.length;ct<gt;ct++)wr(Q[ct],I,O,B)}function Mo(y,I,O,B){const D=y.opaque,Q=y.transmissive,ct=y.transparent;p.setupLightsView(O),et===!0&&j.setGlobalState(M.clippingPlanes,O),B&&wt.viewport(R.copy(B)),D.length>0&&ws(D,I,O),Q.length>0&&ws(Q,I,O),ct.length>0&&ws(ct,I,O),wt.buffers.depth.setTest(!0),wt.buffers.depth.setMask(!0),wt.buffers.color.setMask(!0),wt.setPolygonOffset(!1)}function yo(y,I,O,B){if((O.isScene===!0?O.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new pi(1,1,{generateMipmaps:!0,type:Ht.has("EXT_color_buffer_half_float")||Ht.has("EXT_color_buffer_float")?ys:Cn,minFilter:ui,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const Q=p.state.transmissionRenderTarget[B.id],ct=B.viewport||R;Q.setSize(ct.z,ct.w);const gt=M.getRenderTarget();M.setRenderTarget(Q),M.getClearColor(V),K=M.getClearAlpha(),K<1&&M.setClearColor(16777215,.5),M.clear(),Xt&&Et.render(O);const _t=M.toneMapping;M.toneMapping=Yn;const Lt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),et===!0&&j.setGlobalState(M.clippingPlanes,B),ws(y,O,B),E.updateMultisampleRenderTarget(Q),E.updateRenderTargetMipmap(Q),Ht.has("WEBGL_multisampled_render_to_texture")===!1){let Ut=!1;for(let vt=0,$t=I.length;vt<$t;vt++){const ie=I[vt],re=ie.object,Le=ie.geometry,Jt=ie.material,yt=ie.group;if(Jt.side===cn&&re.layers.test(B.layers)){const mn=Jt.side;Jt.side=Ue,Jt.needsUpdate=!0,So(re,O,B,Le,Jt,yt),Jt.side=mn,Jt.needsUpdate=!0,Ut=!0}}Ut===!0&&(E.updateMultisampleRenderTarget(Q),E.updateRenderTargetMipmap(Q))}M.setRenderTarget(gt),M.setClearColor(V,K),Lt!==void 0&&(B.viewport=Lt),M.toneMapping=_t}function ws(y,I,O){const B=I.isScene===!0?I.overrideMaterial:null;for(let D=0,Q=y.length;D<Q;D++){const ct=y[D],gt=ct.object,_t=ct.geometry,Lt=B===null?ct.material:B,Ut=ct.group;gt.layers.test(O.layers)&&So(gt,I,O,_t,Lt,Ut)}}function So(y,I,O,B,D,Q){y.onBeforeRender(M,I,O,B,D,Q),y.modelViewMatrix.multiplyMatrices(O.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),D.onBeforeRender(M,I,O,B,y,Q),D.transparent===!0&&D.side===cn&&D.forceSinglePass===!1?(D.side=Ue,D.needsUpdate=!0,M.renderBufferDirect(O,I,B,D,y,Q),D.side=Jn,D.needsUpdate=!0,M.renderBufferDirect(O,I,B,D,y,Q),D.side=cn):M.renderBufferDirect(O,I,B,D,y,Q),y.onAfterRender(M,I,O,B,D,Q)}function Es(y,I,O){I.isScene!==!0&&(I=le);const B=bt.get(y),D=p.state.lights,Q=p.state.shadowsArray,ct=D.state.version,gt=Mt.getParameters(y,D.state,Q,I,O),_t=Mt.getProgramCacheKey(gt);let Lt=B.programs;B.environment=y.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(y.isMeshStandardMaterial?F:v).get(y.envMap||B.environment),B.envMapRotation=B.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,Lt===void 0&&(y.addEventListener("dispose",Dt),Lt=new Map,B.programs=Lt);let Ut=Lt.get(_t);if(Ut!==void 0){if(B.currentProgram===Ut&&B.lightsStateVersion===ct)return wo(y,gt),Ut}else gt.uniforms=Mt.getUniforms(y),y.onBeforeCompile(gt,M),Ut=Mt.acquireProgram(gt,_t),Lt.set(_t,Ut),B.uniforms=gt.uniforms;const vt=B.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(vt.clippingPlanes=j.uniform),wo(y,gt),B.needsLights=$c(y),B.lightsStateVersion=ct,B.needsLights&&(vt.ambientLightColor.value=D.state.ambient,vt.lightProbe.value=D.state.probe,vt.directionalLights.value=D.state.directional,vt.directionalLightShadows.value=D.state.directionalShadow,vt.spotLights.value=D.state.spot,vt.spotLightShadows.value=D.state.spotShadow,vt.rectAreaLights.value=D.state.rectArea,vt.ltc_1.value=D.state.rectAreaLTC1,vt.ltc_2.value=D.state.rectAreaLTC2,vt.pointLights.value=D.state.point,vt.pointLightShadows.value=D.state.pointShadow,vt.hemisphereLights.value=D.state.hemi,vt.directionalShadowMap.value=D.state.directionalShadowMap,vt.directionalShadowMatrix.value=D.state.directionalShadowMatrix,vt.spotShadowMap.value=D.state.spotShadowMap,vt.spotLightMatrix.value=D.state.spotLightMatrix,vt.spotLightMap.value=D.state.spotLightMap,vt.pointShadowMap.value=D.state.pointShadowMap,vt.pointShadowMatrix.value=D.state.pointShadowMatrix),B.currentProgram=Ut,B.uniformsList=null,Ut}function bo(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=ar.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function wo(y,I){const O=bt.get(y);O.outputColorSpace=I.outputColorSpace,O.batching=I.batching,O.batchingColor=I.batchingColor,O.instancing=I.instancing,O.instancingColor=I.instancingColor,O.instancingMorph=I.instancingMorph,O.skinning=I.skinning,O.morphTargets=I.morphTargets,O.morphNormals=I.morphNormals,O.morphColors=I.morphColors,O.morphTargetsCount=I.morphTargetsCount,O.numClippingPlanes=I.numClippingPlanes,O.numIntersection=I.numClipIntersection,O.vertexAlphas=I.vertexAlphas,O.vertexTangents=I.vertexTangents,O.toneMapping=I.toneMapping}function qc(y,I,O,B,D){I.isScene!==!0&&(I=le),E.resetTextureUnits();const Q=I.fog,ct=B.isMeshStandardMaterial?I.environment:null,gt=P===null?M.outputColorSpace:P.isXRRenderTarget===!0?P.texture.colorSpace:$i,_t=(B.isMeshStandardMaterial?F:v).get(B.envMap||ct),Lt=B.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,Ut=!!O.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),vt=!!O.morphAttributes.position,$t=!!O.morphAttributes.normal,ie=!!O.morphAttributes.color;let re=Yn;B.toneMapped&&(P===null||P.isXRRenderTarget===!0)&&(re=M.toneMapping);const Le=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,Jt=Le!==void 0?Le.length:0,yt=bt.get(B),mn=p.state.lights;if(et===!0&&(xt===!0||y!==x)){const Ve=y===x&&B.id===S;j.setState(B,y,Ve)}let Kt=!1;B.version===yt.__version?(yt.needsLights&&yt.lightsStateVersion!==mn.state.version||yt.outputColorSpace!==gt||D.isBatchedMesh&&yt.batching===!1||!D.isBatchedMesh&&yt.batching===!0||D.isBatchedMesh&&yt.batchingColor===!0&&D.colorTexture===null||D.isBatchedMesh&&yt.batchingColor===!1&&D.colorTexture!==null||D.isInstancedMesh&&yt.instancing===!1||!D.isInstancedMesh&&yt.instancing===!0||D.isSkinnedMesh&&yt.skinning===!1||!D.isSkinnedMesh&&yt.skinning===!0||D.isInstancedMesh&&yt.instancingColor===!0&&D.instanceColor===null||D.isInstancedMesh&&yt.instancingColor===!1&&D.instanceColor!==null||D.isInstancedMesh&&yt.instancingMorph===!0&&D.morphTexture===null||D.isInstancedMesh&&yt.instancingMorph===!1&&D.morphTexture!==null||yt.envMap!==_t||B.fog===!0&&yt.fog!==Q||yt.numClippingPlanes!==void 0&&(yt.numClippingPlanes!==j.numPlanes||yt.numIntersection!==j.numIntersection)||yt.vertexAlphas!==Lt||yt.vertexTangents!==Ut||yt.morphTargets!==vt||yt.morphNormals!==$t||yt.morphColors!==ie||yt.toneMapping!==re||yt.morphTargetsCount!==Jt)&&(Kt=!0):(Kt=!0,yt.__version=B.version);let Ke=yt.currentProgram;Kt===!0&&(Ke=Es(B,I,D));let vi=!1,Ne=!1,ts=!1;const ae=Ke.getUniforms(),rn=yt.uniforms;if(wt.useProgram(Ke.program)&&(vi=!0,Ne=!0,ts=!0),B.id!==S&&(S=B.id,Ne=!0),vi||x!==y){wt.buffers.depth.getReversed()?(at.copy(y.projectionMatrix),yu(at),Su(at),ae.setValue(U,"projectionMatrix",at)):ae.setValue(U,"projectionMatrix",y.projectionMatrix),ae.setValue(U,"viewMatrix",y.matrixWorldInverse);const Pn=ae.map.cameraPosition;Pn!==void 0&&Pn.setValue(U,It.setFromMatrixPosition(y.matrixWorld)),Vt.logarithmicDepthBuffer&&ae.setValue(U,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&ae.setValue(U,"isOrthographic",y.isOrthographicCamera===!0),x!==y&&(x=y,Ne=!0,ts=!0)}if(D.isSkinnedMesh){ae.setOptional(U,D,"bindMatrix"),ae.setOptional(U,D,"bindMatrixInverse");const Ve=D.skeleton;Ve&&(Ve.boneTexture===null&&Ve.computeBoneTexture(),ae.setValue(U,"boneTexture",Ve.boneTexture,E))}D.isBatchedMesh&&(ae.setOptional(U,D,"batchingTexture"),ae.setValue(U,"batchingTexture",D._matricesTexture,E),ae.setOptional(U,D,"batchingIdTexture"),ae.setValue(U,"batchingIdTexture",D._indirectTexture,E),ae.setOptional(U,D,"batchingColorTexture"),D._colorsTexture!==null&&ae.setValue(U,"batchingColorTexture",D._colorsTexture,E));const es=O.morphAttributes;if((es.position!==void 0||es.normal!==void 0||es.color!==void 0)&&Rt.update(D,O,Ke),(Ne||yt.receiveShadow!==D.receiveShadow)&&(yt.receiveShadow=D.receiveShadow,ae.setValue(U,"receiveShadow",D.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(rn.envMap.value=_t,rn.flipEnvMap.value=_t.isCubeTexture&&_t.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&I.environment!==null&&(rn.envMapIntensity.value=I.environmentIntensity),Ne&&(ae.setValue(U,"toneMappingExposure",M.toneMappingExposure),yt.needsLights&&Yc(rn,ts),Q&&B.fog===!0&&ot.refreshFogUniforms(rn,Q),ot.refreshMaterialUniforms(rn,B,H,tt,p.state.transmissionRenderTarget[y.id]),ar.upload(U,bo(yt),rn,E)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(ar.upload(U,bo(yt),rn,E),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&ae.setValue(U,"center",D.center),ae.setValue(U,"modelViewMatrix",D.modelViewMatrix),ae.setValue(U,"normalMatrix",D.normalMatrix),ae.setValue(U,"modelMatrix",D.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Ve=B.uniformsGroups;for(let Pn=0,Ln=Ve.length;Pn<Ln;Pn++){const Eo=Ve[Pn];L.update(Eo,Ke),L.bind(Eo,Ke)}}return Ke}function Yc(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function $c(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return P},this.setRenderTargetTextures=function(y,I,O){bt.get(y.texture).__webglTexture=I,bt.get(y.depthTexture).__webglTexture=O;const B=bt.get(y);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=O===void 0,B.__autoAllocateDepthBuffer||Ht.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,I){const O=bt.get(y);O.__webglFramebuffer=I,O.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,O=0){P=y,T=I,A=O;let B=!0,D=null,Q=!1,ct=!1;if(y){const _t=bt.get(y);if(_t.__useDefaultFramebuffer!==void 0)wt.bindFramebuffer(U.FRAMEBUFFER,null),B=!1;else if(_t.__webglFramebuffer===void 0)E.setupRenderTarget(y);else if(_t.__hasExternalTextures)E.rebindTextures(y,bt.get(y.texture).__webglTexture,bt.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const vt=y.depthTexture;if(_t.__boundDepthTexture!==vt){if(vt!==null&&bt.has(vt)&&(y.width!==vt.image.width||y.height!==vt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(y)}}const Lt=y.texture;(Lt.isData3DTexture||Lt.isDataArrayTexture||Lt.isCompressedArrayTexture)&&(ct=!0);const Ut=bt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Ut[I])?D=Ut[I][O]:D=Ut[I],Q=!0):y.samples>0&&E.useMultisampledRTT(y)===!1?D=bt.get(y).__webglMultisampledFramebuffer:Array.isArray(Ut)?D=Ut[O]:D=Ut,R.copy(y.viewport),z.copy(y.scissor),k=y.scissorTest}else R.copy(St).multiplyScalar(H).floor(),z.copy(zt).multiplyScalar(H).floor(),k=ee;if(wt.bindFramebuffer(U.FRAMEBUFFER,D)&&B&&wt.drawBuffers(y,D),wt.viewport(R),wt.scissor(z),wt.setScissorTest(k),Q){const _t=bt.get(y.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+I,_t.__webglTexture,O)}else if(ct){const _t=bt.get(y.texture),Lt=I||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,_t.__webglTexture,O||0,Lt)}S=-1},this.readRenderTargetPixels=function(y,I,O,B,D,Q,ct){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let gt=bt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ct!==void 0&&(gt=gt[ct]),gt){wt.bindFramebuffer(U.FRAMEBUFFER,gt);try{const _t=y.texture,Lt=_t.format,Ut=_t.type;if(!Vt.textureFormatReadable(Lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Vt.textureTypeReadable(Ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-B&&O>=0&&O<=y.height-D&&U.readPixels(I,O,B,D,Ft.convert(Lt),Ft.convert(Ut),Q)}finally{const _t=P!==null?bt.get(P).__webglFramebuffer:null;wt.bindFramebuffer(U.FRAMEBUFFER,_t)}}},this.readRenderTargetPixelsAsync=async function(y,I,O,B,D,Q,ct){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let gt=bt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ct!==void 0&&(gt=gt[ct]),gt){const _t=y.texture,Lt=_t.format,Ut=_t.type;if(!Vt.textureFormatReadable(Lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Vt.textureTypeReadable(Ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=y.width-B&&O>=0&&O<=y.height-D){wt.bindFramebuffer(U.FRAMEBUFFER,gt);const vt=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,vt),U.bufferData(U.PIXEL_PACK_BUFFER,Q.byteLength,U.STREAM_READ),U.readPixels(I,O,B,D,Ft.convert(Lt),Ft.convert(Ut),0);const $t=P!==null?bt.get(P).__webglFramebuffer:null;wt.bindFramebuffer(U.FRAMEBUFFER,$t);const ie=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Mu(U,ie,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,vt),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Q),U.deleteBuffer(vt),U.deleteSync(ie),Q}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(y,I=null,O=0){y.isTexture!==!0&&(hs("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,y=arguments[1]);const B=Math.pow(2,-O),D=Math.floor(y.image.width*B),Q=Math.floor(y.image.height*B),ct=I!==null?I.x:0,gt=I!==null?I.y:0;E.setTexture2D(y,0),U.copyTexSubImage2D(U.TEXTURE_2D,O,0,0,ct,gt,D,Q),wt.unbindTexture()},this.copyTextureToTexture=function(y,I,O=null,B=null,D=0){y.isTexture!==!0&&(hs("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,y=arguments[1],I=arguments[2],D=arguments[3]||0,O=null);let Q,ct,gt,_t,Lt,Ut,vt,$t,ie;const re=y.isCompressedTexture?y.mipmaps[D]:y.image;O!==null?(Q=O.max.x-O.min.x,ct=O.max.y-O.min.y,gt=O.isBox3?O.max.z-O.min.z:1,_t=O.min.x,Lt=O.min.y,Ut=O.isBox3?O.min.z:0):(Q=re.width,ct=re.height,gt=re.depth||1,_t=0,Lt=0,Ut=0),B!==null?(vt=B.x,$t=B.y,ie=B.z):(vt=0,$t=0,ie=0);const Le=Ft.convert(I.format),Jt=Ft.convert(I.type);let yt;I.isData3DTexture?(E.setTexture3D(I,0),yt=U.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(E.setTexture2DArray(I,0),yt=U.TEXTURE_2D_ARRAY):(E.setTexture2D(I,0),yt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,I.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,I.unpackAlignment);const mn=U.getParameter(U.UNPACK_ROW_LENGTH),Kt=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ke=U.getParameter(U.UNPACK_SKIP_PIXELS),vi=U.getParameter(U.UNPACK_SKIP_ROWS),Ne=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,re.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,re.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,_t),U.pixelStorei(U.UNPACK_SKIP_ROWS,Lt),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ut);const ts=y.isDataArrayTexture||y.isData3DTexture,ae=I.isDataArrayTexture||I.isData3DTexture;if(y.isRenderTargetTexture||y.isDepthTexture){const rn=bt.get(y),es=bt.get(I),Ve=bt.get(rn.__renderTarget),Pn=bt.get(es.__renderTarget);wt.bindFramebuffer(U.READ_FRAMEBUFFER,Ve.__webglFramebuffer),wt.bindFramebuffer(U.DRAW_FRAMEBUFFER,Pn.__webglFramebuffer);for(let Ln=0;Ln<gt;Ln++)ts&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,bt.get(y).__webglTexture,D,Ut+Ln),y.isDepthTexture?(ae&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,bt.get(I).__webglTexture,D,ie+Ln),U.blitFramebuffer(_t,Lt,Q,ct,vt,$t,Q,ct,U.DEPTH_BUFFER_BIT,U.NEAREST)):ae?U.copyTexSubImage3D(yt,D,vt,$t,ie+Ln,_t,Lt,Q,ct):U.copyTexSubImage2D(yt,D,vt,$t,ie+Ln,_t,Lt,Q,ct);wt.bindFramebuffer(U.READ_FRAMEBUFFER,null),wt.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else ae?y.isDataTexture||y.isData3DTexture?U.texSubImage3D(yt,D,vt,$t,ie,Q,ct,gt,Le,Jt,re.data):I.isCompressedArrayTexture?U.compressedTexSubImage3D(yt,D,vt,$t,ie,Q,ct,gt,Le,re.data):U.texSubImage3D(yt,D,vt,$t,ie,Q,ct,gt,Le,Jt,re):y.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,D,vt,$t,Q,ct,Le,Jt,re.data):y.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,D,vt,$t,re.width,re.height,Le,re.data):U.texSubImage2D(U.TEXTURE_2D,D,vt,$t,Q,ct,Le,Jt,re);U.pixelStorei(U.UNPACK_ROW_LENGTH,mn),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Kt),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ke),U.pixelStorei(U.UNPACK_SKIP_ROWS,vi),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ne),D===0&&I.generateMipmaps&&U.generateMipmap(yt),wt.unbindTexture()},this.copyTextureToTexture3D=function(y,I,O=null,B=null,D=0){return y.isTexture!==!0&&(hs("WebGLRenderer: copyTextureToTexture3D function signature has changed."),O=arguments[0]||null,B=arguments[1]||null,y=arguments[2],I=arguments[3],D=arguments[4]||0),hs('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(y,I,O,B,D)},this.initRenderTarget=function(y){bt.get(y).__webglFramebuffer===void 0&&E.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?E.setTextureCube(y,0):y.isData3DTexture?E.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?E.setTexture2DArray(y,0):E.setTexture2D(y,0),wt.unbindTexture()},this.resetState=function(){T=0,A=0,P=null,wt.reset(),ne.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=Yt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Yt._getUnpackColorSpace()}}class lo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Bt(t),this.near=e,this.far=n}clone(){return new lo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class I0 extends de{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new sn,this.environmentIntensity=1,this.environmentRotation=new sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class D0 extends Ee{constructor(t=null,e=1,n=1,s,r,a,o,l,c=ze,u=ze,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class qa extends $e{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Ui=new te,Il=new te,Ys=[],Dl=new mi,U0=new te,as=new nt,os=new Zi;class Xn extends nt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qa(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,U0)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new mi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ui),Dl.copy(t.boundingBox).applyMatrix4(Ui),this.boundingBox.union(Dl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Ui),os.copy(t.boundingSphere).applyMatrix4(Ui),this.boundingSphere.union(os)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=s[a+o]}raycast(t,e){const n=this.matrixWorld,s=this.count;if(as.geometry=this.geometry,as.material=this.material,as.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),os.copy(this.boundingSphere),os.applyMatrix4(n),t.ray.intersectsSphere(os)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,Ui),Il.multiplyMatrices(n,Ui),as.matrixWorld=Il,as.raycast(t,Ys);for(let a=0,o=Ys.length;a<o;a++){const l=Ys[a];l.instanceId=r,l.object=this,e.push(l)}Ys.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new D0(new Float32Array(s*this.count),s,this.count,to,un));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=s*t;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class Nc extends gi{static get type(){return"PointsMaterial"}constructor(t){super(),this.isPointsMaterial=!0,this.color=new Bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Ul=new te,Ya=new Mc,$s=new Zi,Js=new C;class N0 extends de{constructor(t=new Pe,e=new Nc){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),$s.copy(n.boundingSphere),$s.applyMatrix4(s),$s.radius+=r,t.ray.intersectsSphere($s)===!1)return;Ul.copy(s).invert(),Ya.copy(t.ray).applyMatrix4(Ul);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),m=Math.min(c.count,a.start+a.count);for(let g=d,_=m;g<_;g++){const f=c.getX(g);Js.fromBufferAttribute(h,f),Nl(Js,f,l,s,t,e,this)}}else{const d=Math.max(0,a.start),m=Math.min(h.count,a.start+a.count);for(let g=d,_=m;g<_;g++)Js.fromBufferAttribute(h,g),Nl(Js,g,l,s,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Nl(i,t,e,n,s,r,a){const o=Ya.distanceSqToPoint(i);if(o<e){const l=new C;Ya.closestPointToPoint(i,l),l.applyMatrix4(n);const c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class F0 extends Ee{constructor(t,e,n,s,r,a,o,l,c){super(t,e,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class fn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const u=n[s],d=n[s+1]-u,m=(a-u)/d;return(s+m)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ut:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new C,s=[],r=[],a=[],o=new C,l=new te;for(let m=0;m<=t;m++){const g=m/t;s[m]=this.getTangentAt(g,new C)}r[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=t;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(xe(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,g))}a[m].crossVectors(s[m],r[m])}if(e===!0){let m=Math.acos(xe(r[0].dot(r[t]),-1,1));m/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(m=-m);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],m*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class co extends fn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ut){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,m=c-this.aY;l=d*u-m*h+this.aX,c=d*h+m*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class O0 extends co{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ho(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,h){let d=(a-r)/c-(o-r)/(c+u)+(o-a)/u,m=(o-a)/u-(l-a)/(u+h)+(l-o)/h;d*=u,m*=u,s(a,o,d,m)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Ks=new C,ta=new ho,ea=new ho,na=new ho;class B0 extends fn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new C){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=s[(o-1)%r]:(Ks.subVectors(s[0],s[1]).add(s[0]),c=Ks);const h=s[o%r],d=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Ks.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Ks),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),m),_=Math.pow(h.distanceToSquared(d),m),f=Math.pow(d.distanceToSquared(u),m);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),ta.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,_,f),ea.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,_,f),na.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,_,f)}else this.curveType==="catmullrom"&&(ta.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),ea.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),na.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(ta.calc(l),ea.calc(l),na.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new C().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Fl(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function k0(i,t){const e=1-i;return e*e*t}function z0(i,t){return 2*(1-i)*i*t}function G0(i,t){return i*i*t}function ps(i,t,e,n){return k0(i,t)+z0(i,e)+G0(i,n)}function H0(i,t){const e=1-i;return e*e*e*t}function V0(i,t){const e=1-i;return 3*e*e*i*t}function W0(i,t){return 3*(1-i)*i*i*t}function X0(i,t){return i*i*i*t}function ms(i,t,e,n,s){return H0(i,t)+V0(i,e)+W0(i,n)+X0(i,s)}class Fc extends fn{constructor(t=new ut,e=new ut,n=new ut,s=new ut){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ms(t,s.x,r.x,a.x,o.x),ms(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class q0 extends fn{constructor(t=new C,e=new C,n=new C,s=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ms(t,s.x,r.x,a.x,o.x),ms(t,s.y,r.y,a.y,o.y),ms(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Oc extends fn{constructor(t=new ut,e=new ut){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ut){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ut){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Y0 extends fn{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Bc extends fn{constructor(t=new ut,e=new ut,n=new ut){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ut){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ps(t,s.x,r.x,a.x),ps(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class $0 extends fn{constructor(t=new C,e=new C,n=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new C){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ps(t,s.x,r.x,a.x),ps(t,s.y,r.y,a.y),ps(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class kc extends fn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ut){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],u=s[a>s.length-2?s.length-1:a+1],h=s[a>s.length-3?s.length-1:a+2];return n.set(Fl(o,l.x,c.x,u.x,h.x),Fl(o,l.y,c.y,u.y,h.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ut().fromArray(s))}return this}}var Ol=Object.freeze({__proto__:null,ArcCurve:O0,CatmullRomCurve3:B0,CubicBezierCurve:Fc,CubicBezierCurve3:q0,EllipseCurve:co,LineCurve:Oc,LineCurve3:Y0,QuadraticBezierCurve:Bc,QuadraticBezierCurve3:$0,SplineCurve:kc});class J0 extends fn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ol[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Ol[s.type]().fromJSON(s))}return this}}class K0 extends J0{constructor(t){super(),this.type="Path",this.currentPoint=new ut,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Oc(this.currentPoint.clone(),new ut(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Bc(this.currentPoint.clone(),new ut(t,e),new ut(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Fc(this.currentPoint.clone(),new ut(t,e),new ut(n,s),new ut(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new kc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new co(t,e,n,s,r,a,o,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class uo extends Pe{constructor(t=[new ut(0,-.5),new ut(.5,0),new ut(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=xe(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],u=1/e,h=new C,d=new ut,m=new C,g=new C,_=new C;let f=0,p=0;for(let b=0;b<=t.length-1;b++)switch(b){case 0:f=t[b+1].x-t[b].x,p=t[b+1].y-t[b].y,m.x=p*1,m.y=-f,m.z=p*0,_.copy(m),m.normalize(),l.push(m.x,m.y,m.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:f=t[b+1].x-t[b].x,p=t[b+1].y-t[b].y,m.x=p*1,m.y=-f,m.z=p*0,g.copy(m),m.x+=_.x,m.y+=_.y,m.z+=_.z,m.normalize(),l.push(m.x,m.y,m.z),_.copy(g)}for(let b=0;b<=e;b++){const w=n+b*u*s,M=Math.sin(w),N=Math.cos(w);for(let T=0;T<=t.length-1;T++){h.x=t[T].x*M,h.y=t[T].y,h.z=t[T].x*N,a.push(h.x,h.y,h.z),d.x=b/e,d.y=T/(t.length-1),o.push(d.x,d.y);const A=l[3*T+0]*M,P=l[3*T+1],S=l[3*T+0]*N;c.push(A,P,S)}}for(let b=0;b<e;b++)for(let w=0;w<t.length-1;w++){const M=w+b*t.length,N=M,T=M+t.length,A=M+t.length+1,P=M+1;r.push(N,T,P),r.push(A,P,T)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uo(t.points,t.segments,t.phiStart,t.phiLength)}}class Vn extends uo{constructor(t=1,e=1,n=4,s=8){const r=new K0;r.absarc(0,-e/2,t,Math.PI*1.5,0),r.absarc(0,e/2,t,0,Math.PI*.5),super(r.getPoints(n),s),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:s}}static fromJSON(t){return new Vn(t.radius,t.length,t.capSegments,t.radialSegments)}}class di extends Pe{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],a=[],o=[],l=[],c=new C,u=new ut;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let h=0,d=3;h<=e;h++,d+=3){const m=n+h/e*s;c.x=t*Math.cos(m),c.y=t*Math.sin(m),a.push(c.x,c.y,c.z),o.push(0,0,1),u.x=(a[d]/t+1)/2,u.y=(a[d+1]/t+1)/2,l.push(u.x,u.y)}for(let h=1;h<=e;h++)r.push(h,h+1,0);this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("normal",new oe(o,3)),this.setAttribute("uv",new oe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new di(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Ce extends Pe{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],m=[];let g=0;const _=[],f=n/2;let p=0;b(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(u),this.setAttribute("position",new oe(h,3)),this.setAttribute("normal",new oe(d,3)),this.setAttribute("uv",new oe(m,2));function b(){const M=new C,N=new C;let T=0;const A=(e-t)/n;for(let P=0;P<=r;P++){const S=[],x=P/r,R=x*(e-t)+t;for(let z=0;z<=s;z++){const k=z/s,V=k*l+o,K=Math.sin(V),W=Math.cos(V);N.x=R*K,N.y=-x*n+f,N.z=R*W,h.push(N.x,N.y,N.z),M.set(K,A,W).normalize(),d.push(M.x,M.y,M.z),m.push(k,1-x),S.push(g++)}_.push(S)}for(let P=0;P<s;P++)for(let S=0;S<r;S++){const x=_[S][P],R=_[S+1][P],z=_[S+1][P+1],k=_[S][P+1];(t>0||S!==0)&&(u.push(x,R,k),T+=3),(e>0||S!==r-1)&&(u.push(R,z,k),T+=3)}c.addGroup(p,T,0),p+=T}function w(M){const N=g,T=new ut,A=new C;let P=0;const S=M===!0?t:e,x=M===!0?1:-1;for(let z=1;z<=s;z++)h.push(0,f*x,0),d.push(0,x,0),m.push(.5,.5),g++;const R=g;for(let z=0;z<=s;z++){const V=z/s*l+o,K=Math.cos(V),W=Math.sin(V);A.x=S*W,A.y=f*x,A.z=S*K,h.push(A.x,A.y,A.z),d.push(0,x,0),T.x=K*.5+.5,T.y=W*.5*x+.5,m.push(T.x,T.y),g++}for(let z=0;z<s;z++){const k=N+z,V=R+z;M===!0?u.push(V,V+1,k):u.push(V+1,V,k),P+=3}c.addGroup(p,P,M===!0?1:2),p+=P}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class En extends Ce{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new En(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class yr extends Pe{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],a=[];o(s),c(n),u(),this.setAttribute("position",new oe(r,3)),this.setAttribute("normal",new oe(r.slice(),3)),this.setAttribute("uv",new oe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(b){const w=new C,M=new C,N=new C;for(let T=0;T<e.length;T+=3)m(e[T+0],w),m(e[T+1],M),m(e[T+2],N),l(w,M,N,b)}function l(b,w,M,N){const T=N+1,A=[];for(let P=0;P<=T;P++){A[P]=[];const S=b.clone().lerp(M,P/T),x=w.clone().lerp(M,P/T),R=T-P;for(let z=0;z<=R;z++)z===0&&P===T?A[P][z]=S:A[P][z]=S.clone().lerp(x,z/R)}for(let P=0;P<T;P++)for(let S=0;S<2*(T-P)-1;S++){const x=Math.floor(S/2);S%2===0?(d(A[P][x+1]),d(A[P+1][x]),d(A[P][x])):(d(A[P][x+1]),d(A[P+1][x+1]),d(A[P+1][x]))}}function c(b){const w=new C;for(let M=0;M<r.length;M+=3)w.x=r[M+0],w.y=r[M+1],w.z=r[M+2],w.normalize().multiplyScalar(b),r[M+0]=w.x,r[M+1]=w.y,r[M+2]=w.z}function u(){const b=new C;for(let w=0;w<r.length;w+=3){b.x=r[w+0],b.y=r[w+1],b.z=r[w+2];const M=f(b)/2/Math.PI+.5,N=p(b)/Math.PI+.5;a.push(M,1-N)}g(),h()}function h(){for(let b=0;b<a.length;b+=6){const w=a[b+0],M=a[b+2],N=a[b+4],T=Math.max(w,M,N),A=Math.min(w,M,N);T>.9&&A<.1&&(w<.2&&(a[b+0]+=1),M<.2&&(a[b+2]+=1),N<.2&&(a[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function m(b,w){const M=b*3;w.x=t[M+0],w.y=t[M+1],w.z=t[M+2]}function g(){const b=new C,w=new C,M=new C,N=new C,T=new ut,A=new ut,P=new ut;for(let S=0,x=0;S<r.length;S+=9,x+=6){b.set(r[S+0],r[S+1],r[S+2]),w.set(r[S+3],r[S+4],r[S+5]),M.set(r[S+6],r[S+7],r[S+8]),T.set(a[x+0],a[x+1]),A.set(a[x+2],a[x+3]),P.set(a[x+4],a[x+5]),N.copy(b).add(w).add(M).divideScalar(3);const R=f(N);_(T,x+0,b,R),_(A,x+2,w,R),_(P,x+4,M,R)}}function _(b,w,M,N){N<0&&b.x===1&&(a[w]=b.x-1),M.x===0&&M.z===0&&(a[w]=N/2/Math.PI+.5)}function f(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new yr(t.vertices,t.indices,t.radius,t.details)}}class fo extends yr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new fo(t.radius,t.detail)}}class po extends yr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new po(t.radius,t.detail)}}class me extends Pe{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],h=new C,d=new C,m=[],g=[],_=[],f=[];for(let p=0;p<=n;p++){const b=[],w=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&l===Math.PI&&(M=-.5/e);for(let N=0;N<=e;N++){const T=N/e;h.x=-t*Math.cos(s+T*r)*Math.sin(a+w*o),h.y=t*Math.cos(a+w*o),h.z=t*Math.sin(s+T*r)*Math.sin(a+w*o),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),f.push(T+M,1-w),b.push(c++)}u.push(b)}for(let p=0;p<n;p++)for(let b=0;b<e;b++){const w=u[p][b+1],M=u[p][b],N=u[p+1][b],T=u[p+1][b+1];(p!==0||a>0)&&m.push(w,M,T),(p!==n-1||l<Math.PI)&&m.push(M,N,T)}this.setIndex(m),this.setAttribute("position",new oe(g,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new me(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Xe extends Pe{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const a=[],o=[],l=[],c=[],u=new C,h=new C,d=new C;for(let m=0;m<=n;m++)for(let g=0;g<=s;g++){const _=g/s*r,f=m/n*Math.PI*2;h.x=(t+e*Math.cos(f))*Math.cos(_),h.y=(t+e*Math.cos(f))*Math.sin(_),h.z=e*Math.sin(f),o.push(h.x,h.y,h.z),u.x=t*Math.cos(_),u.y=t*Math.sin(_),d.subVectors(h,u).normalize(),l.push(d.x,d.y,d.z),c.push(g/s),c.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=s;g++){const _=(s+1)*m+g-1,f=(s+1)*(m-1)+g-1,p=(s+1)*(m-1)+g,b=(s+1)*m+g;a.push(_,f,b),a.push(f,p,b)}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Z0 extends gi{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new Bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=so,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Sr extends gi{static get type(){return"MeshPhongMaterial"}constructor(t){super(),this.isMeshPhongMaterial=!0,this.color=new Bt(16777215),this.specular=new Bt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=so,this.normalScale=new ut(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new sn,this.combine=Ka,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class mo extends de{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class j0 extends mo{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ia=new te,Bl=new C,kl=new C;class zc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ut(512,512),this.map=null,this.mapPass=null,this.matrix=new te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ao,this._frameExtents=new ut(1,1),this._viewportCount=1,this._viewports=[new Qt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Bl.setFromMatrixPosition(t.matrixWorld),e.position.copy(Bl),kl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(kl),e.updateMatrixWorld(),ia.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ia),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ia)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const zl=new te,ls=new C,sa=new C;class Q0 extends zc{constructor(){super(new ke(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new ut(4,2),this._viewportCount=6,this._viewports=[new Qt(2,1,1,1),new Qt(0,1,1,1),new Qt(3,1,1,1),new Qt(1,1,1,1),new Qt(3,0,1,1),new Qt(1,0,1,1)],this._cubeDirections=[new C(1,0,0),new C(-1,0,0),new C(0,0,1),new C(0,0,-1),new C(0,1,0),new C(0,-1,0)],this._cubeUps=[new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,1,0),new C(0,0,1),new C(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,s=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),ls.setFromMatrixPosition(t.matrixWorld),n.position.copy(ls),sa.copy(n.position),sa.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(sa),n.updateMatrixWorld(),s.makeTranslation(-ls.x,-ls.y,-ls.z),zl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zl)}}class tg extends mo{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new Q0}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class eg extends zc{constructor(){super(new Rc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ng extends mo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(de.DEFAULT_UP),this.updateMatrix(),this.target=new de,this.shadow=new eg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ja}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ja);function _i(i,t,e){const n=document.createElement("canvas");n.width=i,n.height=t,e(n.getContext("2d"),i,t);const s=new F0(n);return s.colorSpace=Ie,s.anisotropy=4,s.needsUpdate=!0,s}function ig(){const i=_i(512,512,(t,e)=>{t.fillStyle="#17124a",t.fillRect(0,0,e,e);const n=64;for(let r=0;r<8;r++)for(let a=0;a<8;a++)t.fillStyle=(a+r)%2===0?"#1c1658":"#151045",t.fillRect(a*n,r*n,n,n);t.strokeStyle="rgba(120, 210, 255, 0.16)",t.lineWidth=2;for(let r=0;r<=8;r++){const a=r/8*e;t.beginPath(),t.moveTo(a,0),t.lineTo(a,e),t.stroke(),t.beginPath(),t.moveTo(0,a),t.lineTo(e,a),t.stroke()}const s=t.createLinearGradient(214,0,298,0);s.addColorStop(0,"rgba(255, 214, 70, 0)"),s.addColorStop(.35,"rgba(255, 224, 90, 0.55)"),s.addColorStop(.5,"rgba(255, 236, 120, 0.95)"),s.addColorStop(.65,"rgba(255, 224, 90, 0.55)"),s.addColorStop(1,"rgba(255, 214, 70, 0)"),t.fillStyle=s,t.fillRect(222,0,68,e),t.fillStyle="rgba(12, 10, 40, 0.55)";for(let r=8;r<e;r+=48)t.fillRect(244,r,24,22)});return i.wrapS=vs,i.wrapT=vs,i}function sg(i,t){return _i(512,320,(e,n,s)=>{e.clearRect(0,0,n,s),e.fillStyle=t?"rgba(36, 255, 130, 0.22)":"rgba(255, 48, 88, 0.26)",pr(e,18,18,n-36,s-36,36),e.fill(),e.strokeStyle=t?"rgba(210, 255, 230, 0.95)":"rgba(255, 210, 220, 0.95)",e.lineWidth=14,e.stroke(),e.strokeStyle=t?"rgba(0, 80, 40, 0.35)":"rgba(80, 0, 20, 0.35)",e.lineWidth=4,pr(e,32,32,n-64,s-64,26),e.stroke(),e.textAlign="center",e.textBaseline="middle",e.font="900 128px Trebuchet MS, Arial Black, sans-serif",e.lineJoin="round",e.miterLimit=2,e.strokeStyle=t?"rgba(0, 50, 20, 0.7)":"rgba(60, 0, 16, 0.7)",e.lineWidth=18,e.strokeText(i,n/2,s/2+6),e.fillStyle="#fffef8",e.fillText(i,n/2,s/2+6)})}function rg(){return _i(128,128,(i,t)=>{i.fillStyle="#141018",i.fillRect(0,0,t,t),i.save(),i.translate(t/2,t/2),i.rotate(-.72),i.fillStyle="#ffd24a";for(let e=-5;e<6;e++)i.fillRect(-t,e*26-7,t*3,13);i.restore(),i.strokeStyle="rgba(255,255,255,0.18)",i.lineWidth=6,i.strokeRect(4,4,t-8,t-8)})}function ag(){return _i(256,256,(i,t)=>{const e=t/2;i.clearRect(0,0,t,t);const n=i.createRadialGradient(e,e,2,e,e,e);n.addColorStop(0,"#000000"),n.addColorStop(.22,"#05010a"),n.addColorStop(.48,"#1a0838"),n.addColorStop(.72,"#4a1a88"),n.addColorStop(.88,"#7a5cff"),n.addColorStop(1,"rgba(20, 8, 40, 0)"),i.fillStyle=n,i.beginPath(),i.arc(e,e,e-2,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(180, 150, 255, 0.55)",i.lineWidth=5;for(let s=0;s<5;s++){i.beginPath();for(let r=0;r<=42;r++){const a=r/42,o=a*Math.PI*3.2+s/5*Math.PI*2,l=10+a*(e-16),c=e+Math.cos(o)*l,u=e+Math.sin(o)*l;r===0?i.moveTo(c,u):i.lineTo(c,u)}i.stroke()}i.fillStyle="#000000",i.beginPath(),i.arc(e,e,e*.28,0,Math.PI*2),i.fill()})}function og(){return _i(256,256,(i,t)=>{const e=t/2,n=i.createRadialGradient(e*.42,e*.38,8,e,e,e-2);n.addColorStop(0,"#fff8c8"),n.addColorStop(.18,"#ffe566"),n.addColorStop(.45,"#ffd24a"),n.addColorStop(.72,"#f0b429"),n.addColorStop(1,"#d49a12"),i.fillStyle=n,i.beginPath(),i.arc(e,e,e-2,0,Math.PI*2),i.fill(),i.strokeStyle="#fff3a0",i.lineWidth=10,i.beginPath(),i.arc(e,e,e-12,0,Math.PI*2),i.stroke(),i.strokeStyle="#e0a020",i.lineWidth=4,i.beginPath(),i.arc(e,e,e-22,0,Math.PI*2),i.stroke(),i.strokeStyle="rgba(255,230,140,0.7)",i.lineWidth=3;for(let s=0;s<24;s++){const r=s/24*Math.PI*2;i.beginPath(),i.moveTo(e+Math.cos(r)*(e-8),e+Math.sin(r)*(e-8)),i.lineTo(e+Math.cos(r)*(e-16),e+Math.sin(r)*(e-16)),i.stroke()}i.fillStyle="#7a4a00",i.font="900 118px Trebuchet MS, Arial Black, sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText("B",e,e+6),i.fillStyle="rgba(255,248,200,0.7)",i.fillText("B",e-3,e+2)})}function Gl(i,t=!1){return _i(320,160,(e,n,s)=>{e.clearRect(0,0,n,s);const r=e.createLinearGradient(0,0,0,s);r.addColorStop(0,t?"#5a1808":"#3a0c14"),r.addColorStop(1,"#120408"),e.fillStyle=r,pr(e,8,10,n-16,s-20,22),e.fill(),e.strokeStyle=t?"#ffd166":"#ff6b8a",e.lineWidth=6,e.stroke(),e.fillStyle=t?"#ffe08a":"#ff9ab0",e.font="800 22px Nunito, sans-serif",e.textAlign="center",e.textBaseline="middle",e.fillText(t?"FINAL RIVALS":"RIVALS",n/2,38),e.fillStyle="#fff5f2",e.font="900 78px Nunito, sans-serif",e.fillText(String(Math.max(0,i|0)),n/2,100)})}function lg(i,t="#1a1a1a",e="#ffffff"){return _i(256,128,(n,s,r)=>{n.clearRect(0,0,s,r),n.fillStyle=t,pr(n,8,16,s-16,r-32,28),n.fill(),n.strokeStyle=e,n.lineWidth=8,n.stroke(),n.fillStyle=e,n.font="900 72px Nunito, Trebuchet MS, sans-serif",n.textAlign="center",n.textBaseline="middle",n.fillText(String(Math.max(0,i|0)),s/2,r/2+2)})}function pr(i,t,e,n,s,r){i.beginPath(),i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath()}const tn=56;function cg(i){return{tx:0,tz:0,x:0,y:.28,z:0,vx:0,vz:0,phase:i*1.17,freq:9.2+i%5*.55,appear:1,knock:0,sink:!1,sinkX:0,sinkZ:0}}class hg{constructor(t){this.scene=t,this.count=1,this.x=0,this.z=0,this.targetX=0,this.squash=1,this.flash=0,this.lean=0,this.compress=1,this.celebrate=0,this.runTime=0,this.group=new ue,t.add(this.group);const e=new me(.24,12,10),n=new Z0({color:13041482,emissive:7077658,emissiveIntensity:1.05,roughness:.22,metalness:.12});this.mesh=new Xn(e,n,tn),this.mesh.instanceMatrix.setUsage(hr),this.mesh.instanceColor=new qa(new Float32Array(tn*3),3),this.mesh.frustumCulled=!1,this.group.add(this.mesh),this.banner=new nt(new dn(1.2,.56),new Re({transparent:!0,depthWrite:!1})),this.banner.position.set(0,1.5,0),this.banner.visible=!1,this.aura=new nt(new me(.95,10,8),new Re({color:6746367,transparent:!0,opacity:0,depthWrite:!1})),this.group.add(this.aura),this.trailDummy=new de,this.trailMesh=new Xn(new me(.1,6,6),new Re({color:13041482,transparent:!0,opacity:.32,depthWrite:!1}),12),this.trailMesh.instanceMatrix.setUsage(hr),this.trailMesh.count=0,this.trailMesh.frustumCulled=!1,t.add(this.trailMesh),this.trail=[],this.shadow=new nt(new di(.55,16),new Re({color:656920,transparent:!0,opacity:.36,depthWrite:!1})),this.shadow.rotation.x=-Math.PI/2,this.shadow.position.y=.03,this.shadow.renderOrder=1,this.group.add(this.shadow),this.dummy=new de,this._color=new Bt,this.slots=Array.from({length:tn},(s,r)=>cg(r)),this._baseEmissive=1.05,this._rebuildTargets(8)}applySkin(t,e=0){const n=nh(t);if(this.mesh.material.color.setHex(n.color),n.id==="rainbow"){const s=e*.12%1;this.mesh.material.color.setHSL(s,.85,.6),this.mesh.material.emissive.setHSL((s+.15)%1,.9,.4)}else this.mesh.material.emissive.setHex(n.emissive);this.mesh.material.emissiveIntensity=this._baseEmissive+this.flash+(this.shielded?.55:0),this.aura&&(this.aura.material.color.setHex(this.shielded?6746367:n.color),this.aura.material.opacity=this.shielded?.26:this.flash>.2?.14:.04),this.shielded&&n.id!=="rainbow"&&this.mesh.material.emissive.lerp(this._color.setHex(6746367),.45),this._lastTint!==n.id&&(this._lastTint=n.id,this._tintInstances(n))}_tintInstances(t){const e=this._color.setHex(t.color);for(let n=0;n<tn;n++){const s=n*17%9/40;this.mesh.setColorAt(n,this._color.setRGB(Math.min(1,e.r+s*.14),Math.min(1,e.g+s*.06),Math.min(1,e.b+(1-s)*.1)))}this.mesh.instanceColor&&(this.mesh.instanceColor.needsUpdate=!0)}impact(t){t==="good"?this.squash=1.42:t==="bad"?this.squash=.58:t==="land"&&(this.squash=.76),this.flash=t==="bad"?1.6:.95}_rebuildTargets(t){const e=Math.min(tn,Math.max(1,t));for(let n=0;n<e;n++){const s=n*2.399963+.31*Math.sin(n*1.7),r=.2*Math.sqrt(n)*(1+.08*Math.sin(n*2.2)),a=n>4?-(r*.42)-Math.sqrt(n)*.045:-r*.22;this.slots[n].tx=Math.cos(s)*r*1.05,this.slots[n].tz=Math.sin(s)*r*.72+a}}setCount(t,e={}){const n=Math.max(0,Math.floor(t)),s=this.count,r=Math.min(tn,Math.max(1,s)),a=Math.min(tn,Math.max(1,n));if(this._rebuildTargets(n||1),n>s){const o=e.spawnFrom||{x:0,z:.8};for(let l=r;l<a;l++){const c=this.slots[l];c.x=o.x+(Math.random()-.5)*.35,c.z=o.z+Math.random()*.25,c.y=.45,c.appear=0,c.knock=0,c.vx=(c.tx-c.x)*2.4,c.vz=(c.tz-c.z)*2.4}}else if(n<s&&(e.knock||e.sink)){const o=Math.min(tn,r)-a,l=e.sinkToward||{x:0,z:0};for(let c=0;c<o;c++){const u=this.slots[a+c];u&&(u.sink=!!e.sink,u.sinkX=l.x,u.sinkZ=l.z,u.knock=e.sink?.85+Math.random()*.15:.55+Math.random()*.25,u.vx=e.sink?l.x*3.2+(Math.random()-.5)*1.2:(Math.random()-.5)*6,u.vz=e.sink?l.z*3.2+(Math.random()-.5)*.8:-2-Math.random()*3)}}this.count=n,this._refreshBanner()}_refreshBanner(){this.banner&&(this._badgeMap?.dispose?.(),this._badgeMap=lg(this.count,"#141414","#d8ff4a"),this.banner.material.map=this._badgeMap,this.banner.material.needsUpdate=!0)}reset(t){this.x=0,this.z=0,this.targetX=0,this.squash=1,this.flash=0,this.lean=0,this.compress=1,this.celebrate=0,this.runTime=0,this.shielded=!1,this.trail.length=0;for(const e of this.slots)e.x=e.tx,e.z=e.tz,e.y=.28,e.vx=0,e.vz=0,e.appear=1,e.knock=0,e.sink=!1;this.setCount(t),this._rebuildTargets(t);for(let e=0;e<Math.min(tn,Math.max(1,t));e++)this.slots[e].x=this.slots[e].tx,this.slots[e].z=this.slots[e].tz}radius(){return .48+Math.min(1.6,Math.sqrt(this.count)*.1)}update(t,e,n={}){const{moving:s=!0,reduceMotion:r=!1,fighting:a=!1}=n,o=this.x;this.x+=(this.targetX-this.x)*Math.min(1,t*16.5),this.x=dr.clamp(this.x,-e,e),s&&(this.z+=(n.speed??6.8)*t),s&&(this.runTime+=t),this.celebrate=Math.max(0,this.celebrate-t),this.squash+=(1-this.squash)*Math.min(1,t*9),this.flash+=(0-this.flash)*Math.min(1,t*8);const l=this.x-o,c=dr.clamp(-l*16,-.34,.34);this.lean+=(c-this.lean)*Math.min(1,t*10),this.group.rotation.z=r?0:this.lean,this.group.position.set(this.x,0,this.z);const u=(.82+Math.min(.5,Math.sqrt(Math.max(this.count,1))*.045))*this.compress;this.aura&&this.aura.scale.setScalar(.85+u*.55),s&&!r&&(this.trail.push({x:this.x,y:.22,z:this.z-.45,life:.22}),this.trail.length>12&&this.trail.shift());for(let _=this.trail.length-1;_>=0;_--)this.trail[_].life-=t,this.trail[_].life<=0&&this.trail.splice(_,1);if(this.trailMesh){const _=r?0:this.trail.length;for(let f=0;f<_;f++){const p=this.trail[f];this.trailDummy.position.set(p.x,p.y,p.z),this.trailDummy.scale.setScalar(Math.max(.12,p.life/.22)),this.trailDummy.updateMatrix(),this.trailMesh.setMatrixAt(f,this.trailDummy.matrix)}this.trailMesh.count=_,this.trailMesh.instanceMatrix.needsUpdate=!0}this.shadow.scale.setScalar(.65+u*.7),this.shadow.material.opacity=this.count<=0?0:.32;const h=this.count<=0?0:Math.min(tn,Math.max(1,this.count)),d=this.runTime,m=r?1:this.squash;let g=h;for(let _=h;_<tn;_++)this.slots[_].knock>0&&(g=_+1);for(let _=0;_<g;_++){const f=this.slots[_];if(_<h){f.appear=Math.min(1,f.appear+t*5.5);const b=1.12-f.appear*.12;f.vx+=(f.tx*u*b-f.x)*28*t,f.vz+=(f.tz*u*b-f.z)*28*t,a&&(f.vx+=Math.sin(d*21+f.phase)*16*t,f.vz+=Math.cos(d*17+_)*12*t),f.vx*=Math.max(0,1-t*9),f.vz*=Math.max(0,1-t*9),f.x+=f.vx*t,f.z+=f.vz*t;const M=r?0:(_===0?.13:.08)*Math.abs(Math.sin(d*f.freq+f.phase)),N=this.celebrate>0?.12*Math.abs(Math.sin(d*14+_)):0,T=a?.1*Math.abs(Math.sin(d*24+f.phase)):0;f.y+=(.26+M+N+T-f.y)*Math.min(1,t*18);const A=r?1:1+Math.sin(d*f.freq+f.phase)*(_===0?.16:.09),P=m*A*(.72+f.appear*.28),S=(2-m)*(.82+f.appear*.18);this.dummy.position.set(f.x,f.y,f.z),this.dummy.rotation.set(M*.35,l*4,this.lean*.25),this.dummy.scale.set(S,P,S)}else f.knock>0?(f.knock-=t,f.sink?(f.vx+=(f.sinkX-f.x)*14*t,f.vz+=(f.sinkZ-f.z)*14*t,f.vx+=-f.z*10*t,f.vz+=f.x*10*t,f.vx*=Math.max(0,1-t*3),f.vz*=Math.max(0,1-t*3),f.x+=f.vx*t,f.z+=f.vz*t,f.y-=t*3.4,this.dummy.position.set(f.x,f.y,f.z),this.dummy.scale.setScalar(Math.max(.04,f.knock*1.15)),this.dummy.rotation.set(f.knock*6,f.knock*10,f.knock*4)):(f.x+=f.vx*t,f.z+=f.vz*t,f.y+=t*2.2,f.vx*=.98,this.dummy.position.set(f.x,f.y,f.z),this.dummy.scale.setScalar(Math.max(.05,f.knock*1.6)),this.dummy.rotation.set(f.knock*4,0,f.knock*3))):(this.dummy.scale.setScalar(.001),this.dummy.position.set(0,-4,0));this.dummy.updateMatrix(),this.mesh.setMatrixAt(_,this.dummy.matrix)}this.mesh.count=g,this.mesh.instanceMatrix.needsUpdate=!0,this.banner&&(this.banner.position.y=1.28+Math.min(.65,Math.sqrt(this.count)*.07))}}function kt(i,t=0,e={}){const n=e.opacity??1;return new Sr({color:i,emissive:t,emissiveIntensity:e.ei??.38,shininess:e.shine??78,specular:e.spec??12113151,transparent:n<1,opacity:n,depthWrite:n>=1,toneMapped:!1})}function ug(i,t=null){i.geometry&&!t?.has(i.geometry)&&i.geometry.dispose?.();const e=Array.isArray(i.material)?i.material:i.material?[i.material]:[];for(const n of e)if(!t?.has(n)){if(n.map&&t?.has(n.map)){n.dispose?.();continue}n.map?.dispose?.(),n.dispose?.()}}class dg{constructor(t){this.scene=t,this.root=new ue,t.add(this.root),this.colliders=[],this.animated=[],this.finishZ=40,this.doorPieces=[],this._grid=ig(),this._stripe=rg(),this._coin=og(),this._swirl=ag(),this._floor=null,this._dummy=new de,this._blobGeo=new me(.22,10,8),this._rockGeo=new fo(.55,0),this._pineGeo=new En(.42,1.15,6),this._trunkGeo=new Ce(.08,.11,.32,6),this._grassGeo=new En(.12,.28,5),this._rivalMat=kt(16734842,16719944,{ei:.55,shine:70}),this._rivalBossMat=kt(16726861,13374008,{ei:.62,shine:80}),this._rockMat=kt(5917304,2760776,{ei:.18,shine:22}),this._pineMat=kt(4050056,1345608,{ei:.28,shine:30}),this._trunkMat=kt(9067064,4859920,{ei:.12,shine:18}),this._grassMat=kt(7266442,2787400,{ei:.2,shine:16}),this.armies=[]}clear(){const t=new Set;this._grid&&t.add(this._grid),this._stripe&&t.add(this._stripe),this._coin&&t.add(this._coin),this._swirl&&t.add(this._swirl),this._blobGeo&&t.add(this._blobGeo),this._rockGeo&&t.add(this._rockGeo),this._pineGeo&&t.add(this._pineGeo),this._trunkGeo&&t.add(this._trunkGeo),this._grassGeo&&t.add(this._grassGeo),this._rivalMat&&t.add(this._rivalMat),this._rivalBossMat&&t.add(this._rivalBossMat),this._rockMat&&t.add(this._rockMat),this._pineMat&&t.add(this._pineMat),this._trunkMat&&t.add(this._trunkMat),this._grassMat&&t.add(this._grassMat),this.root.traverse(e=>{e!==this.root&&ug(e,t)}),this.root.clear(),this.colliders=[],this.animated=[],this.doorPieces=[],this.armies=[],this._floor=null}build(t){this.clear();const e=t.pieces[t.pieces.length-1];this.finishZ=e.z;const n=e.z+22;this._grid.repeat.set(2,Math.max(8,n/4.6)),this._grid.offset.set(0,0);const s=new nt(new dn(9.4,n,1,1),new Re({map:this._grid,color:16777215}));s.rotation.x=-Math.PI/2,s.position.set(0,0,n/2-6),this._floor=s,this.root.add(s);for(const r of[-4.42,4.42]){const a=new Ce(.16,.16,n,10);a.rotateX(Math.PI/2);const o=new nt(a,kt(8058879,1757439,{ei:.55,shine:90}));o.position.set(r,.34,n/2-6),this.root.add(o);const l=new Ce(.22,.22,n,10);l.rotateX(Math.PI/2);const c=new nt(l,kt(3811976,2234470,{ei:.2,shine:30}));c.position.set(r,.08,n/2-6),this.root.add(c)}for(let r=10;r<e.z;r+=22)this._addArch(r);this._addValley(n);for(const r of t.pieces)r.type==="gate"?this._addGate(r.z,r.x,r.op,r.value,r):r.type==="dualgate"?(this._addGate(r.z,-1.12,r.left.op,r.left.value,{...r,side:"left"}),this._addGate(r.z,1.12,r.right.op,r.right.value,{...r,side:"right"})):r.type==="saw"?this._addSaw(r):r.type==="spinner"?this._addSpinner(r):r.type==="crusher"?this._addCrusher(r):r.type==="hole"?this._addHole(r):r.type==="wall"?this._addWall(r):r.type==="coin"?this._addCoin(r):r.type==="boost"?this._addBoost(r):r.type==="shield"?this._addShield(r):r.type==="magnet"?this._addMagnet(r):r.type==="star"?this._addToken(r,"star",16770406,16763904):r.type==="grow"?this._addToken(r,"grow",16739029,16723622):r.type==="army"?this._addArmy(r):r.type==="finish"&&this._addFinish(r)}_addArch(t){const e=kt(10194175,5915391,{ei:.42,shine:70}),n=new nt(new Xe(4.08,.11,8,28,Math.PI),e);n.position.set(0,.02,t),this.root.add(n)}_groundMark(t=.4){const e=new nt(new di(t,18),new Re({color:525850,transparent:!0,opacity:.34,depthWrite:!1}));return e.rotation.x=-Math.PI/2,e.position.y=.02,e}_pedestal(){return new nt(new Ce(.14,.2,.1,12),kt(2760808,1380416,{ei:.25,shine:40}))}_addGate(t,e,n,s,r){const a=n==="add"||n==="mul",o=jl(n,s),l=sg(o,a),c=new ue;c.position.set(e,0,t);const u=a?kt(12124116,3014522,{ei:.35,shine:90}):kt(16761040,16726894,{ei:.35,shine:90}),h=new nt(new Vn(.07,1.38,4,8),u);h.position.set(-1.08,.86,0);const d=new nt(new Vn(.07,1.38,4,8),u);d.position.set(1.08,.86,0);const m=new nt(new Vn(.07,2.12,4,8),u);m.rotation.z=Math.PI/2,m.position.set(0,1.62,0);const g=new nt(new me(.11,10,8),u);g.position.set(-1.08,.1,0);const _=new nt(new me(.11,10,8),u);_.position.set(1.08,.1,0);const f=new nt(new dn(1.95,1.32),new Re({map:l,transparent:!0,depthWrite:!1,side:cn,toneMapped:!1}));f.position.set(0,.9,0),f.rotation.y=Math.PI,c.add(h,d,m,g,_,f),this.root.add(c),this.animated.push(c),this.colliders.push({kind:"gate",z:t,x:e,width:2.2,op:n,value:s,extra:r,used:!1,mesh:c,good:a})}_addSaw(t){const e=new ue;e.position.set(t.x,.62,t.z);const n=Math.max(.55,t.width*.52),s=new Ce(n,n,.05,32);s.rotateX(Math.PI/2);const r=new nt(s,kt(16734835,16717880,{ei:.55,shine:110,spec:16777215})),a=new nt(new me(n*.22,12,10),kt(16769162,16755234,{ei:.5,shine:120})),o=new nt(new Xe(n*.9,.035,8,28),kt(16767352,16755234,{ei:.4,shine:100})),l=new ue,c=kt(16770720,16764006,{ei:.3,shine:90});for(let h=0;h<12;h++){const d=new nt(new En(.07,.16,6),c),m=h/12*Math.PI*2;d.position.set(Math.cos(m)*n,Math.sin(m)*n,0),d.rotation.z=m-Math.PI/2,l.add(d)}e.add(r,o,a,l),e.userData.spinZ=!0,e.userData.warnMat=r.material,e.userData.warnBase=.55,t.move&&(e.userData.patrol={base:t.x,amp:t.amp??1.55,speed:t.speed??3.05}),this.root.add(e),this.animated.push(e);const u={kind:"saw",z:t.z,x:t.x,width:t.width,damage:t.damage,used:!1,mesh:e};e.userData.patrol&&(e.userData.patrol.collider=u),this.colliders.push(u)}_addHole(t){const e=new ue;e.position.set(t.x,0,t.z);const n=Math.max(.72,t.width*.55),s=new nt(new Ce(n*.96,n*.42,.95,22,1,!0),kt(525332,2757728,{ei:.18,shine:12}));s.position.y=-.42;const r=new nt(new di(n*.4,22),new Re({color:0}));r.rotation.x=-Math.PI/2,r.position.y=-.88;const a=new Re({map:this._swirl,transparent:!0,depthWrite:!1,toneMapped:!1}),o=new nt(new di(n*.92,28),a);o.rotation.x=-Math.PI/2,o.position.y=.03;const l=new nt(new di(n*.62,24),a);l.rotation.x=-Math.PI/2,l.position.y=.05;const c=new nt(new Xe(n,.07,8,28),kt(10194175,6966527,{ei:.62,shine:90}));c.rotation.x=Math.PI/2,c.position.y=.05;const u=new nt(new Xe(n*.72,.035,8,24),kt(6746367,2806015,{ei:.7,shine:100}));u.rotation.x=Math.PI/2,u.position.y=.02;const h=new ue,d=kt(12099839,8019199,{ei:.5,shine:80});for(let m=0;m<6;m++){const g=new nt(new me(.045,6,5),d),_=m/6*Math.PI*2;g.position.set(Math.cos(_)*n*.58,.12,Math.sin(_)*n*.58),h.add(g)}e.add(s,r,o,l,c,u,h),e.userData.blackHole=!0,e.userData.swirl=o,e.userData.swirl2=l,e.userData.debris=h,e.userData.suckT=0,this.root.add(e),this.animated.push(e),this.colliders.push({kind:"hole",z:t.z,x:t.x,width:t.width,used:!1,mesh:e})}_addWall(t){const e=new ue;e.position.set(t.x,0,t.z);const n=t.width,s=new nt(new Be(n*.92,1.22,.42),kt(2757664,4851728,{ei:.15,shine:28}));s.position.y=.64;const r=new nt(new dn(n*.9,1.12),new Sr({map:this._stripe,color:16777215,emissive:3346440,emissiveIntensity:.2,shininess:40,specular:8939076,toneMapped:!1}));r.position.set(0,.64,.22);const a=new Ce(.09,.09,n*1.02,10);a.rotateZ(Math.PI/2);const o=new nt(a,kt(16769162,16755200,{ei:.55,shine:100}));o.position.y=1.28,e.add(s,r,o),this.root.add(e),this.colliders.push({kind:"wall",z:t.z,x:t.x,width:t.width,damage:t.damage,used:!1,mesh:e})}_addSpinner(t){const e=new ue;e.position.set(t.x,0,t.z);const n=new nt(new Ce(.08,.1,1.15,8),kt(16769162,16755234,{ei:.4,shine:90}));n.position.y=.58;const s=new nt(new me(.16,10,8),kt(16767352,16755234,{ei:.5,shine:100}));s.position.y=1.12;const r=kt(16739194,16721992,{ei:.42,shine:85}),a=Math.max(1.6,t.width*1.15),o=new nt(new Be(a,.12,.12),r);o.position.y=1.12;const l=new nt(new me(.1,8,6),r);l.position.set(-a*.5,1.12,0);const c=new nt(new me(.1,8,6),r);c.position.set(a*.5,1.12,0);const u=new ue;u.add(o,l,c),u.position.y=0,e.add(n,s,u),e.userData.rotor=u,e.userData.warnMat=r,e.userData.warnBase=.42,this.root.add(e),this.animated.push(e);const h={kind:"spinner",z:t.z,x:t.x,width:t.width||1.7,damage:t.damage,used:!1,mesh:e};this.colliders.push(h)}_addCrusher(t){const e=new ue;e.position.set(t.x,0,t.z);const n=kt(4864104,2758712,{ei:.22,shine:40}),s=kt(16767352,16755234,{ei:.45,shine:80}),r=new nt(new Be(1.05,1.05,.46),n),a=new nt(new Be(1.05,1.05,.46),n);r.position.set(-1.35,.58,0),a.position.set(1.35,.58,0);const o=new nt(new Be(.12,1.05,.5),s),l=new nt(new Be(.12,1.05,.5),s);o.position.set(-.82,.58,0),l.position.set(.82,.58,0),e.add(r,a,o,l),e.userData.crush={left:r,right:a,lipL:o,lipR:l,period:2.6,phase:t.z*.17},e.userData.warnMat=s,e.userData.warnBase=.45,this.root.add(e),this.animated.push(e);const c={kind:"crusher",z:t.z,x:t.x,width:2.4,damage:t.damage||4,used:!1,mesh:e};e.userData.crush.collider=c,this.colliders.push(c)}_addValley(t){const r=new Xn(this._rockGeo,this._rockMat,44),a=new Xn(this._pineGeo,this._pineMat,28),o=new Xn(this._trunkGeo,this._trunkMat,28),l=new Xn(this._grassGeo,this._grassMat,50);r.frustumCulled=!1,a.frustumCulled=!1,o.frustumCulled=!1,l.frustumCulled=!1;for(let c=0;c<44;c++){const h=(c%2===0?-1:1)*(6.55+c%5*.55),d=2+c/44*(t+8);this._dummy.position.set(h,.28+c%3*.08,d),this._dummy.rotation.set(.2*(c%3),c*.7,.15),this._dummy.scale.setScalar(.7+c%4*.22),this._dummy.updateMatrix(),r.setMatrixAt(c,this._dummy.matrix)}for(let c=0;c<28;c++){const h=(c%2===0?1:-1)*(7.05+c%4*.48),d=6+c/28*(t+4);this._dummy.position.set(h,.92,d),this._dummy.rotation.set(0,c*.4,.04*(c%3)),this._dummy.scale.set(1+c%3*.12,1.05+c%4*.15,1),this._dummy.updateMatrix(),a.setMatrixAt(c,this._dummy.matrix),this._dummy.position.y=.16,this._dummy.scale.set(1,1,1),this._dummy.updateMatrix(),o.setMatrixAt(c,this._dummy.matrix)}for(let c=0;c<50;c++){const h=(c%2===0?-1:1)*(4.95+c%6*.18),d=1+c/50*t;this._dummy.position.set(h,.12,d),this._dummy.rotation.set(0,c,.2),this._dummy.scale.setScalar(.7+c%3*.2),this._dummy.updateMatrix(),l.setMatrixAt(c,this._dummy.matrix)}this._dummy.scale.setScalar(1),this._dummy.rotation.set(0,0,0),this.root.add(r,a,o,l)}_addCoin(t){const e=new ue;e.position.set(t.x,.72,t.z);const n=new Re({map:this._coin,color:16770406,toneMapped:!1}),s=new Re({color:16761095,toneMapped:!1}),r=new Ce(.48,.48,.07,20);r.rotateX(Math.PI/2);const a=new nt(r,[s,n,n]),o=new nt(new Xe(.48,.03,8,22),kt(16770406,16761095,{ei:.45,shine:120}));e.add(a,o),e.userData.coinSpin=!0,e.userData.spinT=0,e.userData.baseY=.72,this.root.add(e),this.animated.push(e),this.colliders.push({kind:"coin",z:t.z,x:t.x,width:1.05,amount:t.amount||6,used:!1,mesh:e})}_addBoost(t){this._addPickup(t,"boost",1.15,e=>{const n=kt(8058879,2806015,{ei:.7,shine:110}),s=new nt(new Vn(.13,.22,4,10),n),r=new nt(new En(.15,.26,10),n);r.position.y=.32;const a=new nt(new Xe(.2,.035,8,16),n);a.rotation.x=Math.PI/2,a.position.y=-.12;const o=new nt(new En(.07,.16,6),n);o.rotation.z=.9,o.position.set(-.12,-.16,0);const l=new nt(new En(.07,.16,6),n);l.rotation.z=-.9,l.position.set(.12,-.16,0),e.add(s,r,a,o,l)})}_addShield(t){this._addPickup(t,"shield",1.15,e=>{const n=kt(12121343,6746367,{ei:.45,shine:120,opacity:.55}),s=kt(8052735,2806015,{ei:.5,shine:90});e.add(new nt(new me(.34,14,12),n)),e.add(new nt(new me(.2,12,10),s));const r=new nt(new Xe(.38,.03,8,20),s);r.rotation.x=Math.PI/2,e.add(r)})}_addMagnet(t){this._addPickup(t,"magnet",1.2,e=>{const n=kt(14212840,8952234,{ei:.22,shine:130,spec:16777215}),s=kt(14826299,9048088,{ei:.18,shine:55}),r=kt(16726843,11145232,{ei:.28,shine:80}),a=kt(3893992,1058936,{ei:.28,shine:80}),o=new Xe(.2,.075,10,22,Math.PI),l=new nt(o,s);l.rotation.z=Math.PI;const c=new nt(new Xe(.2,.04,8,20,Math.PI),n);c.rotation.z=Math.PI,c.position.z=.01;const u=new nt(new Ce(.075,.075,.26,10),s),h=new nt(new Ce(.075,.075,.26,10),s);u.position.set(-.2,-.13,0),h.position.set(.2,-.13,0);const d=new nt(new Be(.17,.12,.17),r),m=new nt(new Be(.17,.12,.17),a);d.position.set(-.2,-.3,0),m.position.set(.2,-.3,0);const g=new nt(new me(.05,8,6),n);g.position.y=.2,e.scale.setScalar(1.55),e.rotation.x=-.18})}_addToken(t,e,n,s){this._addPickup(t,e,1.2,r=>{const a=kt(n,s,{ei:.62,shine:100});if(e==="star"){const o=new nt(new po(.34),a);o.rotation.z=Math.PI/4;const l=new nt(new Xe(.3,.03,8,18),a);l.rotation.x=Math.PI/2,r.add(o,l)}else{const o=new nt(new me(.28,14,12),a),l=new nt(new me(.12,10,8),a),c=new nt(new me(.1,10,8),a);l.position.set(.26,.1,.08),c.position.set(-.22,-.08,.1),r.add(o,l,c)}},t.amount||8)}_addPickup(t,e,n,s,r){const a=new ue;a.position.set(t.x,0,t.z);const o=this._pedestal();o.position.y=.06;const l=new ue;l.position.y=.68,s(l),a.userData.bobIcon=l,a.add(this._groundMark(.4),o,l),this.root.add(a),this.animated.push(a),this.colliders.push({kind:e,z:t.z,x:t.x,width:n,amount:r,used:!1,mesh:a})}_addArmy(t,e=!1){const n=e?t.hp:t.count,s=new ue;s.position.set(t.x||0,0,t.z);const r=40,a=new Xn(this._blobGeo,e?this._rivalBossMat:this._rivalMat,r);a.instanceMatrix.setUsage(hr),a.frustumCulled=!1;const o=Math.min(r,Math.max(1,n)),l=[];for(let d=0;d<r;d++){const m=d*2.399963+.21*Math.sin(d*1.3),g=.42*Math.sqrt(d)*(1+.07*Math.sin(d*2.1));l.push({x:Math.cos(m)*g,z:Math.sin(m)*g*.7-Math.min(.38,Math.sqrt(d)*.05),phase:d*.91,freq:7.6+d%7*.62})}this._layoutRivalBlobs(a,l,o,0,!1),s.add(a);const c=Gl(n,e),u=new nt(new dn(1.7,.85),new Re({map:c,transparent:!0,depthWrite:!1}));u.position.set(0,1.55,.2),s.add(u),s.userData.armyPack=!0,this.root.add(s),this.animated.push(s);const h={kind:e?"finish":"army",z:t.z,x:t.x||0,homeX:t.x||0,homeZ:t.z,width:2.8,count:n,hp:t.hp,used:!1,mesh:s,units:a,label:u,badge:c,offsets:l,finish:e,charging:!1,fighting:!1};return this.colliders.push(h),this.armies.push(h),s.userData.col=h,e&&(this.doorPieces=[s]),h}_layoutRivalBlobs(t,e,n,s,r){const a=Math.min(40,Math.max(0,n));for(let o=0;o<a;o++){const l=e[o],c=.055*Math.abs(Math.sin(s*l.freq+l.phase)),u=r?Math.sin(s*22+l.phase)*.14:0,h=r?Math.cos(s*18+o)*.1:0,d=1+Math.sin(s*l.freq+l.phase)*.1;this._dummy.position.set(l.x+u,.26+c,l.z+h),this._dummy.rotation.set(c*.45,u*.8,c*.2),this._dummy.scale.set(1.05/d,1.05*d,1.05/d),this._dummy.updateMatrix(),t.setMatrixAt(o,this._dummy.matrix)}t.count=a,t.instanceMatrix.needsUpdate=!0}setArmyCount(t,e){if(!t)return;t.count=Math.max(0,e|0);const n=Math.min(40,t.count);t.units&&(t.units.count=n,t.offsets&&this._layoutRivalBlobs(t.units,t.offsets,n,performance.now()*.001,!!t.fighting)),t.label&&(t.badge?.dispose?.(),t.badge=Gl(t.count,!!t.finish),t.label.material.map=t.badge,t.label.material.needsUpdate=!0)}_addFinish(t){const e=new Ce(.07,.07,8.2,10);e.rotateZ(Math.PI/2);const n=new nt(e,kt(16770406,16755200,{ei:.65,shine:100}));n.position.set(0,.08,t.z+1.2);const s=kt(16769162,16755200,{ei:.4,shine:80}),r=new nt(new Vn(.09,.7,4,8),s);r.position.set(-4.05,.45,t.z+1.2);const a=new nt(new Vn(.09,.7,4,8),s);a.position.set(4.05,.45,t.z+1.2),this.root.add(n,r,a),this._addArmy(t,!0)}smashDoor(){for(const t of this.doorPieces)t.userData.smash=!0}tick(t,e,n=0,s=null,r=0){const a=performance.now()*.001;this._grid&&(this._grid.offset.y=-n*.12,e||(this._grid.offset.x=Math.sin(a*.4)*.01));for(const o of this.animated){const l=o.position.z-n,c=l>-6&&l<24,u=l<10&&l>.4;if(o.userData.warnMat&&(o.userData.warnMat.emissiveIntensity=(o.userData.warnBase||.4)+(u?.55:0)),o.userData.spinZ&&c&&(o.rotation.z+=t*(e?2.4:u?16:8)),o.userData.spin&&c&&(o.rotation.x+=t*(e?2.4:u?16:10)),o.userData.rotor&&c&&(o.userData.rotor.rotation.y+=t*(e?1.6:u?7.4:2.2)),o.userData.blackHole&&c){o.userData.suckT=Math.max(0,(o.userData.suckT||0)-t);const h=e?1.2:2.4+(o.userData.suckT>0?7:u?2.2:0);o.userData.swirl.rotation.z+=t*h,o.userData.swirl2.rotation.z-=t*h*.72,o.userData.debris&&(o.userData.debris.rotation.y+=t*(e?1:3.4+o.userData.suckT*6));const d=1+Math.sin(a*7+o.position.z)*.04+o.userData.suckT*.18;o.userData.swirl.scale.setScalar(d),o.userData.swirl2.scale.setScalar(.92+o.userData.suckT*.2)}if(o.userData.bobIcon&&c&&!e){const h=o.userData.bobIcon;h.position.y=.68+Math.sin(a*3.2+o.position.z)*.08,h.rotation.y+=t*1.6}if(o.userData.coinSpin&&c&&(o.userData.spinT=(o.userData.spinT||0)+t*(e?1.2:4.2),o.userData.baseY!=null&&(o.position.y=o.userData.baseY+Math.sin(a*3.2+o.position.z)*.08),s?(o.lookAt(s.position),o.rotateY(Math.PI),o.rotateZ(o.userData.spinT)):e||(o.rotation.y+=t*3.6)),o.userData.crush){const h=o.userData.crush,d=((a*(1/h.period)+h.phase)%1+1)%1;let m=.08;d>.42&&d<.55?m=.2+(d-.42)*4:d>=.55&&d<.78?m=.85:d>=.78&&d<.9&&(m=.85-(d-.78)*5);const g=1.38-m*.95;h.left.position.x=-g,h.right.position.x=g,h.lipL.position.x=-g+.48,h.lipR.position.x=g-.48,h.collider&&(h.collider.width=2.7-g*1.15)}if(o.userData.armyPack&&l>-5&&l<16){const h=o.userData.col;h&&!h.used&&!h.fighting&&l<11&&l>2.1&&(h.charging=!0,o.position.x+=(r-o.position.x)*Math.min(1,t*4.4),o.position.z-=t*3.6,h.x=o.position.x,h.z=o.position.z),h?.units&&h.offsets&&this._layoutRivalBlobs(h.units,h.offsets,h.units.count,e?0:a,!!h.fighting),s&&h?.label&&h.label.quaternion.copy(s.quaternion),h?.regroupT>0&&(h.regroupT-=t,o.position.z+=t*5.5,o.position.x+=(h.homeX-o.position.x)*Math.min(1,t*6),h.x=o.position.x,h.z=o.position.z,h.regroupT<=0&&(o.visible=!1))}if(o.userData.hitT>0){o.userData.hitT-=t;const h=1+o.userData.hitT*1.35;o.scale.set(h,h,h)}else if(o.userData.pulse&&!e&&c){const h=1+Math.sin(a*4.2+o.position.z)*.07;o.scale.setScalar(h),o.userData.baseY!=null&&(o.position.y=o.userData.baseY+Math.sin(a*3.1+o.position.x)*.08)}if(o.userData.patrol){const h=o.userData.patrol,m=a*h.speed/Math.PI%2>.35;o.position.x=h.base+Math.sin(a*h.speed)*h.amp*(m?1:.15),h.collider&&(h.collider.x=o.position.x)}}for(const o of this.doorPieces)o.userData.smash&&(o.position.y+=t*5,o.rotation.z+=t*4,o.scale.multiplyScalar(Math.max(.15,1-t*3.4)),o.material&&"transparent"in o.material&&(o.material.transparent=!0))}}class fg{constructor(){this.ctx=null,this.master=null,this.muted=!1,this.musicLevel=.7,this.sfxLevel=1,this._musicOn=!1,this._musicGain=null,this._musicTimer=0,this._nextNote=0,this._step=0,this._bpm=128,this._noise=null}setMuted(t){this.setMix({muted:t})}setMix({muted:t=this.muted,music:e=this.musicLevel,sfx:n=this.sfxLevel}={}){this.muted=!!t,this.musicLevel=Math.min(1,Math.max(0,Number(e)||0)),this.sfxLevel=Math.min(1,Math.max(0,Number(n)||0)),this.master&&(this.master.gain.value=this.muted?0:1),this._musicGain&&(this._musicGain.gain.value=this.muted?1e-4:Math.max(1e-4,this.musicLevel)),this.muted&&this.stopMusic()}ensure(){if(!this.ctx){const t=window.AudioContext||window.webkitAudioContext;if(!t)return null;this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=this.muted?0:1,this.master.connect(this.ctx.destination),this._noise=this.ctx.createBuffer(1,this.ctx.sampleRate*.4,this.ctx.sampleRate);const e=this._noise.getChannelData(0);for(let n=0;n<e.length;n++)e[n]=Math.random()*2-1}return this.ctx.state==="suspended"&&this.ctx.resume(),this.ctx}tone(t,e,n="sine",s=.08){if(this.muted)return;const r=this.ensure();if(!r||!this.master)return;const a=r.createOscillator(),o=r.createGain();a.type=n,a.frequency.value=t,o.gain.value=Math.max(8e-4,s*this.sfxLevel),o.gain.exponentialRampToValueAtTime(.001,r.currentTime+e),a.connect(o),o.connect(this.master),a.start(),a.stop(r.currentTime+e)}ui(){this.tone(640,.05,"sine",.04)}coin(){this.tone(880,.07,"sine",.05),setTimeout(()=>this.tone(1180,.09,"sine",.04),50)}gate(t){t==="mul"?this.tone(520,.12,"square",.06):t==="add"?this.tone(380,.1,"sine",.07):t==="sub"||t==="div"?this.tone(180,.14,"sawtooth",.05):this.tone(300,.08)}win(){this.tone(440,.1),setTimeout(()=>this.tone(554,.1),80),setTimeout(()=>this.tone(659,.18),160)}smash(){this.tone(90,.18,"sawtooth",.07),setTimeout(()=>this.tone(240,.12,"square",.04),40)}fail(){this.tone(140,.28,"triangle",.08)}hit(){this.tone(90,.12,"square",.05)}startMusic(){if(this.muted)return;const t=this.ensure();!t||!this.master||this._musicOn||(this._musicGain=t.createGain(),this._musicGain.gain.value=1e-4,this._musicGain.connect(this.master),this._musicGain.gain.exponentialRampToValueAtTime(Math.max(.12,this.musicLevel),t.currentTime+.18),this._musicOn=!0,this._step=0,this._nextNote=t.currentTime+.05,this._musicTick(),this._musicTimer=window.setInterval(()=>this._musicTick(),25))}stopMusic(){this._musicOn=!1,this._musicTimer&&(clearInterval(this._musicTimer),this._musicTimer=0);const t=this._musicGain,e=this.ctx;if(t&&e){try{t.gain.cancelScheduledValues(e.currentTime),t.gain.setValueAtTime(Math.max(1e-4,t.gain.value),e.currentTime),t.gain.exponentialRampToValueAtTime(1e-4,e.currentTime+.12)}catch{}setTimeout(()=>{try{t.disconnect()}catch{}},160)}this._musicGain=null}_musicTick(){const t=this.ctx;if(!this._musicOn||!t||!this._musicGain)return;const e=60/this._bpm/4;for(;this._nextNote<t.currentTime+.22;)this._scheduleStep(this._step,this._nextNote),this._nextNote+=e,this._step=(this._step+1)%32}_scheduleStep(t,e){const n=t%16;n%4===0&&this._kick(e),n%4===2&&this._snare(e),n%2===1&&this._hat(e,.03),n%2===0&&this._hat(e,.018);const s=[98,98,130.81,98,87.31,87.31,110,98];n%2===0&&this._buzz(s[n/2%8],e,.22,"triangle",.045);const r=[523.25,659.25,783.99,659.25,523.25,392,440,523.25];this._buzz(r[n%8],e,.09,"sine",t%16<8?.028:.02);const a=[null,784,null,659,784,null,880,784,null,659,523,null,587,659,523,null];a[n]&&t%32<16&&this._buzz(a[n],e,.16,"triangle",.032)}_buzz(t,e,n,s,r){const a=this.ctx,o=this._musicGain;if(!a||!o||!t)return;const l=a.createOscillator(),c=a.createGain();l.type=s,l.frequency.setValueAtTime(t,e),c.gain.setValueAtTime(r,e),c.gain.exponentialRampToValueAtTime(1e-4,e+n),l.connect(c),c.connect(o),l.start(e),l.stop(e+n+.02)}_kick(t){const e=this.ctx,n=this._musicGain;if(!e||!n)return;const s=e.createOscillator(),r=e.createGain();s.type="sine",s.frequency.setValueAtTime(140,t),s.frequency.exponentialRampToValueAtTime(42,t+.14),r.gain.setValueAtTime(.09,t),r.gain.exponentialRampToValueAtTime(1e-4,t+.16),s.connect(r),r.connect(n),s.start(t),s.stop(t+.18)}_hat(t,e){const n=this.ctx,s=this._musicGain;if(!n||!s||!this._noise)return;const r=n.createBufferSource();r.buffer=this._noise;const a=n.createBiquadFilter();a.type="highpass",a.frequency.value=7e3;const o=n.createGain();o.gain.setValueAtTime(e,t),o.gain.exponentialRampToValueAtTime(1e-4,t+.04),r.connect(a),a.connect(o),o.connect(s),r.start(t),r.stop(t+.05)}_snare(t){const e=this.ctx,n=this._musicGain;if(!e||!n||!this._noise)return;const s=e.createBufferSource();s.buffer=this._noise;const r=e.createBiquadFilter();r.type="bandpass",r.frequency.value=1800;const a=e.createGain();a.gain.setValueAtTime(.06,t),a.gain.exponentialRampToValueAtTime(1e-4,t+.1),s.connect(r),r.connect(a),a.connect(n),s.start(t),s.stop(t+.12),this._buzz(220,t,.08,"triangle",.02)}}class pg{constructor(){this.mag=0}punch(t=.18){this.mag=Math.max(this.mag,t)}offset(t){return t||this.mag<.002?(this.mag*=.5,{x:0,y:0}):(this.mag*=.82,{x:(Math.random()-.5)*this.mag,y:(Math.random()-.5)*this.mag*.7})}}const mg=new Set(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","a","A","d","D","w","W"," ","p","P","Escape","r","R"]);class gg{constructor(){this.keys=new Set,this.pointerX=0,this.dragging=!1,this._handlers=[],this.onPause=null,this.onRestart=null,this.onNudge=null,this.onGrab=null,this.onNitro=null}_isUi(t){if(!t?.closest)return!1;if(t.isContentEditable)return!0;const e=t.tagName;return e==="INPUT"||e==="TEXTAREA"||e==="BUTTON"||e==="A"||e==="LABEL"?!0:!!t.closest("button, input, label, a, .sheet, .overlay-card, .hint-card, .ad, .wallet, .home, .splash")}bind(t){this.unbind();const e=t.parentElement||t,n=c=>{if(!(c.button!=null&&c.button!==0)&&!this._isUi(c.target)){this.dragging=!0,this.pointerX=c.clientX,this._downAt=performance.now(),this._downX=c.clientX,this.onGrab?.();try{t.setPointerCapture(c.pointerId)}catch{}}},s=c=>{this.pointerX=c.clientX},r=c=>{const u=performance.now()-(this._downAt||0),h=Math.abs((c?.clientX??this.pointerX)-(this._downX||0));this.dragging=!1,this._downAt&&u<160&&h<12,this._downAt=0},a=c=>{if(!(this._isUi(c.target)&&(c.target.tagName==="INPUT"||c.target.isContentEditable))&&mg.has(c.key)){if(c.repeat&&(c.key==="p"||c.key==="P"||c.key==="Escape"||c.key==="r"||c.key==="R")){c.preventDefault();return}c.preventDefault(),this.keys.add(c.key),(c.key==="p"||c.key==="P"||c.key==="Escape")&&this.onPause?.(),(c.key==="r"||c.key==="R")&&this.onRestart?.(),(c.key==="ArrowLeft"||c.key==="a"||c.key==="A")&&this.onNudge?.(-1),(c.key==="ArrowRight"||c.key==="d"||c.key==="D")&&this.onNudge?.(1),(c.key===" "||c.key==="w"||c.key==="W"||c.key==="ArrowUp")&&this.onNitro?.()}},o=c=>{this.keys.delete(c.key)},l=c=>c.preventDefault();e.addEventListener("pointerdown",n),window.addEventListener("pointermove",s),window.addEventListener("pointerup",r),window.addEventListener("pointercancel",r),window.addEventListener("keydown",a),window.addEventListener("keyup",o),e.addEventListener("touchmove",l,{passive:!1}),this._handlers=[()=>e.removeEventListener("pointerdown",n),()=>window.removeEventListener("pointermove",s),()=>window.removeEventListener("pointerup",r),()=>window.removeEventListener("pointercancel",r),()=>window.removeEventListener("keydown",a),()=>window.removeEventListener("keyup",o),()=>e.removeEventListener("touchmove",l)]}unbind(){for(const t of this._handlers)t();this._handlers=[],this.keys.clear(),this.dragging=!1}steerAxis(){const t=this.keys.has("ArrowLeft")||this.keys.has("a")||this.keys.has("A"),e=this.keys.has("ArrowRight")||this.keys.has("d")||this.keys.has("D");return t&&!e?-1:e&&!t?1:0}keyboardLane(t){const e=this.steerAxis();return e===0?null:e*t}}const Hl=96;class _g{constructor(t){this.dummy=new de,this.items=[],this._pool=[];const e=new me(.07,6,6),n=new Re({color:13041482});this.mesh=new Xn(e,n,Hl),this.mesh.instanceMatrix.setUsage(hr),this.mesh.count=0,this.mesh.frustumCulled=!1,t.add(this.mesh)}burst(t,e,n,s,r=14,a=4){this.mesh.material.color.setHex(s);for(let o=0;o<r;o++){const l=this._pool.pop()||{},c=Math.random()*Math.PI*2,u=Math.random()*Math.PI;l.x=t,l.y=e,l.z=n,l.vx=Math.cos(c)*Math.sin(u)*a,l.vy=Math.abs(Math.cos(u))*a+1.2,l.vz=Math.sin(c)*Math.sin(u)*a*.4,l.life=.42+Math.random()*.22,l.age=0,this.items.length>=Hl&&this._pool.push(this.items.shift()),this.items.push(l)}}update(t,e){if(e){this.items.length=0,this.mesh.count=0;return}for(let s=this.items.length-1;s>=0;s--){const r=this.items[s];r.age+=t,r.x+=r.vx*t,r.y+=r.vy*t,r.z+=r.vz*t,r.vy-=9*t,r.age>=r.life&&(this.items.splice(s,1),this._pool.push(r))}const n=this.items.length;for(let s=0;s<n;s++){const r=this.items[s],a=Math.max(.05,1-r.age/r.life);this.dummy.position.set(r.x,r.y,r.z),this.dummy.scale.setScalar(a),this.dummy.updateMatrix(),this.mesh.setMatrixAt(s,this.dummy.matrix)}this.mesh.count=n,this.mesh.instanceMatrix.needsUpdate=!0}dispose(){this.items.length=0,this.mesh.geometry?.dispose?.(),this.mesh.material?.dispose?.(),this.mesh.removeFromParent()}}function vg(i,t,e){return i==="menu"?!1:!!(t||e)}function ra(i,t=0,e=.22){return new Sr({color:i,emissive:t,emissiveIntensity:e,shininess:18,specular:3359846,toneMapped:!1,flatShading:!0})}function Vl(i,t,e,n,s,r,a,o){const l=new nt(t,e);l.scale.set(o*.72,o,o*.72),l.position.set(s,r,a),i.add(l);const c=new nt(t,n);c.scale.set(o*.26,o*.16,o*.26),c.position.set(s,r+o*.4,a),i.add(c)}class xg{constructor(t){this.group=new ue,t.add(this.group),this.far=new ue,this.mid=new ue,this.group.add(this.far,this.mid);const e=ra(3811960,1708104,.28),n=ra(4863112,2364506,.2),s=ra(14209264,8949960,.12),r=new En(1,1,5),a=[-22,-16.5,-11.5,11.5,16.5,22];for(let h=0;h<a.length;h++){const d=7.2+h%3*1.6;Vl(this.far,r,e,s,a[h],d*.28,62+h%3*5,d)}const o=[-15.5,-12.2,12.2,15.5];for(let h=0;h<o.length;h++){const d=4.4+h%2*1.1;Vl(this.mid,r,n,s,o[h],d*.22,34+h%2*4,d)}const l=80,c=new Float32Array(l*3);for(let h=0;h<l;h++)c[h*3]=(Math.random()-.5)*48,c[h*3+1]=8+Math.random()*18,c[h*3+2]=20+Math.random()*50;const u=new Pe;u.setAttribute("position",new $e(c,3)),this.stars=new N0(u,new Nc({color:16777215,size:.11,transparent:!0,opacity:.7,depthWrite:!1})),this.group.add(this.stars)}tick(t,e,n){this.far.position.z=e,this.mid.position.z=e,this.stars.position.z=e,n||(this.far.position.x=Math.sin(e*.004)*.35,this.mid.position.x=Math.sin(e*.01)*.55)}dispose(){this.group.traverse(t=>{t.geometry?.dispose?.(),t.material?.map?.dispose?.(),t.material?.dispose?.()}),this.group.removeFromParent()}}class Mg{constructor(t,e){this.canvas=t,this.hud=e,this.state="menu",this.level=null,this.levelIndex=0,this.ended=!1,this.paused=!1,this.pendingContinue=!1,this.coinMultiplier=1,this.failReason=null,this.movedEnough=!1,this.boostT=0,this.magnetT=0,this.starT=0,this.runTime=0,this.runScore=0,this._shownScore=-1,this.shield=!1,this.combo=0,this.nitroCd=0,this.fight=null,this.onCoin=null,this.reduceMotion=window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches??!1,this._alive=!0;let n;try{n=new Ll({canvas:t,antialias:!1,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!1,alpha:!1})}catch{const r=t.cloneNode(!0);t.replaceWith(r),this.canvas=r,n=new Ll({canvas:r,antialias:!1,failIfMajorPerformanceCaveat:!1})}this.renderer=n,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.15)),this.renderer.setClearColor(2826104,1),this.renderer.outputColorSpace=Ie,this.scene=new I0,this.scene.fog=new lo(2365544,22,92),this.scene.background=new Bt(2233950),this.camera=new ke(54,9/16,.1,160),this.baseFov=54,this.shake=new pg,this.sfx=new fg,this.particles=new _g(this.scene),this.backdrop=new xg(this.scene),this.input=new gg,this.scene.add(new j0(16770815,3811976,1.15));const s=new ng(16777215,1.15);s.position.set(-3,12,6),this.scene.add(s),this.rim=new tg(6746367,14,28),this.rim.position.set(0,4,4),this.scene.add(this.rim),this.crowd=new hg(this.scene),this.world=new dg(this.scene),this.crowd.reset(22),this.preview=new nt(new dn(9,40),new Sr({color:3811976,emissive:2234470,emissiveIntensity:.35,shininess:18})),this.preview.rotation.x=-Math.PI/2,this.preview.position.z=10,this.preview.name="menuFloor",this.scene.add(this.preview),this.laneLimit=3.15,this.grabPointerX=0,this.grabLane=0,this.camX=0,this.camTilt=0,this._steerX=0,this._finishSlow=0,this.last=performance.now(),this.capture=new URLSearchParams(location.search).has("capture"),this.raf=0,this._onResize=()=>this._resize(),this._onVis=()=>{document.hidden&&this.state==="playing"&&!this.ended&&!this.paused&&this.togglePause()},this.input.bind(this.canvas),this.input.onPause=()=>this.togglePause(),this.input.onRestart=()=>this.requestRestart(),this.input.onGrab=()=>{this.grabPointerX=this.input.pointerX,this.grabLane=this.crowd.x,this.sfx.ensure()},this.input.onNitro=()=>this.tryNitro(),window.addEventListener("resize",this._onResize),document.addEventListener("visibilitychange",this._onVis),this._resize()}dispose(){this._alive=!1,cancelAnimationFrame(this.raf),this.raf=0,window.removeEventListener("resize",this._onResize),document.removeEventListener("visibilitychange",this._onVis),this.input.unbind(),this.sfx.stopMusic(),this.particles?.dispose(),this.backdrop?.dispose(),this.world?.clear();try{this.renderer?.forceContextLoss?.()}catch{}if(this.renderer?.dispose(),this.canvas?.parentNode){const t=this.canvas.cloneNode(!1);t.id="game",this.canvas.replaceWith(t),this.canvas=t}}applyAudio(t){this.sfx.setMix(t),!t?.muted&&this.state==="playing"&&!this.ended&&!this.paused&&this.sfx.startMusic()}setMuted(t){this.applyAudio({muted:t,music:this.sfx.musicLevel,sfx:this.sfx.sfxLevel})}_resize(){const t=Math.max(1,this.canvas.clientWidth),e=Math.max(1,this.canvas.clientHeight);this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix()}startLevel(t,e,n){this.level=t,this.levelIndex=e,this.ended=!0,this.paused=!0,this.pendingContinue=!1,this.coinMultiplier=1,this.failReason=null,this.movedEnough=!1,this._smashHint=!1,this._dodgeHint=!1,this._mulHint=!1,this.last=performance.now(),this.input.dragging=!1,this.preview.visible=!1,this.world.build(t),this.crowd.reset(t.startCount),this.crowd.applySkin(n),this.skinId=n,this.ended=!1,this.paused=!1,this.state="playing",this.sfx.ensure(),this.sfx.startMusic(),De.event("level_start",{level:e+1}),this.hud.setPlaying(!0),this.hud.setPaused(!1),this.hud.setCount(this.crowd.count),this.hud._countShown=this.crowd.count,this.hud._countGoal=this.crowd.count,this.hud.setLevel?.(e+1),this.hud.hideToast?.(),this.boostT=0,this.magnetT=0,this.starT=0,this.runTime=0,this.runScore=0,this._shownScore=-1,this.shield=!1,this.combo=0,this.nitroCd=0,this.fight=null,this.camX=0,this.camTilt=0,this._steerX=0,this._finishSlow=0,this.streakAtStart=this.streakAtStart||0,this.rewardSettled=!1,this.lastWin=null,this.lastFail=null,this.camera.fov=this.baseFov,this.camera.updateProjectionMatrix(),this.hud.setCombo?.(0),this.hud.setScore?.(0),this.hud.setProgress?.(0),this.hud.setSpeedFx?.(!1,!1),this._syncBuffs(),this.hud.setStreak?.(this.streakAtStart),this.hud.setFight?.(0,null),qe.gameplayStart()}goMenu(){this.state="menu",this.paused=!1,this.ended=!0,this.preview.visible=!0,this.hud.showMenu(),this.hud.setPaused(!1),this.sfx.startMusic(),qe.gameplayStop()}togglePause(){if(!(this.state!=="playing"||this.ended)){if(this.hud?.els?.help&&!this.hud.els.help.classList.contains("hidden")){this.hud.els.help.classList.add("hidden"),this.paused?(this.paused=!1,this.hud.setPaused(!1),this.sfx.startMusic()):(this.hud.setPaused(!0),this.paused=!0,this.sfx.stopMusic());return}this.paused=!this.paused,this.hud.setPaused(this.paused),this.paused?(this.sfx.stopMusic(),qe.gameplayStop()):(this.sfx.startMusic(),qe.gameplayStart())}}requestRestart(){vg(this.state,this.ended,this.paused)&&this.hud.onRestartRequest?.()}_laneFromInput(t){const e=this.input.steerAxis();let n=this._steerX;if(e!==0)this.movedEnough=!0,n=dr.clamp(this._steerX+e*26*t,-this.laneLimit,this.laneLimit);else if(this.input.dragging){const s=this.canvas.getBoundingClientRect(),r=(this.input.pointerX-s.left)/Math.max(1,s.width);this.movedEnough=!0,n=dr.clamp((r-.5)*2*this.laneLimit,-this.laneLimit,this.laneLimit)}else return this._steerX;return this._steerX+=(n-this._steerX)*Math.min(1,t*22),this._steerX}_buzz(t){try{navigator.vibrate?.(t)}catch{}}tick(){if(!this._alive)return;const t=performance.now(),e=Math.min(.033,(t-this.last)/1e3);this.last=t;const n=this.state==="playing"&&!this.ended&&!this.paused;if(this.world.tick(n?e:e*.15,this.reduceMotion,this.crowd.z,this.camera,this.crowd.x),this.crowd.applySkin(this.skinId||"lime",t/1e3),n){this.boostT=Math.max(0,this.boostT-e),this.magnetT=Math.max(0,this.magnetT-e),this.starT=Math.max(0,this.starT-e),this.nitroCd=Math.max(0,this.nitroCd-e),this.runTime+=e,this.crowd.shielded=this.shield,this._syncBuffs();const o=this._laneFromInput(e);this.crowd.targetX=o,this.crowd.compress+=(this._compressTarget()-this.crowd.compress)*Math.min(1,e*7);const l=!!this.fight;this._finishSlow=Math.max(0,this._finishSlow-e);const c=(l?1.35:this._runSpeed())*(this._finishSlow>0?.58:1);this.runScore+=e*c*(this.starT>0?2:1)*(1+this.combo*.08);const u=this.runScore|0;u!==this._shownScore&&(this._shownScore=u,this.hud.setScore?.(u)),this.crowd.update(e,this.laneLimit,{moving:!0,reduceMotion:this.reduceMotion,speed:c,fighting:l}),this._pullMagnet(e),this.hud.tickCount?.(e),this.fight?this._tickFight(e):(this._coachAhead(),this._collide());const h=this.world.finishZ||1;this.hud.setProgress?.(this.crowd.z/h),this.hud.setSpeedFx?.(this.boostT>.05,this.combo>=4)}else{const o=this.state==="win";this.crowd.update(e,this.laneLimit,{moving:o,reduceMotion:this.reduceMotion,speed:o?1.15:0}),this.hud.setSpeedFx?.(!1,!1),this.hud.tickCount?.(e)}this.backdrop.tick(e,this.crowd.z,this.reduceMotion),this.particles.update(e,this.reduceMotion),this.rim.position.set(this.crowd.x,4,this.crowd.z+4);const s=this.baseFov+(this.boostT>.05?9:this.fight?4:Math.min(5,this.runTime*.28));this.camera.fov+=(s-this.camera.fov)*Math.min(1,e*7),this.camera.updateProjectionMatrix(),this.camX+=(this.crowd.x-this.camX)*Math.min(1,e*6.2),this.camTilt+=(this.crowd.lean*.38-this.camTilt)*Math.min(1,e*8);const r=this.shake.offset(this.reduceMotion),a=this.reduceMotion||!(n||this.state==="win")?0:Math.sin(this.runTime*8)*.03;this.camera.position.set(this.camX*.38+r.x,6.15+r.y+a,this.crowd.z-9.15),this.camera.up.set(0,1,0),this.camera.lookAt(this.camX*.22+this.camTilt*1.1,.62,this.crowd.z+8.4),this.crowd.banner?.lookAt(this.camera.position),this.renderer.render(this.scene,this.camera),this._alive&&(this.raf=requestAnimationFrame(()=>this.tick()))}_runSpeed(){const t=1+Math.min(.18,this.combo*.04);return(8.15+Math.min(2.2,this.levelIndex*.07)+Math.min(1.6,this.runTime*.09))*(this.boostT>0?1.28:1)*t}_compressTarget(){const t=this.crowd.z,e=this.crowd.x;return this.world.colliders.find(s=>(s.kind==="wall"||s.kind==="saw"||s.kind==="hole"||s.kind==="spinner"||s.kind==="crusher")&&!s.used&&s.z-t<5.5&&s.z-t>.4&&Math.abs(e-s.x)<(s.width||1.4)*.85)?.7:1}_syncBuffs(){this.hud.setBuffs?.({shield:this.shield,boost:this.boostT>0,magnet:this.magnetT>0,star:this.starT>0})}_pullMagnet(t){const e=this.crowd.z,n=this.crowd.x,s=this.magnetT>0;for(const r of this.world.colliders){if(r.used||r.kind!=="coin")continue;const a=r.z-e;if(a>(s?11:2.6)||a<-1.2||!s&&Math.abs(r.x-n)>1.8)continue;const o=s?7.5:5.2;r.x+=(n-r.x)*Math.min(1,t*o),r.z+=(e+.35-r.z)*Math.min(1,t*(s?2.4:3.2)),r.mesh&&(r.mesh.position.x=r.x,r.mesh.position.z=r.z,r.mesh.rotation.y+=t*10)}}tryNitro(){this.state!=="playing"||this.ended||this.paused||this.nitroCd>0||(this.nitroCd=1.05,this.boostT=Math.max(this.boostT,.92),this.sfx.gate("mul"),this.crowd.impact("good"),this.hud.toast("NITRO"),this._syncBuffs())}_absorbOrHit(t){return this.shield?(this.shield=!1,this.hud.toast("SHIELD BROKE"),this.crowd.impact("land"),this.sfx.ui(),this._syncBuffs(),this.shake.punch(this.reduceMotion?.05:.18),!0):(t(),!1)}_beginFight(t,e){this.fight||t.used||(t.fighting=!0,t.charging=!1,this.fight={col:t,left:Math.max(1,(t.count||t.hp||1)|0),isFinish:!!e,acc:0},this.hud.toast(e?"FINAL FIGHT":"FIGHT!"),this.hud.setFight(this.crowd.count,this.fight.left),this.sfx.hit(),this.shake.punch(this.reduceMotion?.08:.22),this._buzz(24),this.particles.burst(this.crowd.x,.7,this.crowd.z+.4,16731501,10,3.4))}_tickFight(t){if(!this.fight||this.ended)return;const e=9+this.levelIndex*.45;this.fight.acc+=e*t;const n=Math.floor(this.fight.acc);if(n>=1){this.fight.acc-=n;const s=Math.min(1,this.fight.left,this.crowd.count);this.fight.left-=s,this.crowd.setCount(this.crowd.count-s,{knock:!0}),this.hud.setCount(this.crowd.count),this.world.setArmyCount(this.fight.col,this.fight.left),this.hud.setFight(this.crowd.count,this.fight.left),this.particles.burst(this.crowd.x+(Math.random()-.5)*.6,.55,this.crowd.z+.45,16731501,5,2.6),this.crowd.impact("land"),this.shake.punch(this.reduceMotion?.03:.11)}if(this.crowd.count<=0){const s=this.fight.isFinish;this.fight.col.fighting=!1,this.fight=null,this.hud.setFight(0,null),this._fail(s?"door":"wiped");return}if(this.fight.left<=0){const s=this.fight.col,r=this.fight.isFinish,a=s.hp||s.count||1;s.used=!0,s.fighting=!1,s.regroupT=.55,this.fight=null,this.hud.setFight(0,null),this.sfx.gate("mul"),this.crowd.celebrate=1.15,this.crowd.impact("good"),this.particles.burst(this.crowd.x,.8,this.crowd.z+.5,13041482,12,4),r?this._win(a):this.hud.toast("WIN")}}isLastLevel(){return this.levelIndex>=_s.length-1}_coachAhead(){const t=this.crowd.z,e=this.world.colliders.find(s=>(s.kind==="wall"||s.kind==="saw"||s.kind==="spinner"||s.kind==="crusher")&&!s.used&&s.z-t<9&&s.z-t>2.2);e&&!this._dodgeHint&&(this._dodgeHint=!0,this.hud.toast(e.x>=0?"Swipe LEFT around it":"Swipe RIGHT around it"));const n=this.world.colliders.find(s=>s.kind==="finish");n&&!this._smashHint&&n.z-t<11&&n.z-t>2&&t>5&&(this._smashHint=!0,this.hud.toast(this.crowd.count>=n.hp?"FIGHT — you are bigger":"Need a bigger army"))}_collide(){if(this.ended)return;const t=this.crowd.z,e=this.crowd.x,n=this.world.colliders.find(s=>s.kind==="finish");if(n&&!n.used&&t>=n.z-.7){this._beginFight(n,!0);return}for(const s of this.world.colliders){if(this.ended)return;if(s.used||s.kind==="finish")continue;const r=s.kind==="coin"||s.kind==="magnet"||s.kind==="star"||s.kind==="grow"?1.35:s.kind==="army"?2.6:.7;if(!(t<s.z-r||t>s.z+1.05)){if(s.kind==="gate"){const a=(s.width||2.2)*.5+.2;if(Math.abs(e-s.x)>a)continue;s.used=!0;for(const l of this.world.colliders)l.kind==="gate"&&l!==s&&Math.abs(l.z-s.z)<.05&&(l.used=!0);this.crowd.setCount(js(s.op,this.crowd.count,s.value),{spawnFrom:{x:s.x-this.crowd.x,z:.85},knock:s.op==="sub"||s.op==="div"}),this.hud.setCount(this.crowd.count),this.hud.floatText(jl(s.op,s.value),s.op==="sub"||s.op==="div"?"#ff6b9a":"#c6ff4a"),this.sfx.gate(s.op);const o=s.op==="add"||s.op==="mul";this.crowd.impact(o?"good":"bad"),this.shake.punch(this.reduceMotion?.05:s.op==="mul"?.22:.12),this._buzz(o?12:22),this.particles.burst(s.x,1.1,s.z,o?13041482:16739226,o?14:9,4.5),s.mesh&&(s.mesh.userData.hitT=.28),this.hud.onTutorialProgress?.("gate"),o?(this.combo+=1,this.hud.setCombo?.(this.combo),this.combo>=2&&this.hud.floatText(`COMBO x${this.combo}`,"#7af7ff"),this.combo===3&&this.onCombo?.()):(this.combo=0,this.hud.setCombo?.(0)),s.op==="mul"&&!this._mulHint&&(this._mulHint=!0,this.hud.toast("Pick the bigger number — then fight")),this.crowd.count<=0&&this._fail("wiped")}else if(s.kind==="coin"){const a=this.magnetT>0?2.35:1.5;if(Math.abs(e-s.x)>a)continue;s.used=!0,s.mesh&&(s.mesh.visible=!1);const o=Math.floor((s.amount||6)*(this.starT>0?2:1));this.onCoin?.(o),this.hud.burstCoins(o),this.hud.floatText(`+${o}`,"#ffd166"),this.particles.burst(s.x,.55,s.z,16765286,12,3.6),this.crowd.squash=Math.max(this.crowd.squash,1.16),this.sfx.coin()}else if(s.kind==="boost"){if(Math.abs(e-s.x)>1.45)continue;s.used=!0,s.mesh&&(s.mesh.visible=!1),this.boostT=Math.max(this.boostT,1.2),this.hud.toast("BOOST"),this.sfx.gate("mul"),this.crowd.impact("good"),this.particles.burst(s.x,.6,s.z,8058879,12,5),this._syncBuffs()}else if(s.kind==="magnet"){if(Math.abs(e-s.x)>1.5)continue;s.used=!0,s.mesh&&(s.mesh.visible=!1),this.magnetT=Math.max(this.magnetT,7.2),this.hud.toast("MAGNET"),this.sfx.gate("mul"),this.crowd.impact("good"),this.particles.burst(s.x,.7,s.z,13073919,14,5),this._syncBuffs()}else if(s.kind==="star"){if(Math.abs(e-s.x)>1.5)continue;s.used=!0,s.mesh&&(s.mesh.visible=!1),this.starT=Math.max(this.starT,8),this.hud.toast("x2 COINS"),this.sfx.win(),this.crowd.impact("good"),this.particles.burst(s.x,.7,s.z,16770406,14,5),this._syncBuffs()}else if(s.kind==="grow"){if(Math.abs(e-s.x)>1.5)continue;s.used=!0,s.mesh&&(s.mesh.visible=!1);const a=s.amount||8;this.crowd.setCount(this.crowd.count+a,{spawnFrom:{x:s.x-this.crowd.x,z:.4}}),this.hud.setCount(this.crowd.count),this.hud.toast("GROW"),this.hud.floatText(`+${a}`,"#ff6ad5"),this.sfx.gate("add"),this.crowd.impact("good"),this.particles.burst(s.x,.7,s.z,16739029,14,5)}else if(s.kind==="shield"){if(Math.abs(e-s.x)>1.45)continue;s.used=!0,s.mesh&&(s.mesh.visible=!1),this.shield=!0,this.hud.toast("SHIELD"),this.sfx.win(),this.crowd.impact("good"),this.particles.burst(s.x,.8,s.z,6746367,12,4),this._syncBuffs()}else if(s.kind==="army"){if(Math.abs(e-s.x)>2.5)continue;this._beginFight(s,!1);return}else if(s.kind==="saw"||s.kind==="wall"||s.kind==="spinner"||s.kind==="crusher"){if(Math.abs(e-s.x)>s.width*.62+this.crowd.radius()*.38)continue;s.used=!0,s.mesh&&(s.mesh.userData.hitT=.22),this.combo=0,this.hud.setCombo?.(0),this._absorbOrHit(()=>{this.crowd.setCount(this.crowd.count-(s.damage||3),{knock:!0}),this.hud.setCount(this.crowd.count),this.hud.floatText(`-${s.damage||3}`,"#ff6b9a"),this.sfx.hit(),this.crowd.impact("bad"),this.shake.punch(this.reduceMotion?.08:.26),this._buzz(30),this.particles.burst(s.x,.8,s.z,16731501,12,4),this.hud.onTutorialProgress?.("hazard"),this.crowd.count<=0&&this._fail("hazard")})}else if(s.kind==="hole"){if(Math.abs(e-s.x)>s.width*.52)continue;s.used=!0,this.combo=0,this.hud.setCombo?.(0),this._absorbOrHit(()=>{const a=Math.max(2,Math.floor(this.crowd.count*.3));this.crowd.setCount(this.crowd.count-a,{sink:!0,sinkToward:{x:s.x-this.crowd.x,z:s.z-this.crowd.z}}),this.hud.setCount(this.crowd.count),this.hud.floatText(`-${a}`,"#ff6b9a"),this.sfx.hit(),this.crowd.impact("bad"),this.shake.punch(this.reduceMotion?.08:.22),this._buzz(26),this.particles.burst(s.x,.15,s.z,4860552,14,2.2),s.mesh&&(s.mesh.userData.suckT=.7),this.hud.onTutorialProgress?.("hazard"),this.crowd.count<=0&&this._fail("hole")})}}}}_win(t){this.ended=!0,this.state="win";const e=Math.max(0,this.crowd.count-t),n=this.combo*5,s=(this.streakAtStart||0)+1,r=(Math.max(8,10+e+this.levelIndex)+n+s*4)*this.coinMultiplier;this.lastReward=r,this.rewardSettled=!1,this.lastWin={coins:r,leftover:e,crowd:this.crowd.count,doorHp:t,stars:Ql({leftover:e,doorHp:t})},this.sfx.smash(),this.sfx.win(),this.sfx.coin(),this.world.smashDoor(),this.crowd.impact("good"),this.crowd.celebrate=1.7,this._finishSlow=.85,this.shake.punch(this.reduceMotion?.1:.4),this._buzz(40),this.particles.burst(this.crowd.x,1.4,this.crowd.z+1,16765286,28,6),this.hud.burstCoins(r),De.event("level_win",{level:this.levelIndex+1,coins:r}),this.hud.onTutorialProgress?.("win");const a=this.isLastLevel();qe.happyTime(),qe.gameplayStop();const o={title:a?"ALL CLEAR!":"COMPLETE!",subtitle:`+${r} coins · streak ${s}${n?` · combo x${this.combo}`:""}`,primary:a?"Finish":"Next",secondary:"Watch · 2x coins",mode:"win",stars:this.lastWin.stars,leftover:e,crowd:this.crowd.count};window.setTimeout(()=>{this.state==="win"&&this.hud.showResult(o)},620)}_fail(t){this.ended=!0,this.state="fail",this.failReason=t;const e=this.world.colliders.find(s=>s.kind==="finish"),n=ah({reason:t,crowd:this.crowd.count,doorHp:e?.hp||0});this.lastFail=n,this.sfx.fail(),this.crowd.impact(t==="hole"?"bad":"land"),n.close&&this.shake.punch(this.reduceMotion?.08:.22),De.event("level_fail",{level:this.levelIndex+1,reason:t}),qe.gameplayStop(),this.hud.showResult({title:n.close?"SO CLOSE":t==="door"?"TOO SMALL":"FAIL",subtitle:`${n.line} · AGAIN`,primary:"Again",secondary:"Watch · +15 crowd",mode:"fail"})}continueWithBurst(){this.fight=null,this.ended=!1,this.state="playing",this.paused=!1,this.crowd.setCount(Math.max(this.crowd.count,0)+15,{spawnFrom:{x:0,z:.6}}),this.crowd.impact("good");const t=this.world.colliders.find(e=>e.kind==="finish");t&&(t.used=!1,t.mesh&&(t.mesh.visible=!0),this.world.setArmyCount(t,t.hp||t.count||1),this.crowd.z=Math.min(this.crowd.z,t.z-1.25)),this.hud.setCount(this.crowd.count),this.hud.hideResult(),this.hud.setPaused(!1),this.sfx.startMusic(),this.pendingContinue=!1,qe.gameplayStart()}doubleCoins(){return this.coinMultiplier>=2?!1:(this.coinMultiplier=2,this.lastReward=(this.lastReward||0)*2,this.lastWin&&(this.lastWin.coins=this.lastReward),this.hud.setResultSubtitle(`+${this.lastReward} coins`),this.hud.burstCoins(this.lastReward),this.hud.disableSecondary?.(),this.sfx.coin(),!0)}}const Wl="blobtide_tutorial",yg={sessionsStarted:0,skipped:!1,completedFull:!1,completedRefresher:!1,hideInstructions:!1};function zi(i){return{...yg,...i&&typeof i=="object"?i:{}}}function Sg(i,{replay:t=!1}={}){const e=zi(i);return e.hideInstructions&&!t?"none":t?"full":e.skipped?"none":e.sessionsStarted<=0?"full":e.sessionsStarted===1&&!e.completedRefresher?"refresher":"none"}function bg(i,{replay:t=!1}={}){const e=zi(i),n=Sg(e,{replay:t});return!t&&(n==="full"||n==="refresher")&&(e.sessionsStarted=Math.min(2,e.sessionsStarted+1)),t&&(e.hideInstructions=!1),{state:e,mode:n}}function bs(i,t){const e=zi(i);return t==="skip"?(e.skipped=!0,e.completedFull=!0,e.completedRefresher=!0):t==="complete-full"?e.completedFull=!0:t==="complete-refresher"?e.completedRefresher=!0:t==="hide"?e.hideInstructions=!0:t==="show"&&(e.hideInstructions=!1),e}function wg(i){return{load(){try{return zi(JSON.parse(i.getItem(Wl)||"null"))}catch{return zi(null)}},save(t){i.setItem(Wl,JSON.stringify(zi(t)))}}}const Zs={_data:null,getItem(){return this._data},setItem(i,t){this._data=t}},Gc=wg({getItem(i){try{return typeof localStorage>"u"?Zs.getItem(i):localStorage.getItem(i)}catch{return Zs.getItem(i)}},setItem(i,t){try{if(typeof localStorage>"u")return Zs.setItem(i,t);localStorage.setItem(i,t)}catch{Zs.setItem(i,t)}}}),Xl=[{id:"move",title:"Swipe",body:"Drag to swerve. Green grows you."},{id:"gates",title:"Pick a side",body:"Hit + / x. Dodge red."},{id:"door",title:"Fight",body:"If your number is bigger, you win the clash."}],Eg={id:"refresher",title:"Quick reminder",body:"Hit green gates. Dodge red. Fight if you are bigger."};class Tg{constructor(t){this.root=t,this.capture=new URLSearchParams(location.search).has("capture"),this.tutorialMode="none",this.stepIndex=0,this.onRestartRequest=null,this.onTutorialProgress=null,this.root.innerHTML=`
      <div class="safe ${this.capture?"capture":""}" id="shell">
        <div id="splash" class="splash">
          <div class="splash-mark"></div>
          <p>BLOBTIDE</p>
        </div>

        <div id="scrim" class="scrim hidden"></div>

        <div class="wallet" id="wallet">
          <span class="coin-ico" aria-hidden="true"></span>
          <span id="coins">0</span>
        </div>

        <header class="play-hud hidden" id="play-hud">
          <button type="button" id="pause-btn" class="icon-btn" aria-label="Pause">
            <span class="pause-bars"></span>
          </button>
          <div class="hud-center">
            <div class="run-wrap">
              <span class="level-pill" id="level-badge">LEVEL 1</span>
              <div class="run-bar" aria-hidden="true"><i id="run-fill"></i></div>
              <span class="score-pill" id="score-pill">0</span>
            </div>
            <div class="crowd-hero">
              <span class="lbl" id="crowd-lbl">BLOBS</span>
              <span id="count">0</span>
            </div>
            <div class="fight-hud hidden" id="fight-hud">
              <div class="fight-side blobs">
                <small>BLOBS</small>
                <b id="fight-blobs">0</b>
              </div>
              <span class="fight-vs">VS</span>
              <div class="fight-side rivals">
                <small>RIVALS</small>
                <b id="fight-rivals">0</b>
              </div>
            </div>
            <div class="combo hidden" id="combo">COMBO x2</div>
            <div class="streak-pill hidden" id="streak-pill">STREAK 0</div>
            <div class="buffs">
              <span id="boost-pip" class="pip hidden">BOOST</span>
              <span id="magnet-pip" class="pip hidden">MAGNET</span>
              <span id="star-pip" class="pip hidden">x2</span>
              <span id="shield-pip" class="pip hidden">SHIELD</span>
            </div>
          </div>
        </header>

        <div id="speedlines" class="speedlines hidden" aria-hidden="true"></div>
        <div id="float" class="float"></div>
        <div id="coin-fx" class="coin-fx" aria-hidden="true"></div>
        <div id="toast" class="toast hidden"></div>

        <div id="hint" class="hint-card hidden">
          <div class="arrows" aria-hidden="true"><span>←</span><span class="blob-dot"></span><span>→</span></div>
          <h3 id="hint-title"></h3>
          <p id="hint-body"></p>
          <div class="hint-actions">
            <button type="button" id="hint-next" class="cta sm">GOT IT</button>
            <button type="button" id="hint-skip" class="ghost sm">Skip</button>
            <button type="button" id="hint-hide" class="text-btn">Hide tips</button>
          </div>
        </div>

        <section id="menu" class="home">
          <div class="brand">
            <div class="logo-blobs" aria-hidden="true">
              <i></i><i></i><i></i>
            </div>
            <h1>BLOBTIDE</h1>
            <p class="tag">GATES · GROW · FIGHT</p>
            <div class="hook" id="hook">
              <span class="chip" id="hook-streak">STREAK 0</span>
              <span class="chip" id="hook-mission">Win 3 levels</span>
              <span class="chip dim" id="hook-skin"></span>
            </div>
          </div>
            <button type="button" id="play" class="cta play-cta">TAP TO PLAY</button>
          <nav class="dock">
            <button type="button" id="levels" class="dock-btn" aria-label="Levels">
              <span class="dock-ico map"></span>
              <small>Levels</small>
            </button>
            <button type="button" id="skins" class="dock-btn" aria-label="Skins">
              <span class="dock-ico bag"></span>
              <small>Shop</small>
            </button>
            <button type="button" id="how" class="dock-btn" aria-label="Settings">
              <span class="dock-ico gear"></span>
              <small>Settings</small>
            </button>
            <button type="button" id="iap" class="dock-btn" aria-label="Remove ads">
              <span class="dock-ico ads"></span>
              <small>No Ads</small>
            </button>
          </nav>
        </section>

        <section id="levels-sheet" class="sheet hidden">
          <div class="sheet-head">
            <h2>LEVELS</h2>
            <button type="button" id="levels-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <div id="level-grid" class="level-grid"></div>
        </section>

        <section id="shop" class="sheet hidden">
          <div class="sheet-head">
            <h2>SHOP</h2>
            <button type="button" id="shop-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <div id="skin-grid" class="skin-grid"></div>
          <div class="packs">
            <button type="button" data-pack="small"><b>+200</b><span>0.99</span></button>
            <button type="button" data-pack="medium"><b>+1000</b><span>3.99</span></button>
            <button type="button" data-pack="prism"><b>PRISM</b><span>IAP</span></button>
          </div>
          <p class="shop-legal">Coin packs, Prism, and No Ads bill through Google Play or the App Store in the mobile apps. The web game keeps your local save only.</p>
        </section>

        <section id="help" class="sheet hidden">
          <div class="sheet-head">
            <h2>SETTINGS</h2>
            <button type="button" id="help-back" class="icon-btn x" aria-label="Close">✕</button>
          </div>
          <ul class="help-list">
            <li><strong>Steer</strong> Hold and drag. The army follows your pointer.</li>
            <li><strong>Gates</strong> Green + / × grows you. Red − / ÷ shrinks you. Pick a side on splits.</li>
            <li><strong>Fight</strong> Crash the red army. Bigger number wins. Leftover stays with you.</li>
            <li><strong>Finish</strong> Beat the last red army at the gold line.</li>
            <li><strong>Traps</strong> Saws, walls, and holes steal people. Swipe around them.</li>
            <li><strong>Pause</strong> Top-left, or P / Esc. Restart with R from pause or results.</li>
          </ul>
          <label class="switch"><input type="checkbox" id="mute-toggle" /><span></span> Mute music & SFX</label>
          <label class="vol">Music <input type="range" id="music-vol" min="0" max="100" value="70" /></label>
          <label class="vol">SFX <input type="range" id="sfx-vol" min="0" max="100" value="100" /></label>
          <label class="switch"><input type="checkbox" id="hide-toggle" /><span></span> Hide tips</label>
          <button type="button" id="replay-tutorial" class="ghost">Replay tutorial</button>
        </section>

        <section id="pause" class="overlay-card hidden">
          <h2>PAUSED</h2>
          <button type="button" id="resume" class="cta">RESUME</button>
          <button type="button" id="pause-retry" class="ghost">RESTART</button>
          <button type="button" id="pause-help" class="ghost">SETTINGS</button>
          <button type="button" id="pause-menu" class="text-btn">Home</button>
        </section>

        <section id="result" class="overlay-card hidden">
          <div class="result-badge" id="result-badge"></div>
          <h2 id="result-title"></h2>
          <p id="result-sub"></p>
          <p id="result-stars" class="stars" hidden></p>
          <p id="result-best" class="best-line" hidden></p>
          <button type="button" id="result-primary" class="cta"></button>
          <button type="button" id="result-secondary" class="ghost ad-btn"></button>
          <button type="button" id="result-replay" class="ghost">Replay</button>
          <button type="button" id="result-menu" class="text-btn">Home</button>
        </section>

        <div id="ad" class="ad hidden">
          <p id="ad-kicker">Ad break</p>
          <h3 id="ad-title"></h3>
          <p id="ad-body"></p>
          <div class="ad-bar"><i></i></div>
        </div>
      </div>
    `,this.els={shell:this.root.querySelector("#shell"),splash:this.root.querySelector("#splash"),scrim:this.root.querySelector("#scrim"),count:this.root.querySelector("#count"),crowdLbl:this.root.querySelector("#crowd-lbl"),fightHud:this.root.querySelector("#fight-hud"),fightBlobs:this.root.querySelector("#fight-blobs"),fightRivals:this.root.querySelector("#fight-rivals"),coins:this.root.querySelector("#coins"),playHud:this.root.querySelector("#play-hud"),combo:this.root.querySelector("#combo"),boostPip:this.root.querySelector("#boost-pip"),magnetPip:this.root.querySelector("#magnet-pip"),starPip:this.root.querySelector("#star-pip"),shieldPip:this.root.querySelector("#shield-pip"),scorePill:this.root.querySelector("#score-pill"),runFill:this.root.querySelector("#run-fill"),speedlines:this.root.querySelector("#speedlines"),levelBadge:this.root.querySelector("#level-badge"),float:this.root.querySelector("#float"),coinFx:this.root.querySelector("#coin-fx"),toast:this.root.querySelector("#toast"),menu:this.root.querySelector("#menu"),shop:this.root.querySelector("#shop"),help:this.root.querySelector("#help"),pause:this.root.querySelector("#pause"),result:this.root.querySelector("#result"),resultBadge:this.root.querySelector("#result-badge"),resultTitle:this.root.querySelector("#result-title"),resultSub:this.root.querySelector("#result-sub"),resultStars:this.root.querySelector("#result-stars"),resultBest:this.root.querySelector("#result-best"),resultPrimary:this.root.querySelector("#result-primary"),resultSecondary:this.root.querySelector("#result-secondary"),resultReplay:this.root.querySelector("#result-replay"),resultMenu:this.root.querySelector("#result-menu"),play:this.root.querySelector("#play"),hook:this.root.querySelector("#hook"),hookStreak:this.root.querySelector("#hook-streak"),hookMission:this.root.querySelector("#hook-mission"),hookSkin:this.root.querySelector("#hook-skin"),streakPill:this.root.querySelector("#streak-pill"),skins:this.root.querySelector("#skins"),levels:this.root.querySelector("#levels"),levelsSheet:this.root.querySelector("#levels-sheet"),levelsBack:this.root.querySelector("#levels-back"),levelGrid:this.root.querySelector("#level-grid"),how:this.root.querySelector("#how"),iap:this.root.querySelector("#iap"),shopBack:this.root.querySelector("#shop-back"),helpBack:this.root.querySelector("#help-back"),skinGrid:this.root.querySelector("#skin-grid"),ad:this.root.querySelector("#ad"),adTitle:this.root.querySelector("#ad-title"),adBody:this.root.querySelector("#ad-body"),pauseBtn:this.root.querySelector("#pause-btn"),resume:this.root.querySelector("#resume"),pauseHelp:this.root.querySelector("#pause-help"),pauseRetry:this.root.querySelector("#pause-retry"),pauseMenu:this.root.querySelector("#pause-menu"),hint:this.root.querySelector("#hint"),hintTitle:this.root.querySelector("#hint-title"),hintBody:this.root.querySelector("#hint-body"),hintNext:this.root.querySelector("#hint-next"),hintSkip:this.root.querySelector("#hint-skip"),hintHide:this.root.querySelector("#hint-hide"),muteToggle:this.root.querySelector("#mute-toggle"),musicVol:this.root.querySelector("#music-vol"),sfxVol:this.root.querySelector("#sfx-vol"),hideToggle:this.root.querySelector("#hide-toggle"),replayTutorial:this.root.querySelector("#replay-tutorial")},setTimeout(()=>this.els.splash?.classList.add("gone"),700)}hideSplash(){this.els.splash?.classList.add("gone")}setCoins(t){this.els.coins.textContent=String(t),this.els.coins.parentElement?.classList.remove("pop"),this.els.coins.offsetWidth,this.els.coins.parentElement?.classList.add("pop")}setHook(t){if(t){if(this.els.hookStreak&&(this.els.hookStreak.textContent=`STREAK ${t.winStreak}`),this.els.hookMission&&(this.els.hookMission.textContent=t.mission),this.els.hookSkin){const e=t.nextSkin;this.els.hookSkin.textContent=e?`${e.name} ${Math.min(e.have,e.price)}/${e.price}`:"All skins owned"}this.setStreak(t.winStreak)}}setStreak(t){if(!this.els.streakPill)return;const e=Math.max(0,t|0);this.els.streakPill.textContent=`STREAK ${e}`,this.els.streakPill.classList.toggle("hidden",e<2),this.els.streakPill.classList.toggle("hot",e>=5)}setLevel(t){this.els.levelBadge&&(this.els.levelBadge.textContent=`LEVEL ${t}`)}setCombo(t){this.els.combo&&(t>=2?(this.els.combo.textContent=`COMBO x${t}`,this.els.combo.classList.remove("hidden")):this.els.combo.classList.add("hidden"))}setScore(t){this.els.scorePill&&(this.els.scorePill.textContent=`${Math.max(0,t|0)}`)}setProgress(t){this.els.runFill&&(this.els.runFill.style.width=`${Math.max(0,Math.min(1,t))*100}%`)}setSpeedFx(t,e=!1){this.els.speedlines?.classList.toggle("hidden",!t),this.els.shell?.classList.toggle("boosting",!!t),this.els.shell?.classList.toggle("fever",!!e)}setBuffs({shield:t=!1,boost:e=!1,magnet:n=!1,star:s=!1}={}){this.els.shieldPip?.classList.toggle("hidden",!t),this.els.boostPip?.classList.toggle("hidden",!e),this.els.magnetPip?.classList.toggle("hidden",!n),this.els.starPip?.classList.toggle("hidden",!s)}setCount(t){this._countGoal=Math.max(0,t|0),this.els.count.classList.remove("pop"),this.els.count.offsetWidth,this.els.count.classList.add("pop"),this._countShown==null&&(this._countShown=this._countGoal,this.els.count.textContent=String(this._countGoal)),this.els.fightBlobs&&!this.els.fightHud?.classList.contains("hidden")&&(this.els.fightBlobs.textContent=String(this._countGoal))}setFight(t,e){const n=e!=null&&e>=0;this.els.fightHud?.classList.toggle("hidden",!n),this.els.shell?.classList.toggle("in-fight",n),n&&(this.els.fightBlobs&&(this.els.fightBlobs.textContent=String(Math.max(0,t|0))),this.els.fightRivals&&(this.els.fightRivals.textContent=String(Math.max(0,e|0))))}tickCount(t=.016){if(this._countShown==null||this._countShown===this._countGoal)return;const e=this._countGoal-this._countShown;this._countShown+=Math.sign(e)*Math.min(Math.abs(e),Math.max(1,Math.abs(e)*t*16)),Math.abs(this._countGoal-this._countShown)<.51&&(this._countShown=this._countGoal),this.els.count.textContent=String(Math.round(this._countShown))}_setScrim(t){this.els.scrim?.classList.toggle("hidden",!t)}setPlaying(t){this.els.menu.classList.toggle("hidden",t),this.els.shop.classList.add("hidden"),this.els.help.classList.add("hidden"),this.els.levelsSheet?.classList.add("hidden"),t&&this.els.result.classList.add("hidden"),this.els.playHud.classList.toggle("hidden",!t),this.els.pauseBtn.classList.toggle("hidden",!t),this.els.shell.classList.toggle("in-play",t),this._setScrim(!1),t||this.setFight(0,null)}showMenu(){this.els.menu.classList.remove("hidden"),this.els.shop.classList.add("hidden"),this.els.help.classList.add("hidden"),this.els.levelsSheet?.classList.add("hidden"),this.els.result.classList.add("hidden"),this.els.pause.classList.add("hidden"),this.els.playHud.classList.add("hidden"),this.els.pauseBtn.classList.add("hidden"),this.els.shell.classList.remove("in-play"),this._setScrim(!1),this.setFight(0,null),this.hideHint()}showLevels(){this.els.menu.classList.add("hidden"),this.els.shop.classList.add("hidden"),this.els.help.classList.add("hidden"),this.els.result.classList.add("hidden"),this.els.levelsSheet.classList.remove("hidden"),this._setScrim(!0)}showShop(){this._showOnly("shop")}showHelp(){this.els.menu.classList.add("hidden"),this.els.shop.classList.add("hidden"),this.els.levelsSheet?.classList.add("hidden"),this.els.help.classList.remove("hidden"),this.els.result.classList.add("hidden"),this._setScrim(!0)}_showOnly(t){for(const e of["menu","shop","help","result"])this.els[e].classList.toggle("hidden",e!==t);this._setScrim(t==="shop"||t==="help")}setPaused(t){if(this.els.pause.classList.toggle("hidden",!t),this.els.pauseBtn.classList.toggle("hidden",t||!this.els.shell.classList.contains("in-play")),!this.els.result.classList.contains("hidden")){this.els.pause.classList.add("hidden");return}this.els.shell.classList.contains("in-play")&&this._setScrim(t)}showResult({title:t,subtitle:e,primary:n,secondary:s,mode:r,stars:a=0,best:o=null,leftover:l,crowd:c}){if(this.els.result.classList.remove("hidden"),this.els.result.classList.remove("pop-in"),this.els.result.offsetWidth,this.els.result.classList.add("pop-in"),this.els.pause.classList.add("hidden"),this.els.pauseBtn.classList.add("hidden"),this.els.playHud.classList.add("hidden"),this.setFight(0,null),this._setScrim(!0),this.els.resultTitle.textContent=t,this.els.resultSub.textContent=e,this.els.resultPrimary.textContent=n.toUpperCase(),this.els.resultSecondary.textContent=s,this.els.result.dataset.mode=r,this.els.result.classList.toggle("win",r==="win"),this.els.result.classList.toggle("fail",r==="fail"),this.els.resultBadge.textContent=r==="win"?"★":"!",this.els.resultSecondary.disabled=!1,this.els.resultPrimary.disabled=!1,this.els.resultReplay&&(this.els.resultReplay.disabled=!1),this.els.resultStars&&(r==="win"&&a>0?(this.els.resultStars.hidden=!1,this.els.resultStars.textContent=`${"★".repeat(a)}${"☆".repeat(3-a)}`):this.els.resultStars.hidden=!0),this.els.resultBest)if(r==="win"&&c!=null){this.els.resultBest.hidden=!1;const u=o?.bestCoins?` · BEST ${o.bestCoins}`:"";this.els.resultBest.textContent=`Crowd ${c} · leftover ${l??0}${u}`}else this.els.resultBest.hidden=!0}disableSecondary(){this.els.resultSecondary&&(this.els.resultSecondary.disabled=!0)}setResultSubtitle(t){this.els.resultSub.textContent=t}hideResult(){this.els.result.classList.add("hidden"),this.els.resultPrimary.disabled=!1,this.els.resultSecondary.disabled=!1,this._setScrim(!1),this.els.shell.classList.contains("in-play")&&(this.els.playHud.classList.remove("hidden"),this.els.pauseBtn.classList.remove("hidden"))}toast(t){this.els.toast.textContent=t,this.els.toast.classList.remove("hidden"),clearTimeout(this._toast),this._toast=setTimeout(()=>this.els.toast.classList.add("hidden"),1100)}hideToast(){clearTimeout(this._toast),this.els.toast?.classList.add("hidden")}floatText(t,e){const n=document.createElement("div");n.className="floater",n.textContent=t,n.style.color=e,this.els.float.appendChild(n),setTimeout(()=>n.remove(),700)}burstCoins(t){const e=Math.min(8,3+Math.floor(t/12));for(let n=0;n<e;n++){const s=document.createElement("span");s.className="coin-bit",s.style.setProperty("--dx",`${(Math.random()-.5)*80}px`),s.style.animationDelay=`${n*40}ms`,this.els.coinFx.appendChild(s),setTimeout(()=>s.remove(),700)}}showAd(t,e){this.els.ad.classList.remove("hidden"),this.els.adTitle.textContent=t,this.els.adBody.textContent=e}hideAd(){this.els.ad.classList.add("hidden")}startTutorial(t){if(this.tutorialMode=t,this.stepIndex=0,t==="none"){this.hideHint();return}this.renderHint()}renderHint(){if(this.tutorialMode==="none"){this.hideHint();return}const t=this.tutorialMode==="refresher"?Eg:Xl[this.stepIndex];if(!t){this.hideHint();return}this.els.hint.classList.remove("hidden"),this.els.hintTitle.textContent=t.title,this.els.hintBody.textContent=t.body,this.els.hint.dataset.step=t.id,this.els.hint.classList.toggle("move-step",t.id==="move")}hideHint(){this.els.hint.classList.add("hidden")}advanceTutorial(){return this.tutorialMode==="refresher"?(this.tutorialMode="none",this.hideHint(),"complete-refresher"):(this.stepIndex+=1,this.stepIndex>=Xl.length?(this.tutorialMode="none",this.hideHint(),"complete-full"):(this.renderHint(),null))}renderSkins(t,e,n){this.els.skinGrid.innerHTML="";for(const s of t){const r=e.ownedSkins.includes(s.id),a=e.equipped===s.id,o=document.createElement("button");o.type="button",o.className="skin-card"+(a?" on":"")+(r?" owned":"");const l=`#${s.color.toString(16).padStart(6,"0")}`;o.innerHTML=`
        <span class="skin-orb" style="background:${l}"></span>
        <span class="skin-name">${s.name}</span>
        <span class="skin-meta">${a?"EQUIPPED":r?"OWNED":s.iap?"IAP":`${s.price}`}</span>`,o.onclick=()=>n(s),this.els.skinGrid.appendChild(o)}}renderLevels(t,e,n){if(this.els.levelGrid){this.els.levelGrid.innerHTML="";for(let s=0;s<t;s++){const r=e.isUnlocked(s),a=e.stats?.[s],o=document.createElement("button");if(o.type="button",o.className="lvl-btn"+(r?"":" locked")+(a?.completed?" done":"")+(r&&s===e.maxUnlocked?" now":""),o.disabled=!r,o.textContent=r?String(s+1):"•",a?.stars){const l=document.createElement("small");l.textContent="★".repeat(a.stars),o.appendChild(l)}o.onclick=()=>r&&n(s),this.els.levelGrid.appendChild(o)}}}}const ql="blobtide_settings",Yl={music:.7,sfx:1};function $l(i,t){const e=Number(i);return Number.isFinite(e)?Math.min(1,Math.max(0,e)):t}function Jl(i){const t=i&&typeof i=="object"?i:{};return{muted:t.muted===!0,music:$l(t.music,Yl.music),sfx:$l(t.sfx,Yl.sfx)}}const br={load(){return Jl(nc(ql,null))},save(i){ic(ql,Jl(i))}};function Kl(i,t){return new Promise(e=>{let n=!1;const s=a=>{n||(n=!0,e(a))},r=setTimeout(()=>s(!1),35e3);try{i.ad.requestAd(t,{adStarted(){},adFinished(){clearTimeout(r),s(!0)},adError(){clearTimeout(r),s(!1)}})}catch{clearTimeout(r),s(!1)}})}async function Ag(){const i=globalThis.window?.CrazyGames?.SDK;if(!i||typeof i.init!="function")return!1;try{i.game?.loadingStart?.(),await Promise.race([i.init(),new Promise((t,e)=>setTimeout(()=>e(new Error("sdk timeout")),4e3))]),i.game?.loadingStop?.()}catch{try{i.game?.loadingStop?.()}catch{}return!1}return globalThis.window.BlobtidePlatform={gameplayStart(){i.game.gameplayStart()},gameplayStop(){i.game.gameplayStop()},happyTime(){(i.game.happytime||i.game.happyTime)?.call(i.game)},async commercialBreak(){return Kl(i,"midgame")},async rewardedBreak(){return Kl(i,"rewarded")}},!0}const Cg=document.querySelector("#game"),X=new Tg(document.querySelector("#hud"));window.__blobtideCleanup&&window.__blobtideCleanup();let Pt;try{Pt=new Mg(document.querySelector("#game")||Cg,X)}catch(i){console.error(i),X.toast(String(i.message||i)),Pt={state:"menu",paused:!1,ended:!0,lastReward:0,levelIndex:0,movedEnough:!1,skinId:"lime",sfx:{ui(){},ensure(){},setMuted(){},startMusic(){},stopMusic(){}},applyAudio(){},setMuted(){},startLevel(){},togglePause(){},goMenu(){X.showMenu()},continueWithBurst(){},doubleCoins(){},tick(){},dispose(){}}}window.__blobtideCleanup=()=>{Pt?.dispose?.(),window.__blobtideMoveWatch&&(cancelAnimationFrame(window.__blobtideMoveWatch),window.__blobtideMoveWatch=0)};const Ct=hh.load(),Hc=new dh(Ct,X),Gi=new ph(Ct);let Me=Gc.load(),Ge=br.load(),or=!1;X.setCoins(Ct.coins);X.els.muteToggle.checked=Ge.muted;X.els.musicVol&&(X.els.musicVol.value=String(Math.round(Ge.music*100)));X.els.sfxVol&&(X.els.sfxVol.value=String(Math.round(Ge.sfx*100)));Pt.applyAudio(Ge);Pt.onCoin=i=>{Ct.addCoins(i),X.setCoins(Ct.coins),De.event("coins_collected",{amount:i});const t=Ct.pushMission("coins",i);t.completed&&X.toast(`${t.mission.label} · +${t.reward}`),Rn()};!gr()&&X.els.iap&&(X.els.iap.classList.add("hidden"),X.root.querySelector(".packs")?.classList.add("hidden"),X.root.querySelector(".shop-legal")?.classList.add("hidden"));Ct.maxUnlocked>0&&X.els.play&&(X.els.play.textContent="CONTINUE");X.els.hideToggle.checked=Me.hideInstructions;function Rn(){const i=Ct.hookView();X.setHook(i),i.winStreak>=2&&X.els.play?X.els.play.textContent="KEEP GOING":Ct.maxUnlocked>0&&X.els.play&&(X.els.play.textContent="CONTINUE")}const aa=Ct.claimDaily();X.setCoins(Ct.coins);aa.claim>0&&X.toast(`Day ${aa.streak} bonus · +${aa.claim}`);Rn();Pt.onCombo=()=>{const i=Ct.pushMission("combo",1);i.completed&&X.toast(`${i.mission.label} · +${i.reward}`),Rn()};function Qi(){Gc.save(Me),X.els.hideToggle.checked=Me.hideInstructions}function ce(){Pt.sfx.ui(),Pt.sfx.ensure(),Pt.state==="menu"&&Pt.sfx.startMusic()}function Vc(){const i=Math.min(Ct.levelIndex,_s.length-1);return{level:_s[i],index:i}}let Zl=!1;function Zn({countSession:i=!0}={}){Zl||(Zl=!0,De.event("game_started")),Ct.campaignComplete&&Pt.state==="menu"&&(Ct.beginNewRun(),X.toast("New run · Level 1"));const{level:t,index:e}=Vc();if(X.setCoins(Ct.coins),Pt.streakAtStart=Ct.winStreak,Rn(),i||or){const n=bg(Me,{replay:or});Me=n.state,or=!1,Qi(),X.startTutorial(n.mode),De.event("tutorial_mode",{mode:n.mode})}Pt.startLevel(t,e,Ct.equipped)}function Wc(){if(Pt.state==="menu")return;X.hideResult(),Pt.streakAtStart=Ct.winStreak;const{level:i,index:t}=Vc();Pt.startLevel(i,t,Ct.equipped)}X.onRestartRequest=Wc;X.onTutorialProgress=i=>{if(X.tutorialMode==="none")return;const t=X.els.hint.dataset.step;i==="gate"&&t==="gates"&&gs(),i==="hazard"&&t==="hazards"&&gs(),i==="win"&&(t==="door"||X.tutorialMode==="refresher")&&gs()};function gs(){const i=X.advanceTutorial();i&&(Me=bs(Me,i),Qi())}function Xc(){X.tutorialMode==="full"&&X.els.hint.dataset.step==="move"&&Pt.movedEnough&&gs(),window.__blobtideMoveWatch=requestAnimationFrame(Xc)}window.__blobtideMoveWatch&&cancelAnimationFrame(window.__blobtideMoveWatch);Xc();X.els.play.onclick=()=>{ce(),Zn()};X.els.skins.onclick=()=>{ce(),X.renderSkins($n,Ct,mr),X.showShop()};X.els.levels.onclick=()=>{ce(),X.renderLevels(_s.length,Ct,i=>{Ct.levelIndex=i,Ct.save(),X.showMenu(),Zn({countSession:!1})}),X.showLevels()};X.els.levelsBack.onclick=()=>{ce(),X.showMenu()};X.els.how.onclick=()=>{ce(),X.showHelp()};X.els.shopBack.onclick=()=>{ce(),X.showMenu()};X.els.helpBack.onclick=()=>{ce(),Pt.paused?(X.els.help.classList.add("hidden"),X.els.pause.classList.remove("hidden")):X.showMenu()};function go(){X.toast("Buy this in the Play Store or App Store app")}X.els.iap.onclick=async()=>{ce(),await Gi.buyRemoveAds()?X.toast("Ads removed"):_r()?X.toast("Purchase failed"):go()};X.els.pauseBtn.onclick=()=>{ce(),Pt.togglePause()};X.els.resume.onclick=()=>{ce(),Pt.paused&&Pt.togglePause()};X.els.pauseHelp.onclick=()=>{ce(),X.els.pause.classList.add("hidden"),X.showHelp()};X.els.pauseRetry.onclick=()=>{ce(),Wc()};X.els.pauseMenu.onclick=()=>{ce(),Ct.noteFail(),Rn(),Pt.goMenu()};X.els.hintNext.onclick=()=>{ce(),gs()};X.els.hintSkip.onclick=()=>{ce(),Me=bs(Me,"skip"),Qi(),X.startTutorial("none")};X.els.hintHide.onclick=()=>{ce(),Me=bs(Me,"hide"),Qi(),X.startTutorial("none")};X.els.muteToggle.onchange=()=>{Ge.muted=X.els.muteToggle.checked,br.save(Ge),Pt.applyAudio(Ge)};X.els.musicVol?.addEventListener("input",()=>{Ge.music=Number(X.els.musicVol.value)/100,br.save(Ge),Pt.applyAudio(Ge)});X.els.sfxVol?.addEventListener("input",()=>{Ge.sfx=Number(X.els.sfxVol.value)/100,br.save(Ge),Pt.applyAudio(Ge)});X.els.hideToggle.onchange=()=>{Me=bs(Me,X.els.hideToggle.checked?"hide":"show"),Qi(),Me.hideInstructions&&X.startTutorial("none")};X.els.replayTutorial.onclick=()=>{ce(),or=!0,Me=bs(Me,"show"),Qi(),X.toast("Tutorial will play on next run"),Pt.state==="playing"&&Zn()};X.root.querySelectorAll("[data-pack]").forEach(i=>{i.onclick=async()=>{ce();const t=i.dataset.pack;let e=!1;t==="small"&&(e=await Gi.buyCoins(200,"coins_200")),t==="medium"&&(e=await Gi.buyCoins(1e3,"coins_1000")),t==="prism"&&(e=await Gi.buyPrism()),!e&&!_r()&&go(),X.setCoins(Ct.coins),X.renderSkins($n,Ct,mr)}});function mr(i){if(ce(),Ct.ownedSkins.includes(i.id))Ct.equip(i.id),De.event("skin_equipped",{skin:i.id});else if(i.iap){Gi.buyPrism().then(t=>{!t&&!_r()&&go(),X.setCoins(Ct.coins),X.renderSkins($n,Ct,mr)});return}else if(!Ct.buySkin(i.id,i.price)){X.toast("Need more coins");return}X.setCoins(Ct.coins),X.renderSkins($n,Ct,mr),Pt.skinId=Ct.equipped,De.event("skin_unlocked",{skin:i.id})}function _o(){Pt.rewardSettled||(Pt.rewardSettled=!0,Ct.addCoins(Pt.lastReward||0),Pt.lastWin&&Ct.recordLevelWin(Pt.levelIndex,Pt.lastWin),Ct.noteWin(Pt.lastWin?.stars||1),X.setCoins(Ct.coins),Rn())}let lr=!1;X.els.resultPrimary.onclick=async()=>{if(lr||X.els.resultPrimary.disabled)return;ce();const i=X.els.result.dataset.mode;X.els.resultPrimary.disabled=!0,lr=!0;try{if(i==="win"){const t=Pt.isLastLevel();if(_o(),Ct.onWin(Pt.levelIndex),X.hideResult(),t){Pt.goMenu(),X.toast("Campaign complete");return}await Hc.maybeInterstitial(X.tutorialMode!=="none"),Zn({countSession:!1})}else Ct.noteFail(),Rn(),X.hideResult(),De.event("replay",{level:Pt.levelIndex+1}),Zn({countSession:!1})}finally{lr=!1}};X.els.resultReplay.onclick=()=>{if(lr)return;ce(),X.els.result.dataset.mode==="win"?_o():(Ct.noteFail(),Rn()),X.hideResult(),De.event("replay",{level:Pt.levelIndex+1}),Zn({countSession:!1})};X.els.resultSecondary.onclick=async()=>{if(X.els.resultSecondary.disabled)return;ce();const i=X.els.result.dataset.mode;if(X.els.resultSecondary.disabled=!0,!await Hc.showRewarded(i==="win"?"2x coins":"crowd burst")){X.els.resultSecondary.disabled=!1;return}i==="win"?(Pt.doubleCoins(),De.event("rewarded_double_coins")):(Pt.continueWithBurst(),De.event("continue_used"),De.event("rewarded_continue"))};X.els.resultMenu.onclick=()=>{ce(),X.els.result.dataset.mode==="win"?(_o(),Ct.onWin(Pt.levelIndex)):(Ct.noteFail(),Rn()),Pt.goMenu()};mh.request().then(()=>De.event("boot"));window.Capacitor?.isNativePlatform?.()&&Zc(()=>import("./capacitorBridge-C2bhtxTK.js"),[],import.meta.url).then(async i=>{await i.installNativeBridge(),await Gi.restore(),X.setCoins(Ct.coins)});Ag().catch(()=>{});Pt.tick();new URLSearchParams(location.search).has("capture")&&Zn();window.Blobtide={game:Pt,economy:Ct,LEVELS:_s,play:Zn,tutorial:()=>Me};export{Ye as C};
