// src/features/animals/pages/CreateAnimalPage.tsx

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import AnimalForm from "../components/AnimalForm";

import { animalService } from "../../../services/animal.service";

import type { CreateAnimalRequest } from "../../../types/animal.types";

export default function CreateAnimalPage() {
  const navigate = useNavigate();

  async function handleCreate(
    data: CreateAnimalRequest
  ) {
    try {
      await animalService.createAnimal(data);

      toast.success("Animal created successfully.");

      navigate("/animals");
    } catch {
      toast.error("Failed to create animal.");
      throw new Error("Animal creation failed.");
    }
  }

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl font-bold"
        style={{
          color: "var(--color-text)",
        }}
      >
        Add Animal
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
          mode="create"
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
}