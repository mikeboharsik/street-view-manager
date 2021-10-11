import { Link } from "react-router-dom";

export default function Connection({ data }) {
	return (
		<span key={data.target.id}>
			<Link to={`/photoEditor/${data.target.id}`}>
				{`...${data.target.id.slice(61, 64)}`}
			</Link>
			<span>
				&nbsp;&nbsp;
			</span>
		</span>
	);
}
