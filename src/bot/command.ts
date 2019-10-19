export interface Command {
  matches(name: string): boolean;
  process(...args: string[]): void;
}
