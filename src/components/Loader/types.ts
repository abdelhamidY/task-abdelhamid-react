export type LoaderProps = {
  error?: Error
  isLoading?: boolean
  pastDelay?: boolean
  retry?: () => void
  timedOut?: boolean
  isSmall?: boolean
}
