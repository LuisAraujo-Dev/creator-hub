import prisma from "@/lib/prisma";
import { columns } from "./columns";
import DataTableClient from "./DataTableClient";

const MOCK_USER_ID = "clerk_user_id_mock_1";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    where: { userId: MOCK_USER_ID },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DataTableClient data={partners} columns={columns} />
    </div>
  );
}   