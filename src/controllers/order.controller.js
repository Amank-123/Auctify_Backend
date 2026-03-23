import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createOrderService,
    getBuyerOrders,
    getSellerOrders,
} from "../services/order.service.js";

const createOrder = asyncHandler(async (req, res) => {
    const order = await createOrderService(req.body, req.user._id);
    ApiResponse(res, 200, "Order created successfully !!!", order);
});

const sellerOrders = asyncHandler(async (req, res) => {
    const orders = await getSellerOrders(req.user._id);
    console.log("orders", orders);
    ApiResponse(res, 200, "Orders fetched successfully", orders);
});
const buyerOrder = asyncHandler(async (req, res) => {
    const orders = await getBuyerOrders(req.user._id);
    console.log("orders", orders);
    ApiResponse(res, 200, "Orders fetched successfully", orders);
});
export { createOrder, sellerOrders, buyerOrder };
