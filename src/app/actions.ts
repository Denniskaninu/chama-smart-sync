'use server';

import { 
  verifyMpesaReference, 
  type VerifyMpesaReferenceInput,
  type VerifyMpesaReferenceOutput,
} from '@/ai/flows/verify-mpesa-reference';

export async function checkMpesaReference(data: VerifyMpesaReferenceInput): Promise<VerifyMpesaReferenceOutput> {
  try {
    const result = await verifyMpesaReference(data);
    return result;
  } catch (error) {
    console.error("Error verifying M-Pesa reference:", error);
    // Return a default "invalid" state on error
    return {
      isValid: false,
      confidence: 0,
    };
  }
}
