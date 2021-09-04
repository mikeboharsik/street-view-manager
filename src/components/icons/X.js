export default function X({ fill = 'white', height = 32, onClick = () => {}, style = {}, width = 32 }) {
	return (
		<svg fill={fill} height={height} onClick={onClick} style={style} viewBox="6 6 12 12" width={width} x="0px" y="0px">
			<path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"/>
		</svg>
	);
}
