import type { FieldErrors, FieldValues } from "react-hook-form";

/**
 * Safely extracts an error message from a FieldErrors object for discriminated union forms.
 *
 * When using discriminated unions in Zod schemas, TypeScript may not narrow the error types correctly,
 * requiring runtime checks to access error messages safely.
 *
 * @param errors - The errors object from react-hook-form
 * @param field - The field name to extract the error for
 * @returns The error message if it exists, otherwise undefined
 *
 * @example
 * ```tsx
 * const errors = formMethods.formState.errors;
 * <TextField
 *   error={translateError(getFieldError(errors, "fodselsnummer"))}
 *   {...register("fodselsnummer")}
 * />
 * ```
 */
export function getFieldError<T extends FieldValues>(
  errors: FieldErrors<T>,
  field: string,
): string | undefined {
  return field in errors
    ? (errors[field as keyof typeof errors]?.message as string | undefined)
    : undefined;
}
