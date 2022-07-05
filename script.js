// Player Object
class player {
    constructor(name, position, rating) {
        this.name = name;
        this.position = position;
        this.rating = rating;
    }
}

// Player Positions Array
const positions = ['GK','DEF','MID','ATT']

// List of pre-loaded player data.
const DefaultPlayers = [
    new player("Yoosuf Haffejee", positions[3], 5),
    new player("Luqmaan Haffejee", positions[1], 4),
    new player("Muhammad Haffejee", positions[1], 3),
    new player("Ahmed Haffejee", positions[3], 3),
    new player("Ar Chothia", positions[2], 5),
    new player("Mumu Chothia", positions[2], 4),
    new player("Eesa Chothia", positions[3], 4),
    new player("Usaamah Chothia", positions[0], 5),
    new player("Shezaad Khan", positions[1], 3),
    new player("Momo Khan", positions[2], 4),
    new player("Dadz Wadee", positions[1], 5),
    new player("Mutasim Haffejee", positions[1], 3),
    new player("Ash Bulbulia", positions[3], 3),
    new player("Zak Limbada", positions[0], 3),
    new player("Boom", positions[1], 3),
    new player("Wadeson", positions[2], 3)
];

// List of all players
var players = [];

const tbody = document.getElementById("MainTableBody");
const table = document.getElementById("MainTable");

// Team 1 Table
const T1 = document.getElementById("Team1");
// Team 2 Table
const T2 = document.getElementById("Team2");
// Team 1 Table Body
const T1B = document.getElementById("Team1Body");
// Team 2 Table Body
const T2B = document.getElementById("Team2Body");

// Team Arrays
var Team1 = [];
var Team2 = [];

// Helper Variables
var TotalRating = 0;
var Team1Count = 0;
var Team2Count = 0;
var Team1Rating = 0;
var Team2Rating = 0;

// Represents the available indexes of the positions array
var posIndexes;
var Index;

// Switch List
Team1PlayerSwitch = [];

// ***CRUD START*** //

// Create
function Add() {

    var name = document.getElementById("name").value;
    var position = document.getElementById("position").value;
    var rating = document.getElementById("rating").value;
    
    // Check if a valid position was entered
    if (positions.includes(position)) {

        // Name and Rating should not be blank
        if(name == "" || rating == "")
        {
        	return;
        }
        
        let p = new player(name, position, rating);
        
        // Only add if the player name is unused
        if(CheckDuplicate(players, player) == false)
        {
        	players.push(p);
        }
        
        // Add a new row with player entry
        tbody.innerHTML += `
    	<tr>
          <td>${name}</td>
          <td>${position}</td>
          <td>${rating}</td>
          <td><a><i style="color: red" class="fa fa-trash"></i></a></td>
    	</tr>
    	`;
    }

    ClearForm();
}

// Read
function Load() {
    // Add the pre-loaded data to the player list
    DefaultPlayers.forEach(player => {
    	if(CheckDuplicate(players, player) == false)
    	{
    		players.push(player);
    	}
    });

    DrawMainTable(players, tbody);
}

// Update
// TODO


// Delete
function Delete(e) {

    // Get the name of the player to remove
    var name = e.path[3].children[0].innerText;

    // Ensure the delete button was clicked, by returning if the class was not found
    if (!e.target.classList.contains("fa-trash") && !e.target.style.color == "green") {
        return;
    }

    // Find the index of the player to remove
    var index = players.findIndex(player => {
        return player.name === name;
    });

    // Remove the player at given index, if valid index is found
    if (index !== -1) {
        players.splice(index, 1);
    }

    // Get button instance
    const btn = e.target;
    // Remove the nearest row
    btn.closest("tr").remove();

    // *We could redraw the entire table instead, but it is less efficient
}

// Switch
function Switch(e) {

    // Ensure the switch button was clicked, by returning if the class was not found
    if (!e.target.classList.contains("fa-sync")) {
        return;
    }
    
    // Get the name of the player to switch
    var name = e.path[3].children[0].innerText;

    // Get the table ID to know where to search for player
    var id = e.path[6].id;

    if(id = "Team1")
    {
        // Find the player to remove
        let p = Team1.find((player) => player.name == name);
        Team1PlayerSwitch.push(p);
    }
    
    if(id = "Team2")
    {
        // Find the player to remove
        let p = Team2.find((player) => player.name == name);
        Team2PlayerSwitch.push(p);
    }

    if(Team1PlayerSwitch != null && Team2PlayerSwitch != null)
    {
        console.log("T1", Team1PlayerSwitch);
        console.log("T2", Team2PlayerSwitch);
        swap(Team1, Team2, Team1PlayerSwitch, Team2PlayerSwitch);
        
        // Clear Switch Lits
        Team1PlayerSwitch = [];
        Team2PlayerSwitch = [];

        // Repaint
        DrawTeamTable(Team1, T1B, Team1.length, Team1Rating);
        DrawTeamTable(Team2, T2B, Team2.length, Team2Rating);
    }
    else
    {
        if (e.target.classList.contains("fa-sync")) {
            e.target.style.color = "grey";
        }
    }
}

