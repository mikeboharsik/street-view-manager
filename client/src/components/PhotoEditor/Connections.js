import Connection from './Connection';

export default function Connections({ curPhoto }) {
	const { connections } = curPhoto;

	let content = 'None';
	if (connections) {
		content = connections.map((c) => <Connection data={c} key={c.target.id} />);
	}

	return (
		<span>
			Connections: {content}
		</span>
	);
}
