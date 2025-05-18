// Full vendor risk tool with all question logic, correct scoring, and Google Sheet integration

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("risk-form");
  const container = document.getElementById("questions-container");

  const riskAreas = [
    {
      title: "Safety Risk",
      weight: 0.5,
      impact: [
        "If this vendor fails, would it pose a safety risk to passengers or crew?",
        "Is this vendor essential to maintaining the airworthiness of Alaska’s fleet?",
        "Is the vendor responsible for high-risk ground operations (e.g., aircraft pushback, wing-walk, de-icing, towing)?",
        "Does this vendor support flight crew, maintenance, or ground staff training that affects flight safety?",
        "Does this vendor supply, install, or calibrate critical onboard or emergency systems (e.g., avionics, braking systems, oxygen, evacuation)?",
        "Is this vendor responsible for engine services (e.g., teardown, overhaul, diagnostics) that could affect in-flight performance or safety?"
      ],
      likelihood: [
        "In the past 12 years, how often has this vendor been associated with safety incidents?",
        "How limited are Alaska’s alternative vendor options for this safety-critical service?",
        "How adequate is the vendor’s disaster recovery or continuity plan?",
        "How prepared is Alaska to switch to a backup vendor for this safety-related function?",
        "In the past 12 months, has the backup vendor been tested or used?",
        "If this vendor’s safety-critical service fails, how easily can Alaska continue operations?"
      ]
    },
    {
      title: "Compliance Risk",
      weight: 0.15,
      impact: [
        "Is this vendor involved in FAA-related compliance systems or regulatory reporting functions?",
        "Is the vendor located in a region affected by export controls, sanctions, or regulatory restrictions?",
        "Does the vendor adhere to Alaska Airlines’ mandatory training and compliance requirements?",
        "Can this vendor failure cause legal, regulatory, or PR-related compliance issues?",
        "Does this vendor manage certifications or records tied to FAA, DOT, or TSA compliance?"
      ],
      likelihood: [
        "How compliant has this vendor been with FAA reporting/documentation requirements?",
        "Has the vendor been flagged for export control or sanction risks?",
        "How well does the vendor monitor employee compliance with training requirements?",
        "Has this vendor faced any legal or PR-related issues affecting compliance?",
        "How reliable has the vendor been with pilot training records or certification tracking?"
      ]
    },
    {
      title: "Operational Risk",
      weight: 0.15,
      impact: [
        "Does the vendor support hub airport ops or turnaround logistics (gates, pushback, slots)?",
        "Does the vendor provide aircraft fueling services?",
        "Does the vendor handle baggage tracking, loading/unloading?",
        "Does the vendor affect dispatch, crew scheduling, or flight departure?",
        "Does the vendor support weather, NOTAMs, or dispatch tech systems?",
        "Would failure affect load planning, fueling accuracy, or cargo coordination?"
      ],
      likelihood: [
        "How often has this vendor caused operational delays at hub airports?",
        "How often has the vendor had fueling-related issues?",
        "Has this vendor caused baggage errors impacting schedules or satisfaction?",
        "Has the vendor disrupted dispatch workflows or crew readiness?",
        "How often has the vendor’s system had downtime affecting dispatch?",
        "How reliably has this vendor delivered load planning and balance docs?"
      ]
    },
    {
      title: "IT & Cyber Risk",
      weight: 0.1,
      impact: [
        "Is this vendor responsible for crew software or digital flight tools?",
        "Does this vendor manage dispatch or flight ops systems?",
        "Would an outage cause loss of data for passengers, cargo, or maintenance?",
        "Is this vendor tied to public/customer-facing systems (web, booking, apps)?",
        "Would failure interrupt data delivery to regulatory or audit systems?"
      ],
      likelihood: [
        "How often has their crew platform had downtime or issues?",
        "Have dispatch or flight systems had outages due to this vendor?",
        "Has this vendor lost data or had backup failures?",
        "Have there been public outages or booking system failures?",
        "How reliably do they send compliance/audit/maintenance data?"
      ]
    },
    {
      title: "Financial Risk",
      weight: 0.05,
      impact: [
        "Would switching this vendor result in major financial cost/delays?",
        "Is this vendor under a high-value contract?",
        "Is the vendor critical to revenue (booking, payment, etc.)?",
        "Would vendor failure impact monthly profit?",
        "Does this vendor manage major capital purchases (aircraft, engines)?"
      ],
      likelihood: [
        "Has switching vendors in this category previously caused financial issues?",
        "How transparent or predictable is their pricing model?",
        "Has this vendor caused outages in profit-generating systems?",
        "Has vendor failure caused drops in profit recently?",
        "Have they failed to deliver large financial/capital projects on time?"
      ]
    },
    {
      title: "Competitive Risk",
      weight: 0.05,
      impact: [
        "Does the vendor have patents, proprietary tech, or custom integrations?",
        "Would switching vendors affect codeshare or partnership agreements?",
        "Is this vendor a market-dominant or monopoly provider?",
        "Could vendor exit weaken Alaska’s pricing or contract leverage?"
      ],
      likelihood: [
        "Has the vendor restricted access to integration protocols?",
        "Are they tied to contracts requiring renegotiation if replaced?",
        "Have they maintained dominance despite market changes?",
        "Have they raised prices unilaterally or blocked renewal flexibility?"
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

    let totalImpactScore = 0;
    let totalLikelihoodScore = 0;

    riskAreas.forEach((area) => {
      let impactYesCount = 0;
      let likelihoodSum = 0;

      for (let i = 0; i < area.impact.length; i++) {
        const impactAnswer = document.querySelector(`input[name='${area.title}-impact-${i}']:checked`);
        if (impactAnswer && impactAnswer.value === "yes") impactYesCount++;
      }

      for (let i = 0; i < area.likelihood.length; i++) {
        const likelihoodAnswer = document.querySelector(`select[name='${area.title}-likelihood-${i}']`).value;
        if (likelihoodAnswer) likelihoodSum += parseInt(likelihoodAnswer);
      }

      const impactPercent = impactYesCount / area.impact.length;
      const likelihoodAvg = likelihoodSum / area.likelihood.length / 5;

      totalImpactScore += impactPercent * 5 * area.weight;
      totalLikelihoodScore += likelihoodAvg * 5 * area.weight;
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
      impactScore: totalImpactScore.toFixed(2),
      likelihoodScore: totalLikelihoodScore.toFixed(2),
      riskScore: riskScore.toFixed(2),
      riskPercent: riskPercent.toFixed(1),
      criticality
    };

    fetch("https://script.google.com/macros/s/AKfycbzEljJdmQ7OkWOhoq95B1D69UPhiEIrHNfwUtOBHUqM2JfYJua581J4GG8oeu7dibgt/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.text())
      .then(msg => console.log("Saved to Google Sheet:", msg))
      .catch(err => console.error("Save failed:", err));
  });
});
