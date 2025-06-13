// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCITBzgW74LCryOdr1P5YzdmbeQ89Myxx0",
  authDomain: "studio-mo8jg.firebaseapp.com",
  projectId: "studio-mo8jg",
  storageBucket: "studio-mo8jg.firebasestorage.app",
  messagingSenderId: "498661937366",
  appId: "1:498661937366:web:97621e57bbc291e21a7977"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = document.getElementById('email-or-username').value;
    const password = document.getElementById('password').value;

    try {
      let email;

      // Check if the input is an email or username
      if (input.includes('@')) {
        email = input; // Input is an email
      } else {
        // Input is a username, query Firestore to find the corresponding email
        const userQuery = query(collection(db, "users"), where("username", "==", input));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email; // Get the email associated with the username
        } else {
          const msg = "Username not found. Please check your username or email.";
          alert(msg);
          speak(msg);
          return;
        }
      }

      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert(`Welcome back, ${user.email}!`);
      // Redirect to the dashboard or home page
      window.location.href = 'dashboard.html'; // Change this to your desired page
    } catch (error) {
      console.error("Error signing in: ", error);
      const msg = "Incorrect password. Please try again.";
      alert(msg);
      speak(msg);
    }
  });

  // Redirect to signup page
  const createAccountLink = document.getElementById('create-account');
  createAccountLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'signup.html'; // Redirect to signup page
  });
});

function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'en-US'; // Set the language to English
  window.speechSynthesis.speak(utterance);
}
