export interface LayoutProps {
  children: React.ReactNode;
}

export interface MainProps {
  meta: React.ReactNode;
  children: React.ReactNode;
}

export interface MetaProps {
  title: string;
  description: string;
  canonical?: string;
  post?: {
    image: string;
    date: string;
    modified_date: string;
  };
}

export interface ContentProps {
  children: React.ReactNode;
}

export interface PageIntroBoxProps {
  children: React.ReactNode;
  className?: string;
}
