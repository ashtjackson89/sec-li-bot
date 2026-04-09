import React, { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "sec-li-bot-workspace:v3";

const TOPIC_LIBRARY = {
  "Strategy and Leadership": [
    "Executive Leadership",
    "Board Advisory",
    "Organisational Change",
    "Strategic Foresight",
    "Operating Model Design",
  ],
  "Defence and National Security": [
    "Cyber Defence",
    "Intelligence",
    "Space Capability",
    "Procurement Reform",
    "Mission Delivery",
  ],
  "Digital Transformation": [
    "Digital Programme Delivery",
    "Enterprise Architecture",
    "Cloud Strategy",
    "Data and AI",
    "Technology Modernisation",
  ],
  "Cyber Security and GRC": [
    "Cyber Risk",
    "Zero Trust",
    "Governance Frameworks",
    "Threat Intelligence",
    "Regulatory Compliance",
  ],
  "Consulting and Growth": [
    "Client Outcomes",
    "Business Development",
    "Fractional C-Suite",
    "Consulting Insight",
    "SME Growth",
  ],
};

const TONES = [
  "Authoritative",
  "Analytical",
  "Conversational",
  "Strategic",
  "Provocative",
  "Reflective",
];

const FORMATS = [
  "Insight plus hook",
  "Operator note",
  "Framework share",
  "Lessons from delivery",
  "Question led post",
  "Industry reaction",
];

const AUDIENCES = [
  "C-suite",
  "Board and advisers",
  "Programme leadership",
  "Security leadership",
  "Defence stakeholders",
  "Consulting buyers",
];

const OBJECTIVES = [
  "Brand authority",
  "Pipeline growth",
  "Network engagement",
  "Market education",
  "Trust building",
];

const POSTING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const SEED_INTEL = [
  {
    id: "intel-001",
    headline: "Boards are asking for clearer cyber resilience narratives before budget sign-off.",
    source: "Operator signal",
    relevance: "Strong hook for linking governance quality to investment confidence.",
    topic: "Cyber Risk",
    freshness: "Seeded",
  },
  {
    id: "intel-002",
    headline: "Transformation programmes are being challenged earlier on evidence of adoption, not just delivery milestones.",
    source: "Client pattern",
    relevance: "Useful for posts on delivery discipline, adoption and executive assurance.",
    topic: "Digital Programme Delivery",
    freshness: "Seeded",
  },
  {
    id: "intel-003",
    headline: "Leaders want assurance packs that translate technical control language into operational risk decisions.",
    source: "Adviser note",
    relevance: "Connects cyber, board reporting and real-world decision making.",
    topic: "Governance Frameworks",
    freshness: "Seeded",
  },
  {
    id: "intel-004",
    headline: "Complex programmes are revisiting escalation thresholds after late-stage surprises on supplier readiness.",
    source: "Delivery review",
    relevance: "Good source angle for delivery governance and procurement reform content.",
    topic: "Procurement Reform",
    freshness: "Seeded",
  },
  {
    id: "intel-005",
    headline: "Senior stakeholders are prioritising narrative clarity over slide volume when testing strategic decisions.",
    source: "Executive workshop",
    relevance: "Supports posts about clarity, leadership and message discipline.",
    topic: "Executive Leadership",
    freshness: "Seeded",
  },
  {
    id: "intel-006",
    headline: "Security leaders are under pressure to show where assurance activity changes delivery outcomes.",
    source: "Market signal",
    relevance: "Useful for content on assurance, accountability and measurable impact.",
    topic: "Threat Intelligence",
    freshness: "Seeded",
  },
];

const ROADMAP_PHASES = [
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "Foundation and Voice Design",
    window: "Weeks 1-2",
    status: "Live",
    summary: "Profile capture, topic taxonomy, guardrails and local persistence.",
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "Intel and Prompt Studio",
    window: "Weeks 3-4",
    status: "Live",
    summary: "Intel workspace, prompt pack preview, variant generation and quality scoring.",
  },
  {
    id: "phase-3",
    phase: "Phase 3",
    title: "Workflow and Publishing",
    window: "Weeks 5-6",
    status: "Live",
    summary: "Review queue, scheduling, LinkedIn connector stub and export controls.",
  },
  {
    id: "phase-4",
    phase: "Phase 4",
    title: "Learning and Optimisation",
    window: "Weeks 7-8",
    status: "Next",
    summary: "Performance feedback loops, source weighting and campaign analytics.",
  },
];

const BACKLOG_ITEMS = [
  { id: "SEC-101", epic: "Foundation", title: "Persist strategy profile and guardrails locally", priority: "P1", status: "Done", points: 3 },
  { id: "SEC-102", epic: "UX", title: "Create an operator dashboard with workflow metrics", priority: "P1", status: "Done", points: 5 },
  { id: "SEC-103", epic: "Prompting", title: "Build prompt pack preview and copy workflow", priority: "P1", status: "Done", points: 5 },
  { id: "SEC-104", epic: "Guardrails", title: "Score drafts against tone, length and compliance heuristics", priority: "P1", status: "Done", points: 5 },
  { id: "SEC-105", epic: "Intel", title: "Add seeded and manual intel capture workspace", priority: "P2", status: "Done", points: 3 },
  { id: "SEC-106", epic: "Workflow", title: "Support draft queueing, scheduling and publish state changes", priority: "P2", status: "Done", points: 5 },
  { id: "SEC-107", epic: "Integration", title: "Support webhook-based generation for a future backend", priority: "P2", status: "Done", points: 3 },
  { id: "SEC-108", epic: "Optimisation", title: "Capture post outcomes and feed performance back into topic planning", priority: "P2", status: "Next", points: 8 },
];

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "against",
  "almost",
  "also",
  "among",
  "because",
  "before",
  "being",
  "between",
  "could",
  "every",
  "first",
  "found",
  "great",
  "have",
  "into",
  "just",
  "more",
  "most",
  "much",
  "other",
  "over",
  "really",
  "should",
  "their",
  "there",
  "these",
  "thing",
  "those",
  "through",
  "under",
  "using",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
]);

const DEFAULT_STATE = {
  profile: {
    name: "Ash",
    brand: "Strategic Edge Consulting",
    role: "Founder and adviser",
    voice:
      "Senior defence and technology professional. Speaks plainly, leads with evidence, and connects governance choices to delivery outcomes.",
    corePromise:
      "Help leaders translate security, digital change and delivery risk into clear executive action.",
    topics: ["Cyber Defence", "Digital Programme Delivery", "Cyber Risk", "Executive Leadership"],
    postingDays: ["Tue", "Thu"],
  },
  brief: {
    campaign: "Q2 Authority Build",
    objective: "Brand authority",
    audience: "C-suite",
    tone: "Authoritative",
    format: "Insight plus hook",
    angle:
      "Show how better governance changes delivery outcomes rather than simply improving reporting optics.",
    evidence:
      "Ground the post in operator judgement, current market signals and practical delivery lessons.",
    cta: "What would you challenge or add from your own operating context?",
    selectedTopics: ["Cyber Defence", "Digital Programme Delivery", "Cyber Risk"],
    selectedIntelIds: ["intel-001", "intel-002"],
    includeSourceMention: true,
  },
  guardrails: {
    minWords: 170,
    maxWords: 320,
    hashtagMin: 3,
    hashtagMax: 5,
    maxEmoji: 1,
    requireCta: true,
    banFirstWordI: true,
    bannedPhrases: ["thought leader", "game changer", "disruptive synergy", "leverage AI"],
    bannedClaims: ["guarantee", "always", "never", "100%", "zero risk"],
  },
  integrations: {
    aiMode: "demo",
    webhookUrl: "",
    apiKey: "",
    model: "",
    linkedinToken: "",
    linkedinUrn: "",
    persistSecrets: false,
  },
  intel: SEED_INTEL,
  drafts: [],
  selectedDraftId: null,
  queue: [],
};

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function normaliseWorkspace(candidate = {}) {
  return {
    ...DEFAULT_STATE,
    ...candidate,
    profile: {
      ...DEFAULT_STATE.profile,
      ...(candidate.profile || {}),
      topics: Array.isArray(candidate.profile?.topics) ? candidate.profile.topics : DEFAULT_STATE.profile.topics,
      postingDays: Array.isArray(candidate.profile?.postingDays)
        ? candidate.profile.postingDays
        : DEFAULT_STATE.profile.postingDays,
    },
    brief: {
      ...DEFAULT_STATE.brief,
      ...(candidate.brief || {}),
      selectedTopics: Array.isArray(candidate.brief?.selectedTopics)
        ? candidate.brief.selectedTopics
        : DEFAULT_STATE.brief.selectedTopics,
      selectedIntelIds: Array.isArray(candidate.brief?.selectedIntelIds)
        ? candidate.brief.selectedIntelIds
        : DEFAULT_STATE.brief.selectedIntelIds,
    },
    guardrails: {
      ...DEFAULT_STATE.guardrails,
      ...(candidate.guardrails || {}),
      bannedPhrases: Array.isArray(candidate.guardrails?.bannedPhrases)
        ? candidate.guardrails.bannedPhrases
        : DEFAULT_STATE.guardrails.bannedPhrases,
      bannedClaims: Array.isArray(candidate.guardrails?.bannedClaims)
        ? candidate.guardrails.bannedClaims
        : DEFAULT_STATE.guardrails.bannedClaims,
    },
    integrations: {
      ...DEFAULT_STATE.integrations,
      ...(candidate.integrations || {}),
    },
    intel: Array.isArray(candidate.intel) ? candidate.intel : DEFAULT_STATE.intel,
    drafts: Array.isArray(candidate.drafts) ? candidate.drafts : DEFAULT_STATE.drafts,
    queue: Array.isArray(candidate.queue) ? candidate.queue : DEFAULT_STATE.queue,
    selectedDraftId: candidate.selectedDraftId || null,
  };
}

