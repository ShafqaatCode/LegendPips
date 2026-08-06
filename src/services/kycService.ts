import { API_CONFIG, getAuthHeaders, getAuthHeadersMultipart, parseJsonResponse } from "../utils/apiConfig";

export type KycStatus = "incomplete" | "pending" | "approved" | "rejected";

export type KycDocumentType =
  | "identity_front"
  | "identity_back"
  | "proof_of_address"
  | "selfie_with_id";

export interface KycProfile {
  dateOfBirth?: string;
  nationality?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  idDocumentType?: "passport" | "national_id" | "drivers_license" | "other";
  idDocumentNumber?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface KycDocument {
  type: KycDocumentType;
  url: string;
  originalName?: string;
  uploadedAt?: string;
}

export interface KycData {
  kycStatus: KycStatus;
  kycProfile: KycProfile | null;
  kycDocuments: KycDocument[];
}

export interface KycSubmitPayload {
  dateOfBirth: string;
  nationality: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
  idDocumentType: "passport" | "national_id" | "drivers_license" | "other";
  idDocumentNumber: string;
  phone?: string;
  identityFront?: File;
  identityBack?: File;
  proofOfAddress?: File;
  selfieWithId?: File;
}

const fetchWithTimeout = (url: string, options: RequestInit = {}, timeout = API_CONFIG.TIMEOUT) =>
  Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    ),
  ]);

export const getMyKyc = async (): Promise<KycData> => {
  const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/kyc/me`, {
    headers: getAuthHeaders(),
  });
  const data = await parseJsonResponse<{ message?: string } & KycData>(response);
  if (!response.ok) throw new Error(data.message || "Failed to load verification status");
  return data;
};

export const submitKyc = async (payload: KycSubmitPayload): Promise<KycData & { message: string }> => {
  const formData = new FormData();
  formData.append("dateOfBirth", payload.dateOfBirth);
  formData.append("nationality", payload.nationality);
  formData.append("addressLine1", payload.addressLine1);
  if (payload.addressLine2) formData.append("addressLine2", payload.addressLine2);
  formData.append("city", payload.city);
  if (payload.state) formData.append("state", payload.state);
  formData.append("country", payload.country);
  formData.append("postalCode", payload.postalCode);
  formData.append("idDocumentType", payload.idDocumentType);
  formData.append("idDocumentNumber", payload.idDocumentNumber);
  if (payload.phone) formData.append("phone", payload.phone);

  if (payload.identityFront) formData.append("identity_front", payload.identityFront);
  if (payload.identityBack) formData.append("identity_back", payload.identityBack);
  if (payload.proofOfAddress) formData.append("proof_of_address", payload.proofOfAddress);
  if (payload.selfieWithId) formData.append("selfie_with_id", payload.selfieWithId);

  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/kyc/submit`,
    {
      method: "POST",
      headers: getAuthHeadersMultipart(),
      body: formData,
    },
    60000
  );
  const data = await parseJsonResponse<{ message?: string } & KycData>(response);
  if (!response.ok) throw new Error(data.message || "Failed to submit verification");
  return { ...data, message: data.message || "Verification submitted successfully" };
};

export const reviewKyc = async (
  userId: string,
  action: "approve" | "reject",
  rejectionReason?: string
): Promise<KycData & { message: string }> => {
  const response = await fetchWithTimeout(
    `${API_CONFIG.BASE_URL}/admin/kyc/${userId}/review`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, rejectionReason }),
    }
  );
  const data = await parseJsonResponse<{ message?: string } & KycData>(response);
  if (!response.ok) throw new Error(data.message || "Failed to review verification");
  return { ...data, message: data.message || "Review saved successfully" };
};

export const getAdminUserDetail = async (userId: string) => {
  const response = await fetchWithTimeout(`${API_CONFIG.BASE_URL}/admin/users/${userId}`, {
    headers: getAuthHeaders(),
  });
  const data = await parseJsonResponse<{ message?: string; user?: unknown }>(response);
  if (!response.ok) throw new Error(data.message || "Failed to load user");
  return data.user;
};

export const KYC_STATUS_LABELS: Record<KycStatus, string> = {
  incomplete: "Not Started",
  pending: "Under Review",
  approved: "Verified",
  rejected: "Rejected",
};

export const KYC_STATUS_COLORS: Record<KycStatus, { bg: string; color: string }> = {
  incomplete: { bg: "#6b728015", color: "#6b7280" },
  pending: { bg: "#f59e0b15", color: "#d97706" },
  approved: { bg: "#10b98115", color: "#059669" },
  rejected: { bg: "#ef444415", color: "#dc2626" },
};

export const DOCUMENT_LABELS: Record<KycDocumentType, string> = {
  identity_front: "ID Document (Front)",
  identity_back: "ID Document (Back)",
  proof_of_address: "Proof of Address",
  selfie_with_id: "Selfie with ID",
};
