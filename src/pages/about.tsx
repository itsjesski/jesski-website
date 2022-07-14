import React from 'react';

import { Content } from '../content/Content';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';

const About = () => (
  <Main meta={<Meta title="Lorem ipsum" description="Lorem ipsum" />}>
    <Content>
      <p>
        Hi! I created this site to get more contact with react, typescript,
        next.js, and other modern web dev technology. I thought, if you&apos;re
        going to learn a new technology then you might as well make something
        useful. So, my personal website was born! It now houses a bunch of info
        on my various differnet interests.
      </p>
      <p>
        What are some of the interests? Web development, streaming, video games,
        boardgames, vinyls, tabletop games and more. I&apos;ll admit, a majority
        of it will probably be video game related.
      </p>
    </Content>
  </Main>
);

export default About;
