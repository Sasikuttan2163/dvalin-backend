interface DataItem {
	name: string;
	rarity: number;
}
export interface WeaponItem extends DataItem {
	type: string;
}

export interface CharacterItem extends DataItem {
	element: string;
	weaponType: string;
}

export interface AchievementCategoryItem {
	name: string;
	order: number;
	achievementCount: number;
}

interface Index {
	Character: Record<string, CharacterItem>;
	Weapon: Record<string, WeaponItem>;
	AchievementCategory: Record<string, AchievementCategoryItem>;
}

export type { Index };
