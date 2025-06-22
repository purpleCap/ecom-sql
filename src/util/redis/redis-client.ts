import { createClient } from 'redis';

export const DEFAULT_EXPIRATION = 100;

export const client = createClient();

client.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  if (!client.isReady) {
    await client.connect();
    console.log('✅ Redis connected');
  }
}

export function getOrSetCache(key: string, cb: Function) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await client.GET(key);
      console.log(key, data)
      if(data) {
        resolve(JSON.parse(data));
        return;
      }

      const freshData = await cb();
      client.SETEX(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
      resolve(freshData);
    } catch(err) {
      return reject(err);
    }
  })
}