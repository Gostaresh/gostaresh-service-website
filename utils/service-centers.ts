import type { ServiceCenter, ServiceCenterMap } from "@/types/service-center";

let cachedCenters: ServiceCenter[] | null = null;
let cachedMap: ServiceCenterMap | null = null;

const loadCenters = async (): Promise<ServiceCenter[]> => {
  if (cachedCenters) {
    return cachedCenters;
  }
  const data = (await import("@/public/data/service-centers.json"))
    .default as ServiceCenter[];
  cachedCenters = data;
  return data;
};

export const getServiceCenters = async (): Promise<ServiceCenter[]> => {
  const centers = await loadCenters();
  return centers
    .slice()
    .sort((a, b) => a.city.localeCompare(b.city, "fa"));
};

export const getServiceCenterMap = async (): Promise<ServiceCenterMap> => {
  if (cachedMap) {
    return cachedMap;
  }
  const centers = await loadCenters();
  cachedMap = centers.reduce<ServiceCenterMap>((acc, item) => {
    acc[item.slug] = item;
    return acc;
  }, {} as ServiceCenterMap);
  return cachedMap;
};

export const findServiceCenter = async (
  slug: string
): Promise<ServiceCenter | undefined> => {
  const map = await getServiceCenterMap();
  return map[slug];
};

export const getPrimaryCenters = async (
  limit = 3
): Promise<ServiceCenter[]> => {
  const centers = await getServiceCenters();
  const highlighted = centers.filter((center) => center.primary);
  if (highlighted.length >= limit) {
    return highlighted.slice(0, limit);
  }
  const fallback = centers.filter((center) => !center.primary);
  return [...highlighted, ...fallback].slice(0, limit);
};