function readStoredWorkspace() {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STATE;
    }

    return normaliseWorkspace(JSON.parse(raw));
  } catch {
    return DEFAULT_STATE;
  }
}

function sanitiseWorkspaceForStorage(workspace) {
  const safe = normaliseWorkspace(workspace);

  if (!safe.integrations.persistSecrets) {
    safe.integrations = {
      ...safe.integrations,
      apiKey: "",
      linkedinToken: "",
    };
  }

  return safe;
}

function toTitleCase(value) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function parseDelimitedList(value) {
  return value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function formatWhen(value) {
  if (!value) {
    return "Not scheduled";
  }

  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function formatShortDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) {
    return value;
  }

  return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function countValues(values) {
  return values.reduce((accumulator, value) => {
    accumulator[value] = (accumulator[value] || 0) + 1;
    return accumulator;
  }, {});
}

function extractKeywords(text, limit = 12) {
  const words =
    text
      .toLowerCase()
      .match(/[a-z][a-z-]{3,}/g)
      ?.filter((word) => !STOP_WORDS.has(word)) || [];
  const counts = countValues(words);

  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function makeHashtags(topics, max) {
  return topics
    .slice(0, max)
    .map((topic) => `#${topic.replace(/[^A-Za-z0-9]+/g, "")}`)
    .join(" ");
}

function buildPromptPack(workspace, selectedIntelItems) {
  const { profile, brief, guardrails } = workspace;
  const selectedTopics = brief.selectedTopics.length ? brief.selectedTopics : profile.topics;
  const intelSection = selectedIntelItems.length
    ? selectedIntelItems
        .map(
          (item, index) =>
            `${index + 1}. ${item.headline} | Source: ${item.source} | Why it matters: ${item.relevance}`,
        )
        .join("\n")
    : "No source items selected. Write from operator insight and practical delivery experience.";

  const system = [
    `You are the LinkedIn ghostwriter for ${profile.name} at ${profile.brand}.`,
    `Role context: ${profile.role}.`,
    `Voice profile: ${profile.voice}`,
    `Strategic promise: ${profile.corePromise}`,
    `Tone: ${brief.tone}. Format: ${brief.format}. Audience: ${brief.audience}. Objective: ${brief.objective}.`,
    `The post must feel credible, practical and commercially mature.`,
    guardrails.banFirstWordI ? 'Do not begin the post with "I".' : "Beginning with first person is allowed.",
    guardrails.requireCta ? "Finish with a subtle invitation to discuss, compare notes or challenge the view." : "A CTA is optional.",
    `Keep the post between ${guardrails.minWords} and ${guardrails.maxWords} words.`,
    `Use ${guardrails.hashtagMin}-${guardrails.hashtagMax} relevant hashtags.`,
    `Avoid these phrases: ${guardrails.bannedPhrases.join(", ")}.`,
    `Avoid these high-risk claims: ${guardrails.bannedClaims.join(", ")}.`,
  ].join("\n");

  const user = [
    `Campaign: ${brief.campaign}`,
    `Primary angle: ${brief.angle}`,
    `Evidence guidance: ${brief.evidence}`,
    `Selected topics: ${selectedTopics.join(", ")}`,
    brief.includeSourceMention ? "Reference at least one selected source signal explicitly." : "A direct source mention is optional.",
    `Sources:\n${intelSection}`,
    `Preferred CTA line: ${brief.cta}`,
    "Return three distinct post variants. Each should be complete and publication ready.",
  ].join("\n\n");

  return {
    system,
    user,
    combined: `SYSTEM\n${system}\n\nUSER\n${user}`,
  };
}

function createIntelPulse(topics) {
  const workingTopics = topics.length ? topics : DEFAULT_STATE.profile.topics;
  const templates = [
    {
      headline: (topic) => `${topic} leaders are tightening decision gates before programmes scale further.`,
      relevance: "Good angle for showing how stronger governance changes delivery confidence.",
    },
    {
      headline: (topic) => `More executive teams are asking how ${topic} activity affects real operating risk.`,
      relevance: "Useful for posts that connect assurance work to commercial and operational decisions.",
    },
    {
      headline: (topic) => `Stakeholders want simpler narratives around ${topic}, not more reporting volume.`,
      relevance: "Useful for content on message discipline, leadership clarity and executive communication.",
    },
    {
      headline: (topic) => `Late-stage surprises in ${topic} are pushing teams to test assumptions earlier.`,
      relevance: "Good for practical posts about delivery cadence, evidence and intervention timing.",
    },
  ];

  return templates.map((template, index) => {
    const topic = workingTopics[index % workingTopics.length];

    return {
      id: createId("intel"),
      headline: template.headline(topic),
      source: "Workspace scan",
      relevance: template.relevance,
      topic,
      freshness: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  });
}

function createDemoDrafts(workspace, selectedIntelItems) {
  const { profile, brief, guardrails } = workspace;
  const topics = brief.selectedTopics.length ? brief.selectedTopics : profile.topics;
  const mainTopic = topics[0] || "strategic delivery";
  const secondTopic = topics[1] || "cyber resilience";
  const thirdTopic = topics[2] || "leadership";
  const sourceLead = selectedIntelItems[0];
  const sourceText = sourceLead
    ? `${sourceLead.source} notes that ${sourceLead.headline.toLowerCase()}`
    : `Across recent delivery conversations, the consistent signal is that ${mainTopic.toLowerCase()} decisions are being judged on impact, not intent.`;
  const hashtags = makeHashtags(topics, guardrails.hashtagMax || 4);

  return [
    {
      title: "Board Brief",
      text: [
        "Most delivery problems are visible long before the status turns red.",
        `${sourceText} That matters because leaders are no longer rewarding activity for its own sake. They want to know which decisions improve outcomes, reduce uncertainty and keep programmes credible under pressure.`,
        `For ${brief.audience.toLowerCase()} teams, the practical shift is simple: connect ${mainTopic.toLowerCase()} to decision quality, connect ${secondTopic.toLowerCase()} to delivery confidence, and connect ${thirdTopic.toLowerCase()} to accountability rather than rhetoric.`,
        `That is why the strongest operating teams now tighten evidence thresholds earlier. They ask what has changed, what has been tested, and what would force a decision to move from reassurance into intervention.`,
        `Good governance is not a reporting layer. It is a delivery tool when it changes the quality and timing of executive action.`,
        brief.cta,
        hashtags,
      ].join("\n\n"),
    },
    {
      title: "Operator Note",
      text: [
        "The quality of leadership shows up in the questions a team asks before pressure arrives.",
        `${sourceText} In practice, that means mature teams are moving the conversation away from broad optimism and towards evidence that can survive challenge.`,
        `Three checks tend to separate strong delivery cultures from noisy ones.`,
        `1. They can explain how ${mainTopic.toLowerCase()} decisions alter risk, not just activity.`,
        `2. They can show where ${secondTopic.toLowerCase()} is influencing delivery confidence, budget confidence and stakeholder confidence at the same time.`,
        `3. They can describe what governance will do next if the evidence moves the wrong way.`,
        `That kind of clarity is commercially useful because it creates trust. It also makes content stronger on LinkedIn, because audiences respond to judgement they can apply rather than slogans they have already heard.`,
        brief.cta,
        hashtags,
      ].join("\n\n"),
    },
    {
      title: "Market Reaction",
      text: [
        `If a post about ${mainTopic.toLowerCase()} only describes activity, it will struggle to land with senior readers.`,
        `${sourceText} The real story is not the headline itself. The real story is what leaders should do differently once that signal appears.`,
        `That is where a better LinkedIn content engine becomes valuable. It should turn weak signals into a clear point of view, show why ${secondTopic.toLowerCase()} matters beyond the technical layer, and anchor the argument in delivery lessons that decision-makers recognise instantly.`,
        `Posts built this way do more than attract engagement. They strengthen authority because they frame action clearly: what to test sooner, what to report differently, and where leadership attention needs to move next.`,
        `Content becomes more credible when it sounds like someone who has carried delivery accountability, not someone summarising trends from a safe distance.`,
        brief.cta,
        hashtags,
      ].join("\n\n"),
    },
  ];
}

async function generateFromWebhook(workspace, promptPack, selectedIntelItems) {
  const { webhookUrl, apiKey, model } = workspace.integrations;

  if (!webhookUrl) {
    throw new Error("Webhook mode selected without a URL.");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model,
      promptPack,
      brief: workspace.brief,
      profile: workspace.profile,
      guardrails: workspace.guardrails,
      intel: selectedIntelItems,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}.`);
  }

  const payload = await response.json();
  const rawDrafts = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.drafts)
      ? payload.drafts
      : Array.isArray(payload.variants)
        ? payload.variants
        : [];

  const drafts = rawDrafts
    .map((draft, index) => ({
      title: draft.title || `Variant ${index + 1}`,
      text: draft.text || draft.content || "",
    }))
    .filter((draft) => draft.text.trim());

  if (!drafts.length) {
    throw new Error("Webhook returned no usable drafts.");
  }

  return drafts.slice(0, 3);
}

function evaluateDraft(text, workspace, selectedIntelItems, previousDrafts) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const hashtags = text.match(/#[A-Za-z0-9_]+/g) || [];
  const emojiCount = (text.match(/[\u{1F300}-\u{1FAFF}]/gu) || []).length;
  const firstWord = (text.match(/\b[\w'-]+\b/) || [""])[0].toLowerCase();
  const lower = text.toLowerCase();
  const findings = [];
  let score = 100;

  if (words < workspace.guardrails.minWords) {
    score -= 12;
    findings.push({
      tone: "warn",
      label: "Draft is shorter than the target range",
      detail: `${words} words against a minimum of ${workspace.guardrails.minWords}.`,
    });
  } else if (words > workspace.guardrails.maxWords) {
    score -= 10;
    findings.push({
      tone: "warn",
      label: "Draft is longer than the target range",
      detail: `${words} words against a maximum of ${workspace.guardrails.maxWords}.`,
    });
  } else {
    findings.push({
      tone: "pass",
      label: "Length is within range",
      detail: `${words} words.`,
    });
  }

  if (hashtags.length < workspace.guardrails.hashtagMin || hashtags.length > workspace.guardrails.hashtagMax) {
    score -= 8;
    findings.push({
      tone: "warn",
      label: "Hashtag count needs adjustment",
      detail: `${hashtags.length} hashtags used. Target is ${workspace.guardrails.hashtagMin}-${workspace.guardrails.hashtagMax}.`,
    });
  } else {
    findings.push({
      tone: "pass",
      label: "Hashtag count is on target",
      detail: `${hashtags.length} hashtags.`,
    });
  }

  if (workspace.guardrails.banFirstWordI && firstWord === "i") {
    score -= 10;
    findings.push({
      tone: "fail",
      label: "Opening violates first-word guardrail",
      detail: 'The post currently begins with "I".',
    });
  }

  if (workspace.guardrails.requireCta) {
    const lastParagraph = text
      .trim()
      .split(/\n{2,}/)
      .filter(Boolean)
      .slice(-2)
      .join(" ")
      .toLowerCase();
    const ctaMarkers = ["what would you", "how are you", "where do you", "compare notes", "challenge", "?"];
    const hasCta = ctaMarkers.some((marker) => lastParagraph.includes(marker));
    if (!hasCta) {
      score -= 8;
      findings.push({
        tone: "warn",
        label: "CTA is weak or missing",
        detail: "The final section does not clearly invite discussion.",
      });
    } else {
      findings.push({
        tone: "pass",
        label: "CTA present",
        detail: "The ending invites response or challenge.",
      });
    }
  }

  if (emojiCount > workspace.guardrails.maxEmoji) {
    score -= 6;
    findings.push({
      tone: "warn",
      label: "Emoji count is higher than the tone profile allows",
      detail: `${emojiCount} emoji detected against a maximum of ${workspace.guardrails.maxEmoji}.`,
    });
  }

  const bannedPhrasesUsed = workspace.guardrails.bannedPhrases.filter((phrase) =>
    lower.includes(phrase.toLowerCase()),
  );
  if (bannedPhrasesUsed.length) {
    score -= 12;
    findings.push({
      tone: "fail",
      label: "Banned phrases detected",
      detail: bannedPhrasesUsed.join(", "),
    });
  }

  const riskyClaims = workspace.guardrails.bannedClaims.filter((phrase) =>
    lower.includes(phrase.toLowerCase()),
  );
  if (riskyClaims.length) {
    score -= 10;
    findings.push({
      tone: "warn",
      label: "High-risk certainty language detected",
      detail: riskyClaims.join(", "),
    });
  }

  if (selectedIntelItems.length && workspace.brief.includeSourceMention) {
    const sourceMentioned = selectedIntelItems.some((item) => {
      const sourceWord = item.source.toLowerCase();
      const signalWord = item.headline
        .toLowerCase()
        .split(/\W+/)
        .find((word) => word.length > 6);
      return lower.includes(sourceWord) || (signalWord ? lower.includes(signalWord) : false);
    });

    if (!sourceMentioned) {
      score -= 8;
      findings.push({
        tone: "warn",
        label: "Selected intel is not clearly referenced",
        detail: "Consider naming a source or signal directly to strengthen credibility.",
      });
    } else {
      findings.push({
        tone: "pass",
        label: "Selected intel is referenced",
        detail: "The draft appears grounded in the chosen source material.",
      });
    }
  }

  const currentKeywords = extractKeywords(text);
  const historicalKeywords = previousDrafts.flatMap((draft) => draft.keywords || []);
  const overlap = currentKeywords.filter((keyword) => historicalKeywords.includes(keyword));
  if (overlap.length >= 5) {
    score -= 8;
    findings.push({
      tone: "warn",
      label: "Repetition risk is rising",
      detail: `Overlapping keywords: ${overlap.slice(0, 5).join(", ")}.`,
    });
  } else {
    findings.push({
      tone: "pass",
      label: "Repetition is under control",
      detail: "Keyword overlap with recent drafts is acceptable.",
    });
  }

  const paragraphCount = text.split(/\n+/).filter(Boolean).length;
  if (paragraphCount < 4) {
    score -= 6;
    findings.push({
      tone: "warn",
      label: "Formatting could be more scannable",
      detail: "Consider adding more paragraph breaks for LinkedIn readability.",
    });
  }

  return {
    score: clamp(score, 0, 100),
    findings,
    wordCount: words,
    hashtags,
    keywords: currentKeywords,
  };
}

function Panel({ title, subTitle, actions, children, className = "" }) {
  return (
    <section className={`panel ${className}`.trim()}>
      <div className="panel-head">
        <div>
          <div className="panel-title">{title}</div>
          {subTitle ? <div className="panel-subtitle">{subTitle}</div> : null}
        </div>
        {actions ? <div className="panel-actions">{actions}</div> : null}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function MetricCard({ label, value, detail, tone = "amber" }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className={`metric-value tone-${tone}`}>{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

function App() {
  const importRef = useRef(null);
  const [tab, setTab] = useState("dashboard");
  const [workspace, setWorkspace] = useState(readStoredWorkspace);
  const [toast, setToast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [activeScheduleDate, setActiveScheduleDate] = useState("");
  const [activeScheduleTime, setActiveScheduleTime] = useState("08:30");
  const [manualIntel, setManualIntel] = useState({
    headline: "",
    source: "",
    relevance: "",
    topic: "Cyber Risk",
  });
  const [publishingId, setPublishingId] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitiseWorkspaceForStorage(workspace)));
  }, [workspace]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedIntelItems = workspace.intel.filter((item) =>
    workspace.brief.selectedIntelIds.includes(item.id),
  );
  const selectedDraft = workspace.drafts.find((draft) => draft.id === workspace.selectedDraftId) || null;
  const promptPack = buildPromptPack(workspace, selectedIntelItems);

  const topicCounts = countValues(workspace.drafts.flatMap((draft) => draft.topics || []));
  const keywordCounts = countValues(workspace.drafts.flatMap((draft) => draft.keywords || []));
  const stageCounts = countValues(workspace.queue.map((item) => item.status));
  const avgScore = average(workspace.drafts.map((draft) => draft.score || 0).filter(Boolean));
  const scheduledCount = workspace.queue.filter((item) => item.status === "scheduled").length;
  const publishedCount = workspace.queue.filter((item) => item.status === "published").length;
  const briefCompleteness = [
    workspace.brief.campaign,
    workspace.brief.angle,
    workspace.brief.evidence,
    workspace.brief.cta,
    workspace.brief.objective,
    workspace.brief.audience,
    workspace.brief.selectedTopics.length ? "topics" : "",
  ].filter(Boolean).length;
  const briefReadiness = Math.round((briefCompleteness / 7) * 100);
  const recentKeywords = Object.entries(keywordCounts)
    .sort((left, right) => right[1] - left[1])
    .slice(0, 12);

  function notify(message, tone = "info") {
    setToast({ message, tone });
  }

  function patchSection(section, patch) {
    setWorkspace((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...patch,
      },
    }));
  }

  function toggleProfileTopic(topic) {
    setWorkspace((current) => {
      const nextTopics = current.profile.topics.includes(topic)
        ? current.profile.topics.filter((item) => item !== topic)
        : [...current.profile.topics, topic];

      const nextBriefTopics = current.brief.selectedTopics.filter((item) => nextTopics.includes(item));

      return {
        ...current,
        profile: {
          ...current.profile,
          topics: nextTopics,
        },
        brief: {
          ...current.brief,
          selectedTopics: nextBriefTopics.length ? nextBriefTopics : nextTopics.slice(0, 3),
        },
      };
    });
  }

  function toggleBriefTopic(topic) {
    setWorkspace((current) => ({
      ...current,
      brief: {
        ...current.brief,
        selectedTopics: current.brief.selectedTopics.includes(topic)
          ? current.brief.selectedTopics.filter((item) => item !== topic)
          : [...current.brief.selectedTopics, topic],
      },
    }));
  }

  function togglePostingDay(day) {
    setWorkspace((current) => ({
      ...current,
      profile: {
        ...current.profile,
        postingDays: current.profile.postingDays.includes(day)
          ? current.profile.postingDays.filter((item) => item !== day)
          : [...current.profile.postingDays, day],
      },
    }));
  }

  function toggleIntelSelection(intelId) {
    setWorkspace((current) => ({
      ...current,
      brief: {
        ...current.brief,
        selectedIntelIds: current.brief.selectedIntelIds.includes(intelId)
          ? current.brief.selectedIntelIds.filter((item) => item !== intelId)
          : [...current.brief.selectedIntelIds, intelId],
      },
    }));
  }

  async function copyText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      notify(successMessage, "success");
    } catch {
      notify("Clipboard access is not available in this browser context.", "warn");
    }
  }

  async function generateDrafts() {
    setIsGenerating(true);

    try {
      let rawDrafts;
      if (workspace.integrations.aiMode === "webhook" && workspace.integrations.webhookUrl) {
        rawDrafts = await generateFromWebhook(workspace, promptPack, selectedIntelItems);
      } else {
        rawDrafts = createDemoDrafts(workspace, selectedIntelItems);
      }

      const now = new Date().toISOString();
      const nextDrafts = rawDrafts.map((draft) => {
        const evaluation = evaluateDraft(draft.text, workspace, selectedIntelItems, workspace.drafts);
        return {
          id: createId("draft"),
          title: draft.title,
          text: draft.text,
          createdAt: now,
          updatedAt: now,
          topics: workspace.brief.selectedTopics.length
            ? workspace.brief.selectedTopics
            : workspace.profile.topics.slice(0, 3),
          tone: workspace.brief.tone,
          format: workspace.brief.format,
          score: evaluation.score,
          findings: evaluation.findings,
          wordCount: evaluation.wordCount,
          hashtags: evaluation.hashtags,
          keywords: evaluation.keywords,
          intelIds: workspace.brief.selectedIntelIds,
          promptPack,
        };
      });

      setWorkspace((current) => ({
        ...current,
        drafts: [...nextDrafts, ...current.drafts],
        selectedDraftId: nextDrafts[0]?.id || current.selectedDraftId,
      }));

      notify(
        workspace.integrations.aiMode === "webhook" && workspace.integrations.webhookUrl
          ? "Generated variants using the configured webhook."
          : "Generated three ready-to-edit variants in demo mode.",
        "success",
      );
    } catch {
      const fallbackDrafts = createDemoDrafts(workspace, selectedIntelItems);
      const now = new Date().toISOString();
      const nextDrafts = fallbackDrafts.map((draft) => {
        const evaluation = evaluateDraft(draft.text, workspace, selectedIntelItems, workspace.drafts);
        return {
          id: createId("draft"),
          title: draft.title,
          text: draft.text,
          createdAt: now,
          updatedAt: now,
          topics: workspace.brief.selectedTopics.length
            ? workspace.brief.selectedTopics
            : workspace.profile.topics.slice(0, 3),
          tone: workspace.brief.tone,
          format: workspace.brief.format,
          score: evaluation.score,
          findings: evaluation.findings,
          wordCount: evaluation.wordCount,
          hashtags: evaluation.hashtags,
          keywords: evaluation.keywords,
          intelIds: workspace.brief.selectedIntelIds,
          promptPack,
        };
      });

      setWorkspace((current) => ({
        ...current,
        drafts: [...nextDrafts, ...current.drafts],
        selectedDraftId: nextDrafts[0]?.id || current.selectedDraftId,
      }));

      notify("Webhook generation failed, so the app fell back to demo generation.", "warn");
    } finally {
      setIsGenerating(false);
      setTab("studio");
    }
  }

  function updateDraftText(draftId, text) {
    setWorkspace((current) => ({
      ...current,
      drafts: current.drafts.map((draft) => {
        if (draft.id !== draftId) {
          return draft;
        }

        const previousDrafts = current.drafts.filter((item) => item.id !== draftId);
        const selectedIntelForDraft = current.intel.filter((item) => draft.intelIds?.includes(item.id));
        const evaluation = evaluateDraft(text, current, selectedIntelForDraft, previousDrafts);

        return {
          ...draft,
          text,
          updatedAt: new Date().toISOString(),
          score: evaluation.score,
          findings: evaluation.findings,
          wordCount: evaluation.wordCount,
          hashtags: evaluation.hashtags,
          keywords: evaluation.keywords,
        };
      }),
    }));
  }

  function queueSelectedDraft() {
    if (!selectedDraft) {
      notify("Select or generate a draft before queueing it.", "warn");
      return;
    }

    const scheduledFor = activeScheduleDate
      ? `${activeScheduleDate}T${activeScheduleTime || "08:30"}`
      : "";

    const queueItem = {
      id: createId("queue"),
      draftId: selectedDraft.id,
      title: selectedDraft.title,
      text: selectedDraft.text,
      status: scheduledFor ? "scheduled" : "review",
      scheduledFor,
      createdAt: new Date().toISOString(),
      score: selectedDraft.score,
    };

    setWorkspace((current) => ({
      ...current,
      queue: [queueItem, ...current.queue],
    }));

    setActiveScheduleDate("");
    setActiveScheduleTime("08:30");
    notify("Draft added to the workflow queue.", "success");
    setTab("queue");
  }

  function cloneSelectedDraft() {
    if (!selectedDraft) {
      notify("Select a draft before cloning it.", "warn");
      return;
    }

    const now = new Date().toISOString();
    const clone = {
      ...selectedDraft,
      id: createId("draft"),
      title: `${selectedDraft.title} Copy`,
      createdAt: now,
      updatedAt: now,
    };

    setWorkspace((current) => ({
      ...current,
      drafts: [clone, ...current.drafts],
      selectedDraftId: clone.id,
    }));
    notify("Cloned the selected draft for a new variant.", "success");
  }

  function scanIntelWorkspace() {
    setIsScanning(true);

    window.setTimeout(() => {
      const pulse = createIntelPulse(workspace.brief.selectedTopics);
      setWorkspace((current) => ({
        ...current,
        intel: [...pulse, ...current.intel].slice(0, 20),
        brief: {
          ...current.brief,
          selectedIntelIds: [...new Set([...pulse.slice(0, 2).map((item) => item.id), ...current.brief.selectedIntelIds])],
        },
      }));
      setIsScanning(false);
      notify("Workspace intel refreshed with new operator signals.", "success");
    }, 450);
  }

  function addManualIntel() {
    if (!manualIntel.headline.trim() || !manualIntel.source.trim() || !manualIntel.relevance.trim()) {
      notify("Complete the headline, source and relevance fields first.", "warn");
      return;
    }

    const item = {
      id: createId("intel"),
      headline: manualIntel.headline.trim(),
      source: manualIntel.source.trim(),
      relevance: manualIntel.relevance.trim(),
      topic: manualIntel.topic,
      freshness: "Manual",
    };

    setWorkspace((current) => ({
      ...current,
      intel: [item, ...current.intel],
      brief: {
        ...current.brief,
        selectedIntelIds: [...new Set([item.id, ...current.brief.selectedIntelIds])],
      },
    }));

    setManualIntel({
      headline: "",
      source: "",
      relevance: "",
      topic: manualIntel.topic,
    });
    notify("Added a manual intel item to the workspace.", "success");
  }

  function advanceQueueItem(itemId) {
    setWorkspace((current) => ({
      ...current,
      queue: current.queue.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        if (item.status === "review") {
          return { ...item, status: "approved" };
        }

        if (item.status === "approved") {
          return { ...item, status: item.scheduledFor ? "scheduled" : "published" };
        }

        if (item.status === "scheduled") {
          return { ...item, status: "published" };
        }

        return item;
      }),
    }));
  }

  function updateQueueSchedule(itemId, field, value) {
    setWorkspace((current) => ({
      ...current,
      queue: current.queue.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const date = field === "date" ? value : item.scheduledFor?.slice(0, 10) || "";
        const time = field === "time" ? value : item.scheduledFor?.slice(11, 16) || "08:30";
        const scheduledFor = date ? `${date}T${time || "08:30"}` : "";

        return {
          ...item,
          scheduledFor,
          status: item.status === "published" ? "published" : scheduledFor ? "scheduled" : "review",
        };
      }),
    }));
  }

  async function publishToLinkedIn(item) {
    if (!workspace.integrations.linkedinToken || !workspace.integrations.linkedinUrn) {
      notify("LinkedIn token and URN are not configured in settings.", "warn");
      return;
    }

    setPublishingId(item.id);

    try {
      const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${workspace.integrations.linkedinToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${workspace.integrations.linkedinUrn}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: { text: item.text },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`LinkedIn returned ${response.status}.`);
      }

      setWorkspace((current) => ({
        ...current,
        queue: current.queue.map((queueItem) =>
          queueItem.id === item.id ? { ...queueItem, status: "published" } : queueItem,
        ),
      }));
      notify("LinkedIn publish request completed successfully.", "success");
    } catch {
      notify("LinkedIn publish failed in-browser. Keep the connector for a future backend or publish manually.", "warn");
    } finally {
      setPublishingId("");
    }
  }

  function exportWorkspace() {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sec-li-bot-workspace.json";
    link.click();
    URL.revokeObjectURL(url);
    notify("Workspace exported as JSON.", "success");
  }

  function importWorkspace(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        setWorkspace(normaliseWorkspace(parsed));
        notify("Imported workspace data successfully.", "success");
      } catch {
        notify("That file could not be parsed as a workspace export.", "error");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  function resetWorkspace() {
    if (!window.confirm("Reset the SEC LI BOT workspace back to defaults?")) {
      return;
    }

    setWorkspace(DEFAULT_STATE);
    setActiveScheduleDate("");
    setActiveScheduleTime("08:30");
    notify("Workspace reset to defaults.", "success");
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <div>
          <div className="eyebrow">Strategic Edge Consulting</div>
          <div className="brand-lockup">
            <span className="brand-mark">SEC</span>
            <span className="brand-separator">/</span>
            <span>LI BOT</span>
          </div>
        </div>
        <div className="topbar-badges">
          <Badge tone={isGenerating || isScanning ? "amber" : "green"}>
            {isGenerating ? "Generating" : isScanning ? "Scanning" : "Ready"}
          </Badge>
          <Badge tone="cyan">{workspace.integrations.aiMode === "webhook" ? "Webhook Mode" : "Demo Mode"}</Badge>
          <Badge tone={workspace.brief.selectedIntelIds.length ? "amber" : "neutral"}>
            {workspace.brief.selectedIntelIds.length} Intel Selected
          </Badge>
        </div>
      </div>

      <div className="nav-shell">
        {[
          ["dashboard", "Dashboard"],
          ["strategy", "Strategy"],
          ["intel", "Intel"],
          ["studio", "Studio"],
          ["queue", `Queue ${workspace.queue.length ? `(${workspace.queue.length})` : ""}`],
          ["knowledge", "Knowledge"],
          ["roadmap", "Roadmap"],
          ["settings", "Settings"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={`nav-button ${tab === id ? "nav-button-active" : ""}`}
            onClick={() => setTab(id)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {toast ? (
        <div className={`toast toast-${toast.tone || "info"}`}>
          <strong>{toTitleCase(toast.tone || "info")}:</strong> {toast.message}
        </div>
      ) : null}

      <main className="main-grid">
        {tab === "dashboard" ? (
          <>
            <div className="grid grid-metrics">
              <MetricCard label="Drafts" value={workspace.drafts.length} detail="Generated variants in the workspace" />
              <MetricCard label="Average score" value={avgScore || "--"} detail="Guardrail score across saved drafts" tone="cyan" />
              <MetricCard label="Scheduled" value={scheduledCount} detail="Posts waiting on a publish window" tone="green" />
              <MetricCard label="Published" value={publishedCount} detail="Workflow items marked complete" tone="amber" />
            </div>

            <div className="grid grid-two">
              <Panel
                title="Campaign Snapshot"
                subTitle="High-level plan aligned to the brief and current workflow."
                actions={
                  <button className="button button-ghost" type="button" onClick={() => setTab("strategy")}>
                    Refine Brief
                  </button>
                }
              >
                <div className="stack-sm">
                  <div className="row-wrap">
                    <Badge tone="amber">{workspace.brief.objective}</Badge>
                    <Badge tone="cyan">{workspace.brief.audience}</Badge>
                    <Badge tone="neutral">{workspace.brief.tone}</Badge>
                    <Badge tone="neutral">{workspace.brief.format}</Badge>
                  </div>
                  <div className="readiness-shell">
                    <div className="readiness-head">
                      <span>Brief readiness</span>
                      <strong>{briefReadiness}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${briefReadiness}%` }} />
                    </div>
                  </div>
                  <p className="body-copy">{workspace.brief.angle}</p>
                  <div className="chip-group">
                    {workspace.brief.selectedTopics.map((topic) => (
                      <span key={topic} className="chip chip-active">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Panel>

              <Panel title="Quick Moves" subTitle="Keep momentum without leaving the dashboard.">
                <div className="button-stack">
                  <button className="button button-primary" type="button" onClick={generateDrafts}>
                    {isGenerating ? "Generating Variants..." : "Generate Variants"}
                  </button>
                  <button className="button button-secondary" type="button" onClick={scanIntelWorkspace}>
                    {isScanning ? "Refreshing Intel..." : "Refresh Intel Workspace"}
                  </button>
                  <button className="button button-ghost" type="button" onClick={() => copyText(promptPack.combined, "Prompt pack copied.")}>
                    Copy Prompt Pack
                  </button>
                </div>
              </Panel>
            </div>

            <div className="grid grid-two">
              <Panel title="Workflow Status" subTitle="Current movement through review, schedule and publish.">
                <div className="stack-sm">
                  {["review", "approved", "scheduled", "published"].map((stage) => (
                    <div key={stage} className="summary-row">
                      <span>{toTitleCase(stage)}</span>
                      <strong>{stageCounts[stage] || 0}</strong>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Topic Coverage" subTitle="Where the workspace is concentrating attention.">
                <div className="stack-sm">
                  {Object.entries(topicCounts)
                    .sort((left, right) => right[1] - left[1])
                    .slice(0, 6)
                    .map(([topic, count]) => (
                      <div key={topic} className="coverage-row">
                        <span>{topic}</span>
                        <div className="coverage-meter">
                          <div className="coverage-fill" style={{ width: `${Math.min(count * 22, 100)}%` }} />
                        </div>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  {!Object.keys(topicCounts).length ? (
                    <p className="body-copy body-copy-muted">Generate a few variants to start seeing content coverage patterns.</p>
                  ) : null}
                </div>
              </Panel>
            </div>
          </>
        ) : null}

        {tab === "strategy" ? (
          <div className="grid grid-two">
            <Panel title="Campaign Brief" subTitle="Set the intent and constraints for the next generation cycle.">
              <div className="stack-md">
                <Field label="Campaign">
                  <input value={workspace.brief.campaign} onChange={(event) => patchSection("brief", { campaign: event.target.value })} />
                </Field>
                <div className="field-grid">
                  <Field label="Objective">
                    <select value={workspace.brief.objective} onChange={(event) => patchSection("brief", { objective: event.target.value })}>
                      {OBJECTIVES.map((objective) => (
                        <option key={objective}>{objective}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Audience">
                    <select value={workspace.brief.audience} onChange={(event) => patchSection("brief", { audience: event.target.value })}>
                      {AUDIENCES.map((audience) => (
                        <option key={audience}>{audience}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="field-grid">
                  <Field label="Tone">
                    <select value={workspace.brief.tone} onChange={(event) => patchSection("brief", { tone: event.target.value })}>
                      {TONES.map((tone) => (
                        <option key={tone}>{tone}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Format">
                    <select value={workspace.brief.format} onChange={(event) => patchSection("brief", { format: event.target.value })}>
                      {FORMATS.map((format) => (
                        <option key={format}>{format}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Primary angle">
                  <textarea rows="4" value={workspace.brief.angle} onChange={(event) => patchSection("brief", { angle: event.target.value })} />
                </Field>
                <Field label="Evidence guidance">
                  <textarea rows="4" value={workspace.brief.evidence} onChange={(event) => patchSection("brief", { evidence: event.target.value })} />
                </Field>
                <Field label="Preferred CTA">
                  <textarea rows="3" value={workspace.brief.cta} onChange={(event) => patchSection("brief", { cta: event.target.value })} />
                </Field>
                <div className="toggle-row">
                  <input
                    id="source-mention"
                    type="checkbox"
                    checked={workspace.brief.includeSourceMention}
                    onChange={(event) => patchSection("brief", { includeSourceMention: event.target.checked })}
                  />
                  <label htmlFor="source-mention">Require explicit source mention when intel is selected</label>
                </div>
              </div>
            </Panel>

            <Panel title="Topic Plan" subTitle="Pick the content pillars for this brief and your weekly rhythm.">
              <div className="stack-md">
                <div>
                  <div className="mini-title">Brief topics</div>
                  <div className="chip-group">
                    {workspace.profile.topics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        className={`chip ${workspace.brief.selectedTopics.includes(topic) ? "chip-active" : ""}`}
                        onClick={() => toggleBriefTopic(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mini-title">Posting days</div>
                  <div className="chip-group">
                    {POSTING_DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`chip ${workspace.profile.postingDays.includes(day) ? "chip-active" : ""}`}
                        onClick={() => togglePostingDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="brief-card">
                  <div className="mini-title">Current planning note</div>
                  <p className="body-copy">
                    Focus the next content run on <strong>{workspace.brief.selectedTopics.join(", ") || "selected topics"}</strong>. The current aim is{" "}
                    <strong>{workspace.brief.objective.toLowerCase()}</strong> for <strong>{workspace.brief.audience.toLowerCase()}</strong>, using a{" "}
                    <strong>{workspace.brief.tone.toLowerCase()}</strong> voice and <strong>{workspace.brief.format.toLowerCase()}</strong> structure.
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        ) : null}

        {tab === "intel" ? (
          <div className="grid grid-two">
            <Panel
              title="Intel Workspace"
              subTitle="Seeded and manual signals that can feed the next post."
              actions={
                <button className="button button-secondary" type="button" onClick={scanIntelWorkspace}>
                  {isScanning ? "Refreshing..." : "Refresh Workspace"}
                </button>
              }
            >
              <div className="stack-md">
                {workspace.intel.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`intel-card ${workspace.brief.selectedIntelIds.includes(item.id) ? "intel-card-active" : ""}`}
                    onClick={() => toggleIntelSelection(item.id)}
                  >
                    <div className="intel-topline">
                      <Badge tone="amber">{item.topic}</Badge>
                      <span className="intel-freshness">{item.freshness}</span>
                    </div>
                    <div className="intel-headline">{item.headline}</div>
                    <div className="intel-meta">{item.source}</div>
                    <p className="body-copy body-copy-muted">{item.relevance}</p>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Manual Signal Capture" subTitle="Add workshop notes, observations or customer signals.">
              <div className="stack-md">
                <Field label="Headline">
                  <textarea
                    rows="3"
                    value={manualIntel.headline}
                    onChange={(event) => setManualIntel((current) => ({ ...current, headline: event.target.value }))}
                    placeholder="Write the signal as a plain-language headline."
                  />
                </Field>
                <Field label="Source">
                  <input
                    value={manualIntel.source}
                    onChange={(event) => setManualIntel((current) => ({ ...current, source: event.target.value }))}
                    placeholder="Workshop note, client pattern, operator signal..."
                  />
                </Field>
                <Field label="Why it matters">
                  <textarea
                    rows="3"
                    value={manualIntel.relevance}
                    onChange={(event) => setManualIntel((current) => ({ ...current, relevance: event.target.value }))}
                    placeholder="Explain why this should shape the next post."
                  />
                </Field>
                <Field label="Topic">
                  <select value={manualIntel.topic} onChange={(event) => setManualIntel((current) => ({ ...current, topic: event.target.value }))}>
                    {workspace.profile.topics.map((topic) => (
                      <option key={topic}>{topic}</option>
                    ))}
                  </select>
                </Field>
                <button className="button button-primary" type="button" onClick={addManualIntel}>
                  Add Manual Intel
                </button>
              </div>
            </Panel>
          </div>
        ) : null}

        {tab === "studio" ? (
          <div className="grid grid-two studio-grid">
            <Panel
              title="Prompt Studio"
              subTitle="Build the prompt pack, then generate or manually run it through your preferred model."
              actions={
                <div className="row-wrap">
                  <button className="button button-ghost" type="button" onClick={() => copyText(promptPack.combined, "Prompt pack copied.")}>
                    Copy Prompt
                  </button>
                  <button className="button button-primary" type="button" onClick={generateDrafts}>
                    {isGenerating ? "Generating..." : "Generate Variants"}
                  </button>
                </div>
              }
            >
              <div className="stack-md">
                <div className="prompt-block">
                  <div className="mini-title">Selected intel</div>
                  <div className="chip-group">
                    {selectedIntelItems.length ? (
                      selectedIntelItems.map((item) => (
                        <span key={item.id} className="chip chip-active">
                          {item.topic}
                        </span>
                      ))
                    ) : (
                      <span className="body-copy body-copy-muted">No intel selected. The bot will rely on strategy inputs.</span>
                    )}
                  </div>
                </div>
                <div className="prompt-block">
                  <div className="mini-title">System prompt</div>
                  <pre className="prompt-preview">{promptPack.system}</pre>
                </div>
                <div className="prompt-block">
                  <div className="mini-title">User prompt</div>
                  <pre className="prompt-preview">{promptPack.user}</pre>
                </div>
                <div className="brief-card">
                  <div className="mini-title">Generation mode</div>
                  <p className="body-copy body-copy-muted">
                    Demo mode produces structured example drafts immediately. Webhook mode sends the prompt pack to your own endpoint so you can attach a real model later without rewriting the UI.
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Draft Workspace" subTitle="Select a variant, edit it and run it through guardrails before queueing.">
              <div className="stack-md">
                <div className="variant-list">
                  {workspace.drafts.slice(0, 6).map((draft) => (
                    <button
                      key={draft.id}
                      type="button"
                      className={`variant-card ${workspace.selectedDraftId === draft.id ? "variant-card-active" : ""}`}
                      onClick={() => setWorkspace((current) => ({ ...current, selectedDraftId: draft.id }))}
                    >
                      <div className="variant-head">
                        <strong>{draft.title}</strong>
                        <Badge tone={draft.score >= 85 ? "green" : draft.score >= 70 ? "amber" : "red"}>{draft.score}</Badge>
                      </div>
                      <div className="variant-meta">
                        <span>{draft.wordCount} words</span>
                        <span>{formatShortDate(draft.updatedAt)}</span>
                      </div>
                    </button>
                  ))}
                  {!workspace.drafts.length ? <div className="empty-state">Generate a set of variants and they will appear here for editing and approval.</div> : null}
                </div>

                {selectedDraft ? (
                  <>
                    <Field label="Active draft">
                      <textarea rows="16" value={selectedDraft.text} onChange={(event) => updateDraftText(selectedDraft.id, event.target.value)} />
                    </Field>
                    <div className="field-grid">
                      <Field label="Schedule date">
                        <input type="date" value={activeScheduleDate} onChange={(event) => setActiveScheduleDate(event.target.value)} />
                      </Field>
                      <Field label="Schedule time">
                        <input type="time" value={activeScheduleTime} onChange={(event) => setActiveScheduleTime(event.target.value)} />
                      </Field>
                    </div>
                    <div className="button-row">
                      <button className="button button-primary" type="button" onClick={queueSelectedDraft}>
                        Queue Draft
                      </button>
                      <button className="button button-secondary" type="button" onClick={() => copyText(selectedDraft.text, "Draft copied.")}>
                        Copy Draft
                      </button>
                      <button className="button button-ghost" type="button" onClick={cloneSelectedDraft}>
                        Clone Variant
                      </button>
                    </div>
                    <div className="findings-list">
                      {selectedDraft.findings.map((finding, index) => (
                        <div key={`${selectedDraft.id}-${index}`} className={`finding finding-${finding.tone}`}>
                          <strong>{finding.label}</strong>
                          <span>{finding.detail}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </Panel>
          </div>
        ) : null}

        {tab === "queue" ? (
          <Panel title="Workflow Queue" subTitle="Move posts from review to publish and keep scheduling visible.">
            <div className="queue-list">
              {workspace.queue.map((item) => (
                <div key={item.id} className="queue-card">
                  <div className="queue-card-main">
                    <div className="queue-card-head">
                      <strong>{item.title}</strong>
                      <div className="row-wrap">
                        <Badge tone={item.status === "published" ? "green" : item.status === "scheduled" ? "amber" : "cyan"}>
                          {toTitleCase(item.status)}
                        </Badge>
                        <Badge tone="neutral">Score {item.score}</Badge>
                      </div>
                    </div>
                    <p className="body-copy">{item.text}</p>
                    <div className="queue-meta">
                      <span>Created {formatShortDate(item.createdAt)}</span>
                      <span>{formatWhen(item.scheduledFor)}</span>
                    </div>
                  </div>
                  <div className="queue-controls">
                    <div className="field-grid">
                      <Field label="Date">
                        <input type="date" value={item.scheduledFor?.slice(0, 10) || ""} onChange={(event) => updateQueueSchedule(item.id, "date", event.target.value)} />
                      </Field>
                      <Field label="Time">
                        <input type="time" value={item.scheduledFor?.slice(11, 16) || "08:30"} onChange={(event) => updateQueueSchedule(item.id, "time", event.target.value)} />
                      </Field>
                    </div>
                    <div className="button-row">
                      <button className="button button-secondary" type="button" onClick={() => advanceQueueItem(item.id)}>
                        Advance
                      </button>
                      <button className="button button-ghost" type="button" onClick={() => copyText(item.text, "Queue item copied.")}>
                        Copy
                      </button>
                      <button
                        className="button button-ghost"
                        type="button"
                        onClick={() => {
                          setWorkspace((current) => ({ ...current, selectedDraftId: item.draftId }));
                          setTab("studio");
                        }}
                      >
                        Open Draft
                      </button>
                      <button className="button button-primary" type="button" onClick={() => publishToLinkedIn(item)} disabled={publishingId === item.id}>
                        {publishingId === item.id ? "Publishing..." : "Push to LinkedIn"}
                      </button>
                      <button
                        className="button button-danger"
                        type="button"
                        onClick={() => setWorkspace((current) => ({ ...current, queue: current.queue.filter((queueItem) => queueItem.id !== item.id) }))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!workspace.queue.length ? <div className="empty-state">Queue a draft from Studio to start managing approvals and publish windows.</div> : null}
            </div>
          </Panel>
        ) : null}

        {tab === "knowledge" ? (
          <div className="grid grid-two">
            <Panel title="Keyword and Topic Signals" subTitle="Patterns gathered from the current draft library.">
              <div className="stack-md">
                <div>
                  <div className="mini-title">Top keywords</div>
                  <div className="chip-group">
                    {recentKeywords.length ? recentKeywords.map(([keyword, count]) => <span key={keyword} className="chip chip-active">{keyword} ({count})</span>) : <span className="body-copy body-copy-muted">No keyword history yet.</span>}
                  </div>
                </div>
                <div>
                  <div className="mini-title">Topic frequency</div>
                  <div className="stack-sm">
                    {Object.entries(topicCounts)
                      .sort((left, right) => right[1] - left[1])
                      .map(([topic, count]) => (
                        <div key={topic} className="coverage-row">
                          <span>{topic}</span>
                          <div className="coverage-meter">
                            <div className="coverage-fill" style={{ width: `${Math.min(count * 22, 100)}%` }} />
                          </div>
                          <strong>{count}</strong>
                        </div>
                      ))}
                    {!Object.keys(topicCounts).length ? <span className="body-copy body-copy-muted">Generate drafts to build topic insight.</span> : null}
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Recent Draft Health" subTitle="The latest scores and signals from the working set.">
              <div className="stack-sm">
                {workspace.drafts.slice(0, 6).map((draft) => (
                  <div key={draft.id} className="summary-card">
                    <div className="summary-row">
                      <strong>{draft.title}</strong>
                      <Badge tone={draft.score >= 85 ? "green" : draft.score >= 70 ? "amber" : "red"}>{draft.score}</Badge>
                    </div>
                    <div className="summary-row summary-row-soft">
                      <span>{draft.wordCount} words</span>
                      <span>{draft.topics.join(", ")}</span>
                    </div>
                  </div>
                ))}
                {!workspace.drafts.length ? <div className="empty-state">No draft history yet. Use the studio to start building the knowledge base.</div> : null}
              </div>
            </Panel>
          </div>
        ) : null}

        {tab === "roadmap" ? (
          <div className="grid grid-two">
            <Panel title="Delivery Roadmap" subTitle="A practical build-out aligned to the supplied SEC LI BOT document set.">
              <div className="stack-md">
                {ROADMAP_PHASES.map((phase) => (
                  <div key={phase.id} className="summary-card">
                    <div className="summary-row">
                      <div>
                        <div className="mini-title">{phase.phase}</div>
                        <strong>{phase.title}</strong>
                      </div>
                      <Badge tone={phase.status === "Live" ? "green" : "amber"}>{phase.status}</Badge>
                    </div>
                    <div className="summary-row summary-row-soft">
                      <span>{phase.window}</span>
                    </div>
                    <p className="body-copy body-copy-muted">{phase.summary}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Backlog" subTitle="Jira-style view of what is implemented now and what should come next.">
              <div className="table-shell">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Epic</th>
                      <th>Title</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BACKLOG_ITEMS.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.epic}</td>
                        <td>{item.title}</td>
                        <td>{item.priority}</td>
                        <td>{item.status}</td>
                        <td>{item.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        ) : null}

        {tab === "settings" ? (
          <div className="grid grid-two">
            <Panel title="Profile and Voice" subTitle="Baseline identity and topic coverage for the bot.">
              <div className="stack-md">
                <Field label="Name">
                  <input value={workspace.profile.name} onChange={(event) => patchSection("profile", { name: event.target.value })} />
                </Field>
                <Field label="Brand">
                  <input value={workspace.profile.brand} onChange={(event) => patchSection("profile", { brand: event.target.value })} />
                </Field>
                <Field label="Role">
                  <input value={workspace.profile.role} onChange={(event) => patchSection("profile", { role: event.target.value })} />
                </Field>
                <Field label="Voice profile">
                  <textarea rows="4" value={workspace.profile.voice} onChange={(event) => patchSection("profile", { voice: event.target.value })} />
                </Field>
                <Field label="Core promise">
                  <textarea rows="3" value={workspace.profile.corePromise} onChange={(event) => patchSection("profile", { corePromise: event.target.value })} />
                </Field>
                <div>
                  <div className="mini-title">Available topics</div>
                  {Object.entries(TOPIC_LIBRARY).map(([group, topics]) => (
                    <div key={group} className="topic-group">
                      <div className="topic-group-label">{group}</div>
                      <div className="chip-group">
                        {topics.map((topic) => (
                          <button
                            key={topic}
                            type="button"
                            className={`chip ${workspace.profile.topics.includes(topic) ? "chip-active" : ""}`}
                            onClick={() => toggleProfileTopic(topic)}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title="Guardrails and Integrations" subTitle="Controls for safety, workflow discipline and external hand-off.">
              <div className="stack-md">
                <div className="field-grid">
                  <Field label="Min words">
                    <input type="number" value={workspace.guardrails.minWords} onChange={(event) => patchSection("guardrails", { minWords: Number(event.target.value) || 0 })} />
                  </Field>
                  <Field label="Max words">
                    <input type="number" value={workspace.guardrails.maxWords} onChange={(event) => patchSection("guardrails", { maxWords: Number(event.target.value) || 0 })} />
                  </Field>
                </div>
                <div className="field-grid">
                  <Field label="Min hashtags">
                    <input type="number" value={workspace.guardrails.hashtagMin} onChange={(event) => patchSection("guardrails", { hashtagMin: Number(event.target.value) || 0 })} />
                  </Field>
                  <Field label="Max hashtags">
                    <input type="number" value={workspace.guardrails.hashtagMax} onChange={(event) => patchSection("guardrails", { hashtagMax: Number(event.target.value) || 0 })} />
                  </Field>
                </div>
                <Field label="Banned phrases" hint="Comma or line separated.">
                  <textarea rows="3" value={workspace.guardrails.bannedPhrases.join(", ")} onChange={(event) => patchSection("guardrails", { bannedPhrases: parseDelimitedList(event.target.value) })} />
                </Field>
                <Field label="High-risk claims" hint="Comma or line separated.">
                  <textarea rows="3" value={workspace.guardrails.bannedClaims.join(", ")} onChange={(event) => patchSection("guardrails", { bannedClaims: parseDelimitedList(event.target.value) })} />
                </Field>
                <div className="toggle-row">
                  <input id="require-cta" type="checkbox" checked={workspace.guardrails.requireCta} onChange={(event) => patchSection("guardrails", { requireCta: event.target.checked })} />
                  <label htmlFor="require-cta">Require a CTA in each draft</label>
                </div>
                <div className="toggle-row">
                  <input id="ban-first-i" type="checkbox" checked={workspace.guardrails.banFirstWordI} onChange={(event) => patchSection("guardrails", { banFirstWordI: event.target.checked })} />
                  <label htmlFor="ban-first-i">Do not allow drafts to open with the word "I"</label>
                </div>
                <div className="divider" />
                <Field label="AI mode">
                  <select value={workspace.integrations.aiMode} onChange={(event) => patchSection("integrations", { aiMode: event.target.value })}>
                    <option value="demo">Demo</option>
                    <option value="webhook">Webhook</option>
                  </select>
                </Field>
                <Field label="Webhook URL">
                  <input value={workspace.integrations.webhookUrl} onChange={(event) => patchSection("integrations", { webhookUrl: event.target.value })} placeholder="https://your-service.example/generate" />
                </Field>
                <Field label="Webhook bearer token">
                  <input type="password" value={workspace.integrations.apiKey} onChange={(event) => patchSection("integrations", { apiKey: event.target.value })} placeholder="Optional" />
                </Field>
                <Field label="Model label">
                  <input value={workspace.integrations.model} onChange={(event) => patchSection("integrations", { model: event.target.value })} placeholder="For your own reference" />
                </Field>
                <Field label="LinkedIn person URN">
                  <input value={workspace.integrations.linkedinUrn} onChange={(event) => patchSection("integrations", { linkedinUrn: event.target.value })} />
                </Field>
                <Field label="LinkedIn access token">
                  <input type="password" value={workspace.integrations.linkedinToken} onChange={(event) => patchSection("integrations", { linkedinToken: event.target.value })} />
                </Field>
                <div className="toggle-row">
                  <input id="persist-secrets" type="checkbox" checked={workspace.integrations.persistSecrets} onChange={(event) => patchSection("integrations", { persistSecrets: event.target.checked })} />
                  <label htmlFor="persist-secrets">Persist API secrets in local storage for this prototype</label>
                </div>
                <div className="divider" />
                <div className="button-stack">
                  <button className="button button-secondary" type="button" onClick={exportWorkspace}>
                    Export Workspace JSON
                  </button>
                  <button className="button button-ghost" type="button" onClick={() => importRef.current?.click()}>
                    Import Workspace JSON
                  </button>
                  <button className="button button-danger" type="button" onClick={resetWorkspace}>
                    Reset Workspace
                  </button>
                </div>
                <input ref={importRef} type="file" accept="application/json" onChange={importWorkspace} hidden />
              </div>
            </Panel>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
