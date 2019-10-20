export interface Command {
  matches(name: string): boolean;
  process(...args: string[]): Promise<void>;
}
