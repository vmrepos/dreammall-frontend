import { axiosInstance } from "./axiosInstance"
import type { TDirectUpload } from "../types/DirectUpload"

const DIRECT_UPLOAD_FOLDERS = ["avatars", "documents", "menus", "products", "uploads", "payments", "logos"] as const

export type TDirectUploadFolder = (typeof DIRECT_UPLOAD_FOLDERS)[number]

export const DirectUploadsAPI = {
  upload: async (file: File, folder: TDirectUploadFolder = "uploads"): Promise<TDirectUpload> => {
    const form = new FormData()
    form.append("folder", folder)
    form.append("file", file)

    const response = await axiosInstance.post<TDirectUpload>("/direct_uploads", form)
    return response.data
  },
}