// ***CRUD END*** //

function Split() {
	
	ResetTeams();
	
    gk = new Array();
    def = new Array();
    mid = new Array();
    att = new Array();

    // Random between (0-1) * 2 is either 1 or 2 rounded
    var coinFlip = Math.floor(Math.random() * 2);
    var picker;

    if (coinFlip === 1) {
        picker = "Team1";
    }
    else {
        picker = "Team2";
    }

    // Split players into groups by position
    players.forEach(player => {
        if (player.position == "GK") {
            gk.push(player);
        }

        if (player.position == "DEF") {
            def.push(player);
        }

        if (player.position == "MID") {
            mid.push(player);
        }

        if (player.position == "ATT") {
            att.push(player);
        }
    });
    
    // Pick GK
    PickPlayers(gk, picker);
    // Pick DEF
    PickPlayers(def, picker);
    // Pick MID
    PickPlayers(mid, picker);
    // Pick ATT
    PickPlayers(att, picker);

    // Count the number of players in each team
    Team1Count = Team1.length;
    Team2Count = Team2.length;
    
    // Calculate the rating of each team
    Team1Rating = CalculateRating(Team1);
    Team2Rating = CalculateRating(Team2);
    
    // Show the resultant tables
    T1.hidden = false;
    T2.hidden = false;
    
    // Display
    DrawTeamTable(Team1, T1B, Team1Count, Team1Rating);
    DrawTeamTable(Team2, T2B, Team2Count, Team2Rating);
}

function Balance()
{
	if(Team1Rating == Team2Rating)
	{
		return;
	}
	
	var diff;
	var T1GK = [], T1D = [], T1M = [], T1A = [], T2GK = [], T2D = [], T2M = [], T2A = [];
	
	PlayersPerPosition(Team1, 'GK', T1GK);
	PlayersPerPosition(Team1, 'DEF', T1D);
	PlayersPerPosition(Team1, 'MID', T1M);
	PlayersPerPosition(Team1, 'ATT', T1A);
	
	PlayersPerPosition(Team2, 'GK', T2GK);
	PlayersPerPosition(Team2, 'DEF', T2D);
	PlayersPerPosition(Team2, 'MID', T2M);
	PlayersPerPosition(Team2, 'ATT', T2A);
	
  var randomPositionSelector;
  var shortfall;

  diff = Math.abs(Team1Rating - Team2Rating);

  if (diff % 2 == 0) {
    shortfall = diff / 2;
  }
  else {
    shortfall = Math.round(diff / 2);
  }

  var whileCount = 0;
  posIndexes = [0, 1, 2, 3];
  
    while (posIndexes.length > 0) {

        whileCount++;
        
        // Randomly selects the pos the check for a swap, this is to ensure teams will not always be same.
        randomPositionSelector = Math.floor(Math.random() * posIndexes.length);
        
        // Find the index to remove from array of position indexes (e.g GK will not be checked again), -1 due to length
        index = posIndexes[randomPositionSelector - 1];
        posIndexes.splice(index, 1);
        
        // One of these would run depending on the posIndex
        FindPlayersToSwap(T1GK, T2GK, 'GK', shortfall);
        FindPlayersToSwap(T1D, T2D, 'DEF', shortfall);
        FindPlayersToSwap(T1M, T2M, 'MID', shortfall);
        FindPlayersToSwap(T1A, T2A, 'ATT', shortfall);
        
        Team1Count = Team1.length;
        Team2Count = Team2.length;
        
        DrawTeamTable(Team1, T1B, Team1Count, Team1Rating);
        DrawTeamTable(Team2, T2B, Team2Count, Team2Rating);
    }
}

// ***HELPERS START*** //

function ResetTeams()
{
    Team1 = [];
    Team2 = [];

    Team1Count = 0;
    Team2Count = 0;
    Team1Rating = 0;
    Team2Rating = 0;
}

function ClearTable(TableBody)
{
	TableBody.innerHTML = "";
}

function CalculateTotalRating()
{
	players.forEach(player => {
		TotalRating += player.rating;
	});
}

function FindPlayersToSwap(PositionArray1, PositionArray2, Position, Shortfall)
{
	if (positions[index] == Position) 
	{
		// Sorting might make finding a match quicker
		PositionArray1.sort(sortByRating);
        PositionArray2.sort(sortByRating);

        for (let i = 0; i < PositionArray1.length; i++) {
            for (let j = 0; j < PositionArray2.length; j++) {

                if (Math.abs(PositionArray1[i].rating - PositionArray2[j].rating) <= Shortfall && ValidSwap(Team1, Team2, PositionArray1[i], PositionArray2[j])) {
                	
                    console.log("swapping", PositionArray1[i], PositionArray2[j]);
                    // Swap players
                    swap(Team1, Team2, PositionArray1[i], PositionArray2[j]);
                    // Break While (Do not check for valid swaps in other positions)
                    if(Math.abs(PositionArray1[i].rating - PositionArray2[j].rating) == Shortfall)
                    {
                        posIndexes = [];
                    }
                    // Break out of loop
                    return;
                }
            }
        }
    }
}

