// src/app/(admin)/admin/monetization/partners/page.tsx
import prisma from "@/lib/prisma";
import { columns } from "./columns";
import DataTableClient from "./DataTableClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function PartnersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const partners = await prisma.partner.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DataTableClient data={partners} columns={columns} />
    </div>
  );
}