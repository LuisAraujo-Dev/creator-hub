import prisma from '@/src/lib/prisma';
import { NextResponse } from 'next/server';
import * as z from 'zod';

const MOCK_USER_ID = "clerk_user_id_mock_1";

const productSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(200).optional().nullable(),
    affiliateUrl: z.string().url(),
    imageUrl: z.string().url().optional().or(z.literal('')).nullable(),
    price: z.string().optional().nullable(),
    active: z.boolean().default(true),
});

type ProductCreateData = z.infer<typeof productSchema>;

export async function GET(request: Request) {
    try {
        const products = await prisma.product.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(products, { status: 200 });

    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        return NextResponse.json(
            { message: "Erro interno ao buscar produtos." }, 
            { status: 500 }
        );
    }
}

// === POST: Criar Novo Produto ===
export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        const validationResult = productSchema.safeParse(body);
        
        if (!validationResult.success) {
            return NextResponse.json(
                { message: "Dados inválidos.", errors: validationResult.error.flatten().fieldErrors }, 
                { status: 400 }
            );
        }

        const data: ProductCreateData = validationResult.data;

        const newProduct = await prisma.product.create({
            data: {
                userId: MOCK_USER_ID,
                title: data.title,
                description: data.description || null,
                affiliateUrl: data.affiliateUrl,
                imageUrl: data.imageUrl || null,
                price: data.price || null,
                active: data.active,
            }
        });

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar produto:", error);
        return NextResponse.json(
            { message: "Erro interno ao criar produto." }, 
            { status: 500 }
        );
    }
}