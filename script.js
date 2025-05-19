// Full vendor risk tool with all question logic, correct scoring, and Google Sheet integration

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("risk-form");
  const container = document.getElementById("questions-container");

  const functionWeights = {
    "Flight Operations": [0.4, 0.15, 0.3, 0.05, 0.05, 0.05],
    "Aircraft Maintenance & Engineering": [0.6, 0.15, 0.05, 0.1, 0.05, 0.05],
    "Ground Operations & Airport Services": [0.4, 0.15, 0.3, 0.05, 0.05, 0.05],
    "IT & Technology": [0.3, 0.15, 0.05, 0.4, 0.05, 0.05],
    "Customer Service & Guest Products": [0.4, 0.15, 0.15, 0.1, 0.1, 0.1],
    "Procurement & Supply Chain": [0.4, 0.15, 0.15, 0.1, 0.1, 0.1],
    "Corporate & Finance": [0.4, 0.15, 0.15, 0.1, 0.1, 0.1],
    "Safety, Security, & Risk": [0.4, 0.15, 0.15, 0.1, 0.1, 0.1]
  };

  const riskAreas = [
    {
      title: "Safety Risk",
      impact: [
        "If this vendor fails, would it pose a safety risk to passengers or crew?",
        "Is this vendor essential to maintaining the airworthiness of Alaska’s fleet?",
        "Is the vendor responsible for high-risk ground operations (e.g., aircraft pushback, wing-walk, de-icing, towing)?",
        "Does this vendor support flight crew, maintenance, or ground staff training that affects flight safety?",
        "Does this vendor supply, install, or calibrate critical onboard or emergency systems (e.g., avionics, braking systems, oxygen, evacuation)?",
        "Is this vendor responsible for engine services (e.g., teardown, overhaul, diagnostics) that could affect in-flight performance or safety?"
      ],
 likelihood: [
  "In the past 12 years, how often has this vendor been associated with safety incidents, warnings, or audit findings affecting passenger or crew safety?\n\n1 = Never\n\n2 = One minor, contained incident\n\n3 = One moderate or multiple minor issues\n\n4 = Recurring moderate issues or one serious finding\n\n5 = Multiple serious or systemic safety incidents (Recent past – 3–4 years)",

  "How limited are Alaska’s alternative vendor options for this safety-critical service (e.g., aircraft maintenance, inspection, de-icing)?\n\n1 = Multiple qualified backups ready\n\n2 = 1–2 reliable backups, already vetted\n\n3 = Only one partially-vetted backup\n\n4 = No approved backup currently in place\n\n5 = No alternatives exist; replacement would cause operational disruption",

  "How adequate is the vendor’s disaster recovery or continuity plan for safety-critical services (e.g., aircraft movement, emergency response, etc.)?\n\n1 = Fully documented, tested within last 12 months\n\n2 = Documented and tested within last 24 months\n\n3 = Documented but not recently tested\n\n4 = Incomplete or outdated plan\n\n5 = No plan exists or cannot be provided",

  "How prepared is Alaska to switch to a backup vendor for this safety-related function?\n\n1 = Backup vendor fully approved and tested recently\n\n2 = Backup vendor in place but not tested recently\n\n3 = Backup plan exists, but vendor not fully approved\n\n4 = No backup vendor currently active\n\n5 = No backup exists; switch would be disruptive",

  "In the past 12 months, has the backup vendor for this service been tested or used, and how reliable was the result?\n\n1 = Tested and fully successful\n\n2 = Tested with minor issues corrected\n\n3 = Test showed gaps, but mitigations underway\n\n4 = Test failed, not retested yet\n\n5 = Test failed, no follow-up or backup readiness unknown",

  "If this vendor’s safety-critical service fails, how easily can Alaska continue operations using internal or temporary alternatives?\n\n1 = Fully replaceable or temporary workaround exists\n\n2 = Minor operational impact; workaround possible\n\n3 = Moderate disruption, partial workaround available\n\n4 = Major disruption, only limited workaround possible\n\n5 = No workaround available; operations would halt or pose safety risk"
]


    },
    {
      title: "Compliance Risk",
      impact: [
        "Is this vendor involved in FAA-related compliance systems or regulatory reporting functions?",
        "Is the vendor located in a region affected by export controls, sanctions, or regulatory restrictions?",
        "Does the vendor adhere to Alaska Airlines’ mandatory training and compliance requirements?",
        "Can this vendor failure cause legal, regulatory, or PR-related compliance issues?",
        "Does this vendor manage certifications or records tied to FAA, DOT, or TSA compliance?"
      ],
     likelihood: [
  "In the past 12 months, how compliant has this vendor been with FAA reporting systems or other regulatory documentation requirements?\n1 = Fully compliant, no issues\n2 = Minor documentation errors, resolved\n3 = Moderate issues or late submissions\n4 = Ongoing gaps or repeat non-compliance\n5 = Serious or systemic violations noted by FAA or others",

  "In the past year, has the vendor violated or been flagged for risks related to export controls, sanctions, or other regulatory restrictions?\n1 = No violations, clear record\n2 = One low-risk issue resolved\n3 = One moderate issue, under review\n4 = Repeated or unresolved violations\n5 = Active restrictions or sanctions impacting operations",

  "How effectively does the vendor document and monitor employee compliance with Alaska Airlines’ required training for regulated tasks?\n1 = All records complete and up to date\n2 = One-time lapse or delay, quickly fixed\n3 = Occasional gaps or outdated records\n4 = Regularly incomplete documentation or poor monitoring\n5 = No documentation or system for compliance training",

  "In the past 12 months, has this vendor faced any legal actions, compliance failures, or PR-related incidents that could affect Alaska’s regulatory standing or reputation?\n1 = No known issues or disputes\n2 = One minor incident, resolved\n3 = Moderate issue with some external attention\n4 = Ongoing issue or multiple incidents\n5 = Major legal/regulatory issue impacting reputation or contracts",

  "In the past 2 years, how reliable has this vendor been in managing pilot training records, certification tracking, or regulatory documentation tied to FAA, DOT, or TSA?\n1 = No errors, complete and timely records\n2 = One minor delay or gap, resolved\n3 = Moderate errors or incomplete tracking\n4 = Repeated errors or audit flags\n5 = Serious lapses, failed audits, or regulatory risk"
]

    },
    {
      title: "Operational Risk",
      impact: [
        "Does the vendor support hub airport ops or turnaround logistics (gates, pushback, slots)?",
        "Does the vendor provide aircraft fueling services?",
        "Does the vendor handle baggage tracking, loading/unloading?",
        "Does the vendor affect dispatch, crew scheduling, or flight departure?",
        "Does the vendor support weather, NOTAMs, or dispatch tech systems?",
        "Would failure affect load planning, fueling accuracy, or cargo coordination?"
      ],
     likelihood: [
  "In the past 12 months, how often has this vendor caused operational delays or breakdowns related to gate changes, pushback, or turnaround logistics at hub airports?\n1 = Never\n2 = One isolated incident, resolved\n3 = Occasional minor issues\n4 = Recurring delays or coordination problems\n5 = Frequent or serious disruptions impacting flights",

  "How often in the past 12 months has this vendor experienced fueling delays, incorrect fuel quantity, or equipment failures that affected aircraft readiness or on-time departure?\n1 = Never\n2 = One minor issue, resolved quickly\n3 = Occasional moderate delays\n4 = Several incidents, with flight impact\n5 = Frequent or serious fueling-related failures",

  "In the past 12 months, has the vendor been involved in baggage errors (misloads, delays, or tracking issues) that affected flight schedules or passenger satisfaction?\n1 = No incidents\n2 = One minor case\n3 = 2–3 issues with limited impact\n4 = Recurring baggage handling problems\n5 = Frequent or serious errors impacting flights or customers",

  "In the past year, how often has this vendor caused disruptions to dispatch workflows, crew scheduling, or readiness that affected on-time departures?\n1 = Never\n2 = One isolated issue, resolved quickly\n3 = Moderate issues on occasion\n4 = Repeat coordination or tech problems\n5 = Frequent or critical delays linked to vendor services",

  "In the past year, how often has the vendor’s system experienced unplanned downtime, delayed weather data, or NOTAM errors affecting dispatch or flight decisions?\n1 = Never\n2 = One minor delay or error\n3 = A few cases with limited impact\n4 = Recurring delays or data delivery issues\n5 = Frequent or serious problems affecting flight safety or timing",

  "In the past 2 years, how reliably has this vendor delivered accurate load planning, weight & balance documents, or cargo coordination for safe and timely flights?\n1 = Always accurate, no issues\n2 = One minor documentation error\n3 = A few moderate gaps found\n4 = Repeated errors requiring re-checks or delays\n5 = Serious failures causing aircraft reassignment or flight impact"
]

    },
    {
      title: "IT & Cyber Risk",
      impact: [
        "Is this vendor responsible for crew software or digital flight tools?",
        "Does this vendor manage dispatch or flight ops systems?",
        "Would an outage cause loss of data for passengers, cargo, or maintenance?",
        "Is this vendor tied to public/customer-facing systems (web, booking, apps)?",
        "Would failure interrupt data delivery to regulatory or audit systems?"
      ],
    likelihood: [
  "In the past year, how often has this vendor’s crew-facing platform (e.g., EFB, cockpit app, crew portal) experienced downtime, data sync issues, or usability problems affecting pilot operations or readiness?\n1 = Never\n2 = One isolated issue, resolved quickly\n3 = A few minor disruptions, no major impact\n4 = Recurring performance issues impacting readiness\n5 = Frequent outages or serious usability failures",

  "How often has this vendor experienced system failures, data feed errors, or outages in the past year that disrupted dispatch, flight tracking, or operational decision-making?\n1 = Never\n2 = One minor disruption, resolved fast\n3 = Occasional moderate issues\n4 = Multiple disruptions with some operational effect\n5 = Frequent or serious failures impacting operations",

  "In the past 12 months, how many incidents has this vendor had involving data loss, backup failure, or unscheduled outages affecting passenger, cargo, or maintenance information?\n1 = None\n2 = One minor issue with no lasting impact\n3 = Occasional issues with recoverable loss\n4 = Repeat problems requiring manual recovery\n5 = Major or unrecoverable loss incidents",

  "Has this vendor’s system caused any high-visibility outages, performance delays, or customer-facing issues in the past year (e.g., website crashes, failed mobile check-ins)?\n1 = No incidents\n2 = One minor delay or outage\n3 = Occasional, resolved quickly\n4 = Multiple public-facing issues\n5 = Frequent or major failures with public impact",

  "How reliably has this vendor delivered accurate and timely data to regulatory or internal compliance systems (e.g., FAA reports, audit logs, maintenance tracking) in the past year?\n1 = Always timely and accurate\n2 = One minor delay, no impact\n3 = Occasional delays or formatting issues\n4 = Multiple delays or data inconsistencies\n5 = Consistent failure to meet compliance data needs"
]

    },
    {
      title: "Financial Risk",
      impact: [
        "Would switching this vendor result in major financial cost/delays?",
        "Is this vendor under a high-value contract?",
        "Is the vendor critical to revenue (booking, payment, etc.)?",
        "Would vendor failure impact monthly profit?",
        "Does this vendor manage major capital purchases (aircraft, engines)?"
      ],
     likelihood: [
  "In the past 1–2 years, how often has Alaska incurred penalties, onboarding delays, or retraining costs when switching vendors in this service category?\n1 = No history of issues\n2 = One minor case, handled well\n3 = Moderate cost or effort in transition\n4 = Repeated transition issues or penalties\n5 = Severe or costly failures in switching vendors",

  "How prone is this vendor’s pricing model to cost uncertainty, lack of transparency, or budget overruns?\n1 = Fully fixed-rate and transparent\n2 = Mostly fixed, rare adjustments\n3 = Some variability and unclear terms\n4 = Frequently exceeds budgeted amounts\n5 = Highly unpredictable, opaque pricing",

  "In the past 2 years, has this vendor caused any system outages or integration failures in profit-generating systems (e.g., booking, payments)?\n1 = No incidents\n2 = One minor, resolved fast\n3 = A few issues, limited impact\n4 = Multiple disruptions with financial impact\n5 = Frequent or severe failures affecting revenue flow",

  "In the past 12 months, has this vendor caused a measurable decrease in Alaska’s monthly profit (e.g., from downtime, billing error, or system failure)?\n1 = No effect on profit\n2 = One-time impact, resolved\n3 = Occasional small impacts\n4 = Repeated or moderate profit loss\n5 = Clear and significant profit loss caused by vendor failure",

  "In the past year, has this vendor missed project deadlines, exceeded budgets, or failed to meet milestones for large capital projects (e.g., aircraft or engine sourcing)?\n1 = Delivered on time and on budget\n2 = Minor delay or overage\n3 = Several manageable delays or cost issues\n4 = Missed key milestones, over budget\n5 = Major failure causing project delays or overspending"
]

    },
    {
      title: "Competitive Risk",
      impact: [
        "Does the vendor have patents, proprietary tech, or custom integrations?",
        "Would switching vendors affect codeshare or partnership agreements?",
        "Is this vendor a market-dominant or monopoly provider?",
        "Could vendor exit weaken Alaska’s pricing or contract leverage?"
      ],
      likelihood: [
  "In the past year, how often has this vendor delayed or restricted access to documentation, customization protocols, or integration standards?\n1 = Always provides full, timely access\n2 = One minor delay, resolved quickly\n3 = Occasional slow response or missing info\n4 = Recurring access issues or delays\n5 = Frequently withholds or controls access, blocking transitions",

  "Is this vendor tied to strategic agreements (e.g., codeshare, alliances, or interline) such that switching vendors would require renegotiation or regulatory review?\n1 = No such dependencies or contracts\n2 = Low dependency; minimal renegotiation needed\n3 = Medium-level risk; some formal review required\n4 = High complexity or delayed approvals likely\n5 = Replacement would disrupt key contracts or alliances",

  "In the past 12 months, has this vendor retained market dominance despite emerging competitors or alternative solutions?\n1 = Not a dominant player; many strong alternatives exist\n2 = Slightly preferred but not critical\n3 = Maintains a moderate market edge\n4 = Few real competitors; difficult to challenge\n5 = Clear monopoly or dominance, no effective alternatives",

  "In recent negotiations, has this vendor raised prices unilaterally, rejected flexibility, or limited renewal terms in a way that reduces Alaska’s leverage?\n1 = Fully flexible and fair terms\n2 = Minor pricing pressure or negotiation required\n3 = Some rigidity in contract or renewal conditions\n4 = Significant inflexibility or unilateral pricing\n5 = No room for negotiation; vendor controls all terms"
]

    }
  ];

  function createRadioGroup(name, index) {
    const div = document.createElement("div");
    div.className = "radio-group";
    div.innerHTML = `
      <label><input type="radio" name="${name}-${index}" value="yes" required> Yes</label>
      <label><input type="radio" name="${name}-${index}" value="no"> No</label>
    `;
    return div;
  }

  function createSelectGroup(name, index) {
    const select = document.createElement("select");
    select.name = `${name}-${index}`;
    select.required = true;
    ["Select", "1", "2", "3", "4", "5"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value === "Select" ? "" : value;
      option.text = value;
      select.appendChild(option);
    });
    return select;
  }

  riskAreas.forEach((area) => {
    const section = document.createElement("section");
    section.innerHTML = `
      <h2>${area.title}</h2>
      <div class="question-headers">
        <strong>Impact Questions (Yes/No)</strong>
        <strong>Likelihood Questions (1–5)</strong>
      </div>
    `;

    const rows = document.createElement("div");
    rows.className = "question-row-container";

    for (let i = 0; i < Math.max(area.impact.length, area.likelihood.length); i++) {
      const row = document.createElement("div");
      row.className = "question-row";

      const impactWrapper = document.createElement("div");
      impactWrapper.className = "question-box";
      if (area.impact[i]) {
        impactWrapper.innerHTML = `<label>${i + 1}. ${area.impact[i]}</label>`;
        impactWrapper.appendChild(createRadioGroup(area.title + "-impact", i));
      }

      const likelihoodWrapper = document.createElement("div");
      likelihoodWrapper.className = "question-box";
      if (area.likelihood[i]) {
        likelihoodWrapper.innerHTML = `<label>${i + 1}. ${area.likelihood[i]}</label>`;
        likelihoodWrapper.appendChild(createSelectGroup(area.title + "-likelihood", i));
      }

      row.appendChild(impactWrapper);
      row.appendChild(likelihoodWrapper);
      rows.appendChild(row);
    }

    section.appendChild(rows);
    container.appendChild(section);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedFunction = document.getElementById("function-select").value;
    const weights = functionWeights[selectedFunction];

    let totalImpactScore = 0;
    let totalLikelihoodScore = 0;

    riskAreas.forEach((area, i) => {
      let impactYesCount = 0;
      let likelihoodSum = 0;

      for (let j = 0; j < area.impact.length; j++) {
        const impactAnswer = document.querySelector(`input[name='${area.title}-impact-${j}']:checked`);
        if (impactAnswer && impactAnswer.value === "yes") impactYesCount++;
      }

      for (let j = 0; j < area.likelihood.length; j++) {
        const likelihoodAnswer = document.querySelector(`select[name='${area.title}-likelihood-${j}']`).value;
        if (likelihoodAnswer) likelihoodSum += parseInt(likelihoodAnswer);
      }

      const impactPercent = impactYesCount / area.impact.length;
      const likelihoodAvg = likelihoodSum / area.likelihood.length / 5;

      totalImpactScore += impactPercent * 5 * weights[i];
      totalLikelihoodScore += likelihoodAvg * 5 * weights[i];
    });

    const riskScore = totalImpactScore * totalLikelihoodScore;
    const riskPercent = (riskScore / 25) * 100;

    let criticality = "🟢 Low Risk";
    if (riskPercent >= 60) criticality = "🔴 Critical";
    else if (riskPercent >= 40) criticality = "🟠 Semi-Critical";

    const vendorName = document.getElementById("vendor-name").value;
    document.getElementById("result").innerHTML = `
      <h3>Results for: ${vendorName}</h3>
      <p><strong>Impact Score:</strong> ${totalImpactScore.toFixed(2)}</p>
      <p><strong>Likelihood Score:</strong> ${totalLikelihoodScore.toFixed(2)}</p>
      <p><strong>Risk Score:</strong> ${riskScore.toFixed(2)}</p>
      <p><strong>Risk Score %:</strong> ${riskPercent.toFixed(1)}%</p>
      <p><strong>Vendor Criticality:</strong> ${criticality}</p>
    `;

    const payload = {
      timestamp: new Date().toISOString(),
      vendorName,
      functionCategory: selectedFunction,
      impactScore: totalImpactScore.toFixed(2),
      likelihoodScore: totalLikelihoodScore.toFixed(2),
      riskScore: riskScore.toFixed(2),
      riskPercent: riskPercent.toFixed(1),
      criticality
    };

    fetch("https://script.google.com/macros/s/AKfycbwqbqHjKXuYmVB2YlujcBIF8gz2_uGbTv0ngrGnOxK_ISdhCBHqeJiqe-8-2-aUlG6u/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.text())
      .then(msg => console.log("Saved to Google Sheet:", msg))
      .catch(err => console.error("Save failed:", err));
  });
});
