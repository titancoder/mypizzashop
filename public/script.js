const toggleMenu = document.getElementById("toggle_menu");

const toggle = () => {
	if (toggleMenu.classList.contains("d-none")) {
		toggleMenu.classList.replace("d-none", "d-block");
	} else {
		toggleMenu.classList.replace("d-block", "d-none");
	}
};

const modal = document.getElementById("modal");

const openLoginForm = () => {
	modal.style.display = "block";
	//modal.classList.toggle("hide");
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
