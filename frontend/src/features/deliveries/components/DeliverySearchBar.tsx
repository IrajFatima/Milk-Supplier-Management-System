// src/features/deliveries/components/DeliverySearchBar.tsx

import { FiSearch } from "react-icons/fi";
import TextField from "../../../components/TextField";

interface DeliverySearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function DeliverySearchBar({
    value,
    onChange,
}: DeliverySearchBarProps) {
    return (
        <TextField
            value={value}
            placeholder="Search by Delivery ID or Customer Name..."
            leftIcon={<FiSearch size={18} />}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}