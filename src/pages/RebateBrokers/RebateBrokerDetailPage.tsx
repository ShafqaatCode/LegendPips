import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { resolveRebateContentSections, resolveRebateNotes } from "../../utils/rebateDetailContent";
import styled from "styled-components";
import { FiMinus, FiPlus, FiArrowLeft } from "react-icons/fi";
import { BrokerDetailSkeleton } from "../../components/SharedComponents/Shimmer";
import {
  fetchPublicBrokerById,
  type ApiBroker,
  type RebateCashbackRow,
  type RebateInfoSection,
  type PropCashbackOffer,
} from "../../services/brokerService";
import { formatPropOfferLines } from "../../utils/propTradingDisplay";
import { REBATES_BROKER_FALLBACK_LOGOS } from "../../utils/rebatesBrokersDisplay";
import ICLogo from "../../assets/icons/Ellipse 2.png";
import BrokerSetupPage from "../../components/AccountSetup2/BrokerSetupPage";

const PageShell = styled.main`
  background: #eef1f6;
  padding: 1rem 0 1.5rem;
  min-height: 60vh;
`;

const PageInner = styled.div`
  max-width: ${({ theme }) => theme.typography.contentMax};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.typography.pageGutter};
  font-family: ${({ theme }) => theme.font.family};
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.typography.caption};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PageTitle = styled.h1`
  font-size: clamp(1.25rem, 2vw + 0.5rem, 1.625rem);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 0.75rem;
  padding-bottom: 0.65rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.WHITE};
  border: 1px solid #d8dee8;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
`;

const HeroStrip = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  flex-wrap: wrap;
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
  flex: 1;
`;

const LogoWrap = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const BrokerLogo = styled.img`
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e2e8f0;
  padding: 4px;
`;

const QuickStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  min-width: 0;
`;

const StatChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.55rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #475569;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  white-space: nowrap;

  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const SetupButton = styled.button`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.WHITE};
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: #1a3d6e;
  }
`;

const PanelBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 300px);
  align-items: stretch;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainCol = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid #e2e8f0;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
`;

const TableSection = styled.div`
  padding: 0.75rem 1rem 0;
`;

const SectionHeading = styled.h2`
  font-size: 0.8125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 0.5rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const TableWrap = styled.div`
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
`;

const TableScroll = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.body};
  min-width: 520px;

  thead th {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.WHITE};
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 0.5rem 0.75rem;
    text-align: left;
    border: none;
  }

  tbody td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #eef0f4;
    line-height: 1.4;
    font-size: 0.8125rem;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:nth-child(even) td {
    background: #fafbfc;
  }

  td.account-type {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 0.8125rem;
    line-height: 1.45;
    max-width: 11rem;
  }
`;

const PerLotLink = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;

  &:hover {
    color: #1e40af;
  }
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const AccordionHeader = styled.button<{ $open: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.55rem 0.75rem;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  background: ${({ $open, theme }) => ($open ? "rgba(19, 46, 88, 0.05)" : "#fafbfc")};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.muted};
  }

  &:hover {
    background: rgba(19, 46, 88, 0.07);
  }
`;

const AccordionBody = styled.div`
  padding: 0;
  border-bottom: 1px solid #e2e8f0;
  background: ${({ theme }) => theme.colors.WHITE};
`;

const InfoTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;

  tr:not(:last-child) td {
    border-bottom: 1px solid #f1f5f9;
  }

  td {
    padding: 0.4rem 0.75rem;
    vertical-align: top;
    line-height: 1.35;
  }
`;

const InfoLabel = styled.td`
  width: 42%;
  color: ${({ theme }) => theme.colors.muted};
  font-weight: 500;
`;

const InfoValue = styled.td`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  word-break: break-word;
`;

const Err = styled.p`
  color: #b91c1c;
  text-align: center;
  padding: 2rem;
  font-size: ${({ theme }) => theme.typography.body};
`;

const NotesAlert = styled.div`
  margin: 0.65rem 1rem 0.75rem;
  padding: 0.55rem 0.65rem;
  border: 1px solid #fde68a;
  border-left: 3px solid ${({ theme }) => theme.colors.gold};
  border-radius: 4px;
  background: #fffbeb;
`;

