interface GardenFrontmatter {
  title: string;
  summary: string;
  order?: number;
}

interface GardenModule {
  Content: any;
  frontmatter: GardenFrontmatter;
}

export interface GardenEntry {
  slug: string;
  href: string;
  title: string;
  summary: string;
  order: number;
  Content: GardenModule["Content"];
}

const modules = import.meta.glob("../../docs/**/*.md", { eager: true }) as Record<string, GardenModule>;

export function getGardenEntries(): GardenEntry[] {
  return Object.entries(modules)
    .map(([path, module]) => {
      const slug = path
        .replace("../../docs/", "")
        .replace(/(?:^|\/)(?:README|index)\.md$/, "")
        .replace(/\.md$/, "");

      return {
        slug,
        href: slug ? `/garden/${slug}/` : "/",
        title: module.frontmatter.title,
        summary: module.frontmatter.summary,
        order: module.frontmatter.order ?? 999,
        Content: module.Content
      };
    })
    .sort((left, right) => left.order - right.order || left.title.localeCompare(right.title));
}

export function getGardenEntry(slug: string): GardenEntry | undefined {
  return getGardenEntries().find((entry) => entry.slug === slug);
}
