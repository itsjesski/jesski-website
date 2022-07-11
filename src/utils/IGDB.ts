import axios from 'axios';
import igdb from 'igdb-api-node';

type TwitchSecrets = {
  client_id: string;
  client_secret: string;
};

export type Genres = [
  {
    id: number;
    name: string;
  }
];

export type Cover = {
  id: number;
  url: string;
};

export type Screenshots = [
  {
    id: number;
    url: string;
  }
];

export type IGDBGame = {
  id: number;
  name: string;
  cover: Cover;
  genres: Genres;
  screenshots: Screenshots;
  videos: number[];
  aggregated_rating: number;
  summary: string;
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

export function getBigCoverImage(cover: Cover): Cover {
  if (cover == null) {
    return {
      id: 0,
      url: '',
    };
  }
  const modifiedCover = cover;
  modifiedCover.url = cover.url.replace('t_thumb', 't_cover_big');

  return cover;
}

export function getBigScreenshotImage(
  screenshotsArray: Screenshots
): Screenshots {
  if (screenshotsArray == null) {
    return [
      {
        id: 0,
        url: '',
      },
    ];
  }

  const modifiedScreenshots =
    screenshotsArray[Math.floor(Math.random() * screenshotsArray.length)];
  modifiedScreenshots.url = modifiedScreenshots.url.replace(
    't_thumb',
    't_screenshot_huge'
  );

  return [modifiedScreenshots];
}

export async function getGameByName(
  name: string,
  requested_fields: '*' | [any, ...any[]] = ['name']
): Promise<IGDBGame[]> {
  const accessToken = await getTwitchAccessToken();
  const client = await igdb(twitchSecrets.client_id, accessToken);
  const cleanName = decodeURIComponent(name);
  const response = await client
    .fields(requested_fields)
    .search(cleanName)
    .request('/games');

  const modifiedResponse = response.data[0];

  if (modifiedResponse == null) {
    // eslint-disable-next-line no-console
    console.log(`${name} could not be found in API!`);
    return [];
  }

  // Get a random single screenshot.
  if (modifiedResponse.screenshots != null) {
    modifiedResponse.screenshots = getBigScreenshotImage(
      modifiedResponse.screenshots
    );
  } else {
    modifiedResponse.screenshots = [];
  }

  // Get big cover image.
  if (modifiedResponse.cover) {
    modifiedResponse.cover = getBigCoverImage(modifiedResponse.cover);
  } else {
    modifiedResponse.cover = [];
  }

  return [modifiedResponse];
}

export function getGenreString(genres: Genres): string {
  const genresMap = genres.map((item) => {
    return item.name;
  });

  return genresMap.join(', ');
}
