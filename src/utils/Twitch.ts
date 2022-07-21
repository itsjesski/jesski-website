import path from 'path';

import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';
import axios from 'axios';

const flatCache = require('flat-cache');

const cache = flatCache.load('twitch', path.resolve('public/cache/'));

export type TwitchCache = {
  status: {
    online: boolean;
    time: number;
  };
};

type TwitchSecrets = {
  client_id: string;
  client_secret: string;
};

export const twitchSecrets: TwitchSecrets = {
  client_id:
    process.env.TWITCH_CLIENT_ID != null ? process.env.TWITCH_CLIENT_ID : '',
  client_secret:
    process.env.TWITCH_CLIENT_SECRET != null
      ? process.env.TWITCH_CLIENT_SECRET
      : '',
};

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
  const currentTime = Date.now();
  const onlineStatus = await getStreamLiveStatusFromAPI('firebottletv');
  cache.setKey('status', { online: onlineStatus, time: currentTime });
  cache.save();
  return onlineStatus;
}

/**
 * This will get the online status from the cache, unless 60 seconds has passed then it pulls from the api again.
 * @returns boolean
 */
export async function getTwitchLiveStatus(): Promise<any | null> {
  const status = cache.getKey('status');

  if (status != null) {
    const currentTime = Date.now();
    const timeDiff = (currentTime - status.time) / 1000;
    const seconds = Math.round(timeDiff);

    if (seconds > 60) {
      return cacheOnlineStatus();
    }

    return status?.online;
  }

  return cacheOnlineStatus();
}
