import config from "../../data/public/editorial.json";
import { validateEditorial } from "../../scripts/lib/editorial.mjs";
const errors = validateEditorial(config);
if (errors.length) throw new Error(errors.join("\n"));
interface EditorialConfig {
  featuredSlug: string | null;
  featuredNote: string | null;
  featuredNotes?: Record<string, string | null>;
  recentLimit: number;
  previewRecentSlugs: string[];
  homeSelectionIds: string[];
  showStats: boolean;
  selections: {
    id: string;
    title: string;
    description: string;
    rule: string;
    filmSlugs: string[];
    localized?: Record<string, { title?: string; description?: string }>;
  }[];
}
export const editorial = config as EditorialConfig;
