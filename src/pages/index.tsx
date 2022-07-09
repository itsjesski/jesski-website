import React from 'react';

import { BlogGallery } from '../components/BlogGallery';
import { ReviewGallery } from '../components/ReviewGallery';
import { Content } from '../content/Content';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';

const Index = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <Content>
      <ReviewGallery></ReviewGallery>
      <BlogGallery></BlogGallery>
    </Content>
  </Main>
);

export default Index;
