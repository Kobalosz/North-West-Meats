import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAnalytics } from "@/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { toast } from "sonner";

function AdminAnalytics() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getAnalytics(token);
      if (response.success) {
        setAnalytics(response.data);
      } else {
        toast.error(response.message || "Failed to fetch analytics");
      }
    } catch (err) {
      toast.error("Error fetching analytics");
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analytics || !analytics.overview || !analytics.productAnalytics) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Empty
          title="No analytics data"
          description="Analytics will appear when orders are placed"
          action={{
            label: "Refresh",
            onClick: fetchAnalytics,
          }}
        />
      </div>
    );
  }

  const { overview, productAnalytics } = analytics;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Analytics Dashboard</h1>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Track your sales performance and product popularity
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-6 grid gap-4 sm:mb-8 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl font-bold sm:text-2xl">
              ${overview.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl font-bold sm:text-2xl">{overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              All time order count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl font-bold sm:text-2xl">
              ${overview.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 sm:p-6 sm:pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="text-xl font-bold sm:text-2xl">{overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total units sold</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Analytics */}
      <div className="space-y-4 sm:space-y-6">
        {/* Chart Card */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Product Performance Chart</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Visual representation of sales by product
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {productAnalytics.length === 0 ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <Empty
                  title="No product data"
                  description="Product analytics will appear after orders are placed"
                />
              </div>
            ) : (
              <ChartContainer
                config={{
                  totalSales: {
                    label: "Total Sales",
                    color: "hsl(var(--chart-1))",
                  },
                  totalRevenue: {
                    label: "Total Revenue",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px] w-full sm:h-[400px]"
              >
                <BarChart
                  data={productAnalytics.map((product) => ({
                    name: product.productName.length > 15
                      ? product.productName.substring(0, 15) + "..."
                      : product.productName,
                    fullName: product.productName,
                    sales: product.totalSales,
                    revenue: product.totalRevenue,
                  }))}
                  margin={{ top: 20, right: 10, left: 10, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    className="text-[10px] sm:text-xs"
                  />
                  <YAxis className="text-[10px] sm:text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="sales"
                    fill="var(--color-totalSales)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Detailed List Card */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Detailed Product Performance</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Sales breakdown by product (sorted by total sales)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {productAnalytics.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Empty
                  title="No product data"
                  description="Product analytics will appear after orders are placed"
                />
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {productAnalytics.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary sm:h-10 sm:w-10">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold sm:text-base">{product.productName}</h3>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          {product.orderFrequency} order
                          {product.orderFrequency !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="ml-11 text-left sm:ml-0 sm:text-right">
                      <p className="text-base font-bold sm:text-lg">
                        {product.totalSales} units
                      </p>
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        ${product.totalRevenue.toFixed(2)} revenue
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminAnalytics;
