import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ADMIN_EMAILS = [
  "correluisaraujo@gmail.com",
];

export default async function SuperAdminUsersPage() {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0] || !ADMIN_EMAILS.includes(user.emailAddresses[0].emailAddress)) {
    return redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { products: true, coupons: true, partners: true }
      },
    }
  });

  const subscriptions = await prisma.userSubscription.findMany({
    where: { stripePriceId: { not: null } }
  });

  const proMap = new Set(subscriptions.map(s => s.userId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Usuários do Sistema</h2>
            <p className="text-sm text-muted-foreground">
                Visão geral da base de clientes ({users.length} cadastros).
            </p>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead className="text-center">Produtos</TableHead>
              <TableHead className="text-center">Cupons</TableHead>
              <TableHead>Data Cadastro</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => {
              const isPro = proMap.has(u.id);
              return (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium">{u.name}</span>
                        <span className="text-xs text-muted-foreground">{u.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isPro ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            PRO
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Free
                        </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{u._count.products}</TableCell>
                  <TableCell className="text-center">{u._count.coupons}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <a 
                        href={`/${u.username}`} 
                        target="_blank" 
                        className="text-blue-600 hover:underline text-xs"
                    >
                        /{u.username}
                    </a>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}