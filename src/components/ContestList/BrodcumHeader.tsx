import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCompetitionById } from "./mockApi";
import type { Competition } from "./mockCompetitions";

import ShareModal from "../Feedback/ShareModal";
import FeedbackModal from "../Feedback/FeedbackModal";
import AdBanner from "../Ads/AdBanner";

interface Props {
  heading?: string;
}

const ContestHeaderWithModals: React.FC<Props> = ({ heading }) => {
  const [isShareOpen, setShareOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [contestTitle, setContestTitle] = useState<string>("");

  const navigate = useNavigate();
  const { contestId } = useParams<{ contestId: string }>();

  
  useEffect(() => {
    if (contestId) {
      fetchCompetitionById(parseInt(contestId)).then((data: Competition | null) => {
        if (data?.title) setContestTitle(data.title);
        else setContestTitle(""); // fallback if not found
      });
    } else {
      setContestTitle(""); // clear on list page
    }
  }, [contestId]);

  const shareUrl = window.location.href;

  return (
    <>
      <Wrapper>
        {/* Top Bar */}
        <TopBar>
          <Breadcrumb>
            <HomeLink onClick={() => navigate("/")}>Home</HomeLink> / Contest List
            {contestTitle && <span>/</span>}
            {contestTitle && <Current>{contestTitle}</Current>}
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

        {/* Banner */}
        <Banner>
          <AdBanner />
        </Banner>

      
        {heading && <Heading>{heading}</Heading>}
      </Wrapper>

      {/* Modals */}
      <ShareModal isOpen={isShareOpen} onClose={() => setShareOpen(false)} shareUrl={shareUrl} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
};

export default ContestHeaderWithModals;

// ---------------- Styled Components ----------------
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #0F172A;
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
`;

const Breadcrumb = styled.div`
  display: flex;
  gap: 0.3rem;
  flex-wrap: wrap;
`;

const HomeLink = styled.span`
  color: #0F172A;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Current = styled.span`
  font-weight: 600;
  word-wrap: break-word;
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
  color: #0F172A;

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

  @media (max-width: 768px) {
    img {
      width: 100%;
      height: auto;
      min-height: 150px; /* makes ad visually bigger on mobile */
    }
  }
`;

const Heading = styled.h2`
  text-align: center;
  width: 100%;
  max-width: 1000px;
  font-size: 2.5rem;
  font-weight: 400;
  color: #132e58;
  margin: 2rem auto;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    padding: 0 1rem;
  }
`;
