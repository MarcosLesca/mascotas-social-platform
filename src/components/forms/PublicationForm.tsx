"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { POST_TYPE, PET_SIZE, PET_GENDER } from "@/types";
import { Input, Textarea, Select, Button } from "@/components/ui";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { LocationPicker } from "@/components/forms/LocationPicker";
import { createPost } from "@/actions/posts";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const petTypes = [
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "ave", label: "Ave" },
  { value: "conejo", label: "Conejo" },
  { value: "hamster", label: "Hámster" },
  { value: "tortuga", label: "Tortuga" },
  { value: "caballo", label: "Caballo" },
  { value: "otro", label: "Otro" },
];

const sizeOptions = [
  { value: PET_SIZE.SMALL, label: "Pequeño/a (< 5kg)" },
  { value: PET_SIZE.MEDIUM, label: "Mediano/a (5-15kg)" },
  { value: PET_SIZE.LARGE, label: "Grande (> 15kg)" },
];

const genderOptions = [
  { value: PET_GENDER.MALE, label: "Macho" },
  { value: PET_GENDER.FEMALE, label: "Hembra" },
  { value: PET_GENDER.UNKNOWN, label: "No se sabe" },
];

const formSchema = z.object({
  type: z.enum([POST_TYPE.LOST, POST_TYPE.ADOPTION, POST_TYPE.DONATION]),
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(20, "La descripción debe tener al menos 20 caracteres"),
  pet: z.object({
    name: z.string().optional(),
    type: z.string().min(1, "Selecciona el tipo de mascota"),
    breed: z.string().optional(),
    size: z.enum([PET_SIZE.SMALL, PET_SIZE.MEDIUM, PET_SIZE.LARGE]),
    gender: z.enum([PET_GENDER.MALE, PET_GENDER.FEMALE, PET_GENDER.UNKNOWN]),
    age: z.string().optional(),
    color: z.string().min(1, "El color es requerido"),
    description: z.string().min(10, "Describe a la mascota"),
    distinctiveFeatures: z.string().optional(),
  }),
  contact: z.object({
    name: z.string().optional(),
    phone: z.string().min(8, "El teléfono es requerido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    whatsapp: z.string().optional(),
  }),
  location: z.object({
    latitude: z.number().refine(val => val !== 0, "La ubicación es requerida"),
    longitude: z.number().refine(val => val !== 0, "La ubicación es requerida"),
    address: z.string().min(5, "La dirección es requerida"),
    city: z.string().min(1, "La localidad es requerida"),
    department: z.string().optional(),
  }),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string(),
    size: z.number(),
  })).min(1, "Al menos una imagen es requerida"),
});

type FormData = z.infer<typeof formSchema>;

