export default function isNullishOrWhiteSpace(
  value: string | null | undefined
) {
  return value === null || value === undefined || value.trim() === "";
}
