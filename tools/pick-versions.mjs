// Picks the newest version of each dependency that has been on npm for >= 7 days,
// so we never pull a brand-new (unvetted) release.
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const MIN_AGE_DAYS = 7;
const cutoff = Date.now() - MIN_AGE_DAYS * 86_400_000;

const pkgs = [
  "sanity",
  "next-sanity",
  "@sanity/vision",
  "@sanity/image-url",
  "@portabletext/react",
  "styled-components",
  "@sanity/client",
];

for (const pkg of pkgs) {
  const { stdout } = await run("npm", ["view", pkg, "time", "--json"], { shell: true, maxBuffer: 1 << 26 });
  const times = JSON.parse(stdout);
  const stable = Object.entries(times)
    .filter(([v]) => /^\d+\.\d+\.\d+$/.test(v))
    .map(([v, d]) => ({ v, t: Date.parse(d) }))
    .sort((a, b) => a.t - b.t);
  const eligible = stable.filter((x) => x.t <= cutoff);
  const newest = stable.at(-1);
  const pick = eligible.at(-1);
  const age = (t) => ((Date.now() - t) / 86_400_000).toFixed(1);
  console.log(
    `${pkg.padEnd(24)} pick=${pick.v.padEnd(10)} (${age(pick.t)}d)   newest=${newest.v} (${age(newest.t)}d)`
  );
}
