import { ChangelogEntry } from "./Changelog";
import { ChangelogReader } from "./ChangelogReader";
import { ChangelogParser } from "./ChangelogParser";

export class Action {
  constructor(private readonly basedir: string) { }

  async run(
    version?: string,
    path?: string
  ): Promise<ChangelogEntry | undefined> {
    const changelogContent = await new ChangelogReader(this.basedir)
      .readChangelog(path);
    const changelog = ChangelogParser.parseChangelog(changelogContent);
    return version !== undefined
      ? changelog.getByVersion(version)
      : changelog.getLatestVersion();
  }

  async getLastEntry(path?: string): Promise<ChangelogEntry | undefined> {
    const changelogContent = await new ChangelogReader(this.basedir)
      .readChangelog(path);
    const changelog = ChangelogParser.parseChangelog(changelogContent);
    return changelog.getLastEntry();
  }
}
