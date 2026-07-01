import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import config from "./config/config";
import { prisma } from "./lib/prisma";
import { userRoutes } from "./module/user/user.route";
import { authRouter } from "./module/auth/auth.route";
import { postRoute } from "./module/post/post.router";
import { commentRouter } from "./module/comment/comment.router";
import { notFoundMiddleware } from "./middleware/notfound";
import httpstatus from "http-status";
import { globalerrorhandler } from "./middleware/globalErorHandler";
import { subscriptionRouter } from "./module/subscription/subscription.router";
import { stripe } from "./lib/stripe";

const app: Application = express();
app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }),(request, response)=>{
    let event = request.body;

    console.log("webhook event",event);
    console.log("webhook request headers",request.headers);
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  const endpointSecret = config.stripe_webhook_secret;
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature']!;
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret
      );
    } catch (err:any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.status(400).json({ message: `Webhook Error: ${err.message}` });
    }
  }
  
  console.log("webhook event after signature verification",event);
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
})

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const user = await prisma.user.findMany();
  console.log(user);
  res.send("Hello World!");
});


app.use("/api/users",userRoutes);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRoute);
app.use('/api/comments',commentRouter)
app.use('/api/subscription',subscriptionRouter);

app.use(notFoundMiddleware);

app.use(globalerrorhandler);

export default app;
