const apiUrl = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2501-ftb-et-web-pt/events";

const postUrl = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/COHORT_CODE/events";
//apiUrl is the endpoint for interacting with the API (full stack convention center), in this case it provides event data/parties.

document.addEventListener("DOMContentLoaded", () => {

    const partyList = document.getElementById("partyList");
    //HTML element where the list of parties will be displayed. 

    const partyForm = document.getElementById("partyForm");
    //partyForm refers to the "form" element and it is used to submit the new party information.
    if (!partyList || !partyForm) {
        console.error("Error: Elements not found. Check your HTML IDs.");
        return;
    }
    //fetchParties()fetches list of parties from API and updates the display party list
    async function fetchParties() {
        try {
            const response = await fetch(apiUrl);
            //Sends a GET request to the server and retrieves the list of parties.
            const result = await response.json();
            //converts the response const to JSON format
            const parties = result.data;
            //Extracts the list of parties from the "data" property of the result.
            partyList.innerHTML = "";
            //removes all existing elements inside <ul> before more parties can be added.
            parties.forEach(party => {
                const li = document.createElement("li");
                li.innerHTML = //loops through each party and dynamically creates a "li" element, inside the "li" element is the following div: 
                    `<div>
                <strong>${party.name}</strong> - ${party.date} ${party.time} at ${party.location}
                <p>${party.description}</p>
            </div>
        `;
                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete Party";
                deleteButton.addEventListener("click", () => {
                    deleteParty(party.id);
                    li.appendChild(deleteButton);
                    partyList.appendChild(li);
                });
            });
        } catch (error) {
            console.error("Error fetching parties", error);
        }
    }
    async function deleteParty(id) {
        try {
            await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
            fetchParties();
        } catch (error) {
            console.error("Error deleting party", error);
        }
    }
    partyForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newParty = {
            name: document.getElementById("name").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            location: document.getElementById("location").value,
            description: document.getElementById("description").value
        };
        try {
            await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newParty)
            });

            partyForm.reset();
            fetchParties();
        } catch (error) {
            console.error("Error adding party", error);
        }
        });
    fetchParties();
});