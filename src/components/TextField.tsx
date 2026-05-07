import type { BlemInstance } from "#/utilities/blem"

interface TextFieldProps {
  bem: BlemInstance
  iconHead?: React.ReactNode
  iconTail?: React.ReactNode
  value: string
  defaultValue?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => string | void
  id: string
}

export const TextField = ({
  iconHead,
  iconTail,
  onChange,
  defaultValue,
  value,
  bem,
  id,
}: TextFieldProps) => (
  <div id={id} className={bem("textfield")}>
    {iconHead}
    <input
      type="text"
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      className={bem("input")}
    />
    {iconTail}
  </div>
)

export default TextField
