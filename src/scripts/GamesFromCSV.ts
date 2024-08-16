/* eslint-disable no-console */
/* eslint-disable func-names */

/**
 * This file is a really rough script meant to parse a google sheets csv and turn it into markdown files, while fetching data from igdb.
 * To update the site, download the google sheet csv, rename it to games.csv, put it in the /scripts/csv folder. Then run this script.
 * Any existing files will be edited, and any new files will pull info from igdb and be created.
 *
 * Doing it this way lets us cut down on time to manually create new entries. It also cuts down on igdb calls needed and speeds up the future compile process.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { readFile, writeFile } from 'fs/promises';

// eslint-disable-next-line import/no-extraneous-dependencies
import * as csv from 'fast-csv';
import matter from 'gray-matter';
import { stringify } from 'yaml';

import { getGameByID } from '../utils/IGDB';

const fs = require('fs');
// const http = require('https');

function sleep(ms: number | undefined) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Converts a game name to a filename slug.
 * @param Text
 * @returns
 */
function convertToSlug(Text: string) {
  return Text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

/**
 * Formats a date into a specific format.
 * @param date
 * @returns
 */
function formatDate(date: string | number | Date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('-');
}

/**
 * Get the current date and format it.
 */
function getCurrentDate() {
  let myDate = new Date();
  const offset = myDate.getTimezoneOffset();
  myDate = new Date(myDate.getTime() - offset * 60 * 1000);
  return formatDate(myDate);
}

/**
 * Checks to see if a file exists for this given game, and returns the filename if so. Otherwise, returns false;
 */
async function getFileName(sheetRow: any) {
  const slug = convertToSlug(sheetRow.Game);
  const igdb = sheetRow.IGDB;

  // See if file exists using game name, and if so make sure igdb id matches.
  if (fs.existsSync(`./_games/${slug}.md`)) {
    const { data: frontMatter } = matter(await readFile(`./_games/${slug}.md`));

    if (frontMatter.id === parseInt(sheetRow.IGDB, 10)) {
      return slug;
    }
  }

  // Otherwise, we have a duplicate game name for different games. So return slug + igdb as file name.
  if (fs.existsSync(`./_games/${slug}-${igdb}.md`)) {
    return `${slug}-${igdb}`;
  }

  // Return false if the file doesn't exist at all.
  return false;
}

/**
 * Saves a file from a url to local.
 * @param url
 */
// function saveFileFromSite(fileUrl: any, type: any, folderName: string) {
//   const dir = `./public/assets/images/games/${folderName}/`;
//   const fileName = `${type}.jpg`;

//   // Don't download images again if we already have them.
//   if (fs.existsSync(`${dir}${fileName}`)) {
//     return;
//   }

//   // Create image folder for game if it doesn't exist.
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }

//   // Now, start downloading and saving the images.
//   const file = fs.createWriteStream(`${dir}${fileName}`);
//   console.log(`Downloading https:${fileUrl}`);

//   http.get(
//     `https://${fileUrl}`,
//     function (response: { pipe: (arg0: any) => void }) {
//       response.pipe(file);

//       // after download completed close filestream
//       file.on('finish', () => {
//         file.close();
//         console.log(`Finished downloading ${type} image for ${folderName}`);
//       });
//     }
//   );
// }

function convertAndCompare(
  newFrontMatterValue: any,
  frontMatterValue: any,
  type: string
) {
  let newValue;
  switch (type) {
    case 'Rating':
      newValue = parseInt(newFrontMatterValue, 10) * 10;
      break;
    case 'Completed':
      newValue = String(newFrontMatterValue).toLowerCase() === 'true';
      break;
    case 'GOTY':
      newValue =
        newFrontMatterValue !== ''
          ? String(newFrontMatterValue).split(',')
          : [''];

      // Clean arrays.
      newValue = newValue.filter((value: string) => value !== '');
      frontMatterValue = frontMatterValue.filter(
        (value: string) => value !== ''
      );

      if (newValue.length === frontMatterValue.length) {
        return false;
      }
      break;
    default:
      newValue = newFrontMatterValue;
  }

  return JSON.stringify(newValue) !== JSON.stringify(frontMatterValue);
}

function needsUpdated(newFrontMatter: any, frontMatter: any) {
  const fieldsToCheck = [
    // Google Sheets vs MD
    ['Rating', 'score'],
    ['Completed', 'completed'],
    ['GOTY', 'goty'],
  ];

  return fieldsToCheck.some((field) => {
    const newFrontMatterFieldName = field[0];
    const frontMatterFieldName = field[1];
    return convertAndCompare(
      newFrontMatter[newFrontMatterFieldName],
      frontMatter[frontMatterFieldName],
      newFrontMatterFieldName
    );
  });
}

/**
 * Edits the content of the md file that exists in both the file and google sheets.
 * @param sheetRow
 */
