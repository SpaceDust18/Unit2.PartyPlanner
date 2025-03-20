//Define API URL
const apiUrl = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-ftb-et-web-pt/events";

//This ensures the scrip runs only after the entire HTML document has been loaded 
document.addEventListener("DOMContentLoaded", () => {

    //partyList is where the party details will be displayed.
    const partyList = document.getElementById("partyList");

    //form to add the new parties
    const partyForm = document.getElementById("partyForm");

//if partyList or partyForm are missing, it will log an error and stop the execution
    if (!partyList || !partyForm) {
        console.error("Error: Elements not found");
        return;
    }

    //Fetches and displays all parties
    async function fetchParties() {
        try {
            const response = await fetch(apiUrl);//sends a GET request to the API
            const result = await response.json();// converts the reponse to json

            console.log("API Response:", result);

            const parties = result.data || [];//declares the variable to store party data, ensures result.data is an array if not it assigns an empty array. 
            partyList.innerHTML = ""; //clears current list to avoid duplicates

            parties.forEach(party => { //loops through each party
                const li = document.createElement("li");//dynamically creates <li> elements
                li.innerHTML = `
                    <div>
                        <strong>${party.name}</strong> - ${new Date(party.date).toLocaleString()} at ${party.location}
                        <p>${party.description}</p>
                    </div>
                `;

                // Creates a delete button, to delete each party
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete Party";
                deleteButton.addEventListener("click", () => deleteParty(party.id));

                // Appends the button and list items <li> to the partyList
                partyList.appendChild(li);
                li.appendChild(deleteButton);
            });
        } catch (error) {
            console.error("Error fetching parties", error);
        }
    }

    // DeleteS a party
    async function deleteParty(id) {
        try {
            await fetch(`${apiUrl}/${id}`, {method: "DELETE"});// sends a DELETE request to the API using the party's id
            fetchParties();//Refreshes the list after deletion
        } catch (error) {
            console.error("Error deleting party", error);
        }
    }

    // Adds a new party
    partyForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const dateInput = document.getElementById("date").value;  // "YYYY-MM-DD"
        const timeInput = document.getElementById("time").value;  // "HH:mm"

        // Convert to ISO-8601 format
        const formattedDateTime = new Date(`${dateInput}T${timeInput}:00`).toISOString();//the "T" in between inputs lets the server know there is a time coming next. 

        //creates a newParty object with four properties, as follows; 
        const newParty = {
            name: document.getElementById("name").value,
            date: formattedDateTime, // Corrected date format, no need for .value as it was converted into a string format
            location: document.getElementById("location").value,
            description: document.getElementById("description").value
        };

        console.log("Sending Party Data:", JSON.stringify(newParty));// stringify converts objects or values into a json string format

        try {
            const response = await fetch(apiUrl, { //sends a POST request to the API
                method: "POST",
                headers: {"Content-Type": "application/json"}, //
                body: JSON.stringify(newParty)// stringify converts objects or values into a json string format
            });

            const responseData = await response.json(); // Extracts the json response from the API
            console.log("API Response:", responseData);

            if (responseData.success) { //if the response is true the party was successfully added, if false there was an error which gets consoled.
                partyForm.reset(); // clears the form 
                fetchParties();  // Refreshes the list of parties
            } else { //API response errors
                console.error("API Error:", responseData.error);
            }
        } catch (error) { //network and/or code errors. 
            console.error("Error adding party", error);
        }
    });

    fetchParties(); //displays all parties 
});