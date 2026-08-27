export type TCreditPurchaseStatus = "pending" | "paid" | "failed"

export type TCreditPurchase = {
  id: number
  credits: number
  price: number
  status: TCreditPurchaseStatus
  created_at: string
  qr_id: string | null
  qr_image: string | null
  proof_url: string | null
}
