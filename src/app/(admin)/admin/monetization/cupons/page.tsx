import prisma from "@/src/lib/prisma";
import { columns } from "./components/columns";
import DataTableClient from "./DataTableClient";

const MOCK_USER_ID = "clerk_user_id_mock_1";

export default async function CouponsPage() {
  const coupons = await prisma.coupon.findMany({
    where: {
      userId: MOCK_USER_ID,
    },
    orderBy: {
      createdAt: 'desc', 
    }
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DataTableClient data={coupons} columns={columns} />
    </div>
  );
}