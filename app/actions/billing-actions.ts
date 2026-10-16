"use server";

import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function createCheckoutSession(
  priceId: "monthly" | "yearly"
): Promise<{ url?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Get or create Stripe customer
    let customerId: string | undefined;

    // Check if user already has a subscription with a customer ID
    const [existingSub] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (existingSub?.providerCustomerId) {
      customerId = existingSub.providerCustomerId;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const stripePriceId =
      priceId === "monthly" ? STRIPE_PRICE_IDS.proMonthly : STRIPE_PRICE_IDS.proYearly;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=cancelled`,
      metadata: {
        userId,
      },
    });

    return { url: checkoutSession.url || undefined };
  } catch (error) {
    console.error("Checkout session error:", error);
    return { error: "Failed to create checkout session" };
  }
}

export async function createCustomerPortalSession(): Promise<{ url?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return { error: "Unauthorized" };
    }

    // Get user's subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1);

    if (!subscription?.providerCustomerId) {
      return { error: "No active subscription found" };
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.providerCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error("Customer portal error:", error);
    return { error: "Failed to create portal session" };
  }
}
