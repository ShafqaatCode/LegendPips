import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiColumns, FiX } from "react-icons/fi";
import { clearCompareIds, comparePath, getCompareIds, subscribeCompare } from "../../utils/compareBrokers";

const CompareBar: React.FC = () => {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getCompareIds());
    return subscribeCompare(setIds);
  }, []);

  if (ids.length === 0) return null;

  return (
    <>
      <Spacer />
      <Bar>
      <span>
        <FiColumns /> {ids.length} broker{ids.length === 1 ? "" : "s"} selected
      </span>
      <Actions>
        {ids.length > 0 && (
          <Chip type="button" onClick={() => clearCompareIds()} title="Clear selection">
            Clear <FiX size={12} />
          </Chip>
        )}
        <Go type="button" disabled={ids.length < 2} onClick={() => navigate(comparePath(ids))}>
          Compare now
        </Go>
      </Actions>
      </Bar>
    </>
  );
};

export default CompareBar;

const Bar = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.7rem 1.1rem;
  background: #132e58;
  color: #fff;
  box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.18);
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 700;
    font-size: 0.875rem;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  align-items: center;
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border-radius: 99px;
  padding: 0.2rem 0.55rem;
  font-size: 0.7rem;
  cursor: pointer;
`;

const Go = styled.button`
  background: #fbbf24;
  color: #132e58;
  border: 0;
  border-radius: 8px;
  padding: 0.4rem 0.85rem;
  font-weight: 800;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Spacer = styled.div`
  height: 3.5rem;
`;
