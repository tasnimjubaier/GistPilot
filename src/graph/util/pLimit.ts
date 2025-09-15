export function pLimit(concurrency: number) {
    const queue: (() => Promise<void>)[] = [];
    let active = 0;
  
    const next = () => {
      if (active >= concurrency) return;
      const fn = queue.shift();
      if (!fn) return;
      active++;
      fn().finally(() => {
        active--;
        next();
      });
    };
  
    return function <T>(task: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        queue.push(async () => {
          try { resolve(await task()); } catch (e) { reject(e); }
        });
        next();
      });
    };
  }
  