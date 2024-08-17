import path from 'path';

import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import axios from 'axios';

const flatCache = require('flat-cache');

export type TwitchCache = {
  status: {
    online: boolean;
    time: number;
  };
};

type TwitchSecrets = {
  client_id: any;
  client_secret: any;
};

export const twitchSecrets: TwitchSecrets = {
  client_id: process.env.TWITCH_CLIENT_ID,
  client_secret: process.env.TWITCH_CLIENT_SECRET,
};

export function getDataFromTwitchCache(key: string) {
  const cache = flatCache.load('twitch', path.resolve('public/cache/'));
  return cache.getKey(key);
}

export async function getTwitchAccessToken(): Promise<string> {
  return axios({
    method: 'post',
    url: 'https://id.twitch.tv/oauth2/token',
    data: {
      client_id: twitchSecrets.client_id,
      client_secret: twitchSecrets.client_secret,
      grant_type: 'client_credentials',
    },
  })
    .then((response) => {
      return response.data.access_token;
    })
    .catch(() => {
      return '';
    });
}

async function getStreamLiveStatusFromAPI(
  userName: string
): Promise<Boolean | null> {
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
  const cache = flatCache.load('twitch', path.resolve('public/cache/'));
  const currentTime = Date.now();
  const onlineStatus = await getStreamLiveStatusFromAPI('Jesski');
  cache.setKey('status', { online: onlineStatus, time: currentTime });
  cache.save();
  return onlineStatus;
}

/**
 * Pull from cache, else pull from api and cache it.
 * @returns boolean
 */
export async function getTwitchLiveStatus(): Promise<any | null> {
  const cache = flatCache.load('twitch', path.resolve('public/cache/'));
  const status = cache.getKey('status');

  if (status != null && status.time != null) {
    const timeDiff = (Date.now() - status.time) / 1000;
    const seconds = Math.round(timeDiff);

    if (seconds > 60) {
      return cacheOnlineStatus();
    }

    return status?.online;
  }

  return cacheOnlineStatus();
}
