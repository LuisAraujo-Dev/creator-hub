//src/app/(admin)/admin/monetization/coupons/page.tsx
import prisma from "@/lib/prisma";
import DataTableClient from "./DataTableClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CouponsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const coupons = await prisma.coupon.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    }
  });

  return (
    <div className="flex-1 space-y-4 pt-6">
      <DataTableClient data={coupons} />
    </div>
  );
}