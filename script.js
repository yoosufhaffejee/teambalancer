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
var picker;

const tbody = document.getElementById("MainTableBody");
const edit = document.getElementById("edit");

const name = document.getElementById("name");
const position = document.getElementById("position");
const rating = document.getElementById("rating");

const btnAdd = document.getElementById("add");
const btnUpdate = document.getElementById("update");

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
var Team1PlayerSwitch;
var Team2PlayerSwitch;

// UI Variables
var UpdateIndex;

var UpdateName;
var UpdatePosition;
var UpdateRating;

// ***CRUD START*** //

// Create
function Add() {
    
    // Check if a valid position was entered
    if (positions.includes(position.value)) {

        // Name and Rating should not be blank
        if(name.value == "" || rating.value == "")
        {
        	return;
        }
        
        let p = new player(name.value, position.value, rating.value);
        
        // Only add if the player name is unused
        if(CheckDuplicate(players, p) == false)
        {
        	players.push(p);

            // Add a new row with player entry
            tbody.innerHTML += `
            <tr>
            <td>${name.value}</td>
            <td>${position.value}</td>
            <td>${rating.value}</td>
            <td>
                <a id="edit"><i style="color: gold" class="fa fa-pencil"></i></a>
                <a id="delete"><i style="color: red" class="fa fa-trash"></i></a>
            </td>
            </tr>
            `;

            ClearForm();
        }
    }
}

// Read
function Load() {

    //Add the pre-loaded data to the player list
    DefaultPlayers.forEach(player => {
    	if(CheckDuplicate(players, player) == false)
    	{
    		players.push(player);
    	}
    });

    DrawMainTable(players, tbody);
}

function TestLoad(multiplier)
{
    for(let i = 0; i < multiplier; i++)
    {
        DefaultPlayers.forEach(player => {
            players.push(player);
        });
    }

    DrawMainTable(players, tbody);
}

// Update
function Edit(e) {

    // Get the name of the player to update
    UpdateName = e.originalEvent.path[3].children[0];
    UpdatePosition = e.originalEvent.path[3].children[1];
    UpdateRating = e.originalEvent.path[3].children[2];

    // Ensure the edit button was clicked, by returning if the class was not found
    if (!e.target.classList.contains("fa-pencil")) {
        return;
    }

    btnAdd.hidden = true;
    btnUpdate.hidden = false;

    name.value = UpdateName.innerHTML;
    position.value = UpdatePosition.innerHTML;
    rating.value = UpdateRating.innerHTML;

    // Find the index of the player to update
    UpdateIndex = players.findIndex(player => {
        return player.name === UpdateName.innerHTML;
    });
}

function Update()
{
	// Check for blank and duplicate player entire object (If only name is checked, update rating/pos only is not possible)
	let validName = (name.checkValidity() && (CheckDuplicatePlayer(players, players[UpdateIndex]) == false));
	// Valid pos
	let validPosition = ValidPosition(position.value);
	// Must be a number 1 -5
	let validRating = rating.checkValidity();
	
	// Only update if all conditions are met
    if (validName && validPosition && validRating) 
    {
    	// Update player list
    	players[UpdateIndex].name = name.value;
        players[UpdateIndex].position = position.value;
        players[UpdateIndex].rating = rating.value;
        
        // Update HTML
        UpdateName.innerHTML = name.value;
        UpdatePosition.innerHTML = position.value;
        UpdateRating.innerHTML = rating.value;
        
        // Clean up UI
        ClearForm();
        btnAdd.hidden = false;
        btnUpdate.hidden = true;
    }
}

