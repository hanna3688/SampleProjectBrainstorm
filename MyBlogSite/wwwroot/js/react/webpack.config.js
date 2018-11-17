
module.exports = {
    context: __dirname,
    entry: {
        app: './app.js',
        brainstorm: './brainstorm.js',
        boardTable: './boardtable.js',
        mindmap: './mindmap.js',
        blogEntry: './blogEntry.js',
        postBlog: './PostBlog.js',
        manageBlogs: './ManageBlogs.js',
        homePage: './Home.js'
    },
    output:
        {
            path: __dirname + "/dist",
            filename: "[name].bundle.js"
        },
    watch: true,
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env', 'babel-preset-react']
                    }
                }
            }
        ]
    }
}