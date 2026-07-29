export interface SignatureResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
}

export interface CloudinaryUploadProgress {
  index: number;
  file: File;
  result: CloudinaryUploadResult;
}
