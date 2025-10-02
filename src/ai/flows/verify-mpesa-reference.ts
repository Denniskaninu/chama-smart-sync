'use server';

/**
 * @fileOverview A flow that verifies the authenticity of an M-Pesa reference using a GenAI model.
 *
 * - verifyMpesaReference - A function that verifies the authenticity of an M-Pesa reference.
 * - VerifyMpesaReferenceInput - The input type for the verifyMpesaReference function.
 * - VerifyMpesaReferenceOutput - The return type for the verifyMpesaReference function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyMpesaReferenceInputSchema = z.object({
  mpesaReference: z
    .string()
    .describe('The M-Pesa reference number to verify.'),
});
export type VerifyMpesaReferenceInput = z.infer<typeof VerifyMpesaReferenceInputSchema>;

const VerifyMpesaReferenceOutputSchema = z.object({
  isValid: z
    .boolean()
    .describe(
      'Whether or not the M-Pesa reference number is likely to be valid.'
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the likelihood that the reference number is valid.'
    ),
});
export type VerifyMpesaReferenceOutput = z.infer<typeof VerifyMpesaReferenceOutputSchema>;

export async function verifyMpesaReference(
  input: VerifyMpesaReferenceInput
): Promise<VerifyMpesaReferenceOutput> {
  return verifyMpesaReferenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyMpesaReferencePrompt',
  input: {schema: VerifyMpesaReferenceInputSchema},
  output: {schema: VerifyMpesaReferenceOutputSchema},
  prompt: `You are a financial expert specializing in Kenyan mobile money transactions via M-Pesa.

You will determine the validity of a given M-Pesa reference number.

Respond with a boolean value for isValid and a confidence score (0-1) indicating the likelihood that the reference number is valid.

Reference Number: {{{mpesaReference}}}`,
});

const verifyMpesaReferenceFlow = ai.defineFlow(
  {
    name: 'verifyMpesaReferenceFlow',
    inputSchema: VerifyMpesaReferenceInputSchema,
    outputSchema: VerifyMpesaReferenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
