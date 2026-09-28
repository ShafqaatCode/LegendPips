import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiTrendingUp,
  FiShield,
  FiDollarSign,
  FiActivity,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  fetchMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationRow,
} from "../../../services/notificationService";
import {
  createPriceAlert,
  deletePriceAlert,
  fetchMyPriceAlerts,
  togglePriceAlert,
  type PriceAlertRow,
} from "../../../services/priceAlertService";
import { LIVE_CHART_SYMBOLS } from "../../../data/liveChartSymbols";
import { ActivityTimelineSkeleton, ShimmerBar } from "../../../components/SharedComponents/Shimmer";
import {
  PageWrap,
  PageHeader,
  PageTitle,
  PageSubtitle,
  SectionCard,
  SectionHead,
  SectionBody,
  ErrorBanner,
  GhostButton,
  EmptyState,
  PrimaryButton,
} from "../../../components/UserPanel/userUi";
import { useLocale } from "../../../contexts/LocaleContext";
import styled from "styled-components";

const Tabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button<{ $active?: boolean }>`
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "#132e58" : "#e2e8f0")};
  background: ${({ $active }) => ($active ? "#132e58" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#64748b")};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
`;

const NotifList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NotifRow = styled.div<{ $unread?: boolean }>`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: ${({ $unread }) => ($unread ? "#fffbeb" : "#fff")};
  cursor: pointer;
  &:hover {
    border-color: rgba(251, 191, 36, 0.45);
  }
`;

const AlertForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 0.5rem;
  align-items: end;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PairPicker = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const PairChip = styled.button<{ $on?: boolean }>`
  border: 1px solid ${({ $on }) => ($on ? "#132e58" : "#e2e8f0")};
  background: ${({ $on }) => ($on ? "#132e58" : "#fff")};
  color: ${({ $on }) => ($on ? "#fff" : "#475569")};
  border-radius: 999px;
  padding: 0.35rem 0.7rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
  input,
  select {
    padding: 0.5rem 0.65rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.8125rem;
  }
`;

const AlertTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AlertRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.8125rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const iconForType = (type: string) => {
  switch (type) {
    case "signal":
      return FiTrendingUp;
    case "kyc":
      return FiShield;
    case "rebate":
      return FiDollarSign;
    case "price_alert":
      return FiActivity;
    default:
      return FiBell;
  }
};

