import axios from 'axios';
import igdb from 'igdb-api-node';

type TwitchSecrets = {
  client_id: string;
  client_secret: string;
};

const twitchSecrets: TwitchSecrets = {
  client_id:
    process.env.TWITCH_CLIENT_ID != null ? process.env.TWITCH_CLIENT_ID : '',
  client_secret:
    process.env.TWITCH_CLIENT_SECRET != null
      ? process.env.TWITCH_CLIENT_SECRET
      : '',
};

async function getTwitchAccessToken(): Promise<string | undefined> {
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

export async function getGameByName(
  name: string,
  requested_fields: '*' | [any, ...any[]] = ['name']
): Promise<any> {
  const accessToken = await getTwitchAccessToken();
  const client = await igdb(twitchSecrets.client_id, accessToken);
  const cleanName = decodeURIComponent(name);
  const response = await client
    .fields(requested_fields)
    .search(cleanName)
    .request('/games');

  return response.data;
}
