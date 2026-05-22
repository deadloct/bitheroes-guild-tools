import fs from "fs";
import path from "path";

const MEDIA_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

export class ScreenshotSet {
  constructor(files) {
    this.files = files;
  }

  static fromDir(dir) {
    if (!fs.existsSync(dir)) return new ScreenshotSet([]);
    const files = fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g)$/i.test(f))
      .map((f) => path.join(dir, f))
      .filter((p) => fs.statSync(p).isFile())
      .sort();
    return new ScreenshotSet(files);
  }

  get length() {
    return this.files.length;
  }

  isEmpty() {
    return this.files.length === 0;
  }

  basenames() {
    return this.files.map((f) => path.basename(f));
  }

  toImageBlocks() {
    return this.files.map((file) => ({
      type: "image",
      source: {
        type: "base64",
        media_type: this.#mediaType(file),
        data: fs.readFileSync(file).toString("base64"),
      },
    }));
  }

  #mediaType(file) {
    const ext = path.extname(file).toLowerCase();
    const media = MEDIA_TYPES[ext];
    if (!media) throw new Error(`Unsupported file extension: ${ext}`);
    return media;
  }
}
