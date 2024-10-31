const CLIENT_ID = "1nexv3xl8m30byjofi5stfz7urc2zl";
const REDIRECT_URI = "https://deathbyprograms.github.io/Twitch-OAuth-Testing/";

export const redirect = () => {
    let state = crypto.randomUUID();
    sessionStorage.setItem("state", state);
    location.assign(`https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=chat:read&state=${state}`);
}

async function hasValidStorageToken() {
    const cookie = localStorage.getItem("token");
    if (!cookie) return false;

    const res = await fetch("https://id.twitch.tv/oauth2/validate", {
        "headers": {
            "Authorization": `OAuth ${cookie}`
        }
    }).then((res) => res.json());

    if (res.status === 401) {
        localStorage.removeItem("token");
        return false;
    }
    return true;
}

function intercept() {
    const text_elem = document.getElementById("token");
    if (hasValidStorageToken()) {
        text_elem.innerText = localStorage.getItem("token");
        text_elem.hidden = false;
    } else if (document.location.hash && document.location.hash !== '') {
        text_elem.innerText = "";
        text_elem.hidden = true;
    } else {
        const urlParams = new URLSearchParams(document.location.hash.slice(1));
        if (urlParams.get('access_token')) {
            if (urlParams.get("state") !== sessionStorage.getItem("state")){
                text_elem.innerText = "INVALID STATE"
                text_elem.hidden = false;
            } else {
                text_elem.innerText = `OAuth token: ${urlParams.get('access_token')}`;
                text_elem.hidden = false;
            }
            sessionStorage.removeItem("state");
        } else {
            text_elem.innerText = "INVALID TOKEN"
            text_elem.hidden = false;
        }
    }
}

intercept();