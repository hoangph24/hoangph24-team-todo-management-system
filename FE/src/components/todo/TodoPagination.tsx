import React from 'react';
import { Pagination, Box } from '@mui/material';

interface Props {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const TodoPagination: React.FC<Props> = ({ currentPage, totalPages, onChange }) => {
  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => onChange(page)}
        color="primary"
      />
    </Box>
  );
};

export default TodoPagination;