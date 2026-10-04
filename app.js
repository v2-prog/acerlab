(function () {
  var KEY = "acerlab.household.v3";
  var BANNED = ["stupid", "lazy", "failure", "irresponsible", "shame"];
  var NAV = [
    ["index.html", "Dashboard"],
    ["onboarding.html", "Onboarding"],
    ["plan.html", "My plan"],
    ["plan-buckets.html", "Buckets"],
    ["plan-debt.html", "Debt"],
    ["plan-emergency-fund.html", "Emergency fund"],
    ["plan-legacy.html", "Legacy"],
    ["family-meetings.html", "Money meeting"],
    ["family.html", "Family"],
    ["tools-bucket.html", "Tools"],
    ["learn.html", "Learn"],
    ["support.html", "Support"],
    ["settings.html", "Settings"]
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function write(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function money(n) {
    var x = Number(n);
    if (!Number.isFinite(x)) return "—";
    return "$" + x.toLocaleString("en-AU", { maximumFractionDigits: 0 });
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&", "<": "<", ">": ">", '"': """ }[c];
    });
  }
  function classify(d) {
    if (d.abuse || d.crisis === "yes" || d.priority === "stress") return "crisis";
    if (d.arrears === "yes") return "stabilising";
    var essentials = Number(d.essentials) || 0;
    var income = Number(d.income) || 0;
    if (income && essentials > income) return "crisis";
    if (d.highInterest === "yes") return "debt_reduction";
    var months = Number(d.bufferMonths) || 0;
    if (months < 1) return "stabilising";
    if (months < 3) return "secure";
    if (d.priority === "retire") return "transitioning_to_retirement";
    if (d.priority === "legacy" || d.priority === "kids") return "legacy";
    return "growing";
  }
  function nextAction(d) {
    var state = d.stateOverride || classify(d);
    if (state === "crisis") {
      return {
        title: "Protect the basics",
        steps: ["Keep housing, food, utilities, medication and safety first.", "Pause investing screens.", "Use the support page for free financial counselling.", "Contact a lender early if a repayment is at risk."],
        why: "Essentials or safety come before optimisation."
      };
    }
    if (state === "stabilising" || state === "debt_reduction") {
      return {
        title: "Your next best action",
        steps: ["Keep rent, utilities, food and minimum debt payments current.", "Separate protection money, even as a virtual bucket.", "Choose a starter buffer amount yourself.", "Pause non-essential subscriptions.", "Direct remaining surplus to the debt method you selected.", "Contact the lender early if repayments are becoming difficult."],
        why: "Debt-cost risk and a thin buffer can turn the next bill into new high-interest debt."
      };
    }
    if (state === "transitioning_to_retirement" || state === "legacy") {
      return { title: "Legacy and income range", steps: ["Open the legacy checklist.", "Check super nominations against the fund rules.", "Look at retirement as a range, not a single number."], why: "Transfer of control and values is the current planning aid." };
    }
    return { title: "Keep the system running", steps: ["Hold the monthly money meeting.", "Move protection toward the month target you chose.", "Review fees before any investment reading."], why: "The household looks past the first buffer. This is still education, not a product suggestion." };
  }
  function investingBlocked(d) {
    var state = d.stateOverride || classify(d);
    return state === "crisis" || state === "stabilising" || (Number(d.essentials) > Number(d.income) && Number(d.income) > 0) || d.arrears === "yes";
  }

  function shell() {
    var page = document.body.getAttribute("data-page") || "dashboard";
    var file = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll("[data-nav]").forEach(function (el) {
      el.innerHTML = NAV.map(function (item) {
        var on = item[0] === file;
        return '<a class="' + (on ? "is-current" : "") + '" href="' + item[0] + '">' + item[1] + "</a>";
      }).join("");
    });
    var d = read();
    if (d.discreet) document.body.classList.add("discreet");
    var exit = document.querySelector("[data-exit]");
    if (exit) {
      exit.hidden = !d.discreet;
      exit.addEventListener("click", function () { location.href = "https://www.bom.gov.au/"; });
    }
    document.querySelectorAll("[data-open-nav]").forEach(function (btn) {
      btn.addEventListener("click", function () { document.getElementById("drawer").classList.add("is-open"); });
    });
    document.querySelectorAll("[data-close-nav]").forEach(function (el) {
      el.addEventListener("click", function () { document.getElementById("drawer").classList.remove("is-open"); });
    });
    var main = document.getElementById("main");
    var html = (render[page] || render.dashboard)(d);
    BANNED.forEach(function (w) { if (html.toLowerCase().indexOf(w) !== -1) html = html.replace(new RegExp(w, "ig"), "—"); });
    main.innerHTML = html;
    bind(main, d);
  }

  function draftNote() {
    return '<p class="note"><span class="tag warn">Draft</span><span>' + esc(AcerContent.disclaimer) + " Review status: " + AcerContent.reviewStatus + ". Last reviewed " + AcerContent.lastReviewed + ".</span></p>";
  }

  var render = {
    dashboard: function (d) {
      var action = nextAction(d);
      var state = d.stateOverride || classify(d);
      var steps = action.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("");
      return "<h1>Dashboard</h1><p class=\"lede\">One next action. Progress is behaviour, not a score.</p>" + draftNote() +
        '<section class="card"><h2>' + esc(action.title) + '</h2><ol>' + steps + "</ol><p>" + esc(action.why) + "</p><p class=\"muted\">Planning aid: " + esc(state.replaceAll("_", " ")) + ". You can override it in settings. This is general education, not personal financial advice.</p></section>" +
        '<div class="grid two" style="margin-top:0.8rem"><a class="card" href="plan-buckets.html"><h2>Buckets</h2><p>Editable ranges.</p></a><a class="card" href="family-meetings.html"><h2>Monthly check-in</h2><p>Agenda and calendar file.</p></a><a class="card" href="plan-legacy.html"><h2>Legacy</h2><p>Estate and non-estate flags.</p></a><a class="card" href="support.html"><h2>Support</h2><p>Official directories.</p></a></div>' +
        "<h2>Philosophy, as rules</h2><div class=\"grid two\">" + AcerContent.philosophy.map(function (p) {
          return "<article class=\"card\"><h3>" + esc(p[0]) + "</h3><p>" + esc(p[1]) + "</p></article>";
        }).join("") + "</div>";
    },
    onboarding: function () {
      return "<h1>Onboarding</h1><p class=\"lede\">Every question can be skipped. Broad ranges are enough.</p>" + draftNote() +
        '<form id="onboard"><label class="field"><span>Who is this for?</span><select name="who"><option value="">Skip</option><option>Individual</option><option>Couple</option><option>Family</option><option>Young adult</option><option>Self-employed</option><option>Retiree</option></select></label>' +
        '<label class="field"><span>State or territory</span><select name="region"><option value="">Skip</option><option>NSW</option><option>VIC</option><option>QLD</option><option>WA</option><option>SA</option><option>TAS</option><option>ACT</option><option>NT</option></select></label>' +
        '<label class="field"><span>Income pattern</span><select name="incomePattern"><option value="">Skip</option><option value="regular">Regular</option><option value="variable">Variable</option><option value="mixed">Mixed</option></select></label>' +
        '<label class="field"><span>Take-home per month (optional)</span><input name="income" type="number" min="0" inputmode="decimal"></label>' +
        '<label class="field"><span>Essential costs per month (optional)</span><input name="essentials" type="number" min="0" inputmode="decimal"></label>' +
        '<label class="field"><span>High-interest debt?</span><select name="highInterest"><option value="">Skip</option><option value="yes">Yes</option><option value="no">No</option></select></label>' +
        '<label class="field"><span>Arrears?</span><select name="arrears"><option value="">Skip</option><option value="yes">Yes</option><option value="no">No</option></select></label>' +
        '<label class="field"><span>First priority</span><select name="priority"><option value="">Skip</option><option value="stress">Stop financial stress</option><option value="debt">Clear debt</option><option value="buffer">Emergency fund</option><option value="goal">Save for a goal</option><option value="home">Think about a home</option><option value="invest">Learn about investing</option><option value="retire">Prepare for retirement</option><option value="kids">Teach children</option><option value="legacy">Legacy</option></select></label>' +
        '<label class="field"><span>Is it safe for others in the household to see this app?</span><select name="safe"><option value="">Skip</option><option value="yes">Yes</option><option value="no">No — use discreet mode</option></select></label>' +
        '<div class="actions"><button class="btn" type="submit">Save on this device</button></div></form><p id="on-out" class="muted"></p>';
    },
    plan: function () {
      return "<h1>My plan</h1><p class=\"lede\">Nine stages. Do not jump to investing while essentials are uncovered.</p>" + draftNote() +
        AcerContent.stages.map(function (s) {
          return '<a class="card" href="' + s[2] + '"><span class="tag">' + s[0] + "</span><h2>" + esc(s[1]) + "</h2><p>" + esc(s[3]) + "</p></a>";
        }).join("");
    },
    foundations: function () {
      return "<h1>Foundations</h1>" + draftNote() +
        "<p>Recommended shape, no bank named: a spending account, a protection account, and a tax-reserve account if income is variable. If you cannot open extra accounts, use virtual buckets on one account and a ledger.</p>" +
        "<ul><li>Direct debit checklist for essentials only.</li><li>Payday transfer schedule.</li><li>Bill calendar with due dates.</li><li>Protection money not sitting in the spending balance.</li></ul>" +
        '<p class="muted">What this does not mean: you must bank with anyone, or open eight products.</p>';
    },
    buckets: function (d) {
      var rows = AcerContent.buckets.map(function (b) {
        var val = (d.bucketOverrides && d.bucketOverrides[b[0]]) || "";
        return "<tr><td>" + esc(b[1]) + "</td><td>" + esc(b[2]) + "</td><td>" + esc(b[3]) + "</td><td><input data-bucket=\"" + b[0] + "\" type=\"number\" min=\"0\" value=\"" + esc(val) + "\" aria-label=\"" + esc(b[1]) + " amount\"></td></tr>";
      }).join("");
      return "<h1>Spending buckets</h1>" + draftNote() +
        '<p class="warn"><span class="tag warn">Ranges</span><span>These are planning ranges, not universal rules or financial advice. Every amount is overridable.</span></p>' +
        '<div class="scroll"><table><thead><tr><th>Bucket</th><th>Purpose</th><th>Starting range</th><th>Your amount</th></tr></thead><tbody>' + rows + "</tbody></table></div>" +
        '<div class="actions"><button class="btn" type="button" id="save-buckets">Save overrides</button></div><p id="bucket-warn"></p>';
    },
    debt: function () {
      return "<h1>Debt elimination</h1>" + draftNote() +
        "<p>Snowball pays the smallest balance first. Avalanche pays the highest interest first. You choose. The calculator shows both.</p>" +
        "<ul><li>Never miss a minimum in the plan.</li><li>Rent, utilities, food, medication and insurance come before extra repayments.</li><li>Arrears open the hardship path before an aggressive plan.</li><li>Unmanageable debt goes to free financial counselling.</li><li>Do not close cards until emergency access and payment arrangements are safe. Not at all if financial abuse is flagged.</li></ul>" +
        '<div class="actions"><a class="btn" href="tools-debt.html">Open calculator</a><a class="btn btn-ghost" href="support.html">Hardship contacts</a></div>';
    },
    emergency: function () {
      return "<h1>Emergency fund</h1>" + draftNote() +
        "<p>Target equals essential monthly costs times months you select: 1 (early buffer), 3 (baseline), 6 (stronger), or more if income varies, health is uncertain, you are self-employed, or people depend on you.</p>" +
        '<div class="actions"><a class="btn" href="tools-emergency.html">Calculator</a></div>';
    },
    home: function () {
      return "<h1>Home and mortgage</h1>" + draftNote() +
        "<p>Ownership is optional, not a moral milestone. Compare deposit, duty you look up, repayments, rate sensitivity, maintenance, insurance, time horizon and the deposit's other uses. A published plan may treat buying as a major step. The right call depends on the household.</p>" +
        "<p>Before any refinancing reading: fees, break costs and the risk that income falls. This page does not recommend refinancing or borrowing.</p>" +
        '<div class="actions"><a class="btn" href="tools-mortgage.html">Extra-payment calculator</a></div>';
    },
    super: function () {
      return "<h1>Superannuation</h1>" + draftNote() +
        "<p>Education, not personalised regulated advice. Find lost accounts via the ATO. Compare fees without naming a fund here. Check investment options, employer contributions and beneficiary nominations.</p>" +
        '<p class="note"><span class="tag">Idea</span><span>A 15 per cent contribution target is an idea from public personal-finance discussion, not a default for everyone. Caps and rates come from the ATO, not this app.</span></p>' +
        '<p><a href="https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super">ATO super</a></p>' +
        '<div class="actions"><a class="btn" href="tools-super.html">Estimator</a></div>';
    },
    investing: function (d) {
      if (investingBlocked(d)) {
        return "<h1>Investing</h1>" + draftNote() + '<p class="bad"><span class="tag bad">Held</span><span>Investing content stays hidden while essentials exceed income, arrears are flagged, or the planning aid is crisis or stabilising. Open support instead.</span></p><a class="btn" href="support.html">Support</a>';
      }
      return "<h1>Investing</h1>" + draftNote() +
        "<p>Simple, diversified, low-cost is a learning frame. Fees and time horizon matter. Values fall. This is not a product suggestion.</p>" +
        "<p class=\"muted\">What this does not mean: a fund is suitable for you.</p>";
    },
    retirement: function () {
      return "<h1>Retirement</h1>" + draftNote() +
        "<p>Three lifestyles: basic, comfortable, preferred. The planner returns a range under assumptions you can see. It is never a single number. Tax, housing, aged care and government support are uncertain — check Services Australia and the ATO.</p>" +
        '<div class="actions"><a class="btn" href="tools-retirement.html">Open planner</a></div>';
    },
    legacy: function (d) {
      var items = [
        "Will reviewed after a major life event",
        "Enduring power of attorney in place — check the state name and witness rules",
        "Guardianship-type or health directive — names differ by state",
        "Super nomination checked, including lapse rules and the deed",
        "Trust deed read for appointor or guardian succession",
        "Company constitution and shareholder or partnership agreement checked",
        "Buy-sell discussed with an adviser, if you own a business",
        "Prior-relationship children or separation risk discussed with a family lawyer",
        "Executor named, told, and papers easy to find",
        "Accountant asked about CGT and duty before any transfer",
        "Adviser registers checked: TPB, ASIC Financial Advisers Register, state law society"
      ];
      var checks = items.map(function (item, i) {
        var on = d.legacy && d.legacy[i] ? " checked" : "";
        return '<label class="check"><input type="checkbox" data-legacy="' + i + '"' + on + ">" + esc(item) + "</label>";
      }).join("");
      return "<h1>Legacy and succession</h1><p class=\"lede\">Roles, flags and questions. No firm is named. No advice.</p>" + draftNote() +
        "<h2>Estate and non-estate</h2><div class=\"scroll\"><table><thead><tr><th>Generally under a will</th><th>May pass outside the will — check the documents</th></tr></thead><tbody><tr><td>Assets in the person's sole name, subject to the will.</td><td>Super and SMSF death benefits. Joint property by survivorship. Family-trust assets (deed and appointor). Company shares (constitution and shareholder agreement). Life insurance with a beneficiary. Business interests under a partnership or buy-sell.</td></tr></tbody></table></div>" +
        '<p class="bad"><span class="tag bad">Red flag</span><span>Assuming the will controls everything.</span></p>' +
        "<h2>Roles</h2>" +
        '<details class="card"><summary>Wills and estate-planning lawyers <span class="tag ok">documents</span></summary><div class="inner">Wills, testamentary discretionary trusts, enduring powers of attorney, guardianship-type documents and advance care directives. A testamentary trust can be relevant to a beneficiary\'s later divorce, bankruptcy or creditors. That is not a guarantee.</div></details>' +
        '<details class="card"><summary>Probate lawyers <span class="tag warn">after death</span></summary><div class="inner">Grant of probate or letters of administration in the state or territory Supreme Court.</div></details>' +
        '<details class="card"><summary>Family lawyers</summary><div class="inner">Separation can change a will. Binding financial agreements may reduce later disputes but do not by themselves remove family provision claims.</div></details>' +
        '<details class="card"><summary>Family provision</summary><div class="inner">Eligible people may apply if provision was inadequate. Time limits and notional estate differ by state.</div></details>' +
        '<details class="card"><summary>Licensed advisers and tax agents</summary><div class="inner">Super sits outside the will. Check a binding nomination and the deed. Product advice needs a licence — <a href="https://moneysmart.gov.au/financial-advice/financial-advisers-register">Financial Advisers Register</a>. CGT and duty: <a href="https://www.ato.gov.au/">ATO</a> and the <a href="https://www.tpb.gov.au/">TPB register</a>.</div></details>' +
        "<h2>Order of engagement</h2><ol><li>Accountant and adviser map estate and non-estate assets.</li><li>Estate lawyer drafts the will, trusts and enduring documents.</li><li>Align nominations, deeds and business agreements with the will.</li><li>Family lawyer if prior children or separation risk.</li><li>After a death: probate lawyer, executor, final returns.</li><li>Review after marriage, separation, birth, death, sale or a law change.</li></ol>" +
        "<h2>Checklist</h2>" + checks +
        '<p class="muted">Structure flags for land and trusts: <a href="https://acerlab.link/succession-321.html">Succession 321 on Structure Lab</a>.</p>' +
        "<h2>Further reading</h2><p class=\"muted\">VERIFY BEFORE PUBLISH — confirm titles, editions and affiliations against publisher or library records. Names and topics only. No practising solicitor or firm is listed.</p><ul><li>Dr John de Groot AM — Australian succession law, family provision, wills and probate practice.</li><li>Professor Rosalind Croucher AM — property, equity and succession.</li><li>Professor Richard Nolan — trust law and trustees' duties.</li><li>Professor G. E. (Gino) Dal Pont — succession, equity and trusts.</li></ul>";
    },
    family: function () {
      return "<h1>Family</h1>" + draftNote() +
        '<div class="grid two"><a class="card" href="family-lessons.html"><h2>Lessons</h2><p>Age bands.</p></a><a class="card" href="family-chores.html"><h2>Chores</h2><p>Contribution, not a wage for essentials.</p></a><a class="card" href="family-goals.html"><h2>Goals</h2><p>Voluntary.</p></a><a class="card" href="family-meetings.html"><h2>Meeting</h2><p>Pause button included.</p></a></div>' +
        "<h2>Activity ideas</h2><ul><li>Plan a meal under a fixed amount.</li><li>Compare two phone plans.</li><li>Save toward a shared outing.</li><li>Audit subscriptions.</li><li>Interview a grandparent about money lessons.</li><li>Build a household emergency checklist.</li></ul>";
    },
    lessons: function () {
      return "<h1>Kids' money lessons</h1>" + draftNote() +
        "<h2>3–7</h2><p>Three jars: spend, save, give. Wants and needs. Counting.</p><h2>8–12</h2><p>A weekly plan. Comparing prices. Advertising. A basic account, with a parent.</p><h2>13–17</h2><p>Payslips, tax, super, buy-now-pay-later, scams, phone and transport costs.</p><h2>18–25</h2><p>Bond and rent rules differ by state. Student debt, first super, contracts, lifestyle inflation.</p><p class=\"muted\">Children see only their band. A parent approves any linked action. This app does not link accounts.</p>";
    },
    chores: function () {
      return "<h1>Chores</h1>" + draftNote() +
        "<p>Essential household responsibilities are contributions. They are never conditional on payment. Optional jobs can be paid. Parents mark the difference.</p>";
    },
    goals: function () {
      return "<h1>Family goals</h1>" + draftNote() + "<p>Participation is voluntary. A goal is a date and an amount the household chose, not a target this app sets.</p>";
    },
    meetings: function () {
      return "<h1>Money meeting</h1>" + draftNote() +
        "<ol><li>Income review</li><li>Upcoming bills</li><li>Bucket transfers</li><li>Debt progress</li><li>One family goal</li><li>One decision to defer</li><li>One thing that went well</li><li>A no-blame prompt</li></ol>" +
        '<div class="actions"><button class="btn" type="button" id="pause">Pause conversation</button><button class="btn btn-ghost" type="button" id="ics">Download calendar file</button></div><p id="pause-out" class="muted"></p>' +
        '<label class="field"><span>Private note</span><textarea id="meet-note" placeholder="Stays on this device unless you share it yourself."></textarea></label>';
    },
    "tool-bucket": function () {
      return toolForm("Bucket calculator", "bucket", [["income", "Net income this pay"], ["essentials", "Essential costs"], ["debtMin", "Debt minimums"]]);
    },
    "tool-debt": function () {
      return "<h1>Debt calculator</h1>" + draftNote() + "<p>Two sample debts, editable. Minimums are assumed current.</p>" +
        '<form id="debt-form"><label class="field"><span>Debt A balance</span><input name="aBal" type="number" value="2000"></label><label class="field"><span>Debt A rate %</span><input name="aRate" type="number" value="20"></label><label class="field"><span>Debt A minimum</span><input name="aMin" type="number" value="80"></label><label class="field"><span>Debt B balance</span><input name="bBal" type="number" value="8000"></label><label class="field"><span>Debt B rate %</span><input name="bRate" type="number" value="8"></label><label class="field"><span>Debt B minimum</span><input name="bMin" type="number" value="150"></label><label class="field"><span>Extra per month</span><input name="extra" type="number" value="100"></label><button class="btn" type="submit">Compare</button></form><div id="tool-out"></div>';
    },
    "tool-emergency": function () {
      return toolForm("Emergency fund", "emergency", [["essentials", "Essential costs per month"], ["months", "Target months"], ["saved", "Already saved"], ["perPay", "Amount per pay"]]);
    },
    "tool-mortgage": function () {
      return toolForm("Mortgage calculator", "mortgage", [["principal", "Principal"], ["rate", "Rate %"], ["years", "Years"], ["extra", "Extra per month"], ["offset", "Offset balance"]]);
    },
    "tool-retirement": function () {
      return toolForm("Retirement planner", "retirement", [["age", "Age"], ["retireAge", "Retirement age"], ["spend", "Annual spending"], ["pot", "Current super and investments"], ["contrib", "Annual contributions"], ["inflation", "Inflation %"]]);
    },
    "tool-super": function () {
      return toolForm("Super estimator", "super", [["income", "Income"], ["rate", "Employer rate %"], ["extra", "Extra contribution"], ["cap", "Concessional cap you looked up"]]);
    },
    "tool-net": function (d) {
      if (!d.income) return "<h1>Net worth</h1><p class=\"warn\">Hidden until basic setup has an income figure. It is not the first screen.</p>";
      return "<h1>Net worth</h1>" + draftNote() + "<p>Assets minus liabilities you enter. Not shown as a success score.</p>";
    },
    "tool-subs": function () {
      return "<h1>Subscription audit</h1>" + draftNote() + '<form id="sub-form"><label class="field"><span>Name</span><input name="name" type="text"></label><label class="field"><span>Monthly amount</span><input name="amount" type="number" min="0"></label><button class="btn" type="submit">Add</button></form><div id="sub-list"></div>';
    },
    learn: function () {
      return "<h1>Learn</h1>" + draftNote() + AcerContent.lessons.map(function (l) {
        return "<article class=\"card\"><span class=\"tag\">" + esc(l.cat) + "</span><h2>" + esc(l.title) + "</h2><p><b>Objective.</b> " + esc(l.objective) + "</p><p>" + esc(l.body) + "</p><p><b>Activity.</b> " + esc(l.activity) + "</p><p class=\"muted\">What this does not mean: " + esc(l.not) + "</p></article>";
      }).join("") + "<h2>Authors to look for</h2><p class=\"muted\">VERIFY BEFORE PUBLISH. Topics only.</p><ul><li>Dr John de Groot AM</li><li>Professor Rosalind Croucher AM</li><li>Professor Richard Nolan</li><li>Professor G. E. (Gino) Dal Pont</li></ul>";
    },
    support: function () {
      return "<h1>Safety and support</h1>" + draftNote() +
        "<p class=\"muted\">VERIFY BEFORE PUBLISH. Links are official home or guidance pages. Confirm any phone number on the site itself.</p>" +
        AcerContent.support.map(function (s) {
          return '<a class="card" href="' + s[1] + '"><h2>' + esc(s[0]) + "</h2><p>" + esc(s[2]) + "</p></a>";
        }).join("") +
        "<h2>Also</h2><ul><li><a href=\"https://www.acnc.gov.au/\">ACNC</a></li><li><a href=\"https://www.revenue.nsw.gov.au/\">Revenue NSW</a> — other states have their own revenue office</li><li><a href=\"https://supremecourt.nsw.gov.au/\">Supreme Court of NSW</a> — probate pages differ by state</li></ul>";
    },
    settings: function (d) {
      return "<h1>Settings</h1>" + draftNote() +
        '<label class="check"><input type="checkbox" id="discreet"' + (d.discreet ? " checked" : "") + "> Discreet mode — blur amounts, show Leave, no amounts in the title</label>" +
        '<label class="field"><span>Override planning aid</span><select id="state"><option value="">Automatic</option><option>crisis</option><option>stabilising</option><option>debt_reduction</option><option>secure</option><option>growing</option><option>transitioning_to_retirement</option><option>legacy</option></select></label>' +
        '<div class="actions"><button class="btn btn-ghost" type="button" id="wipe">Delete data on this device</button></div>';
    },
    privacy: function () {
      return "<h1>Privacy</h1><p>Household figures stay in this browser under a local storage key. Nothing is sent to AcerLab. Delete them in settings. Do not use discreet mode as your only safety plan.</p>";
    },
    disclaimer: function () {
      return "<h1>Disclaimer</h1><p>AcerLab is general education for Australian households. It is not personal financial advice, tax advice or legal advice. Calculators are educational estimates. Super, duty, contribution caps and succession rules change, and they differ by state. Check the ATO, ASIC MoneySmart, Services Australia, and a solicitor or registered tax agent before you act.</p>";
    },
    about: function () {
      return "<h1>About</h1><p>AcerLab household notebook. Static files for Cloudflare Pages from <a href=\"https://github.com/v2-prog/acerlab\">v2-prog/acerlab</a>. Land and trust structures stay on <a href=\"https://acerlab.link/\">Structure Lab</a>.</p><p>Origin: <a href=\"https://acerlab.pages.dev/\">acerlab.pages.dev</a>.</p>";
    },
    glossary: function () {
      return "<h1>Glossary</h1>" + draftNote() + AcerContent.glossary.map(function (g) {
        return "<h2>" + esc(g[0]) + "</h2><p>" + esc(g[1]) + "</p>";
      }).join("");
    }
  };

  function toolForm(title, kind, fields) {
    var inputs = fields.map(function (f) {
      return '<label class="field"><span>' + esc(f[1]) + '</span><input name="' + f[0] + '" type="number" step="any"></label>';
    }).join("");
    return "<h1>" + esc(title) + "</h1>" + draftNote() + '<form id="tool" data-kind="' + kind + '">' + inputs + '<button class="btn" type="submit">Estimate</button></form><div id="tool-out"></div><p class="muted">Assumptions are in the result. Educational estimate only.</p>';
  }

  function bind(main, d) {
    var form = main.querySelector("#onboard");
    if (form) form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = read();
      ["who", "region", "incomePattern", "income", "essentials", "highInterest", "arrears", "priority"].forEach(function (k) {
        if (form.elements[k] && form.elements[k].value !== "") data[k] = form.elements[k].value;
      });
      if (form.elements.safe && form.elements.safe.value === "no") data.discreet = true;
      data.state = classify(data);
      write(data);
      main.querySelector("#on-out").textContent = "Saved on this device. Planning aid: " + data.state + ".";
    });
    var saveB = main.querySelector("#save-buckets");
    if (saveB) saveB.addEventListener("click", function () {
      var data = read();
      data.bucketOverrides = data.bucketOverrides || {};
      main.querySelectorAll("[data-bucket]").forEach(function (input) { data.bucketOverrides[input.getAttribute("data-bucket")] = input.value; });
      var essentials = Number(data.essentials) || Number(data.bucketOverrides.essentials) || 0;
      var income = Number(data.income) || 0;
      var warn = main.querySelector("#bucket-warn");
      if (income && essentials > income) warn.innerHTML = '<p class="bad">Essentials exceed income. Do not force a split. Open support.</p>';
      else warn.textContent = "Overrides saved on this device.";
      write(data);
    });
    main.querySelectorAll("[data-legacy]").forEach(function (box) {
      box.addEventListener("change", function () {
        var data = read();
        data.legacy = data.legacy || {};
        data.legacy[box.getAttribute("data-legacy")] = box.checked;
        write(data);
      });
    });
    var pause = main.querySelector("#pause");
    if (pause) pause.addEventListener("click", function () {
      main.querySelector("#pause-out").textContent = "Paused. No one has to finish this conversation tonight.";
    });
    var ics = main.querySelector("#ics");
    if (ics) ics.addEventListener("click", function () {
      var stamp = new Date();
      stamp.setMonth(stamp.getMonth() + 1);
      var dt = stamp.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
      var body = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:" + dt + "\nSUMMARY:Money meeting\nEND:VEVENT\nEND:VCALENDAR";
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
      a.download = "money-meeting.ics";
      a.click();
    });
    var tool = main.querySelector("#tool");
    if (tool) tool.addEventListener("submit", function (e) {
      e.preventDefault();
      var kind = tool.getAttribute("data-kind");
      var input = {};
      Array.prototype.forEach.call(tool.elements, function (el) { if (el.name) input[el.name] = el.value; });
      var out = AcerCalc[kind === "bucket" ? "bucketCalc" : kind === "emergency" ? "emergency" : kind === "mortgage" ? "mortgage" : kind === "retirement" ? "retirement" : "superEstimate"](input);
      main.querySelector("#tool-out").innerHTML = "<pre>" + esc(JSON.stringify(out, null, 2)) + "</pre>";
    });
    var debt = main.querySelector("#debt-form");
    if (debt) debt.addEventListener("submit", function (e) {
      e.preventDefault();
      var g = function (n) { return debt.elements[n].value; };
      var plans = AcerCalc.debtPlans([
        { name: "A", balance: g("aBal"), rate: g("aRate"), min: g("aMin") },
        { name: "B", balance: g("bBal"), rate: g("bRate"), min: g("bMin") }
      ], g("extra"));
      main.querySelector("#tool-out").innerHTML = "<pre>" + esc(JSON.stringify(plans, null, 2)) + "</pre>";
    });
    var sub = main.querySelector("#sub-form");
    if (sub) {
      function draw() {
        var data = read();
        var list = data.subs || [];
        var sum = list.reduce(function (a, s) { return a + Number(s.amount || 0); }, 0);
        main.querySelector("#sub-list").innerHTML = list.map(function (s, i) {
          return "<p>" + esc(s.name) + " — " + money(s.amount) + " <button type=\"button\" data-drop=\"" + i + "\">Remove</button></p>";
        }).join("") + "<p>Monthly total " + money(sum) + "</p>";
      }
      draw();
      sub.addEventListener("submit", function (e) {
        e.preventDefault();
        var data = read();
        data.subs = data.subs || [];
        data.subs.push({ name: sub.elements.name.value || "Subscription", amount: sub.elements.amount.value });
        write(data);
        draw();
      });
    }
    var discreet = main.querySelector("#discreet");
    if (discreet) discreet.addEventListener("change", function () {
      var data = read();
      data.discreet = discreet.checked;
      write(data);
      document.body.classList.toggle("discreet", data.discreet);
      if (data.discreet) document.title = "Notes";
    });
    var wipe = main.querySelector("#wipe");
    if (wipe) wipe.addEventListener("click", function () {
      localStorage.removeItem(KEY);
      location.href = "index.html";
    });
    var fails = AcerCalc.selfTest();
    if (fails.length) console.warn("calc self-test", fails);
  }

  shell();
})();
