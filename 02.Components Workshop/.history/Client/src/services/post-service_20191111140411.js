const postService = {
    load: function(id) {
        let query = '';

        if(id) {
            query = `/${id}`;
        }

        return fetch(`https://jsonplaceholder.typicode.com/posts${query}`)
            .then(posts => posts.json())
            .catch(err => console.error(err));
    }
}

export default postService;