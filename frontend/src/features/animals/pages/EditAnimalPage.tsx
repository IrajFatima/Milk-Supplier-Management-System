// src/features/animals/pages/EditAnimalPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";

import AnimalForm from "../components/AnimalForm";

import Spinner from "../../../components/Spinner";

import { animalService } from "../../../services/animal.service";

import type {
  Animal,
  UpdateAnimalRequest,
} from "../../../types/animal.types";

export default function EditAnimalPage() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnimal() {
      if (!id) return;

      try {
        const response = await animalService.getAnimal(
          Number(id)
        );

        setAnimal(response);
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, "Failed to load animal."));
      } finally {
        setLoading(false);
      }
    }

    loadAnimal();
  }, [id]);

  async function handleUpdate(
    data: UpdateAnimalRequest
  ) {
    if (!id) return;

    try {
      await animalService.updateAnimal(
        Number(id),
        data
      );

      toast.success("Animal updated successfully.");

      navigate(`/animals/${id}`);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update animal."));

      throw new Error("Animal update failed.");
    }
  }

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
        className="text-center text-[var(--color-text-secondary)]"
      >
        Animal not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{
          color: "var(--color-text)",
        }}
      >
        Edit Animal
      </h1>

      <div
        className="
          rounded-xl
          border
          border-[var(--color-border)]
          bg-[var(--color-surface)]
          p-6
        "
      >
        <AnimalForm
          animal={animal}
          mode="edit"
          onSubmit={handleUpdate}
        />
      </div>
    </div>
  );
}
