import React, { useMemo } from "react";
import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  className?: string;
  /** When true, shows controls even on a single page (default). */
  showWhenSinglePage?: boolean;
}

const ListPagination: React.FC<ListPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  className,
  showWhenSinglePage = true,
}) => {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);

  const handleChange = (page: number) => {
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageButtons = useMemo(() => {
    const buttons: React.ReactNode[] = [];
    const maxVisible = 5;

    const addPage = (page: number) => {
      buttons.push(
        <PageButton
          key={page}
          type="button"
          $active={page === safeCurrentPage}
          onClick={() => handleChange(page)}
          aria-current={page === safeCurrentPage ? "page" : undefined}
          aria-label={`Page ${page}`}
        >
          {page}
        </PageButton>
      );
    };

    if (safeTotalPages <= maxVisible) {
      for (let i = 1; i <= safeTotalPages; i += 1) addPage(i);
      return buttons;
    }

    addPage(1);

    if (safeCurrentPage > 3) {
      buttons.push(<Ellipsis key="ellipsis-start" aria-hidden>…</Ellipsis>);
    }

    const start = Math.max(2, safeCurrentPage - 1);
    const end = Math.min(safeTotalPages - 1, safeCurrentPage + 1);

    for (let i = start; i <= end; i += 1) addPage(i);

    if (safeCurrentPage < safeTotalPages - 2) {
      buttons.push(<Ellipsis key="ellipsis-end" aria-hidden>…</Ellipsis>);
    }

    addPage(safeTotalPages);
    return buttons;
  }, [safeCurrentPage, safeTotalPages]);

  if (totalItems !== undefined && totalItems <= 0) return null;
  if (!showWhenSinglePage && safeTotalPages <= 1) return null;

  return (
    <Wrap className={className} aria-label="Pagination">
      <Meta>
        <MetaLabel>Page</MetaLabel>
        <MetaValue>{safeCurrentPage}</MetaValue>
        <MetaSep>of</MetaSep>
        <MetaValue>{safeTotalPages}</MetaValue>
        {totalItems !== undefined && (
          <>
            <MetaDot aria-hidden>·</MetaDot>
            <MetaMuted>{totalItems.toLocaleString()} total</MetaMuted>
          </>
        )}
      </Meta>

      <Controls>
        <NavButton
          type="button"
          onClick={() => handleChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          aria-label="Previous page"
        >
          <FiChevronLeft size={16} aria-hidden />
          <span>Prev</span>
        </NavButton>

        <PageGroup>{pageButtons}</PageGroup>

        <NavButton
          type="button"
          onClick={() => handleChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <FiChevronRight size={16} aria-hidden />
        </NavButton>
      </Controls>
    </Wrap>
  );
};

export default ListPagination;

const Wrap = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin-top: 1rem;
  padding: 0.65rem 0 0;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Meta = styled.div`
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.3rem;
  font-size: 0.8125rem;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary};
`;

const MetaLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
`;

const MetaValue = styled.span`
  font-weight: 700;
  min-width: 1ch;
`;

const MetaSep = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
`;

const MetaDot = styled.span`
  color: #cbd5e1;
  font-weight: 700;
  margin: 0 0.1rem;
`;

const MetaMuted = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
`;

const Controls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const PageGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.15rem;
`;

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  padding: 0.35rem 0.6rem;
  border: 1px solid #d8dee8;
  border-radius: 6px;
  background: #fff;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: #f8fafc;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
    background: #f8fafc;
    color: #94a3b8;
    border-color: #e2e8f0;
  }
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 1.85rem;
  height: 1.85rem;
  padding: 0 0.35rem;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? "#132E58" : "#d8dee8")};
  background: ${({ $active }) => ($active ? "#132E58" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#132E58")};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover:not(:disabled) {
    background: ${({ $active }) => ($active ? "#1a3d6e" : "#f8fafc")};
    border-color: #132e58;
  }
`;

const Ellipsis = styled.span`
  color: #94a3b8;
  padding: 0 0.15rem;
  font-size: 0.75rem;
  font-weight: 600;
  user-select: none;
`;
