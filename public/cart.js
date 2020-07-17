const fillCart = () => {
	const myCart = document.querySelector(".cart-summary");
	const { order, amount } = getCartData();
	order.map((item) => {
		const parentDiv = document.createElement("div");
		const itemDiv = document.createElement("div");
		const qtyDiv = document.createElement("div");
		const amountDiv = document.createElement("div");
		parentDiv.classList.add("row");
		itemDiv.classList.add("col");
		qtyDiv.classList.add("col");
		amountDiv.classList.add("col");
		itemDiv.innerText = item.title;
		qtyDiv.innerText = item.quantity;
		amountDiv.innerText = item.total;

		parentDiv.appendChild(itemDiv);
		parentDiv.appendChild(qtyDiv);
		parentDiv.appendChild(amountDiv);
		myCart.appendChild(parentDiv);
	});

	document.querySelector(".total-amount").innerText = amount;
};

fillCart();