const Alerts: React.FC = () => {
  const { t } = useLocale();
  const [tab, setTab] = useState<"notifications" | "price">("notifications");
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertRow[]>([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [symbolIds, setSymbolIds] = useState<string[]>(["eurusd"]);
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [creating, setCreating] = useState(false);

  const loadNotifications = async (nextPage: number, append: boolean) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError(null);
      const data = await fetchMyNotifications(nextPage, 25);
      setNotifications((prev) => (append ? [...prev, ...data.items] : data.items));
      setHasNext(data.pagination.hasNextPage);
      setPage(nextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadPriceAlerts = async () => {
    try {
      setError(null);
      const items = await fetchMyPriceAlerts();
      setPriceAlerts(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load price alerts");
    }
  };

  useEffect(() => {
    void loadNotifications(1, false);
    void loadPriceAlerts();
  }, []);

  const onNotifClick = async (n: NotificationRow) => {
    if (!n.read) {
      await markNotificationRead(n.id);
      setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    }
    if (n.link) window.location.href = n.link;
  };

  const onCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid target price");
      return;
    }
    if (!symbolIds.length) {
      setError("Select at least one pair");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const created: PriceAlertRow[] = [];
      for (const id of symbolIds) {
        const item = await createPriceAlert({ symbolId: id, targetPrice: price, condition });
        created.push(item);
      }
      setPriceAlerts((prev) => [...created, ...prev]);
      setTargetPrice("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create alert");
    } finally {
      setCreating(false);
    }
  };

  const toggleSymbol = (id: string) => {
    setSymbolIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle>
          <FiBell /> {t("panel.alerts")}
        </PageTitle>
        <PageSubtitle>Platform notifications and price alerts for your watchlist</PageSubtitle>
      </PageHeader>

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <Tabs>
        <Tab type="button" $active={tab === "notifications"} onClick={() => setTab("notifications")}>
          Notifications
        </Tab>
        <Tab type="button" $active={tab === "price"} onClick={() => setTab("price")}>
          Price alerts
        </Tab>
      </Tabs>

      {tab === "notifications" && (
        <SectionCard>
          <SectionHead>
            <h2>Inbox</h2>
            <GhostButton
              type="button"
              onClick={async () => {
                await markAllNotificationsRead();
                setNotifications((prev) => prev.map((x) => ({ ...x, read: true })));
              }}
            >
              Mark all read
            </GhostButton>
          </SectionHead>
          <SectionBody>
            {loading && <ActivityTimelineSkeleton rows={5} />}
            {!loading && notifications.length === 0 && (
              <EmptyState>No notifications yet. New signals and account updates will appear here.</EmptyState>
            )}
            <NotifList>
              {notifications.map((n) => {
                const Icon = iconForType(n.type);
                return (
                  <NotifRow key={n.id} $unread={!n.read} onClick={() => void onNotifClick(n)}>
                    <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                      <Icon style={{ marginTop: 2, color: "#132e58", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: "#132e58", fontSize: "0.8125rem" }}>{n.title}</div>
                        {n.body && (
                          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 2 }}>{n.body}</div>
                        )}
                        <div style={{ fontSize: "0.6875rem", color: "#94a3b8", marginTop: 4 }}>{n.time}</div>
                      </div>
                    </div>
                  </NotifRow>
                );
              })}
            </NotifList>
            {hasNext && (
              <div style={{ marginTop: "0.75rem", textAlign: "center" }}>
                <GhostButton
                  type="button"
                  disabled={loadingMore}
                  onClick={() => void loadNotifications(page + 1, true)}
                >
                  {loadingMore ? <ShimmerBar $h="12px" $w="60px" /> : "Load more"}
                </GhostButton>
              </div>
            )}
          </SectionBody>
        </SectionCard>
      )}

      {tab === "price" && (
        <>
          <SectionCard>
            <SectionHead>
              <h2>
                <FiPlus style={{ marginRight: 6 }} />
                Create price alert
              </h2>
            </SectionHead>
            <SectionBody>
              <AlertForm onSubmit={(e) => void onCreateAlert(e)}>
                <Field style={{ gridColumn: "1 / -1" }}>
                  Pairs (select one or more)
                  <PairPicker>
                    {LIVE_CHART_SYMBOLS.map((s) => (
                      <PairChip
                        key={s.id}
                        type="button"
                        $on={symbolIds.includes(s.id)}
                        onClick={() => toggleSymbol(s.id)}
                      >
                        {s.label}
                      </PairChip>
                    ))}
                  </PairPicker>
                </Field>
                <Field>
                  Target price
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g. 1.0850"
                    required
                  />
                </Field>
                <Field>
                  When price goes
                  <select value={condition} onChange={(e) => setCondition(e.target.value as "above" | "below")}>
                    <option value="above">Above</option>
                    <option value="below">Below</option>
                  </select>
                </Field>
                <PrimaryButton type="submit" disabled={creating || !symbolIds.length}>
                  {creating
                    ? "Saving…"
                    : symbolIds.length > 1
                      ? `Add ${symbolIds.length} alerts`
                      : "Add alert"}
                </PrimaryButton>
              </AlertForm>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.75rem" }}>
                Alerts are checked every minute. You can also create alerts from{" "}
                <Link to="/live-charts">Live charts</Link>.
              </p>
            </SectionBody>
          </SectionCard>

          <SectionCard>
            <SectionHead>
              <h2>Your price alerts</h2>
            </SectionHead>
            <SectionBody>
              {priceAlerts.length === 0 && (
                <EmptyState>No price alerts yet. Set a target above to get notified.</EmptyState>
              )}
              <AlertTable>
                {priceAlerts.map((a) => (
                  <AlertRow key={a.id}>
                    <div>
                      <strong>{a.label}</strong>
                      <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: 2 }}>
                        Notify when price goes {a.condition} {a.targetPrice}
                        {a.triggeredAt && " · Triggered"}
                        {!a.active && !a.triggeredAt && " · Paused"}
                      </div>
                    </div>
                    <GhostButton
                      type="button"
                      onClick={() =>
                        void togglePriceAlert(a.id, !a.active).then((item) =>
                          setPriceAlerts((prev) => prev.map((x) => (x.id === item.id ? item : x)))
                        )
                      }
                    >
                      {a.active ? "Pause" : "Resume"}
                    </GhostButton>
                    <GhostButton
                      type="button"
                      onClick={() =>
                        void deletePriceAlert(a.id).then(() =>
                          setPriceAlerts((prev) => prev.filter((x) => x.id !== a.id))
                        )
                      }
                    >
                      <FiTrash2 />
                    </GhostButton>
                  </AlertRow>
                ))}
              </AlertTable>
            </SectionBody>
          </SectionCard>
        </>
      )}
    </PageWrap>
  );
};

export default Alerts;