function PlayersPerPosition(Team, Position, PositionArray)
{
	Team.forEach(player => {
		if(player.position == Position)
		{
			PositionArray.push(player);
		}
	});
}

function PickPlayers(PositionArray, CurrentPicker)
{
	// Store the origanl array length so it does not change when we remove elements
	let length = PositionArray.length;
	
	for (let i = 0; i < length; i++) {

        var random = Math.floor(Math.random() * PositionArray.length);
        var selectedPlayer = PositionArray[random];

        if (CurrentPicker === "Team1") {
            Team1.push(selectedPlayer);
            CurrentPicker = "Team2";
        }
        else {
            Team2.push(selectedPlayer);
            CurrentPicker = "Team1"
        }

        var PlayerIndex = PositionArray.findIndex(p => {
            return p.name === selectedPlayer.name;
        });

        PositionArray.splice(PlayerIndex, 1)
    }
}

function CalculateRating(Team)
{
	let rating = 0;
    Team.forEach(player => {
    	rating += parseInt(player.rating);
    });
    
    return rating;
}
    
function DrawMainTable(players, Table) {
	
	ClearTable(Table);
	
    // Iterate player list
    players.forEach(player => {
        // Create a new row entry
        Table.innerHTML += `
            <tr>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td>${player.rating}</td>
                <td><a><i style="color: red" class="fa fa-trash"></i></a></td>
            </tr>
        `;
    });
}

function DrawTeamTable(Team, Table, Count, Rating) {
	
	ClearTable(Table);
	
    // Iterate player list
    Team.forEach(player => {
        
        // Create a new row entry
        Table.innerHTML += `
		<tr>
    		<td>${player.name}</td>
    		<td>${player.position}</td>
    		<td>${player.rating}</td>
            <td><a><i style="color: green" class="fa fa-sync"></i></a></td>
		</tr>
		`;
    });
    
    Table.innerHTML += `
	<tr>
      <td><b> Count: ${Count} </b></td>
      <td></td>
      <td> <b>${Rating}</b> </td>
      <td></td>
	</tr>
	`;
}

function ClearForm() {
    const name = document.getElementById("name");
    const position = document.getElementById("position");
    const rating = document.getElementById("rating");

    name.value = "";
    position.value = "";
    rating.value = "";
}

const sortByRating = (a, b) => {
    if (a.rating < b.rating) {
        return -1
    }

    if (a.apples > b.apples) {
        return 1
    }

    return 0
}

function swap(Team1, Team2, Player1, Player2)
{
    var Player1Index = Team1.findIndex(object => {
        return object.name === Player1.name;
    });

    var Player2Index = Team2.findIndex(object => {
        return object.name === Player2.name;
    });

    Team1.push(Team2[Player2Index]);
    Team2.push(Team1[Player1Index]);

    if (Player1Index !== -1) {
        Team1.splice(Player1Index, 1);
    }

    if (Player2Index !== -1) {
        Team2.splice(Player2Index, 1);
    }

    Team1Rating = CalculateRating(Team1);
    Team2Rating = CalculateRating(Team2);
}

function ValidSwap(Team1, Team2, Player1, Player2)
{
    tmp1 = [];
    Team1.forEach(element => {
        tmp1.push(element);
    });

    tmp2 = [];
    Team2.forEach(element => {
        tmp2.push(element);
    });

    let tmp1Rating = 0;
    let tmp2Rating = 0;

    var Player1Index = tmp1.findIndex(object => {
        return object.name === Player1.name;
    });

    var Player2Index = tmp2.findIndex(object => {
        return object.name === Player2.name;
    });

    tmp1.push(tmp2[Player2Index]);
    tmp2.push(tmp1[Player1Index]);

    if (Player1Index !== -1) {
        tmp1.splice(Player1Index, 1);
    }

    if (Player2Index !== -1) {
        tmp2.splice(Player2Index, 1);
    }

    tmp1.forEach(element => {
        tmp1Rating += element.rating;
    });

    tmp2.forEach(element => {
        tmp2Rating += element.rating;
    });

    let newRating = Math.abs(tmp1Rating - tmp2Rating);
    let oldRating = Math.abs(Team1Rating - Team2Rating);
    
    if(oldRating <= newRating)
    {
        console.log("Invalid");
        return false;
    }
    else
    {
        console.log("Valid");
        return true;
    }
}

function CheckDuplicate(Team, Player)
{
	let exists = Team.find((player) => player.name == Player.name);
	if(exists)
	{
		return true;
	}
	else
	{
		return false;
	}
}

// ***HELPERS END*** //

// Event Listeners
table.addEventListener("click", Delete);
T1.addEventListener("click", Switch);
T2.addEventListener("click", Switch);