import{d as u,j as n}from"./app-CjS9sbyF.js";import{F as g}from"./file-text-DITpPqfI.js";import{P as y}from"./printer-C3PKYdJV.js";const k=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M12 18v-6",key:"17g6i2"}],["path",{d:"m9 15 3 3 3-3",key:"1npd3o"}]],j=u("file-down",k);const w=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],v=u("file-spreadsheet",w);function x(r){const t=document.getElementById(r);if(!t)return{headers:[],rows:[]};const l=[];t.querySelectorAll("thead tr th").forEach(d=>{const s=d.innerText.trim();s&&l.push(s)});const h=[];return t.querySelectorAll("tbody tr").forEach(d=>{const s=[];let p=!1;d.querySelectorAll("td").forEach(i=>{const o=i.innerText.trim().replace(/\n+/g," ");s.push(o),o&&(p=!0)}),p&&h.push(s)}),{headers:l,rows:h}}function b(r){if(r==null)return"";const t=String(r).replace(/"/g,'""');return/[",\n]/.test(t)?`"${t}"`:t}function F({tableId:r="export-table",filename:t="export",title:l=""}){const h=()=>{const{headers:o,rows:a}=x(r),e=[o.map(b).join(","),...a.map(c=>c.map(b).join(","))].join(`
`);p(e,`${t}.csv`,"text/csv;charset=utf-8;")},d=()=>{const{headers:o,rows:a}=x(r);let e=`<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel'>
<head><meta charset="UTF-8"></head><body><table>`;e+=`<tr>${o.map(c=>`<th>${c}</th>`).join("")}</tr>`,a.forEach(c=>{e+=`<tr>${c.map(f=>`<td>${f}</td>`).join("")}</tr>`}),e+="</table></body></html>",p(e,`${t}.xls`,"application/vnd.ms-excel")},s=(o="print")=>{const a=document.getElementById(r);if(!a)return;const e=window.open("","_blank","width=900,height=700");e.document.write(`<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <title>${l||t}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a2e; padding: 24px; }
    h2 { font-size: 18px; font-weight: 700; margin-bottom: 4px; color: #1e3a5f; }
    p.subtitle { font-size: 11px; color: #6b7280; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1e3a5f; color: #fff; }
    thead th { padding: 8px 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
    tbody tr:nth-child(even) { background: #f5f7ff; }
    tbody td { padding: 7px 10px; border-bottom: 1px solid #e5e7eb; }
    tfoot td { padding: 7px 10px; font-weight: 600; background: #eef2ff; }
    @media print { body { padding: 0; } }
  </style>
</head><body>
  <h2>${l||t}</h2>
  <p class="subtitle">Exported ${new Date().toLocaleDateString("sv").slice(2)}</p>
  ${a.outerHTML}
</body></html>`),e.document.close(),e.focus(),setTimeout(()=>{e.print()},300)};function p(o,a,e){const c=new Blob(["\uFEFF"+o],{type:e}),f=URL.createObjectURL(c),m=document.createElement("a");m.href=f,m.download=a,m.click(),URL.revokeObjectURL(f)}const i="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all";return n.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap",children:[n.jsxs("button",{onClick:h,className:`${i} bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100`,children:[n.jsx(j,{size:13})," CSV"]}),n.jsxs("button",{onClick:d,className:`${i} bg-green-50 text-green-700 border-green-200 hover:bg-green-100`,children:[n.jsx(v,{size:13})," Excel"]}),n.jsxs("button",{onClick:()=>s("pdf"),className:`${i} bg-red-50 text-red-700 border-red-200 hover:bg-red-100`,children:[n.jsx(g,{size:13})," PDF"]}),n.jsxs("button",{onClick:()=>s("print"),className:`${i} bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100`,children:[n.jsx(y,{size:13})," Print"]})]})}export{F as E};
