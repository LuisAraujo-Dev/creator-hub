import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, MousePointer2, Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import prisma from "@/src/lib/prisma";
import { Separator } from "@radix-ui/react-dropdown-menu";

const MOCK_USER_ID = "clerk_user_id_mock_1";

export default async function DashboardPage() {
  const [productsCount, couponsCount, user] = await Promise.all([
    prisma.product.count({
      where: { userId: MOCK_USER_ID, active: true },
    }),
    prisma.coupon.count({
      where: { userId: MOCK_USER_ID, active: true },
    }),
    prisma.user.findUnique({
        where: { id: MOCK_USER_ID },
        include: {
            products: { select: { clicks: true } },
            coupons: { select: { clicks: true } }
        }
    })
  ]);

  const totalProductClicks = user?.products.reduce((acc, curr) => acc + curr.clicks, 0) || 0;
  const totalCouponClicks = user?.coupons.reduce((acc, curr) => acc + curr.clicks, 0) || 0;
  const totalClicks = totalProductClicks + totalCouponClicks;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
                Visão geral da sua performance no CreatorHub.
            </p>
        </div>
        <div className="flex items-center space-x-2">
            <Link href="/admin/monetization/products">
                <Button>Gerenciar Produtos</Button>
            </Link>
        </div>
      </div>
      
      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Cliques
            </CardTitle>
            <MousePointer2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Em todos os links ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
            <p className="text-xs text-muted-foreground">
              Recomendações publicadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cupons Ativos
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponsCount}</div>
            <p className="text-xs text-muted-foreground">
              Parcerias ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversão Estimada
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--%</div>
            <p className="text-xs text-muted-foreground">
              Disponível na versão Pro
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-slate-100 rounded-md dark:bg-slate-800">
                Gráfico de Cliques (Em breve)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <p className="text-sm text-muted-foreground">
              Navegue pelos seus módulos.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="flex items-center gap-4">
                <Link href="/admin/profile" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                        👤 Editar Perfil
                    </Button>
                </Link>
             </div>
             <div className="flex items-center gap-4">
                <Link href="/admin/monetization/products" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                        🛍️ Meus Produtos
                    </Button>
                </Link>
             </div>
             <div className="flex items-center gap-4">
                <Link href="/admin/monetization/coupons" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                        🎟️ Meus Cupons
                    </Button>
                </Link>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}