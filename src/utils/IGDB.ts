import axios from 'axios';
import path from 'path';
import flatCache from 'flat-cache';
import { getTwitchAccessToken, twitchSecrets } from './Twitch';
import { Cover, Screenshots, Genres, IGDBGame } from '../types';

function loadCache() {
  return flatCache.load('igdbCache', path.resolve('public/cache/'));
}

export function getDataFromIGDBCache(key: string) {
  const cache = loadCache();
  const data = cache.getKey(key);

  if (data && data.expires > Date.now()) {
    return data.data;
  }
  return null;
}

async function cacheIGDBData(key: string, data: any, ttl = 86400000) {
  const cache = loadCache();
  cache.setKey(key, {
    data,
    time: Date.now(),
    expires: Date.now() + ttl,
  });
  cache.save();
}

export function getBigCoverImage(cover: Cover): Cover {
  if (cover == null) {
    return {
      id: 0,
      url: '',
    };
  }
  return {
    id: cover.id,
    url: cover.url.replace('t_thumb', 't_cover_big'),
  };
}

export function getBigScreenshotImage(screenshots: Screenshots): Screenshots {
  return screenshots.map((screenshot) => ({
    id: screenshot.id,
    url: screenshot.url.replace('t_thumb', 't_screenshot_big'),
  }));
}

export function getGenreString(genres: Genres): string {
  const genresMap = genres.map((item) => {
    return item.name;
  });

  return genresMap.join(', ');
}

export async function getGameByID(
  id: number,
  requested_fields: Array<any> = ['name', 'first_release_date', 'release_dates']
): Promise<IGDBGame[]> {
  const cacheKey = `game_${id}`;
  const cachedData = getDataFromIGDBCache(cacheKey);

  // Cache results for 7 days.
  if (cachedData && Date.now() - cachedData.time < 7 * 24 * 60 * 60 * 1000) {
    return cachedData.data;
  }

  const accessToken = await getTwitchAccessToken();
  const response = await axios({
    url: 'https://api.igdb.com/v4/games',
    method: 'POST',
    headers: {
      'Client-ID': twitchSecrets.client_id,
      Authorization: `Bearer ${accessToken}`,
    },
    data: `fields ${requested_fields.join(', ')}; where id = ${id};`,
  });

  const modifiedResponse = response.data.map((game: IGDBGame) => {
    // Get a random single screenshot.
    if (game.screenshots != null) {
      game.screenshots = getBigScreenshotImage(game.screenshots);
    } else {
      game.screenshots = [];
    }

    // Get big cover image.
    if (game.cover) {
      game.cover = getBigCoverImage(game.cover);
    } else {
      game.cover = { id: 0, url: '' };
    }

    return game;
  });

  await cacheIGDBData(cacheKey, { data: modifiedResponse });

  return modifiedResponse;
}
