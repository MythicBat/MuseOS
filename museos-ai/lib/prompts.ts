import {
  CreativeProject,
  ProductionOutputType,
} from "@/types/creative";

export function buildCreativePrompt(idea: string): string {
  return `
You are MuseOS, an expert AI creative director and creative systems architect.

Create a distinctive, coherent creative universe from this idea:

USER IDEA:
${idea}

Return exactly one valid JSON object.
Do not use Markdown.
Do not use code fences.
Do not include commentary before or after the JSON.

The response must follow this structure:

{
  "title": "A concise, memorable project title",
  "idea": "${escapePromptText(idea)}",
  "dna": {
    "genre": "Specific genre or creative category",
    "tone": "Distinct emotional and stylistic tone",
    "audience": "Clearly defined target audience",
    "mood": "Atmosphere and emotional experience",
    "colors": ["Color one", "Color two", "Color three"]
  },
  "sections": [
    {
      "title": "Story",
      "text": "A specific story direction, concept arc, or experience narrative"
    },
    {
      "title": "Characters",
      "text": "Specific characters, users, personas, or creative forces"
    },
    {
      "title": "Visual Style",
      "text": "Specific visual language, composition, materials, and atmosphere"
    },
    {
      "title": "Marketing",
      "text": "Specific positioning, hook, and audience strategy"
    }
  ],
  "agents": [
    {
      "role": "Writer",
      "status": "complete",
      "message": "A concrete narrative recommendation"
    },
    {
      "role": "Art Director",
      "status": "complete",
      "message": "A concrete visual recommendation responding to the concept"
    },
    {
      "role": "Producer",
      "status": "complete",
      "message": "A feasible production recommendation"
    },
    {
      "role": "Marketing Strategist",
      "status": "complete",
      "message": "A concrete positioning and launch recommendation"
    }
  ],
  "outputs": {
    "pitchSummary": "A polished 80-120 word pitch",
    "storyboard": "A numbered five-scene storyboard separated by newline characters",
    "socialCampaign": "A concise campaign with hook, three post ideas, and call to action",
    "projectBrief": "A concise brief covering purpose, audience, deliverables, and success criteria"
  },
  "nodes": [
    {
      "id": "core",
      "title": "Project title",
      "subtitle": "A concise description of the central creative spark",
      "type": "core",
      "x": 50,
      "y": 50
    },
    {
      "id": "story",
      "title": "Story",
      "subtitle": "A concept-specific story insight",
      "type": "story",
      "x": 50,
      "y": 18
    },
    {
      "id": "characters",
      "title": "Characters",
      "subtitle": "A concept-specific character insight",
      "type": "character",
      "x": 22,
      "y": 40
    },
    {
      "id": "world",
      "title": "World",
      "subtitle": "A concept-specific world or experience insight",
      "type": "world",
      "x": 78,
      "y": 40
    },
    {
      "id": "visual",
      "title": "Visual Style",
      "subtitle": "A concept-specific visual insight",
      "type": "visual",
      "x": 28,
      "y": 75
    },
    {
      "id": "marketing",
      "title": "Marketing",
      "subtitle": "A concept-specific positioning insight",
      "type": "marketing",
      "x": 72,
      "y": 75
    }
  ],
  "edges": [
    { "from": "core", "to": "story" },
    { "from": "core", "to": "characters" },
    { "from": "core", "to": "world" },
    { "from": "core", "to": "visual" },
    { "from": "core", "to": "marketing" }
  ]
}

Quality rules:
- Do not give generic advice.
- Every field must clearly relate to the user's exact idea.
- Keep node subtitles under 22 words.
- Give each AI agent a distinct professional perspective.
- Make the project ambitious but realistically prototypable.
- Avoid references to copyrighted living artists or named visual franchises.
- Preserve the user's intent while improving originality and feasibility.
`.trim();
}

function escapePromptText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"')
    .replaceAll("\n", " ");
}

function isStructuredOutputType(
  outputType: ProductionOutputType
) : outputType is "pitch-deck" | "storyboard" {
  return (
    outputType === "pitch-deck" ||
    outputType === "storyboard"
  );
}

const outputInstructions: Record<
  ProductionOutputType,
  string
> = {
  "pitch-deck": `
Create a polished 10-slide pitch deck outline.

For every slide include:
- Slide number
- Slide title
- Main message
- 3 concise supporting points
- Suggested visual direction

Cover:
1. Title and hook
2. Problem or opportunity
3. Creative concept
4. Story and world
5. Audience
6. Differentiation
7. Experience or production approach
8. Marketing strategy
9. Roadmap
10. Final vision and call to action
`,

  storyboard: `
Create a cinematic 8-scene storyboard.

For every scene include:
- Scene number and title
- Location and time
- Visual composition
- Character action
- Dialogue or sound
- Emotional purpose
- Camera direction
- Image-generation prompt

Ensure the scenes form a coherent narrative arc.
`,

  "creative-bible": `
Create a professional creative bible.

Include:
- Core premise
- Creative vision
- Themes
- World rules
- Main characters
- Character relationships
- Visual language
- Colour and material language
- Sound and music identity
- Signature moments
- Audience experience
- Creative guardrails
`,

  "production-plan": `
Create a realistic production plan.

Include:
- Scope
- Deliverables
- Production phases
- Team roles
- 12-week timeline
- Tools and technology
- Key dependencies
- Major risks and mitigations
- Prototype strategy
- Success criteria
- Indicative budget categories

Keep it ambitious but suitable for a small creative technology team.
`,

  "marketing-plan": `
Create a complete marketing and launch plan.

Include:
- Positioning
- Target segments
- Core audience insight
- Campaign proposition
- Messaging pillars
- Launch phases
- Content strategy
- Partnerships
- Community strategy
- Distribution channels
- Success metrics
- Three signature campaign activations
`,

  "investor-brief": `
Create a concise investor and stakeholder brief.

Include:
- Executive summary
- Opportunity
- Product or experience
- Audience and market
- Unique differentiation
- Business or impact model
- Go-to-market strategy
- Development roadmap
- Key risks
- Funding or partnership use
- Closing investment thesis
`,

  "social-campaign": `
Create a launch-ready social media campaign.

Include:
- Campaign name
- Central hook
- Audience
- Tone of voice
- Three campaign phases
- Six post concepts
- Two short-form video concepts
- Community activation
- Hashtag direction
- Calls to action
- Success metrics
`,

  "project-brief": `
Create a detailed professional project brief.

Include:
- Project overview
- Background
- Objective
- Audience
- Creative proposition
- Scope
- Deliverables
- Functional requirements
- Creative requirements
- Timeline
- Stakeholders
- Constraints
- Success criteria
`,
};

