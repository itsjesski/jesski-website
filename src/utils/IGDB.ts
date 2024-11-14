import axios from 'axios';
import { getTwitchAccessToken, twitchSecrets } from './Twitch';

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
  requested_fields: Array<any> = ['name']
): Promise<IGDBGame[]> {
  const cleanName = decodeURIComponent(name);
  const accessToken = await getTwitchAccessToken();

  const response = await axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Client-ID': twitchSecrets.client_id,
      Authorization: `Bearer ${accessToken}`,
    },
    data: `fields ${requested_fields.join(',')}; where name = "${cleanName}";`,
  });

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

export async function getGameByID(
  id: number,
  requested_fields: Array<any> = ['name']
): Promise<IGDBGame[]> {
  const accessToken = await getTwitchAccessToken();
  const response = await axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Client-ID': twitchSecrets.client_id,
      Authorization: `Bearer ${accessToken}`,
    },
    data: `fields ${requested_fields.join(',')}; where id = ${id};`,
  });

  const modifiedResponse = response.data[0];

  if (modifiedResponse == null) {
    // eslint-disable-next-line no-console
    console.log(`${id} could not be found in API!`);
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
