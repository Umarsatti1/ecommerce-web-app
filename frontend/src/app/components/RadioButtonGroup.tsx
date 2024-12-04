import * as Select from '@radix-ui/react-select'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'

interface Props {
  options: { value: string; label: string }[]
  selectedValue: string
  onChange: (value: string) => void
}

export default function SortDropdown({ options, selectedValue, onChange }: Props) {
  return (
    <Select.Root value={selectedValue} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center gap-2 text-sm focus:outline-none">
        <span className="text-gray-600">Sort by:</span>
        <Select.Value />
        <Select.Icon>
          <ChevronDown className="h-4 w-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          className="z-50 min-w-[200px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-80"
        >
          <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white">
            <ChevronUp className="h-4 w-4" />
          </Select.ScrollUpButton>

          <Select.Viewport className="p-1">
            {options.map(({ value, label }) => (
              <Select.Item
                key={value}
                value={value}
                className="relative flex select-none items-center rounded-sm py-2 pl-8 pr-4 text-sm outline-none hover:bg-gray-100 cursor-pointer"
              >
                <Select.ItemText>
                  <span className={selectedValue === value ? 'font-semibold' : ''}>
                    {label}
                  </span>
                </Select.ItemText>
                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>

          <Select.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white">
            <ChevronDown className="h-4 w-4" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}