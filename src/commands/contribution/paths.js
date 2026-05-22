import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(here, "..", "..", "..");
export const SCREENSHOTS_DIR = path.join(REPO_ROOT, "screenshots");
export const PROCESSED_DIR = path.join(SCREENSHOTS_DIR, "processed");
export const HISTORY_DIR = path.join(REPO_ROOT, "history");
