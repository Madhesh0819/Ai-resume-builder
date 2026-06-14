const fields = {
  fullName: document.querySelector("#fullName"),
  targetRole: document.querySelector("#targetRole"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  location: document.querySelector("#location"),
  links: document.querySelector("#links"),
  summary: document.querySelector("#summary"),
  company: document.querySelector("#company"),
  wins: document.querySelector("#wins"),
  education: document.querySelector("#education"),
  skills: document.querySelector("#skills"),
  keywords: document.querySelector("#keywords")
};

const preview = {
  resume: document.querySelector("#resumePreview"),
  summary: document.querySelector("#previewSummary"),
  role: document.querySelector("#previewRole"),
  company: document.querySelector("#previewCompany"),
  bullets: document.querySelector("#previewBullets"),
  skills: document.querySelector("#previewSkills"),
  education: document.querySelector("#previewEducation"),
  score: document.querySelector("#score"),
  scoreFill: document.querySelector("#scoreFill"),
  scoreNote: document.querySelector("#scoreNote"),
  suggestions: document.querySelector("#suggestions")
};

const strongVerbs = ["Led", "Launched", "Improved", "Reduced", "Built", "Created", "Optimized", "Delivered"];

function textLines(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasNumber(text) {
  return /\d/.test(text);
}

function titleCase(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildSummary() {
  const role = fields.targetRole.value.trim() || "Professional";
  const skills = textLines(fields.skills.value).slice(0, 3).join(", ");
  const keywords = textLines(fields.keywords.value).slice(0, 2).join(" and ");
  return `${titleCase(role)} with proven experience in ${skills || "cross-functional execution"} and a track record of turning ${keywords || "business priorities"} into measurable outcomes.`;
}

function buildBullets() {
  const wins = textLines(fields.wins.value);
  const role = fields.targetRole.value.trim() || "team";
  const company = fields.company.value.trim() || "the organization";

  if (!wins.length) {
    return [`Delivered high-impact ${role.toLowerCase()} initiatives for ${company} by aligning stakeholders, clarifying priorities, and improving execution quality.`];
  }

  return wins.slice(0, 5).map((win, index) => {
    const cleanWin = win.replace(/[.]+$/, "");
    const startsStrong = strongVerbs.some((verb) => cleanWin.toLowerCase().startsWith(verb.toLowerCase()));
    const verb = startsStrong ? "" : `${strongVerbs[index % strongVerbs.length]} `;
    const metric = hasNumber(cleanWin) ? "" : " with clear ownership, measurable milestones, and documented results";
    return `${verb}${cleanWin}${metric}.`;
  });
}

function calculateScore() {
  const keywords = textLines(fields.keywords.value).map((word) => word.toLowerCase());
  const resumeText = [
    fields.summary.value,
    fields.wins.value,
    fields.skills.value,
    fields.targetRole.value
  ].join(" ").toLowerCase();
  const matched = keywords.filter((word) => resumeText.includes(word)).length;
  const keywordScore = keywords.length ? Math.round((matched / keywords.length) * 34) : 24;
  const metricScore = hasNumber(fields.wins.value) ? 22 : 8;
  const lengthScore = fields.summary.value.length > 80 && fields.wins.value.length > 80 ? 24 : 14;
  const contactScore = fields.email.value && fields.phone.value && fields.location.value ? 20 : 10;
  return Math.min(100, keywordScore + metricScore + lengthScore + contactScore);
}

function scoreNote(score) {
  if (score >= 88) return "Excellent match. Your resume has strong keywords, measurable wins, and complete contact details.";
  if (score >= 72) return "Strong match. Add one more measurable result for a sharper score.";
  if (score >= 55) return "Good start. Add job-description keywords and numbers to make the story stronger.";
  return "Needs polish. Add role keywords, quantified wins, and a concise summary.";
}

function buildSuggestions(score) {
  const suggestions = [];
  if (!hasNumber(fields.wins.value)) {
    suggestions.push(["Add measurable proof", "Include numbers such as revenue, time saved, growth rate, cost reduction, or team size."]);
  }
  if (textLines(fields.keywords.value).length < 5) {
    suggestions.push(["Paste more keywords", "Use 6-10 terms from the job description so the resume mirrors the target role."]);
  }
  if (fields.summary.value.length < 100) {
    suggestions.push(["Sharpen the summary", "Mention your role, specialty, audience, and a clear outcome in two focused lines."]);
  }
  if (score >= 88) {
    suggestions.push(["Ready for tailoring", "Duplicate this version and tune the keywords for each job you apply to."]);
  }
  suggestions.push(["Use active language", "Start bullets with verbs like led, improved, launched, reduced, owned, or delivered."]);
  return suggestions.slice(0, 4);
}

function renderSuggestions(items) {
  preview.suggestions.innerHTML = "";
  items.forEach(([title, body]) => {
    const card = document.createElement("div");
    card.className = "suggestion";
    const heading = document.createElement("strong");
    const copy = document.createElement("p");
    heading.textContent = title;
    copy.textContent = body;
    card.append(heading, copy);
    preview.suggestions.appendChild(card);
  });
}

function renderContact(contact, links) {
  const contactNode = preview.resume.querySelector(".contact");
  contactNode.textContent = contact || "email | phone | location";
  if (links) {
    contactNode.appendChild(document.createElement("br"));
    contactNode.appendChild(document.createTextNode(links));
  }
}

function renderLineBreakText(node, lines, fallback) {
  node.textContent = "";
  const safeLines = lines.length ? lines : [fallback];
  safeLines.forEach((line, index) => {
    if (index) node.appendChild(document.createElement("br"));
    node.appendChild(document.createTextNode(line));
  });
}

function renderResume(useGeneratedCopy = false) {
  const fullName = fields.fullName.value.trim() || "Your Name";
  const role = fields.targetRole.value.trim() || "Target Role";
  const contact = [fields.email.value, fields.phone.value, fields.location.value].filter(Boolean).join(" | ");
  const links = fields.links.value.trim();
  const summary = useGeneratedCopy ? buildSummary() : fields.summary.value.trim();
  const bullets = useGeneratedCopy ? buildBullets() : buildBullets();
  const score = calculateScore();

  preview.resume.querySelector("h2").textContent = fullName;
  preview.resume.querySelector(".role").textContent = role;
  renderContact(contact, links);
  preview.summary.textContent = summary || buildSummary();
  preview.role.textContent = role;
  preview.company.textContent = fields.company.value.trim() || "Company";
  preview.skills.textContent = fields.skills.value.trim() || "Add skills that match your target role.";
  renderLineBreakText(preview.education, textLines(fields.education.value), "Add education or certifications.");
  preview.bullets.innerHTML = "";
  bullets.forEach((bullet) => {
    const li = document.createElement("li");
    li.textContent = bullet;
    preview.bullets.appendChild(li);
  });

  preview.score.textContent = score;
  preview.scoreFill.style.width = `${score}%`;
  preview.scoreNote.textContent = scoreNote(score);
  renderSuggestions(buildSuggestions(score));

  if (useGeneratedCopy) {
    fields.summary.value = summary;
  }
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.panel}`).classList.add("active");
  });
});

document.querySelectorAll(".swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((item) => item.classList.remove("active"));
    swatch.classList.add("active");
    preview.resume.className = `resume theme-${swatch.dataset.theme}`;
  });
});

Object.values(fields).forEach((field) => {
  field.addEventListener("input", () => renderResume(false));
});

document.querySelector("#generateBtn").addEventListener("click", () => renderResume(true));
document.querySelector("#printBtn").addEventListener("click", () => window.print());

renderResume(false);
