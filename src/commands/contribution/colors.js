const ANSI = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
};

function colorEnabled() {
  if (process.env.NO_COLOR) return false;
  return Boolean(process.stdout.isTTY);
}

export function makeColorizer(thresholds) {
  const enabled = colorEnabled();
  return (weekly, text) => {
    if (!enabled) return text;
    if (weekly >= thresholds.green) return `${ANSI.green}${text}${ANSI.reset}`;
    if (weekly >= thresholds.yellow) return `${ANSI.yellow}${text}${ANSI.reset}`;
    return `${ANSI.red}${text}${ANSI.reset}`;
  };
}
