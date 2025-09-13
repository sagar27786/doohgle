import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Play,
  Pause,
  Calendar,
  DollarSign,
  Users,
  Target,
  Monitor,
  MapPin,
  Download,
  Filter,
  RefreshCw,
  Settings,
  Bell,
  Search,
  BarChart3,
  Activity,
  Globe,
  Zap,
  Star,
  Award,
} from "lucide-react";

interface DashboardData {
  totalAds: number;
  activeScreens: number;
  campaignReach: number;
  impressions: number;
  ctr: number;
  totalRevenue: number;
  adSpend: number;
  conversionRate: number;
}

interface ChartData {
  impressionsOverTime: Array<{
    date: string;
    impressions: number;
    clicks: number;
    revenue: number;
  }>;
  adSpendVsRevenue: Array<{
    month: string;
    spend: number;
    revenue: number;
  }>;
  topPerformingCampaigns: Array<{
    name: string;
    performance: number;
    color: string;
  }>;
}

const EnhancedDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalAds: 0,
    activeScreens: 0,
    campaignReach: 0,
    impressions: 0,
    ctr: 0,
    totalRevenue: 0,
    adSpend: 0,
    conversionRate: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    impressionsOverTime: [],
    adSpendVsRevenue: [],
    topPerformingCampaigns: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState("7d");
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Simulate data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setDashboardData({
        totalAds: 1247,
        activeScreens: 856,
        campaignReach: 2840000,
        impressions: 15600000,
        ctr: 4.2,
        totalRevenue: 127500,
        adSpend: 89300,
        conversionRate: 3.8,
      });

      setChartData({
        impressionsOverTime: [
          { date: "Mon", impressions: 2400, clicks: 120, revenue: 3200 },
          { date: "Tue", impressions: 1398, clicks: 85, revenue: 2800 },
          { date: "Wed", impressions: 9800, clicks: 420, revenue: 8900 },
          { date: "Thu", impressions: 3908, clicks: 195, revenue: 4200 },
          { date: "Fri", impressions: 4800, clicks: 240, revenue: 5600 },
          { date: "Sat", impressions: 3800, clicks: 190, revenue: 4800 },
          { date: "Sun", impressions: 4300, clicks: 215, revenue: 5200 },
        ],
        adSpendVsRevenue: [
          { month: "Jan", spend: 15000, revenue: 18500 },
          { month: "Feb", spend: 18000, revenue: 22000 },
          { month: "Mar", spend: 22000, revenue: 28500 },
          { month: "Apr", spend: 19500, revenue: 25000 },
          { month: "May", spend: 23000, revenue: 31000 },
          { month: "Jun", spend: 25500, revenue: 34500 },
        ],
        topPerformingCampaigns: [
          { name: "Summer Sale", performance: 35, color: "#8B5CF6" },
          { name: "Brand Awareness", performance: 25, color: "#06B6D4" },
          { name: "Holiday Special", performance: 20, color: "#10B981" },
          { name: "Product Launch", performance: 15, color: "#F59E0B" },
          { name: "Others", performance: 5, color: "#EF4444" },
        ],
      });

      setIsLoading(false);
    };

    loadData();
  }, [selectedDateRange, selectedCampaign, selectedRegion]);

  // Animated Counter Component
  const AnimatedCounter: React.FC<{
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    duration?: number;
  }> = ({ value, prefix = "", suffix = "", decimals = 0, duration = 2 }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (isLoading) return;

      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setDisplayValue(startValue + (value - startValue) * easeOut);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }, [value, duration, isLoading]);

    const formatValue = (val: number) => {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(decimals)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(decimals)}K`;
      }
      return val.toFixed(decimals);
    };

    return (
      <span className="font-bold text-2xl">
        {prefix}
        {formatValue(displayValue)}
        {suffix}
      </span>
    );
  };

  // KPI Card Component with 3D effects
  const KPICard: React.FC<{
    title: string;
    value: number;
    change: number;
    icon: React.ElementType;
    color: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    delay?: number;
  }> = ({
    title,
    value,
    change,
    icon: Icon,
    color,
    prefix,
    suffix,
    decimals,
    delay = 0,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 50, rotateX: -15 }}
        animate={{
          opacity: isLoading ? 0.5 : 1,
          y: 0,
          rotateX: 0,
          scale: isHovered ? 1.02 : 1,
          rotateY: isHovered ? 5 : 0,
        }}
        transition={{
          duration: 0.6,
          delay: delay,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        whileHover={{
          scale: 1.05,
          rotateY: 10,
          rotateX: 5,
          transition: { duration: 0.2 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br opacity-5"
          style={{
            background: `linear-gradient(135deg, ${color}22, ${color}05)`,
          }}
          animate={{
            background: isHovered
              ? `linear-gradient(135deg, ${color}33, ${color}11)`
              : `linear-gradient(135deg, ${color}22, ${color}05)`,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating Particles */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
          style={{ backgroundColor: color }}
          animate={{
            scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
              whileHover={{
                rotate: [0, -10, 10, 0],
                scale: 1.1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Icon size={28} style={{ color }} />
            </motion.div>

            <motion.div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
                change >= 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
            >
              {change >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{Math.abs(change)}%</span>
            </motion.div>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
            <motion.div
              className="text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.6 }}
            >
              <AnimatedCounter
                value={value}
                prefix={prefix}
                suffix={suffix}
                decimals={decimals}
                duration={2}
              />
            </motion.div>
          </div>
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: isHovered
              ? `0 0 30px ${color}40, 0 0 60px ${color}20`
              : "none",
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  // 3D Chart Container
  const ChartContainer: React.FC<{
    title: string;
    children: React.ReactNode;
    delay?: number;
  }> = ({ title, children, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500"
        initial={{
          opacity: 0,
          y: 40,
          rotateX: -20,
          scale: 0.95,
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: 0,
          rotateX: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          delay: delay,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          rotateX: 2,
          rotateY: 5,
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.h3
          className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
        >
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span>{title}</span>
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.4, duration: 0.6 }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  };

  const Sparkles: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header Section */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Dashboard Analytics
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Real-time insights into your advertising performance
            </motion.p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Filters */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>

              <motion.button
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={18} />
              </motion.button>

              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={16} />
                <span>Export</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Ads"
          value={dashboardData.totalAds}
          change={12.5}
          icon={Target}
          color="#8B5CF6"
          delay={0.1}
        />
        <KPICard
          title="Active Screens"
          value={dashboardData.activeScreens}
          change={8.3}
          icon={Monitor}
          color="#06B6D4"
          delay={0.2}
        />
        <KPICard
          title="Campaign Reach"
          value={dashboardData.campaignReach}
          change={15.7}
          icon={Users}
          color="#10B981"
          suffix="M"
          decimals={1}
          delay={0.3}
        />
        <KPICard
          title="Total Revenue"
          value={dashboardData.totalRevenue}
          change={23.1}
          icon={DollarSign}
          color="#F59E0B"
          prefix="$"
          suffix="K"
          decimals={1}
          delay={0.4}
        />
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Impressions"
          value={dashboardData.impressions}
          change={18.4}
          icon={Eye}
          color="#EF4444"
          suffix="M"
          decimals={1}
          delay={0.5}
        />
        <KPICard
          title="Click-Through Rate"
          value={dashboardData.ctr}
          change={5.2}
          icon={MousePointer}
          color="#8B5CF6"
          suffix="%"
          decimals={1}
          delay={0.6}
        />
        <KPICard
          title="Ad Spend"
          value={dashboardData.adSpend}
          change={-2.1}
          icon={BarChart3}
          color="#06B6D4"
          prefix="$"
          suffix="K"
          decimals={1}
          delay={0.7}
        />
        <KPICard
          title="Conversion Rate"
          value={dashboardData.conversionRate}
          change={7.8}
          icon={Activity}
          color="#10B981"
          suffix="%"
          decimals={1}
          delay={0.8}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Impressions Over Time */}
        <ChartContainer title="Impressions Over Time" delay={0.9}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.impressionsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="impressions"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#8B5CF6", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: "#06B6D4", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Ad Spend vs Revenue */}
        <ChartContainer title="Ad Spend vs Revenue" delay={1.1}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.adSpendVsRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar
                dataKey="spend"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                name="Ad Spend"
              />
              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Performing Campaigns */}
        <ChartContainer title="Top Performing Campaigns" delay={1.3}>
          <div className="space-y-4">
            {chartData.topPerformingCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.name}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: campaign.color }}
                  />
                  <span className="font-medium text-gray-900">
                    {campaign.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: campaign.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${campaign.performance}%` }}
                      transition={{ delay: 1.7 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {campaign.performance}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartContainer>

        {/* Real-time Activity */}
        <ChartContainer title="Real-time Activity" delay={1.5}>
          <div className="space-y-4">
            {[
              {
                time: "2 min ago",
                action: "New campaign started",
                type: "success",
              },
              {
                time: "5 min ago",
                action: "Screen went offline",
                type: "warning",
              },
              {
                time: "8 min ago",
                action: "Budget threshold reached",
                type: "info",
              },
              {
                time: "12 min ago",
                action: "High CTR detected",
                type: "success",
              },
              { time: "15 min ago", action: "Creative approved", type: "info" },
            ].map((activity, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7 + index * 0.1 }}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </ChartContainer>

        {/* Quick Actions */}
        <ChartContainer title="Quick Actions" delay={1.7}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Create Campaign", icon: Plus, color: "#8B5CF6" },
              { name: "Add Screen", icon: Monitor, color: "#06B6D4" },
              { name: "Upload Creative", icon: Upload, color: "#10B981" },
              { name: "View Reports", icon: BarChart3, color: "#F59E0B" },
              { name: "Manage Users", icon: Users, color: "#EF4444" },
              { name: "Settings", icon: Settings, color: "#6B7280" },
            ].map((action, index) => (
              <motion.button
                key={action.name}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.9 + index * 0.05 }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: `0 10px 25px ${action.color}20`,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <action.icon
                  size={24}
                  style={{ color: action.color }}
                  className="mx-auto mb-2 group-hover:scale-110 transition-transform"
                />
                <p className="text-xs font-medium text-gray-700">
                  {action.name}
                </p>
              </motion.button>
            ))}
          </div>
        </ChartContainer>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-gray-600 font-medium">
                Loading dashboard data...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Missing icons
const Plus: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className,
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const Upload: React.FC<{ size?: number; className?: string }> = ({
  size = 24,
  className,
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

export default EnhancedDashboard;
