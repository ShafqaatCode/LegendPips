import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import {
  adminFetchStrategies,
  adminModerateStrategy,
  type StrategyModerationStatus,
  type TradingStrategy,
} from "../../../services/strategyService";
import { TableBodySkeleton } from "../../../components/SharedComponents/Shimmer";
import {
  PageWrap,
  PageHeader,
  PageTitleGroup,
  PageTitle,
  PageSubtitle,
  GhostButton,
  FilterBar,
  FilterCount,
  TableCard,
  DataTable,
  Th,
  Td,
  Tr,
  Pill,
  ErrorBanner,
  adminColors,
} from "../../../components/AdminPanel/adminUi";
import { useAuth } from "../../../contexts/AuthContext";
import { isFullAdmin } from "../../../utils/adminPermissions";
import styled from "styled-components";

const StaffNote = styled.div`
  margin-bottom: 0.85rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  background: rgba(251, 193, 19, 0.12);
  border: 1px solid rgba(251, 193, 19, 0.35);
  color: ${adminColors.navy};
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.4;
`;

const AdminStrategies: React.FC = () => {
  const { user } = useAuth();
  const canApprove = isFullAdmin(user);
  const [status, setStatus] = useState("pending");
  const [items, setItems] = useState<TradingStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetchStrategies(1, status || undefined);
      setItems(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  const moderate = async (id: string, next: StrategyModerationStatus) => {
    const note = next === "rejected" ? window.prompt("Rejection note (optional)") || "" : "";
    try {
      await adminModerateStrategy(id, next, note.trim() || undefined);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitleGroup>
          <PageTitle>
            <FiTrendingUp /> Strategies
          </PageTitle>
          <PageSubtitle>
            Member strategies stay pending until a full admin approves — staff can review and reject spam.
          </PageSubtitle>
        </PageTitleGroup>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!canApprove && (
        <StaffNote>
          You can review and reject strategies. Public approval requires a full admin account (anti-spam).
        </StaffNote>
      )}

      <FilterBar>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "0.45rem 0.7rem", borderRadius: 8, border: "1px solid #e2e8f0" }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="draft">Draft</option>
        </select>
        <GhostButton $sm type="button" onClick={load}>
          <FiRefreshCw /> Refresh
        </GhostButton>
        <FilterCount>{loading ? "Loading…" : `${items.length} strategies`}</FilterCount>
      </FilterBar>

      <TableCard>
        <DataTable>
          <thead>
            <tr>
              <Th>Strategy</Th>
              <Th>Author</Th>
              <Th>Claims</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading && <TableBodySkeleton rows={5} cols={5} />}
            {!loading &&
              items.map((row) => (
                <React.Fragment key={row.id}>
                  <Tr>
                    <Td>
                      <div style={{ fontWeight: 700, color: adminColors.navy }}>{row.title}</div>
                      <div style={{ fontSize: "0.7rem", color: adminColors.muted, textTransform: "capitalize" }}>
                        {row.timeframe} · {row.riskLevel} risk · {(row.markets || []).join(", ") || "—"}
                      </div>
                      <GhostButton $sm type="button" onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
                        {expanded === row.id ? "Hide" : "Preview"}
                      </GhostButton>
                    </Td>
                    <Td style={{ fontSize: "0.8rem" }}>
                      {row.userEmail ||
                        `${row.user?.firstName || ""} ${row.user?.lastName || ""}`.trim() ||
                        row.userId}
                    </Td>
                    <Td style={{ fontSize: "0.8rem" }}>
                      Win {row.claimedWinRatePercent ?? "—"}% · ROI {row.claimedRoiPercent ?? "—"}%
                    </Td>
                    <Td>
                      <Pill $variant={row.moderationStatus === "approved" ? "approved" : row.moderationStatus}>
                        {row.moderationStatus}
                      </Pill>
                    </Td>
                    <Td>
                      {row.moderationStatus !== "approved" && canApprove && (
                        <GhostButton $sm type="button" onClick={() => moderate(row.id, "approved")}>
                          <FiCheck /> Approve
                        </GhostButton>
                      )}
                      {row.moderationStatus !== "rejected" && (
                        <GhostButton $sm type="button" onClick={() => moderate(row.id, "rejected")}>
                          Reject
                        </GhostButton>
                      )}
                      {row.moderationStatus === "approved" && (
                        <Link to={`/strategies/${row.id}`} style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                          View live
                        </Link>
                      )}
                    </Td>
                  </Tr>
                  {expanded === row.id && (
                    <Tr>
                      <Td colSpan={5} style={{ background: "#f8fafc", fontSize: "0.85rem", whiteSpace: "pre-wrap" }}>
                        {row.summary && (
                          <p>
                            <strong>Summary:</strong> {row.summary}
                          </p>
                        )}
                        <p>
                          <strong>How it works:</strong> {row.content}
                        </p>
                        {row.entryRules && (
                          <p>
                            <strong>Entry:</strong> {row.entryRules}
                          </p>
                        )}
                        {row.exitRules && (
                          <p>
                            <strong>Exit:</strong> {row.exitRules}
                          </p>
                        )}
                        {row.riskRules && (
                          <p>
                            <strong>Risk:</strong> {row.riskRules}
                          </p>
                        )}
                        {row.adminNote && (
                          <p style={{ color: "#b91c1c" }}>
                            <strong>Admin note:</strong> {row.adminNote}
                          </p>
                        )}
                      </Td>
                    </Tr>
                  )}
                </React.Fragment>
              ))}
            {!loading && items.length === 0 && (
              <Tr>
                <Td colSpan={5} style={{ textAlign: "center", color: adminColors.muted, padding: "2rem" }}>
                  No strategies.
                </Td>
              </Tr>
            )}
          </tbody>
        </DataTable>
      </TableCard>
    </PageWrap>
  );
};

export default AdminStrategies;
