import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tag, Loader2 } from "lucide-react";
import { Coupon } from "@prisma/client";
import { DataTable } from "../products/components/data-table"; // Reutilizamos a DataTable genérica
import { columns } from "./components/columns";
import { useState } from "react";

const MOCK_USER_ID = "clerk_user_id_mock_1";

async function getCoupons(): Promise<Coupon[]> {
    return [
        {
            id: "coupon-1",
            userId: MOCK_USER_ID,
            storeName: "Centauro",
            code: "LUIS10",
            discount: "10% OFF",
            link: "https://centauro.com.br",
            clicks: 150,
            active: true,
        },
        {
            id: "coupon-2",
            userId: MOCK_USER_ID,
            storeName: "Insider",
            code: "TECHRUN15",
            discount: "15% OFF",
            link: "https://insiderstore.com.br",
            clicks: 45,
            active: true,
        },
    ] as Coupon[];
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useState(() => {
        async function fetchCoupons() {
            setIsLoading(true);
            const data = await getCoupons();
            setCoupons(data);
            setIsLoading(false);
        }
        fetchCoupons();
    }) 

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Cupons e Descontos</h2>
                    <p className="text-sm text-muted-foreground">
                        Gerencie códigos de desconto e ofertas exclusivas para sua audiência.
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Tag className="mr-2 h-4 w-4" />
                    Novo Cupom
                </Button>
            </header>
            
            <Separator />

            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <DataTable columns={columns} data={coupons} />
            )}
            
        </div>
    );
}