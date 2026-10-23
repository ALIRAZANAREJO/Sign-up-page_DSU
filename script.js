
"use strict";

// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const nameField = document.getElementById("nameField");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const loginOptions = document.getElementById("loginOptions");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const submitBtn = document.getElementById("submitBtn");
const switchText = document.getElementById("switchText");
const switchMode = document.getElementById("switchMode");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const forgotPassword = document.getElementById("forgotPassword");

let mode = "login";


// ==========================================
// 2. GET USERS FROM LOCAL STORAGE
// ==========================================

function getUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem("classicUsers") || "[]"
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}


// ==========================================
// 3. DISPLAY SUCCESS OR ERROR MESSAGE
// ==========================================

function showMessage(text, type = "error") {
    message.textContent = text;
    message.className = `message ${type}`;
}


// ==========================================
// 4. SWITCH BETWEEN SIGN IN AND SIGN UP
// ==========================================

function setMode(newMode) {
    mode = newMode;

    authForm.reset();
    showMessage("");

    passwordInput.type = "password";
    togglePassword.textContent = "Show";

    const isSignup = mode === "signup";

    nameField.hidden = !isSignup;
    nameInput.required = isSignup;

    loginOptions.hidden = isSignup;

    passwordInput.autocomplete = isSignup
        ? "new-password"
        : "current-password";

    loginTab.classList.toggle("active", !isSignup);
    signupTab.classList.toggle("active", isSignup);

    formTitle.textContent = isSignup
        ? "Create account"
        : "Sign in";

    formSubtitle.textContent = isSignup
        ? "Enter your details to create an account."
        : "Enter your details to access your account.";

    submitBtn.textContent = isSignup
        ? "Create Account"
        : "Sign In";

    switchText.textContent = isSignup
        ? "Already have an account?"
        : "Don't have an account?";

    switchMode.textContent = isSignup
        ? "Sign in"
        : "Sign up";
}

loginTab.addEventListener("click", () => setMode("login"));

signupTab.addEventListener("click", () => setMode("signup"));

switchMode.addEventListener("click", () => {
    setMode(mode === "login" ? "signup" : "login");
});


// ==========================================
// 5. SHOW OR HIDE PASSWORD
// ==========================================

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    togglePassword.textContent = isHidden ? "Hide" : "Show";
});


// ==========================================
// 6. SIGN UP AND SIGN IN
// ==========================================

authForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    let users = getUsers();

    // --------------------------------------
    // SIGN UP
    // --------------------------------------

    if (mode === "signup") {

        if (!name) {
            showMessage("Please enter your full name.");
            return;
        }

        if (password.length < 6) {
            showMessage("Password must contain at least 6 characters.");
            return;
        }

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            showMessage("An account with this email already exists.");
            return;
        }

        // Demo only: plaintext passwords are not secure.
        users.push({
            name: name,
            email: email,
            password: password
        });

        try {
            localStorage.setItem(
                "classicUsers",
                JSON.stringify(users)
            );
        } catch (error) {
            showMessage("Unable to save account in this browser.");
            return;
        }

        setMode("login");

        emailInput.value = email;

        showMessage(
            "Account created successfully! Please sign in.",
            "success"
        );

        return;
    }


    // --------------------------------------
    // SIGN IN
    // --------------------------------------

    const user = users.find(
        item =>
            item.email === email &&
            item.password === password
    );

    if (!user) {
        showMessage("Invalid email or password.");
        return;
    }

    // Save the signed-in user's email.
    try {
        sessionStorage.removeItem("classicCurrentUser");
        localStorage.removeItem("classicCurrentUser");

        if (rememberInput.checked) {
            localStorage.setItem(
                "classicCurrentUser",
                user.email
            );
        } else {
            sessionStorage.setItem(
                "classicCurrentUser",
                user.email
            );
        }
    } catch (error) {
        showMessage("Unable to save your sign-in session.");
        return;
    }

    // Redirect after successful sign-in.
    window.location.href = "./ARTechnologies.html";
});


// ==========================================
// 7. FORGOT PASSWORD
// ==========================================

forgotPassword.addEventListener("click", () => {
    showMessage(
        "Password recovery requires a secure backend or email service."
    );
});