async function editGameMDFile(sheetRow: any) {
  const slug = await getFileName(sheetRow);

  if (slug === false) {
    console.error(`We are trying to edit a file, but have no valid slug.`);
    return;
  }

  const filepath = `./_games/${slug}.md`;
  // const igdb = null;

  // eslint-disable-next-line prefer-const
  let { data: frontMatter, content } = matter(await readFile(filepath));

  if (!needsUpdated(sheetRow, frontMatter)) {
    return;
  }

  // Here we are forcing an update of any fields found in the CSV and skipping fields pulled from IGDB.
  frontMatter = {
    id: frontMatter.id,
    title: frontMatter.title,
    description: frontMatter.description,
    score: parseInt(sheetRow.Rating, 10) * 10,
    date: formatDate(sheetRow.Played),
    completed: String(sheetRow.Completed).toLowerCase() === 'true',
    goty: sheetRow.GOTY !== '' ? String(sheetRow.GOTY).split(',') : [],
    modified_date: getCurrentDate(),
    screenshots: frontMatter.screenshots,
    videos: frontMatter.videos,
    cover: frontMatter.cover,
    image: frontMatter.image,
  };

  const newContent = `---\n${stringify(frontMatter)}---\n${content}`;
  await writeFile(filepath, newContent);

  // Check if images exists and download if not. Use this if images should be hosted locally.
  // const imageDir = `./public/assets/images/games/${slug}/`;
  // if (!fs.existsSync(`${imageDir}cover.jpg`)) {
  //   if (igdb === null) {
  //     igdb = await getGameByID(sheetRow.IGDB, [
  //       'id',
  //       'name',
  //       'cover.url',
  //       'screenshots.url',
  //     ]);
  //   }
  //   saveFileFromSite(igdb[0].cover.url, 'cover', slug);
  // }

  // if (!fs.existsSync(`${imageDir}bg.jpg`)) {
  //   if (igdb === null) {
  //     igdb = await getGameByID(sheetRow.IGDB, [
  //       'id',
  //       'name',
  //       'cover.url',
  //       'screenshots.url',
  //     ]);
  //   }
  //   saveFileFromSite(igdb[0].screenshots[0].url, 'bg', slug);
  // }

  console.log(`Updated ${slug}.md.`);
}

/**
 * Handles some weirdness with igdbData where screenshots were returned without a url.
 * @param igdbData
 * @returns
 */
function getScreenshot(igdbData: any) {
  if (igdbData.screenshots == null) {
    return '';
  }

  if (igdbData.screenshots.length > 0 && 'url' in igdbData.screenshots[0]) {
    return igdbData.screenshots[0].url;
  }

  return '';
}

/**
 * Creates a new file, pulling from igdb.
 * @param sheetRow
 * @returns
 */
async function createNewGameMDFile(sheetRow: any) {
  let slug = convertToSlug(sheetRow.Game);
  let filepath = `./_games/${slug}.md`;

  const igdb = await getGameByID(sheetRow.IGDB, [
    'id',
    'name',
    'cover.url',
    'screenshots.url',
  ]);

  // Sanity check.
  if (igdb[0].id == null) {
    console.log('ERROR, game id missing.');
    return;
  }

  // If a file already exists using just the game name, then attach the igdb id as well.
  if (fs.existsSync(`./_games/${slug}.md`)) {
    filepath = `./_games/${slug}-${igdb[0].id}.md`;
    slug = `${slug}-${igdb[0].id}`;
  }

  // Download images from igdb. Use this if images should be hosted locally.
  // saveFileFromSite(igdb[0].cover.url, 'cover', slug);
  // saveFileFromSite(igdb[0].screenshots[0].url, 'bg', slug);

  // Prepare file content.
  const frontMatter = {
    id: igdb[0].id,
    title: igdb[0].name,
    description: `${igdb[0].name} - Review`,
    score: parseInt(sheetRow.Rating, 10) * 10,
    date: formatDate(sheetRow.Played),
    completed: String(sheetRow.Completed).toLowerCase() === 'true',
    goty: sheetRow.GOTY !== '' ? String(sheetRow.GOTY).split(',') : [],
    modified_date: getCurrentDate(),
    screenshots: [],
    tags: sheetRow.Tags !== '' ? String(sheetRow.Tags).split(',') : [],
    videos: [],
    cover: igdb[0].cover !== null ? igdb[0].cover.url : '',
    image: getScreenshot(igdb[0]),
  };

  const content = sheetRow['Quick Review'];

  // Write the file.
  const newContent = `---\n${stringify(frontMatter)}---\n${content}`;
  await writeFile(filepath, newContent);

  console.log(`Created ${slug}.md.`);
}

/**
 * Does the heavy lifting and writes the file.
 * Returns the time we should wait before the next file write. This lets us have different lengths based on if we're editing or making API calls.
 * @param sheetRow
 * @returns
 */
async function writeGameMDFile(sheetRow: any) {
  try {
    const slug = await getFileName(sheetRow);

    // Slug exists, so we're just going to edit the content and save API calls.
    if (slug !== false) {
      editGameMDFile(sheetRow);
      return 25;
    }

    // Slug doesn't exist, so we're creating a new file and pulling fresh content from IGDB.
    createNewGameMDFile(sheetRow);
    return 3000;
  } catch (err) {
    console.log(err);
    return 3000;
  }
}

export default function createGameFiles() {
  console.log(
    'Checking to see if we have any new games to add or update. Please wait...'
  );
  const filePath = './src/scripts/csv/games.csv';

  // Get total number of lines in the file
  const totalLines = fs.readFileSync(filePath, 'utf8').split('\n').length - 1;
  let processedLines = 0;

  const csvstream = csv
    .parseFile(filePath, { headers: true })
    .on('data', async function (row) {
      csvstream.pause();
      // do some heavy work
      const timeToWait = await writeGameMDFile(row);

      // Wait time, so the api doesn't hate us.
      await sleep(timeToWait);

      // when done resume the stream
      csvstream.resume();

      // Increment processed lines and log progress
      processedLines++;
      if (processedLines % 50 === 0) {
        console.log(`Progress: ${processedLines}/${totalLines}`);
      }
    })
    .on('end', function () {
      console.log('We are finished updating files.');
    })
    .on('error', function (error) {
      console.log(error);
    });
}

createGameFiles();
