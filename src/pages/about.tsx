import React from 'react';

import Content from '../content/Content';
import Meta from '../layout/Meta';
import Main from '../templates/Main';

const About = () => (
  <Main meta={<Meta title="About me" description="About Jesski" />}>
    <Content>
      <h1>About me</h1>
      <p>
        Hi! I created this site to get more practice with react, typescript,
        next.js, and other web technology. I thought, if you&apos;re going to
        learn a new technology then you might as well make something useful. So,
        my personal website was born! It now houses a bunch of info on my
        various different interests.
      </p>

      <h2>Web Development</h2>
      <p>
        I&apos;ve been a professional web developer since 2011. But that is not
        where my journey started. In highschool, back in the geocities days, I
        built websites for guilds I was a part of in video games. It was great
        because I felt like I was helping a lot of people in more ways than one.
        I didn&apos;t know at the time that I would end up doing this as a
        career.
      </p>
      <p>
        Since then, I&apos;ve worked on a variety of projects. I&apos;ve worked
        in the flower delivery industry, the paycheck app industry, and even the
        music industry. I&apos;ve also used the skills I learned to create my
        own projects. I&apos;ve been lucky in the fact that javascript has
        become more and more versatile over the years.
      </p>

      <h2>Streaming</h2>
      <p>
        Back in 2016, I started streaming on a website called Beam.pro. I was
        enthralled by the amount of tools that they gave to developers to build
        interaction games and resources for viewers. I built a bot called
        Firebot, which is still available to this day. In doing this, I helped
        Beam test their platform and grow their community. I was even featured
        on their front page a few times. At one point, I even got a site wide
        shoutout popup for my birthday.
      </p>
      <p>
        Before long, Microsoft bought out Beam and it became Mixer. I kept
        streaming here, even going so far as being partnered. But, the platform
        began to change as Microsoft sought growth and profit. Before long they
        were spending million on exclusive streaming rights for big names on
        twitch. Eventually, the service bottomed out and shut down.
      </p>
      <p>
        At this point I went over to Twitch and began streaming. I&apos;m still
        there to this day, though I&apos;ve backed off from full time streaming
        and only stream when I can for fun.
      </p>
    </Content>
  </Main>
);

export default About;
