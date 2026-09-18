import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const file = new URL("../data/sponsors.public.json", import.meta.url);
const records = JSON.parse(await readFile(file, "utf8"));
const today = new Date().toISOString().slice(0, 10);
const shouldWrite = process.argv.includes("--write");

async function check(record) {
  const url = record.fields["Official Sponsorship URL"];
  if (!url) return { id: record.id, company: record.fields["Company Name"], status: "missing-url" };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "EngineeringSponsorNetwork/0.1 sponsor-link-check" },
    });
    if (response.ok && shouldWrite) record.fields["Last Checked"] = today;
    return { id: record.id, company: record.fields["Company Name"], status: response.status, finalUrl: response.url };
  } catch (error) {
    return { id: record.id, company: record.fields["Company Name"], status: "error", error: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

const results = [];
for (let index = 0; index < records.length; index += 5) {
  results.push(...await Promise.all(records.slice(index, index + 5).map(check)));
}

if (shouldWrite) await writeFile(file, `${JSON.stringify(records, null, 2)}\n`, "utf8");
console.table(results.map(({ company, status, finalUrl }) => ({ company, status, finalUrl: finalUrl || "" })));
const failures = results.filter(result => result.status === "error" || result.status === "missing-url" || Number(result.status) >= 400);
console.log(`Checked ${results.length} sponsor links; ${failures.length} need review.${shouldWrite ? ` Reachable records were stamped ${today}.` : " Run with --write to update reachable records."}`);
process.exitCode = failures.length ? 1 : 0;
