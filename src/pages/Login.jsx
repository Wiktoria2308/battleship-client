import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useGameContext } from "../contexts/GameContextProvider";

const Homepage = () => {
	const [username, setUsername] = useState("");
	const [game, setGame] = useState();
	const [gamelist, setGamelist] = useState([]);
	const { setGameUsername, socket } = useGameContext();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// set chat username
		setGameUsername(username);

		// redirect to game
		navigate(`/games/${game}`);
	};

	// as soon as the component is mounted, request room list
	useEffect(() => {
		console.log("Requesting game list from server...");

		socket.emit("get-game-list", (rooms) => {
			setGamelist(rooms);
		});
	}, [socket]);

	return (
		<div id="login">

			<h1>Battleship multiplayer game</h1>

			<Form onSubmit={handleSubmit}>
				<Form.Group className="loginForm" controlId="username">
					{/* <Form.Label>Username</Form.Label> */}
					<Form.Control
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter your username"
						required
						type="text"
						value={username}
					/>
				</Form.Group>

				<Form.Group className="chooseRoom" controlId="room">
					{/* <Form.Label>Room</Form.Label> */}
					<Form.Select
						onChange={(e) => setGame(e.target.value)}
						required
						value={game}
					>
						{gamelist.length === 0 && (
							<option disabled>Loading...</option>
						)}
						{gamelist.length && (
							<>
								<option value="">Select a room to join</option>
								{gamelist.map((r) => (
									<option key={r.id} value={r.id}>
										{r.name}
									</option>
								))}
							</>
						)}
					</Form.Select>
				</Form.Group>

				<div className="btn-join">
					<Button
						variant="success"
						type="submit"
						className="w-100"
						disabled={!username || !game}
					>
						Join
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default Homepage;
