// Persisted Softr settings, read on 2026-09-18; snapshot defaults remain unchanged.
const textSettings: Record<string, string> = { headline: 'Connect your STEM team with industry support.' };
export function useTextSetting(setting: {name: string; label: string; initialValue: string}) {
  return textSettings[setting.name] ?? setting.initialValue;
}
export function useImageSetting(setting: {name: string; label: string; initialValue: {src: string; alt: string}}) {
  return setting.initialValue;
}
