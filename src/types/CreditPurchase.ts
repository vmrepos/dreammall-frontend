export type TCreditPurchaseStatus = "pending" | "paid" | "failed"

export type TCreditPurchase = {
  id: number
  credits: number
  price: number
  status: TCreditPurchaseStatus
  created_at: string
  proof_url: string | null
}
