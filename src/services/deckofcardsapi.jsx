const getIdGame = async () => {
	const url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1';
	const res = await fetch(url);
	const data = await res.json();
	// return data?.deck_id;
	return data;
};

const getCards = async deckId => {
	const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;
	const res = await fetch(url);
	const data = await res.json();
	// console.log(data.remaining);
	// return data?.cards;
	return data;
};

const getDeckCards = async deckId => {
	const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=11`;
	const res = await fetch(url);
	const data = await res.json();
	// console.log(data.remaining);
	// return data?.cards;
	// console.log(data);
	return data;
};

const DeckOfCardsAPI = {
	getIdGame,
	getCards,
	getDeckCards,
};

export default DeckOfCardsAPI;