export function buildProductionOutputPrompt({
  outputType,
  project,
  branchName,
  versionLabel,
}: {
  outputType: ProductionOutputType;
  project: CreativeProject;
  branchName?: string;
  versionLabel?: string;
}): string {
  if (isStructuredOutputType(outputType)) {
    return buildStructuredProductionPrompt({
      outputType,
      project,
      branchName,
      versionLabel,
    });
  }

  const instruction = outputInstructions[outputType];

  return `
You are MuseOS, an expert creative director, producer and creative strategist.

Create a professional production deliverable from the supplied creative universe.

OUTPUT TYPE:
${outputType}

ACTIVE BRANCH:
${branchName || "Main"}

ACTIVE VERSION:
${versionLabel || "Current version"}

PROJECT:
${JSON.stringify(project, null, 2)}

INSTRUCTIONS:
${instruction}

Quality requirements:
- Use the exact project details rather than generic advice.
- Preserve the project's title, creative DNA, characters, world and audience.
- Make every recommendation concrete and actionable.
- Use clear professional headings.
- Use concise paragraphs and readable bullet points.
- Do not mention that you are an AI.
- Do not include JSON.
- Do not use Markdown code fences.
- Do not invent copyrighted franchise comparisons.
- Return only the finished deliverable.
`.trim();
}

function buildStructuredProductionPrompt({
  outputType,
  project,
  branchName,
  versionLabel,
}: {
  outputType: "pitch-deck" | "storyboard";
  project: CreativeProject;
  branchName?: string;
  versionLabel?: string;
}): string {
  const context = `
ACTIVE BRANCH:
${branchName || "Main"}

ACTIVE VERSION:
${versionLabel || "Current version"}

PROJECT:
${JSON.stringify(project, null, 2)}
`;

  if (outputType === "storyboard") {
    return `
You are MuseOS, a senior film director, storyboard artist and visual storyteller.

Create an eight-scene cinematic storyboard from the supplied creative universe.

${context}

Return exactly one valid JSON object.
Do not use Markdown.
Do not use code fences.
Do not add commentary before or after the JSON.

Use this exact structure:

{
  "format": "storyboard",
  "logline": "A concise one-sentence narrative logline",
  "visualApproach": "A concise description of the cinematic and visual approach",
  "scenes": [
    {
      "id": "scene-1",
      "sceneNumber": 1,
      "title": "Concise scene title",
      "location": "Specific location",
      "time": "Time of day or story time",
      "shotType": "Specific shot type",
      "visualComposition": "Detailed visual framing and composition",
      "action": "What happens in the scene",
      "dialogueOrSound": "Dialogue, sound design or music cue",
      "emotionalPurpose": "The emotional and narrative purpose",
      "cameraDirection": "Camera movement and lens direction",
      "imagePrompt": "A standalone cinematic image-generation prompt"
    }
  ]
}

Rules:
- Return exactly eight scenes.
- Number scenes from 1 to 8.
- Use IDs scene-1 through scene-8.
- Create a complete narrative progression.
- Each scene must clearly reflect the supplied project.
- Keep each individual field concise but specific.
- The image prompt must work without additional context.
- Do not reference copyrighted artists, films or franchises.
`.trim();
  }

  return `
You are MuseOS, a senior creative director, pitch strategist and presentation designer.

Create a polished ten-slide pitch deck from the supplied creative universe.

${context}

Return exactly one valid JSON object.
Do not use Markdown.
Do not use code fences.
Do not add commentary before or after the JSON.

Use this exact structure:

{
  "format": "pitch-deck",
  "deckTitle": "The project or presentation title",
  "deckSubtitle": "A concise and compelling subtitle",
  "slides": [
    {
      "id": "slide-1",
      "slideNumber": 1,
      "title": "Concise slide title",
      "headline": "The primary message of this slide",
      "supportingPoints": [
        "Specific supporting point",
        "Specific supporting point",
        "Specific supporting point"
      ],
      "visualDirection": "Suggested layout, imagery, chart or visual treatment",
      "speakerNotes": "Concise notes explaining how to present this slide"
    }
  ]
}

Required slide progression:
1. Title and hook
2. Problem or opportunity
3. Core creative concept
4. Story and world
5. Target audience
6. Unique differentiation
7. Experience and production model
8. Marketing and distribution
9. Roadmap and success measures
10. Closing vision and call to action

Rules:
- Return exactly ten slides.
- Number slides from 1 to 10.
- Use IDs slide-1 through slide-10.
- Give every slide exactly three supporting points.
- Keep slide text presentation-ready.
- Make visual directions distinctive and achievable.
- Do not reference copyrighted artists, brands or franchises.
`.trim();
}