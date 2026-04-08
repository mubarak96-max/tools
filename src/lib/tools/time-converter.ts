export type TimeMode = "unix-to-utc" | "utc-to-unix" | "seconds-to-hms" | "hms-to-seconds" | "seconds-to-human";

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export function convertTime(input: string, mode: TimeMode) {
  try {
    switch (mode) {
      case "unix-to-utc":
        return { output: new Date(Number(input) * 1000).toUTCString() };
      case "utc-to-unix":
        return { output: Math.floor(new Date(input).getTime() / 1000).toString() };
      case "seconds-to-hms": {
        const total = Number(input);
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const seconds = Math.floor(total % 60);
        return { output: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` };
      }
      case "hms-to-seconds": {
        const [hours = "0", minutes = "0", seconds = "0"] = input.split(":");
        return { output: String(Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) };
      }
      case "seconds-to-human": {
        let total = Math.floor(Number(input));
        const days = Math.floor(total / 86400);
        total %= 86400;
        const hours = Math.floor(total / 3600);
        total %= 3600;
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        const parts = [
          days ? `${days} day${days === 1 ? "" : "s"}` : "",
          hours ? `${hours} hour${hours === 1 ? "" : "s"}` : "",
          minutes ? `${minutes} minute${minutes === 1 ? "" : "s"}` : "",
          seconds ? `${seconds} second${seconds === 1 ? "" : "s"}` : "",
        ].filter(Boolean);
        return { output: parts.join(", ") || "0 seconds" };
      }
      default:
        return { output: input };
    }
  } catch (error) {
    return {
      output: "",
      error: error instanceof Error ? error.message : "Time conversion failed.",
    };
  }
}
