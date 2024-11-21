import { useState } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  title: string
  items: string[]
  checked?: string[]
  onChange: (items: string[]) => void
}

export default function CheckboxDropdown({ title, items, checked, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(true)
  const [checkedItems, setCheckedItems] = useState(checked || [])

  function handleChecked(value: string) {
    const currentIndex = checkedItems.findIndex(item => item === value)
    let newChecked: string[] = []
    if (currentIndex === -1) {
      newChecked = [...checkedItems, value]
    } else {
      newChecked = checkedItems.filter(item => item !== value)
    }
    setCheckedItems(newChecked)
    onChange(newChecked)
  }

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <Collapsible.Trigger className="flex w-full items-center justify-between border-b border-gray-200 pb-2">
        <span className="text-lg font-semibold">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </Collapsible.Trigger>
      
      <Collapsible.Content className="pt-4">
        <div className="space-y-2">
          {items.map(item => (
            <label key={item} className="flex items-center space-x-2 text-gray-400 hover:text-gray-900">
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={() => handleChecked(item)}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}