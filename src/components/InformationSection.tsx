import React, { useState, useEffect } from 'react';
import { addDays, set } from 'date-fns';
import { links } from '../utils/Links';

const InformationSection = () => {
  const [timeUntilNextStream, setTimeUntilNextStream] = useState('');

  useEffect(() => {
    const calculateTimeUntilNextStream = () => {
      const now = new Date();
      const streamDays = [1, 2, 4, 5, 6]; // Monday, Tuesday, Thursday, Friday, Saturday
      const streamHour = 19; // 7 PM CT
      const streamMinute = 0;

      let nextStreamDate = set(now, {
        hours: streamHour,
        minutes: streamMinute,
        seconds: 0,
        milliseconds: 0,
      });

      if (
        now.getDay() === 0 || // If today is Sunday
        (now.getDay() === 6 && now.getHours() >= streamHour) // If it's Saturday and the stream time has passed
      ) {
        // Set to next Monday
        nextStreamDate = addDays(nextStreamDate, (1 + 7 - now.getDay()) % 7);
      } else if (
        now.getHours() >= streamHour &&
        streamDays.includes(now.getDay())
      ) {
        // If today is a stream day but the stream time has passed, set to next stream day
        nextStreamDate = addDays(nextStreamDate, 1);
      } else {
        // Find the next stream day
        while (!streamDays.includes(nextStreamDate.getDay())) {
          nextStreamDate = addDays(nextStreamDate, 1);
        }
      }

      const timeDifference = nextStreamDate.getTime() - now.getTime();
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor(
        (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeUntilNextStream(`${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(calculateTimeUntilNextStream, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTitle = (title: string) => {
    const words = title.split(' ');
    return (
      <>
        {words[0]}{' '}
        {words.slice(1).map((word, index) => (
          <span key={index} className="text-cstyle-green">
            {word}{' '}
          </span>
        ))}
      </>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-cstyle-lightgreen rounded">
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-semibold text-black">
          {formatTitle('Next Stream')}
        </h2>
        <p className="text-xl text-black mt-2">
          The next scheduled{' '}
          <a
            href="https://twitch.tv/Jesski"
            target="_blank"
            className="hover:underline"
            rel="noreferrer"
          >
            stream
          </a>{' '}
          will start in about: <br></br> {timeUntilNextStream}.
        </p>
        <p className="text-sm text-black mt-2">
          If the steam isn&apos;t up, check discord for more info! Schedule
          could change at any time.
        </p>
      </div>
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-semibold text-black">
          {formatTitle('Useful Links')}
        </h2>
        <p className="text-black mt-2">
          Here are some useful links to find me on other platforms:
        </p>
        <ul className="text-black">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                className="hover:underline"
                rel="noreferrer"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-start">
        <h2 className="text-2xl font-semibold text-black">
          {formatTitle('Current Projects')}
        </h2>
        <p className="text-black mt-2">
          Here are some of the projects I&apos;m currently working on:
        </p>
        <ul>
          <li className="text-black mt-2">Daily Drawing Challenge</li>
          <li className="text-black mt-2">Learning Embroidery</li>
          <li className="text-black mt-2">Stream Crafts Update</li>
        </ul>
      </div>
    </div>
  );
};

export default InformationSection;
