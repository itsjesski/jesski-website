import { twitchAccessToken, igdb, where, fields } from 'ts-igdb-client';

// import config from '../../env-config';
// const twitchConfig = JSON.parse(JSON.stringify(config.twitch));

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
const accessToken = await twitchAccessToken(twitchSecrets);
const client = igdb(twitchSecrets.client_id, accessToken);

export async function getGameByName(
  name: string,
  requested_fields: '*' | [any, ...any[]] = ['name']
) {
  const { data } = await client
    .request('games')
    .pipe(fields(requested_fields), where('name', '~', name))
    .execute();

  return data[0];
}
