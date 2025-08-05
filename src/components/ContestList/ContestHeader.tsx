import React, { useState } from "react";
import styled from "styled-components";
import { FaShareAlt } from "react-icons/fa";
import ShareModal from "../Feedback/ShareModal";
import FeedbackModal from "../Feedback/FeedbackModal";
import AdBanner from "../Ads/AdBanner";

const ContestHeaderWithModals: React.FC = () => {
  const [isShareOpen, setShareOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);

  const shareUrl = window.location.href; 

  return (
    <>
      <Wrapper>
        
        <TopBar>
          <Breadcrumb>
            <HomeLink href="#">Home</HomeLink> / <Current>Contests list</Current>
          </Breadcrumb>
          <Actions>
            <ActionLink onClick={() => setFeedbackOpen(true)}>
              Feedback / Help improve this page
            </ActionLink>
            <Divider>|</Divider>
            <Share onClick={() => setShareOpen(true)}>
              Share <FaShareAlt size={14} style={{ marginLeft: "4px" }} />
            </Share>
          </Actions>
        </TopBar>


        <Banner>
          <AdBanner />
        </Banner>

        
        <Heading>
          Elite Skills Contest on the Web We Never Ask for Real Money!
        </Heading>
      </Wrapper>

      
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setShareOpen(false)}
        shareUrl={shareUrl}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
};

export default ContestHeaderWithModals;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #0f172a;
  background-color: #fff;
  padding: 0.5rem;
  margin: 0.5rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const HomeLink = styled.a`
  color: #0f172a;
  text-decoration: underline;
  font-weight: 400;

  &:hover {
    text-decoration: underline;
  }
`;

const Current = styled.span`
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionLink = styled.span`
  cursor: pointer;
  color: #012d5c;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.span`
  color: #ccc;
`;

const Share = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #0f172a;

  &:hover {
    text-decoration: underline;
  }
`;

const Banner = styled.div`
  width: 100%;
  
  img {
    width: 100%;
    border-radius: 4px;
  }
`;

const Heading = styled.h2`
  text-align: center;
  max-width: 900px;
  width: 100%;
  font-size: 2.5rem;
  font-weight: 400;
  color: #132e58;
  margin: 1rem auto;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;
