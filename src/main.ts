import * as core from '@actions/core';
import { Action } from './Action';
import type { ChangelogEntry } from './Changelog';

async function run(): Promise<void> {
  const path = core.getInput('path') || undefined;
  const version = core.getInput('version') || undefined;

  core.startGroup('Parse CHANGELOG');
  const action = new Action('.');
  const entry = await action.run(version, path);
  core.info(`Version: "${entry?.version ?? ""}"`);
  core.info(`  Major: "${entry?.versionMajor ?? ""}"`);
  core.info(`  Minor: "${entry?.versionMinor ?? ""}"`);
  core.info(`  Patch: "${entry?.versionPatch ?? ""}"`);
  core.info(`Date: "${entry?.date ?? ""}"`);
  core.info(`Status: "${entry?.status ?? ""}"`);
  core.info(`Description:\n${entry?.description ?? ""}\n`);

  // Always check for unreleased section, but only output if version input is not 'unreleased'
  let unreleasedEntry: ChangelogEntry | undefined;
  try {
    unreleasedEntry = await action.run('unreleased', path);
  } catch {
    // No unreleased section in changelog
    unreleasedEntry = undefined;
  }

  // Get last entry (the last physical entry in the changelog file)
  const lastEntry = await action.getLastEntry(path);

  const hasUnreleased = unreleasedEntry !== undefined;
  const isUnreleasedRequested = version?.toLowerCase() === 'unreleased';

  if (hasUnreleased) {
    core.info(`Has Unreleased section: ${hasUnreleased}`);
    if (!isUnreleasedRequested) {
      core.info(`Unreleased Version: "${unreleasedEntry?.version ?? ""}"`);
      core.info(`Status: "${unreleasedEntry?.status ?? ""}"`);
      core.info(`Description:\n${unreleasedEntry?.description ?? ""}\n`);
    }
  } else {
    core.info('No Unreleased section in changelog');
  }

  core.info(`Last Entry Version: "${lastEntry?.version ?? ""}"`);
  core.info(`Last Entry Status: "${lastEntry?.status ?? ""}"`);
  core.info(`Last Entry Description:\n${lastEntry?.description ?? ""}\n`);

  core.endGroup();

  // Set main outputs
  core.setOutput('version', entry?.version ?? "");
  core.setOutput('versionMajor', entry?.versionMajor ?? "");
  core.setOutput('versionMinor', entry?.versionMinor ?? "");
  core.setOutput('versionPatch', entry?.versionPatch ?? "");
  core.setOutput('date', entry?.date ?? "");
  core.setOutput('status', entry?.status ?? "");
  core.setOutput('description', entry?.description ?? "");

  // Set unreleased outputs only if version input is not 'unreleased'
  core.setOutput('hasUnreleased', hasUnreleased.toString());
  if (!isUnreleasedRequested) {
    core.setOutput('unreleasedVersion', unreleasedEntry?.version ?? "");
    core.setOutput('unreleasedStatus', unreleasedEntry?.status ?? "");
    core.setOutput('unreleasedDescription', unreleasedEntry?.description ?? "");
  } else {
    // Clear unreleased outputs when requesting unreleased version
    core.setOutput('unreleasedVersion', "");
    core.setOutput('unreleasedStatus', "");
    core.setOutput('unreleasedDescription', "");
  }

  // Set last entry outputs
  core.setOutput('lastVersion', lastEntry?.version ?? "");
  core.setOutput('lastVersionMajor', lastEntry?.versionMajor ?? "");
  core.setOutput('lastVersionMinor', lastEntry?.versionMinor ?? "");
  core.setOutput('lastVersionPatch', lastEntry?.versionPatch ?? "");
  core.setOutput('lastDate', lastEntry?.date ?? "");
  core.setOutput('lastStatus', lastEntry?.status ?? "");
  core.setOutput('lastDescription', lastEntry?.description ?? "");
}

async function main(): Promise<void> {
  try {
    await run();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(message);
  }
}

void main();
