// lib/key-rotator.ts

export class KeyRotator {
  private keys: string[];
  private currentIndex: number;
  private lastUsedTime: Map<string, number>;

  constructor(keys: string[]) {
    this.keys = keys;
    this.currentIndex = 0;
    this.lastUsedTime = new Map();
  }

  public getCurrentKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No API keys available');
    }

    const key = this.keys[this.currentIndex];
    this.lastUsedTime.set(key, Date.now());
    return key;
  }

  public rotateKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No API keys available');
    }

    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    const key = this.keys[this.currentIndex];
    this.lastUsedTime.set(key, Date.now());
    return key;
  }

  public addKey(key: string): void {
    if (!this.keys.includes(key)) {
      this.keys.push(key);
    }
  }

  public removeKey(key: string): void {
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keys.splice(index, 1);
      this.lastUsedTime.delete(key);
      if (this.currentIndex >= this.keys.length) {
        this.currentIndex = 0;
      }
    }
  }

  public getLastUsedTime(key: string): number | undefined {
    return this.lastUsedTime.get(key);
  }

  public getAllKeys(): string[] {
    return [...this.keys];
  }
}

// 创建一个单例实例来管理 Tavily API Keys
export const tavilyKeyRotator = new KeyRotator(
  process.env.TAVILY_API_KEYS?.split(',').filter(Boolean) || [process.env.TAVILY_API_KEY || '']
);