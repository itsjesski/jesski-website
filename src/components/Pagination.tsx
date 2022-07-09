import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  handleNextPage: (page: number) => void;
  handlePrevPage: (page: number) => void;
}
const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <div className="pagination-button-wrapper">
      <a
        className="inline-block text-sm px-4 py-2 mr-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white cursor-pointer"
        onClick={() => handlePrevPage(currentPage)}
      >
        Prev
      </a>

      <span className="pagination-page-info">
        Page {currentPage} of {totalPages}
      </span>

      <a
        className="inline-block text-sm px-4 py-2 ml-4 mr-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-slate-500 hover:bg-white cursor-pointer"
        onClick={() => handleNextPage(currentPage)}
      >
        Next
      </a>
    </div>
  );
};

export default Pagination;
