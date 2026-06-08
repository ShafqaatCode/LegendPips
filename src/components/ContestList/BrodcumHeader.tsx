import React from "react";
import styled from "styled-components";
import AdBanner from "../Ads/AdBanner";

interface Props {
  heading?: string;
}

const ContestHeaderWithModals: React.FC<Props> = ({ heading }) => {
  return (
    <PageShell>
      <Inner>
        <Banner>
          <AdBanner />
        </Banner>

        {heading && <Heading>{heading}</Heading>}
      </Inner>
    </PageShell>
  );
};

export default ContestHeaderWithModals;

const PageShell = styled.div`
  width: 100%;
  background: #fff;
  color: #0f172a;
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Banner = styled.div`
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  line-height: 0;

  img {
    width: 100%;
    display: block;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    img {
      min-height: 120px;
      object-fit: cover;
    }
  }
`;

const Heading = styled.h2`
  text-align: center;
  width: 100%;
  font-size: ${({ theme }) => theme.typography.sectionTitle};
  line-height: ${({ theme }) => theme.typography.sectionTitleLh};
  font-weight: 600;
  color: #132e58;
  margin: 0;
  padding: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }
`;
