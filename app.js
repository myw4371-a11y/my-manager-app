import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDn9jkWO6WfJZCqxKX5HYaXyfyTW-BvEc",
  authDomain: "my-manager-app-e5332.firebaseapp.com",
  projectId: "my-manager-app-e5332",
  storageBucket: "my-manager-app-e5332.firebasestorage.app",
  messagingSenderId: "659836183670",
  appId: "1:659836183670:web:0339f91ac0bc2d3ef72b57"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// লগইন/রেজিস্ট্রেশন পেজ বদলানো
window.toggleAuth = () => {
    const reg = document.getElementById('reg-card');
    const login = document.getElementById('login-card');
    reg.style.display = reg.style.display === 'none' ? 'block' : 'none';
    login.style.display = login.style.display === 'none' ? 'block' : 'none';
};

// রেজিস্ট্রেশন লজিক (ইউনিক ইউজারনেম চেক সহ)
document.getElementById('reg-btn').addEventListener('click', async () => {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    if(!user || !pass) return alert("দয়া করে ইউজারনেম এবং পাসওয়ার্ড লিখুন!");

    document.getElementById('reg-card').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    try {
        const userRef = doc(db, "users", user);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            alert("এই ইউজারনেমটি আগে কেউ নিয়েছে!");
            document.getElementById('loader').style.display = 'none';
            document.getElementById('reg-card').style.display = 'block';
        } else {
            await setDoc(doc(db, "users", user), { username: user, password: pass });
            localStorage.setItem("activeUser", user); // অটো লগইন সেভ
            alert("সফলভাবে একাউন্ট তৈরি হয়েছে!");
            location.reload(); 
        }
    } catch (e) { alert("Error: " + e.message); }
});

// লগইন লজিক
document.getElementById('login-btn').addEventListener('click', async () => {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    try {
        const userRef = doc(db, "users", user);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().password === pass) {
            localStorage.setItem("activeUser", user);
            alert("লগইন সফল!");
            // এখান থেকে স্প্ল্যাশ স্ক্রিনে যাবে
        } else {
            alert("ইউজারনেম অথবা পাসওয়ার্ড ভুল!");
        }
    } catch (e) { alert("Error: " + e.message); }
});

// আগে লগইন করা থাকলে চেক
if(localStorage.getItem("activeUser")) {
    document.getElementById('auth-container').innerHTML = "<h2 class='vibe-text'>Logging you in...</h2>";
    // সরাসরি মেইন পেজে পাঠানোর কোড পরে দেব
}
