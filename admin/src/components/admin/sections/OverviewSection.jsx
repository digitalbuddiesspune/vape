import { useEffect, useMemo, useState } from "react";
import { getDashboardStats } from "../../../api/api";
import MonthlySalesChart from "../MonthlySalesChart";
import DashboardOrderPeriodFilters from "../dashboard/DashboardOrderPeriodFilters";
import DashboardRecentOrders from "../dashboard/DashboardRecentOrders";
import RevenueCard from "../dashboard/RevenueCard";
import StoreOverview from "../dashboard/StoreOverview";
import TodayStatCard from "../dashboard/TodayStatCard";
import TopCategoriesChart from "../dashboard/TopCategoriesChart";
import TotalMiniCard from "../dashboard/TotalMiniCard";
import { formatCurrency } from "../dashboard/dashboardUtils";
import {
  buildOrdersListLink,
  getCurrentMonthDateRange,
  getCurrentMonthName,
  getDashboardOrderPeriodLabel,
  getTodayDateString,
} from "../dashboardUtils";
import { IconCategory, IconOrder, IconProduct } from "../AdminIcons";

const EMPTY_DAY_STATS = {
  orders: 0,
  confirmed: 0,
  shipping: 0,
  delivered: 0,
  cancelled: 0,
  return: 0,
};

