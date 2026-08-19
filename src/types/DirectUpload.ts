export type TDirectUpload = {
  signed_id: string
  filename: string
  byte_size: number
  checksum: string
  content_type: string
  key: string
  direct_upload: {
    url: string
    headers: Record<string, string>
  }
}
