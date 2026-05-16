import { toLocalFromDate } from "#/utilities/date"

interface MagicDateProps {
  className?: string
  isoString: Date
  tz?: string
}

export const MagicDate = ({
  className = "",
  isoString,
  tz = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: MagicDateProps) => <span className={className} title={isoString.toString()}>{toLocalFromDate(tz, isoString)}</span>

export default MagicDate
