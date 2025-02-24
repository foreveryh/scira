// lib/key-rotator.ts

export class KeyRotator {
  private keys: string[];
  private currentIndex: number;
  private lastUsedTime: Map<string, number>;
  private invalidKeys: Set<string>;

  constructor(keys: string[]) {
    this.keys = keys;
    this.currentIndex = 0;
    this.lastUsedTime = new Map();
    this.invalidKeys = new Set();
  }

  public getCurrentKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No API keys available');
    }

    // 如果当前密钥无效，自动轮换到下一个
    const currentKey = this.keys[this.currentIndex];
    if (this.invalidKeys.has(currentKey)) {
      return this.rotateKey();
    }

    this.lastUsedTime.set(currentKey, Date.now());
    return currentKey;
  }

  public rotateKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No API keys available');
    }

    // 尝试找到下一个有效的密钥
    let attempts = 0;
    let key: string;
    
    do {
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      key = this.keys[this.currentIndex];
      attempts++;

      if (attempts > this.keys.length) {
        throw new Error('No valid API keys available');
      }
    } while (this.invalidKeys.has(key));

    this.lastUsedTime.set(key, Date.now());
    return key;
  }

  public markKeyAsInvalid(key: string): void {
    this.invalidKeys.add(key);
    // 如果当前密钥被标记为无效，自动轮换到下一个
    if (this.keys[this.currentIndex] === key) {
      try {
        this.rotateKey();
      } catch (error) {
        console.error('Failed to rotate to next key:', error);
      }
    }
  }

  public addKey(key: string): void {
    if (!this.keys.includes(key)) {
      this.keys.push(key);
      this.invalidKeys.delete(key); // 新添加的密钥默认为有效
    }
  }

  public removeKey(key: string): void {
    const index = this.keys.indexOf(key);
    if (index !== -1) {
      this.keys.splice(index, 1);
      this.lastUsedTime.delete(key);
      this.invalidKeys.delete(key);
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

  public getValidKeys(): string[] {
    return this.keys.filter(key => !this.invalidKeys.has(key));
  }
}

// 创建一个单例实例来管理 Tavily API Keys
export const tavilyKeyRotator = new KeyRotator(
  process.env.TAVILY_API_KEYS?.split(',').filter(Boolean) || [process.env.TAVILY_API_KEY || '']
);