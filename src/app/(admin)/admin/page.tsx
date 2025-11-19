'use client'; 

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import { Product } from "@prisma/client";
import { columns } from "./components/columns";

import { useState } from "react";
import { DataTable } from "./monetization/products/components/data-table";
import { ProductForm } from "./monetization/products/components/product-form";

const MOCK_USER_ID = "clerk_user_id_mock_1";

async function getProducts(): Promise<Product[]> {
    
    const response = await fetch(`/api/products?userId=${MOCK_USER_ID}`, {
        cache: 'no-store' 
    });
    if (!response.ok) return [];
    
    const data = await response.json();
    return data as Product[];
}


export default function ProductsPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
        setIsLoading(false);
    }

    useState(() => { fetchProducts() }) 

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Recomendações e Produtos</h2>
                    <p className="text-sm text-muted-foreground">
                        Gerencie seus links de afiliados, preços e cupons vinculados.
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Produto
                </Button>
            </header>
            
            <Separator />

            {isLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <DataTable columns={columns} data={products} />
            )}
            
            <ProductForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    fetchProducts(); 
                }}
            />
        </div>
    );
}