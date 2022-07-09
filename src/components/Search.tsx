import { useCallback, useRef, useState } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { searchBlogPosts, searchGamePosts } from '../utils/Posts';

interface Props {
  postType: string;
}

export default function Search(Props: Props) {
  const searchRef = useRef<any>(null);
  const [query, setQuery] = useState<string>('');
  const [active, setActive] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  const { postType } = Props;

  const onChange = useCallback(
    async (event) => {
      setQuery(event.target.value);

      if (query.length >= 2) {
        let response;
        switch (postType) {
          case 'games':
            response = await searchGamePosts(['slug', 'title', 'date'], query);
            break;
          default:
            response = await searchBlogPosts(['slug', 'title', 'date'], query);
        }

        setResults(response.results);
      }
    },
    [postType, query]
  );

  const onFocus = useCallback(() => {
    setActive(true);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    window.addEventListener('click', onClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick = useCallback((event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false);
      window.removeEventListener('click', onClick);
    }
  }, []);

  return (
    <div className="relative" ref={searchRef}>
      <form className="flex items-center w-full">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-500 dark:text-slate-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block w-full pl-10 p-2.5"
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Search"
          type="text"
          value={query}
        />
      </form>
      {active && results?.length > 0 && (
        <div className="absolute mt-3 w-full bg-slate-50 text-slate-400 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 shadow-2xl z-20">
          {results?.map(({ slug, title, date }) => (
            <div className="" key={slug}>
              <Link href={`/${postType}/${slug}`} as={`/${postType}/${slug}`}>
                <a className="text-slate-900 hover:bg-slate-100 pl-4 pr-4 pt-2 pb-2 flex justify-between flex-col border rounded-lg border-slate-50">
                  <span className="text-sm">{title}</span>
                  <span className="text-xs text-slate-500">
                    {format(new Date(date), 'LLL d, yyyy')}
                  </span>
                </a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
