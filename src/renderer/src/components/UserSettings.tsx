import { createContext, use } from "react";
import type { UserSetting } from "~/types";

interface UserSettingsContextInterface {
	userSettings: Map<string, UserSetting>;
}

const UserSettingsContext = createContext<UserSettingsContextInterface | null>(
	null,
);

export function useUserSettings() {
	const context = use(UserSettingsContext);
	if (!context) {
		throw new Error(
			"useUserSettings must be used within a UserSettingsProvider",
		);
	}

	return context;
}

interface UserSettingsProviderProps {
	userSettings: UserSetting[];
	children: React.ReactNode;
}

export function UserSettingsProvider({
	userSettings,
	children,
}: UserSettingsProviderProps) {
	const userSettingsMap = new Map(
		userSettings.map((userSetting) => [userSetting.settingKey, userSetting]),
	);

	return (
		<UserSettingsContext.Provider value={{ userSettings: userSettingsMap }}>
			{children}
		</UserSettingsContext.Provider>
	);
}
