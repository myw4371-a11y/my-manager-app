import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// আপনার Firebase কনফিগারেশন
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

// Firebase শুরু করা
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ১. কাস্টম পপ-আপ মেসেজ ফাংশন (Aesthetic Pop-up)
window.showAlert = (message, type = "error") => {
    // আগের কোনো এলার্ট থাকলে সরিয়ে ফেলা
    const oldAlert = document.querySelector('.custom-alert');
    if (oldAlert) oldAlert.remove();

    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    // টাইপ অনুযায়ী কালার পরিবর্তন (সফল হলে সায়ান, ভুল হলে পিঙ্ক/লাল)
    alertBox.style.background = type === "success" ? "rgba(0, 219, 222, 0.9)" : "rgba(252, 0, 255, 0.9)";
    alertBox.innerText = message;
    document.body.appendChild(alertBox);

    // ৩ সেকেন্ড পর পপ-আপ চলে যাবে
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
};

// ২. পেজ টগল ফাংশন (Login <-> Register)
window.toggleAuth = () => {
    const reg = document.getElementById('reg-card');
    const login = document.getElementById('login-card');
    reg.style.display = reg.style.display === 'none' ? 'block' : 'none';
    login.style.display = login.style.display === 'none' ? 'block' : 'none';
};

// ৩. রেজিস্ট্রেশন লজিক
document.getElementById('reg-btn').addEventListener('click', async () => {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value.trim();

    if(!user || !pass) {
        showAlert("ইউজারনেম এবং পাসওয়ার্ড দিন!");
        return;
    }

    document.getElementById('reg-card').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, `users/${user}`));
        if (snapshot.exists()) {
            showAlert("এই ইউজারনেমটি আগে কেউ নিয়েছে!");
            document.getElementById('loader').style.display = 'none';
            document.getElementById('reg-card').style.display = 'block';
        } else {
            await set(ref(db, 'users/' + user), {
                username: user,
                password: pass
            });
            localStorage.setItem("activeUser", user);
            showAlert("সফলভাবে একাউন্ট তৈরি হয়েছে!", "success");
            setTimeout(() => location.reload(), 1500);
        }
    } catch (e) { 
        showAlert("Error: " + e.message);
        document.getElementById('loader').style.display = 'none';
        document.getElementById('reg-card').style.display = 'block';
    }
});

// ৪. লগইন লজিক
document.getElementById('login-btn').addEventListener('click', async () => {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if(!user || !pass) {
        showAlert("সঠিক তথ্য দিয়ে পূরণ করুন!");
        return;
    }

    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, `users/${user}`));
        if (snapshot.exists() && snapshot.val().password === pass) {
            localStorage.setItem("activeUser", user);
            showAlert("লগইন সফল হয়েছে!", "success");
            // পরে এখানে স্প্ল্যাশ স্ক্রিনের কল যাবে
        } else {
            showAlert("ইউজারনেম অথবা পাসওয়ার্ড ভুল!");
        }
    } catch (e) { showAlert("Error: " + e.message); }
});

// ৫. অটো-লগইন চেক
if(localStorage.getItem("activeUser")) {
    document.getElementById('auth-container').innerHTML = `
        <div class="auth-card">
            <h2 class="vibe-text">স্বাগতম!</h2>
            <p>আপনার একাউন্টে প্রবেশ করা হচ্ছে...</p>
            <div class="spinner"></div>
        </div>
    `;
    // মেইন ড্যাশবোর্ড লোড করার লজিক এখানে আসবে
}
// অটোমেটিক আপডেট এবং রিলোড লজিক
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
        reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    window.location.reload();
                }
            };
        };
    });
}
// স্প্ল্যাশ স্ক্রিন কন্ট্রোল
window.addEventListener('load', () => {
    // অ্যানিমেশন ধাপগুলো শেষ হতে ৫-৬ সেকেন্ড লাগে
    // তারপর ২ সেকেন্ড অতিরিক্ত ওয়েট করবে
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            splash.style.transition = 'opacity 1s ease';
            
            setTimeout(() => {
                splash.remove();
                // এখানে আপনার হোম পেজ বা লগইন পেজ দেখানোর লজিক থাকবে
                const authCont = document.getElementById('auth-container');
                if(authCont) authCont.style.display = 'block';
            }, 1000);
        }
    }, 8000); // মোট ৮ সেকেন্ড (৬ সেকেন্ড অ্যানিমেশন + ২ সেকেন্ড স্থির)
});
