# fitcheck: v1 spec

## Goal

Single-page web app: the user pastes their resume text and a job description, clicks "Analyze" and gets an AI-generated fit report (score, met and missing requirements, missing keywords and rewrite suggestions).

Portfolio project: simple, visually polished, clean code.

## Keep it minimal

This is the most important rule of the project. Build the **smallest version that works and looks good**.

- Only the libraries listed in Stack. No component libraries, no state management libraries, no i18n libraries, no testing frameworks in v1.
- Few files. Do not create abstractions, helpers, hooks or config layers that are used only once.
- Plain React state (`useState`) is enough.
- If something is not described in this spec, do not build it.
- When in doubt between two approaches, pick the simpler one.

## Language rules

- **Everything that goes to GitHub is in English:** code, variable names, comments, commit messages, README, `.env.example`, file names.
- The **interface** has an EN / PT toggle (see "Language toggle").

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS**
- **lucide-react** for icons
- **`openai` SDK** (npm) pointing to an OpenAI-compatible gateway via `baseURL`
- **zod** to validate the model response
- Deploy: **Vercel** (optional in v1)

## Environment variables

`.env.local` (NEVER commit; must be in `.gitignore` from the first commit). Also create a `.env.example` with no real values.

```
LLM_API_KEY=
LLM_BASE_URL=
LLM_MODEL=
APP_PASSWORD=        # optional; if set, the API requires this password
```

## Main security rule

The API key **only exists on the server**. The browser never calls the gateway directly: it calls the internal route `/api/analyze`, which reads the key from environment variables. No variable holding the key may use the `NEXT_PUBLIC_` prefix.

## Structure

```
app/
  page.tsx                 # single page
  api/analyze/route.ts     # POST: receives { resume, job, lang, password? }, calls the LLM, returns validated JSON
lib/
  prompt.ts                # system prompt + message builder
  schema.ts                # zod schema for the result
  llm.ts                   # OpenAI client configured with baseURL
  i18n.ts                  # UI strings in en and pt (plain object)
components/
  InputForm.tsx            # two textareas + buttons
  ScoreBar.tsx             # fit score (0 to 100)
  RequirementsList.tsx     # requirements with status met / partial / gap
  KeywordChips.tsx         # missing keywords
  RewriteSuggestions.tsx   # before and after
  LanguageToggle.tsx       # EN / PT switch
examples/
  resume-en.md, job-en.md  # FICTIONAL persona + job, for the demo (English)
  resume-pt.md, job-pt.md  # same idea in Portuguese
```

## Language toggle

- Small EN / PT switch in the header.
- Initial language: from `navigator.language` (`pt*` → PT, otherwise EN). Save the choice in `localStorage`.
- All UI strings come from `lib/i18n.ts`: one object with `en` and `pt` keys and the same structure in both. No library.
- The selected language is sent to the API as `lang`, and the model writes the report in that language.
- "Load example" loads the example files for the current language.
- Switching language after a result is shown changes the interface only; the report keeps its language until the next analysis.

## Output contract (JSON)

The model must reply with **only** this JSON, no text before or after and no markdown fences. Keys are always in English; text values follow `lang`.

```json
{
  "score": 0,
  "summary": "string, 2 to 3 sentences",
  "requirements": [
    {
      "item": "string",
      "status": "met | partial | gap",
      "evidence": "string: excerpt from the resume that proves it (empty if gap)",
      "suggestion": "string: how to close the gap (empty if met)"
    }
  ],
  "missing_keywords": ["string"],
  "rewrites": [
    { "original": "string: sentence from the resume", "suggested": "string" }
  ]
}
```

Validate with zod in `lib/schema.ts`. In the route, before `JSON.parse`, strip any ```` ```json ```` fences just in case (not every gateway model honors `response_format`).

## Prompt (`lib/prompt.ts`)

- **System prompt:** analysis logic of a resume × job matching agent, ending with the instruction to reply only in the JSON format above. Keep it isolated in this file so it is easy to replace later.
- Tell the model which language to write in, based on `lang`.
- **User message:** resume and job separated by clear delimiters, e.g. `<resume>...</resume>` and `<job>...</job>`.
- The model must **not invent** experience that is not in the resume; rewrites only rephrase what already exists.
- The model must **not use em dashes (U+2014) or emojis** in its output.
- Low temperature (e.g. 0.2).

## Visual direction

The interface should look made by a person with intention, not like a generic AI app template.

### Concept: the highlighter

The screen mimics someone reviewing a resume with highlighter pens. This is the one memorable element: in the result, each requirement gets a colored "highlight" behind the text (green = met, yellow = partial, pink = gap), like a hand-drawn mark (slight skew or irregular edge, done with CSS). Everything else stays quiet so this detail stands out.

### Palette

| Name | Hex | Use |
|---|---|---|
| Paper | `#F5F6F8` | page background (cool grey, not cream) |
| Sheet | `#FFFFFF` | text areas and result block |
| Ink | `#1C2333` | main text (dark navy, not pure black) |
| Pen | `#2747D4` | primary button, links, focus |
| Green highlight | `#C6EFB0` | met |
| Yellow highlight | `#FFE680` | partial |
| Pink highlight | `#FFC2C7` | gap |

