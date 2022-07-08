import React from 'react';

import { Meta } from '../layout/Meta';
import { Main } from '../templates/Main';
import { AppConfig } from '../utils/AppConfig';
import { BlogGallery } from '../widgets/BlogGallery';
import { ReviewGallery } from '../widgets/ReviewGallery';

const Index = () => (
  <Main meta={<Meta title="Home" description={AppConfig.description} />}>
    <ReviewGallery></ReviewGallery>
    <BlogGallery></BlogGallery>
  </Main>
);

export default Index;
