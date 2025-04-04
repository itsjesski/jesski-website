import path from 'path';
import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import axios from 'axios';
import flatCache from 'flat-cache';
import { TwitchSecrets } from '../types';

export const twitchSecrets: TwitchSecrets = {
  client_id: process.env.TWITCH_CLIENT_ID as string,
  client_secret: process.env.TWITCH_CLIENT_SECRET as string,
};

function loadCache() {
  return flatCache.load('twitchCache', path.resolve('public/cache/'));
}

export function getDataFromTwitchCache(key: string) {
  const cache = loadCache();
  return cache.getKey(key);
}

async function cacheTwitchData(key: string, data: any) {
  const cache = loadCache();
  cache.setKey(key, { ...data, time: Date.now() });
  cache.save();
}

export async function getTwitchAccessToken(): Promise<string> {
  if (!twitchSecrets.client_id || !twitchSecrets.client_secret) {
    // eslint-disable-next-line no-console
    console.error('Missing Twitch credentials. Check your .env file.');
    throw new Error('Missing client id');
  }

  const response = await axios({
    method: 'post',
    url: 'https://id.twitch.tv/oauth2/token',
    params: {
      client_id: twitchSecrets.client_id,
      client_secret: twitchSecrets.client_secret,
      grant_type: 'client_credentials',
    },
  });
  return response.data.access_token;
}

async function getStreamLiveStatusFromAPI(userName: string): Promise<boolean> {
  const authProvider = new ClientCredentialsAuthProvider(
    twitchSecrets.client_id,
    twitchSecrets.client_secret
  );
  const apiClient = new ApiClient({ authProvider });
  const user = await apiClient.users.getUserByName(userName);
  if (!user) {
    return false;
  }
  return (await apiClient.streams.getStreamByUserId(user.id)) !== null;
}

async function cacheOnlineStatus() {
  const onlineStatus = await getStreamLiveStatusFromAPI('Jesski');
  await cacheTwitchData('status', { online: onlineStatus });
  return onlineStatus;
}

/**
 * Pull from cache, else pull from API and cache it.
 * @returns boolean
 */
export async function getTwitchLiveStatus(): Promise<boolean> {
  const status = getDataFromTwitchCache('status') as {
    online: boolean;
    time: number;
  } | null;

  if (status && Date.now() - status.time < 60 * 1000) {
    return status.online;
  }

  return cacheOnlineStatus();
}
