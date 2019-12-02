const postService = {
    load: function(id, limit) {
        let query = '';

        if(id) {
            query = `/${id}`;
        }

        if(limit) {
            query += `?limit=${limit}`;
        }

        return fetch(`./data.json`)
            .then(posts => posts.json())
            .catch(err => console.error(err));
    }
}

export default postService;