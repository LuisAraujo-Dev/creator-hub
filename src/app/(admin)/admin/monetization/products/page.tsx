//src/app/(admin)/admin/monetization/products/page.tsx
import prisma from "@/lib/prisma";
import DataTableClient from "./DataTableClient";

const MOCK_USER_ID = "clerk_user_id_mock_1";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      userId: MOCK_USER_ID,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex-1 space-y-4 pt-6">
      <DataTableClient data={products} />
    </div>
  );
}