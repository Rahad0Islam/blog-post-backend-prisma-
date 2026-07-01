import config from "../../config/config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string) => {
  
    const transactionResult = await prisma.$transaction(async(tx)=>{
        
         const user = await tx.user.findUnique({
            where:{
                id:userId
            },
            include:{
                subscription:true
            }
        });

       let stripeCustomerId = user?.subscription?.stripeCustomerId;
       
       if(!stripeCustomerId){
       const customar = await stripe.customers.create({
            email:user?.email,
            name:user?.name,
            metadata:{
                userId: user?.id as string
            }
        });

        stripeCustomerId = customar.id;
    }


    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: "price_1To0oI1KBfXhf4pNoJDTHqCi",
                quantity: 1,
            }
        ],
        mode: "subscription",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        success_url : `${config.app_url}/subscription?success=true`,
        cancel_url : `${config.app_url}/cancel?success=false`, 
        metadata:{
            userId:user?.id as string
        }

        
    })
        
       
     return session.url;
             
    });


    return {
        paymentUrl: transactionResult
    }
}

export const subscribeService = {
    createCheckoutSession,
}