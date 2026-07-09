export function buildCreativePrompt(idea: string) {
  return `
You are MuseOS, an AI creative operating system.

Turn this user idea into a structured creative universe:

"${idea}"

Return ONLY valid JSON. No markdown. No explanation.

JSON shape:
{
  "title": "string",
  "idea": "string",
  "dna": {
    "genre": "string",
    "tone": "string",
    "audience": "string",
    "mood": "string",
    "colors": ["string", "string", "string"]
  },
  "sections": [
    { "title": "Story", "text": "string" },
    { "title": "Characters", "text": "string" },
    { "title": "Visual Style", "text": "string" },
    { "title": "Marketing", "text": "string" }
  ],
  "agents": [
    { "role": "Writer", "status": "complete", "message": "string" },
    { "role": "Art Director", "status": "complete", "message": "string" },
    { "role": "Producer", "status": "complete", "message": "string" },
    { "role": "Marketing Strategist", "status": "complete", "message": "string" }
  ],
  "outputs": {
    "pitchSummary": "string",
    "storyboard": "string",
    "socialCampaign": "string",
    "projectBrief": "string"
  },
  "nodes": [
    { "id": "core", "title": "string", "subtitle": "string", "type": "core", "x": 50, "y": 50 },
    { "id": "story", "title": "Story", "subtitle": "string", "type": "story", "x": 50, "y": 18 },
    { "id": "characters", "title": "Characters", "subtitle": "string", "type": "character", "x": 22, "y": 40 },
    { "id": "world", "title": "World", "subtitle": "string", "type": "world", "x": 78, "y": 40 },
    { "id": "visual", "title": "Visual Style", "subtitle": "string", "type": "visual", "x": 28, "y": 75 },
    { "id": "marketing", "title": "Marketing", "subtitle": "string", "type": "marketing", "x": 72, "y": 75 }
  ],
  "edges": [
    { "from": "core", "to": "story" },
    { "from": "core", "to": "characters" },
    { "from": "core", "to": "world" },
    { "from": "core", "to": "visual" },
    { "from": "core", "to": "marketing" }
  ]
}

Rules:
- Keep text concise but specific.
- Make the concept feel original and commercially useful.
- Make agent messages sound like different creative experts.
- The result should feel suitable for a hackathon demo.
`;
}