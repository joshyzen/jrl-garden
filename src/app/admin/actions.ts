"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createPlant(formData: FormData) {
  await prisma.plant.create({
    data: {
      name: String(formData.get("name") || ""),
      scientificName: String(formData.get("scientificName") || ""),
      isNative: Boolean(formData.get("isNative")),
      lightNeeds: String(formData.get("lightNeeds") || ""),
      matureSize: String(formData.get("matureSize") || ""),
      description: String(formData.get("description") || ""),
      imageUrl: String(formData.get("imageUrl") || ""),
      category: String(formData.get("category") || ""),
    },
  });
  revalidatePath("/admin/plants");
}

export async function deletePlant(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  await prisma.plant.delete({ where: { id } });
  revalidatePath("/admin/plants");
}

export async function updatePlant(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const data: Record<string, unknown> = {};
  const fields = [
    "name",
    "scientificName",
    "category",
    "lightNeeds",
    "matureSize",
    "description",
    "imageUrl",
  ] as const;
  for (const f of fields) {
    const v = formData.get(f);
    if (typeof v === "string") data[f] = v;
  }
  const isNative = formData.get("isNative");
  if (typeof isNative === "string") data.isNative = isNative === "true" || isNative === "on";
  if (Object.keys(data).length === 0) return;
  await prisma.plant.update({ where: { id }, data });
  revalidatePath("/admin/plants");
}

export async function createServiceItem(formData: FormData) {
  const sectionRaw = (formData.get("sectionNew") || formData.get("section") || formData.get("sectionSelect") || "") as string;
  const categoryRaw = (formData.get("categoryNew") || formData.get("category") || formData.get("categorySelect") || "") as string;

  await prisma.serviceItem.create({
    data: {
      section: String(sectionRaw),
      category: String(categoryRaw),
      name: String(formData.get("name") || ""),
      unit: String(formData.get("unit") || ""),
      pricePerUnit: Number(formData.get("pricePerUnit") || 0),
    },
  });
  revalidatePath("/admin/services");
}

export async function deleteServiceItem(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  try {
    await prisma.serviceItem.delete({ where: { id } });
  } catch (err) {
    // Ignore if already deleted (stale UI)
  }
  revalidatePath("/admin/services");
}

export async function updateServiceItem(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;

  const data: Record<string, unknown> = {};
  const name = formData.get("name");
  const unit = formData.get("unit");
  const pricePerUnit = formData.get("pricePerUnit");
  const section = formData.get("section");
  const category = formData.get("category");

  if (typeof name === "string" && name.length) data.name = name;
  if (typeof unit === "string" && unit.length) data.unit = unit;
  if (typeof section === "string") data.section = section;
  if (typeof category === "string") data.category = category;
  if (typeof pricePerUnit === "string" && pricePerUnit.length) {
    const n = Number(pricePerUnit);
    if (!Number.isNaN(n)) data.pricePerUnit = n;
  }

  if (Object.keys(data).length === 0) return;
  await prisma.serviceItem.update({ where: { id }, data });
  revalidatePath("/admin/services");
}

export async function markEstimateStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status") || "pending");
  if (!id) return;
  await prisma.estimate.update({ where: { id }, data: { status } });
  revalidatePath("/admin/estimates");
}

export async function updateEstimateLabor(formData: FormData) {
  const id = String(formData.get("id"));
  const laborRaw = String(formData.get("labor") || "0");
  if (!id) return;
  const labor = Number(laborRaw);
  if (Number.isNaN(labor)) return;
  await prisma.estimate.update({ where: { id }, data: { labor } });
  revalidatePath("/admin/estimates");
}

export async function renameSection(formData: FormData) {
  const oldSection = String(formData.get("oldSection") || "").trim();
  const newSection = String(formData.get("newSection") || "").trim();
  if (!oldSection || !newSection || oldSection === newSection) return;
  await prisma.serviceItem.updateMany({ where: { section: oldSection }, data: { section: newSection } });
  revalidatePath("/admin/services");
}

export async function renameCategory(formData: FormData) {
  const section = String(formData.get("section") || "").trim();
  const oldCategory = String(formData.get("oldCategory") || "").trim();
  const newCategory = String(formData.get("newCategory") || "").trim();
  if (!oldCategory || !newCategory || oldCategory === newCategory) return;
  await prisma.serviceItem.updateMany({
    where: section ? { section, category: oldCategory } : { category: oldCategory },
    data: { category: newCategory },
  });
  revalidatePath("/admin/services");
}


