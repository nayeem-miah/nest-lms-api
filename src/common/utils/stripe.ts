import Stripe from "stripe";
import configuration from "src/config/configuration";

export const stripe: Stripe = new Stripe(
    configuration().stripe.secretKey as string,
    {
        apiVersion: "2025-12-15.clover",
    }
);
