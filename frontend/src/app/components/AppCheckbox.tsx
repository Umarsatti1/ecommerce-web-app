import { useController, UseControllerProps } from "react-hook-form"
import * as Checkbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

interface Props extends UseControllerProps {
    label: string
    disabled: boolean
}

export default function AppCheckbox(props: Props) {
    const {field} = useController({...props, defaultValue: false})
    
    return (
        <div className="flex items-center gap-2">
            <Checkbox.Root
                className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 data-[state=checked]:bg-black"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={props.disabled}
                id={field.name}
            >
                <Checkbox.Indicator>
                    <Check className="h-4 w-4 text-white" />
                </Checkbox.Indicator>
            </Checkbox.Root>
            <label 
                htmlFor={field.name}
                className="text-sm text-gray-700"
            >
                {props.label}
            </label>
        </div>
    )
}