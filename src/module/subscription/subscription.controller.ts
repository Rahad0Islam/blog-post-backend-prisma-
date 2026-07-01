import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/utils";
import { subscribeService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const createChecoutSession = asyncHandler(async (req: Request, res: Response,next:NextFunction) => {
  const userId = req.user?.id;


    const result = await subscribeService.createCheckoutSession(userId as string);
   
    sendResponse(res,{
        success: true,
        statuscode: httpStatus.OK,
        message: "Checkout session created successfully",
        data:result
    });
  
});

export const subscriptionController = {
  createChecoutSession,
};