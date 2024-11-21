import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore"
import { setProductParams } from "./catalogSlice"
import { useState } from "react"
import debounce from 'lodash/debounce'

export default function ProductSearch() {
    const {productParams} = useAppSelector(state => state.catalog)
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm)
    const dispatch = useAppDispatch()

    const debouncedSearch = debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProductParams({searchTerm: event.target.value}))
    }, 1000)

    return (
        <div className="relative w-full">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm || ''}
                onChange={(event) => {
                    setSearchTerm(event.target.value)
                    debouncedSearch(event)
                }}
                className="w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:outline-none"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
        </div>
    )
}