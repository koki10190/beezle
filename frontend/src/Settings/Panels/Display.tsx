function Display({ isOpen, setOpen }: { isOpen: boolean; setOpen: any }) {
	return (
		<div className={`navigation-panel ${!isOpen ? "display-panel-full" : "display-panel"} main-panel`}>
			<h1>Display Content</h1>
		</div>
	);
}

export default Display;
