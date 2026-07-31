// src/features/users/components/UserSearchBar.tsx

import { FiSearch } from "react-icons/fi";

import TextField from "../../../components/TextField";

interface UserSearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function UserSearchBar({
    value,
    onChange,
}: UserSearchBarProps) {
    return (
        <TextField
            value={value}
            placeholder="Search by Name, Username or Email..."
            leftIcon={<FiSearch size={18} />}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}