// Runs before first paint so the saved theme, highlighter colour and sidebar width never flash.
// A file rather than an inline script: the hosted version's content policy blocks inline scripts.
try{const t=localStorage.getItem("hsc-theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;const k=localStorage.getItem("stacky-hl");if(k&&k!=="yellow")document.documentElement.dataset.hl=k}catch(e){}
try{const s=JSON.parse(localStorage.getItem("stacky-side"))||{};if(s.w)document.documentElement.style.setProperty("--side-w",s.w+"px");if(s.collapsed)document.documentElement.dataset.side="collapsed"}catch(e){}
