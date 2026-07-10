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