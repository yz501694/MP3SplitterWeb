function subscribe(email) {
    axios.request({
            method: "get",
            url: "/Splitter_war_exploded/EmailSubscribeServlet",
            params: {
                email: String(email)
            }
        }
    )
};