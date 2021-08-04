function subscribe(email) {
    axios.request({
            method: "get",
            url: "/Splitter/EmailSubscribeServlet",
            params: {
                email: String(email)
            }
        }
    )
};