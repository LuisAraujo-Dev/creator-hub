import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as any;

    if (!session?.metadata?.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }

    let periodEnd: Date;
    if (subscription.current_period_end) {
      periodEnd = new Date(subscription.current_period_end * 1000);
    } else {
      const today = new Date();
      today.setDate(today.getDate() + 30);
      periodEnd = today;
    }

    await prisma.userSubscription.create({
      data: {
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: periodEnd,
      },
    });
  }
  
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as any;

    let periodEnd: Date;
    if (subscription.current_period_end) {
      periodEnd = new Date(subscription.current_period_end * 1000);
    } else {
      const today = new Date();
      today.setDate(today.getDate() + 30);
      periodEnd = today;
    }

    const existingSub = await prisma.userSubscription.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (existingSub) {
      await prisma.userSubscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: periodEnd,
        },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}