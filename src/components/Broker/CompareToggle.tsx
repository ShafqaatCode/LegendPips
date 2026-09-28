import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { isInCompare, subscribeCompare, toggleCompareId } from "../../utils/compareBrokers";

type Props = { brokerId?: string };

const CompareToggle: React.FC<Props> = ({ brokerId }) => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!brokerId) return;
    setOn(isInCompare(brokerId));
    return subscribeCompare(() => setOn(isInCompare(brokerId)));
  }, [brokerId]);

  if (!brokerId) return null;

  return (
    <Btn
      type="button"
      $on={on}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const res = toggleCompareId(brokerId);
        if (res.error) alert(res.error);
        setOn(res.ids.includes(brokerId));
      }}
    >
      {on ? "Added to compare" : "Add to compare"}
    </Btn>
  );
};

export default CompareToggle;

const Btn = styled.button<{ $on: boolean }>`
  border: 1px solid ${({ $on }) => ($on ? "#132e58" : "#e2e8f0")};
  background: ${({ $on }) => ($on ? "#132e58" : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : "#132e58")};
  border-radius: 999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  width: 100%;
  max-width: 9.5rem;
  margin: 0 auto;
  line-height: 1.2;
  box-sizing: border-box;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: #132e58;
    background: ${({ $on }) => ($on ? "#1a2c60" : "#f8fafc")};
  }
`;