const NotesHeading = styled.strong`
  display: block;
  margin-bottom: 0.2rem;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
`;

const NotesText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.45;
  color: #64748b;
`;

const ScheduleNote = styled.p`
  margin: 0.45rem 1rem 0;
  padding-bottom: 0.65rem;
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;

  a {
    color: ${({ theme }) => theme.colors.secondary};
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ContentPanel = styled(Panel)`
  margin-top: 0.75rem;
`;

const ContentSection = styled.section`
  padding: 0.75rem 1rem;

  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const ContentTitle = styled.h3`
  margin: 0 0 0.45rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.01em;
`;

const ContentParagraph = styled.p`
  margin: 0 0 0.55rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: #475569;

  &:last-child {
    margin-bottom: 0;
  }
`;

const EmptyMain = styled.div`
  padding: 0.75rem 1rem 0.85rem;
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.45;
`;

const CalcLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  font-size: ${({ theme }) => theme.typography.body};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
`;

type TableRow = RebateCashbackRow & { rowSpan: number };

function buildTableRows(rows: RebateCashbackRow[]): TableRow[] {
  const out: TableRow[] = [];
  let i = 0;
  while (i < rows.length) {
    const accountType = rows[i].accountType;
    let span = 1;
    while (i + span < rows.length && rows[i + span].accountType === accountType) span += 1;
    for (let j = 0; j < span; j += 1) {
      out.push({ ...rows[i + j], rowSpan: j === 0 ? span : 0 });
    }
    i += span;
  }
  return out;
}

function fallbackPropInfoSections(broker: ApiBroker): RebateInfoSection[] {
  const offerItems =
    broker.propOffers?.flatMap((offer) => {
      const lines = formatPropOfferLines(offer);
      return lines.map((line) => ({
        label: offer.label || "Program",
        value: line,
      }));
    }) || [];

  return [
    {
      title: "How it works",
      items: [
        {
          label: "Step 1",
          value: "Choose your challenge program and click Buy Challenge.",
        },
        {
          label: "Step 2",
          value: "Complete your purchase through our partner link.",
        },
        {
          label: "Step 3",
          value: "Receive cashback on your first and repeat challenge purchases.",
        },
      ],
    },
    {
      title: "Cashback rates",
      items: offerItems.length
        ? offerItems
        : [{ label: "Cashback", value: broker.cashbackRate || "See program details" }],
    },
    {
      title: "General Information",
      items: [
        { label: "Prop firm", value: broker.name },
        ...(broker.cashbackRate ? [{ label: "Summary", value: broker.cashbackRate }] : []),
      ],
    },
  ];
}

function fallbackInfoSections(broker: ApiBroker): RebateInfoSection[] {
  const general: RebateInfoSection = {
    title: "General Information",
    items: [
      { label: "Broker Name", value: broker.name },
      ...(broker.regulation ? [{ label: "Regulation", value: broker.regulation }] : []),
      ...(broker.minDeposit ? [{ label: "Min deposit", value: `$${broker.minDeposit}` }] : []),
      ...(broker.spreadFrom ? [{ label: "Spread from", value: broker.spreadFrom }] : []),
      ...(broker.crypto ? [{ label: "Crypto", value: broker.crypto }] : []),
      ...(broker.cashbackRate ? [{ label: "Cashback", value: broker.cashbackRate }] : []),
    ],
  };
  return [
    general,
    { title: "Account Options", items: [] },
    { title: "Customer Service", items: [] },
    { title: "Trading", items: [] },
  ];
}

const RebateBrokerDetailPage: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [broker, setBroker] = useState<ApiBroker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(() => searchParams.get("setup") === "1");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "General Information": true,
  });

  useEffect(() => {
    setShowSetup(searchParams.get("setup") === "1");
  }, [brokerId, searchParams]);

  useEffect(() => {
    if (!brokerId) {
      setLoading(false);
      setError("Missing broker id.");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const b = await fetchPublicBrokerById(brokerId);
        if (!cancelled) setBroker(b);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Broker not found.");
          setBroker(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [brokerId]);

  const logoSrc = useMemo(() => {
    if (!broker) return ICLogo;
    return (
      (broker.logoUrl && broker.logoUrl.trim()) ||
      REBATES_BROKER_FALLBACK_LOGOS[broker.name] ||
      ICLogo
    );
  }, [broker]);

  const tableRows = useMemo(
    () => (broker?.rebateRows?.length ? buildTableRows(broker.rebateRows) : []),
    [broker]
  );

  const isProp = broker?.rebateCategory === "prop";

  const infoSections = useMemo(() => {
    if (!broker) return [];
    if (isProp) {
      if (broker.rebateInfoSections?.length) return broker.rebateInfoSections;
      return fallbackPropInfoSections(broker);
    }
    if (broker.rebateInfoSections?.length) return broker.rebateInfoSections;
    return fallbackInfoSections(broker);
  }, [broker, isProp]);

  const propOffers = useMemo(
    () => (broker?.propOffers?.length ? broker.propOffers : []) as PropCashbackOffer[],
    [broker]
  );

  const rebateNotes = useMemo(() => (broker ? resolveRebateNotes(broker) : ""), [broker]);

  const contentSections = useMemo(
    () => (broker ? resolveRebateContentSections(broker) : []),
    [broker]
  );

  const showCalculatorLink = useMemo(
    () =>
      contentSections.some((s) =>
        s.paragraphs.some((p) => p.toLowerCase().includes("rebate calculator"))
      ),
    [contentSections]
  );

  const quickStats = useMemo(() => {
    if (!broker) return [];
    const stats: { label: string; value: string }[] = [];
    if (broker.cashbackRate) stats.push({ label: "Cashback", value: broker.cashbackRate });
    if (broker.minDeposit) stats.push({ label: "Min deposit", value: `$${broker.minDeposit}` });
    if (broker.spreadFrom) stats.push({ label: "Spread", value: broker.spreadFrom });
    if (broker.regulation) stats.push({ label: "Regulation", value: broker.regulation });
    if (broker.crypto) stats.push({ label: "Crypto", value: broker.crypto });
    return stats;
  }, [broker]);

  const hasTable = isProp ? propOffers.length > 0 : tableRows.length > 0;

  const handleSetup = () => {
    setShowSetup(true);
    setSearchParams({ setup: "1" }, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromSetup = () => {
    setShowSetup(false);
    setSearchParams({}, { replace: true });
  };

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (loading) {
    return (
      <PageShell>
        <PageInner>
          <BrokerDetailSkeleton />
        </PageInner>
      </PageShell>
    );
  }

  if (error || !broker) {
    return (
      <PageShell>
        <PageInner>
          <Err>{error || "Broker not found."}</Err>
        </PageInner>
      </PageShell>
    );
  }

  if (showSetup) {
    return (
      <PageShell>
        <PageInner>
          <BrokerSetupPage
            broker={{
              id: broker._id,
              name: broker.name,
              logo: logoSrc,
              setupUrl: broker.setupUrl,
              description: broker.description,
              features: broker.features || [],
              verified: broker.verified,
            }}
            onBack={handleBackFromSetup}
            backLabel="Back to rebate details"
          />
        </PageInner>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageInner>
        <BackLink to="/rebates">
          <FiArrowLeft size={16} aria-hidden />
          Back to Rebates Brokers
        </BackLink>

        <PageTitle>
          {broker.name} {isProp ? "Prop Trading Rebates" : "Rebates"}
        </PageTitle>

        <Panel>
          <HeroStrip>
            <HeroLeft>
              <LogoWrap>
                <BrokerLogo src={logoSrc} alt={broker.name} />
              </LogoWrap>
              {quickStats.length > 0 && (
                <QuickStats>
                  {quickStats.map((stat) => (
                    <StatChip key={stat.label}>
                      {stat.label}: <strong>{stat.value}</strong>
                    </StatChip>
                  ))}
                </QuickStats>
              )}
            </HeroLeft>
            <SetupButton type="button" onClick={handleSetup}>
              {isProp ? "Open Account" : "Setup Account"}
            </SetupButton>
          </HeroStrip>

          <PanelBody>
            <MainCol>
              {isProp && propOffers.length > 0 && (
                <TableSection>
                  <SectionHeading>Challenge cashback</SectionHeading>
                  <TableWrap>
                    <TableScroll>
                      <Table>
                        <thead>
                          <tr>
                            <th>Program</th>
                            <th>First purchase</th>
                            <th>Repeat purchase</th>
                            <th>Discount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propOffers.map((offer, idx) => (
                            <tr key={`${offer.label}-${idx}`}>
                              <td className="account-type">{offer.label}</td>
                              <td>{offer.firstPurchaseCashback || "—"}</td>
                              <td>{offer.repeatPurchaseCashback || "—"}</td>
                              <td>{offer.discountPercent ? `+${offer.discountPercent}` : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </TableScroll>
                  </TableWrap>
                </TableSection>
              )}

              {!isProp && tableRows.length > 0 && (
                <TableSection>
                  <SectionHeading>Rebates / Cashback</SectionHeading>
                  <TableWrap>
                    <TableScroll>
                      <Table>
                        <thead>
                          <tr>
                            <th>Account Type</th>
                            <th>Instrument</th>
                            <th>Per Lot</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableRows.map((row, idx) => (
                            <tr key={`${row.accountType}-${row.instrument}-${idx}`}>
                              {row.rowSpan > 0 ? (
                                <td className="account-type" rowSpan={row.rowSpan}>
                                  {row.accountType}
                                </td>
                              ) : null}
                              <td>{row.instrument}</td>
                              <td>
                                <PerLotLink>{row.perLot}</PerLotLink>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </TableScroll>
                  </TableWrap>
                  {broker.rebateScheduleUrl?.trim() && (
                    <ScheduleNote>
                      For the full rebate schedule, please refer{" "}
                      <a
                        href={broker.rebateScheduleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                      .
                    </ScheduleNote>
                  )}
                </TableSection>
              )}

              {!hasTable && (
                <EmptyMain>
                  {broker.cashbackRate
                    ? `Earn ${broker.cashbackRate} cashback on eligible trades with ${broker.name}. Use Setup Account to get started.`
                    : `Start earning rebates with ${broker.name}. Use Setup Account to link your trading account.`}
                </EmptyMain>
              )}

              {rebateNotes && (
                <NotesAlert>
                  <NotesHeading>Notes</NotesHeading>
                  <NotesText>{rebateNotes}</NotesText>
                </NotesAlert>
              )}
            </MainCol>

            <Sidebar>
              {infoSections.map((section) => {
                const isOpen = !!openSections[section.title];
                const hasItems = section.items.length > 0;
                return (
                  <div key={section.title}>
                    <AccordionHeader
                      type="button"
                      $open={isOpen}
                      onClick={() => toggleSection(section.title)}
                      aria-expanded={isOpen}
                    >
                      <span>{section.title}</span>
                      {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                    </AccordionHeader>
                    {isOpen && hasItems && (
                      <AccordionBody>
                        <InfoTable>
                          <tbody>
                            {section.items.map((item) => (
                              <tr key={`${section.title}-${item.label}`}>
                                <InfoLabel>{item.label}</InfoLabel>
                                <InfoValue>{item.value}</InfoValue>
                              </tr>
                            ))}
                          </tbody>
                        </InfoTable>
                      </AccordionBody>
                    )}
                  </div>
                );
              })}
            </Sidebar>
          </PanelBody>
        </Panel>

        {contentSections.length > 0 && (
          <ContentPanel>
            {contentSections.map((section) => (
              <ContentSection key={section.title}>
                <ContentTitle>{section.title}</ContentTitle>
                {section.paragraphs.map((paragraph, idx) => (
                  <ContentParagraph key={`${section.title}-${idx}`}>
                    {paragraph}
                  </ContentParagraph>
                ))}
                {showCalculatorLink &&
                  section.title.toLowerCase().includes("how much") && (
                    <CalcLink to="/rebate-calculator">Open rebate calculator →</CalcLink>
                  )}
              </ContentSection>
            ))}
          </ContentPanel>
        )}
      </PageInner>
    </PageShell>
  );
};

export default RebateBrokerDetailPage;
