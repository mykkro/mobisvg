/**
 *  Returns a random point from region [x1,x2]x[y1,y2].
 */
var randomPoint = function(x1, x2, y1, y2) {
    return {
        x: x1 + Math.random()*(x2-x1),
        y: y1 + Math.random()*(y2-y1)
    }
};


var randomInt = function(max) {
	return Math.floor(Math.random()*max);
};

/**
 *  Returns random item from an array.
 */
var pickRandom = function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
};


/**
 *  Shuffles an array in place.
 */
var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

