// Import FirebaseAuth and firebase.
import React, { Fragment, useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import ReactiveButton from 'reactive-button';

// Configure Firebase.
const config = {
  apiKey: '',
  authDomain: '',
  // ...
};
firebase.initializeApp(config);

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        console.log(user && (await user.getIdToken()));
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  return (
    <div>
      {isSignedIn ? (
        <Fragment>
          <h1>My App</h1>
          <p>
            Welcome {firebase.auth().currentUser.displayName}! You are now
            signed-in!
          </p>
          <ReactiveButton
            idleText={'Sign-out'}
            onClick={() => firebase.auth().signOut()}
          />
        </Fragment>
      ) : (
        <Fragment>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth
            uiConfig={{
              // Popup signin flow rather than redirect flow.
              signInFlow: 'popup',
              // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
              signInSuccessUrl: '/signedIn',
              // We will display Google and Facebook as auth providers.
              signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.PhoneAuthProvider.PROVIDER_ID,
              ],
              callbacks: {
                // Avoid redirects after sign-in.
                signInSuccessWithAuthResult: () => false,
              },
            }}
            firebaseAuth={firebase.auth()}
          />
        </Fragment>
      )}
    </div>
  );
}

export default App;
