import {
    CUSTOMER_ACCOUNT_STATUS,
    type CustomerAccountStatus,
} from "../../../constants/customer";

interface CustomerStatusBadgeProps {
    status: CustomerAccountStatus;
}

export default function CustomerStatusBadge({
    status,
}: CustomerStatusBadgeProps) {
    let background = "var(--color-gray-500)";

    switch (status) {
        case CUSTOMER_ACCOUNT_STATUS.ACTIVE:
            background = "var(--color-success)";
            break;

        case CUSTOMER_ACCOUNT_STATUS.INACTIVE:
            background = "var(--color-warning)";
            break;

        case CUSTOMER_ACCOUNT_STATUS.SUSPENDED:
            background = "var(--color-danger)";
            break;
    }

    return (
        <span
            className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{
                background,
            }}
        >
            {status}
        </span>
    );
}