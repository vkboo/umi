(()=>{"use strict";var e={733:e=>{const lazy=(e,t,s)=>e===undefined?t(s):e;e.exports=e=>t=>{let s;return function(){if(arguments.length===0){s=lazy(s,e,t);return s}const r={};[].forEach.call(arguments,(n=>{Object.defineProperty(r,n,{get:()=>{s=lazy(s,e,t);if(typeof s[n]==="function"){return function(){return s[n].apply(s,arguments)}}return s[n]}})}));return r}};e.exports.proxy=e=>t=>{let s;const r={get:(r,n)=>{s=lazy(s,e,t);return Reflect.get(s,n)},apply:(r,n,a)=>{s=lazy(s,e,t);return Reflect.apply(s,n,a)}};return new Proxy((()=>{}),r)}},811:(e,t,s)=>{const{spawn:r}=s(129);const n=s(622);const{format:a}=s(669);const o=s(733)(require);const i=o("configstore");const c=o("chalk");const p=o("semver");const l=o("semver-diff");const u=o("latest-version");const d=o("is-npm");const h=o("is-installed-globally");const g=o("is-yarn-global");const f=o("has-yarn");const k=o("boxen");const m=o("xdg-basedir");const y=o("is-ci");const _=o("pupa");const N=1e3*60*60*24;class UpdateNotifier{constructor(e={}){this.options=e;e.pkg=e.pkg||{};e.distTag=e.distTag||"latest";e.pkg={name:e.pkg.name||e.packageName,version:e.pkg.version||e.packageVersion};if(!e.pkg.name||!e.pkg.version){throw new Error("pkg.name and pkg.version required")}this.packageName=e.pkg.name;this.packageVersion=e.pkg.version;this.updateCheckInterval=typeof e.updateCheckInterval==="number"?e.updateCheckInterval:N;this.disabled="NO_UPDATE_NOTIFIER"in process.env||process.env.NODE_ENV==="test"||process.argv.includes("--no-update-notifier")||y();this.shouldNotifyInNpmScript=e.shouldNotifyInNpmScript;if(!this.disabled){try{const e=i();this.config=new e(`update-notifier-${this.packageName}`,{optOut:false,lastUpdateCheck:Date.now()})}catch{const t=c().yellow(a(" %s update check failed ",e.pkg.name))+a("\n Try running with %s or get access ",c().cyan("sudo"))+"\n to the local update config store via \n"+c().cyan(a(" sudo chown -R $USER:$(id -gn $USER) %s ",m().config));process.on("exit",(()=>{console.error(k()(t,{align:"center"}))}))}}}check(){if(!this.config||this.config.get("optOut")||this.disabled){return}this.update=this.config.get("update");if(this.update){this.update.current=this.packageVersion;this.config.delete("update")}if(Date.now()-this.config.get("lastUpdateCheck")<this.updateCheckInterval){return}r(process.execPath,[s.ab+"check1.js",JSON.stringify(this.options)],{detached:true,stdio:"ignore"}).unref()}async fetchInfo(){const{distTag:e}=this.options;const t=await u()(this.packageName,{version:e});return{latest:t,current:this.packageVersion,type:l()(this.packageVersion,t)||e,name:this.packageName}}notify(e){const t=!this.shouldNotifyInNpmScript&&d().isNpmOrYarn;if(!process.stdout.isTTY||t||!this.update||!p().gt(this.update.latest,this.update.current)){return this}e={isGlobal:h(),isYarnGlobal:g()(),...e};let s;if(e.isYarnGlobal){s=`yarn global add ${this.packageName}`}else if(e.isGlobal){s=`npm i -g ${this.packageName}`}else if(f()()){s=`yarn add ${this.packageName}`}else{s=`npm i ${this.packageName}`}const r="Update available "+c().dim("{currentVersion}")+c().reset(" → ")+c().green("{latestVersion}")+" \nRun "+c().cyan("{updateCommand}")+" to update";const n=e.message||r;e.boxenOptions=e.boxenOptions||{padding:1,margin:1,align:"center",borderColor:"yellow",borderStyle:"round"};const a=k()(_()(n,{packageName:this.packageName,currentVersion:this.update.current,latestVersion:this.update.latest,updateCommand:s}),e.boxenOptions);if(e.defer===false){console.error(a)}else{process.on("exit",(()=>{console.error(a)}));process.on("SIGINT",(()=>{console.error("");process.exit()}))}return this}}e.exports=e=>{const t=new UpdateNotifier(e);t.check();return t};e.exports.UpdateNotifier=UpdateNotifier},129:e=>{e.exports=require("child_process")},622:e=>{e.exports=require("path")},669:e=>{e.exports=require("util")}};var t={};function __nccwpck_require__(s){var r=t[s];if(r!==undefined){return r.exports}var n=t[s]={exports:{}};var a=true;try{e[s](n,n.exports,__nccwpck_require__);a=false}finally{if(a)delete t[s]}return n.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var s={};(()=>{let e=__nccwpck_require__(811);const t=JSON.parse(process.argv[2]);e=new e.UpdateNotifier(t);(async()=>{setTimeout(process.exit,1e3*30);const t=await e.fetchInfo();e.config.set("lastUpdateCheck",Date.now());if(t.type&&t.type!=="latest"){e.config.set("update",t)}process.exit()})().catch((e=>{console.error(e);process.exit(1)}))})();module.exports=s})();