function CutLong(str: string, len: number): string {
	return str.length > len ? str.substring(0, len) + "..." : str;
}

export default CutLong;
