import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiTag } from "react-icons/fi";
import ContactAdviceSection from "../../components/Support/ContactAdviceSection";

type AccountOption = {
  id: "forex" | "binary" | "ewallet";
  title: string;
  description: string;
  to: string;
};

const OPTIONS: AccountOption[] = [
  {
    id: "forex",
    title: "Forex",
    description:
      "Forex cashback is available for trustworthy brokers for both new and existing accounts.",
    to: "/rebates?tab=forex",
  },
  {
    id: "binary",
    title: "Binary Options",
    description:
      "Binary options cashback is available for binary brokers and only for new accounts.",
    to: "/rebates?tab=binary",
  },
  {
    id: "ewallet",
    title: "E-wallet",
    description:
      "Ewallet cashback is available for the two biggest services Skrill and NETELLER.",
    to: "/rebates?tab=ewallet",
  },
];

const Page = styled.section`
  min-height: 60vh;
  background: ${({ theme }) => theme.colors.WHITE};
  padding: clamp(2.5rem, 6vw, 4rem) ${({ theme }) => theme.typography.pageGutter};
`;

const Inner = styled.div`
  max-width: 880px;
  margin: 0 auto;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
`;

const TitleRow = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  margin-bottom: 0.55rem;

  svg {
    color: #16a34a;
    flex-shrink: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(1.35rem, 3.2vw, 1.75rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #334155;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.5;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.button`
  appearance: none;
  border: 1px solid #e2e8f0;
  background: ${({ theme }) => theme.colors.WHITE};
  border-radius: 10px;
  padding: 1.15rem 1.2rem;
  text-align: left;
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem 1rem;
  align-items: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;

  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Center the third card on desktop */
  &:nth-child(3) {
    grid-column: 1 / -1;
    max-width: calc(50% - 0.5rem);
    justify-self: center;
    width: 100%;

    @media (max-width: 720px) {
      max-width: none;
    }
  }
`;

const CardCopy = styled.div`
  min-width: 0;
`;

const CardTitle = styled.h2`
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
`;

const CardBody = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: #64748b;
`;

const Arrow = styled.span`
  color: #3b82f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const AccountTypeSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page aria-labelledby="account-type-heading">
      <Inner>
        <Header>
          <TitleRow>
            <FiTag size={22} aria-hidden />
            <Title id="account-type-heading">Select your account&apos;s type</Title>
          </TitleRow>
          <Subtitle>Select your account&apos;s type and go on to fill in your info</Subtitle>
        </Header>

        <Grid>
          {OPTIONS.map((option) => (
            <Card
              key={option.id}
              type="button"
              onClick={() => navigate(option.to)}
              aria-label={`Select ${option.title}`}
            >
              <CardCopy>
                <CardTitle>{option.title}</CardTitle>
                <CardBody>{option.description}</CardBody>
              </CardCopy>
              <Arrow aria-hidden>
                <FiChevronRight size={22} />
              </Arrow>
            </Card>
          ))}
        </Grid>
      </Inner>
      <ContactAdviceSection />
    </Page>
  );
};

export default AccountTypeSelectionPage;
