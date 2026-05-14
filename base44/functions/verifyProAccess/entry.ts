import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ isPro: false }, { status: 401 });
    }

    // Check for active subscription
    const customers = await stripe.customers.list({ email: user.email, limit: 5 });

    if (customers.data.length === 0) {
      return Response.json({ isPro: false });
    }

    let isPro = false;

    for (const customer of customers.data) {
      // Check subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'active',
        limit: 10,
      });

      if (subscriptions.data.length > 0) {
        isPro = true;
        break;
      }

      // Check one-time payments (payment intents succeeded)
      const sessions = await stripe.checkout.sessions.list({
        customer: customer.id,
        limit: 20,
      });

      const hasPaid = sessions.data.some(
        s => s.payment_status === 'paid' && s.metadata?.base44_app_id === Deno.env.get('BASE44_APP_ID')
      );

      if (hasPaid) {
        isPro = true;
        break;
      }
    }

    return Response.json({ isPro });
  } catch (error) {
    console.error('verifyProAccess error:', error);
    return Response.json({ isPro: false, error: error.message }, { status: 500 });
  }
});