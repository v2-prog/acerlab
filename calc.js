/* Pure educational calculators. Not advice. Amounts are numbers the user typed. */
(function (global) {
  function n(v) { var x = Number(v); return Number.isFinite(x) ? x : 0; }
  function clampPos(v) { return Math.max(0, n(v)); }
  function round2(v) { return Math.round(v * 100) / 100; }
  function monthsToPay(amount, perMonth) {
    if (amount <= 0) return 0;
    if (perMonth <= 0) return null;
    return Math.ceil(amount / perMonth);
  }

  function bucketCalc(input) {
    var income = clampPos(input.income);
    var essentials = clampPos(input.essentials);
    var debtMin = clampPos(input.debtMin);
    var warning = essentials + debtMin > income;
    var ranges = {
      essentials: [0.55, 0.65],
      enjoyment: [0.05, 0.10],
      goals: [0.05, 0.10],
      debtAttack: [0.10, 0.25]
    };
    var suggested = {};
    Object.keys(ranges).forEach(function (k) {
      suggested[k] = [round2(income * ranges[k][0]), round2(income * ranges[k][1])];
    });
    return {
      label: "educational estimate",
      warning: warning,
      income: income,
      essentials: essentials,
      debtMin: debtMin,
      leftover: round2(income - essentials - debtMin),
      suggested: suggested,
      note: "Planning ranges for a stable household, not universal rules or financial advice. Override every amount."
    };
  }

  function amortise(balance, annualRate, payment) {
    var bal = clampPos(balance);
    var r = n(annualRate) / 100 / 12;
    var pay = clampPos(payment);
    var interest = 0;
    var months = 0;
    if (bal === 0) return { months: 0, interest: 0, unpaid: 0 };
    if (pay <= bal * r && r > 0) return { months: null, interest: null, unpaid: bal };
    while (bal > 0.5 && months < 1200) {
      var charge = bal * r;
      interest += charge;
      bal = bal + charge - pay;
      months += 1;
    }
    return { months: months, interest: round2(interest), unpaid: round2(Math.max(0, bal)) };
  }

  function debtPlans(debts, extra) {
    extra = clampPos(extra);
    function run(order) {
      var list = debts.map(function (d) {
        return { name: d.name || "Debt", balance: clampPos(d.balance), rate: n(d.rate), min: clampPos(d.min) };
      }).filter(function (d) { return d.balance > 0; });
      list.sort(order);
      var months = 0;
      var interest = 0;
      var guard = 0;
      while (list.length && guard < 1200) {
        guard += 1;
        months += 1;
        var surplus = extra;
        list.forEach(function (d) {
          var charge = d.balance * (d.rate / 100 / 12);
          interest += charge;
          d.balance += charge;
          var pay = Math.min(d.balance, d.min);
          d.balance -= pay;
        });
        list = list.filter(function (d) { return d.balance > 0.5; });
        if (list[0]) {
          var hit = Math.min(list[0].balance, surplus);
          list[0].balance -= hit;
          list = list.filter(function (d) { return d.balance > 0.5; });
        }
      }
      return { months: list.length ? null : months, interest: round2(interest) };
    }
    return {
      snowball: run(function (a, b) { return a.balance - b.balance; }),
      avalanche: run(function (a, b) { return b.rate - a.rate; }),
      note: "Minimum payments are assumed to stay current. This is an educational estimate, not a repayment instruction."
    };
  }

  function emergency(input) {
    var monthly = clampPos(input.essentials);
    var months = clampPos(input.months) || 3;
    var saved = clampPos(input.saved);
    var perPay = clampPos(input.perPay);
    var target = round2(monthly * months);
    var gap = Math.max(0, target - saved);
    return {
      target: target,
      progress: target ? Math.min(1, saved / target) : 0,
      gap: round2(gap),
      pays: monthsToPay(gap, perPay),
      note: "Target is essential costs times months you chose. Not a required product."
    };
  }

  function mortgage(input) {
    var principal = clampPos(input.principal);
    var rate = n(input.rate);
    var years = clampPos(input.years) || 30;
    var extra = clampPos(input.extra);
    var offset = clampPos(input.offset);
    var r = rate / 100 / 12;
    var m = years * 12;
    var basePay = 0;
    if (r === 0) basePay = principal / m;
    else basePay = principal * r / (1 - Math.pow(1 + r, -m));
    var effective = Math.max(0, principal - offset);
    var standard = amortise(effective, rate, basePay);
    var faster = amortise(effective, rate, basePay + extra);
    var stressed = amortise(effective, rate + 2, basePay + extra);
    return {
      payment: round2(basePay),
      standard: standard,
      faster: faster,
      stressed: stressed,
      note: "Educational estimate. Fees, break costs and offset rules are not included. Not a recommendation to refinance or borrow."
    };
  }

  function retirement(input) {
    var years = Math.max(0, n(input.retireAge) - n(input.age));
    var spend = clampPos(input.spend);
    var pot = clampPos(input.pot);
    var contrib = clampPos(input.contrib);
    var inflation = n(input.inflation) || 2.5;
    function grow(realReturn) {
      var bal = pot;
      var r = (realReturn - inflation) / 100;
      for (var i = 0; i < years; i++) bal = bal * (1 + r) + contrib;
      var futureSpend = spend * Math.pow(1 + inflation / 100, years);
      var cover = futureSpend > 0 ? bal / futureSpend : null;
      return { pot: round2(bal), yearsOfSpending: cover == null ? null : round2(cover) };
    }
    return {
      conservative: grow(4),
      middle: grow(6),
      optimistic: grow(8),
      note: "A range under stated assumptions. Not your number. Government support, tax, fees and aged care are not modelled."
    };
  }

  function superEstimate(input) {
    var income = clampPos(input.income);
    var rate = n(input.rate) || 12;
    var extra = n(input.extra);
    var cap = clampPos(input.cap) || 30000;
    var employer = income * rate / 100;
    var total = employer + extra;
    return {
      employer: round2(employer),
      total: round2(total),
      overCap: total > cap,
      cap: cap,
      note: "User-entered rate and cap. An extra contribution idea from public discussion is not a default. Check the ATO."
    };
  }

  function selfTest() {
    var fails = [];
    function eq(name, cond) { if (!cond) fails.push(name); }
    var b = bucketCalc({ income: 1000, essentials: 1200, debtMin: 0 });
    eq("essentials warning", b.warning === true);
    eq("zero income", bucketCalc({ income: 0, essentials: 0, debtMin: 0 }).warning === false);
    var e = emergency({ essentials: 2000, months: 3, saved: 1000, perPay: 500 });
    eq("emergency target", e.target === 6000);
    eq("paid off debt", debtPlans([{ balance: 0, rate: 20, min: 10 }], 0).snowball.months === 0);
    eq("mortgage stress exists", mortgage({ principal: 100000, rate: 6, years: 10, extra: 0, offset: 0 }).stressed.months >= mortgage({ principal: 100000, rate: 6, years: 10, extra: 0, offset: 0 }).standard.months);
    return fails;
  }

  global.AcerCalc = {
    bucketCalc: bucketCalc,
    debtPlans: debtPlans,
    emergency: emergency,
    mortgage: mortgage,
    retirement: retirement,
    superEstimate: superEstimate,
    selfTest: selfTest
  };
})(window);
