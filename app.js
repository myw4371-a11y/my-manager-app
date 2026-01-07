import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";

// আপনার দেওয়া Firebase কনফিগারেশন
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
console.log("Firebase Connected!");

// সার্ভিস ওয়ার্কার রেজিস্টার করা (অফলাইনের জন্য)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// অ্যাপের মেইন কন্টেনার লোড করা
document.getElementById('app-container').innerHTML = "<h1>Firebase Connected & App is Ready!</h1>";
