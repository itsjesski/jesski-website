import React from 'react';

import { BlogGallery } from '../components/BlogGallery';
import { ReviewGallery } from '../components/ReviewGallery';
import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';

const Index = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <ReviewGallery></ReviewGallery>
    <BlogGallery></BlogGallery>
  </Main>
);

export default Index;
