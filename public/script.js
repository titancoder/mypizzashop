const toggleMenu = document.getElementById("toggle_menu");

const toggle = () => {
	if (toggleMenu.classList.contains("d-none")) {
		toggleMenu.classList.replace("d-none", "d-block");
	} else {
		toggleMenu.classList.replace("d-block", "d-none");
	}
};