export function PublicationForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: POST_TYPE.LOST,
      title: "",
      description: "",
      pet: {
        name: "",
        type: "",
        breed: "",
        size: PET_SIZE.MEDIUM,
        gender: PET_GENDER.UNKNOWN,
        age: "",
        color: "",
        description: "",
        distinctiveFeatures: "",
      },
      contact: {
        name: "",
        phone: "",
        email: "",
        whatsapp: "",
      },
      location: {
        latitude: 0,
        longitude: 0,
        address: "",
        city: "San Justo",
        department: "",
      },
      images: [],
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    console.log('Submitting form with data:', data);

    try {
      const result = await createPost(data);
      
      console.log('Create post result:', result);
      
      if (result.success) {
        setSubmitted(true);
        reset();
      } else {
        console.error('Form submission error:', result.error);
        setError(result.error || "Error al crear la publicación");
      }
    } catch (err) {
      console.error('Unexpected error during submission:', err);
      setError("Error inesperado. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            ¡Publicación creada!
          </h2>
          <p className="text-green-700 mb-6">
            Tu publicación ha sido recibida y está pendiente de aprobación. 
            Una vez aprobada, estará visible por 1 mes.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full"
            >
              Volver al inicio
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                reset();
              }}
              className="w-full"
            >
              Crear otra publicación
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Importante:</p>
            <p>Las publicaciones quedan pendientes de aprobación y duran 1 mes una vez aprobadas.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Tipo de publicación */}
        <div>
          <label className="block text-lg font-semibold mb-4">Tipo de publicación *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: POST_TYPE.LOST, label: "Mascota Perdida", desc: "Busca a tu mascota", color: "border-rose-300 bg-rose-50" },
              { value: POST_TYPE.ADOPTION, label: "Adopción", desc: "Busca hogar para una mascota", color: "border-emerald-300 bg-emerald-50" },
              { value: POST_TYPE.DONATION, label: "Ayuda Comunitaria", desc: "Solicita asistencia", color: "border-sky-300 bg-sky-50" },
            ].map((type) => (
              <label
                key={type.value}
                className={cn(
                  "block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105",
                  selectedType === type.value
                    ? type.color
                    : "border-gray-300 hover:border-gray-400 bg-white"
                )}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register("type")}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">{type.label}</div>
                  <div className="text-sm text-gray-600">{type.desc}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.type && (
            <p className="text-red-600 text-sm mt-2">{errors.type.message}</p>
          )}
        </div>

        {/* Información básica */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Información de la publicación</h3>
          <div className="space-y-4">
            <Input
              label="Título *"
              placeholder="Ej: Se busca gato siamés en Pocitos"
              {...register("title")}
              error={errors.title?.message}
            />
            <Textarea
              label="Descripción *"
              placeholder="Describe los detalles importantes de la publicación..."
              rows={4}
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
        </div>

        {/* Información de la mascota */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Información de la mascota</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre (opcional)"
              placeholder="Nombre de la mascota"
              {...register("pet.name")}
              error={errors.pet?.name?.message}
            />
            <Select
              label="Tipo de mascota *"
              options={petTypes}
              {...register("pet.type")}
              error={errors.pet?.type?.message}
            />
            <Input
              label="Raza (opcional)"
              placeholder="Ej: Siamés, Caniche, etc."
              {...register("pet.breed")}
              error={errors.pet?.breed?.message}
            />
            <Select
              label="Tamaño *"
              options={sizeOptions}
              {...register("pet.size")}
              error={errors.pet?.size?.message}
            />
            <Select
              label="Sexo *"
              options={genderOptions}
              {...register("pet.gender")}
              error={errors.pet?.gender?.message}
            />
            <Input
              label="Edad (opcional)"
              placeholder="Ej: 2 años, cachorro, etc."
              {...register("pet.age")}
              error={errors.pet?.age?.message}
            />
            <Input
              label="Color principal *"
              placeholder="Ej: Negro, marrón, blanco"
              {...register("pet.color")}
              error={errors.pet?.color?.message}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Descripción de la mascota *"
              placeholder="Describe características físicas, comportamiento, etc."
              rows={3}
              {...register("pet.description")}
              error={errors.pet?.description?.message}
            />
          </div>
          <div className="mt-4">
            <Textarea
              label="Características distintivas (opcional)"
              placeholder="Ej: Mancha en la oreja, cicatriz, etc."
              rows={2}
              {...register("pet.distinctiveFeatures")}
              error={errors.pet?.distinctiveFeatures?.message}
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ubicación en San Justo</h3>
          <LocationPicker
            location={watch("location")}
            onChange={(location) => setValue("location", location)}
            error={errors.location?.address?.message}
          />
        </div>

        {/* Imágenes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Fotos de la mascota</h3>
          <ImageUpload
            images={watch("images")}
            onChange={(images) => setValue("images", images)}
          />
          {errors.images && (
            <p className="text-red-600 text-sm mt-2">{errors.images.message}</p>
          )}
        </div>

        {/* Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tu nombre (opcional)"
              placeholder="Nombre para mostrar"
              {...register("contact.name")}
              error={errors.contact?.name?.message}
            />
            <Input
              label="Teléfono *"
              placeholder="099 123 456"
              {...register("contact.phone")}
              error={errors.contact?.phone?.message}
            />
            <Input
              label="Email (opcional)"
              type="email"
              placeholder="email@ejemplo.com"
              {...register("contact.email")}
              error={errors.contact?.email?.message}
            />
            <Input
              label="WhatsApp (opcional)"
              placeholder="099 123 456"
              {...register("contact.whatsapp")}
              error={errors.contact?.whatsapp?.message}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center pt-8">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            className="px-8"
          >
            {loading ? "Creando publicación..." : "Crear publicación"}
          </Button>
        </div>
      </form>
    </div>
  );
}