import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDn9jkWO6WfJZCqxKX5HYaXyfyTW-BvEc",
  authDomain: "my-manager-app-e5332.firebaseapp.com",
  databaseURL: "https://my-manager-app-e5332-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-manager-app-e5332",
  storageBucket: "my-manager-app-e5332.firebasestorage.app",
  messagingSenderId: "659836183670",
  appId: "1:659836183670:web:0339f91ac0bc2d3ef72b57",
  measurementId: "G-DG6WEV0JBJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// পেজ টগল ফাংশন
window.toggleAuth = () => {
    const reg = document.getElementById('reg-card');
    const login = document.getElementById('login-card');
    reg.style.display = reg.style.display === 'none' ? 'block' : 'none';
    login.style.display = login.style.display === 'none' ? 'block' : 'none';
};

// রেজিস্ট্রেশন লজিক (Realtime Database ব্যবহার করে)
document.getElementById('reg-btn').addEventListener('click', async () => {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    if(!user || !pass) return alert("ইউজারনেম এবং পাসওয়ার্ড দিন!");

    document.getElementById('reg-card').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, `users/${user}`));
        if (snapshot.exists()) {
            alert("এই ইউজারনেমটি আগে কেউ নিয়েছে!");
            document.getElementById('loader').style.display = 'none';
            document.getElementById('reg-card').style.display = 'block';
        } else {
            await set(ref(db, 'users/' + user), {
                username: user,
                password: pass
            });
            localStorage.setItem("activeUser", user);
            alert("সফলভাবে একাউন্ট তৈরি হয়েছে!");
            location.reload();
        }
    } catch (e) { alert("Error: " + e.message); }
});

// লগইন লজিক
document.getElementById('login-btn').addEventListener('click', async () => {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, `users/${user}`));
        if (snapshot.exists() && snapshot.val().password === pass) {
            localStorage.setItem("activeUser", user);
            alert("লগইন সফল!");
            // এখান থেকে স্প্ল্যাশ স্ক্রিনে যাবে
        } else {
            alert("ইউজারনেম অথবা পাসওয়ার্ড ভুল!");
        }
    } catch (e) { alert("Error: " + e.message); }
});

// চেক: অলরেডি লগইন কি না
if(localStorage.getItem("activeUser")) {
    document.getElementById('auth-container').innerHTML = "<h2 class='vibe-text'>Logging you in...</h2>";
}
