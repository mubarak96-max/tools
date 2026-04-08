export type RandomMode =
  | "password"
  | "string"
  | "number"
  | "uuid"
  | "date"
  | "time"
  | "pick-item";

function randomString(length: number, alphabet: string) {
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export function generateRandom(mode: RandomMode, options: {
  length: number;
  min: number;
  max: number;
  items: string;
}) {
  switch (mode) {
    case "password":
      return randomString(options.length, "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*");
    case "string":
      return randomString(options.length, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    case "number":
      return String(Math.floor(Math.random() * (options.max - options.min + 1)) + options.min);
    case "uuid":
      return crypto.randomUUID();
    case "date": {
      const start = new Date("2020-01-01").getTime();
      const end = new Date("2030-12-31").getTime();
      return new Date(start + Math.random() * (end - start)).toISOString().slice(0, 10);
    }
    case "time":
      return `${Math.floor(Math.random() * 24).toString().padStart(2, "0")}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`;
    case "pick-item": {
      const items = options.items.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
      if (!items.length) {
        return "";
      }
      return items[Math.floor(Math.random() * items.length)] || "";
    }
    default:
      return "";
  }
}
