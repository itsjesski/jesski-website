import React, { ReactNode } from 'react';

type IContentProps = {
  children: ReactNode;
};

const Content = (props: IContentProps) => (
  <div className="content">
    {props.children}

    <style jsx>
      {`
        .content :global(*) {
          @apply break-words;
        }

        .content :global(p) {
          @apply my-6;
        }

        .content :global(ul) {
          @apply my-6;
        }

        .content :global(h1) {
          @apply text-2xl font-semibold text-slate-50;
        }

        .content :global(h2) {
          @apply text-xl font-semibold text-slate-50;
        }

        .content :global(h3) {
          @apply text-base font-semibold text-slate-50;
        }
      `}
    </style>
  </div>
);

export { Content };
