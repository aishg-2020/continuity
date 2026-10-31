// Windows caps command lines at ~8k characters, so very large commits run the
// tools over the whole project instead of passing every staged path.
const MAX_FILES = 40;

const quote = (files) => files.map((file) => `"${file}"`).join(" ");

const config = {
  "*.{ts,tsx,mjs,js}": (files) =>
    files.length > MAX_FILES
      ? ["eslint --fix .", "prettier --write ."]
      : [`eslint --fix ${quote(files)}`, `prettier --write ${quote(files)}`],
  "*.{json,md,css,yml,yaml}": (files) =>
    files.length > MAX_FILES ? ["prettier --write ."] : [`prettier --write ${quote(files)}`],
};

export default config;
