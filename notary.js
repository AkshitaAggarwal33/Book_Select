// Load a book from the disc 
// Give this function in HTML document where the anchor tag is used to search the book
function loadBook(filename, displayName){
    let currentBook = "";
    let url = "books/" + filename;
    
    // Reset our UI
    document.getElementById("fileName").innerHTML=displayName;
    document.getElementById("searchstat").innerHTML="";
    document.getElementById("keyword").value="";

    // Create a server request to load the book 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url ,true);
    xhr.send();

    // To check when it would be done as we set the asynchronous nature by true value in open command
    xhr.onreadystatechange = function () {
        // readystate tells us that what is going on with this particular request 
        //readystate has values upto 4 
        // readystate is 0 means unsend, 1 means file/document is not open , 2 means recieves the information
        // about the request , 3 means loading the file back, 4 means done
        // status = 200 means the transaction is okay !! 
        if(xhr.readyState == 4 && xhr.status ==200){
            currentBook = xhr.responseText;
            // respoonseText is like give the file I request in the declared variable
            
            getDocStats(currentBook);

            // Regular expression = remove line breaks and carraige returns and replace with the <br> tag
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook ;
            // To do that if I have to change the book and want that when I open the book 
            // It get opened from the top  then there is the function for this below !!
            var elmnt = document.getElementById("fileContent")
            elmnt.scrollTop = 0;
        }
        
    };
}

// get the doc stats 
function getDocStats(fileContent){
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    // This wordArray make a array which stores the words of the document seperated by the space 
    let wordDictionary = {};
    // WordDictionary is a class which contains key as a word and value as a count for that word

    var uncommonWords=[];
    //filter out the uncoomon words 
    uncommonWords=filterStopWords(wordArray);

    // count every word in wordArray
    for(let word in uncommonWords){
        let wordValue = uncommonWords[word];
        if(wordDictionary[wordValue] > 0){
            wordDictionary[wordValue] += 1;
        }
        else{
            wordDictionary[wordValue] = 1;
        }
    }
    // sort the array
    let wordList = sortProprties(wordDictionary);

    // Return the top 5 words 
    var Top5Words = wordList.slice(0,6);

    // return the least 5 words 
    var least5Words = wordList.slice(-6,wordList.length);

    // write the value to the page 
    ULtemplate(Top5Words, document.getElementById("mostUsed"));
    ULtemplate(least5Words, document.getElementById("leastUsed"));

    docLength.innerText = "Document Length : " + text.length;
    wordCount.innerText = "Word Count : " + wordArray.length;

}

function ULtemplate(items,element){
    let rowTemplate = document.getElementById('tempalte-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultHTML ="";

    for(i=0; i < items.length-1; i++){
        resultHTML += templateHTML.replace('{{val}}' , items[i][0] + " : " + items[i][1] + "time(s)");
    }
    element.innerHTML = resultHTML;
}

function sortProprties(obj){
    // convert object into array
    let rtnArray = Object.entries(obj);

    // Sort the Array
    rtnArray.sort(function(first,second){
        return second[1]-first[1];
    });
    return rtnArray;
}


function filterStopWords(wordArray){
    var commonWords=getstopWords();
    var commonObj = {};
    var uncommonArray = [];
    for(i = 0; i<commonWords.length; i++){
        commonObj[commonWords[i].trim()] = true;
    }
    for(i=0; i<wordArray.length; i++){
        word = wordArray[i].trim().toLowerCase();
        if(!commonObj[word]){
            uncommonArray.push(word);
        }
    }
    return uncommonArray;
}

// List of stop words that we dont want to include in stats 
function getstopWords(){
    return["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

// Highlight the words in search
// give this function where the seach button is defined in html document 
function performMark(){
    // read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent ="";

    // find all the currently marked items 
    var spans = document.querySelectorAll('mark');

    for(var i=0; i<spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }
    var re= RegExp(keyword, "gi");
    // gi means globally case insensitive 
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;
    // add the mark element to the book content 
    newContent = bookContent.replace(re,replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "Found " + count + " matches";
    if(count>0){
        var element =document.getElementById("markme");
        element.scrollIntoView();
    };

}
