// src/features/users/components/UserForm.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Dropdown from "../../../components/Dropdown";
import TextField from "../../../components/TextField";
import Spinner from "../../../components/Spinner";

import { userService } from "../../../services/user.service";
import { useAuth } from "../../../hooks/useAuth";
import { ROLES } from "../../../constants/roles";

import type { CreateUserRequest, UpdateUserRequest, UserDetails, UserRole } from "../../../types/user.types";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

interface CreateUserFormProps { mode: "create"; user?: UserDetails; onSubmit: (data: CreateUserRequest) => Promise<void>; }
interface EditUserFormProps { mode: "edit"; user: UserDetails; onSubmit: (data: UpdateUserRequest) => Promise<void>; }

type UserFormProps = CreateUserFormProps | EditUserFormProps;
type UserFormValues = { username: string; email: string; password: string; roleId: number | ""; fullName: string; contactNumber: string; department: string; jobTitle: string; hireDate: string; };

export default function UserForm({ user, mode, onSubmit }: UserFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [roles, setRoles] = useState<UserRole[]>([]);
    const isInitialLoad = useRef(true);
    const { user: authUser } = useAuth();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormValues>({
        defaultValues: { username: "", email: "", password: "", roleId: "", fullName: "", contactNumber: "", department: "", jobTitle: "", hireDate: "" }
    });

    useEffect(() => {
        async function loadRoles() {
            try { setRoles(await userService.getRoles()); }
            catch (error: unknown) { toast.error(getApiErrorMessage(error, "Failed to load roles.")); }
        }
        loadRoles();
    }, []);

    const availableRoles = useMemo(() => {
        return roles.filter(
            (role) =>
                role.roleName !== ROLES.OWNER &&
                role.roleName !== ROLES.CUSTOMER &&
                (
                    authUser?.role !== ROLES.SYSTEM_ADMINISTRATOR ||
                    role.roleName !== ROLES.SYSTEM_ADMINISTRATOR
                )
        );
    }, [roles, authUser]);

    useEffect(() => {
        if (mode === "create") {
            reset({ username: "", email: "", password: "", roleId: "", fullName: "", contactNumber: "", department: "", jobTitle: "", hireDate: "" });
            isInitialLoad.current = false;
            return;
        }

        if (mode === "edit" && user && roles.length) {
            reset({
                username: user.username,
                email: user.email,
                password: "",
                roleId: user.roleId,
                fullName: user.fullName,
                contactNumber: user.contactNumber ?? "",
                department: user.department ?? "",
                jobTitle: user.jobTitle ?? "",
                hireDate: user.hireDate ? new Date(user.hireDate).toISOString().split("T")[0] : ""
            });
            isInitialLoad.current = false;
        }
    }, [mode, user, reset, roles.length]);

    const submitHandler = async (data: UserFormValues) => {
        try {
            setSubmitting(true);

            if (mode === "edit") {
                await onSubmit({
                    username: data.username,
                    email: data.email,
                    roleId: Number(data.roleId),
                    fullName: data.fullName,
                    contactNumber: data.contactNumber || undefined,
                    department: data.department || undefined,
                    jobTitle: data.jobTitle || undefined,
                    hireDate: data.hireDate
                });
                return;
            }

            await onSubmit({
                username: data.username,
                email: data.email,
                password: data.password,
                roleId: Number(data.roleId),
                fullName: data.fullName,
                contactNumber: data.contactNumber || undefined,
                department: data.department || undefined,
                jobTitle: data.jobTitle || undefined,
                hireDate: data.hireDate
            });
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Unable to save user."));
        } finally { setSubmitting(false); }
    };

    const isEdit = mode === "edit";

    return <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <TextField label="Full Name" required error={errors.fullName?.message} {...register("fullName", { required: "Full name is required." })} />

        <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Username" required disabled={isEdit} error={errors.username?.message} {...register("username", { required: "Username is required." })} />
            <TextField label="Email" type="email" required error={errors.email?.message} {...register("email", { required: "Email is required.", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address." } })} />
        </div>

        {!isEdit && <TextField label="Password" type="password" required error={errors.password?.message} {...register("password", { required: "Password is required.", minLength: { value: 6, message: "Password must contain at least 6 characters." } })} />}

        <Dropdown label="Role" required error={errors.roleId?.message} {...register("roleId", { required: "Role is required." })}>
            <option value="">Select Role</option>
            {availableRoles.map(role => <option key={role.roleId} value={role.roleId}>{role.roleName}</option>)}
        </Dropdown>

        <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Contact Number" {...register("contactNumber")} />
            <TextField label="Hire Date" type="date" required error={errors.hireDate?.message} {...register("hireDate", { required: "Hire date is required." })} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Department" {...register("department")} />
            <TextField label="Job Title" {...register("jobTitle")} />
        </div>

        <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-5 py-2 text-white disabled:opacity-50">
            {submitting && <Spinner size="sm" className="border-white border-t-transparent" />}
            {submitting ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </button>
    </form>;
}