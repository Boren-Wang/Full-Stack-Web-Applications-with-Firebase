var firebaseConfig = {
    apiKey: "AIzaSyBJMLvf5TIVzHgJzWbXyx10woqJ2s4wmzE",
    authDomain: "chat-app-5b1d9.firebaseapp.com",
    databaseURL: "https://chat-app-5b1d9.firebaseio.com",
    projectId: "chat-app-5b1d9",
    storageBucket: "chat-app-5b1d9.appspot.com",
    messagingSenderId: "528599532142",
    appId: "1:528599532142:web:50261e9a1c0ff504299c7f",
    measurementId: "G-JKGT1FRR7E"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

// Get the name for the user
if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name

// Change name
document.querySelector('#change-name').addEventListener('click', () => {
    alert("Clicked!")
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})

document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault();
	db.collection("messages")
	.add({
		name: name,
        message: document.querySelector('#message-input').value,
        created: firebase.firestore.Timestamp.now()
	})
	.then(function (docRef) {
		console.log("Document written with ID: ", docRef.id);
		document.querySelector('#message-form').reset()
	})
	.catch(function (error) {
		console.error("Error adding document: ", error);
	});
})

// The real-time listener that Firestore provides is one of its best features. 
// If data changes, the listener knows and refreshes your data on the client. 
// It then updates the DOM without a page refresh. This is why the messages show up in real-time!
db.collection("messages").orderBy("created", "asc").onSnapshot(function(snapshot) {
	document.querySelector('#messages').innerHTML = ""
	snapshot.forEach(function(doc) {
        console.log(doc.data().message)
		var message = document.createElement('div')
		message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`
		document.querySelector('#messages').prepend(message)
	});
});

document.querySelector('#clear').addEventListener('click', () => {
	// Step 1
    db.collection("messages")
    .get()
    .then(function(snapshot) { // Step 2 (if success)
        snapshot.forEach(function(doc) {
            // Step 3
			db.collection("messages").doc(doc.id).delete()
            // Step 4 (if success)
            .then(function() {
				console.log("Document successfully deleted!");
			})
            // Step 4 (if error)
            .catch(function(error) {
				console.error("Error removing document: ", error);
			});
        });
    })
    .catch(function(error) { // Step 2 (if error)
        console.log("Error getting documents: ", error);
    });
})