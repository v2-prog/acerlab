/* AcerLab Navigator — client-side only. No personal financial data is uploaded. */
(function () {
var D = window.NAV_DATA || {};
var KEY = "acerlab-nav-v1";
var ADMIN_KEY = "acerlab-nav-admin";
var PASS_KEY = "acerlab-nav-pass";
var RES_KEY = "acerlab-nav-resources";
var NAV = [
{ id: "home", href: "index.html", n: "00", label: "Home", group: null },
{ id: "finance", href: "finance.html", n: "01", label: "Money literacy", group: "Learn" },
{ id: "budget", href: "budget.html", n: "02", label: "Budget studio", group: "Learn" },
{ id: "wages", href: "wages.html", n: "03", label: "Wage & tax structure", group: "Learn" },
{ id: "savings", href: "savings.html", n: "04", label: "Savings & investing", group: "Learn" },
{ id: "debt", href: "debt.html", n: "05", label: "Debt literacy", group: "Learn" },
{ id: "glossary", href: "glossary.html", n: "06", label: "Glossary", group: "Learn" },
{ id: "progress", href: "progress.html", n: "07", label: "Your progress", group: "Learn" },
{ id: "village", href: "village.html", n: "08", label: "Shared living", group: "Live" },
{ id: "structures", href: "structures.html", n: "09", label: "Legal structures", group: "Live" },
{ id: "zoning", href: "zoning.html", n: "10", label: "Zoning pathway", group: "Live" },
{ id: "building", href: "building.html", n: "11", label: "Building codes", group: "Live" },
{ id: "shared", href: "shared.html", n: "12", label: "Shared money", group: "Live" },
{ id: "resources", href: "resources.html", n: "13", label: "Directory", group: "Live" },
{ id: "templates", href: "templates.html", n: "14", label: "Checklists", group: "Live" },
{ id: "admin", href: "admin.html", n: "15", label: "Treasurer desk", group: "Group" }
];
function pageId() {
var b = document.body.getAttribute("data-page") || "";
if (b) return b;
var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
if (!file || file === "index.html") return "home";
return file.replace(".html", "");
}
function loadState() {
try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
}
function saveState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
function state() {
var s = loadState();
if (!s.jurisdiction) s.jurisdiction = "ACT";
if (!s.done) s.done = {};
if (!s.events) s.events = [];
if (!s.budget) s.budget = { income: 6500, housing: 1800, food: 900, transport: 350, utilities: 280, other: 400 };
if (!s.visited) s.visited = {};
return s;
}
function patch(fn) { var s = state(); fn(s); saveState(s); return s; }
function track(name) {
patch(function (s) {
s.visited[name] = (s.visited[name] || 0) + 1;
s.events.push({ t: Date.now(), n: name });
if (s.events.length > 400) s.events = s.events.slice(-400);
});
}
function num(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
function val(id) { var el = document.getElementById(id); return el ? el.value : ""; }
function money(n) {
if (!isFinite(n)) return "—";
return n.toLocaleString("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 });
}
function esc(s) {
return String(s == null ? "" : s).replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, """);
}
function taxOn(taxable) {
var remaining = Math.max(0, taxable), tax = 0, last = 0;
var brackets = D.taxBrackets || [];
for (var i = 0; i < brackets.length; i++) {
var b = brackets[i];
var span = Math.min(remaining, b.upTo - last);
if (span > 0) tax += span * b.rate;
remaining -= Math.max(0, span);
last = b.upTo;
if (remaining <= 0) break;
}
var medicare = Math.max(0, taxable) * (D.medicare || 0.02);
return { tax: tax, medicare: medicare, total: tax + medicare };
}
function navHtml(current) {
var html = "", last = null;
for (var i = 0; i < NAV.length; i++) {
var r = NAV[i];
if (r.group && r.group !== last) { html += '<div class="group">' + esc(r.group) + "</div>"; last = r.group; }
var on = r.id === current;
html += '<a class="' + (on ? "is-current" : "") + '" href="' + r.href + '"' + (on ? ' aria-current="page"' : "") + '><span class="n">' + r.n + "</span>" + esc(r.label) + "</a>";
}
return html;
}
function injectNav() {
var current = pageId();
var item = NAV.filter(function (x) { return x.id === current; })[0] || NAV[0];
document.querySelectorAll("[data-nav]").forEach(function (el) { el.innerHTML = navHtml(current); });
var n = document.querySelector("[data-crumb-n]");
var l = document.querySelector("[data-crumb-label]");
if (n) n.textContent = item.n;
if (l) l.textContent = item.label;
}
function fillJurisdictions() {
var sel = document.getElementById("jurisdiction");
if (!sel || !D.jurisdictions) return;
var cur = state().jurisdiction;
sel.innerHTML = D.jurisdictions.map(function (j) {
return '<option value="' + esc(j.id) + '"' + (j.id === cur ? " selected" : "") + ">" + esc(j.name) + "</option>";
}).join("");
}
function bindDrawer() {
var open = document.getElementById("open-nav");
var close = document.getElementById("close-nav");
var drawer = document.getElementById("drawer");
if (open && drawer) open.addEventListener("click", function () { drawer.classList.add("is-open"); });
if (close && drawer) close.addEventListener("click", function () { drawer.classList.remove("is-open"); });
}
function bindDone() {
document.querySelectorAll("[data-done]").forEach(function (btn) {
var id = btn.getAttribute("data-done");
if (state().done[id]) { btn.parentElement.innerHTML = '<p class="done">Marked as revisited on this device.</p>'; return; }
btn.addEventListener("click", function () {
patch(function (s) { s.done[id] = true; });
btn.parentElement.innerHTML = '<p class="done">Marked as revisited on this device.</p>';
refreshHomeKpis();
});
});
}
function refreshHomeKpis() {
var s = state();
var j = document.getElementById("kpi-juri");
var r = document.getElementById("kpi-reviewed");
if (j) j.textContent = s.jurisdiction;
if (r) r.textContent = Object.keys(s.done).length + " / " + ((D.modules && D.modules.length) || 11);
}
function bindBudget() {
if (pageId() !== "budget") return;
var s = state();
["income", "housing", "food", "transport", "utilities", "other"].forEach(function (id) {
var el = document.querySelector('[data-budget="' + id + '"]');
if (!el) return;
el.value = s.budget[id];
el.addEventListener("input", function () { patch(function (st) { st.budget[id] = num(el.value); }); paintBudget(); });
});
paintBudget();
}
function paintBudget() {
var b = state().budget;
var inc = num(b.income);
var totalExp = num(b.housing) + num(b.food) + num(b.transport) + num(b.utilities) + num(b.other);
var rest = inc - totalExp;
var max = Math.max(inc, totalExp, 1);
var set = function (id, text) { var el = document.getElementById(id); if (el) el.textContent = text; };
set("kpi-inc", money(inc)); set("kpi-exp", money(totalExp)); set("kpi-rest", money(rest));
set("kpi-rest-label", rest >= 0 ? "Unallocated" : "Shortfall");
var map = { income: inc, housing: b.housing, food: b.food, transport: b.transport, utilities: b.utilities, other: b.other };
Object.keys(map).forEach(function (k) {
var fill = document.querySelector('[data-bar="' + k + '"]');
var lab = document.querySelector('[data-bar-val="' + k + '"]');
if (fill) fill.style.width = Math.min(100, (num(map[k]) / max) * 100) + "%";
if (lab) lab.textContent = money(num(map[k]));
});
}
function bindWages() {
if (pageId() !== "wages") return;
["gross", "sacrifice", "sg"].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener("input", wageSketch); });
wageSketch();
}
function wageSketch() {
var el = document.getElementById("wage-out"); if (!el) return;
var gross = num(val("gross")); var sac = num(val("sacrifice")); var sgOn = val("sg") !== "0";
var sgRate = D.sgRate || 0.12; var cap = D.concessionalCap || 30000;
var sg = sgOn ? gross * sgRate : 0; var concessional = sg + sac; var overCap = Math.max(0, concessional - cap);
var base = taxOn(gross); var after = taxOn(Math.max(0, gross - sac));
var takeHomeBase = gross - base.total; var takeHomeAfter = (gross - sac) - after.total;
el.innerHTML = "<p><b>Sketch only</b> — marginal rates + Medicare levy. No offsets, HELP or MLS.</p><ul>" +
"<li>SG: <b>" + money(sg) + "</b></li><li>Sacrifice: <b>" + money(sac) + "</b></li>" +
"<li>Concessional total: <b>" + money(concessional) + "</b> " + (overCap ? "— over cap by " + money(overCap) : "— inside illustrated cap") + "</li>" +
"<li>Tax+Medicare on gross: <b>" + money(base.total) + "</b> → cash ≈ <b>" + money(takeHomeBase) + "</b></li>" +
"<li>After sacrifice: <b>" + money(after.total) + "</b> → cash ≈ <b>" + money(takeHomeAfter) + "</b></li></ul>" +
"<p class=\"muted\">Ask a licensed adviser before changing salary arrangements.</p>";
}
function bindSavings() {
if (pageId() !== "savings") return;
["c-start", "c-month", "c-rate", "c-years"].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener("input", compoundSketch); });
var box = document.getElementById("vehicles");
if (box && D.vehicles) {
box.innerHTML = D.vehicles.map(function (v) {
return '<div class="card"><h3>' + esc(v.name) + "</h3><p><span class=\"tag\">Risk " + esc(v.risk) + "</span><span class=\"tag\">" + esc(v.access) + "</span></p><p>" + esc(v.point) + "</p></div>";
}).join("");
}
compoundSketch();
}
function compoundSketch() {
var el = document.getElementById("compound-out"); if (!el) return;
var start = num(val("c-start")); var monthly = num(val("c-month")); var rate = num(val("c-rate")) / 100;
var years = Math.min(50, Math.max(1, num(val("c-years")) || 1));
var mRate = rate / 12; var months = years * 12; var bal = start;
for (var i = 0; i < months; i++) bal = bal * (1 + mRate) + monthly;
var contributed = start + monthly * months;
el.innerHTML = "<p>After <b>" + years + "</b> years at <b>" + esc(val("c-rate")) + "%</b>:</p><ul><li>Put in <b>" + money(contributed) + "</b></li><li>Illustrated balance <b>" + money(bal) + "</b></li><li>Illustrated growth <b>" + money(bal - contributed) + "</b></li></ul><p class=\"muted\">Fees, tax and pauses omitted.</p>";
}
function bindDebt() {
if (pageId() !== "debt") return;
["d-bal", "d-rate", "d-min", "d-extra"].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener("input", debtSketch); });
debtSketch();
}
function monthsToPay(balance, annualRate, payment) {
if (payment <= 0) return { months: Infinity, interest: 0, paid: true };
var r = annualRate / 12, bal = balance, m = 0, interest = 0, guard = 600;
while (bal > 0.5 && m < guard) {
var i = bal * r; interest += i; bal = bal + i - payment; m++;
if (payment <= i && m > 2) return { months: Infinity, interest: interest, paid: true };
}
return { months: m, interest: interest, paid: m >= guard };
}
function debtSketch() {
var el = document.getElementById("debt-out"); if (!el) return;
var a = monthsToPay(num(val("d-bal")), num(val("d-rate")) / 100, num(val("d-min")));
var b = monthsToPay(num(val("d-bal")), num(val("d-rate")) / 100, num(val("d-min")) + num(val("d-extra")));
function line(label, res) {
if (!isFinite(res.months) || res.paid) return "<li>" + label + ": payment does not cover interest.</li>";
return "<li>" + label + ": <b>" + Math.floor(res.months / 12) + "y " + (res.months % 12) + "m</b>, interest ≈ <b>" + money(res.interest) + "</b></li>";
}
var saved = (isFinite(a.months) && isFinite(b.months)) ? money(Math.max(0, a.interest - b.interest)) : "—";
el.innerHTML = "<p><b>Illustration only.</b></p><ul>" + line("Minimum only", a) + line("Minimum + extra", b) + "<li>Interest not paid if extra holds: <b>" + saved + "</b></li></ul>";
}
function bindGlossary() {
if (pageId() !== "glossary") return;
var box = document.getElementById("glossary-list"); var q = document.getElementById("gloss-q");
if (!box || !D.glossary) return;
function paint() {
var term = (q && q.value || "").toLowerCase();
box.innerHTML = D.glossary.filter(function (g) {
return !term || g.t.toLowerCase().indexOf(term) >= 0 || g.d.toLowerCase().indexOf(term) >= 0;
}).map(function (g) { return '<div class="term"><h3>' + esc(g.t) + "</h3><p>" + esc(g.d) + "</p></div>"; }).join("") || "<p class=\"muted\">No matches.</p>";
}
if (q) q.addEventListener("input", paint); paint();
}
function bindProgress() {
if (pageId() !== "progress") return;
var s = state(); var box = document.getElementById("progress-list");
if (box && D.modules) {
box.innerHTML = D.modules.map(function (m) {
var on = !!s.done[m.id]; var visits = s.visited[m.id] || 0;
return '<div class="card"><h3><span class="progress-dot' + (on ? " on" : "") + '"></span>' + esc(m.title) + "</h3><p>" + (on ? "Reviewed" : "Not marked") + " · opened " + visits + " time" + (visits === 1 ? "" : "s") + ".</p></div>";
}).join("");
}
var reset = document.getElementById("reset-progress");
if (reset) reset.addEventListener("click", function () { patch(function (st) { st.done = {}; }); bindProgress(); });
}
function bindStructures() {
if (pageId() !== "structures") return;
var box = document.getElementById("struct-grid");
if (!box || !D.structures) return;
box.innerHTML = D.structures.map(function (s) {
return '<article class="card"><h3>' + esc(s.name) + "</h3><p><span class=\"tag\">Independence " + esc(s.independence) + "</span></p><p><b>Exit:</b> " + esc(s.exit) + "</p><p><b>Decisions:</b> " + esc(s.decisions) + "</p><p><b>Liability:</b> " + esc(s.liability) + "</p><p><b>Fits when</b></p><ul>" + s.pros.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul><p><b>Watch</b></p><ul>" + s.cons.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></article>";
}).join("");
}
function bindZoning() {
if (pageId() !== "zoning") return;
document.querySelectorAll("#zoning-form input[type=radio]").forEach(function (r) { r.addEventListener("change", zoningSketch); });
zoningSketch();
}
function zoningSketch() {
var out = document.getElementById("zoning-out"); if (!out) return;
var s = state();
var setting = (document.querySelector("input[name=setting]:checked") || {}).value || "rural";
var extra = (document.querySelector("input[name=extra]:checked") || {}).value || "2";
var tenure = (document.querySelector("input[name=tenure]:checked") || {}).value || "share";
var hint = (D.zoningHints && D.zoningHints[s.jurisdiction]) || "Ask the local planner for zone, overlays, and the lawful extra-dwelling pathway name.";
var pathway = "secondary dwelling or dual occupancy conversation";
if (setting === "rural" && extra !== "1") pathway = "rural dual occupancy / rural land-sharing conversation (name varies)";
if (setting === "bush") pathway = "overlay-first conversation before dwelling count";
if (extra === "many") pathway = "multi-dwelling, community title, or rural land-sharing conversation";
if (tenure === "lock") pathway += ". Planning and the purpose entity are two files, not one.";
var email = "Hello,\n\nI am exploring a shared-living / additional-dwelling idea on a lot in " + s.jurisdiction + ". This is a scoping question, not a DA.\n\nCould you please tell me:\n1. Current zone and overlays (once I provide the lot details)?\n2. The correct use term for " + extra + " extra dwelling(s) in a " + setting + " setting?\n3. Whether a secondary dwelling, dual occupancy, multi-dwelling or rural land-sharing pathway exists, and if it is accepted, CDC/complying, or a full DA?\n4. Servicing expectations and any prohibition on moveable dwellings?\n\nThank you.\n";
out.innerHTML = "<p><b>Place:</b> " + esc(s.jurisdiction) + "</p><p>Likely conversation: <b>" + esc(pathway) + "</b>.</p><p>" + esc(hint) + "</p><p class=\"muted\">Not a determination.</p><h3>Draft email to planning</h3><textarea class=\"email-draft\" readonly rows=\"12\">" + esc(email) + "</textarea>";
}
function bindBuilding() {
if (pageId() !== "building") return;
var box = document.getElementById("building-topics");
if (box && D.buildingTopics) box.innerHTML = D.buildingTopics.map(function (t) { return '<div class="card"><h3>' + esc(t.q) + "</h3><p>" + esc(t.a) + "</p></div>"; }).join("");
}
function bindShared() {
if (pageId() !== "shared") return;
var box = document.getElementById("shared-cards");
if (box && D.sharedFinance) box.innerHTML = D.sharedFinance.map(function (t) { return '<div class="card"><h3>' + esc(t.t) + "</h3><p>" + esc(t.d) + "</p></div>"; }).join("");
["h-n", "h-op", "h-sink"].forEach(function (id) { var el = document.getElementById(id); if (el) el.addEventListener("input", levySketch); });
levySketch();
}
function levySketch() {
var el = document.getElementById("levy-out"); if (!el) return;
var n = Math.max(1, num(val("h-n")) || 4); var op = num(val("h-op")); var sink = num(val("h-sink"));
el.innerHTML = "<ul><li>Households: <b>" + n + "</b></li><li>Operating each: <b>" + money(op / n) + "</b></li><li>Sinking each: <b>" + money(sink / n) + "</b></li><li>Combined each: <b>" + money((op + sink) / n) + "</b></li></ul>";
}
function loadResources() { try { return JSON.parse(localStorage.getItem(RES_KEY)) || []; } catch (e) { return []; } }
function saveResources(list) { localStorage.setItem(RES_KEY, JSON.stringify(list)); }
function bindResources() {
if (pageId() !== "resources") return;
var s = state(); var all = (D.defaultResources || []).concat(loadResources());
var box = document.getElementById("resource-list"); if (!box) return;
var filtered = all.filter(function (r) { return r.region === "AU" || r.region === s.jurisdiction || !r.region; });
box.innerHTML = filtered.map(function (r) {
return '<div class="card"><h3><a href="' + esc(r.url) + '" rel="noopener" target="_blank">' + esc(r.name) + "</a></h3><p><span class=\"tag\">" + esc(r.region || "AU") + "</span> " + esc(r.note || "") + "</p></div>";
}).join("") || "<p class=\"muted\">No directory rows for this place yet.</p>";
}
function bindTemplates() {
if (pageId() !== "templates") return;
var box = document.getElementById("check-list"); var cases = document.getElementById("case-list"); var KEYC = "acerlab-nav-check";
if (box && D.checklist) {
var saved = {}; try { saved = JSON.parse(localStorage.getItem(KEYC) || "{}"); } catch (e) { saved = {}; }
box.innerHTML = D.checklist.map(function (c, i) {
return '<label class="check"><input type="checkbox" data-check="' + i + '"' + (saved[i] ? " checked" : "") + "><span>" + esc(c) + "</span></label>";
}).join("");
box.querySelectorAll("[data-check]").forEach(function (cb) {
cb.addEventListener("change", function () {
var next = {}; box.querySelectorAll("[data-check]").forEach(function (b) { next[b.getAttribute("data-check")] = b.checked; });
localStorage.setItem(KEYC, JSON.stringify(next));
});
});
}
if (cases && D.caseStudies) cases.innerHTML = D.caseStudies.map(function (c) { return '<div class="card"><h3>' + esc(c.t) + "</h3><p>" + esc(c.d) + "</p></div>"; }).join("");
var p = document.getElementById("print-check"); if (p) p.addEventListener("click", function () { window.print(); });
}
function bindAdmin() {
if (pageId() !== "admin") return;
var unlocked = sessionStorage.getItem(ADMIN_KEY) === "1";
var gate = document.getElementById("admin-gate"); var desk = document.getElementById("admin-desk");
if (gate) gate.hidden = unlocked; if (desk) desk.hidden = !unlocked;
var un = document.getElementById("admin-unlock");
if (un) un.addEventListener("click", function () {
if (val("admin-pass") === (localStorage.getItem(PASS_KEY) || "acerlab")) { sessionStorage.setItem(ADMIN_KEY, "1"); bindAdmin(); paintAdmin(); }
else alert("Pass-phrase does not match. Fresh-device default is acerlab.");
});
var setp = document.getElementById("set-pass");
if (setp) setp.addEventListener("click", function () { var p = val("new-pass"); if (p.length >= 6) { localStorage.setItem(PASS_KEY, p); alert("Pass-phrase saved on this device only."); } });
var lock = document.getElementById("admin-lock");
if (lock) lock.addEventListener("click", function () { sessionStorage.removeItem(ADMIN_KEY); bindAdmin(); });
var add = document.getElementById("r-add");
if (add) add.addEventListener("click", function () {
var item = { name: val("r-name"), url: val("r-url"), note: val("r-note"), region: val("r-region") || "AU" };
if (!item.name || !item.url) return;
var list = loadResources(); list.push(item); saveResources(list); paintAdmin();
});
paintAdmin();
}
function paintAdmin() {
var box = document.getElementById("admin-stats"); if (!box) return;
var s = state();
var rows = Object.keys(s.visited).sort().map(function (k) { return "<tr><td>" + esc(k) + "</td><td>" + s.visited[k] + "</td></tr>"; }).join("");
box.innerHTML = "<p class=\"muted\">Anonymised page-open counts on this browser only.</p><div class=\"scroll\"><table><thead><tr><th>Room</th><th>Opens</th></tr></thead><tbody>" + (rows || "<tr><td colspan=\"2\">No opens recorded yet.</td></tr>") + "</tbody></table></div>";
var extra = document.getElementById("admin-resources"); var list = loadResources();
if (extra) {
extra.innerHTML = list.length ? list.map(function (r, i) {
return '<div class="card"><h3>' + esc(r.name) + "</h3><p>" + esc(r.url) + " · " + esc(r.region) + '</p><button class="btn btn-ghost" type="button" data-del-r="' + i + '">Remove</button></div>';
}).join("") : "<p class=\"muted\">No local extras yet.</p>";
extra.querySelectorAll("[data-del-r]").forEach(function (b) {
b.addEventListener("click", function () { var next = loadResources(); next.splice(Number(b.getAttribute("data-del-r")), 1); saveResources(next); paintAdmin(); });
});
}
}
var jsel = document.getElementById("jurisdiction");
if (jsel) jsel.addEventListener("change", function (e) {
patch(function (s) { s.jurisdiction = e.target.value; });
refreshHomeKpis(); bindResources(); zoningSketch();
});
injectNav(); fillJurisdictions(); bindDrawer(); track(pageId()); refreshHomeKpis();
bindDone(); bindBudget(); bindWages(); bindSavings(); bindDebt(); bindGlossary();
bindProgress(); bindStructures(); bindZoning(); bindBuilding(); bindShared();
bindResources(); bindTemplates(); bindAdmin();
})();
