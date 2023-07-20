const activityItems = [
	{
		name: "Hexagon Avatar Shape",
		price: 5000,
		style: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
	},
	{
		name: "Square Avatar Shape",
		price: 1000,
		style: "polygon(0 0, 100% 0%, 100% 100%, 0% 100%)",
	},
	{
		name: "Parallelogram Avatar Shape",
		price: 4500,
		style: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
	},
	{
		name: "Triangle Avatar Shape",
		price: 1500,
		style: "polygon(50% 0%, 0% 100%, 100% 100%)",
	},
	{
		name: "Rhombus Avatar Shape",
		price: 2000,
		style: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
	},
	{
		name: "Right Arrow Avatar Shape",
		price: 7000,
		style: "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
	},
	{
		name: "Left Arrow Avatar Shape",
		price: 7000,
		style: "polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)",
	},
	{
		name: "X Avatar Shape",
		price: 15000,
		style: "polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)",
	},
	{
		name: "Right Chevron Avatar Shape",
		price: 10000,
		style: "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)",
	},
	{
		name: "Left Chevron Avatar Shape",
		price: 10000,
		style: "polygon(100% 0%, 75% 50%, 100% 100%, 25% 100%, 0% 50%, 25% 0%)",
	},
	{
		name: "Star Avatar Shape",
		price: 15000,
		style: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
	},
];

interface ItemType {
	name: string;
	price: number;
	style: string;
}

export { ItemType, activityItems };
