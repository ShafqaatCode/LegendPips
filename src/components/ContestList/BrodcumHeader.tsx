import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCompetitionById } from "../../services/contestService";

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
    if (!contestId) {
      setContestTitle("");
      return;
    }
    fetchCompetitionById(contestId).then((data) => {
      if (data?.title) setContestTitle(data.title);
      else setContestTitle("");
    });
  }, [contestId]);

  const shareUrl = window.location.href;

  return (
    <>
      <PageShell>
        <Inner>
          <TopBar>
            <Breadcrumb aria-label="Breadcrumb">
              <HomeLink type="button" onClick={() => navigate("/")}>
                Home
              </HomeLink>
              <Sep aria-hidden>/</Sep>
              {contestTitle ? (
                <>
                  <CrumbButton type="button" onClick={() => navigate("/contests")}>
                    Contests
                  </CrumbButton>
                  <Sep aria-hidden>/</Sep>
                  <Current title={contestTitle}>{contestTitle}</Current>
                </>
              ) : (
                <ListCrumb>Contests</ListCrumb>
              )}
            </Breadcrumb>

            <Actions>
              <ActionLink
                type="button"
                onClick={() => setFeedbackOpen(true)}
                title="Help improve this page — send feedback"
              >
                Feedback
              </ActionLink>
              <Divider aria-hidden>|</Divider>
              <Share type="button" onClick={() => setShareOpen(true)} aria-label="Share this page">
                Share
                <FaShareAlt size={12} style={{ marginLeft: 4 }} aria-hidden />
              </Share>
            </Actions>
          </TopBar>

          <Banner>
            <AdBanner />
          </Banner>

          {heading && <Heading>{heading}</Heading>}
        </Inner>
      </PageShell>

      <ShareModal isOpen={isShareOpen} onClose={() => setShareOpen(false)} shareUrl={shareUrl} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
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
  gap: 0.5rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem 0.75rem;
  padding: 0.35rem 0.65rem;
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`;

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
  min-width: 0;
`;

const HomeLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: #132e58;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #0f2447;
  }
`;

const CrumbButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  color: #132e58;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: #0f2447;
  }
`;

const Sep = styled.span`
  color: #94a3b8;
  user-select: none;
`;

const Current = styled.span`
  font-weight: 600;
  color: #0f172a;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: min(42rem, 55vw);
`;

const ListCrumb = styled.span`
  font-weight: 600;
  color: #0f172a;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  flex-wrap: wrap;
`;

const ActionLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: #132e58;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

const Divider = styled.span`
  color: #cbd5e1;
  font-weight: 400;
`;

const Share = styled.button`
  display: inline-flex;
  align-items: center;
  border: none;
  background: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  color: #132e58;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 2px;
  }
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
  margin: 0.35rem 0 0;
  padding: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }
`;