function OverviewSection() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [years, setYears] = useState([currentYear]);
  const [totals, setTotals] = useState({ products: 0, categories: 0, users: 0, totalRevenue: 0 });
  const [revenue, setRevenue] = useState({ currentMonth: 0, lastMonth: 0, monthlyTrend: [] });
  const [storeOverview, setStoreOverview] = useState({
    activeProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    activeUsers: 0,
  });
  const [topCategories, setTopCategories] = useState([]);
  const [topCategoriesTotal, setTopCategoriesTotal] = useState(0);
  const [orderPeriods, setOrderPeriods] = useState({});
  const [ordersPeriod, setOrdersPeriod] = useState("today");
  const [todayDate, setTodayDate] = useState(() => getTodayDateString());

  useEffect(() => {
    const syncTodayDate = () => {
      const nextDate = getTodayDateString();
      setTodayDate((prev) => (prev === nextDate ? prev : nextDate));
    };

    syncTodayDate();
    const intervalId = window.setInterval(syncTodayDate, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await getDashboardStats({ year, ordersPeriod });
        const stats = data.data || {};

        setRecentOrders(stats.recentOrders || []);
        setMonthlySales(stats.monthlySales || []);
        setYears(stats.years?.length ? stats.years : [currentYear]);
        setTotals(stats.totals || { products: 0, categories: 0, users: 0, totalRevenue: 0 });
        setRevenue(stats.revenue || { currentMonth: 0, lastMonth: 0, monthlyTrend: [] });
        setStoreOverview(
          stats.storeOverview || {
            activeProducts: 0,
            outOfStock: 0,
            lowStock: 0,
            activeUsers: 0,
          }
        );
        setTopCategories(stats.topCategories || []);
        setTopCategoriesTotal(Number(stats.topCategoriesTotal) || 0);
        setOrderPeriods(stats.orderPeriods || {});
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [year, currentYear, todayDate, ordersPeriod]);

  const activePeriodStats = useMemo(() => {
    const fromApi = orderPeriods[ordersPeriod];
    if (fromApi) {
      return {
        count: Number(fromApi.count ?? fromApi.orders) || 0,
        confirmed: Number(fromApi.confirmed) || 0,
        shipping: Number(fromApi.shipping) || 0,
        delivered: Number(fromApi.delivered) || 0,
        cancelled: Number(fromApi.cancelled) || 0,
        return: Number(fromApi.return) || 0,
        revenue: Number(fromApi.revenue) || 0,
        previousRevenue: Number(fromApi.previousRevenue) || 0,
        startDate: fromApi.startDate || todayDate,
        endDate: fromApi.endDate || todayDate,
      };
    }
    return {
      count: 0,
      revenue: 0,
      previousRevenue: 0,
      ...EMPTY_DAY_STATS,
      startDate: todayDate,
      endDate: todayDate,
    };
  }, [orderPeriods, ordersPeriod, todayDate]);

  const periodLabel = useMemo(() => getDashboardOrderPeriodLabel(ordersPeriod), [ordersPeriod]);
  const periodOrdersLink = useMemo(
    () => buildOrdersListLink(activePeriodStats.startDate, activePeriodStats.endDate),
    [activePeriodStats.startDate, activePeriodStats.endDate]
  );
  const monthRevenueLink = useMemo(() => {
    const { startDate, endDate } = getCurrentMonthDateRange();
    return `/revenue?startDate=${startDate}&endDate=${endDate}`;
  }, []);
  const currentMonthName = useMemo(() => getCurrentMonthName(), []);

  return (
    <div className="min-w-0 space-y-6">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <DashboardOrderPeriodFilters
        value={ordersPeriod}
        onChange={setOrdersPeriod}
        disabled={loading}
      />

      <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        <TodayStatCard
          label={`${periodLabel} Orders`}
          value={activePeriodStats.count}
          loading={loading}
          iconBg="bg-orange-50 text-primary"
          to={periodOrdersLink}
        >
          <IconOrder className="h-5 w-5" />
        </TodayStatCard>
        <TodayStatCard
          label={`${periodLabel} Confirmed`}
          value={activePeriodStats.confirmed}
          loading={loading}
          iconBg="bg-emerald-50 text-emerald-600"
          to={buildOrdersListLink(activePeriodStats.startDate, activePeriodStats.endDate, "confirm")}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </TodayStatCard>
        <TodayStatCard
          label={`${periodLabel} Shipping`}
          value={activePeriodStats.shipping}
          loading={loading}
          iconBg="bg-blue-50 text-blue-600"
          to={buildOrdersListLink(activePeriodStats.startDate, activePeriodStats.endDate, "shipping")}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </TodayStatCard>
        <TodayStatCard
          label={`${periodLabel} Delivered`}
          value={activePeriodStats.delivered}
          loading={loading}
          iconBg="bg-green-50 text-green-600"
          to={buildOrdersListLink(activePeriodStats.startDate, activePeriodStats.endDate, "delivered")}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </TodayStatCard>
        <TodayStatCard
          label={`${periodLabel} Cancelled`}
          value={activePeriodStats.cancelled}
          loading={loading}
          iconBg="bg-red-50 text-red-500"
          to={buildOrdersListLink(activePeriodStats.startDate, activePeriodStats.endDate, "cancelled")}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </TodayStatCard>
        <TodayStatCard
          label={`${periodLabel} Return`}
          value={activePeriodStats.return}
          loading={loading}
          iconBg="bg-amber-50 text-amber-600"
          to={buildOrdersListLink(activePeriodStats.startDate, activePeriodStats.endDate, "return")}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
        </TodayStatCard>
        <TodayStatCard
          label={`${periodLabel} Revenue`}
          value={formatCurrency(activePeriodStats.revenue)}
          loading={loading}
          iconBg="bg-green-50 text-green-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
        </TodayStatCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4 xl:items-stretch">
        <TotalMiniCard
          label="Total Products"
          value={totals.products}
          loading={loading}
          to="/products/show"
          icon={IconProduct}
          iconBg="bg-violet-50 text-violet-600"
        />
        <TotalMiniCard
          label="Total Categories"
          value={totals.categories}
          loading={loading}
          to="/categories/show"
          icon={IconCategory}
          iconBg="bg-blue-50 text-blue-600"
        />
        <RevenueCard
          compact
          label={`${currentMonthName} Revenue`}
          totalRevenue={revenue.currentMonth}
          currentMonth={revenue.currentMonth}
          lastMonth={revenue.lastMonth}
          monthlyTrend={revenue.monthlyTrend}
          loading={loading}
          showSparkline={false}
          to={monthRevenueLink}
        />
        <RevenueCard
          compact
          label="Total Revenue"
          totalRevenue={totals.totalRevenue}
          currentMonth={revenue.currentMonth}
          lastMonth={revenue.lastMonth}
          monthlyTrend={revenue.monthlyTrend}
          loading={loading}
          showTrend={false}
          to="/revenue"
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-3">
        <div className="flex h-full min-h-0 xl:col-span-2">
          <MonthlySalesChart
            monthlySales={monthlySales}
            year={year}
            years={years}
            onYearChange={setYear}
            loading={loading}
          />
        </div>
        <div className="flex h-full min-h-0">
          <TopCategoriesChart
            categories={topCategories}
            totalSales={topCategoriesTotal}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardRecentOrders
            orders={recentOrders}
            loading={loading}
            viewAllTo={periodOrdersLink}
            title={`${periodLabel} Orders`}
            emptyMessage={`No orders for ${periodLabel.toLowerCase()}.`}
          />
        </div>
        <StoreOverview overview={storeOverview} loading={loading} />
      </div>
    </div>
  );
}

export default OverviewSection;
