$("#nav_menu").hide();
$("#toggle_menu").click(function () {
	$("#nav_menu").slideToggle();
});

const modal = document.getElementById("modal");

const openLoginForm = () => {
	modal.style.display = "block";
};

const closeModal = (e) => {
	if (e.target == modal) {
		modalForgotPassword.style.display = "none";
		modalLoginSignUp.style.display = "flex";
		forms.reset();
		login_form.style.display = "block";
		signup_form.style.display = "none";
		login_label.click();
		modal.style.display = "none";

		$("#signup_form input").removeClass("error");
		$("#signup_form").validate().resetForm();

		$("#login_form input").removeClass("error");
		$("#login_form form").validate().resetForm();
		$(".login-error").text("");
	}
};

window.addEventListener("click", closeModal);
const forms = document.getElementById("forms");
const login_label = document.getElementById("login_label");
const signup_label = document.getElementById("signup_label");
const login_form = document.getElementById("login_form");
const signup_form = document.getElementById("signup_form");

login_label.addEventListener("click", () => {
	login_form.style.display = "block";
	signup_form.style.display = "none";
});

signup_label.addEventListener("click", () => {
	signup_form.style.display = "block";
	login_form.style.display = "none";
});

const modalLoginSignUp = document.getElementById("modal_content");
const modalForgotPassword = document.getElementById("modal_content_fp");

const activateLoginSignUpForm = (e) => {
	modalForgotPassword.style.display = "none";
	modalLoginSignUp.style.display = "flex";
};

const activateForgotPasswordForm = (e) => {
	modalLoginSignUp.style.display = "none";
	modalForgotPassword.style.display = "flex";
};

const cart = [];

const addToCart = (e) => {
	const id = e.getAttribute("data-id");
	const buttons = document.getElementById(`${id}`);
	const qty = document.getElementById(`${id}_qty`);
	let i = cart.findIndex((item) => e.id == item.id);

	if (i == -1) {
		const title = e.getAttribute("data-title");
		const price = parseInt(e.getAttribute("data-price"));
		const quantity = 1;
		const total = price * quantity;
		cart.push({ id, title, price, quantity, total });

		qty.innerText = quantity;
		Notiflix.Notify.Success("1 Pizza Added");
	}

	setCartQuantity();
	storeCart();
	getCartData();
	toggleOperationCards("qty", id);
};

document.addEventListener("click", (e) => {
	const operation = e.target.id;
	if (operation === "increment" || operation === "decrement") {
		const id = e.target.parentElement.id;
		const qty = document.getElementById(`${id}_qty`);
		let i = cart.findIndex((item) => id == item.id);

		if (operation === "increment") {
			cart[i].quantity++;
			cart[i].total = cart[i].quantity * cart[i].price;
			qty.innerText = cart[i].quantity;
			Notiflix.Notify.Success("1 Pizza Added");
		}

		if (cart[i].quantity >= 0 && operation === "decrement") {
			cart[i].quantity--;
			cart[i].total = cart[i].quantity * cart[i].price;
			qty.innerText = cart[i].quantity;
			Notiflix.Notify.Info("1 Pizza Removed");
			if (cart[i].quantity <= 0) {
				toggleOperationCards("addtocart", id);
				cart.splice(i, 1);
			}
		}

		setCartQuantity();
		storeCart();
		getCartData();
	}
});

const calculateTotals = () => {
	const grandTotal = cart.reduce((prev, curr) => {
		return prev + curr.total;
	}, 0);
	const totalQuantity = cart.reduce((prev, curr) => {
		return prev + curr.quantity;
	}, 0);
	return { grandTotal, totalQuantity };
};

const toggleOperationCards = (card, id) => {
	const addToCartOperationCard = document.querySelector(`div[data-id="${id}"]`);
	const qtyOperationCard = document.getElementById(`${id}`);

	let input = card;

	switch (input) {
		case "addtocart":
			addToCartOperationCard.style.display = "block";
			qtyOperationCard.style.display = "none";
			break;
		case "qty":
			addToCartOperationCard.style.display = "none";
			qtyOperationCard.style.display = "flex";
			break;
	}
};

const setCartQuantity = () => {
	const cart = document.getElementById("cart-qty");
	cart.innerText = calculateTotals().totalQuantity;
};

const storeCart = () => {
	localStorage.setItem(
		"cart",
		JSON.stringify({ order: cart, amount: calculateTotals().grandTotal })
	);
};

const getCartData = () => {
	return JSON.parse(localStorage.getItem("cart"));
};

const placeOrder = () => {
	const currentCart = getCartData();
	const data = JSON.stringify({
		order: currentCart.order,
		amount: currentCart.amount,
	});

	fetch("/orders", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: data,
	})
		.then((res) => {
			return res.text();
		})
		.then((res) => {
			document.write(res);
		});
};

$("#login-btn").click(function (e) {
	$("#login_form form").validate({
		submitHandler: function (form) {
			e.preventDefault();
			let username = $("[name='username']").val();
			let password = $("#login_form [name='password']").val();
			Notiflix.Loading.Arrows("Please wait...");
			$.post("http://localhost:3000/api/v1/auth/login", {
				username,
				password,
			})
				.done(function (data) {
					document.cookie = `jwt=${data.token}`;
					location.href = "/";
					Notiflix.Loading.Remove();
					Notiflix.Notify.Success("Sign In successful");
				})
				.fail(function (xhr, textStatus, errorThrown) {
					Notiflix.Loading.Remove();

					$(".login-error").text(xhr.responseJSON.error.message);
				});
		},
	});
});

$("#signup-btn").click(function (e) {
	$("#signup_form").validate({
		submitHandler: function (form) {
			e.preventDefault();

			let name = $("[name='name']").val();
			let email = $("[name='email']").val();
			let password = $("[name='password']").val();
			Notiflix.Loading.Arrows("Sending...");
			$.post("http://localhost:3000/api/v1/users/signup", {
				name,
				email,
				password,
			})
				.done(function (data) {
					document.cookie = `jwt=${data.token}`;
					location.href = "/";
					Notiflix.Loading.Remove();
				})
				.fail(function (xhr, textStatus, errorThrown) {
					//console.log(xhr.responseJSON.error);
					Notiflix.Loading.Remove();
					Notiflix.Report.Failure(
						"Sign Up Error",
						`${xhr.responseJSON.error.message}`,
						"Sign Up Again"
					);
					$("[name='email']").after(`<p>${xhr.responseJSON.error.message}<p>`);
				});
		},
	});
});

$("#fp-submit").click(function (e) {
	$("#forgot-pass-form").validate({
		submitHandler: function (form) {
			e.preventDefault();

			let email = $("#forgot-pass-form [name='email']").val();
			Notiflix.Loading.Arrows("Sending...");

			$.post("http://localhost:3000/api/v1/auth/forgotpassword", {
				email,
			})
				.done(function (data) {
					Notiflix.Loading.Remove();
					Notiflix.Report.Success("Email Sent", `${data}`, "OK");
					setTimeout(() => {
						location.href = "/";
					}, 3000);
				})
				.fail(function (xhr, textStatus, errorThrown) {
					//console.log(xhr.responseJSON.error);
					Notiflix.Loading.Remove();
					Notiflix.Report.Failure(
						"Something wrong!",
						`${xhr.responseJSON.error.message}`,
						"Try again"
					);
					$("[name='email']").after(`<p>${xhr.responseJSON.error.message}<p>`);
				});
		},
	});
});