Dark mode: swap paper and ink (background `#151A26`, text `#E8EAF0`) and darken the highlights while keeping readable contrast.

### Typography

- Headings and score: **Bricolage Grotesque** (Google Fonts), weight 600 to 700.
- Body, fields and lists: **Atkinson Hyperlegible** (Google Fonts).
- Clear scale (e.g. 14 / 16 / 20 / 28 / 44 px). Text lines at most ~75 characters.
- Sentence case everywhere. No ALL CAPS.

### Layout

- Left-aligned content, centered column with max width (~1100px).
- Top: project name, one sentence on what it does, language toggle. No giant hero.
- Input: two fields side by side on desktop, stacked on mobile.
- Result: one continuous "reviewed sheet" block (score, summary, highlighted requirements, keywords, rewrites), separated by spacing and headings, not by many identical cards.
- Score as a horizontal bar filled up to the value, with the big number next to it.
- Rewrites: original sentence lightly struck through in grey, suggestion right below in normal ink.

### Icons

- Use **lucide-react** (SVG icons). No PNGs, no emojis.
- Few icons, only where they help: requirement status (`CircleCheck`, `CircleDashed`, `CircleX`), copy suggestion (`Copy`), load example (`FileText`), language (`Languages`). Size 16 to 18px, consistent stroke.

### Motion

- One single animated moment: when the result arrives, the highlights "paint" left to right in sequence. No fade-in on every section.
- Respect `prefers-reduced-motion`.

### Forbidden

- Emojis anywhere (UI, README, comments, commits).
- Em dashes (U+2014) in any text: UI, README, comments. Use commas, colons or periods.
- Decorative gradients, purple/violet, glassmorphism, glows.
- Sparkle icons, phrases like "Powered by AI" or "AI magic".
- Arrow characters in button and link text.
- Small uppercase labels above headings.
- Grids of identical cards with the same shadow and radius.
- Monospace font for labels or numbers.

### UI copy

- Plain language, active voice, no marketing phrases, in both EN and PT.
- Buttons say what they do: "Analyze" / "Analisar", "Load example" / "Carregar exemplo", "Copy suggestion" / "Copiar sugestão".
- Errors explain what happened and how to fix it, without apologizing.

## Page (`app/page.tsx`)

1. Header: project name, one-line description, language toggle.
2. Two textareas: "Your resume" / "Seu currículo" and "Job description" / "Descrição da vaga".
3. "Load example" button.
4. Optional password field (only used if `APP_PASSWORD` is set).
5. "Analyze" button with loading state.
6. Result below, following the visual direction.
7. Small footer note: "Nothing is stored. Your text is sent to the model only for the analysis." (and PT version).

Accessibility: visible keyboard focus, adequate contrast, labels on fields.

## Error handling

- Empty or very short fields: error on the front end, no API call.
- Input size limit (e.g. 15,000 characters per field) checked on the front end and in the route.
- Gateway failure, timeout or invalid JSON: "The analysis could not be completed. Try again in a moment." (and PT version), plus a server log.
- Wrong password: 401 with a clear message.

## Out of scope for v1

PDF upload, saved profile, login/accounts, analysis history, per-IP rate limit, full tailored resume generation, database, tests. All of this goes to a "Next steps" section in the README.

## README

- What the project does (1 paragraph) + demo GIF using the fictional persona.
- Stack and technical decisions: key only on the server, structured output validated with zod, OpenAI-compatible gateway via `baseURL`, lightweight i18n without libraries.
- How to run locally (`npm install`, copy `.env.example` to `.env.local`, `npm run dev`).
- Origin: started as a personal agent I used day to day and became a product.
- Next steps.
- Same text rules: no emojis, no em dashes.

## Working rules (for the coding agent)

### Task completion
- NEVER use attempt_completion to report progress, partial findings or the next step. For that, just keep working.
- Only use attempt_completion when every item in "Done when" is satisfied and `npm run build` passes with no errors.
- Do not ask whether you should continue: the answer is always yes.
- Every response must end with a tool call (read, write, run). Never reply with text only.
- Do not read the same large file more than once in the same task.
- Do not add anything outside this spec. If a decision is not covered here, choose the simplest option and move on.

## Done when

- [ ] `npm run dev` works from scratch following the README
- [ ] `npm run build` passes with no errors
- [ ] Analyzing the example returns a correctly rendered result, in EN and in PT
- [ ] Language toggle switches all UI text and is remembered on reload
- [ ] Errors handled (empty fields, API failure, invalid JSON)
- [ ] No secrets in the repo (clean `git log`, `.env.local` ignored)
- [ ] No emojis or em dashes in code, UI or README
- [ ] All code, comments and docs in English
- [ ] README with GIF and next steps
- [ ] Layout ok on desktop and mobile, in light and dark mode
