import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const [resumeEn, jobEn, resumePt, jobPt] = await Promise.all(
    ["resume-en", "job-en", "resume-pt", "job-pt"].map(name =>
      readFile(path.join(process.cwd(), "examples", `${name}.md`), "utf8")),
  );
  return Response.json({
    passwordRequired: Boolean(process.env.APP_PASSWORD),
    examples: { en: { resume: resumeEn, job: jobEn }, pt: { resume: resumePt, job: jobPt } },
  }, { headers: { "Cache-Control": "no-store" } });
}