// Delete
function Delete(e) {

    // Get the name of the player to remove
    var name = e.originalEvent.path[3].children[0].innerText;

    // Ensure the delete button was clicked, by returning if the class was not found
    if (!e.target.classList.contains("fa-trash")) {
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
    
    // Cancel a swap
    if (e.target.style.color == "green")
    {
        e.target.style.color = "gold";

    	if (id = "Team1")
    	{
    		Team1PlayerSwitch = null;
    	}
    	
    	if (id = "Team2")
    	{
    		Team2PlayerSwitch = null;
    	}
    }
    else
    {
        // Only allow one swap player to be selected per table
        let Team1Buttons = $("#Team1Body").find(".fa-sync");
        let Team2Buttons = $("#Team2Body").find(".fa-sync");
        
        Array.from(Team1Buttons).forEach(element => {
            element.style.color = "gold";
        });

        Array.from(Team2Buttons).forEach(element => {
            element.style.color = "gold";
        });

        if (id = "Team1")
        {
            // Find the player to switch
            let player = Team1.find((player) => player.name == name);
            if (player != null)
            {
                Team1PlayerSwitch = player;
            }
        }
        
        if (id = "Team2")
        {
            // Find the player to switch
            let player = Team2.find((player) => player.name == name);
            if (player != null)
            {
                Team2PlayerSwitch = player;
            }
        }

        // Set the button colour green
        e.target.style.color = "green";
    }

    // If there are 2 players to swap, Switch their teams
    if(Team1PlayerSwitch != null && Team2PlayerSwitch != null)
    {
        swap(Team1, Team2, Team1PlayerSwitch, Team2PlayerSwitch);

        // Clear Switch Vars
        Team1PlayerSwitch = null;
        Team2PlayerSwitch = null;

        // Repaint
        DrawTeamTable(Team1, T1B, Team1.length, Team1Rating);
        DrawTeamTable(Team2, T2B, Team2.length, Team2Rating);
    }
}

// ***CRUD END*** //

function Split() {
	
	ResetTeams();
    CalculateTotalRating();
	
    gk = new Array();
    def = new Array();
    mid = new Array();
    att = new Array();

    // Random between (0-1) * 2 is either 1 or 2 rounded
    var coinFlip = Math.floor(Math.random() * 2);
    //var picker;

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
    PickPlayers(gk);
    // Pick DEF
    PickPlayers(def);
    // Pick MID
    PickPlayers(mid);
    // Pick ATT
    PickPlayers(att);

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
    console.log("T1 Old Rating: ", Team1Rating);
    console.log("T2 Old Rating: ", Team2Rating);

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

  var shortfall;
  var randomPositionSelector;

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
        console.log("loop:", whileCount);
        
        // Randomly selects the pos the check for a swap, this is to ensure teams will not always be same.
        randomPositionSelector = Math.floor(Math.random() * posIndexes.length);

        if(whileCount > players.length * 2)
        {
            break;
        }

        // Find the index to check from array of position indexes (e.g GK will not be checked again), -1 due to length
        index = posIndexes[randomPositionSelector - 1];
        
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
    console.log("While Loop Counter: ", whileCount);
    console.log("T1 New Rating: ", Team1Rating);
    console.log("T2 New Rating: ", Team2Rating);
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
		//PositionArray1.sort(sortByRating);
        //PositionArray2.sort(sortByRating);

        for (let i = 0; i < PositionArray1.length; i++) {
            for (let j = 0; j < PositionArray2.length; j++) {

                let Delta = Math.abs(PositionArray1[i].rating - PositionArray2[j].rating);

                if (Delta <= Shortfall && ValidSwap(PositionArray1[i], PositionArray2[j])) {
                	
                    console.log("swapping", PositionArray1[i], PositionArray2[j]);
                    // Swap players
                    swap(Team1, Team2, PositionArray1[i], PositionArray2[j]);
                    // Break While (Do not check for valid swaps in other positions)
                    if(Delta == Shortfall  || (Math.ceil(TotalRating % 2) == 1))
                    {
                        posIndexes = [];
                    }
                    // Break out of loop
                    return;
                }
            }
        }

        // A position will only be removed if all options are exhausted
        posIndexes.splice(index, 1);
        return;
    }
}

function swap(Team1, Team2, Player1, Player2)
{
    var Player1Index = Team1.findIndex(object => {
        return object.name === Player1.name;
    });

    var Player2Index = Team2.findIndex(object => {
        return object.name === Player2.name;
    });

    if (Player1Index !== -1) {
        Team1.push(Team2[Player2Index]);
    }
    
    if (Player2Index !== -1) {
        Team2.push(Team1[Player1Index]);
    }

    if (Player1Index !== -1) {
        Team1.splice(Player1Index, 1);
    }

    if (Player2Index !== -1) {
        Team2.splice(Player2Index, 1);
    }

    Team1Rating = CalculateRating(Team1);
    Team2Rating = CalculateRating(Team2);

    Team1.sort(sortByPosition);
    Team2.sort(sortByPosition);

    return;
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

function PickPlayers(PositionArray)
{
	// Store the origanl array length so it does not change when we remove elements
	let length = PositionArray.length;
	
	for (let i = 0; i < length; i++) {

        var random = Math.floor(Math.random() * PositionArray.length);
        var selectedPlayer = PositionArray[random];

        if (picker === "Team1") {
            Team1.push(selectedPlayer);
            picker = "Team2";
        }
        else {
            Team2.push(selectedPlayer);
            picker = "Team1"
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
                <td>
                    <a id="edit"><i style="color: gold" class="fa fa-pencil"></i></a>
                    <a id="delete"><i style="color: red" class="fa fa-trash"></i></a>
                </td>
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
            <td><a><i style="color: gold" class="fa fa-sync"></i></a></td>
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

function sortByPosition(a, b) {
    var order = { GK: 1, DEF: 2, MID: 3, ATT: 4, default: 5 }

    return (order[a.position] || order.default) - (order[b.position] || order.default);
}

function ValidSwap(Player1, Player2)
{
	let tmp1Rating = 0;
    let tmp2Rating = 0;
    
    tmp1Rating = Team1Rating - Player1.rating + Player2.rating;
    tmp2Rating = Team2Rating - Player2.rating + Player1.rating;
    
    let newRating = Math.abs(tmp1Rating - tmp2Rating);
    let oldRating = Math.abs(Team1Rating - Team2Rating);
    
    if(oldRating <= newRating)
    {
        return false;
    }
    else
    {
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

function CheckDuplicatePlayer(Team, Player)
{
	let exists = Team.find((player) => player.name == Player.name && Player.position == player.position && Player.rating == player.rating);
	if(exists)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function ValidPosition(Pos)
{
	if (positions.includes(Pos))
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
T1.addEventListener("click", Switch);
T2.addEventListener("click", Switch);

// JQuery Listeners for dynamic objects
$(document).on('click','#edit', Edit);
$(document).on('click','#delete', Delete);