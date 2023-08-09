async function SendHTTPRequest(url, requestMethod, requestBody, requestHeaders){
    let response = await fetch(url, {
        method: requestMethod,
        body: requestBody,
        headers: requestHeaders
    });

    return response;
}

function GrabVideoIDFromLink(input){
    if(input.includes('&')){
        input.substring(0, input.indexOf('&'));
    }
    // https://www.thepoorcoder.com/youtube-url-regex/
    let regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

    if(regex.test(input)){
        return input.match(regex)[1];
    } else return '';
}