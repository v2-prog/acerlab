/* AcerLab Navigator — educational content (Australia). Not advice. */
window.NAV_DATA = {
  yearLabel: "FY2025–26 figures used as illustrations only. Confirm current ATO / state settings.",
  concessionalCap: 30000,
  nonConcessionalCap: 120000,
  sgRate: 0.12,
  taxBrackets: [
    { upTo: 18200, rate: 0 },
    { upTo: 45000, rate: 0.16 },
    { upTo: 135000, rate: 0.30 },
    { upTo: 190000, rate: 0.37 },
    { upTo: Infinity, rate: 0.45 }
  ],
  medicare: 0.02,
  jurisdictions: [
    { id: "ACT", name: "ACT" },
    { id: "NSW", name: "New South Wales" },
    { id: "VIC", name: "Victoria" },
    { id: "QLD", name: "Queensland" },
    { id: "SA", name: "South Australia" },
    { id: "WA", name: "Western Australia" },
    { id: "TAS", name: "Tasmania" },
    { id: "NT", name: "Northern Territory" }
  ],
  modules: [
    { id: "budget", group: "finance", title: "Budget studio" },
    { id: "wages", group: "finance", title: "Wage & tax structure" },
    { id: "savings", group: "finance", title: "Savings & investing" },
    { id: "debt", group: "finance", title: "Debt literacy" },
    { id: "glossary", group: "finance", title: "Glossary" },
    { id: "structures", group: "village", title: "Legal structures" },
    { id: "zoning", group: "village", title: "Zoning pathway" },
    { id: "building", group: "village", title: "Building codes" },
    { id: "shared", group: "village", title: "Shared money" },
    { id: "resources", group: "village", title: "Resource directory" },
    { id: "templates", group: "village", title: "Checklists" }
  ],
  vehicles: [
    { id: "hisa", name: "High-interest savings", risk: "Very low", access: "Days", point: "Cash buffer and sinking-fund parking. Interest is taxable in the year earned. Rate can fall." },
    { id: "td", name: "Term deposit", risk: "Very low", access: "Locked for term", point: "Known rate if held to maturity. Early-break fees. Still taxable interest." },
    { id: "offset", name: "Offset account", risk: "Low (tied to loan)", access: "At call", point: "Dollar in offset reduces interest on a linked home loan. Not a return; it is interest not paid." },
    { id: "index", name: "Broad index fund / ETF", risk: "Medium–high", access: "Market days", point: "Owns a slice of many companies. Value moves daily. CGT on sale; dividends may be franked. Not a savings account." },
    { id: "super", name: "Superannuation", risk: "Varies by option", access: "Preserved to condition of release", point: "Concessional contributions are taxed in the fund (generally 15% for most members). Caps and work-test / total-super-balance rules apply." }
  ],
  structures: [
    { id: "tic", name: "Tenants in common + deed", independence: "High if the deed is tight", exit: "Sell your share; co-owners often have first-refusal", decisions: "By deed — usually unanimous for land changes", liability: "Each person can be pursued for the whole of a joint loan", pros: ["Keeps individual title shares", "Familiar to banks and solicitors", "Deed can set levies, use and exit"], cons: ["Joint mortgage = joint and several risk", "A fight without a deed is expensive", "Not a governance vehicle for 8+ households"] },
    { id: "strata", name: "Strata / community title", independence: "High inside the lot; low on common property", exit: "Sell the lot on the open market", decisions: "Owners corporation / community association", liability: "Levy debt attaches to the lot", pros: ["Clear lot vs common split", "Known to valuers and lenders", "Sinking fund is a recognised tool"], cons: ["Survey and registration cost", "Council / state approval pathway", "By-laws can feel rigid for an intentional community"] },
    { id: "company", name: "Company title", independence: "Depends on constitution and share class", exit: "Transfer shares — board or constitution may restrict buyers", decisions: "Board / members under Corporations Act", liability: "Company is the landowner; shareholders risk paid capital plus any guarantees", pros: ["One title, many dwellings historically", "Constitution can encode community rules"], cons: ["Harder finance than strata in many banks", "Share sale is not a simple house sale", "Director duties apply"] },
    { id: "coop", name: "Co-operative", independence: "Medium — member, not owner of a freehold lot", exit: "Share redemption / transfer under co-op rules; can be slow", decisions: "One-member-one-vote is common", liability: "Limited by shares unless members give guarantees", pros: ["Fits mutual / Quaker / community ethos", "State co-op law is designed for this", "Can hold land for members"], cons: ["Banks may treat it as non-standard", "Exit liquidity is the usual weak point", "Must stay inside co-op purpose"] },
    { id: "clt", name: "Community land trust / land-holding charity", independence: "High on the dwelling if a ground lease is used; land is locked", exit: "Sell or assign the improvement / lease — land stays in the trust", decisions: "Board of the trust or company; asset lock", liability: "Entity holds land; residents are lessees or licensees", pros: ["Land stays out of speculation", "Aligns with purpose / First Nations / DGR pathways", "Separates house finance from land"], cons: ["A locked charity is not a family investment vehicle", "Duty, CGT and planning need specialist advice", "Resale formula must be written on day one"] },
    { id: "inc", name: "Incorporated association / company limited by guarantee", independence: "Low as to land — the entity owns or leases", exit: "Membership cessation; no automatic land share", decisions: "Committee + constitution", liability: "Usually limited; officers still have duties", pros: ["Good shell for shared tools, events, a common house", "Cheap to start as an assoc. in most states"], cons: ["Do not use it as a hidden co-ownership of houses", "Winding up surplus often cannot go to members if charitable"] }
  ],
  glossary: [
    { t: "Concessional contribution", d: "A super contribution taxed in the fund (usually 15% for most members). Salary sacrifice and employer SG sit here." },
    { t: "Non-concessional contribution", d: "An after-tax super contribution. Counts toward the non-concessional cap. Bring-forward rules may apply." },
    { t: "Salary packaging / salary sacrifice", d: "Redirecting some gross pay into super or approved benefits before it hits your bank. Employer and award rules decide what is possible." },
    { t: "Offset account", d: "A transaction account linked to a home loan. The balance is subtracted from the loan when interest is calculated." },
    { t: "Sinking fund", d: "A shared reserve for irregular big costs — roofs, tracks, septic, inverters. Distinct from the day-to-day levy." },
    { t: "Levy", d: "Regular contribution to shared operating costs. In strata it is statutory; in a deed or co-op it is contractual." },
    { t: "Joint and several liability", d: "The lender can recover the whole debt from any one borrower. A deed between co-owners does not bind the bank." },
    { t: "Tenants in common", d: "Each person owns a defined share of the same title. Contrast joint tenants, where survivorship applies." },
    { t: "Community title / strata", d: "A registered subdivision into lots plus common property, with an owners corporation or community association." },
    { t: "Company title", d: "A company owns the land; residents own shares that give a right to occupy a dwelling." },
    { t: "Community land trust (CLT)", d: "A purpose entity holds land under an asset lock. Residents typically hold a dwelling plus a ground lease." },
    { t: "Multiple occupancy / rural land sharing", d: "Planning concept (name varies by state) for several dwellings on one rural lot. Names change — check the current instrument." },
    { t: "Secondary dwelling", d: "A smaller dwelling on the same lot as a principal house. Size and use limits are local." },
    { t: "NCC / BCA", d: "National Construction Code. How it applies depends on building classification (Class 1a vs 2, 3, etc.)." },
    { t: "Class 1 vs Class 2", d: "A detached house is usually Class 1a. Stacked flats are usually Class 2. Ask the certifier which class they will apply." },
    { t: "Preservation age", d: "The age from which super can generally be accessed, subject to a condition of release. Not Age Pension age." },
    { t: "Good debt / bad debt", d: "Teaching shorthand only. Context always matters." },
    { t: "Compounding", d: "Earnings themselves start earning. Time and contribution consistency usually matter more than a heroic rate." },
    { t: "CGT", d: "Capital gains tax — generally on the profit when you dispose of an asset. Shared-living structures change who is the taxpayer." },
    { t: "Duty / stamp duty", d: "State tax on certain dutiable transactions, often land transfers and some declarations of trust." },
    { t: "DGR", d: "Deductible Gift Recipient — an ATO endorsement. Not automatic for every charity." },
    { t: "Asset lock", d: "Rule that stops land or surplus being distributed to private members on winding up." },
    { t: "Carry-forward concessional cap", d: "Unused concessional cap amounts may be used later if total super balance is under the ATO threshold." },
    { t: "Medicare levy", d: "A 2% levy on taxable income for most residents, with low-income reductions and a separate surcharge in some cases." }
  ],
  buildingTopics: [
    { q: "Fire separation", a: "Ask: What building class are you applying, and where do fire-resisting walls, floors and egress become mandatory once we add another dwelling or a common house?" },
    { q: "Services", a: "Ask: Can we share one electrical point of attachment, one wastewater system, one driveway, or does each dwelling need independently designed services?" },
    { q: "Accessibility", a: "Ask: Does Livable Housing or Premises Standards access apply to the common house, paths, or any dwelling we will let?" },
    { q: "Bushfire / flood / overlay", a: "Ask: Which overlays sit on the lot and do they change construction cost before we sketch a cluster?" },
    { q: "Change of use", a: "Ask: If we add caravans, tiny houses on wheels, or a common kitchen, at what point does that become a change of use or an unlawful dwelling?" }
  ],
  sharedFinance: [
    { t: "Operating levy", d: "A monthly or quarterly amount for rates share, insurance, internet at the common house, track maintenance, bookkeeping." },
    { t: "Sinking fund", d: "A second bucket for 5-15 year assets. Write the schedule so contributions have a reason." },
    { t: "Joint mortgage on one title", d: "Simple for the bank, dangerous for people. A co-ownership deed does not rewrite the loan contract." },
    { t: "Individual title + shared infrastructure", d: "Each household borrows against its own lot. A separate association owns the track, water and common house." },
    { t: "Ground lease on a CLT", d: "Household finances the dwelling only. Land stays in the purpose entity. Use an Australian lawyer, not a US template." },
    { t: "Keeping independence", d: "Separate everyday bank accounts. Written caps on guarantees. Nobody signs a loan for someone else's dwelling." }
  ],
  caseStudies: [
    { t: "Two households, one rural lot (NSW-style sketch)", d: "Tenants in common 50/50 with a deed covering occupation zones, a sinking fund, first refusal, and exit. They ask council the correct pathway name. They do not treat a handshake as an exit plan." },
    { t: "Six households, cluster and common house", d: "They compare community title against a co-op. Brokers warn that company title and co-op loans are non-standard. Survey and legal costs are real line items." },
    { t: "Purpose land with an asset lock", d: "A charity or CLT holds the land. Households own or long-lease dwellings. Wrong tool if the aim is a tradeable land bank for children." }
  ],
  checklist: [
    "Write the purpose in one paragraph: homes, investment, mission land, or a mix — mixes need two structures.",
    "List who must be able to leave in 12 months, and who is comfortable locking land.",
    "Ask a solicitor which title and which document will carry the rules.",
    "Ask council planning: current zone, overlays, lawful existing use, and the name of the extra-dwelling pathway.",
    "Ask a building certifier the likely NCC class before buying kits or tiny houses.",
    "Map money: individual loans vs joint loan vs entity loan; levy; sinking fund; who owns the common house.",
    "Ban informal cross-guarantees. If a guarantee is required, cap it in writing.",
    "Set a dispute path (mediation first) and a valuation method for exits.",
    "Check insurance: public liability on shared land, and whether moveable dwellings are actually covered.",
    "Take the notebook to a registered tax agent before any transfer, declaration of trust, or duty-triggering deal."
  ],
  defaultResources: [
    { region: "AU", name: "ATO — Super contributions", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/super-contributions", note: "Caps, concessional vs non-concessional." },
    { region: "AU", name: "ATO — Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", note: "Confirm the year you are modelling." },
    { region: "AU", name: "Moneysmart (ASIC)", url: "https://moneysmart.gov.au/", note: "Independent calculators and debt guidance." },
    { region: "AU", name: "NCC / ABCB", url: "https://www.abcb.gov.au/", note: "National Construction Code overview." },
    { region: "AU", name: "ACNC charity register", url: "https://www.acnc.gov.au/", note: "Charity status is not the same as DGR." },
    { region: "NSW", name: "NSW Planning Portal", url: "https://www.planningportal.nsw.gov.au/", note: "DA / CDC pathways." },
    { region: "NSW", name: "NSW legislation — planning", url: "https://legislation.nsw.gov.au/", note: "Search current housing and rural sharing instruments." },
    { region: "ACT", name: "ACT Planning / Access Canberra", url: "https://www.planning.act.gov.au/", note: "Territory Plan, DA." },
    { region: "VIC", name: "VicPlan / planning.vic.gov.au", url: "https://www.planning.vic.gov.au/", note: "Zones and overlays." },
    { region: "QLD", name: "Queensland Planning", url: "https://planning.statedevelopment.qld.gov.au/", note: "Planning Act pathway." },
    { region: "SA", name: "PlanSA", url: "https://plan.sa.gov.au/", note: "Code and overlay maps." },
    { region: "WA", name: "WA Planning", url: "https://www.wa.gov.au/organisation/department-of-planning-lands-and-heritage", note: "Region and local schemes." },
    { region: "TAS", name: "Planning in Tasmania", url: "https://www.planning.tas.gov.au/", note: "TPS / local provisions." },
    { region: "NT", name: "NT Planning", url: "https://nt.gov.au/property/land-planning-and-development", note: "NT Planning Scheme." }
  ],
  zoningHints: {
    ACT: "ACT uses the Territory Plan, not NSW-style LEP/SEPP language. Ask Access Canberra: current zone, whether a second dwelling is dual occupancy, and whether a multi-dwelling proposal needs a DA.",
    NSW: "Ask the council planner: zone, minimum lot size, secondary dwelling / dual occupancy / multi-dwelling pathway, and whether any rural land-sharing clause still applies. Also ask about bushfire and on-site sewer.",
    VIC: "Ask: zone and overlays (BMO, LSIO, heritage). Is a dependent person's unit, dual occupancy or group accommodation the right use term?",
    QLD: "Ask: planning scheme zone, whether a dual occupancy or multiple dwelling is accepted or assessable. Tiny houses on wheels may be caravans or dwellings — get the use definition in writing.",
    SA: "Ask PlanSA / council: Planning and Design Code zone and overlays, and whether ancillary accommodation is envisaged. Community title process is separate from planning.",
    WA: "Ask: region scheme + local scheme zone, R-Code if urban, and whether a grouped dwelling or ancillary dwelling pathway exists.",
    TAS: "Ask: Tasmanian Planning Scheme zone and codes. Visitor accommodation vs residential is a live distinction if you hope to host.",
    NT: "Ask: NT Planning Scheme zone, and whether multiple dwellings are discretionary. Servicing in remote lots dominates cost."
  }
};
