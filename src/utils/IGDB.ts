import { twitchAccessToken, igdb, where, fields } from 'ts-igdb-client';

import config from '../../env-config';

const twitchConfig = JSON.parse(JSON.stringify(config.twitch));
const twitchSecrets = {
  client_id: twitchConfig.client_id,
  client_secret: twitchConfig.client_secret,
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
