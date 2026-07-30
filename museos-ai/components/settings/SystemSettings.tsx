import type { MuseSettings } from "@/types/settings";

interface SystemSettingsProps {
    open: boolean;
    settings: MuseSettings;

    onClose: () => void;
    onUpdateSettings: <Section extends keyof MuseSettings>(section: Section, updates: Partial<MuseSettings[Section]>) => void;
    onResetSettings: () => void;
}

export default function SystemSettings({
    open,
    settings,
    onClose,
    onUpdateSettings,
    onResetSettings,
}: SystemSettingsProps) {}