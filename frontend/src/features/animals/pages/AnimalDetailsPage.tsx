// src/features/animals/pages/AnimalDetailsPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEdit } from "react-icons/fi";

import AnimalDetails from "../components/AnimalDetails";

import Spinner from "../../../components/Spinner";

import { animalService } from "../../../services/animal.service";

import { useAuth } from "../../../hooks/useAuth";
import { ANIMAL_STATUS } from "../../../constants/animalStatus";
import { ROLES } from "../../../constants/roles";

import type { Animal } from "../../../types/animal.types";

export default function AnimalDetailsPage() {
    const navigate = useNavigate();

    const { id } = useParams();

    const { user } = useAuth();

    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);

    const canEdit =
        (user?.role === ROLES.OWNER ||
            user?.role === ROLES.FARM_WORKER) &&
        animal?.operationalStatus !== ANIMAL_STATUS.SOLD &&
        animal?.operationalStatus !== ANIMAL_STATUS.DECEASED;

    useEffect(() => {
        async function loadAnimal() {
            if (!id) return;

            try {
                const response =
                    await animalService.getAnimal(Number(id));

                setAnimal(response);
            } catch {
                toast.error("Failed to load animal details.");
            } finally {
                setLoading(false);
            }
        }

        loadAnimal();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner />
            </div>
        );
    }

    if (!animal) {
        return (
            <div
                className="
          text-center
          text-[var(--color-text-secondary)]
        "
            >
                Animal not found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1
                    className="text-2xl font-bold"
                    style={{
                        color: "var(--color-text)",
                    }}
                >
                    Animal Details
                </h1>

                {canEdit && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/animals/${animal.animalId}/edit`
                            )
                        }
                        className="
              inline-flex
              items-center
              gap-2
              rounded-md
              bg-[var(--color-primary)]
              px-4
              py-2
              text-white
              transition
              hover:bg-[var(--color-primary-hover)]
            "
                    >
                        <FiEdit size={18} />

                        Edit
                    </button>
                )}
            </div>

            <AnimalDetails animal={animal} />
        </div>
    );
}