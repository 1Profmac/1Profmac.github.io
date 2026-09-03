(function () {
  var KEY = "tbResumeObject.v1";
  var SCHEMA_VERSION = "1.0.0";

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 8);
  }

  function emptyResume() {
    return {
      schemaVersion: SCHEMA_VERSION,
      metadata: {
        site: "",
        sessionDate: "",
        cohortType: "job_seeker",
        programTrack: "unspecified",
        facilitatorName: "",
        notes: ""
      },
      identity: {
        fullName: "",
        preferredName: "",
        email: "",
        phone: "",
        location: { city: "", region: "" }
      },
      target: { roleTitle: "", goalStatement: "", industry: "" },
      workHistory: [blankWork()],
      education: [blankEdu()],
      skills: [],
      resumeBullets: [],
      interviewAnswers: []
    };
  }

  function blankWork() {
    return {
      id: uid("work"),
      employer: "",
      title: "",
      startDate: "",
      endDate: "",
      current: false,
      dutiesFacts: [""]
    };
  }

  function blankEdu() {
    return {
      id: uid("edu"),
      institution: "",
      credential: "",
      year: "",
      notes: ""
    };
  }

  function deriveStatus(item) {
    if (item.attestedTrue) return "attested";
    if ((item.learnerEdited || "").trim()) return "learner_edited";
    return "ai_draft";
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return emptyResume();
      var data = JSON.parse(raw);
      if (!data || data.schemaVersion !== SCHEMA_VERSION) return emptyResume();
      return data;
    } catch (e) {
      return emptyResume();
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function lines(text) {
    return (text || "")
      .split(/\n/)
      .map(function (s) { return s.replace(/^[\s•\-]+/, "").trim(); })
      .filter(Boolean);
  }

  function factsFromWork(work) {
    var out = [];
    (work || []).forEach(function (w) {
      (w.dutiesFacts || []).forEach(function (f) {
        if (f && f.trim()) out.push(w.employer ? w.employer + ": " + f.trim() : f.trim());
      });
    });
    return out;
  }

  function buildPrompt(data, kind, question) {
    var facts = factsFromWork(data.workHistory);
    var skills = (data.skills || []).map(function (s) { return s.name; }).filter(Boolean);
    var edu = (data.education || [])
      .filter(function (e) { return e.institution; })
      .map(function (e) {
        return [e.credential, e.institution, e.year].filter(Boolean).join(", ");
      });
    var parts = [];
    parts.push("I am over 50. Write from the facts below only. Do not invent numbers, awards, software, or job titles I did not list. Do not give legal advice.");
    parts.push("Target job: " + (data.target.roleTitle || "(not filled in yet)"));
    if (data.target.goalStatement) parts.push("Goal: " + data.target.goalStatement);
    parts.push("Facts from my work:");
    if (facts.length) facts.forEach(function (f) { parts.push("- " + f); });
    else parts.push("- (no work facts yet — stop and tell me to add facts first)");
    if (edu.length) {
      parts.push("Education / credentials:");
      edu.forEach(function (e) { parts.push("- " + e); });
    }
    if (skills.length) parts.push("Skills I say I have: " + skills.join("; "));
    if (kind === "interview_answer") {
      parts.push("Write a short spoken interview answer (8–10 sentences max) to this question: " + (question || "Tell me about yourself."));
      parts.push("Use plain language. Sound like a person, not a brochure.");
    } else {
      parts.push("Write ONE resume bullet in plain language. One or two sentences. No buzzwords.");
    }
    return parts.join("\n");
  }

  function collectFactsForm(data) {
    data.metadata.site = val("site");
    data.metadata.sessionDate = val("sessionDate");
    data.metadata.cohortType = val("cohortType") || "job_seeker";
    data.identity.fullName = val("fullName");
    data.identity.preferredName = val("preferredName");
    data.identity.email = val("email");
    data.identity.phone = val("phone");
    data.identity.location.city = val("city");
    data.identity.location.region = val("region");
    data.target.roleTitle = val("roleTitle");
    data.target.goalStatement = val("goalStatement");
    data.target.industry = val("industry");
    data.workHistory = [];
    qsa("[data-work]").forEach(function (block) {
      data.workHistory.push({
        id: block.getAttribute("data-work") || uid("work"),
        employer: qs("[name=employer]", block).value.trim(),
        title: qs("[name=title]", block).value.trim(),
        startDate: qs("[name=startDate]", block).value.trim(),
        endDate: qs("[name=endDate]", block).value.trim(),
        current: qs("[name=current]", block).checked,
        dutiesFacts: lines(qs("[name=duties]", block).value)
      });
    });
    if (!data.workHistory.length) data.workHistory.push(blankWork());
    data.education = [];
    qsa("[data-edu]").forEach(function (block) {
      data.education.push({
        id: block.getAttribute("data-edu") || uid("edu"),
        institution: qs("[name=institution]", block).value.trim(),
        credential: qs("[name=credential]", block).value.trim(),
        year: qs("[name=year]", block).value.trim(),
        notes: qs("[name=eduNotes]", block).value.trim()
      });
    });
    if (!data.education.length) data.education.push(blankEdu());
    data.skills = lines(val("skills")).map(function (name) {
      return { name: name, learnerAttested: true };
    });
    return data;
  }

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }
  function setVal(id, v) {
    var el = document.getElementById(id);
    if (el) el.value = v || "";
  }

  function workHtml(w) {
    return (
      '<div class="block" data-work="' + w.id + '">' +
        '<div class="grid-2">' +
          '<div><label>Employer</label><input type="text" name="employer" value="' + esc(w.employer) + '" /></div>' +
          '<div><label>Job title</label><input type="text" name="title" value="' + esc(w.title) + '" /></div>' +
        '</div>' +
        '<div class="grid-2">' +
          '<div><label>Started (year or month)</label><input type="text" name="startDate" value="' + esc(w.startDate) + '" placeholder="2012" /></div>' +
          '<div><label>Ended</label><input type="text" name="endDate" value="' + esc(w.endDate) + '" placeholder="2024 or still there" /></div>' +
        '</div>' +
        '<label class="check"><input type="checkbox" name="current"' + (w.current ? " checked" : "") + ' /> I still work here</label>' +
        '<div><label>What I actually did (one fact per line)</label>' +
        '<textarea name="duties" placeholder="Opened the store four mornings a week">' + esc((w.dutiesFacts || []).join("\n")) + '</textarea></div>' +
        '<button type="button" class="btn secondary js-remove-work">Remove this job</button>' +
      '</div>'
    );
  }

  function eduHtml(e) {
    return (
      '<div class="block" data-edu="' + e.id + '">' +
        '<div class="grid-2">' +
          '<div><label>School or program</label><input type="text" name="institution" value="' + esc(e.institution) + '" /></div>' +
          '<div><label>Credential</label><input type="text" name="credential" value="' + esc(e.credential) + '" placeholder="Diploma, certificate…" /></div>' +
        '</div>' +
        '<div class="grid-2">' +
          '<div><label>Year</label><input type="text" name="year" value="' + esc(e.year) + '" /></div>' +
          '<div><label>Notes</label><input type="text" name="eduNotes" value="' + esc(e.notes) + '" /></div>' +
        '</div>' +
        '<button type="button" class="btn secondary js-remove-edu">Remove</button>' +
      '</div>'
    );
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fillFacts(data) {
    setVal("site", data.metadata.site);
    setVal("sessionDate", data.metadata.sessionDate);
    setVal("cohortType", data.metadata.cohortType);
    setVal("fullName", data.identity.fullName);
    setVal("preferredName", data.identity.preferredName);
    setVal("email", data.identity.email);
    setVal("phone", data.identity.phone);
    setVal("city", data.identity.location.city);
    setVal("region", data.identity.location.region);
    setVal("roleTitle", data.target.roleTitle);
    setVal("goalStatement", data.target.goalStatement);
    setVal("industry", data.target.industry);
    qs("#workList").innerHTML = (data.workHistory.length ? data.workHistory : [blankWork()]).map(workHtml).join("");
    qs("#eduList").innerHTML = (data.education.length ? data.education : [blankEdu()]).map(eduHtml).join("");
    setVal("skills", (data.skills || []).map(function (s) { return s.name; }).join("\n"));
  }

  function badgeClass(status) {
    if (status === "attested") return "attested";
    if (status === "learner_edited") return "edited";
    return "draft";
  }

  function badgeLabel(status) {
    if (status === "attested") return "You said this is true";
    if (status === "learner_edited") return "You edited — not attested yet";
    return "AI draft only — not true yet";
  }

  function renderDerived(data) {
    var all = (data.resumeBullets || []).concat(data.interviewAnswers || []);
    var box = qs("#savedList");
    if (!all.length) {
      box.innerHTML = "<p class=\"lead\">Nothing saved yet. Copy the ask, paste the draft, then edit it.</p>";
      return;
    }
    box.innerHTML = all.map(function (item) {
      var st = deriveStatus(item);
      return (
        '<div class="item">' +
          '<span class="badge ' + badgeClass(st) + '">' + badgeLabel(st) + "</span>" +
          (item.prompt ? "<p><strong>Ask:</strong> " + esc(item.prompt) + "</p>" : "") +
          "<p><strong>AI draft:</strong> " + esc(item.aiDraft || "—") + "</p>" +
          "<p><strong>Your words:</strong> " + esc(item.learnerEdited || "—") + "</p>" +
        "</div>"
      );
    }).join("");
  }

  function showStep(n) {
    qsa(".panel").forEach(function (p) {
      p.hidden = p.getAttribute("data-step") !== String(n);
    });
    qsa(".nav button").forEach(function (b) {
      if (b.getAttribute("data-go") === String(n)) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
    });
    qsa(".steps span").forEach(function (s, i) {
      s.classList.toggle("on", i <= n);
    });
    window.scrollTo(0, 0);
  }

  function persistFromFacts() {
    var data = collectFactsForm(load());
    save(data);
    return data;
  }

  function refreshPrompt() {
    var data = persistFromFacts();
    var kind = qs("#draftKind").value;
    var q = val("interviewQ");
    qs("#promptBox").textContent = buildPrompt(data, kind, q);
  }

  function downloadJson(data) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resume-object.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  var data = load();

  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (t.matches("[data-go]")) {
      persistFromFacts();
      showStep(Number(t.getAttribute("data-go")));
      if (t.getAttribute("data-go") === "1") refreshPrompt();
      if (t.getAttribute("data-go") === "2") {
        renderDerived(load());
        qs("#jsonView").textContent = JSON.stringify(load(), null, 2);
      }
    }
    if (t.id === "addWork") {
      persistFromFacts();
      var d = load();
      d.workHistory.push(blankWork());
      save(d);
      fillFacts(d);
    }
    if (t.id === "addEdu") {
      persistFromFacts();
      var d2 = load();
      d2.education.push(blankEdu());
      save(d2);
      fillFacts(d2);
    }
    if (t.classList.contains("js-remove-work")) {
      t.closest("[data-work]").remove();
      persistFromFacts();
    }
    if (t.classList.contains("js-remove-edu")) {
      t.closest("[data-edu]").remove();
      persistFromFacts();
    }
    if (t.id === "copyPrompt") {
      refreshPrompt();
      var text = qs("#promptBox").textContent;
      function ok() { qs("#copied").hidden = false; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok).catch(ok);
      } else { ok(); }
    }
    if (t.id === "saveDraft") {
      var d3 = persistFromFacts();
      var kind = qs("#draftKind").value;
      var ai = val("aiDraft");
      var edited = val("learnerEdited");
      var attested = qs("#attest").checked;
      var err = qs("#draftErr");
      err.hidden = true;
      if (!factsFromWork(d3.workHistory).length) {
        err.textContent = "Add at least one work fact first. AI should not invent your job.";
        err.hidden = false;
        showStep(0);
        return;
      }
      if (!ai.trim()) {
        err.textContent = "Paste the AI draft first, then write it in your own words.";
        err.hidden = false;
        return;
      }
      if (attested && !edited.trim()) {
        err.textContent = "You must edit it in your words before you can say it is true.";
        err.hidden = false;
        qs("#attest").checked = false;
        return;
      }
      if (attested && edited.trim() === ai.trim()) {
        err.textContent = "Change at least one phrase. Do not paste the draft as if it were already true.";
        err.hidden = false;
        qs("#attest").checked = false;
        return;
      }
      var item = {
        id: uid(kind === "interview_answer" ? "interview" : "bullet"),
        kind: kind,
        prompt: kind === "interview_answer" ? (val("interviewQ") || "Tell me about yourself.") : "Write one resume bullet from these facts only.",
        sourceWorkIds: d3.workHistory.map(function (w) { return w.id; }),
        sourceFacts: factsFromWork(d3.workHistory),
        aiDraft: ai,
        learnerEdited: edited,
        attestedTrue: !!attested,
        attestedAt: attested ? new Date().toISOString() : null
      };
      item.status = deriveStatus(item);
      if (kind === "interview_answer") d3.interviewAnswers.push(item);
      else d3.resumeBullets.push(item);
      save(d3);
      qs("#aiDraft").value = "";
      qs("#learnerEdited").value = "";
      qs("#attest").checked = false;
      qs("#savedNote").hidden = false;
      renderDerived(d3);
    }
    if (t.id === "download") {
      persistFromFacts();
      downloadJson(load());
    }
    if (t.id === "loadExample") {
      fetch("examples/pat-rivera-job-seeker.json")
        .then(function (r) { return r.json(); })
        .then(function (ex) {
          save(ex);
          fillFacts(ex);
          renderDerived(ex);
          qs("#jsonView").textContent = JSON.stringify(ex, null, 2);
        })
        .catch(function () {
          qs("#exampleErr").hidden = false;
        });
    }
    if (t.id === "reset") {
      if (window.confirm("Clear this room’s file and start blank?")) {
        save(emptyResume());
        fillFacts(emptyResume());
        renderDerived(emptyResume());
        qs("#jsonView").textContent = JSON.stringify(emptyResume(), null, 2);
      }
    }
  });

  document.addEventListener("change", function (ev) {
    if (ev.target.id === "draftKind" || ev.target.id === "interviewQ") refreshPrompt();
    qs("#interviewWrap").hidden = qs("#draftKind").value !== "interview_answer";
  });

  fillFacts(data);
  renderDerived(data);
  if (qs("#jsonView")) qs("#jsonView").textContent = JSON.stringify(data, null, 2);
  var hashStep = { facts: 0, ask: 1, edit: 2, file: 3 }[(location.hash || "").replace(/^#/, "").toLowerCase()];
  showStep(typeof hashStep === "number" ? hashStep : 0);
  if (hashStep === 1) refreshPrompt();
  if (hashStep === 2 || hashStep === 3) {
    renderDerived(load());
    if (qs("#jsonView")) qs("#jsonView").textContent = JSON.stringify(load(), null, 2);
  }
})();
