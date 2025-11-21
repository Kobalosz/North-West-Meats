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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track your sales performance and product popularity
        </p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overview.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From all completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              All time order count
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${overview.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per order average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total units sold</p>
          </CardContent>
        </Card>
      </div>

      {/* Product Analytics */}
      <div className="space-y-6">
        {/* Chart Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance Chart</CardTitle>
            <CardDescription>
              Visual representation of sales by product
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                className="h-[400px] w-full"
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
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
          <CardHeader>
            <CardTitle>Detailed Product Performance</CardTitle>
            <CardDescription>
              Sales breakdown by product (sorted by total sales)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productAnalytics.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Empty
                  title="No product data"
                  description="Product analytics will appear after orders are placed"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {productAnalytics.map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.orderFrequency} order
                          {product.orderFrequency !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {product.totalSales} units
                      </p>
                      <p className="text-sm text-muted-foreground">
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
