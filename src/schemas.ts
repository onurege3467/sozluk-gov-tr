import { z } from "zod";

export const TdkAnlamSchema = z.object({
  anlam: z.string(),
  anlam_sira: z.string(),
});

export const TdkErrorSchema = z.object({
  error: z.string(),
});

export const TdkResponseSchema = z
  .object({
    madde: z.string(),
    lisan: z.string().optional().nullable(),
    telaffuz: z.string().optional().nullable(),
    birlesikler: z.string().optional().nullable(),
    anlamlarListe: z.array(TdkAnlamSchema).optional(),
    atasozu: z
      .array(
        z.object({
          madde: z.string(),
        })
      )
      .optional(),
  })
  .array()
  .min(1);
