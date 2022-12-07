import { useEffect, useState } from 'react';
import DeckOfCardsAPI from '../services/deckofcardsapi';
import GameContext from './GameContext';

const GameProvider = ({ children }) => {
	const [idGame, setIdGame] = useState(null);
	const [cantCards, setCantCards] = useState(null);
	const [win, setWin] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [winName, setWinName] = useState('');
	const [playerOne, setPlayerOne] = useState({
		name: 'PEDRO',
		cards: [],
	});
	const [playerTwo, setPlayerTwo] = useState({
		name: 'JUAN',
		cards: [],
	});

	const playGame = async () => {
		const res = await DeckOfCardsAPI.getIdGame();
		setIdGame(res.deck_id);
		setCantCards(res.remaining);
	};

	/** cuando se logea */
	useEffect(() => {
		if (idGame != null) {
			DeckCardsPlayerOne();
			DeckCardsPlayerTwo();
		}
	}, [idGame]);

	const DeckCardsPlayerOne = async () => {
		const data = await DeckOfCardsAPI.getDeckCards(idGame);
		setCantCards(data.remaining);
		setPlayerOne({ ...playerOne, cards: data.cards });
	};
	const DeckCardsPlayerTwo = async () => {
		const data = await DeckOfCardsAPI.getDeckCards(idGame);
		setCantCards(data.remaining);
		setPlayerTwo({ ...playerTwo, cards: data.cards });
	};

	const requestCards = () => {
		getCards(); 

		const findCardPlayerOne = recuento(playerOne.cards, 1);
		const findCardPlayerTwo = recuento(playerTwo.cards, 2);

		setPlayerOne({name:'',cards:[]});
		setPlayerTwo({ ...playerTwo, cards: [] });


		if (findCardPlayerOne && findCardPlayerTwo) {
			setWin(true);
			setShowToast(true);
			setWinName('EMPATE');
		} else {
			if (findCardPlayerOne || findCardPlayerTwo) {
				setWin(true);
				setShowToast(true);
				setWinName(findCardPlayerOne ? playerOne.name : playerTwo.name);
			}
		}
	};

	const getCards = async () => {
		const data = await DeckOfCardsAPI.getCards(idGame);
		setCantCards(data.remaining);
		setPlayerOne({ ...playerOne, cards: [...playerOne.cards, data.cards[0]] });
		setPlayerTwo({ ...playerTwo, cards: [...playerTwo.cards, data.cards[1]] });
	};

	let res, filtro, nCard, cardDelete, newDeck, checkDelete;
	const recuento = (cardsPlayer, player) => {
		res = [];
		filtro = [];
		newDeck = [];
		nCard = null;
		cardDelete = null;
		checkDelete = true;
		for (let index = 1; index <= 13; index++) {
			switch (index) {
				case 1:
					nCard = 'ACE';
					break;
				case 11:
					nCard = 'JACK';
					break;
				case 12:
					nCard = 'QUEEN';
					break;
				case 13:
					nCard = 'KING';
					break;
				default:
					nCard = index;
					break;
			}
			res.push({
				value: nCard,
				cant: cardsPlayer.filter(card => card.value == nCard).length,
			});
		}
		filtro = res.filter(card => card.cant > 0);

		filtro = filtro.sort((p1, p2) =>
			p1.cant < p2.cant ? 1 : p1.cant > p2.cant ? -1 : 0
		);
		console.log(filtro);

		if (filtro[1].cant >= 4) {
			cardDelete = filtro.shift();
		} else {
			cardDelete = filtro.pop();
		}
		console.log(cardDelete);

		// gana si tiene 4, terna, terna
		if (filtro[0].cant == 4 && filtro[1].cant == 3 && filtro[2].cant == 3) {
			return true;
		} else {
			cardsPlayer.forEach(card => {
				if (checkDelete && card.value == cardDelete.value) {
					checkDelete = false;
				} else {
					newDeck.push(card);
				}
			});
			// console.log(newDeck);

			if (player == 1) {
				setPlayerOne({ ...playerOne, cards: newDeck });
				// setPlayerOne({ ...playerOne, cards: [...playerOne.cards, data.cards[0]] });

			} else {
				setPlayerTwo({ ...playerTwo, cards: newDeck });

				// console.log('player 2');
			}

			return false;
		}
	};

	return (
		<GameContext.Provider
			value={{
				idGame,
				playGame,
				win,
				requestCards,
				playerOne,
				setPlayerOne,
				playerTwo,
				setPlayerTwo,
				showToast,
				setShowToast,
				winName,
				cantCards,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export default GameProvider;
