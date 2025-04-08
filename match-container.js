/* MIT License

Copyright (c) 2025 Martin Winkler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */
(()=>{const e="bae45330cd3d4e0e96b60d26b57009b5",t=Symbol.for(e);window[t]=window[t]??(()=>{let t=0;return{createID:()=>`${e}-${Date.now()}-${t++}`}})();const r=window[t].createID;class n extends Event{container;matches;constructor(e){super(e)}}class a extends EventTarget{container;matches;constructor(e,t){super(),this.container=t;const n="container-query-observer-"+r(),a=`data-${n}`;e.setAttribute(a,"");const o=`--${n}`,i=new CSSStyleSheet,s=`@property ${o} {\n          syntax: '<custom-ident>';\n          inherits: false;\n          initial-value: --false;\n        }\n        @container ${t} { [${a}] { ${o}: --true; } }`;i.replaceSync(s),document.adoptedStyleSheets=[...document.adoptedStyleSheets,i];const c=getComputedStyle(e);this.matches=c.getPropertyValue(o)==="--true",this.#e(o,t,e)}#e(e,t,r){const a=n=>{if(e in n){const r=n[e]==="--true";this.matches=r;const a=new n("change");a.matches=r,a.container=t,this.dispatchEvent(a)}};const o={},i=getComputedStyle(r).getPropertyValue(e);o[e]=i,r.style.setProperty("transition",`${e} 0.001ms step-start`),r.style.setProperty("transition-behavior","allow-discrete"),r.addEventListener("transitionrun",n=>{if(r===n.target){const t=getComputedStyle(n.target),i=t.getPropertyValue(e),s=o[e];i!==s&&(o[e]=i,a({[e]:i}))}})}}Element.prototype.matchContainer||(Element.prototype.matchContainer=function(e){return new a(this,e)})})();
