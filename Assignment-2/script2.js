// ======= Vanilla JavaScript DOM Manipulation =======

// 1. Change text using innerHTML
document.getElementById("mainHeading").innerHTML = "DOM Manipulation in Action!";

// 2. Change CSS properties
const heading = document.getElementById("mainHeading");
heading.style.color = "blue";
heading.style.position = "relative";
heading.style.left = "10px";

// 3. Change image source after clicking button
document.getElementById("changeImageBtn").addEventListener("click", function() {
    document.getElementById("myImage").src = "https://via.placeholder.com/200x150/ff0000/ffffff";
});

// 4. Add a text node and attach to a parent node
document.getElementById("addTextNodeBtn").addEventListener("click", function() {
    const newText = document.createTextNode(" - This text was added dynamically!");
    document.getElementById("mainHeading").appendChild(newText);
});

// 5. Delete a node
document.getElementById("deleteNodeBtn").addEventListener("click", function() {
    const paragraphs = document.getElementsByClassName("highlight");
    if(paragraphs.length > 0) {
        paragraphs[0].parentNode.removeChild(paragraphs[0]);
    }
});

// 6. Access paragraphs using getElementsByTagName
const allParagraphs = document.getElementsByTagName("p");
console.log("All paragraphs in the page:", allParagraphs);


// ======= jQuery DOM Manipulation =======
$(document).ready(function() {

    // 1. Change button text
    $("#changeTextBtn").text("Heading Text Changed!");

    // 2. Set background image
    $("#container").css({
        "background-image": "url('https://via.placeholder.com/400x200')",
        "background-size": "cover"
    });

    // 3. Access HTML form data
    $("#submitForm").click(function() {
        const name = $("#name").val();
        const email = $("#email").val();
        alert("Name: " + name + "\nEmail: " + email);
    });

    // 4. Add attribute using jQuery
    $("#myImage").attr("title", "This is a dynamic image");
});
