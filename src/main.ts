import * as core from '@actions/core';
import { Action } from './Action';
import type { ChangelogEntry } from './Changelog';

async function run(): Promise<void> {
  const path = core.getInput('path') || undefined;
  const version = core.getInput('version') || undefined;

  core.startGroup('Parse CHANGELOG');
  const entry = await new Action().run(version, path);
  core.info(`Version: "${entry?.version ?? ""}"`);
  core.info(`  Major: "${entry?.versionMajor ?? ""}"`);
  core.info(`  Minor: "${entry?.versionMinor ?? ""}"`);
  core.info(`  Patch: "${entry?.versionPatch ?? ""}"`);
  core.info(`Date: "${entry?.date ?? ""}"`);
  core.info(`Status: "${entry?.status ?? ""}"`);
  core.info(`Description:\n${entry?.description ?? ""}\n`);

  let unreleasedEntry: ChangelogEntry | undefined;
  if (version !== undefined) {
    unreleasedEntry = await new Action().run('unreleased', path);
    core.info(`Unreleased Version: "${unreleasedEntry?.version ?? ""}"`);
    core.info(`  Major: "${unreleasedEntry?.versionMajor ?? ""}"`);
    core.info(`  Minor: "${unreleasedEntry?.versionMinor ?? ""}"`);
    core.info(`  Patch: "${unreleasedEntry?.versionPatch ?? ""}"`);
    core.info(`Date: "${unreleasedEntry?.date ?? ""}"`);
    core.info(`Status: "${unreleasedEntry?.status ?? ""}"`);
    core.info(`Description:\n${unreleasedEntry?.description ?? ""}\n`);
  }

  core.endGroup();

  core.setOutput('version', entry?.version ?? "");
  core.setOutput('versionMajor', entry?.versionMajor ?? "");
  core.setOutput('versionMinor', entry?.versionMinor ?? "");
  core.setOutput('versionPatch', entry?.versionPatch ?? "");
  core.setOutput('date', entry?.date ?? "");
  core.setOutput('status', entry?.status ?? "");
  core.setOutput('description', entry?.description ?? "");

  if (unreleasedEntry !== undefined) {
    core.setOutput('unreleased', JSON.stringify({
      version: unreleasedEntry.version ?? "",
      status: unreleasedEntry.status ?? "",
      description: unreleasedEntry.description ?? ""
    }));
  }
}

async function main(): Promise<void> {
  try {
    await run();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(message);
  }
}

main();
