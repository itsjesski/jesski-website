/* eslint-disable no-console */
/* eslint-disable func-names */

/**
 * This file is a really rough script meant to parse a google sheets csv and turn it into markdown files, while fetching data from igdb.
 * It's was built as a one time first import solution.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import * as csv from 'fast-csv';

import { getGameByName } from '../utils/IGDB';

const fs = require('fs');

function sleep(ms: number | undefined) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function convertToSlug(Text: string) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

function formatDate(date: string | number | Date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

async function writeGameMDFile(game: any) {
  try {
    const slug = convertToSlug(game.Game);

    // Don't create of overwrite files that are already there.
    // if (fs.existsSync(`./_games/${slug}.md`)) {
    //   return;
    // }

    const igdb = await getGameByName(game.Game, [
      'id',
      'cover.url',
      'screenshots.url',
    ]);

    // TODO: We need to get the game with the newest release date.

    if (igdb[0].id == null) {
      console.log('ERROR, game id missing.');
      return;
    }

    const content = `---
id: ${igdb[0].id}
title: "${game.Game}"
description: "${game.Game} - Review"
score: ${game.Rating}
date: "${formatDate(game.Played)}"
completed: ${game.Completed}
awards: "${game.Awards}"
modified_date: "2022-07-04"
screenshots: []
cover: "${igdb[0].cover.url}"
image: "${igdb[0].screenshots[0].url}"
---
${game['Quick Review']}`;

    await fs.writeFile(`./_games/${slug}.md`, content, (err: any) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${game.Game} MD has been created!`);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export default function createGameFiles() {
  const filePath = './src/scripts/csv/games.csv';
  const csvstream = csv
    .parseFile(filePath, { headers: true })
    .on('data', async function (row) {
      csvstream.pause();
      // do some heavy work
      await writeGameMDFile(row);

      // Wait time, so the api doesn't hate us.
      await sleep(3000);

      // when done resume the stream
      csvstream.resume();
    })
    .on('end', function () {
      console.log('We are done!');
    })
    .on('error', function (error) {
      console.log(error);
    });
}

createGameFiles();
