/*************/
/*  GLOBALS  */
/*************/
// Override the default timeout interval for Jasmine
jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

// Get a reference to a random demo Firebase
var demoFirebaseUrl = "https://" + generateRandomString() + ".firebaseio-demo.com";

// React test addon
var ReactTestUtils = React.addons.TestUtils;

// Define examples of valid and invalid parameters
var invalidFirebaseRefs = [null, undefined, true, false, [], {}, 0, 5, "", "a", {a:1}, ["hi", 1]];
var validBindVars = ["a", "testing", "(e@Xi:4t>*E2)hc<5oa:1s6{B0d?u", Array(743).join("a")];
var invalidBindVars = ["", 1, true, false, [], {}, [1, 2], {a: 1}, null, undefined, "te.st", "te$st", "te[st", "te]st", "te#st", "te/st", "a#i]$da[s", "te/nst", "te/rst", "te/u0000st", "te/u0015st", "te/007Fst", Array(800).join("a")];

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Helper function which runs before each Jasmine test has started */
function beforeEachHelper(done) {
  // Create a new firebase ref with a new context
  firebaseRef = new Firebase(demoFirebaseUrl, Firebase.Context());

  // Reset the Firebase
  firebaseRef.remove(function() {
    // Create a new firebase ref at a random node
    firebaseRef = firebaseRef.child(generateRandomString());

    done();
  });
}

/* Helper function which runs after each Jasmine test has completed */
function afterEachHelper(done) {
  done();
}

/* Returns a random alphabetic string of variable length */
function generateRandomString() {
  return (Math.random() + 1).toString(36).substring(7);
}

/* Returns the current data in the Firebase */
function getFirebaseData() {
  return new RSVP.Promise(function(resolve, reject) {
    firebaseRef.once("value", function(dataSnapshot) {
      resolve(dataSnapshot.val());
    });
  });
};