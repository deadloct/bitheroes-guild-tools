import Anthropic from "@anthropic-ai/sdk";

const EXTRACTION_PROMPT = `These are screenshots from the mobile game Bit Heroes, showing a guild's "CONTRIBUTION" leaderboard. Each row contains a member's username (left) and their cumulative contribution total in experience points (right, formatted with commas like 1,234,567,000).

The screenshots are paginated views of the same leaderboard — members may appear across multiple screenshots, sometimes partially clipped at the top or bottom of an image.

Extract every visible member with their contribution total. Deduplicate (the same member appearing on multiple screenshots should appear once with their best-readable value). Skip any partially-clipped rows where you cannot read either the full name or the full number.

Return ONLY a JSON array, no other text, no markdown fences, formatted like:
[
  {"name": "MemberName", "contribution": 1234567890}
]

The contribution must be an integer (no commas, no formatting). Sort by contribution descending.`;

export class Extractor {
  constructor({ client = new Anthropic(), model = "claude-opus-4-7" } = {}) {
    this.client = client;
    this.model = model;
  }

  async extract(screenshots) {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 16000,
      thinking: { type: "adaptive" },
      messages: [
        {
          role: "user",
          content: [
            ...screenshots.toImageBlocks(),
            { type: "text", text: EXTRACTION_PROMPT },
          ],
        },
      ],
    });

    const members = this.#parseMembers(this.#extractText(response));
    members.sort((a, b) => b.contribution - a.contribution);
    return { members, usage: response.usage };
  }

  #extractText(response) {
    const block = response.content.find((b) => b.type === "text");
    if (!block) throw new Error("No text block in Claude API response");
    return block.text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "");
  }

  #parseMembers(text) {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Failed to parse JSON from Claude API response:\n${text}`);
    }
    if (!Array.isArray(data)) {
      throw new Error(`Expected JSON array, got ${typeof data}`);
    }
    return data;
  }
}
