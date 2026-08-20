import React from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { LEGAL_DOCS, legalDocByParam } from "../../data/legalDocuments";
import { useLocale } from "../../contexts/LocaleContext";

const LEGAL_TITLE_KEY: Record<string, string> = {
  terms: "legal.terms",
  privacy: "legal.privacy",
  "risk-disclosure": "legal.risk",
  "affiliate-disclosure": "legal.affiliate",
  "cookie-policy": "legal.cookies",
  "refund-policy": "legal.refund",
  "cashback-terms": "legal.cashback",
  "broker-review-policy": "legal.reviews",
  "complaint-policy": "legal.complaints",
  "content-disclaimer": "legal.content",
  "community-rules": "legal.community",
};

const LegalPage: React.FC<{ slug?: string }> = ({ slug: forced }) => {
  const { slug: param } = useParams();
  const { t } = useLocale();
  const doc = legalDocByParam(forced || param || "");

  if (!doc) {
    return (
      <Wrap>
        <h1>{t("legal.hub")}</h1>
        <p>{t("legal.notFound")}</p>
        <Index />
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Notice>{t("legal.disclaimer")}</Notice>
      <h1>{t(LEGAL_TITLE_KEY[doc.slug] || "legal.hub")}</h1>
      <Meta>{t("legal.updated")} {doc.updated}</Meta>
      {doc.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>
      ))}
      <Index />
    </Wrap>
  );
};

const Index: React.FC = () => {
  const { t } = useLocale();
  return (
  <Nav>
    <h3>{t("legal.allPolicies")}</h3>
    <ul>
      {LEGAL_DOCS.map((d) => (
        <li key={d.slug}>
          <Link to={`/legal/${d.slug}`}>{t(LEGAL_TITLE_KEY[d.slug] || d.title)}</Link>
        </li>
      ))}
    </ul>
  </Nav>
  );
};

export default LegalPage;

const Wrap = styled.main`
  max-width: 820px;
  margin: 0 auto;
  padding: 5rem ${({ theme }) => theme.typography.pageGutter} 3rem;
  h1 { color: #132e58; margin: 0 0 0.4rem; }
  h2 { color: #132e58; margin: 1.4rem 0 0.5rem; font-size: 1.1rem; }
  p { color: #334155; line-height: 1.65; }
`;
const Notice = styled.p`
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 10px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
`;
const Meta = styled.p`
  color: #64748b;
  font-size: 0.85rem;
`;
const Nav = styled.nav`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  ul { padding-left: 1.1rem; }
  a { color: #132e58; font-weight: 600; }
`;
