import React from 'react';
import { PaginationProps } from '../types';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
}) => {
  return (
    <div className="pagination-button-wrapper flex justify-center align-middle mt-6">
      <a onClick={() => handlePrevPage(currentPage)}>
        <button>Prev</button>
      </a>

      <span className="pagination-page-info ml-4 mr-4">
        Page {currentPage} of {totalPages}
      </span>

      <a onClick={() => handleNextPage(currentPage)}>
        <button> Next</button>
      </a>
    </div>
  );
};

export default Pagination;
