import { axiosInstance } from "./axiosInstance"

export type TCouponQuote = {
  code: string
  amount: number
  applied_amount: number
  food_share: number
  delivery_share: number
  payable: number
}

export const CouponsAPI = {
  preview: async (input: {
    code: string
    subtotal: number
    delivery_fee: number
    discount: number
  }): Promise<TCouponQuote> => {
    const response = await axiosInstance.post("/restaurants/coupons/preview", {
      coupon: input,
    })
    return response.data.data as TCouponQuote
  },
}
