// 32 Teams in WorldCup
// One array with Teams
// One arrary Boolean

// //will always be bottom two
// var Teams = new Array(33);
// var Selected = new Array(33);


function saveData() {
  var numPlayers = document.getElementById('numPlayers').value;
  var numTeamsPerPlayer = document.getElementById('numTeamsPerPlayer').value;


  if (numPlayers * numTeamsPerPlayer > 32) {
    alert('Please enter correct numbers');
  } else {
    displayInputs(numPlayers);
  }
}
function createTeams() {
  var numPlayers = document.getElementById('numPlayers').value;
  var numTeamsPerPlayer = document.getElementById('numTeamsPerPlayer').value;

  randomiseTeams(numPlayers, numTeamsPerPlayer);
  createTable();
  players = JSON.stringify(players);
  console.log(players);
 
  $('#subBtnArea').append('<button class="btn btn-lg btn-primary" id="subBtn" type = "submit">Save Selection</button>');

  //players = players[0].name;
  // players = JSON.stringify(players);
  // console.log(players);


  $('.form').append("<input type='hidden'  name='players' value = " + players + ">");
}


var Teams = [
  'Egypt',     'Morocco', 'Nigeria',   'Senegal',        'Tunisia',
  'Australia', 'Iran',    'Japan',     'South-Korea',    'Saudi-Arabia',
  'Belgium',   'Croatia', 'Denmark',   'England',        'France',
  'Germany',   'Iceland', 'Poland',    'Portugal',       'Russia',
  'Serbia',    'Spain',   'Sweden',    'Switzerland',    'Costa-Rica',
  'Mexico',    'Panama',  'Argentina', 'Brazil',         'Colombia',
  'Peru',      'Uruguay'
];

var flags = [
  '/img/egy.png', '/img/mar.png', '/img/nga.png', '/img/sen.png',
  '/img/tun.png', '/img/aus.png', '/img/irn.png', '/img/jpn.png',
  '/img/kor.png', '/img/ksa.png', '/img/bel.png', '/img/cro.png',
  '/img/den.png', '/img/eng.png', '/img/fra.png', '/img/ger.png',
  '/img/isl.png', '/img/pol.png', '/img/por.png', '/img/rus.png',
  '/img/srb.png', '/img/esp.png', '/img/swe.png', '/img/sui.png',
  '/img/crc.png', '/img/mex.png', '/img/pan.png', '/img/arg.png',
  '/img/bra.png', '/img/col.png', '/img/per.png', '/img/uru.png'
];
var Selected = new Array(40);

for (var i = 0; i < Teams.length; i++) {
  Selected[i] = false;
}



var players = new Array();  // create array of players...no fixed size but could use
                  // length given from numPlayres from form if wanted


players.push({
  'name': '',
  'team': [],
  'flag': []
})  // Teams array has no name as each person's array has to be unique



function displayInputs(numPlayers) {
  $('#inSection').empty();

for(var i = 0; i < numPlayers; i++) {

$('#inSection').append ("<input class='form-control' type='text' name = player[ " + i + "] id = player" + i + " placeholder='Enter Name for Player "+(i+1)+"'>");
}
$('#inSection').append ("<button type='button' class='btn btn-primary' onclick='createTeams()'>Create Teams</button>");


}

function randomiseTeams( numPlayers, numTeamsPerPlayer) {  // just a test function but will use this
                                      // style of object for final version
  for (var i = 0; i < numPlayers; i++) {
    if(i !== 0) {

    
    players.push( {"name": "", "team": [], "flag": []}  );
    }
    console.log(document.getElementById('player' + i).value);
    players[i].name = document.getElementById('player' + i).value;  // name the current player


    for (var j = 0; j < numTeamsPerPlayer; j++) {
      getTeam(players, i, j);
      


}



}

console.log(players);


}



function getRandomNumber() {
  var num = Math.floor((Math.random() * 32));
  return num;
}

function getTeam(players, i, j) {
  var num = getRandomNumber();
  if (Selected[num] == false) {  // has not been picked before


    Selected[num] = true;  // that team chosen
    players[i].team[j] = Teams[num];
    players[i].flag[j] = flags[num];


  } else {
    getTeam(players, i, j);
  }
}

function createTable() {
  var numPlayers = document.getElementById('numPlayers').value;
  var numTeamsPerPlayer = document.getElementById('numTeamsPerPlayer').value;
  $('#displayTable').empty();
  var theTable = '';

  for (var i = 0; i < numPlayers; i++) {
    theTable += ' <tr> <td> ' + players[i].name + ' </td> ';


    for (var j = 0; j < numTeamsPerPlayer; j++) {
      theTable += '<td> <img src=' + players[i].flag[j] + '>  ' + players[i].team[j] + '<td>';
    }
  }
  $('#displayTable').append(
      '<thead class="thead-dark">'+
        '<tr>' +
          '<th>Player</th>' +
          '<th>Team</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody> ' + 
        theTable + 
      '</tbody>'
    );
}
