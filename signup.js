// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const email = emailInput.value;
    const password = document.getElementById('password').value;

    try {
      // Check if user already exists
      const userQuery = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // User already exists
        const existingUser = querySnapshot.docs[0].data();
        const msg = `Details already exist. You're welcome, ${existingUser.username}. Please log in.`;
        alert(msg);
        speak(msg);
        return;
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        username: username,
        email: email
      });

      alert('Account created successfully!');
    } catch (error) {
      console.error("Error creating account: ", error);
      alert(error.message);
    }
  });

  // Real-time feedback for username and email
  usernameInput.addEventListener('input', () => {
    const msg = `You are typing username: ${usernameInput.value}`;
    speak(msg);
  });

  emailInput.addEventListener('input', () => {
    const msg = `You are typing email: ${emailInput.value}`;
    speak(msg);
  });
});

function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  window.speechSynthesis.speak(utterance);
}
